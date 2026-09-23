/**
 * KHABAR — Structured Security Audit Logging System
 * Tracks security-critical events, administrative actions, and authorization anomalies.
 * Excludes all sensitive data (passwords, tokens, payment secrets).
 */

export type AuditAction =
  | 'AUTH_LOGIN_SUCCESS'
  | 'AUTH_LOGIN_FAILED'
  | 'AUTH_LOGOUT'
  | 'AUTH_LOCKED_OUT'
  | 'AUTH_OTP_REQUESTED'
  | 'AUTH_OTP_VERIFIED'
  | 'AUTH_OTP_FAILED'
  | 'CUSTOMER_PLACED_ORDER'
  | 'CUSTOMER_CANCELLED_ORDER'
  | 'ORDER_STATUS_CHANGED'
  | 'ORDER_PRICE_TAMPER_DETECTED'
  | 'COUPON_APPLIED'
  | 'COUPON_REJECTED'
  | 'REVIEW_SUBMITTED'
  | 'RESERVATION_CREATED'
  | 'RESERVATION_CANCELLED'
  | 'PAYMENT_VERIFIED'
  | 'PAYMENT_REFUNDED'
  | 'RESTAURANT_STOCK_UPDATED'
  | 'RESTAURANT_MENU_UPDATED'
  | 'RIDER_STATUS_CHANGED'
  | 'RIDER_DELIVERY_ACCEPTED'
  | 'RIDER_DELIVERY_COMPLETED'
  | 'ADMIN_APPROVED_RESTAURANT'
  | 'ADMIN_REJECTED_RESTAURANT'
  | 'ADMIN_UPDATED_PLATFORM'
  | 'RBAC_ACCESS_DENIED'
  | 'RATE_LIMIT_EXCEEDED';

export interface AuditLogEntry {
  id: string;
  timestamp: string; // ISO 8601
  epochMs: number;
  actorId: string;
  actorName: string;
  actorRole: string;
  action: AuditAction;
  resourceType: string;
  resourceId?: string;
  status: 'SUCCESS' | 'FAILURE' | 'BLOCKED';
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  details?: Record<string, string | number | boolean>;
  userAgent?: string;
}

class AuditLoggerService {
  private logs: AuditLogEntry[] = [];
  private readonly maxLogs = 500;

  constructor() {
    // Seed initial platform boot audit log
    this.log({
      actorId: 'system',
      actorName: 'Security Engine',
      actorRole: 'SYSTEM',
      action: 'ADMIN_UPDATED_PLATFORM',
      resourceType: 'system_security',
      status: 'SUCCESS',
      severity: 'INFO',
      details: { message: 'KHABAR Security Engine Initialized with Active Hardening' },
    });
  }

  public log(entry: Omit<AuditLogEntry, 'id' | 'timestamp' | 'epochMs'>): AuditLogEntry {
    const now = new Date();
    const completeEntry: AuditLogEntry = {
      ...entry,
      id: `audit-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: now.toISOString(),
      epochMs: now.getTime(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent.slice(0, 100) : 'Serverless Runtime',
    };

    this.logs.unshift(completeEntry);

    // Keep log buffer bounded
    if (this.logs.length > this.maxLogs) {
      this.logs.pop();
    }

    return completeEntry;
  }

  public getRecentLogs(limit = 100, roleFilter?: string, actionFilter?: string): AuditLogEntry[] {
    let filtered = this.logs;
    if (roleFilter && roleFilter !== 'ALL') {
      filtered = filtered.filter((l) => l.actorRole === roleFilter);
    }
    if (actionFilter && actionFilter !== 'ALL') {
      filtered = filtered.filter((l) => l.action.includes(actionFilter));
    }
    return filtered.slice(0, limit);
  }

  public clear(): void {
    this.logs = [];
  }
}

export const auditLogger = new AuditLoggerService();
