
// Re-export all functions from the refactored services
export * from './bible-studies';

// Export the specific AI Bible Study types to avoid conflicts
export type { AIBibleStudy, BibleStudyContent } from './bible-studies/BibleStudyAIService';
