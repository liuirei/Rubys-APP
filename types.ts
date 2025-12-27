
export interface GameCard {
  word: string;
  taboo: string[];
  zh: string;
  img: string;
}

export enum GameTab {
  VOCAB = 'vocab',
  MEMORY = 'memory',
  TABOO = 'taboo'
}

export interface MemoryCardData {
  id: string;
  matchId: string;
  type: 'image' | 'text';
  content: string;
  isFlipped: boolean;
  isMatched: boolean;
}
