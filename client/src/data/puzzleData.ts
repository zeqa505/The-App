import { Puzzle, PuzzleCategory, Difficulty } from '../types/game';

const createPuzzle = (
  id: string,
  type: Puzzle['type'],
  category: PuzzleCategory,
  difficulty: Difficulty,
  question: string,
  options: string[],
  correctAnswer: number,
  explanation: string,
  historicalContext: string
): Puzzle => ({
  id,
  type,
  category,
  difficulty,
  question,
  options,
  correctAnswer,
  explanation,
  historicalContext,
  points: difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : difficulty === 'hard' ? 30 : 40
});

export const puzzleDatabase: Puzzle[] = [
  // Ancient Civilizations - Easy
  createPuzzle(
    'ac_001',
    'multiple_choice',
    'ancient_civilizations',
    'easy',
    'Which river was crucial to ancient Egyptian civilization?',
    ['Tigris', 'Nile', 'Euphrates', 'Indus'],
    1,
    'The Nile River was the lifeblood of ancient Egypt, providing water, fertile soil, and transportation.',
    'The annual flooding of the Nile deposited rich silt along its banks, creating fertile farmland in an otherwise desert region.'
  ),

  createPuzzle(
    'ac_002',
    'timeline_ordering',
    'ancient_civilizations',
    'easy',
    'Order these ancient civilizations from earliest to latest:',
    ['Roman Empire', 'Ancient Egypt', 'Mesopotamia', 'Ancient Greece'],
    2, // Mesopotamia, Ancient Egypt, Ancient Greece, Roman Empire
    'Mesopotamia (c. 3500 BCE) was the earliest, followed by Ancient Egypt (c. 3100 BCE), then Ancient Greece (c. 800 BCE), and finally the Roman Empire (27 BCE).',
    'These civilizations built upon each other\'s knowledge and innovations over thousands of years.'
  ),

  // Ancient Civilizations - Medium
  createPuzzle(
    'ac_003',
    'historical_matching',
    'ancient_civilizations',
    'medium',
    'Match the ancient wonder with its location:',
    ['Hanging Gardens', 'Lighthouse of Alexandria', 'Colossus of Rhodes', 'Babylon, Egypt, Rhodes'],
    3, // Complex matching puzzle
    'The Hanging Gardens were in Babylon, the Lighthouse was in Alexandria, Egypt, and the Colossus was in Rhodes.',
    'The Seven Wonders of the Ancient World were remarkable architectural and artistic achievements.'
  ),

  // Medieval Period - Easy
  createPuzzle(
    'mp_001',
    'multiple_choice',
    'medieval_period',
    'easy',
    'What was the feudal system?',
    ['A banking system', 'A social and economic structure', 'A religious practice', 'A military strategy'],
    1,
    'The feudal system was a social and economic structure where land was exchanged for loyalty and service.',
    'This system dominated medieval Europe and created a hierarchy from kings down to peasants.'
  ),

  createPuzzle(
    'mp_002',
    'cause_effect',
    'medieval_period',
    'medium',
    'What was a major cause of the Crusades?',
    ['Economic prosperity in Europe', 'Desire to reclaim the Holy Land', 'Technological advancement', 'Population decline'],
    1,
    'The Crusades were primarily motivated by the desire to reclaim Jerusalem and the Holy Land from Muslim control.',
    'Religious fervor, combined with political and economic factors, drove these military campaigns from 1095-1291.'
  ),

  // Renaissance - Medium
  createPuzzle(
    'r_001',
    'multiple_choice',
    'renaissance',
    'medium',
    'Who painted the ceiling of the Sistine Chapel?',
    ['Leonardo da Vinci', 'Michelangelo', 'Raphael', 'Donatello'],
    1,
    'Michelangelo painted the famous ceiling of the Sistine Chapel between 1508 and 1512.',
    'This masterpiece of Renaissance art depicts scenes from the Book of Genesis and is considered one of the greatest artistic achievements in history.'
  ),

  createPuzzle(
    'r_002',
    'timeline_ordering',
    'renaissance',
    'hard',
    'Order these Renaissance events chronologically:',
    ['Fall of Constantinople', 'Gutenberg\'s printing press', 'Columbus reaches America', 'Reformation begins'],
    1, // Gutenberg (1440s), Fall of Constantinople (1453), Columbus (1492), Reformation (1517)
    'Gutenberg\'s printing press (1440s), Fall of Constantinople (1453), Columbus reaches America (1492), Reformation begins (1517).',
    'These events marked major turning points that helped define the Renaissance and the beginning of the modern era.'
  ),

  // Modern History - Medium
  createPuzzle(
    'mh_001',
    'multiple_choice',
    'modern_history',
    'medium',
    'What triggered the Industrial Revolution?',
    ['Discovery of electricity', 'Steam engine invention', 'Colonial expansion', 'Agricultural improvements'],
    1,
    'The steam engine was a key catalyst for the Industrial Revolution, enabling mechanized production and transportation.',
    'James Watt\'s improvements to the steam engine in the 1760s revolutionized manufacturing and transportation.'
  ),

  // World Wars - Hard
  createPuzzle(
    'ww_001',
    'cause_effect',
    'world_wars',
    'hard',
    'What was the immediate cause of World War I?',
    ['German invasion of Belgium', 'Assassination of Archduke Franz Ferdinand', 'Sinking of the Lusitania', 'Russian Revolution'],
    1,
    'The assassination of Archduke Franz Ferdinand in Sarajevo on June 28, 1914, triggered the chain of events leading to WWI.',
    'The complex web of alliances in Europe meant that this single event escalated into a global conflict.'
  ),

  createPuzzle(
    'ww_002',
    'timeline_ordering',
    'world_wars',
    'expert',
    'Order these WWII events chronologically:',
    ['D-Day invasion', 'Pearl Harbor attack', 'Battle of Stalingrad', 'Atomic bomb on Hiroshima'],
    1, // Pearl Harbor (1941), Battle of Stalingrad (1942-43), D-Day (1944), Hiroshima (1945)
    'Pearl Harbor (December 7, 1941), Battle of Stalingrad (August 1942 - February 1943), D-Day invasion (June 6, 1944), Atomic bomb on Hiroshima (August 6, 1945).',
    'These pivotal events shaped the course and outcome of World War II.'
  ),

  // American History - Easy
  createPuzzle(
    'ah_001',
    'multiple_choice',
    'american_history',
    'easy',
    'Who was the first President of the United States?',
    ['Thomas Jefferson', 'John Adams', 'George Washington', 'Benjamin Franklin'],
    2,
    'George Washington was the first President of the United States, serving from 1789 to 1797.',
    'Washington set many precedents for the presidency and chose not to seek a third term, establishing a tradition that lasted until FDR.'
  ),

  createPuzzle(
    'ah_002',
    'cause_effect',
    'american_history',
    'medium',
    'What was a major cause of the American Civil War?',
    ['Taxation disputes', 'Slavery and states\' rights', 'Western expansion', 'Foreign intervention'],
    1,
    'The primary cause of the American Civil War was the disagreement over slavery and states\' rights.',
    'The conflict between Northern and Southern states over slavery ultimately led to secession and war from 1861-1865.'
  ),

  // Additional puzzles for variety
  createPuzzle(
    'ac_004',
    'historical_matching',
    'ancient_civilizations',
    'hard',
    'Match the ancient leader with their empire:',
    ['Hammurabi', 'Cleopatra', 'Alexander the Great', 'Babylon, Egypt, Macedonia'],
    2,
    'Hammurabi ruled Babylon, Cleopatra ruled Egypt, and Alexander the Great ruled Macedonia.',
    'These leaders left lasting legacies that influenced their civilizations for centuries.'
  ),

  createPuzzle(
    'mp_003',
    'multiple_choice',
    'medieval_period',
    'expert',
    'Which event marked the end of the Byzantine Empire?',
    ['Battle of Manzikert', 'Fourth Crusade', 'Fall of Constantinople', 'Battle of Hastings'],
    2,
    'The Fall of Constantinople in 1453 to the Ottoman Empire marked the end of the Byzantine Empire.',
    'This event is often considered the end of the Middle Ages and the beginning of the Renaissance.'
  )
];

export const getCategorizedPuzzles = (category: PuzzleCategory): Puzzle[] => {
  return puzzleDatabase.filter(puzzle => puzzle.category === category);
};

export const getPuzzlesByDifficulty = (difficulty: Difficulty): Puzzle[] => {
  return puzzleDatabase.filter(puzzle => puzzle.difficulty === difficulty);
};

export const getRandomPuzzle = (category: PuzzleCategory, difficulty: Difficulty): Puzzle | null => {
  const filteredPuzzles = puzzleDatabase.filter(
    puzzle => puzzle.category === category && puzzle.difficulty === difficulty
  );
  
  if (filteredPuzzles.length === 0) {
    // Fallback to any difficulty in the category
    const categoryPuzzles = getCategorizedPuzzles(category);
    if (categoryPuzzles.length === 0) return null;
    return categoryPuzzles[Math.floor(Math.random() * categoryPuzzles.length)];
  }
  
  return filteredPuzzles[Math.floor(Math.random() * filteredPuzzles.length)];
};
