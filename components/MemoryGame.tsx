
import React, { useState, useEffect, useCallback } from 'react';
import { GameCard, MemoryCardData } from '../types';

interface MemoryGameProps {
  cards: GameCard[];
  onSpeak: (text: string) => void;
}

const MemoryGame: React.FC<MemoryGameProps> = ({ cards, onSpeak }) => {
  const [grid, setGrid] = useState<MemoryCardData[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const initGame = useCallback(() => {
    const selected = [...cards].sort(() => 0.5 - Math.random()).slice(0, 10);
    const pairs: MemoryCardData[] = [];
    
    selected.forEach((c) => {
      pairs.push({
        id: Math.random().toString(36).substr(2, 9),
        matchId: c.word,
        type: 'image',
        content: c.img,
        isFlipped: false,
        isMatched: false
      });
      pairs.push({
        id: Math.random().toString(36).substr(2, 9),
        matchId: c.word,
        type: 'text',
        content: c.word,
        isFlipped: false,
        isMatched: false
      });
    });

    setGrid(pairs.sort(() => 0.5 - Math.random()));
    setFlipped([]);
    setMoves(0);
    setMatches(0);
    setTime(0);
    setIsActive(false);
  }, [cards]);

  useEffect(() => {
    initGame();
  }, [initGame]);

  useEffect(() => {
    let interval: any;
    if (isActive && matches < 10) {
      interval = setInterval(() => setTime(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, matches]);

  const handleCardClick = (index: number) => {
    if (grid[index].isMatched || grid[index].isFlipped || flipped.length === 2) return;
    
    if (!isActive) setIsActive(true);

    const newGrid = [...grid];
    newGrid[index].isFlipped = true;
    setGrid(newGrid);

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [firstIdx, secondIdx] = newFlipped;
      const first = grid[firstIdx];
      const second = grid[secondIdx];

      if (first.matchId === second.matchId && first.type !== second.type) {
        // Match
        setTimeout(() => {
          const matchedGrid = [...grid];
          matchedGrid[firstIdx].isMatched = true;
          matchedGrid[secondIdx].isMatched = true;
          setGrid(matchedGrid);
          setFlipped([]);
          setMatches(m => m + 1);
          onSpeak(first.matchId);
        }, 600);
      } else {
        // No match
        setTimeout(() => {
          const resetGrid = [...grid];
          resetGrid[firstIdx].isFlipped = false;
          resetGrid[secondIdx].isFlipped = false;
          setGrid(resetGrid);
          setFlipped([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex gap-8 mb-8 text-xl">
        <div className="bg-slate-800 px-6 py-2 rounded-full border border-slate-700">
          Moves: <span className="font-bold text-orange-500">{moves}</span>
        </div>
        <div className="bg-slate-800 px-6 py-2 rounded-full border border-slate-700">
          Time: <span className="font-bold text-orange-500">{time}s</span>
        </div>
        <button 
          onClick={initGame}
          className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-2 rounded-full font-bold transition-all shadow-lg hover:shadow-orange-500/20"
        >
          Reset Game
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4 max-w-4xl w-full">
        {grid.map((card, i) => (
          <div 
            key={card.id}
            onClick={() => handleCardClick(i)}
            className={`relative aspect-square cursor-pointer transition-all duration-500 transform-style-3d ${card.isFlipped || card.isMatched ? 'rotate-y-180' : ''}`}
          >
            {/* Front (Cover) */}
            <div className="absolute inset-0 backface-hidden bg-orange-600 rounded-xl border-4 border-orange-500 flex items-center justify-center text-5xl shadow-lg">
              🎃
            </div>
            {/* Back (Content) */}
            <div className={`absolute inset-0 rotate-y-180 backface-hidden rounded-xl border-4 flex items-center justify-center p-2 text-center shadow-lg transition-colors ${card.isMatched ? 'bg-emerald-900 border-emerald-500' : 'bg-slate-800 border-slate-700'}`}>
              {card.type === 'image' ? (
                <img src={card.content} alt="Memory item" className="w-full h-full object-contain" />
              ) : (
                <span className="text-lg font-bold text-white break-words">{card.content}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {matches === 10 && (
        <div className="mt-8 text-center animate-bounce">
          <h2 className="text-4xl font-spooky text-orange-500">Mwahahaha! You Win!</h2>
          <p className="text-slate-400">Finished in {time} seconds and {moves} moves.</p>
        </div>
      )}
    </div>
  );
};

export default MemoryGame;
