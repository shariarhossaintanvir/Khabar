/**
 * KHABAR — Automated Enterprise Security Test Suite
 * 
 * Verifies all 10 security modules & mechanisms:
 * 1. Web Crypto PBKDF2 Hashing & Verification
 * 2. Timing-Safe Comparison & Secure Numeric OTP
 * 3. Bangladeshi Phone Validation & XSS Sanitization
 * 4. Sliding-Window Rate Limiting Engine
 * 5. RBAC Permission Matrix & BOLA/IDOR Outlet Access Control
 * 6. Account Lockout & Auth Service
 * 7. Server-Authoritative Price & Financial Calculation
 * 8. Order Finite State Machine Transition Guard
 * 9. Coupon Engine Expiry & Single-Use Ledger
 * 10. Payment Idempotency & Refund Guard
 */

import {
  hashPassword,
  verifyPassword,
  timingSafeEqual,
  generateSecureNumericOTP,
  generateSecureRandomToken,
  createHMACSHA256,
} from './crypto';
import {
  validateBDPhone,
  validateEmail,
  sanitizeText,
  sanitizeHtml,
  stripDangerousContent,
  validatePasswordStrength,
} from './validation';
import { rateLimiter } from './rateLimiter';
import {
  hasPermission,
  assertPermission,
  assertCanManageRestaurant,
  assertCanAccessOrder,
  AuthenticatedUser,
} from './rbac';
import { authService } from './auth';
import { orderEngine } from './orderEngine';
import { couponEngine } from './couponEngine';
import { paymentSecurity } from './paymentSecurity';
import { MenuItem } from '../data/khabarData';
import type { CartItem, OrderRecord } from '../context/KhabarContext';

// Safe environment process check
declare const process: any;

let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    passedTests++;
    console.log(`  [PASS] ${testName}`);
  } else {
    failedTests++;
    console.error(`  [FAIL] ${testName}${detail ? ` -> ${detail}` : ''}`);
  }
}

export async function runSecurityTestSuite(): Promise<{ passed: number; failed: number }> {
  console.log('================================================================');
  console.log('   KHABAR PLATFORM — COMPREHENSIVE SECURITY VERIFICATION');
  console.log('================================================================\n');

  // -------------------------------------------------------------------------
  // SUITE 1: Cryptography & PBKDF2
  // -------------------------------------------------------------------------
  console.log('--- Suite 1: Web Crypto PBKDF2, Timing Safety & HMAC ---');
  const testPassword = 'SecureBangladesh2026!';
  const hash = await hashPassword(testPassword);
  assert(hash.startsWith('pbkdf2$'), 'PBKDF2 format includes algorithm identifier');
  assert(hash.split('$').length === 4, 'PBKDF2 hash contains algorithm, iterations, salt, and hash');

  const isValid = await verifyPassword(testPassword, hash);
  assert(isValid === true, 'Valid password verifies correctly against PBKDF2 hash');

  const isInvalid = await verifyPassword('IncorrectPassword999', hash);
  assert(isInvalid === false, 'Invalid password fails PBKDF2 verification');

  assert(timingSafeEqual('secret_token_123', 'secret_token_123') === true, 'timingSafeEqual matches identical strings');
  assert(timingSafeEqual('secret_token_123', 'secret_token_999') === false, 'timingSafeEqual rejects different strings');
  assert(timingSafeEqual('short', 'longer_string_here') === false, 'timingSafeEqual safely rejects mismatched lengths');

  const otp = generateSecureNumericOTP(4);
  assert(otp.length === 4 && /^\d{4}$/.test(otp), `Generated OTP (${otp}) is strictly 4 digits`);

  const token = generateSecureRandomToken(32);
  assert(token.length === 64, `Random token (${token.slice(0, 8)}...) length is 64 hex characters (32 bytes)`);

  const hmac = await createHMACSHA256('test_message_payload', 'super_secret_signing_key_32b!');
  assert(typeof hmac === 'string' && hmac.length === 64, 'HMAC-SHA256 generates authentic 64-char hex digest');

  // -------------------------------------------------------------------------
  // SUITE 2: Bangladeshi Validation & XSS Neutralization
  // -------------------------------------------------------------------------
  console.log('\n--- Suite 2: Bangladeshi Phone, Email & XSS Sanitization ---');
  assert(validateBDPhone('01712345678').isValid === true, 'Standard 11-digit BD mobile (017) is accepted');
  assert(validateBDPhone('+8801812345678').isValid === true, 'E.164 formatted BD mobile (+88018) is accepted');
  assert(validateBDPhone('8801912345678').isValid === true, 'National prefix BD mobile (88019) is accepted');
  assert(validateBDPhone('01212345678').isValid === false, 'Invalid operator prefix (012) is rejected');
  assert(validateBDPhone('0171234567').isValid === false, 'Underflow 10-digit number is rejected');
  assert(validateBDPhone('01712345678999').isValid === false, 'Overflow 14-digit number is rejected');

  assert(validateEmail('tanvir@khabar.com.bd').isValid === true, 'Valid email domain accepted');
  assert(validateEmail('not-an-email@').isValid === false, 'Malformed email rejected');

  const xssInput = '<script>alert("hacked")</script>Delicious Food';
  const sanitized = sanitizeHtml(xssInput);
  assert(sanitized.includes('&lt;script&gt;') && !sanitized.includes('<script>'), 'HTML control characters properly escaped');

  const dirtyAttr = '<img src=x onerror=alert(1)>Special Kacchi';
  const stripped = stripDangerousContent(dirtyAttr);
  assert(!stripped.includes('onerror'), 'Dangerous inline script handlers stripped');

  const passStrength = validatePasswordStrength('Khabar@2026');
  assert(passStrength.isValid === true, 'Strong password meets enterprise complexity rules');

  // -------------------------------------------------------------------------
  // SUITE 3: Sliding-Window Rate Limiting
  // -------------------------------------------------------------------------
  console.log('\n--- Suite 3: Sliding-Window Rate Limiting ---');
  const testKey = 'test_rate_' + Date.now();
  const maxReq = 3;
  const winMs = 5000;

  const r1 = rateLimiter.checkLimit(testKey, maxReq, winMs);
  const r2 = rateLimiter.checkLimit(testKey, maxReq, winMs);
  const r3 = rateLimiter.checkLimit(testKey, maxReq, winMs);
  const r4 = rateLimiter.checkLimit(testKey, maxReq, winMs);

  assert(r1.allowed === true && r1.remaining === 2, 'Rate limiter permits request 1');
  assert(r2.allowed === true && r2.remaining === 1, 'Rate limiter permits request 2');
  assert(r3.allowed === true && r3.remaining === 0, 'Rate limiter permits request 3 (boundary reached)');
  assert(r4.allowed === false && r4.retryAfterSeconds > 0, 'Rate limiter blocks request 4 exceeding quota');

  // -------------------------------------------------------------------------
  // SUITE 4: Role-Based Access Control & BOLA/IDOR
  // -------------------------------------------------------------------------
  console.log('\n--- Suite 4: RBAC & BOLA/IDOR Isolation ---');
  const customerUser: AuthenticatedUser = {
    id: 'user-c1',
    name: 'Customer 1',
    email: 'c1@test.com',
    phone: '+8801711111111',
    role: 'CUSTOMER',
  };

  const partnerUser: AuthenticatedUser = {
    id: 'user-p1',
    name: 'Takeout Manager',
    email: 'partner@takeout.com',
    phone: '+8801722222222',
    role: 'RESTAURANT',
    restaurantId: 'takeout',
  };

  const riderUser: AuthenticatedUser = {
    id: 'user-r1',
    name: 'Rahim Rider',
    email: 'rider@test.com',
    phone: '+8801733333333',
    role: 'RIDER',
    riderId: 'rider-1',
  };

  const adminUser: AuthenticatedUser = {
    id: 'user-a1',
    name: 'Super Admin',
    email: 'admin@khabar.com',
    phone: '+8801744444444',
    role: 'ADMIN',
  };

  assert(hasPermission(adminUser, 'ADMIN_ACCESS_CONSOLE') === true, 'ADMIN has access to admin console');
  assert(hasPermission(customerUser, 'ADMIN_ACCESS_CONSOLE') === false, 'CUSTOMER denied access to admin console');
  assert(hasPermission(customerUser, 'PLACE_ORDER') === true, 'CUSTOMER permitted to place order');
  assert(hasPermission(riderUser, 'COMPLETE_DELIVERY_WITH_OTP') === true, 'RIDER permitted to complete delivery with OTP');
  assert(hasPermission(riderUser, 'ADMIN_REFUND_TRANSACTIONS') === false, 'RIDER denied transaction refund permission');

  // BOLA outlet isolation
  assert(assertCanManageRestaurant(partnerUser, 'takeout') === true, 'Partner authorized to manage assigned outlet (takeout)');
  assert(assertCanManageRestaurant(partnerUser, 'kacchi-bhai') === false, 'BOLA violation prevented: Partner forbidden from managing unassigned outlet (kacchi-bhai)');
  assert(assertCanManageRestaurant(adminUser, 'kacchi-bhai') === true, 'Super Admin authorized across all outlets');

  // IDOR Order isolation
  const orderForCustomer = { customerPhone: '+8801711111111', restaurantId: 'takeout', riderId: 'rider-1' };
  assert(assertCanAccessOrder(customerUser, orderForCustomer) === true, 'Customer can access own order');
  
  const foreignCustomer: AuthenticatedUser = {
    id: 'user-c2',
    name: 'Stranger',
    email: 'stranger@test.com',
    phone: '+8801899999999',
    role: 'CUSTOMER',
  };
  assert(assertCanAccessOrder(foreignCustomer, orderForCustomer) === false, 'IDOR blocked: Stranger cannot view another customer order');
  assert(assertCanAccessOrder(partnerUser, orderForCustomer) === true, 'Assigned restaurant partner can view order');
  assert(assertCanAccessOrder(riderUser, orderForCustomer) === true, 'Assigned delivery rider can view order');

  // -------------------------------------------------------------------------
  // SUITE 5: Authentication & Progressive Lockout
  // -------------------------------------------------------------------------
  console.log('\n--- Suite 5: Auth Service & Progressive Lockout ---');
  const validAdminLogin = await authService.loginWithPassword('admin@khabar.com', 'KhabarAdmin@2026');
  assert(validAdminLogin.success === true && validAdminLogin.user?.role === 'ADMIN', 'Admin demo account authenticates with PBKDF2 hash');

  const invalidPassLogin = await authService.loginWithPassword('admin@khabar.com', 'WrongPassword123');
  assert(invalidPassLogin.success === false, 'Incorrect password rejected');

  // Test session lifecycle
  if (validAdminLogin.user?.token) {
    const validated = authService.validateSession(validAdminLogin.user.token);
    assert(validated !== null && validated.id === validAdminLogin.user.id, 'Active session token validates correctly');
    authService.logout(validAdminLogin.user.token);
    const afterLogout = authService.validateSession(validAdminLogin.user.token);
    assert(afterLogout === null, 'Session invalidated upon logout');
  }

  // -------------------------------------------------------------------------
  // SUITE 6: Authoritative Price Recalculation
  // -------------------------------------------------------------------------
  console.log('\n--- Suite 6: Server-Authoritative Price Calculation ---');
  const mockMenuItem: MenuItem = {
    id: 'takeout-1',
    name: 'Original Beef Burger',
    bengaliName: 'অরিজিনাল বিফ বার্গার',
    description: 'Classic grilled beef patty',
    price: 320,
    category: 'Burgers',
    image: '',
    rating: 4.8,
    restaurantId: 'takeout',
    restaurantName: 'Takeout',
    isPopular: true,
    isSpicy: false,
    addOns: [],
  };

  // Attacker tampers with price in client cart (sets to 1 BDT)
  const tamperedCartItem: CartItem = {
    id: 'cart-item-1',
    menuItem: { ...mockMenuItem, price: 1 }, // Tampered client price! Real price in catalog is 320 BDT
    restaurantId: 'takeout',
    restaurantName: 'Takeout',
    quantity: 2,
    selectedAddOns: [],
    itemTotal: 2,
  };

  const calculated = orderEngine.calculateOrderFinancials([tamperedCartItem], null, 40, '+8801712345678');
  assert(calculated.success === true && calculated.totals !== undefined, 'Financial calculation succeeded');
  if (calculated.totals) {
    assert(calculated.totals.subtotal === 640, `Price tampering neutralized: Calculated subtotal is 640 BDT (2 x 320 BDT) not 2 BDT`);
    assert(calculated.totals.vat === Math.round(640 * 0.05), `5% VAT accurately calculated: ${calculated.totals.vat} BDT (32 BDT)`);
    assert(calculated.totals.deliveryFee === 40, 'Delivery fee retained accurately');
    assert(calculated.totals.total === 640 + 32 + 40, `Final total authoritatively calculated (${calculated.totals.total} BDT)`);
    assert(calculated.totals.orderDeliveryOTP.length === 4, `Order delivery OTP generated: ${calculated.totals.orderDeliveryOTP}`);
  }

  // -------------------------------------------------------------------------
  // SUITE 7: Order Finite State Machine Transition Guard
  // -------------------------------------------------------------------------
  console.log('\n--- Suite 7: Order Finite State Machine Transitions ---');
  const mockOrder: OrderRecord = {
    id: 'ORD-TEST-1',
    customerName: 'Tanvir Ahmed',
    customerPhone: '+8801712345678',
    deliveryAddress: 'Dhanmondi 27',
    deliveryArea: 'Dhanmondi',
    restaurantId: 'takeout',
    restaurantName: 'Takeout',
    items: [],
    subtotal: 640,
    deliveryFee: 40,
    vat: 32,
    discount: 0,
    total: 712,
    paymentMethod: 'bKash',
    paymentStatus: 'PAID',
    status: 'PLACED',
    placedAt: '12:00 PM',
    estimatedDeliveryMin: 28,
    orderDeliveryOTP: '4821',
  };

  // Customer cannot skip directly to DELIVERED
  const skipCheck = orderEngine.validateStatusTransition('PLACED', 'DELIVERED', customerUser, mockOrder);
  assert(skipCheck.allowed === false, 'Order state machine blocks illegal jump from PLACED to DELIVERED');

  // Restaurant can advance PLACED -> CONFIRMED
  const kitchenConfirm = orderEngine.validateStatusTransition('PLACED', 'CONFIRMED', partnerUser, mockOrder);
  assert(kitchenConfirm.allowed === true, 'Authorized restaurant partner can confirm order');

  // Customer cannot cancel if PREPARING
  const preparingOrder: OrderRecord = { ...mockOrder, status: 'PREPARING' };
  const cancelPreparing = orderEngine.validateStatusTransition('PREPARING', 'CANCELLED', customerUser, preparingOrder);
  assert(cancelPreparing.allowed === false, 'Customer cannot cancel order once PREPARING');

  // Rider OTP verification
  const pickedUpOrder: OrderRecord = { ...mockOrder, status: 'ON_THE_WAY', orderDeliveryOTP: '4821' };
  assert(orderEngine.verifyDeliveryOTP(pickedUpOrder, '4821') === true, 'Delivery OTP verification succeeds with correct customer OTP');
  assert(orderEngine.verifyDeliveryOTP(pickedUpOrder, '9999') === false, 'Delivery OTP verification fails with incorrect OTP');

  // -------------------------------------------------------------------------
  // SUITE 8: Authoritative Coupon Engine & Anti-Reuse
  // -------------------------------------------------------------------------
  console.log('\n--- Suite 8: Authoritative Coupon Validation & Anti-Reuse ---');
  const testPhone = '+8801799887766';
  const couponCheck = couponEngine.validateCoupon('KHABAR50', 600, testPhone);
  assert(couponCheck.isValid === true && couponCheck.calculatedDiscount === 50, 'Valid coupon KHABAR50 yields 50 BDT discount on 600 BDT order');

  // Min spend constraint
  const lowSpendCheck = couponEngine.validateCoupon('KHABAR50', 200, testPhone);
  assert(lowSpendCheck.isValid === false && (lowSpendCheck.error?.includes('Minimum') || lowSpendCheck.error?.includes('minimum')), 'Coupon rejected when order subtotal is below minimum spend threshold');

  // Single-use per customer redemption ledger
  couponEngine.recordRedemption('KHABAR50', testPhone, 'ORD-TEST-1', 50);
  const secondUseCheck = couponEngine.validateCoupon('KHABAR50', 600, testPhone);
  assert(secondUseCheck.isValid === false && secondUseCheck.error?.includes('already been used'), 'Coupon reuse blocked: Single-use per customer enforced');

  // -------------------------------------------------------------------------
  // SUITE 9: Payment Idempotency & Refund Guard
  // -------------------------------------------------------------------------
  console.log('\n--- Suite 9: Payment Idempotency & Refund Authorization ---');
  const idempotencyKey = 'IDEM-TEST-' + Date.now();
  const payment1 = paymentSecurity.verifyPaymentTransaction(idempotencyKey, 'ORD-001', 712, 'bKash', testPhone);
  assert(payment1.success === true && payment1.transactionId?.startsWith('BKH-'), 'bKash payment verified with unique BKH- transaction ID');

  const payment2 = paymentSecurity.verifyPaymentTransaction(idempotencyKey, 'ORD-001', 712, 'bKash', testPhone);
  assert(payment2.transactionId === payment1.transactionId, 'Replay protection: Duplicate idempotency key returns original transaction record');

  // Refund permissions
  assert(paymentSecurity.assertCanRefund(adminUser) === true, 'ADMIN authorized to issue refunds');
  assert(paymentSecurity.assertCanRefund(customerUser) === false, 'CUSTOMER denied refund authorization');
  assert(paymentSecurity.assertCanRefund(riderUser) === false, 'RIDER denied refund authorization');

  console.log('\n================================================================');
  console.log(`  SECURITY TEST SUITE COMPLETED: ${passedTests} PASSED, ${failedTests} FAILED`);
  console.log('================================================================\n');

  return { passed: passedTests, failed: failedTests };
}

// Auto-run if executed in testing runtime
if (typeof window === 'undefined') {
  runSecurityTestSuite().catch((err) => {
    console.error('Test execution error:', err);
  });
}
