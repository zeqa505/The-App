import { Difficulty, PlayerStats, PuzzleCategory } from '../types/game';

export class AdaptiveDifficultyEngine {
  private readonly PERFORMANCE_WINDOW = 5;
  private readonly SUCCESS_THRESHOLD_UP = 0.8;
  private readonly SUCCESS_THRESHOLD_DOWN = 0.4;
  private readonly MIN_ANSWERS_FOR_ADJUSTMENT = 3;

  calculateNewDifficulty(
    currentDifficulty: Difficulty,
    recentPerformance: boolean[],
    categoryPerformance?: number
  ): Difficulty {
    if (recentPerformance.length < this.MIN_ANSWERS_FOR_ADJUSTMENT) {
      return currentDifficulty;
    }

    const recentWindow = recentPerformance.slice(-this.PERFORMANCE_WINDOW);
    const successRate = recentWindow.filter(Boolean).length / recentWindow.length;

    // Consider category-specific performance if available
    const adjustedSuccessRate = categoryPerformance 
      ? (successRate + categoryPerformance) / 2 
      : successRate;

    return this.adjustDifficulty(currentDifficulty, adjustedSuccessRate);
  }

  private adjustDifficulty(current: Difficulty, successRate: number): Difficulty {
    const difficulties: Difficulty[] = ['easy', 'medium', 'hard', 'expert'];
    const currentIndex = difficulties.indexOf(current);

    if (successRate >= this.SUCCESS_THRESHOLD_UP && currentIndex < difficulties.length - 1) {
      // Increase difficulty
      return difficulties[currentIndex + 1];
    } else if (successRate <= this.SUCCESS_THRESHOLD_DOWN && currentIndex > 0) {
      // Decrease difficulty
      return difficulties[currentIndex - 1];
    }

    return current;
  }

  calculateBonusPoints(
    basePoints: number,
    timeRemaining: number,
    maxTime: number,
    streak: number
  ): number {
    const timeBonus = Math.floor((timeRemaining / maxTime) * 10);
    const streakBonus = Math.min(streak * 2, 20);
    return timeBonus + streakBonus;
  }

  getCategoryPerformance(
    category: PuzzleCategory,
    stats: PlayerStats
  ): number {
    return stats.categoryPerformance[category] || 0;
  }

  shouldAdjustDifficulty(answersCount: number): boolean {
    return answersCount > 0 && answersCount % 3 === 0;
  }

  getRecommendedTimeLimit(difficulty: Difficulty): number {
    switch (difficulty) {
      case 'easy': return 30;
      case 'medium': return 45;
      case 'hard': return 60;
      case 'expert': return 90;
      default: return 45;
    }
  }
}

export const adaptiveDifficultyEngine = new AdaptiveDifficultyEngine();
