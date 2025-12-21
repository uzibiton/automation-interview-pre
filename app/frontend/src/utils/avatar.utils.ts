/**
 * Avatar utility functions
 */

/**
 * Get avatar URL with fallback to generated avatar
 * @param avatar - Optional avatar URL
 * @param name - User's name for fallback generation
 * @returns Avatar URL
 */
export function getAvatarUrl(avatar: string | undefined, name: string): string {
  if (avatar) {
    return avatar;
  }

  // Fallback to UI Avatars service
  const encodedName = encodeURIComponent(name);
  return `https://ui-avatars.com/api/?name=${encodedName}&background=4285f4&color=fff`;
}
