import { useState } from 'react';
import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';

export function StartScreen() {
  const [name, setName] = useState('');
  const { setUserName, setStep } = useStore();

  const handleStart = () => {
    if (name.trim().length > 0) {
      setUserName(name);
      setStep('quests');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[80vh] text-center"
    >
      <h1 className="text-6xl font-black mb-2 tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-neon-blue">
        SpawnIRL
      </h1>
      <p className="text-gray-400 mb-8 font-mono text-sm">Life Build Generator v1.0</p>

      <div className="glass-panel p-8 w-full max-w-md flex flex-col gap-4">
        <label className="text-left text-sm font-bold text-gray-300 font-mono">
          &gt; INSIRA SEU NOME_
        </label>
        <input 
          type="text" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleStart()}
          placeholder="Ex: Matheus"
          className="bg-black/50 border border-white/20 rounded-lg p-4 text-white focus:outline-none focus:border-neon-green transition-colors font-mono"
        />
        <button 
          onClick={handleStart}
          className="mt-4 bg-neon-green text-black font-bold py-4 rounded-lg hover:bg-green-400 transition-all uppercase tracking-widest"
        >
          Iniciar Simulação
        </button>
      </div>
    </motion.div>
  );
}