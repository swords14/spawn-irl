import { useState } from 'react';
import { useStore } from '../store/useStore';
import { generateAIQuests } from '../utils/engine';
import { LoadingScreen } from './LoadingScreen';
import { motion } from 'framer-motion';

export function StartScreen() {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUserName, setStep, setDynamicQuests } = useStore();

  const handleStart = async () => {
    if (name.trim()) {
      setLoading(true);
      setUserName(name);
      const quests = await generateAIQuests(name);
      if (quests && quests.length > 0) {
        setDynamicQuests(quests);
        setStep('quests');
      } else {
        alert("O Grok fritou. Tente novamente.");
      }
      setLoading(false);
    }
  };

  if (loading) return <LoadingScreen message="Analisando seu histórico duvidoso..." />;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center min-h-[80vh]">
      <h1 className="text-6xl font-black mb-8 text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-neon-blue">SpawnIRL</h1>
      <div className="glass-panel p-8 w-full max-w-md flex flex-col gap-4">
        <input 
          className="bg-black/50 border border-white/20 p-4 rounded text-white font-mono outline-none focus:border-neon-green"
          placeholder="Seu nome..." 
          value={name} 
          onChange={(e) => setName(e.target.value)}
        />
        <button onClick={handleStart} className="bg-neon-green text-black font-black py-4 rounded uppercase">Iniciar Humilhação</button>
      </div>
    </motion.div>
  );
}