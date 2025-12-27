
import React, { useState, useEffect, useRef } from 'react';
import { GameCard } from '../types';
import { getSpookyHint } from '../services/geminiService';

interface TabooGameProps {
  cards: GameCard[];
  onSpeak: (text: string) => void;
}

const TabooGame: React.FC<TabooGameProps> = ({ cards, onSpeak }) => {
  const [currentCard, setCurrentCard] = useState<GameCard | null>(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isRunning, setIsRunning] = useState(false);
  const [aiHint, setAiHint] = useState<string | null>(null);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const timerRef = useRef<any>(null);

  const drawCard = () => {
    const random = cards[Math.floor(Math.random() * cards.length)];
    setCurrentCard(random);
    setAiHint(null);
  };

  const toggleTimer = () => {
    if (isRunning) {
      clearInterval(timerRef.current);
    } else {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    setIsRunning(!isRunning);
  };

  const resetGame = () => {
    clearInterval(timerRef.current);
    setIsRunning(false);
    setTimeLeft(60);
    setCurrentCard(null);
    setAiHint(null);
  };

  const handleAiHint = async () => {
    if (!currentCard) return;
    setIsAiThinking(true);
    const hint = await getSpookyHint(currentCard.word);
    setAiHint(hint);
    setIsAiThinking(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center max-w-2xl mx-auto">
      {/* Timer Display */}
      <div className={`text-8xl font-black mb-8 transition-colors ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-orange-500'}`}>
        {formatTime(timeLeft)}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 mb-12 justify-center">
        <button 
          onClick={toggleTimer}
          className={`px-8 py-3 rounded-xl font-bold text-white transition-all shadow-lg ${isRunning ? 'bg-yellow-600 hover:bg-yellow-500' : 'bg-emerald-600 hover:bg-emerald-500'}`}
        >
          {isRunning ? 'Pause' : (timeLeft === 60 ? 'Start Timer' : 'Resume')}
        </button>
        <button 
          onClick={resetGame}
          className="bg-slate-700 hover:bg-slate-600 px-8 py-3 rounded-xl font-bold text-white transition-all shadow-lg"
        >
          Reset
        </button>
        <button 
          onClick={drawCard}
          className="bg-orange-600 hover:bg-orange-500 px-8 py-3 rounded-xl font-bold text-white transition-all shadow-lg border-b-4 border-orange-800 active:border-b-0 active:translate-y-1"
        >
          🎲 Draw Card
        </button>
      </div>

      {/* Card Display */}
      <div className="w-full relative min-h-[400px]">
        {currentCard ? (
          <div className="bg-slate-800 rounded-2xl p-8 border-2 border-slate-700 shadow-2xl animate-[float_4s_ease-in-out_infinite]">
            <div className="text-center mb-10">
              <span className="text-slate-400 text-sm uppercase tracking-widest block mb-2">Describe This Word:</span>
              <h2 className="text-6xl font-black text-white mb-2 uppercase group flex items-center justify-center gap-4">
                {currentCard.word}
                <button onClick={() => onSpeak(currentCard.word)} className="p-2 text-slate-500 hover:text-orange-400">
                  <SpeakerIcon />
                </button>
              </h2>
              <span className="text-2xl text-orange-400 font-medium">{currentCard.zh}</span>
            </div>

            <div className="bg-slate-900/50 rounded-xl p-6 border border-red-500/30">
              <h3 className="text-red-500 font-bold text-center mb-6 text-lg uppercase tracking-wider">🚫 Forbidden Taboo Words 🚫</h3>
              <ul className="grid grid-cols-1 gap-4">
                {currentCard.taboo.map((w, i) => (
                  <li key={i} className="text-2xl text-slate-300 text-center py-2 px-4 bg-slate-800 rounded-lg font-semibold border border-slate-700 uppercase">
                    {w}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 flex flex-col items-center">
              <button 
                onClick={handleAiHint}
                disabled={isAiThinking}
                className="flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors"
              >
                {isAiThinking ? (
                  <span className="animate-spin text-lg">✨</span>
                ) : (
                  <>✨ <span className="underline">Get an AI Spooky Hint</span></>
                )}
              </button>
              {aiHint && (
                <p className="mt-4 text-center italic text-purple-300 bg-purple-900/20 p-4 rounded-xl border border-purple-500/20 animate-in fade-in slide-in-from-top-4 duration-500">
                  "{aiHint}"
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 border-4 border-dashed border-slate-700 rounded-2xl p-12 text-center">
            <p className="text-2xl mb-4">Mwahahaha... No card drawn yet.</p>
            <p className="text-slate-600">Press the 🎲 button to begin your nightmare.</p>
          </div>
        )}
      </div>

      {timeLeft === 0 && (
        <div className="fixed inset-0 bg-red-950/90 z-50 flex items-center justify-center p-8 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="text-center">
            <h1 className="text-9xl font-spooky text-red-500 mb-8 animate-bounce">TIME'S UP!</h1>
            <p className="text-2xl text-slate-300 mb-12">The ghosts have taken your soul!</p>
            <button 
              onClick={resetGame}
              className="bg-white text-red-950 px-12 py-4 rounded-full font-black text-2xl hover:scale-110 transition-transform"
            >
              TRY AGAIN IF YOU DARE
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const SpeakerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
  </svg>
);

export default TabooGame;
