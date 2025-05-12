
import { UserProfile } from '@/types/bible.types';

/**
 * Determines the best Bible version ID to use based on user profile and app language
 * @param userProfile The user's profile (can be null)
 * @param appLanguage The current app language
 * @returns The Bible version ID to use
 */
export function determineBestBibleVersion(userProfile: UserProfile | null, appLanguage: string): string {
  // First priority: user's explicitly preferred version if set
  if (userProfile?.preferred_bible_version) {
    return userProfile.preferred_bible_version;
  }
  
  // Second priority: based on app/browser language
  const normalizedLang = appLanguage.toLowerCase().split('-')[0];
  
  switch (normalizedLang) {
    case 'en':
      return 'kjv'; // King James Version
    case 'es':
      return 'rvr'; // Reina-Valera
    case 'fr':
      return 'apee'; // Louis Segond
    case 'ar':
      return 'svd'; // Smith & Van Dyke
    case 'he':
      return 'hebmod'; // Modern Hebrew
    case 'pt':
      return 'kja'; // King James Atualizada
    default:
      return 'kja'; // Default to Portuguese
  }
}

/**
 * Gets the display name for a language code
 * @param languageCode ISO language code
 * @returns Human-readable language name
 */
export function getLanguageDisplayName(languageCode: string): string {
  const languageMap: Record<string, string> = {
    'pt': 'Português',
    'pt-br': 'Português (Brasil)',
    'en': 'English',
    'es': 'Español',
    'fr': 'Français',
    'ar': 'العربية',
    'he': 'עברית',
    'el': 'Ελληνικά'
  };
  
  const normalizedCode = languageCode.toLowerCase();
  return languageMap[normalizedCode] || languageMap[normalizedCode.split('-')[0]] || languageCode;
}
