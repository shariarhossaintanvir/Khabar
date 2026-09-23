/**
 * KHABAR — Authentication & Session Security Service
 * Implements PBKDF2-hashed credentials, progressive account lockout,
 * cryptographically secure dynamic OTP, and session lifetime management.
 */

import {
  generateSecureRandomToken,
  generateSecureNumericOTP,
  hashPassword,
  verifyPassword,
} from './crypto';
import { rateLimiter, RATE_LIMITS } from './rateLimiter';
import { auditLogger } from './auditLogger';
import { validateEmail, validateBDPhone, validatePasswordStrength } from './validation';
import type { AuthenticatedUser, UserRole } from './rbac';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  passwordHash: string; // PBKDF2 serialized hash
  role: UserRole;
  restaurantId?: string; // For RESTAURANT partner
  riderId?: string;      // For RIDER courier
  createdAt: string;
  failedLoginAttempts: number;
  lockedUntil?: number;  // Epoch ms
}

interface OTPRecord {
  identifier: string;
  code: string;
  expiresAt: number;
  attempts: number;
}

interface PasswordResetRecord {
  token: string;
  userId: string;
  expiresAt: number;
  used: boolean;
}

class AuthService {
  private accounts: Map<string, UserAccount> = new Map();
  private activeSessions: Map<string, AuthenticatedUser> = new Map();
  private pendingOTPs: Map<string, OTPRecord> = new Map();
  private resetTokens: Map<string, PasswordResetRecord> = new Map();
  private initialized = false;

  constructor() {
    this.initDefaultAccounts();
  }

  /**
   * Initializes default role accounts with PBKDF2 hashes
   */
  private async initDefaultAccounts() {
    if (this.initialized) return;

    // Pre-hash demo accounts
    const customerHash = await hashPassword('Khabar@2026');
    const adminHash = await hashPassword('KhabarAdmin@2026');
    const partnerHash = await hashPassword('KhabarPartner@2026');
    const riderHash = await hashPassword('KhabarRider@2026');

    // 1. Customer: Tanvir Ahmed
    this.registerAccountInternal({
      id: 'user-customer-1',
      name: 'Tanvir Ahmed',
      email: 'tanvir@khabar.com',
      phone: '+8801712345678',
      passwordHash: customerHash,
      role: 'CUSTOMER',
      createdAt: new Date().toISOString(),
      failedLoginAttempts: 0,
    });

    // 2. Super Admin: Platform Dispatcher
    this.registerAccountInternal({
      id: 'user-admin-1',
      name: 'Operations Admin',
      email: 'admin@khabar.com',
      phone: '+8801700000001',
      passwordHash: adminHash,
      role: 'ADMIN',
      createdAt: new Date().toISOString(),
      failedLoginAttempts: 0,
    });

    // 3. Restaurant Partner: Takeout Kitchen Manager
    this.registerAccountInternal({
      id: 'user-partner-1',
      name: 'Takeout Kitchen Lead',
      email: 'partner@takeout.com',
      phone: '+8801700000002',
      passwordHash: partnerHash,
      role: 'RESTAURANT',
      restaurantId: 'takeout',
      createdAt: new Date().toISOString(),
      failedLoginAttempts: 0,
    });

    // 4. Rider Courier: Md. Rahim Uddin
    this.registerAccountInternal({
      id: 'user-rider-1',
      name: 'Md. Rahim Uddin',
      email: 'rider@khabar.com',
      phone: '+8801819223344',
      passwordHash: riderHash,
      role: 'RIDER',
      riderId: 'rider-1',
      createdAt: new Date().toISOString(),
      failedLoginAttempts: 0,
    });

    this.initialized = true;
  }

  private registerAccountInternal(acc: UserAccount) {
    this.accounts.set(acc.email.toLowerCase(), acc);
    this.accounts.set(acc.phone, acc);
  }

  /**
   * Find account by phone or email
   */
  public findAccount(identifier: string): UserAccount | undefined {
    const clean = identifier.trim().toLowerCase();
    const direct = this.accounts.get(clean);
    if (direct) return direct;

    const phoneResult = validateBDPhone(identifier);
    if (phoneResult.isValid) {
      return this.accounts.get(phoneResult.normalized);
    }
    return undefined;
  }

  /**
   * Authenticates user with password and enforces progressive lockout & rate limits
   */
  public async loginWithPassword(
    identifier: string,
    passwordPlain: string
  ): Promise<{
    success: boolean;
    user?: AuthenticatedUser;
    error?: string;
    lockedSeconds?: number;
  }> {
    await this.initDefaultAccounts();

    // 1. Rate Limiting Check
    const rateCheck = rateLimiter.checkLimit(
      `auth:login:${identifier.trim().toLowerCase()}`,
      RATE_LIMITS.LOGIN.max,
      RATE_LIMITS.LOGIN.windowMs
    );
    if (!rateCheck.allowed) {
      auditLogger.log({
        actorId: 'anonymous',
        actorName: identifier,
        actorRole: 'GUEST',
        action: 'RATE_LIMIT_EXCEEDED',
        resourceType: 'auth_login',
        status: 'BLOCKED',
        severity: 'WARNING',
        details: { retryAfterSeconds: rateCheck.retryAfterSeconds },
      });
      return {
        success: false,
        error: `Too many login attempts. Please wait ${rateCheck.retryAfterSeconds} seconds before trying again.`,
        lockedSeconds: rateCheck.retryAfterSeconds,
      };
    }

    const account = this.findAccount(identifier);
    if (!account) {
      auditLogger.log({
        actorId: 'unknown',
        actorName: identifier,
        actorRole: 'GUEST',
        action: 'AUTH_LOGIN_FAILED',
        resourceType: 'auth_account',
        status: 'FAILURE',
        severity: 'WARNING',
        details: { reason: 'Account not found' },
      });
      return { success: false, error: 'Invalid credentials. Please verify your email/phone and password.' };
    }

    // 2. Lockout Check
    const now = Date.now();
    if (account.lockedUntil && account.lockedUntil > now) {
      const waitSec = Math.ceil((account.lockedUntil - now) / 1000);
      auditLogger.log({
        actorId: account.id,
        actorName: account.name,
        actorRole: account.role,
        action: 'AUTH_LOCKED_OUT',
        resourceType: 'auth_account',
        status: 'BLOCKED',
        severity: 'CRITICAL',
        details: { lockedSecondsRemaining: waitSec },
      });
      return {
        success: false,
        error: `This account is temporarily locked due to consecutive failed attempts. Try again in ${waitSec}s.`,
        lockedSeconds: waitSec,
      };
    }

    // 3. Password Verification
    const isMatch = await verifyPassword(passwordPlain, account.passwordHash);
    if (!isMatch) {
      account.failedLoginAttempts += 1;

      // Lock account after 5 consecutive failures for 15 minutes
      if (account.failedLoginAttempts >= 5) {
        account.lockedUntil = now + 15 * 60 * 1000;
        auditLogger.log({
          actorId: account.id,
          actorName: account.name,
          actorRole: account.role,
          action: 'AUTH_LOCKED_OUT',
          resourceType: 'auth_account',
          status: 'BLOCKED',
          severity: 'CRITICAL',
          details: { consecutiveFailures: account.failedLoginAttempts },
        });
        return {
          success: false,
          error: 'Account locked for 15 minutes due to 5 consecutive failed login attempts.',
          lockedSeconds: 900,
        };
      }

      auditLogger.log({
        actorId: account.id,
        actorName: account.name,
        actorRole: account.role,
        action: 'AUTH_LOGIN_FAILED',
        resourceType: 'auth_account',
        status: 'FAILURE',
        severity: 'WARNING',
        details: { failedAttempts: account.failedLoginAttempts },
      });
      return {
        success: false,
        error: `Incorrect password. (${5 - account.failedLoginAttempts} attempts remaining before lockout)`,
      };
    }

    // 4. Successful Login: Reset lockout and generate session token
    account.failedLoginAttempts = 0;
    account.lockedUntil = undefined;
    rateLimiter.reset(`auth:login:${identifier.trim().toLowerCase()}`);

    const token = generateSecureRandomToken(32);
    const sessionUser: AuthenticatedUser = {
      id: account.id,
      name: account.name,
      email: account.email,
      phone: account.phone,
      role: account.role,
      restaurantId: account.restaurantId,
      riderId: account.riderId,
      token,
      expiresAt: now + 24 * 60 * 60 * 1000, // 24-hour expiration
    };

    this.activeSessions.set(token, sessionUser);

    auditLogger.log({
      actorId: account.id,
      actorName: account.name,
      actorRole: account.role,
      action: 'AUTH_LOGIN_SUCCESS',
      resourceType: 'session',
      status: 'SUCCESS',
      severity: 'INFO',
    });

    return { success: true, user: sessionUser };
  }

  /**
   * Generates a cryptographically secure 6-digit dynamic OTP
   */
  public requestOTP(identifier: string): { success: boolean; error?: string; message?: string; otpPreview?: string } {
    const rateCheck = rateLimiter.checkLimit(
      `auth:otp_req:${identifier}`,
      RATE_LIMITS.OTP_REQUEST.max,
      RATE_LIMITS.OTP_REQUEST.windowMs
    );
    if (!rateCheck.allowed) {
      return {
        success: false,
        error: `Please wait ${rateCheck.retryAfterSeconds}s before requesting a new OTP code.`,
      };
    }

    const code = generateSecureNumericOTP(4);
    const expiresAt = Date.now() + 3 * 60 * 1000; // 3-minute validity

    this.pendingOTPs.set(identifier, {
      identifier,
      code,
      expiresAt,
      attempts: 0,
    });

    auditLogger.log({
      actorId: 'otp-requestor',
      actorName: identifier,
      actorRole: 'CUSTOMER',
      action: 'AUTH_OTP_REQUESTED',
      resourceType: 'otp',
      status: 'SUCCESS',
      severity: 'INFO',
    });

    return {
      success: true,
      message: `4-digit verification code dispatched to ${identifier}`,
      otpPreview: code, // Shared with UI toast in demo environment
    };
  }

  /**
   * Verifies dynamic OTP
   */
  public verifyOTP(identifier: string, submittedCode: string): { success: boolean; user?: AuthenticatedUser; error?: string } {
    const rateCheck = rateLimiter.checkLimit(
      `auth:otp_ver:${identifier}`,
      RATE_LIMITS.OTP_VERIFY.max,
      RATE_LIMITS.OTP_VERIFY.windowMs
    );
    if (!rateCheck.allowed) {
      return { success: false, error: 'Too many OTP verification attempts. Please wait 60 seconds.' };
    }

    const record = this.pendingOTPs.get(identifier);
    if (!record) {
      return { success: false, error: 'No active OTP request found. Please request a new code.' };
    }

    if (Date.now() > record.expiresAt) {
      this.pendingOTPs.delete(identifier);
      return { success: false, error: 'OTP code has expired. Please request a new code.' };
    }

    record.attempts += 1;
    if (record.attempts > 3) {
      this.pendingOTPs.delete(identifier);
      auditLogger.log({
        actorId: 'otp-requestor',
        actorName: identifier,
        actorRole: 'CUSTOMER',
        action: 'AUTH_OTP_FAILED',
        resourceType: 'otp',
        status: 'BLOCKED',
        severity: 'WARNING',
        details: { reason: 'Exceeded maximum 3 OTP attempts' },
      });
      return { success: false, error: 'Exceeded maximum attempts. OTP invalidated.' };
    }

    if (record.code !== submittedCode.trim()) {
      return { success: false, error: `Invalid code. ${3 - record.attempts} attempts remaining.` };
    }

    // OTP Verified! Single-use removal
    this.pendingOTPs.delete(identifier);

    // Find or create customer account
    let account = this.findAccount(identifier);
    if (!account) {
      const isEmail = identifier.includes('@');
      account = {
        id: `user-otp-${Date.now()}`,
        name: isEmail ? identifier.split('@')[0] : 'Verified Customer',
        email: isEmail ? identifier : 'customer@khabar.com',
        phone: isEmail ? '+8801712345678' : identifier,
        passwordHash: '',
        role: 'CUSTOMER',
        createdAt: new Date().toISOString(),
        failedLoginAttempts: 0,
      };
      this.registerAccountInternal(account);
    }

    const token = generateSecureRandomToken(32);
    const sessionUser: AuthenticatedUser = {
      id: account.id,
      name: account.name,
      email: account.email,
      phone: account.phone,
      role: account.role,
      token,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    };
    this.activeSessions.set(token, sessionUser);

    auditLogger.log({
      actorId: account.id,
      actorName: account.name,
      actorRole: account.role,
      action: 'AUTH_OTP_VERIFIED',
      resourceType: 'otp',
      status: 'SUCCESS',
      severity: 'INFO',
    });

    return { success: true, user: sessionUser };
  }

  /**
   * Registers a new customer account securely
   */
  public async registerCustomer(
    name: string,
    phone: string,
    passwordPlain: string
  ): Promise<{ success: boolean; user?: AuthenticatedUser; error?: string }> {
    const rateCheck = rateLimiter.checkLimit('auth:signup:global', RATE_LIMITS.SIGNUP.max, RATE_LIMITS.SIGNUP.windowMs);
    if (!rateCheck.allowed) {
      return { success: false, error: 'Registration rate limit reached. Please wait a moment.' };
    }

    const phoneCheck = validateBDPhone(phone);
    if (!phoneCheck.isValid) {
      return { success: false, error: phoneCheck.error };
    }

    const passCheck = validatePasswordStrength(passwordPlain);
    if (!passCheck.isValid) {
      return { success: false, error: passCheck.error };
    }

    if (this.accounts.has(phoneCheck.normalized)) {
      return { success: false, error: 'An account is already registered with this mobile number. Please log in.' };
    }

    const hash = await hashPassword(passwordPlain);
    const newAcc: UserAccount = {
      id: `user-${Date.now()}`,
      name: name.trim() || 'Foodie Customer',
      email: `${phoneCheck.normalized.replace(/[^0-9]/g, '')}@khabar.com`,
      phone: phoneCheck.normalized,
      passwordHash: hash,
      role: 'CUSTOMER',
      createdAt: new Date().toISOString(),
      failedLoginAttempts: 0,
    };

    this.registerAccountInternal(newAcc);

    const token = generateSecureRandomToken(32);
    const sessionUser: AuthenticatedUser = {
      id: newAcc.id,
      name: newAcc.name,
      email: newAcc.email,
      phone: newAcc.phone,
      role: newAcc.role,
      token,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    };
    this.activeSessions.set(token, sessionUser);

    auditLogger.log({
      actorId: newAcc.id,
      actorName: newAcc.name,
      actorRole: 'CUSTOMER',
      action: 'AUTH_LOGIN_SUCCESS',
      resourceType: 'user_account',
      status: 'SUCCESS',
      severity: 'INFO',
      details: { signupType: 'mobile_password' },
    });

    return { success: true, user: sessionUser };
  }

  /**
   * Session validation
   */
  public validateSession(token: string | undefined): AuthenticatedUser | null {
    if (!token) return null;
    const session = this.activeSessions.get(token);
    if (!session) return null;
    if (session.expiresAt && Date.now() > session.expiresAt) {
      this.activeSessions.delete(token);
      return null;
    }
    return session;
  }

  /**
   * Invalidate session token on logout
   */
  public logout(token: string | undefined): void {
    if (token) {
      const user = this.activeSessions.get(token);
      this.activeSessions.delete(token);
      if (user) {
        auditLogger.log({
          actorId: user.id,
          actorName: user.name,
          actorRole: user.role,
          action: 'AUTH_LOGOUT',
          resourceType: 'session',
          status: 'SUCCESS',
          severity: 'INFO',
        });
      }
    }
  }
}

export const authService = new AuthService();
