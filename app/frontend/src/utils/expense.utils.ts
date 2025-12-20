/**
 * Utility functions for expense data formatting
 */

/**
 * Parse and format expense amount to a number
 * @param amount - Amount as string or number
 * @returns Parsed amount as number
 */
export function parseExpenseAmount(amount: string | number): number {
  if (typeof amount === 'string') {
    return parseFloat(amount);
  }
  return amount;
}

/**
 * Format expense amount with currency and decimal places
 * @param amount - Amount as string or number
 * @param currency - Currency symbol (e.g., 'USD', 'ILS')
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted amount string
 */
export function formatExpenseAmount(
  amount: string | number,
  currency: string,
  decimals: number = 2,
): string {
  const numericAmount = parseExpenseAmount(amount);
  return `${currency} ${numericAmount.toFixed(decimals)}`;
}
