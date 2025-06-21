import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { GameState, Puzzle, PuzzleCategory, Difficulty, PlayerStats } from '../../types/game';
import { getRandomPuzzle } from '../../data/puzzleData';
import { adaptiveDifficultyEngine } from '../../utils/adaptiveDifficulty';

interface GameStore extends GameState {
  // Game actions
  startGame: (category: PuzzleCategory) => void;
  selectCategory: (category: PuzzleCategory) => void;
  answerPuzzle: (answerIndex: number) => void;
  nextPuzzle: () => void;
  resetGame: () => void;
  returnToMenu: () => void;
  closeFeedback: () => void;
  
  // Timer actions
  startTimer: () => void;
  updateTimer: () => void;
  
  // Performance tracking
  recentPerformance: boolean[];
  playerStats: PlayerStats;
  updateStats: (correct: boolean, timeSpent: number, category: PuzzleCategory) => void;
  
  // Internal state
  timerInterval: NodeJS.Timeout | null;
  startTime: number;
}

const initialState: GameState = {
  currentPuzzle: null,
  score: 0,
  streak: 0,
  totalAnswered: 0,
  correctAnswers: 0,
  currentDifficulty: 'easy',
  selectedCategory: null,
  gamePhase: 'menu',
  showFeedback: false,
  lastAnswerCorrect: false,
  timeRemaining: 45,
  bonusPoints: 0,
};

const initialStats: PlayerStats = {
  successRate: 0,
  averageTime: 0,
  categoryPerformance: {
    ancient_civilizations: 0,
    medieval_period: 0,
    renaissance: 0,
    modern_history: 0,
    world_wars: 0,
    american_history: 0,
  },
  difficultyBreakdown: {
    easy: { correct: 0, total: 0 },
    medium: { correct: 0, total: 0 },
    hard: { correct: 0, total: 0 },
    expert: { correct: 0, total: 0 },
  },
};

export const useGameStore = create<GameStore>()(
  subscribeWithSelector((set, get) => ({
    ...initialState,
    recentPerformance: [],
    playerStats: initialStats,
    timerInterval: null,
    startTime: Date.now(),

    startGame: (category: PuzzleCategory) => {
      const { currentDifficulty } = get();
      const puzzle = getRandomPuzzle(category, currentDifficulty);
      
      if (!puzzle) {
        console.error('No puzzle found for category:', category);
        return;
      }

      set({
        selectedCategory: category,
        currentPuzzle: puzzle,
        gamePhase: 'playing',
        timeRemaining: adaptiveDifficultyEngine.getRecommendedTimeLimit(currentDifficulty),
        showFeedback: false,
      });

      get().startTimer();
    },

    selectCategory: (category: PuzzleCategory) => {
      set({ selectedCategory: category, gamePhase: 'category_selection' });
    },

    answerPuzzle: (answerIndex: number) => {
      const state = get();
      const { currentPuzzle, timeRemaining, streak, score, selectedCategory } = state;
      
      if (!currentPuzzle || !selectedCategory) return;

      const isCorrect = answerIndex === currentPuzzle.correctAnswer;
      const timeSpent = adaptiveDifficultyEngine.getRecommendedTimeLimit(currentPuzzle.difficulty) - timeRemaining;
      
      // Clear timer
      if (state.timerInterval) {
        clearInterval(state.timerInterval);
      }

      // Calculate points
      let points = isCorrect ? currentPuzzle.points : 0;
      let bonusPoints = 0;
      
      if (isCorrect) {
        bonusPoints = adaptiveDifficultyEngine.calculateBonusPoints(
          currentPuzzle.points,
          timeRemaining,
          adaptiveDifficultyEngine.getRecommendedTimeLimit(currentPuzzle.difficulty),
          streak
        );
        points += bonusPoints;
      }

      // Update performance tracking
      const newPerformance = [...state.recentPerformance, isCorrect];
      
      set({
        score: score + points,
        streak: isCorrect ? streak + 1 : 0,
        totalAnswered: state.totalAnswered + 1,
        correctAnswers: state.correctAnswers + (isCorrect ? 1 : 0),
        lastAnswerCorrect: isCorrect,
        showFeedback: true,
        bonusPoints,
        recentPerformance: newPerformance,
      });

      // Update stats
      state.updateStats(isCorrect, timeSpent, selectedCategory);

      // Check for difficulty adjustment
      if (adaptiveDifficultyEngine.shouldAdjustDifficulty(state.totalAnswered + 1)) {
        const categoryPerformance = state.playerStats.categoryPerformance[selectedCategory];
        const newDifficulty = adaptiveDifficultyEngine.calculateNewDifficulty(
          state.currentDifficulty,
          newPerformance,
          categoryPerformance
        );
        
        if (newDifficulty !== state.currentDifficulty) {
          console.log(`Difficulty adjusted from ${state.currentDifficulty} to ${newDifficulty}`);
          set({ currentDifficulty: newDifficulty });
        }
      }
    },

    nextPuzzle: () => {
      const { selectedCategory, currentDifficulty } = get();
      
      if (!selectedCategory) return;

      const puzzle = getRandomPuzzle(selectedCategory, currentDifficulty);
      
      if (!puzzle) {
        set({ gamePhase: 'game_over' });
        return;
      }

      set({
        currentPuzzle: puzzle,
        showFeedback: false,
        timeRemaining: adaptiveDifficultyEngine.getRecommendedTimeLimit(currentDifficulty),
        bonusPoints: 0,
      });

      get().startTimer();
    },

    resetGame: () => {
      const state = get();
      if (state.timerInterval) {
        clearInterval(state.timerInterval);
      }
      
      set({
        ...initialState,
        playerStats: state.playerStats, // Keep stats
        recentPerformance: [], // Reset performance tracking
        timerInterval: null,
      });
    },

    returnToMenu: () => {
      const state = get();
      if (state.timerInterval) {
        clearInterval(state.timerInterval);
      }
      
      set({
        gamePhase: 'menu',
        currentPuzzle: null,
        showFeedback: false,
        selectedCategory: null,
      });
    },

    closeFeedback: () => {
      set({ showFeedback: false });
    },

    startTimer: () => {
      const state = get();
      
      // Clear any existing timer
      if (state.timerInterval) {
        clearInterval(state.timerInterval);
      }

      set({ startTime: Date.now() });

      const interval = setInterval(() => {
        const currentState = get();
        if (currentState.timeRemaining <= 1) {
          clearInterval(interval);
          set({ timeRemaining: 0, timerInterval: null });
          
          // Auto-submit with wrong answer when time runs out
          if (currentState.currentPuzzle) {
            get().answerPuzzle(-1); // Invalid answer index
          }
        } else {
          set({ timeRemaining: currentState.timeRemaining - 1 });
        }
      }, 1000);

      set({ timerInterval: interval });
    },

    updateTimer: () => {
      // This method is kept for compatibility but timer is now automatic
    },

    updateStats: (correct: boolean, timeSpent: number, category: PuzzleCategory) => {
      const state = get();
      const { playerStats, currentDifficulty } = state;
      
      const newStats = { ...playerStats };
      
      // Update overall success rate
      const totalAnswered = state.totalAnswered + 1;
      const totalCorrect = state.correctAnswers + (correct ? 1 : 0);
      newStats.successRate = totalCorrect / totalAnswered;
      
      // Update average time (simple moving average)
      newStats.averageTime = (newStats.averageTime + timeSpent) / 2;
      
      // Update category performance
      const categoryTotal = Object.values(newStats.difficultyBreakdown).reduce(
        (sum, diff) => sum + diff.total, 0
      ) + 1;
      const categoryCorrect = Object.values(newStats.difficultyBreakdown).reduce(
        (sum, diff) => sum + diff.correct, 0
      ) + (correct ? 1 : 0);
      
      newStats.categoryPerformance[category] = categoryCorrect / categoryTotal;
      
      // Update difficulty breakdown
      newStats.difficultyBreakdown[currentDifficulty].total += 1;
      if (correct) {
        newStats.difficultyBreakdown[currentDifficulty].correct += 1;
      }
      
      set({ playerStats: newStats });
    },
  }))
);

// Auto-cleanup timer on unmount
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    const state = useGameStore.getState();
    if (state.timerInterval) {
      clearInterval(state.timerInterval);
    }
  });
}
