
import React, { useState } from 'react';
import { GameCard } from '../types';

interface VocabCardProps {
  card: GameCard;
  onSpeak: (text: string) => void;
}

const VocabCard: React.FC<VocabCardProps> = ({ card, onSpeak }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="relative w-full aspect-square cursor-pointer perspective-1000 group"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div 
        className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}
      >
        {/* Front */}
        <div className="absolute inset-0 backface-hidden bg-slate-800 rounded-xl overflow-hidden border-2 border-slate-700 hover:border-orange-500 transition-colors shadow-lg flex flex-col items-center justify-center p-2">
          <img 
            src={card.img} 
            alt={card.word} 
            className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-300"
          />
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onSpeak(card.word);
            }}
            className="absolute top-2 right-2 p-2 rounded-full bg-slate-900/50 text-slate-400 hover:text-orange-400 hover:bg-slate-700 transition-all opacity-0 group-hover:opacity-100"
          >
            <SpeakerIcon />
          </button>
        </div>

        {/* Back */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-slate-900 rounded-xl border-2 border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.3)] flex flex-col items-center justify-center p-4 text-center">
          <h3 className="text-2xl font-bold text-white mb-1 uppercase tracking-wider">{card.word}</h3>
          <p className="text-xl text-orange-400 font-medium mb-4">{card.zh}</p>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onSpeak(card.word);
            }}
            className="p-3 rounded-full bg-orange-500/20 text-orange-500 hover:bg-orange-500 hover:text-white transition-all"
          >
            <SpeakerIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

const SpeakerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
  </svg>
);

export default VocabCard;
