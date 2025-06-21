export interface Puzzle {
  id: string;
  type: PuzzleType;
  category: PuzzleCategory;
  difficulty: Difficulty;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  historicalContext: string;
  points: number;
}

export type PuzzleType = 
  | 'timeline_ordering'
  | 'historical_matching'
  | 'cause_effect'
  | 'multiple_choice';

export type PuzzleCategory = 
  | 'ancient_civilizations'
  | 'medieval_period'
  | 'renaissance'
  | 'modern_history'
  | 'world_wars'
  | 'american_history';

export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

export interface GameState {
  currentPuzzle: Puzzle | null;
  score: number;
  streak: number;
  totalAnswered: number;
  correctAnswers: number;
  currentDifficulty: Difficulty;
  selectedCategory: PuzzleCategory | null;
  gamePhase: 'menu' | 'category_selection' | 'playing' | 'game_over';
  showFeedback: boolean;
  lastAnswerCorrect: boolean;
  timeRemaining: number;
  bonusPoints: number;
}

export interface PlayerStats {
  successRate: number;
  averageTime: number;
  categoryPerformance: Record<PuzzleCategory, number>;
  difficultyBreakdown: Record<Difficulty, { correct: number; total: number }>;
}

export interface AdaptiveDifficultyState {
  currentDifficulty: Difficulty;
  recentPerformance: boolean[];
  categoryDifficulty: Record<PuzzleCategory, Difficulty>;
  adjustmentThreshold: number;
}
