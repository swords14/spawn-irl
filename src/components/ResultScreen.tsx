import { useEffect, useState, useRef } from 'react';
import { useStore } from '../store/useStore';
import { generateBuildWithAI } from '../utils/engine';
import { LoadingScreen } from './LoadingScreen';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';

export function ResultScreen() {
  const { 
    userName, userAge, userGender, userJob, 
    userCity, userMarital, userSalary, 
    userTags, reset 
  } = useStore();
  
  const [build, setBuild] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const userProfile = { 
      name: userName, 
      age: userAge, 
      gender: userGender, 
      job: userJob,
      city: userCity,
      maritalStatus: userMarital,
      salaryLevel: userSalary
    };

    generateBuildWithAI(userTags, userProfile).then(data => {
      setBuild(data);
      setLoading(false);
    });
  }, [userName, userAge, userGender, userJob, userCity, userMarital, userSalary, userTags]);

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

  const handleSadisticDonationKofi = () => {
    alert("HAHAHA! Você realmente achou que pagar ia limpar seu nome no Serasa ou te fazer Alpha? O laudo é eterno.\n\nMas valeu pela moral, o dev agradece o café!");
    window.open("https://ko-fi.com/zed964288", "_blank");
  };

  const handlePixCopy = () => {
    navigator.clipboard.writeText("88ec5b77-409a-4e80-8190-70ded1519825");
    alert("Chave Pix (Itaú) copiada: 88ec5b77-409a-4e80-8190-70ded1519825\n\nHAHAHA! Você colou a chave, mas o seu laudo de beta continua intacto. De qualquer forma, o dev agradece a gelada!");
  };

  if (loading) return <LoadingScreen message="Calculando seu prejuízo..." />;

  if (!build) {
    return <div className="text-white text-center mt-20">Erro ao gerar build. Recarregue a página.</div>;
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
                <span>{key.replace(/_/g, ' ').toUpperCase()}</span>
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
            <p className="text-xs text-neon-blue font-mono font-black uppercase mb-2">CONSELHO DO GROK:</p>
            <p className="text-sm text-neon-blue italic">{build.advice}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col w-full max-w-lg gap-4 mt-10">
        
        {/* BOTÕES PADRÃO */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
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

        <div className="text-center font-mono text-white/50 text-xs mb-2 uppercase tracking-widest">
          💸 Pagar R$ 5 para limpar seu laudo
        </div>

        {/* BOTÕES DE SUBORNO */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={handleSadisticDonationKofi}
            className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-black py-3 rounded hover:scale-[1.02] transition-all uppercase tracking-widest shadow-[0_0_15px_rgba(234,179,8,0.3)]"
          >
            ☕ VIA KO-FI
          </button>
          
          <button 
            onClick={handlePixCopy}
            className="flex-1 bg-gradient-to-r from-teal-400 to-teal-500 text-black font-black py-3 rounded hover:scale-[1.02] transition-all uppercase tracking-widest shadow-[0_0_15px_rgba(45,212,191,0.3)]"
          >
            💠 VIA PIX (COPIAR)
          </button>
        </div>

      </div>
    </motion.div>
  );
}