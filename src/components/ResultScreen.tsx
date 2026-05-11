import { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { generateBuildWithAI } from '../utils/engine';
import { LoadingScreen } from './LoadingScreen';
import { motion } from 'framer-motion';

export function ResultScreen() {
  const { userName, userTags, reset } = useStore();
  const [build, setBuild] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateBuildWithAI(userTags, userName).then(data => {
      setBuild(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingScreen message="Calculando seu prejuízo..." />;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center py-10 px-4">
      <div className="glass-panel w-full max-w-lg p-8 border-t-4 border-neon-red bg-black/90">
        <h2 className="text-4xl font-black uppercase text-neon-red italic mb-2">{build.title}</h2>
        <div className="grid grid-cols-2 gap-4 my-6">
          {Object.entries(build.stats || {}).map(([k, v]: any) => (
            <div key={k} className="bg-white/5 p-2 rounded">
              <p className="text-[10px] text-gray-500 uppercase">{k}</p>
              <p className="font-bold text-white">{v}%</p>
            </div>
          ))}
        </div>
        <p className="text-xl font-black text-white mb-4 italic uppercase">{build.class}</p>
        <p className="text-gray-400 text-sm mb-6 border-y border-white/5 py-4 italic">"{build.description}"</p>
        <p className="text-xs text-neon-blue font-mono">CONSELHO: {build.advice}</p>
      </div>
      <button onClick={reset} className="mt-8 bg-white/10 p-4 rounded text-white uppercase font-black">Tentar Novo Loss</button>
    </motion.div>
  );
}