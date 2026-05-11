import { useEffect, useState, useRef } from 'react';
import { useStore } from '../store/useStore';
import { generateBuildWithAI } from '../utils/engine';
import { LoadingScreen } from './LoadingScreen';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';

export function ResultScreen() {
  const { userName, userTags, reset } = useStore();
  const [build, setBuild] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchBuild() {
      setIsLoading(true);
      try {
        const data = await generateBuildWithAI(userTags, userName || "Anônimo");
        setBuild(data);
      } catch (err) {
        console.error(err);
        setBuild({
          title: "Merdestino Absoluto",
          subtitle: "Até a IA desistiu de você",
          description: "Sua vida é tão fudida que nem a Grok aguentou gerar um resultado decente. Você é um caso perdido.",
          class: "Beta Irrecuperável",
          final_fate: "Morte por vergonha alheia no quarto alugado",
          stats: { carencia: 95, sofrencia: 100, rage: 35, brainrot: 92, masoquismo: 85, alcolismo: 90 },
          advice: "Não tem mais jeito, irmão. Aceita o loss eterno."
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchBuild();
  }, [userTags, userName]);

  const handleDownload = async () => {
    if (cardRef.current) {
      const canvas = await html2canvas(cardRef.current, { 
        backgroundColor: '#0a0a0a',
        scale: 2 
      });
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `MERDESTINO_${userName.toUpperCase()}.png`;
      link.click();
    }
  };

  if (isLoading) return <LoadingScreen message="Compilando seu merdestino..." />;

  if (!build) {
    return <div className="text-white text-center">Erro ao gerar build. Recarregue a página.</div>;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center min-h-screen py-10 px-4"
    >
      <div ref={cardRef} className="glass-panel w-full max-w-lg p-8 relative overflow-hidden border-t-4 border-neon-red bg-black/90 shadow-[0_0_50px_rgba(255,0,0,0.15)]">
        
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-4xl font-black uppercase italic text-neon-red tracking-tighter leading-none">
              {build.title}
            </h2>
            <p className="text-gray-500 font-mono text-xs mt-2 tracking-widest uppercase">
              {build.subtitle}
            </p>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {Object.entries(build.stats || {}).map(([key, value]: any) => (
            <div key={key} className="space-y-1">
              <div className="flex justify-between text-xs font-mono uppercase text-gray-500">
                <span>{key.toUpperCase()}</span>
                <span>{value}%</span>
              </div>
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${value}%` }}
                  className="h-full bg-neon-red shadow-[0_0_10px_red]"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="bg-neon-red/5 p-5 rounded border border-white/10">
            <p className="text-xs text-neon-red font-mono font-black uppercase mb-2">&gt; CLASSE ATRIBUÍDA</p>
            <p className="text-2xl font-black text-white italic">{build.class}</p>
          </div>

          <div className="text-gray-300 text-[15px] leading-relaxed border-y border-white/10 py-8 italic">
            "{build.description}"
          </div>

          <div className="bg-black/70 p-5 rounded border-l-4 border-white/30">
            <p className="text-xs text-gray-500 font-mono uppercase mb-1">DESTINO FINAL:</p>
            <p className="text-sm font-bold text-gray-200">{build.final_fate}</p>
          </div>

          <div className="p-5 rounded bg-neon-blue/5 border border-neon-blue/30">
            <p className="text-xs text-neon-blue font-mono font-black uppercase mb-2">CONSELHO DO NARRADOR SÁDICO:</p>
            <p className="text-sm text-neon-blue italic">{build.advice}</p>
          </div>
        </div>
      </div>

      <div className="flex w-full max-w-lg gap-4 mt-10">
        <button 
          onClick={handleDownload}
          className="flex-1 bg-white text-black font-black py-4 rounded hover:bg-neon-blue hover:text-white transition-all uppercase tracking-widest"
        >
          EXPORTAR MERDESTINO
        </button>
        <button 
          onClick={reset}
          className="flex-1 bg-white/10 text-white/70 font-black py-4 rounded hover:bg-white/20 hover:text-white transition-all uppercase tracking-widest"
        >
          NOVO LOSS
        </button>
      </div>
    </motion.div>
  );
}