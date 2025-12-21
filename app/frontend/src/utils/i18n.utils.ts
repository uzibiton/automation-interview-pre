/**
 * Internationalization utility functions
 */

/**
 * Supported language codes
 */
export type SupportedLanguage = 'en' | 'he';

/**
 * Get the localized name based on the current language
 * @param item - Object with nameEn and nameHe properties
 * @param language - Current language code ('he' or 'en')
 * @returns The localized name
 */
export const getLocalizedName = <T extends { nameEn: string; nameHe: string }>(
  item: T,
  language: string,
): string => {
  return language === 'he' ? item.nameHe : item.nameEn;
};
