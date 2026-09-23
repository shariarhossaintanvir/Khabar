/**
 * KHABAR — Rate Limiting & Abuse Prevention Engine
 * In-memory sliding-window token limiter protecting sensitive endpoints
 * (Login, OTP, Order Placement, Coupon Checks, Reviews, Support Tickets).
 */

interface RateLimitRecord {
  timestamps: number[];
}

class InMemoryRateLimiter {
  private records: Map<string, RateLimitRecord> = new Map();

  /**
   * Evaluates if an action is permitted under the given limit window.
   * If permitted, records the timestamp and returns success.
   * If blocked, returns time remaining until next permitted request.
   */
  public checkLimit(
    key: string,
    maxRequests: number,
    windowMs: number
  ): {
    allowed: boolean;
    remaining: number;
    retryAfterSeconds: number;
  } {
    const now = Date.now();
    const windowStart = now - windowMs;

    let record = this.records.get(key);
    if (!record) {
      record = { timestamps: [] };
      this.records.set(key, record);
    }

    // Filter out timestamps outside the active sliding window
    record.timestamps = record.timestamps.filter((ts) => ts > windowStart);

    if (record.timestamps.length >= maxRequests) {
      const oldestValid = record.timestamps[0];
      const retryAfterMs = oldestValid + windowMs - now;
      return {
        allowed: false,
        remaining: 0,
        retryAfterSeconds: Math.max(1, Math.ceil(retryAfterMs / 1000)),
      };
    }

    // Record this attempt
    record.timestamps.push(now);
    return {
      allowed: true,
      remaining: maxRequests - record.timestamps.length,
      retryAfterSeconds: 0,
    };
  }

  /**
   * Resets rate limit counters for a key upon successful authentication
   */
  public reset(key: string): void {
    this.records.delete(key);
  }

  /**
   * Cleans up expired entries periodically
   */
  public prune(maxAgeMs = 3600_000): void {
    const cutoff = Date.now() - maxAgeMs;
    for (const [key, record] of this.records.entries()) {
      record.timestamps = record.timestamps.filter((ts) => ts > cutoff);
      if (record.timestamps.length === 0) {
        this.records.delete(key);
      }
    }
  }
}

export const rateLimiter = new InMemoryRateLimiter();

// Standard rate limit presets
export const RATE_LIMITS = {
  LOGIN: { max: 5, windowMs: 60_000 },          // 5 attempts per min
  SIGNUP: { max: 3, windowMs: 60_000 },         // 3 accounts per min
  OTP_REQUEST: { max: 3, windowMs: 120_000 },   // 3 OTP sends per 2 mins
  OTP_VERIFY: { max: 5, windowMs: 60_000 },     // 5 attempts per min
  ORDER_CREATE: { max: 3, windowMs: 60_000 },   // 3 orders per min
  COUPON_CHECK: { max: 10, windowMs: 60_000 },  // 10 checks per min
  REVIEW_SUBMIT: { max: 3, windowMs: 60_000 },  // 3 reviews per min
  RESERVATION: { max: 3, windowMs: 60_000 },    // 3 table bookings per min
  SUPPORT_TICKET: { max: 5, windowMs: 120_000 },// 5 tickets per 2 mins
};
