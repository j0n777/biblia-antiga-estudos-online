
// Export only the necessary services to avoid conflicts
export * from './bible';
export { generateBibleStudy, getUserStudyCredits, getUserStudies, getStudyById } from './bible-studies/BibleStudyAIService';
export type { AIBibleStudy, BibleStudyContent, UserStudyCredits } from './bible-studies/BibleStudyAIService';

// Re-export other services
export * from './AuthService';
export * from './ProfileService';
export * from './AchievementService';
export * from './ChallengeService';
export * from './LeaderboardService';
export * from './ReadingProgressService';
export * from './VersesService';
export * from './BibleDataService';
export * from './BibleImportService';

// Explicitly export reading services to avoid conflicts
export { trackReadingHistory, getReadingHistory } from './reading/ReadingHistoryService';
export { saveReadingPosition, getReadingPosition } from './reading/ReadingPositionService';
export { getReadingMetadata, updateReadingMetadata } from './reading/ReadingMetadataService';
