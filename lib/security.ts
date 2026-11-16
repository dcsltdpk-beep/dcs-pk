/**
 * Dream Cyber Security Pakistan - Enterprise Defense Suite
 * Comprehensive Input Sanitization, Anti-Injection Defense, & Rate Limiting
 */

import {
  checkRateLimit as checkRateLimitCore,
  sanitizeString as sanitizeStringCore,
  sanitizeObject as sanitizeObjectCore,
  getClientIp as getClientIpCore,
  validateOrigin as validateOriginCore,
} from './security-core.mjs';

export function checkRateLimit(
  identifier: string,
  maxAttempts: number = 10,
  windowSecs: number = 60
): { allowed: boolean; remaining: number; retryAfter?: number } {
  return checkRateLimitCore(identifier, maxAttempts, windowSecs);
}

export function sanitizeString(input: unknown): string {
  return sanitizeStringCore(input);
}

export function sanitizeObject<T>(input: T): T {
  return sanitizeObjectCore(input) as T;
}

export function getClientIp(req: Request): string {
  return getClientIpCore(req);
}

export function validateOrigin(req: Request): boolean {
  return validateOriginCore(req);
}
