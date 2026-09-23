/**
 * KHABAR — Central Role-Based Access Control (RBAC) System
 * Defines roles, granular permissions, and resource ownership verification (BOLA/IDOR protection).
 */

import { auditLogger } from './auditLogger';

export type UserRole = 'CUSTOMER' | 'RESTAURANT' | 'RIDER' | 'ADMIN';

export type Permission =
  // Customer Permissions
  | 'BROWSE_CATALOG'
  | 'PLACE_ORDER'
  | 'CANCEL_OWN_ORDER'
  | 'VIEW_OWN_ORDER'
  | 'MANAGE_OWN_CART'
  | 'CREATE_RESERVATION'
  | 'CANCEL_OWN_RESERVATION'
  | 'SUBMIT_ORDER_REVIEW'
  | 'MANAGE_OWN_PROFILE'

  // Restaurant Partner Permissions
  | 'VIEW_OUTLET_KDS'
  | 'CONFIRM_OUTLET_ORDER'
  | 'PREPARE_OUTLET_ORDER'
  | 'HANDOVER_OUTLET_ORDER'
  | 'MANAGE_OUTLET_MENU'
  | 'MANAGE_OUTLET_STOCK'
  | 'VIEW_OUTLET_RESERVATIONS'
  | 'REPLY_OUTLET_REVIEWS'
  | 'VIEW_OUTLET_ANALYTICS'

  // Rider Courier Permissions
  | 'VIEW_ASSIGNED_DELIVERY'
  | 'ACCEPT_DELIVERY_REQUEST'
  | 'DECLINE_DELIVERY_REQUEST'
  | 'UPDATE_DELIVERY_STATUS'
  | 'COMPLETE_DELIVERY_WITH_OTP'
  | 'MANAGE_RIDER_DUTY'
  | 'VIEW_RIDER_EARNINGS'

  // Super Admin Permissions
  | 'ADMIN_ACCESS_CONSOLE'
  | 'ADMIN_APPROVE_RESTAURANT'
  | 'ADMIN_REJECT_RESTAURANT'
  | 'ADMIN_MANAGE_ALL_RESTAURANTS'
  | 'ADMIN_MANAGE_ALL_FOOD'
  | 'ADMIN_OVERRIDE_ORDERS'
  | 'ADMIN_REFUND_TRANSACTIONS'
  | 'ADMIN_MANAGE_COUPONS'
  | 'ADMIN_MANAGE_RIDERS'
  | 'ADMIN_VIEW_AUDIT_LOGS'
  | 'ADMIN_MANAGE_PLATFORM_SETTINGS';

/**
 * Role Permission Matrix
 */
const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  CUSTOMER: [
    'BROWSE_CATALOG',
    'PLACE_ORDER',
    'CANCEL_OWN_ORDER',
    'VIEW_OWN_ORDER',
    'MANAGE_OWN_CART',
    'CREATE_RESERVATION',
    'CANCEL_OWN_RESERVATION',
    'SUBMIT_ORDER_REVIEW',
    'MANAGE_OWN_PROFILE',
  ],
  RESTAURANT: [
    'BROWSE_CATALOG',
    'VIEW_OUTLET_KDS',
    'CONFIRM_OUTLET_ORDER',
    'PREPARE_OUTLET_ORDER',
    'HANDOVER_OUTLET_ORDER',
    'MANAGE_OUTLET_MENU',
    'MANAGE_OUTLET_STOCK',
    'VIEW_OUTLET_RESERVATIONS',
    'REPLY_OUTLET_REVIEWS',
    'VIEW_OUTLET_ANALYTICS',
  ],
  RIDER: [
    'BROWSE_CATALOG',
    'VIEW_ASSIGNED_DELIVERY',
    'ACCEPT_DELIVERY_REQUEST',
    'DECLINE_DELIVERY_REQUEST',
    'UPDATE_DELIVERY_STATUS',
    'COMPLETE_DELIVERY_WITH_OTP',
    'MANAGE_RIDER_DUTY',
    'VIEW_RIDER_EARNINGS',
  ],
  ADMIN: [
    'BROWSE_CATALOG',
    'PLACE_ORDER',
    'ADMIN_ACCESS_CONSOLE',
    'ADMIN_APPROVE_RESTAURANT',
    'ADMIN_REJECT_RESTAURANT',
    'ADMIN_MANAGE_ALL_RESTAURANTS',
    'ADMIN_MANAGE_ALL_FOOD',
    'ADMIN_OVERRIDE_ORDERS',
    'ADMIN_REFUND_TRANSACTIONS',
    'ADMIN_MANAGE_COUPONS',
    'ADMIN_MANAGE_RIDERS',
    'ADMIN_VIEW_AUDIT_LOGS',
    'ADMIN_MANAGE_PLATFORM_SETTINGS',
    'VIEW_OUTLET_KDS',
    'VIEW_ASSIGNED_DELIVERY',
  ],
};

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  restaurantId?: string; // If RESTAURANT partner
  riderId?: string;      // If RIDER partner
  token?: string;
  expiresAt?: number;
}

/**
 * Checks if a user has a specific permission
 */
export const hasPermission = (user: AuthenticatedUser | null | undefined, permission: Permission): boolean => {
  if (!user) {
    // Unauthenticated guest only has browse permissions
    return permission === 'BROWSE_CATALOG';
  }
  const allowed = ROLE_PERMISSIONS[user.role] || [];
  return allowed.includes(permission);
};

/**
 * Asserts a permission and logs security violation if denied
 */
export const assertPermission = (
  user: AuthenticatedUser | null | undefined,
  permission: Permission,
  resource = 'resource'
): boolean => {
  if (!hasPermission(user, permission)) {
    auditLogger.log({
      actorId: user?.id || 'guest',
      actorName: user?.name || 'Anonymous Visitor',
      actorRole: user?.role || 'GUEST',
      action: 'RBAC_ACCESS_DENIED',
      resourceType: resource,
      status: 'BLOCKED',
      severity: 'WARNING',
      details: {
        deniedPermission: permission,
        reason: 'Unauthorized role attempting restricted action',
      },
    });
    return false;
  }
  return true;
};

/**
 * BOLA / IDOR Verification: Validates that a user owns or has authority over a specific restaurant outlet
 */
export const assertCanManageRestaurant = (
  user: AuthenticatedUser | null | undefined,
  targetRestaurantId: string
): boolean => {
  if (!user) return false;
  if (user.role === 'ADMIN') return true;
  if (user.role === 'RESTAURANT' && user.restaurantId === targetRestaurantId) {
    return true;
  }

  auditLogger.log({
    actorId: user.id,
    actorName: user.name,
    actorRole: user.role,
    action: 'RBAC_ACCESS_DENIED',
    resourceType: 'restaurant_outlet',
    resourceId: targetRestaurantId,
    status: 'BLOCKED',
    severity: 'CRITICAL',
    details: {
      userRestaurantId: user.restaurantId || 'none',
      targetRestaurantId,
      reason: 'Cross-tenant outlet modification blocked (BOLA prevention)',
    },
  });
  return false;
};

/**
 * BOLA / IDOR: Checks if customer or authorized entity can view/cancel an order
 */
export const assertCanAccessOrder = (
  user: AuthenticatedUser | null | undefined,
  order: { customerPhone?: string; restaurantId?: string; riderId?: string }
): boolean => {
  if (!user) return false;
  if (user.role === 'ADMIN') return true;
  if (user.role === 'CUSTOMER' && user.phone === order.customerPhone) return true;
  if (user.role === 'RESTAURANT' && user.restaurantId === order.restaurantId) return true;
  if (user.role === 'RIDER' && user.riderId === order.riderId) return true;

  auditLogger.log({
    actorId: user.id,
    actorName: user.name,
    actorRole: user.role,
    action: 'RBAC_ACCESS_DENIED',
    resourceType: 'customer_order',
    status: 'BLOCKED',
    severity: 'WARNING',
    details: { reason: 'Unauthorized access to customer order record' },
  });
  return false;
};
