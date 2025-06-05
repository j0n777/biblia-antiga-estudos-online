
// Authentication
export { isUserAuthenticated } from './AuthService';

// Profile
export { getUserProfile, updateUserProfile } from './ProfileService';

// Achievements - Updated exports
export { 
  getUserAchievements, 
  getAllAchievements,
  trackReadingSession,
  checkBookCompletion,
  getUserStreak
} from './AchievementService';

// Challenges
export { getDailyChallenges } from './ChallengeService';

// Reading Progress
export { 
  trackReading, 
  getReadingStreak 
} from './ReadingProgressService';

// Reading Services - updated imports from refactored modules
export { 
  saveReadingPosition,
  getLastReadingPosition,
  clearReadingPosition,
  getReadingHistory,
  getLastThreeReadings,
  clearReadingHistory,
  trackSearchClick
} from './reading';

// Verses
export { 
  getSavedVerses, 
  saveVerse 
} from './VersesService';

// Leaderboard - Updated exports
export { 
  getLeaderboard,
  getXPLeaderboard,
  getStreakLeaderboard,
  getUserRank,
  getUserXPRank,
  getUserStreakRank
} from './LeaderboardService';

// Re-export from BibleService
export * from './BibleService';

// Re-export from BibleStudyService
export * from './BibleStudyService';
