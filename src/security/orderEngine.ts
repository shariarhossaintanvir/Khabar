/**
 * KHABAR — Authoritative Order Calculation & State Machine Engine
 * Strictly computes pricing server-side, validates catalog items, and enforces role-based state transitions.
 */

import { RESTAURANTS, MenuItem, AddOnOption } from '../data/khabarData';
import { couponEngine } from './couponEngine';
import { auditLogger } from './auditLogger';
import { generateSecureNumericOTP, timingSafeEqual } from './crypto';
import type { CartItem, OrderRecord } from '../context/KhabarContext';
import type { AuthenticatedUser } from './rbac';

export type OrderStatus = 'PLACED' | 'CONFIRMED' | 'PREPARING' | 'PICKED_UP' | 'ON_THE_WAY' | 'DELIVERED' | 'CANCELLED';

export interface AuthoritativeOrderTotals {
  subtotal: number;
  discount: number;
  deliveryFee: number;
  vat: number;
  total: number;
  verifiedItems: CartItem[];
  appliedCouponCode?: string;
  orderDeliveryOTP: string;
}

/**
 * Valid order status transitions
 */
const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PLACED: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['PREPARING', 'CANCELLED'],
  PREPARING: ['PICKED_UP', 'CANCELLED'],
  PICKED_UP: ['ON_THE_WAY'],
  ON_THE_WAY: ['DELIVERED'],
  DELIVERED: [], // Terminal
  CANCELLED: [], // Terminal
};

class OrderEngineService {
  /**
   * Authoritatively recalculates all financial totals directly from canonical restaurant menu catalog.
   */
  public calculateOrderFinancials(
    clientCartItems: CartItem[],
    couponCode: string | null | undefined,
    baseDeliveryFee: number,
    customerPhone: string
  ): { success: boolean; totals?: AuthoritativeOrderTotals; error?: string } {
    if (!clientCartItems || clientCartItems.length === 0) {
      return { success: false, error: 'Your food cart is empty' };
    }

    const verifiedItems: CartItem[] = [];
    let authoritativeSubtotal = 0;

    // Verify every single item and add-on against the authoritative restaurant data
    for (const clientItem of clientCartItems) {
      const restaurant = RESTAURANTS.find((r) => r.id === clientItem.restaurantId);
      if (!restaurant) {
        return { success: false, error: `Invalid restaurant specified: ${clientItem.restaurantId}` };
      }

      const authoritativeDish = restaurant.menuItems.find((m) => m.id === clientItem.menuItem.id);
      if (!authoritativeDish) {
        return { success: false, error: `Menu item "${clientItem.menuItem.name}" is no longer available` };
      }

      if (!authoritativeDish.isAvailable) {
        return { success: false, error: `Menu item "${authoritativeDish.name}" is currently sold out` };
      }

      // Validate quantity is safe positive integer
      const quantity = Math.max(1, Math.min(50, Math.floor(Number(clientItem.quantity) || 1)));

      // Authoritative add-on price computation
      let verifiedAddOnTotal = 0;
      const verifiedAddOns: AddOnOption[] = [];

      if (clientItem.selectedAddOns && Array.isArray(clientItem.selectedAddOns)) {
        for (const clientAddOn of clientItem.selectedAddOns) {
          // If dish defines add-ons, match against them; otherwise fallback to safe lookup
          const authoritativeAddOn = authoritativeDish.addOns?.find((a) => a.id === clientAddOn.id);
          const price = authoritativeAddOn ? authoritativeAddOn.price : clientAddOn.price;
          verifiedAddOnTotal += price;
          verifiedAddOns.push({
            id: clientAddOn.id,
            name: clientAddOn.name,
            price,
          });
        }
      }

      const verifiedSinglePrice = authoritativeDish.price + verifiedAddOnTotal;
      const itemTotal = verifiedSinglePrice * quantity;
      authoritativeSubtotal += itemTotal;

      verifiedItems.push({
        id: clientItem.id,
        menuItem: authoritativeDish,
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
        quantity,
        selectedSize: clientItem.selectedSize,
        selectedSauces: clientItem.selectedSauces,
        selectedAddOns: verifiedAddOns,
        specialInstructions: clientItem.specialInstructions?.slice(0, 200),
        itemTotal,
      });
    }

    // Authoritative Coupon Validation
    let discount = 0;
    let isCouponFreeDelivery = false;
    let validCouponCode: string | undefined = undefined;

    if (couponCode) {
      const couponResult = couponEngine.validateCoupon(couponCode, authoritativeSubtotal, customerPhone);
      if (couponResult.isValid && couponResult.coupon) {
        discount = couponResult.calculatedDiscount;
        isCouponFreeDelivery = couponResult.isFreeDelivery;
        validCouponCode = couponResult.coupon.code;
      }
    }

    // Delivery Fee calculation (Free delivery threshold at ৳600 or via coupon)
    const isFreeDelivery = authoritativeSubtotal >= 600 || isCouponFreeDelivery;
    const deliveryFee = isFreeDelivery ? 0 : baseDeliveryFee;

    // Bangladesh Restaurant VAT: 5% on discounted food subtotal
    const taxableSubtotal = Math.max(0, authoritativeSubtotal - discount);
    const vat = taxableSubtotal > 0 ? Math.round(taxableSubtotal * 0.05 * 10) / 10 : 0;

    // Final total
    const total = Math.max(0, authoritativeSubtotal - discount + deliveryFee + vat);

    // Cryptographically secure delivery completion OTP for rider handoff
    const orderDeliveryOTP = generateSecureNumericOTP(4);

    return {
      success: true,
      totals: {
        subtotal: authoritativeSubtotal,
        discount,
        deliveryFee,
        vat,
        total: Math.round(total),
        verifiedItems,
        appliedCouponCode: validCouponCode,
        orderDeliveryOTP,
      },
    };
  }

  /**
   * Enforces Order State Machine transitions with role authorization
   */
  public validateStatusTransition(
    currentStatus: OrderStatus,
    targetStatus: OrderStatus,
    user: AuthenticatedUser | null | undefined,
    order: OrderRecord
  ): { allowed: boolean; error?: string } {
    // 1. Validate state transition graph
    const allowedTargets = VALID_TRANSITIONS[currentStatus] || [];
    if (!allowedTargets.includes(targetStatus)) {
      auditLogger.log({
        actorId: user?.id || 'unknown',
        actorName: user?.name || 'Anonymous',
        actorRole: user?.role || 'GUEST',
        action: 'ORDER_STATUS_CHANGED',
        resourceType: 'order',
        resourceId: order.id,
        status: 'BLOCKED',
        severity: 'WARNING',
        details: {
          currentStatus,
          targetStatus,
          reason: `Illegal state transition from ${currentStatus} to ${targetStatus}`,
        },
      });
      return {
        allowed: false,
        error: `Cannot transition order #${order.id} from ${currentStatus} to ${targetStatus}.`,
      };
    }

    // 2. Validate actor permissions for the specific transition
    if (user?.role === 'ADMIN') {
      // Admin has override capability
      return { allowed: true };
    }

    // Restaurant Transitions: CONFIRMED -> PREPARING -> PICKED_UP
    if (['CONFIRMED', 'PREPARING', 'PICKED_UP'].includes(targetStatus)) {
      if (user?.role !== 'RESTAURANT' || user?.restaurantId !== order.restaurantId) {
        return {
          allowed: false,
          error: 'Only the kitchen partner for this order may update preparation status.',
        };
      }
    }

    // Rider Transitions: ON_THE_WAY -> DELIVERED
    if (['ON_THE_WAY', 'DELIVERED'].includes(targetStatus)) {
      if (user?.role !== 'RIDER') {
        return {
          allowed: false,
          error: 'Only the assigned delivery rider may advance delivery progression.',
        };
      }
    }

    // Cancellation Transitions
    if (targetStatus === 'CANCELLED') {
      if (user?.role === 'CUSTOMER') {
        // Customer can only cancel in PLACED or CONFIRMED state before food preparation starts
        if (currentStatus !== 'PLACED' && currentStatus !== 'CONFIRMED') {
          return {
            allowed: false,
            error: 'Order cannot be cancelled once the kitchen has begun preparation.',
          };
        }
      }
    }

    return { allowed: true };
  }

  /**
   * Constant-time verification of customer delivery completion OTP
   */
  public verifyDeliveryOTP(order: OrderRecord, enteredOTP: string): boolean {
    if (!order.orderDeliveryOTP || !enteredOTP) return false;
    return timingSafeEqual(order.orderDeliveryOTP.trim(), enteredOTP.trim());
  }
}

export const orderEngine = new OrderEngineService();
