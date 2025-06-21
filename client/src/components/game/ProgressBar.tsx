import React from 'react';
import { Progress } from '@/components/ui/progress';
import { useGameStore } from '@/lib/stores/useGameStore';

export function ProgressBar() {
  const { timeRemaining, currentDifficulty } = useGameStore();

  const getTimeLimit = () => {
    switch (currentDifficulty) {
      case 'easy': return 30;
      case 'medium': return 45;
      case 'hard': return 60;
      case 'expert': return 90;
      default: return 45;
    }
  };

  const timeLimit = getTimeLimit();
  const progress = (timeRemaining / timeLimit) * 100;

  const getProgressColor = () => {
    if (progress > 60) return 'bg-green-500';
    if (progress > 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-white">Time Remaining</span>
        <span className="text-sm font-mono text-white">
          {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
        </span>
      </div>
      
      <div className="relative">
        <Progress 
          value={progress} 
          className="h-3 bg-white/30"
        />
        <div 
          className={`absolute top-0 left-0 h-3 rounded-full transition-all duration-1000 ${getProgressColor()}`}
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {timeRemaining <= 10 && (
        <div className="text-center mt-2">
          <span className="text-red-300 font-bold animate-pulse">
            ⚠️ Time is running out!
          </span>
        </div>
      )}
    </div>
  );
}
