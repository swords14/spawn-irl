import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { generateAIQuests } from '../utils/engine';
import { LoadingScreen } from './LoadingScreen';
import { motion } from 'framer-motion';

const LOADING_MESSAGES = [
  "Analisando seu histórico duvidoso no navegador...",
  "Consultando seu CPF no Serasa...",
  "Compilando o ERP do seu fracasso...",
  "Lendo suas mensagens apagadas do WhatsApp...",
  "Calculando o winrate de Darius na sua conta...",
  "Encontrando suas dívidas com agiotas...",
  "Quase lá, a IA está com nojo dos seus dados..."
];

export function StartScreen() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [job, setJob] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  
  const { setProfile, setStep, setDynamicQuests } = useStore();

  // Efeito para rotacionar as mensagens de loading a cada 4 segundos
  useEffect(() => {
    let interval: any;
    if (loading) {
      interval = setInterval(() => {
        setLoadingMsgIdx((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleStart = async () => {
    if (name.trim() && age.trim() && gender.trim() && job.trim()) {
      setLoading(true);
      setProfile(name, age, gender, job);
      
      const quests = await generateAIQuests({ name, age, gender, job });
      
      if (quests && quests.length > 0) {
        setDynamicQuests(quests);
        setStep('quests');
      } else {
        alert("O Grok fritou. Tente novamente.");
      }
      setLoading(false);
    } else {
      alert("Preencha todos os campos para a IA poder te humilhar direito.");
    }
  };

  if (loading) return <LoadingScreen message={LOADING_MESSAGES[loadingMsgIdx]} />;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <h1 className="text-6xl font-black mb-8 text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-neon-blue">SpawnIRL</h1>
      <div className="glass-panel p-8 w-full max-w-md flex flex-col gap-4">
        
        <input 
          className="bg-black/50 border border-white/20 p-3 rounded text-white font-mono outline-none focus:border-neon-green"
          placeholder="Seu nome..." 
          value={name} onChange={(e) => setName(e.target.value)}
        />
        
        <div className="flex gap-4">
          <input 
            type="number"
            className="bg-black/50 border border-white/20 p-3 rounded text-white font-mono outline-none focus:border-neon-green w-1/3"
            placeholder="Idade" 
            value={age} onChange={(e) => setAge(e.target.value)}
          />
          <select 
            className="bg-black/50 border border-white/20 p-3 rounded text-white font-mono outline-none focus:border-neon-green w-2/3 appearance-none"
            value={gender} onChange={(e) => setGender(e.target.value)}
          >
            <option value="" disabled>Gênero...</option>
            <option value="Homem">Homem</option>
            <option value="Mulher">Mulher</option>
            <option value="Outro">Outro</option>
          </select>
        </div>

        <input 
          className="bg-black/50 border border-white/20 p-3 rounded text-white font-mono outline-none focus:border-neon-green"
          placeholder="Profissão (ex: Dev, Uber, CLT)" 
          value={job} onChange={(e) => setJob(e.target.value)}
        />

        <button onClick={handleStart} className="bg-neon-green text-black font-black py-4 mt-4 rounded uppercase hover:scale-[1.02] transition-all">
          Iniciar Humilhação
        </button>
      </div>
    </motion.div>
  );
}