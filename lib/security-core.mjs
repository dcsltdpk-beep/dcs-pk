/**
 * Dream Cyber Security Pakistan - Enterprise Defense Suite (Core Module)
 * Comprehensive Input Sanitization, Anti-Injection Defense, & Rate Limiting
 */

const rateLimitStore = new Map();

// Clean up stale rate limit entries every 10 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore.entries()) {
      entry.attempts = entry.attempts.filter((timestamp) => now - timestamp < 3600000);
      if (entry.attempts.length === 0) {
        rateLimitStore.delete(key);
      }
    }
  }, 600000);
}

/**
 * IP-based Sliding Window Rate Limiter
 */
export function checkRateLimit(identifier, maxAttempts = 10, windowSecs = 60) {
  const now = Date.now();
  const windowMs = windowSecs * 1000;

  let record = rateLimitStore.get(identifier);
  if (!record) {
    record = { attempts: [] };
    rateLimitStore.set(identifier, record);
  }

  // Filter out expired timestamps
  record.attempts = record.attempts.filter((ts) => now - ts < windowMs);

  if (record.attempts.length >= maxAttempts) {
    const oldest = record.attempts[0];
    const retryAfter = Math.ceil((oldest + windowMs - now) / 1000);
    return { allowed: false, remaining: 0, retryAfter: Math.max(1, retryAfter) };
  }

  record.attempts.push(now);
  return { allowed: true, remaining: maxAttempts - record.attempts.length };
}

/**
 * Deep Anti-Injection & NoSQL/SQL Sanitizer
 */
export function sanitizeString(input) {
  if (typeof input !== 'string') {
    if (input === null || input === undefined) return '';
    return String(input);
  }

  let sanitized = input;

  // 1. Remove dangerous control and null bytes
  sanitized = sanitized.replace(/\0/g, '');

  // 2. Neutralize HTML script tags and common XSS vectors
  sanitized = sanitized
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript\s*:/gi, '')
    .replace(/on\w+\s*=/gi, '');

  // 3. Trim whitespace
  return sanitized.trim();
}

/**
 * Deep sanitize object parameters to prevent NoSQL operator injection
 */
export function sanitizeObject(input) {
  if (input === null || typeof input !== 'object') {
    if (typeof input === 'string') {
      return sanitizeString(input);
    }
    return input;
  }

  if (Array.isArray(input)) {
    return input.map((item) => sanitizeObject(item));
  }

  const cleanObj = {};
  for (const [key, value] of Object.entries(input)) {
    // Drop keys starting with $ or containing dots (MongoDB operator & path injection defense)
    if (key.startsWith('$') || key.includes('.')) {
      continue;
    }
    cleanObj[key] = sanitizeObject(value);
  }

  return cleanObj;
}

/**
 * Extracts Client IP address safely from Request headers
 */
export function getClientIp(req) {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  return '127.0.0.1';
}

/**
 * Validate Origin / Referer against allowed domain to prevent CSRF attacks
 */
export function validateOrigin(req) {
  const origin = req.headers.get('origin');
  const referer = req.headers.get('referer');
  const host = req.headers.get('host');

  if (!origin && !referer) {
    // Direct or server-side requests
    return true;
  }

  if (origin) {
    try {
      const originUrl = new URL(origin);
      if (host && originUrl.host !== host) {
        return false;
      }
    } catch {
      return false;
    }
  }

  if (referer) {
    try {
      const refererUrl = new URL(referer);
      if (host && refererUrl.host !== host) {
        return false;
      }
    } catch {
      return false;
    }
  }

  return true;
}
