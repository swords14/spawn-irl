import { useState } from 'react';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';

const QUESTS = [
  {
    question: "O despertador toca às 6h da manhã. O que você faz?",
    options: [
      { text: "Levanto, banho gelado e podcast de finanças.", tags: ["tryhard", "iludido"] },
      { text: "Soneca até 8h45. Trabalho da cama.", tags: ["preguicoso", "homeoffice"] },
      { text: "Eu nem dormi, tava codando/jogando.", tags: ["morcego", "gamer", "dev"] },
      { text: "Choro em posição fetal.", tags: ["ansioso"] }
    ]
  },
  {
    question: "Sextou! Qual é a boa?",
    options: [
      { text: "Ranqueada até perder a sanidade.", tags: ["gamer", "rage"] },
      { text: "Criar um SaaS, o grind não para.", tags: ["hustler", "dev"] },
      { text: "Beber até esquecer meu próprio nome.", tags: ["caotico", "social"] },
      { text: "TikTok por 14 horas seguidas.", tags: ["npc", "beta"] }
    ]
  },
  {
    question: "Escolha a sua maior red flag:",
    options: [
      { text: "Acho que consigo consertar ela/ele.", tags: ["emocionado"] },
      { text: "Compro curso de como ficar rico.", tags: ["iludido", "loss"] },
      { text: "Main Darius top lane.", tags: ["psicopata", "gamer", "rage"] },
      { text: "Falo 'Aura' não ironicamente.", tags: ["esquisito", "beta"] }
    ]
  }
];

export function QuestScreen() {
  const [currentQuest, setCurrentQuest] = useState(0);
  const { addTags, setStep } = useStore();

  const handleAnswer = (tags: string[]) => {
    addTags(tags);
    
    if (currentQuest < QUESTS.length - 1) {
      setCurrentQuest(prev => prev + 1);
    } else {
      setStep('result');
    }
  };

  const quest = QUESTS[currentQuest];

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-md mx-auto">
      <div className="w-full mb-8 flex gap-2">
        {QUESTS.map((_, idx) => (
          <div 
            key={idx} 
            className={`h-2 flex-1 rounded-full transition-colors duration-300 ${idx <= currentQuest ? 'bg-neon-blue' : 'bg-white/10'}`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuest}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="w-full"
        >
          <h2 className="text-2xl font-bold mb-6 text-center leading-relaxed">
            {quest.question}
          </h2>

          <div className="flex flex-col gap-3">
            {quest.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(opt.tags)}
                className="glass-panel p-5 text-left hover:bg-white/10 transition-colors border-white/5 hover:border-neon-blue group"
              >
                <span className="text-neon-blue font-mono mr-3 group-hover:text-white transition-colors">
                  {['A', 'B', 'C', 'D'][idx]}
                </span>
                {opt.text}
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}