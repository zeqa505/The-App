import React from 'react';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Difficulty } from '@/types/game';
import { useAdaptiveDifficulty } from '@/lib/stores/useAdaptiveDifficulty';

interface DifficultyIndicatorProps {
  difficulty: Difficulty;
}

export function DifficultyIndicator({ difficulty }: DifficultyIndicatorProps) {
  const { getPerformanceAnalysis } = useAdaptiveDifficulty();
  const analysis = getPerformanceAnalysis();

  const getDifficultyColor = (diff: Difficulty) => {
    switch (diff) {
      case 'easy':
        return 'bg-green-500 text-white';
      case 'medium':
        return 'bg-yellow-500 text-white';
      case 'hard':
        return 'bg-orange-500 text-white';
      case 'expert':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getTrendIcon = () => {
    switch (analysis.trend) {
      case 'improving':
        return <TrendingUp className="h-4 w-4" />;
      case 'declining':
        return <TrendingDown className="h-4 w-4" />;
      case 'stable':
        return <Minus className="h-4 w-4" />;
    }
  };

  const getTrendColor = () => {
    switch (analysis.trend) {
      case 'improving':
        return 'text-green-600';
      case 'declining':
        return 'text-red-600';
      case 'stable':
        return 'text-gray-600';
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Badge className={`${getDifficultyColor(difficulty)} px-3 py-1 font-bold`}>
        {difficulty.toUpperCase()}
      </Badge>
      
      <div className={`flex items-center gap-1 ${getTrendColor()}`}>
        {getTrendIcon()}
        <span className="text-sm font-medium capitalize">
          {analysis.trend}
        </span>
      </div>
      
      {analysis.recommendedAdjustment !== 'maintain' && (
        <Badge 
          variant="outline" 
          className="text-xs bg-white/90"
        >
          Next: {analysis.recommendedAdjustment}
        </Badge>
      )}
    </div>
  );
}
