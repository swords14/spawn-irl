import { useState } from 'react';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';

export function QuestScreen() {
  const [idx, setIdx] = useState(0);
  const { dynamicQuests, addTags, setStep } = useStore();
  const current = dynamicQuests[idx];

  const handleAnswer = (tags: string[]) => {
    addTags(tags);
    if (idx < dynamicQuests.length - 1) setIdx(idx + 1);
    else setStep('result');
  };

  if (!current || !current.options) {
    return <div className="text-white text-center p-20">Recuperando dados do Serasa...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto py-20 px-4">
      <AnimatePresence mode="wait">
        <motion.div key={idx} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
          <h2 className="text-3xl font-black mb-10 text-center italic text-white leading-tight">
            "{current.question}"
          </h2>
          <div className="grid gap-4">
            {current.options.map((opt: any, i: number) => (
              <button 
                key={i} 
                onClick={() => handleAnswer(opt.tags)}
                className="glass-panel p-6 text-left hover:border-neon-blue bg-white/5 transition-all active:scale-95 text-white"
              >
                <span className="text-neon-blue font-mono mr-4">[{i+1}]</span> {opt.text}
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}