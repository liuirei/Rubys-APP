
import React, { useState, useCallback, useEffect } from 'react';
import { GameTab, GameCard } from './types';
import { INITIAL_GAME_CARDS } from './constants';
import VocabCard from './components/VocabCard';
import MemoryGame from './components/MemoryGame';
import TabooGame from './components/TabooGame';
import { generateExtraTabooCards } from './services/geminiService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<GameTab>(GameTab.VOCAB);
  const [cards, setCards] = useState<GameCard[]>(INITIAL_GAME_CARDS);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const speak = useCallback((text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }, []);

  const handleAddAiCards = async () => {
    setIsLoadingMore(true);
    const newCards = await generateExtraTabooCards(6);
    if (newCards.length > 0) {
      setCards(prev => [...prev, ...newCards]);
    }
    setIsLoadingMore(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Header */}
      <header className="pt-12 pb-16 px-4 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 text-8xl rotate-12">🦇</div>
          <div className="absolute top-20 right-20 text-8xl -rotate-12">👻</div>
          <div className="absolute bottom-10 left-1/4 text-6xl rotate-45">🎃</div>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-spooky text-orange-500 drop-shadow-[0_0_30px_rgba(249,115,22,0.5)] mb-4">
          Halloween Taboo
        </h1>
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">
          Learn spooky vocabulary, challenge your memory, and master the art of description!
        </p>
      </header>

      {/* Navigation */}
      <nav className="sticky top-4 z-40 flex justify-center px-4 mb-12">
        <div className="bg-slate-900/80 backdrop-blur-md p-1 rounded-2xl border border-slate-800 shadow-2xl flex gap-1">
          {[
            { id: GameTab.VOCAB, label: 'Vocabulary', icon: '📚' },
            { id: GameTab.MEMORY, label: 'Memory', icon: '🧠' },
            { id: GameTab.TABOO, label: 'Taboo Game', icon: '🎲' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
                activeTab === tab.id 
                  ? 'bg-orange-600 text-white shadow-lg' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4">
        {activeTab === GameTab.VOCAB && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
              <h2 className="text-3xl font-bold border-l-4 border-orange-500 pl-4">Spooky Collection</h2>
              <button 
                onClick={handleAddAiCards}
                disabled={isLoadingMore}
                className="group relative px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold text-white transition-all overflow-hidden flex items-center gap-2"
              >
                {isLoadingMore ? (
                  <span className="animate-spin">🎃</span>
                ) : (
                  <>
                    <span className="group-hover:rotate-12 transition-transform">✨</span>
                    Generate AI Cards
                  </>
                )}
              </button>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {cards.map((card, idx) => (
                <VocabCard key={idx} card={card} onSpeak={speak} />
              ))}
            </div>
          </div>
        )}

        {activeTab === GameTab.MEMORY && (
          <div className="animate-in slide-in-from-bottom-10 duration-500">
            <MemoryGame cards={cards} onSpeak={speak} />
          </div>
        )}

        {activeTab === GameTab.TABOO && (
          <div className="animate-in zoom-in-95 duration-500">
            <TabooGame cards={cards} onSpeak={speak} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-24 py-12 border-t border-slate-900 text-center text-slate-500 text-sm">
        <p>Built with fear & React • Powered by Gemini AI</p>
        <p className="mt-2">🎃 Happy Halloween 🎃</p>
      </footer>
    </div>
  );
};

export default App;
