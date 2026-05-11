import { useEffect, useState, useRef } from 'react';
import { useStore } from '../store/useStore';
import { generateBuild } from '../utils/engine';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';

export function ResultScreen() {
  const userName = useStore((state) => state.userName);
  const userTags = useStore((state) => state.userTags);
  const reset = useStore((state) => state.reset);
  
  const [build, setBuild] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(true);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simula um "loading" de sistema hackeando
    const timer = setTimeout(() => {
      setBuild(generateBuild(userTags));
      setIsGenerating(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [userTags]);

  const handleDownload = async () => {
    if (cardRef.current) {
      const canvas = await html2canvas(cardRef.current, { backgroundColor: '#0a0a0a' });
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `build-${userName.toLowerCase()}.png`;
      link.click();
    }
  };

  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
        <motion.div
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="text-3xl font-mono text-neon-green"
        >
          &gt; COMPILANDO_DESTINO...
        </motion.div>
      </div>
    );
  }

  // Define a cor baseada na dificuldade
  const getDifficultyColor = (diff: string) => {
    switch(diff) {
      case 'NIGHTMARE': return 'text-neon-red';
      case 'HARD': return 'text-orange-500';
      case 'NORMAL': return 'text-yellow-400';
      case 'EASY': return 'text-neon-blue';
      default: return 'text-white';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-md mx-auto py-8"
    >
      {/* CARD DA BUILD (Esta é a div que será "printada") */}
      <div ref={cardRef} className="glass-panel w-full p-6 relative overflow-hidden border-t-4 border-t-neon-green">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 22h20L12 2zm0 4.5l7.5 13.5h-15L12 6.5z"/></svg>
        </div>

        <h2 className="text-3xl font-black mb-1 uppercase tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
          {userName} BUILD
        </h2>
        <p className="text-neon-green font-mono text-sm mb-6">&gt; STATUS: CONCLUÍDO</p>

        <div className="space-y-4">
          <div className="bg-black/40 p-3 rounded border border-white/5">
            <p className="text-xs text-gray-400 font-mono mb-1">📍 SPAWN</p>
            <p className="font-bold">{build.spawn.location}</p>
            <p className={`text-xs font-bold mt-1 ${getDifficultyColor(build.spawn.difficulty)}`}>
              DIFICULDADE: {build.spawn.difficulty}
            </p>
          </div>

          <div className="bg-black/40 p-3 rounded border border-white/5">
            <p className="text-xs text-gray-400 font-mono mb-1">🧠 CLASSE</p>
            <p className="text-xl font-bold text-neon-blue">{build.characterClass.name}</p>
            <p className="text-sm italic text-gray-300 mt-1">"{build.characterClass.subtitle}"</p>
            <p className="text-xs mt-2 text-gray-400">{build.characterClass.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-black/40 p-3 rounded border border-white/5">
              <p className="text-xs text-gray-400 font-mono mb-1">💰 SALÁRIO (30 ANOS)</p>
              <p className="font-bold text-green-400">R$ {build.characterClass.base_salary_30}</p>
            </div>
            <div className="bg-black/40 p-3 rounded border border-white/5">
              <p className="text-xs text-gray-400 font-mono mb-1">📈 CHANCE DE SURVIVAL</p>
              <p className="font-bold">{build.characterClass.survival_rate}</p>
            </div>
          </div>

          <div className="bg-black/40 p-3 rounded border border-white/5 border-l-2 border-l-neon-green">
            <p className="text-xs text-gray-400 font-mono mb-1">🔥 BUFF</p>
            <p className="font-bold text-sm">{build.buff.name}</p>
          </div>

          <div className="bg-black/40 p-3 rounded border border-white/5 border-l-2 border-l-neon-red">
            <p className="text-xs text-gray-400 font-mono mb-1">⚠ DEBUFF</p>
            <p className="font-bold text-sm">{build.debuff.name}</p>
          </div>
        </div>
      </div>

      {/* BOTÕES DE AÇÃO (Não aparecem no print) */}
      <div className="flex w-full gap-3 mt-6">
        <button 
          onClick={handleDownload}
          className="flex-1 bg-neon-blue text-black font-bold py-3 rounded-lg hover:bg-cyan-400 transition-all text-sm uppercase tracking-wider"
        >
          Baixar Ficha
        </button>
        <button 
          onClick={reset}
          className="flex-1 bg-white/10 text-white font-bold py-3 rounded-lg hover:bg-white/20 transition-all text-sm uppercase tracking-wider"
        >
          Reroll
        </button>
      </div>
    </motion.div>
  );
}