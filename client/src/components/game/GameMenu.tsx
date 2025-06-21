import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, Trophy, TrendingUp } from 'lucide-react';
import { useGameStore } from '@/lib/stores/useGameStore';
import { PuzzleCategory } from '@/types/game';

const categoryInfo: Record<PuzzleCategory, { title: string; description: string; icon: string }> = {
  ancient_civilizations: {
    title: 'Ancient Civilizations',
    description: 'Explore the rise and fall of early human societies',
    icon: '🏛️'
  },
  medieval_period: {
    title: 'Medieval Period',
    description: 'Journey through the Middle Ages and feudal systems',
    icon: '⚔️'
  },
  renaissance: {
    title: 'Renaissance',
    description: 'Discover the rebirth of art, science, and culture',
    icon: '🎨'
  },
  modern_history: {
    title: 'Modern History',
    description: 'Navigate the industrial age and modern developments',
    icon: '🏭'
  },
  world_wars: {
    title: 'World Wars',
    description: 'Study the global conflicts that shaped the 20th century',
    icon: '🌍'
  },
  american_history: {
    title: 'American History',
    description: 'Explore the formation and growth of the United States',
    icon: '🗽'
  },
};

export function GameMenu() {
  const { startGame, playerStats, currentDifficulty } = useGameStore();

  const categories = Object.entries(categoryInfo) as [PuzzleCategory, typeof categoryInfo[PuzzleCategory]][];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
            History Quest
          </h1>
          <p className="text-xl text-blue-100 mb-6">
            An adaptive puzzle game that grows with your knowledge
          </p>
          
          {/* Stats Summary */}
          <div className="flex justify-center gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white">
              <div className="flex items-center gap-2 mb-1">
                <Trophy className="h-5 w-5 text-yellow-400" />
                <span className="font-semibold">Success Rate</span>
              </div>
              <div className="text-2xl font-bold">
                {Math.round(playerStats.successRate * 100)}%
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="h-5 w-5 text-blue-400" />
                <span className="font-semibold">Avg. Time</span>
              </div>
              <div className="text-2xl font-bold">
                {Math.round(playerStats.averageTime)}s
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-5 w-5 text-green-400" />
                <span className="font-semibold">Difficulty</span>
              </div>
              <div className="text-2xl font-bold capitalize">
                {currentDifficulty}
              </div>
            </div>
          </div>
        </div>

        {/* Category Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map(([categoryKey, category]) => (
            <Card 
              key={categoryKey}
              className="bg-white/95 backdrop-blur-sm hover:bg-white transition-all duration-300 hover:scale-105 cursor-pointer border-2 hover:border-blue-300"
              onClick={() => startGame(categoryKey)}
            >
              <CardHeader className="text-center">
                <div className="text-4xl mb-2">{category.icon}</div>
                <CardTitle className="text-lg text-gray-800">
                  {category.title}
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {category.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Performance:</span>
                    <Badge variant={
                      playerStats.categoryPerformance[categoryKey] > 0.7 ? 'default' :
                      playerStats.categoryPerformance[categoryKey] > 0.4 ? 'secondary' : 'destructive'
                    }>
                      {Math.round((playerStats.categoryPerformance[categoryKey] || 0) * 100)}%
                    </Badge>
                  </div>
                  
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      startGame(categoryKey);
                    }}
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Start Quest
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Instructions */}
        <Card className="mt-8 bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-gray-800 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              How Adaptive Difficulty Works
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-700">
            <p className="mb-4">
              History Quest uses an intelligent difficulty system that adapts to your performance:
            </p>
            <ul className="space-y-2 list-disc list-inside">
              <li><strong>Smart Progression:</strong> Answer correctly and consistently to unlock harder puzzles</li>
              <li><strong>Personalized Learning:</strong> Each category tracks your progress independently</li>
              <li><strong>Time Bonuses:</strong> Faster correct answers earn bonus points</li>
              <li><strong>Streak Rewards:</strong> Consecutive correct answers multiply your score</li>
              <li><strong>Educational Focus:</strong> Every answer includes historical context and explanations</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
