import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, XCircle, Target } from 'lucide-react';
import { Puzzle } from '@/types/game';
import { useGameStore } from '@/lib/stores/useGameStore';
import { cn } from '@/lib/utils';

interface PuzzleCardProps {
  puzzle: Puzzle;
}

export function PuzzleCard({ puzzle }: PuzzleCardProps) {
  const { answerPuzzle, timeRemaining } = useGameStore();
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);

  const handleAnswerSelect = (answerIndex: number) => {
    if (hasAnswered) return;
    
    setSelectedAnswer(answerIndex);
    setHasAnswered(true);
    answerPuzzle(answerIndex);
  };

  const getPuzzleTypeIcon = () => {
    switch (puzzle.type) {
      case 'timeline_ordering':
        return '📅';
      case 'historical_matching':
        return '🔗';
      case 'cause_effect':
        return '⚡';
      case 'multiple_choice':
        return '❓';
      default:
        return '📚';
    }
  };

  const getPuzzleTypeTitle = () => {
    switch (puzzle.type) {
      case 'timeline_ordering':
        return 'Timeline Ordering';
      case 'historical_matching':
        return 'Historical Matching';
      case 'cause_effect':
        return 'Cause & Effect';
      case 'multiple_choice':
        return 'Multiple Choice';
      default:
        return 'History Puzzle';
    }
  };

  const getTimerColor = () => {
    if (timeRemaining > 20) return 'text-green-600';
    if (timeRemaining > 10) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="w-full max-w-3xl mx-auto bg-white/95 backdrop-blur-sm shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{getPuzzleTypeIcon()}</span>
            <div>
              <CardTitle className="text-xl text-gray-800">
                {getPuzzleTypeTitle()}
              </CardTitle>
              <p className="text-sm text-gray-600">
                {puzzle.category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge 
              variant={
                puzzle.difficulty === 'easy' ? 'secondary' :
                puzzle.difficulty === 'medium' ? 'default' :
                puzzle.difficulty === 'hard' ? 'destructive' : 'destructive'
              }
              className="capitalize"
            >
              {puzzle.difficulty}
            </Badge>
            
            <div className="flex items-center gap-1">
              <Target className="h-4 w-4 text-blue-600" />
              <span className="font-bold text-blue-600">{puzzle.points} pts</span>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {puzzle.question}
          </h3>
          {puzzle.type === 'timeline_ordering' && (
            <p className="text-sm text-gray-600">
              Click the options in chronological order (earliest to latest)
            </p>
          )}
          {puzzle.type === 'historical_matching' && (
            <p className="text-sm text-gray-600">
              Select the correct matching pairs
            </p>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {puzzle.options.map((option, index) => (
            <Button
              key={index}
              variant="outline"
              className={cn(
                "w-full p-4 h-auto text-left justify-start text-wrap bg-white hover:bg-gray-50 border-2 transition-all duration-200",
                selectedAnswer === index && hasAnswered && index === puzzle.correctAnswer
                  ? "border-green-500 bg-green-50 text-green-800"
                  : selectedAnswer === index && hasAnswered && index !== puzzle.correctAnswer
                  ? "border-red-500 bg-red-50 text-red-800"
                  : hasAnswered && index === puzzle.correctAnswer
                  ? "border-green-500 bg-green-50 text-green-800"
                  : "border-gray-200 hover:border-blue-300"
              )}
              onClick={() => handleAnswerSelect(index)}
              disabled={hasAnswered}
            >
              <div className="flex items-center gap-3 w-full">
                <div className={cn(
                  "flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold",
                  selectedAnswer === index && hasAnswered && index === puzzle.correctAnswer
                    ? "border-green-500 bg-green-500 text-white"
                    : selectedAnswer === index && hasAnswered && index !== puzzle.correctAnswer
                    ? "border-red-500 bg-red-500 text-white"
                    : hasAnswered && index === puzzle.correctAnswer
                    ? "border-green-500 bg-green-500 text-white"
                    : "border-gray-300 bg-white text-gray-600"
                )}>
                  {hasAnswered ? (
                    index === puzzle.correctAnswer ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : selectedAnswer === index ? (
                      <XCircle className="h-4 w-4" />
                    ) : (
                      String.fromCharCode(65 + index)
                    )
                  ) : (
                    String.fromCharCode(65 + index)
                  )}
                </div>
                <span className="text-base">{option}</span>
              </div>
            </Button>
          ))}
        </div>

        {/* Timer */}
        <div className="mt-6 text-center">
          <div className={cn(
            "inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border-2",
            getTimerColor(),
            timeRemaining <= 10 ? "animate-pulse border-red-300" : "border-gray-200"
          )}>
            <Clock className="h-5 w-5" />
            <span className="font-mono font-bold text-lg">
              {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
