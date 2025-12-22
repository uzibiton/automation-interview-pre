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
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
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
