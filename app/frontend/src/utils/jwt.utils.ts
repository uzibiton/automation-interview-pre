/**
 * JWT token utilities
 */

interface JWTPayload {
  sub?: string; // User ID
  email?: string;
  name?: string;
  iat?: number;
  exp?: number;
}

/**
 * Decode JWT token without verification (for client-side use only)
 *
 * ⚠️ SECURITY WARNING: This function does NOT verify the JWT signature.
 * This is intentional as it's only used for extracting user information
 * for display purposes on the client side. The server MUST verify all
 * tokens before processing any requests. Never use decoded token data
 * for security decisions on the client side.
 *
 * @param token JWT token string
 * @returns Decoded payload or null if invalid
 */
export function decodeJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const payload = parts[1];
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
    const decoded = atob(padded);
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
}

/**
 * Get current user's name from JWT token
 * @param token JWT token string
 * @returns User's name or empty string if not found
 */
export function getCurrentUserName(token: string): string {
  const payload = decodeJWT(token);
  return payload?.name || '';
}

/**
 * Get current user's email from JWT token
 * @param token JWT token string
 * @returns User's email or empty string if not found
 */
export function getCurrentUserEmail(token: string): string {
  const payload = decodeJWT(token);
  return payload?.email || '';
}
