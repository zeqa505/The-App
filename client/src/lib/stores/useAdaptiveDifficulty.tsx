import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AdaptiveDifficultyState, Difficulty, PuzzleCategory } from '../../types/game';

interface AdaptiveDifficultyStore extends AdaptiveDifficultyState {
  // Actions
  updatePerformance: (correct: boolean) => void;
  adjustCategoryDifficulty: (category: PuzzleCategory, difficulty: Difficulty) => void;
  resetDifficulty: () => void;
  getDifficultyForCategory: (category: PuzzleCategory) => Difficulty;
  
  // Analytics
  getPerformanceAnalysis: () => {
    recentSuccessRate: number;
    trend: 'improving' | 'declining' | 'stable';
    recommendedAdjustment: 'increase' | 'decrease' | 'maintain';
  };
}

const initialState: AdaptiveDifficultyState = {
  currentDifficulty: 'easy',
  recentPerformance: [],
  categoryDifficulty: {
    ancient_civilizations: 'easy',
    medieval_period: 'easy',
    renaissance: 'easy',
    modern_history: 'easy',
    world_wars: 'easy',
    american_history: 'easy',
  },
  adjustmentThreshold: 0.1,
};

export const useAdaptiveDifficulty = create<AdaptiveDifficultyStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      updatePerformance: (correct: boolean) => {
        set(state => {
          const newPerformance = [...state.recentPerformance, correct];
          
          // Keep only the last 10 attempts for analysis
          if (newPerformance.length > 10) {
            newPerformance.shift();
          }

          return {
            recentPerformance: newPerformance,
          };
        });
      },

      adjustCategoryDifficulty: (category: PuzzleCategory, difficulty: Difficulty) => {
        set(state => ({
          categoryDifficulty: {
            ...state.categoryDifficulty,
            [category]: difficulty,
          },
        }));
      },

      resetDifficulty: () => {
        set(initialState);
      },

      getDifficultyForCategory: (category: PuzzleCategory) => {
        const state = get();
        return state.categoryDifficulty[category] || 'easy';
      },

      getPerformanceAnalysis: () => {
        const state = get();
        const { recentPerformance } = state;

        if (recentPerformance.length < 3) {
          return {
            recentSuccessRate: 0.5,
            trend: 'stable' as const,
            recommendedAdjustment: 'maintain' as const,
          };
        }

        const recentSuccessRate = recentPerformance.filter(Boolean).length / recentPerformance.length;
        
        // Analyze trend by comparing first and second half of recent performance
        const halfPoint = Math.floor(recentPerformance.length / 2);
        const firstHalf = recentPerformance.slice(0, halfPoint);
        const secondHalf = recentPerformance.slice(halfPoint);
        
        const firstHalfRate = firstHalf.filter(Boolean).length / firstHalf.length;
        const secondHalfRate = secondHalf.filter(Boolean).length / secondHalf.length;
        
        const improvement = secondHalfRate - firstHalfRate;
        const { adjustmentThreshold } = state;

        let trend: 'improving' | 'declining' | 'stable';
        let recommendedAdjustment: 'increase' | 'decrease' | 'maintain';

        if (improvement > adjustmentThreshold) {
          trend = 'improving';
          recommendedAdjustment = recentSuccessRate > 0.8 ? 'increase' : 'maintain';
        } else if (improvement < -adjustmentThreshold) {
          trend = 'declining';
          recommendedAdjustment = recentSuccessRate < 0.4 ? 'decrease' : 'maintain';
        } else {
          trend = 'stable';
          if (recentSuccessRate > 0.8) {
            recommendedAdjustment = 'increase';
          } else if (recentSuccessRate < 0.4) {
            recommendedAdjustment = 'decrease';
          } else {
            recommendedAdjustment = 'maintain';
          }
        }

        return {
          recentSuccessRate,
          trend,
          recommendedAdjustment,
        };
      },
    }),
    {
      name: 'adaptive-difficulty-storage',
      partialize: (state) => ({
        currentDifficulty: state.currentDifficulty,
        categoryDifficulty: state.categoryDifficulty,
        adjustmentThreshold: state.adjustmentThreshold,
      }),
    }
  )
);
