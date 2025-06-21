import React from 'react';
import { Trophy, Target, Zap, TrendingUp } from 'lucide-react';
import { useGameStore } from '@/lib/stores/useGameStore';

export function ScoreBoard() {
  const { 
    score, 
    streak, 
    totalAnswered, 
    correctAnswers, 
    bonusPoints 
  } = useGameStore();

  const accuracy = totalAnswered > 0 ? Math.round((correctAnswers / totalAnswered) * 100) : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Score */}
      <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Trophy className="h-5 w-5 text-yellow-600" />
          <span className="font-semibold text-gray-700">Score</span>
        </div>
        <div className="text-2xl font-bold text-gray-800">
          {score.toLocaleString()}
        </div>
        {bonusPoints > 0 && (
          <div className="text-sm text-green-600 font-medium">
            +{bonusPoints} bonus!
          </div>
        )}
      </div>

      {/* Streak */}
      <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Zap className="h-5 w-5 text-orange-600" />
          <span className="font-semibold text-gray-700">Streak</span>
        </div>
        <div className="text-2xl font-bold text-gray-800">
          {streak}
        </div>
        <div className="text-sm text-gray-600">
          {streak > 0 ? 'On fire!' : 'Keep going!'}
        </div>
      </div>

      {/* Accuracy */}
      <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Target className="h-5 w-5 text-blue-600" />
          <span className="font-semibold text-gray-700">Accuracy</span>
        </div>
        <div className="text-2xl font-bold text-gray-800">
          {accuracy}%
        </div>
        <div className="text-sm text-gray-600">
          {correctAnswers}/{totalAnswered}
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <TrendingUp className="h-5 w-5 text-green-600" />
          <span className="font-semibold text-gray-700">Progress</span>
        </div>
        <div className="text-2xl font-bold text-gray-800">
          {totalAnswered}
        </div>
        <div className="text-sm text-gray-600">
          questions answered
        </div>
      </div>
    </div>
  );
}
