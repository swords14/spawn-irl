import { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { generateBuildWithAI } from '../utils/engine';
import { LoadingScreen } from './LoadingScreen';
import { motion } from 'framer-motion';

export function ResultScreen() {
  // 1. Puxando todos os dados do novo perfil do Zustand
  const { userName, userAge, userGender, userJob, userTags, reset } = useStore();
  const [build, setBuild] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 2. Montando o objeto que a engine atualizada exige
    const userProfile = { 
      name: userName, 
      age: userAge, 
      gender: userGender, 
      job: userJob 
    };

    // 3. Passando as tags e o perfil completo
    generateBuildWithAI(userTags, userProfile).then(data => {
      setBuild(data);
      setLoading(false);
    });
  }, [userName, userAge, userGender, userJob, userTags]);

  if (loading) return <LoadingScreen message="Calculando seu prejuízo..." />;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center py-10 px-4">
      <div className="glass-panel w-full max-w-lg p-8 border-t-4 border-neon-red bg-black/90">
        
        <h2 className="text-4xl font-black uppercase text-neon-red italic mb-1">{build.title}</h2>
        {/* Renderizando o subtítulo que a engine gera */}
        <p className="text-gray-500 font-mono text-xs uppercase mb-6 tracking-widest">{build.subtitle}</p>

        <div className="grid grid-cols-2 gap-4 my-6">
          {Object.entries(build.stats || {}).map(([k, v]: any) => (
            <div key={k} className="bg-white/5 p-2 rounded border border-white/5">
              <p className="text-[10px] text-gray-500 uppercase">{k}</p>
              <p className="font-bold text-neon-red">{v}%</p>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <p className="text-xl font-black text-white italic uppercase">{build.class}</p>
          <p className="text-gray-400 text-sm border-y border-white/5 py-4 italic">"{build.description}"</p>
          
          {/* Adicionando o destino final para completar o laudo */}
          <div className="bg-black/50 p-4 rounded border-l-2 border-white/10">
            <p className="text-[10px] text-gray-500 font-mono uppercase mb-1">Destino Final:</p>
            <p className="text-sm font-bold text-gray-300">{build.final_fate}</p>
          </div>

          <p className="text-xs text-neon-blue font-mono mt-4 pt-2">CONSELHO: {build.advice}</p>
        </div>
      </div>
      
      <button 
        onClick={reset} 
        className="mt-8 bg-white/10 p-4 rounded text-white uppercase font-black hover:bg-white/20 transition-all w-full max-w-lg tracking-widest"
      >
        Tentar Novo Loss
      </button>
    </motion.div>
  );
}