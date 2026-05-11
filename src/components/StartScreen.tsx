import { useState } from 'react';
import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';
import { generateAIQuests } from '../utils/engine';
import { LoadingScreen } from './LoadingScreen';

export function StartScreen() {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setUserName, setStep, setDynamicQuests } = useStore();

  const handleStart = async () => {
    if (name.trim().length < 2) {
      alert("Digite um nome decente, seu anônimo sem graça.");
      return;
    }

    setIsLoading(true);
    setUserName(name);

    const quests = await generateAIQuests(name);

    if (quests && quests.length > 0) {
      setDynamicQuests(quests);
      setStep('quests');
    } else {
      alert("O Grok fritou o cérebro. Tente novamente, seu merdestino.");
    }

    setIsLoading(false);
  };

  if (isLoading) return <LoadingScreen message="Sondando seu histórico duvidoso..." />;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[85vh] text-center px-4"
    >
      <h1 className="text-6xl md:text-7xl font-black mb-2 tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-neon-blue">
        SPAWNIRL
      </h1>
      <p className="text-gray-400 mb-10 font-mono text-sm tracking-[0.3em] uppercase">
        AI SADISTIC GENERATOR v2.0
      </p>

      <div className="glass-panel p-8 w-full max-w-md flex flex-col gap-5 border-t-4 border-neon-green">
        <label className="text-left text-xs font-bold text-gray-500 font-mono uppercase tracking-widest">
          &gt; DIGITE SEU NOME, SEU INFELIZ
        </label>
        
        <input 
          type="text" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleStart()}
          placeholder="Ex: Joselito Corno da Silva"
          className="bg-black/70 border border-white/10 rounded-xl p-5 text-white focus:outline-none focus:border-neon-green transition-all font-medium text-lg placeholder:text-gray-600"
        />

        <button 
          onClick={handleStart}
          disabled={isLoading || name.trim().length < 2}
          className="mt-2 bg-neon-green text-black font-black py-5 rounded-xl hover:bg-green-400 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          INICIAR HUMILHAÇÃO
        </button>
      </div>

      <p className="text-[10px] text-gray-600 mt-8 font-mono">
        AVISO: Sua dignidade não será devolvida.
      </p>
    </motion.div>
  );
}