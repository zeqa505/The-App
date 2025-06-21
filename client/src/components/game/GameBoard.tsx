import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, ArrowLeft, Zap } from 'lucide-react';
import { useGameStore } from '@/lib/stores/useGameStore';
import { PuzzleCard } from './PuzzleCard';
import { ScoreBoard } from './ScoreBoard';
import { DifficultyIndicator } from './DifficultyIndicator';
import { ProgressBar } from './ProgressBar';
import { AnswerFeedback } from './AnswerFeedback';

export function GameBoard() {
  const {
    currentPuzzle,
    gamePhase,
    timeRemaining,
    returnToMenu,
    nextPuzzle,
    showFeedback,
    streak,
    selectedCategory,
    currentDifficulty,
  } = useGameStore();

  useEffect(() => {
    if (gamePhase === 'playing' && timeRemaining === 0) {
      // Time's up - this is handled in the store
    }
  }, [timeRemaining, gamePhase]);

  if (gamePhase === 'game_over') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4 flex items-center justify-center">
        <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-gray-800">Game Over!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <ScoreBoard />
            <div className="space-y-2">
              <Button onClick={returnToMenu} className="w-full">
                Return to Menu
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentPuzzle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4 flex items-center justify-center">
        <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm">
          <CardContent className="text-center p-8">
            <p className="text-gray-600">Loading puzzle...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="outline"
            onClick={returnToMenu}
            className="bg-white/90 hover:bg-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Menu
          </Button>

          <div className="flex items-center gap-4">
            <DifficultyIndicator difficulty={currentDifficulty} />
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 text-white">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span className="font-mono font-bold">
                  {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                </span>
              </div>
            </div>

            {streak > 0 && (
              <div className="bg-orange-500/90 backdrop-blur-sm rounded-lg px-4 py-2 text-white">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  <span className="font-bold">{streak} streak!</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <ProgressBar />

        {/* Score Board */}
        <div className="mb-6">
          <ScoreBoard />
        </div>

        {/* Category Badge */}
        {selectedCategory && (
          <div className="mb-6 text-center">
            <Badge variant="secondary" className="bg-white/90 text-gray-800 px-4 py-2 text-lg">
              {selectedCategory.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
        )}

        {/* Puzzle Card */}
        <div className="mb-6">
          <PuzzleCard puzzle={currentPuzzle} />
        </div>

        {/* Answer Feedback Modal */}
        {showFeedback && (
          <AnswerFeedback
            puzzle={currentPuzzle}
            onNext={nextPuzzle}
            onMenu={returnToMenu}
          />
        )}

        {/* Timer Warning */}
        {timeRemaining <= 10 && timeRemaining > 0 && (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
            <div className="bg-red-500 text-white px-6 py-3 rounded-lg font-bold text-xl animate-pulse">
              Time Running Out: {timeRemaining}s
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
