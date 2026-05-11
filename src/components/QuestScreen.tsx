import { useState } from 'react';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';

export function QuestScreen() {
  const [currentQuestIdx, setCurrentQuestIdx] = useState(0);
  const { dynamicQuests, addTags, setStep } = useStore();

  const currentQuest = dynamicQuests[currentQuestIdx];

  const handleAnswer = (tags: string[]) => {
    addTags(tags);
    
    if (currentQuestIdx < dynamicQuests.length - 1) {
      setCurrentQuestIdx(prev => prev + 1);
    } else {
      setStep('result');
    }
  };

  if (!currentQuest) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        Carregando perguntas... (se travar, recarregue a página)
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] w-full max-w-2xl mx-auto px-4">
      {/* Progress Bar */}
      <div className="w-full mb-10 flex gap-1">
        {dynamicQuests.map((_, idx) => (
          <div 
            key={idx} 
            className={`h-1 flex-1 rounded transition-all duration-700 ${
              idx <= currentQuestIdx 
                ? 'bg-neon-blue shadow-[0_0_12px_#0ff]' 
                : 'bg-white/10'
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestIdx}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          className="w-full text-center"
        >
          <h2 className="text-2xl md:text-3xl font-black mb-12 text-white leading-tight tracking-tight">
            {currentQuest.question}
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {currentQuest.options.map((opt: any, idx: number) => (
              <button
                key={idx}
                onClick={() => handleAnswer(opt.tags)}
                className="glass-panel p-6 text-left border border-white/10 hover:border-neon-blue hover:bg-white/10 group transition-all active:scale-[0.98] text-left"
              >
                <div className="flex items-start gap-4">
                  <span className="text-neon-blue font-mono font-bold text-xl opacity-40 group-hover:opacity-100 mt-0.5">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="text-base md:text-lg font-medium text-gray-200 group-hover:text-white leading-relaxed">
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