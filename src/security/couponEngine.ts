/**
 * KHABAR — Authoritative Coupon Validation & Anti-Abuse Engine
 * Server-authoritative voucher calculations, expiration verification,
 * and per-customer single-use redemption ledger.
 */

import { PROMO_COUPONS, PromoCoupon } from '../data/khabarData';
import { auditLogger } from './auditLogger';

export interface CouponRedemptionRecord {
  couponCode: string;
  customerPhone: string;
  orderId: string;
  redeemedAt: string;
  discountAmount: number;
}

class CouponEngineService {
  private redemptions: CouponRedemptionRecord[] = [];

  /**
   * Authoritatively evaluates whether a coupon can be applied to an order.
   */
  public validateCoupon(
    code: string,
    subtotal: number,
    customerPhone: string
  ): {
    isValid: boolean;
    coupon?: PromoCoupon;
    calculatedDiscount: number;
    isFreeDelivery: boolean;
    error?: string;
  } {
    const cleanCode = code.trim().toUpperCase();
    const coupon = PROMO_COUPONS.find((c) => c.code === cleanCode);

    if (!coupon) {
      auditLogger.log({
        actorId: customerPhone || 'guest',
        actorName: customerPhone || 'Customer',
        actorRole: 'CUSTOMER',
        action: 'COUPON_REJECTED',
        resourceType: 'coupon',
        resourceId: cleanCode,
        status: 'BLOCKED',
        severity: 'INFO',
        details: { reason: 'Coupon code does not exist' },
      });
      return { isValid: false, calculatedDiscount: 0, isFreeDelivery: false, error: 'Invalid or unrecognized coupon code.' };
    }

    if (coupon.status !== 'AVAILABLE') {
      return { isValid: false, calculatedDiscount: 0, isFreeDelivery: false, error: `Coupon ${coupon.code} is currently inactive or expired.` };
    }

    // Check expiration date
    const now = new Date();
    const expiry = new Date(coupon.validUntil);
    if (!isNaN(expiry.getTime()) && now > expiry) {
      return { isValid: false, calculatedDiscount: 0, isFreeDelivery: false, error: `Coupon ${coupon.code} expired on ${coupon.validUntil}.` };
    }

    // Check minimum order subtotal requirement
    if (subtotal < coupon.minOrder) {
      return {
        isValid: false,
        calculatedDiscount: 0,
        isFreeDelivery: false,
        error: `Minimum order subtotal of ৳${coupon.minOrder} required for coupon ${coupon.code}.`,
      };
    }

    // Single-use check: Has this customer already redeemed this promo?
    if (customerPhone) {
      const alreadyRedeemed = this.redemptions.some(
        (r) => r.customerPhone === customerPhone && r.couponCode === cleanCode
      );
      if (alreadyRedeemed) {
        auditLogger.log({
          actorId: customerPhone,
          actorName: customerPhone,
          actorRole: 'CUSTOMER',
          action: 'COUPON_REJECTED',
          resourceType: 'coupon',
          resourceId: cleanCode,
          status: 'BLOCKED',
          severity: 'WARNING',
          details: { reason: 'Duplicate coupon redemption attempt' },
        });
        return {
          isValid: false,
          calculatedDiscount: 0,
          isFreeDelivery: false,
          error: `Coupon ${coupon.code} has already been redeemed for this account. Single-use only.`,
        };
      }
    }

    // Calculate authoritative discount
    let discount = 0;
    let isFreeDelivery = false;

    if (coupon.discountType === 'FLAT') {
      discount = Math.min(subtotal, coupon.discountValue);
    } else if (coupon.discountType === 'PERCENT') {
      const rawDiscount = (subtotal * coupon.discountValue) / 100;
      discount = coupon.maxDiscount ? Math.min(rawDiscount, coupon.maxDiscount) : rawDiscount;
    } else if (coupon.discountType === 'FREE_DELIVERY') {
      isFreeDelivery = true;
    }

    return {
      isValid: true,
      coupon,
      calculatedDiscount: Math.round(discount),
      isFreeDelivery,
    };
  }

  /**
   * Commits coupon redemption to the ledger
   */
  public recordRedemption(
    couponCode: string,
    customerPhone: string,
    orderId: string,
    discountAmount: number
  ): void {
    const record: CouponRedemptionRecord = {
      couponCode: couponCode.trim().toUpperCase(),
      customerPhone,
      orderId,
      redeemedAt: new Date().toISOString(),
      discountAmount,
    };
    this.redemptions.push(record);

    auditLogger.log({
      actorId: customerPhone,
      actorName: customerPhone,
      actorRole: 'CUSTOMER',
      action: 'COUPON_APPLIED',
      resourceType: 'coupon',
      resourceId: record.couponCode,
      status: 'SUCCESS',
      severity: 'INFO',
      details: { orderId, discountAmount },
    });
  }
}

export const couponEngine = new CouponEngineService();
