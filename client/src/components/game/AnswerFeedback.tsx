import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, ArrowRight, Home, BookOpen, Award } from 'lucide-react';
import { Puzzle } from '@/types/game';
import { useGameStore } from '@/lib/stores/useGameStore';
import { useAudio } from '@/lib/stores/useAudio';

interface AnswerFeedbackProps {
  puzzle: Puzzle;
  onNext: () => void;
  onMenu: () => void;
}

export function AnswerFeedback({ puzzle, onNext, onMenu }: AnswerFeedbackProps) {
  const { 
    lastAnswerCorrect, 
    bonusPoints, 
    streak,
    closeFeedback 
  } = useGameStore();
  
  const { playHit, playSuccess } = useAudio();

  useEffect(() => {
    // Play appropriate sound effect
    if (lastAnswerCorrect) {
      playSuccess();
    } else {
      playHit();
    }
  }, [lastAnswerCorrect, playSuccess, playHit]);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl bg-white shadow-2xl">
        <CardHeader>
          <div className="text-center">
            <div className="mb-4">
              {lastAnswerCorrect ? (
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
              ) : (
                <XCircle className="h-16 w-16 text-red-500 mx-auto" />
              )}
            </div>
            
            <CardTitle className={`text-2xl ${lastAnswerCorrect ? 'text-green-600' : 'text-red-600'}`}>
              {lastAnswerCorrect ? 'Correct!' : 'Incorrect'}
            </CardTitle>
            
            {lastAnswerCorrect && (
              <div className="mt-4 space-y-2">
                <Badge className="bg-blue-500 text-white px-4 py-1 text-lg">
                  +{puzzle.points} points
                </Badge>
                
                {bonusPoints > 0 && (
                  <Badge className="bg-orange-500 text-white px-4 py-1 text-lg ml-2">
                    +{bonusPoints} bonus!
                  </Badge>
                )}
                
                {streak > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <Award className="h-5 w-5 text-yellow-500" />
                    <span className="text-yellow-600 font-bold">
                      {streak} answer streak!
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Correct Answer */}
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
            <h3 className="font-semibold text-green-800 mb-2">
              Correct Answer:
            </h3>
            <p className="text-green-700">
              {puzzle.options[puzzle.correctAnswer]}
            </p>
          </div>

          {/* Explanation */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Explanation:
            </h3>
            <p className="text-blue-700">
              {puzzle.explanation}
            </p>
          </div>

          {/* Historical Context */}
          <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
            <h3 className="font-semibold text-purple-800 mb-2">
              Historical Context:
            </h3>
            <p className="text-purple-700">
              {puzzle.historicalContext}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              onClick={onNext}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <ArrowRight className="h-4 w-4 mr-2" />
              Next Question
            </Button>
            
            <Button 
              onClick={onMenu}
              variant="outline"
              className="flex-1"
            >
              <Home className="h-4 w-4 mr-2" />
              Return to Menu
            </Button>
          </div>

          {/* Quick Continue */}
          <div className="text-center text-sm text-gray-500">
            Press Space or Enter for next question
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Add keyboard support
export function AnswerFeedbackWithKeyboard(props: AnswerFeedbackProps) {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === 'Space' || event.code === 'Enter') {
        event.preventDefault();
        props.onNext();
      } else if (event.code === 'Escape') {
        event.preventDefault();
        props.onMenu();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [props]);

  return <AnswerFeedback {...props} />;
}
