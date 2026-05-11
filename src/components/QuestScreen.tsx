import { useState } from 'react';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import questionsData from '../data/questions.json'; // Importando o JSON novo

export function QuestScreen() {
  const [currentQuestIdx, setCurrentQuestIdx] = useState(0);
  const addTags = useStore((state) => state.addTags);
  const setStep = useStore((state) => state.setStep);

  const questions = questionsData.questions;
  const currentQuest = questions[currentQuestIdx];

  const handleAnswer = (tags: string[]) => {
    addTags(tags);
    
    if (currentQuestIdx < questions.length - 1) {
      setCurrentQuestIdx(prev => prev + 1);
    } else {
      setStep('result');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-xl mx-auto px-4">
      {/* Barra de Progresso */}
      <div className="w-full mb-10 flex gap-1">
        {questions.map((_, idx) => (
          <div 
            key={idx} 
            className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
              idx <= currentQuestIdx ? 'bg-neon-blue shadow-[0_0_12px_#0ff]' : 'bg-white/5'
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestIdx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="w-full"
        >
          <h2 className="text-xl md:text-2xl font-black mb-8 text-center uppercase tracking-tighter leading-tight italic">
            {currentQuest.question}
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {currentQuest.options.map((opt: any, idx: number) => (
              <button
                key={idx}
                onClick={() => handleAnswer(opt.tags)}
                className="glass-panel p-6 text-left hover:bg-white/10 transition-all border-white/5 hover:border-neon-blue group relative overflow-hidden active:scale-95"
              >
                <div className="flex items-center">
                  <span className="text-neon-blue font-mono font-bold mr-4 opacity-50 group-hover:opacity-100">
                    [{['01', '02', '03', '04'][idx]}]
                  </span>
                  <span className="text-sm md:text-base font-medium leading-snug">
                    {opt.text}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}