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
  const [city, setCity] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('');
  const [salaryLevel, setSalaryLevel] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  
  const { setProfile, setStep, setDynamicQuests } = useStore();

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
      
      setProfile(name, age, gender, job, city, maritalStatus, salaryLevel);
      
      const quests = await generateAIQuests({ 
        name, age, gender, job, 
        city, maritalStatus, salaryLevel 
      });
      
      if (quests && quests.length > 0) {
        setDynamicQuests(quests);
        setStep('quests');
      } else {
        alert("O Grok fritou. Tente novamente.");
      }
      setLoading(false);
    } else {
      alert("Preencha pelo menos nome, idade, gênero e profissão. O resto é opcional, mas ajuda a zoar melhor.");
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
          
          {/* GÊNERO COM TODA A MERDA DE OPÇÕES */}
          <select 
            className="bg-black/50 border border-white/20 p-3 rounded text-white font-mono outline-none focus:border-neon-green w-2/3 appearance-none"
            value={gender} onChange={(e) => setGender(e.target.value)}
          >
            <option value="" disabled>Escolhe teu gênero...</option>
            <option value="Homem">Homem</option>
            <option value="Mulher">Mulher</option>
            <option value="Não-binário">Não-binário</option>
            <option value="Trans Homem">Trans Homem</option>
            <option value="Trans Mulher">Trans Mulher</option>
            <option value="Gênero Fluido">Gênero Fluido</option>
            <option value="Agênero">Agênero</option>
            <option value="Bigênero">Bigênero</option>
            <option value="Demigênero">Demigênero</option>
            <option value="Genderqueer">Genderqueer</option>
            <option value="Two-Spirit">Two-Spirit</option>
            <option value="Neutrois">Neutrois</option>
            <option value="Pangênero">Pangênero</option>
            <option value="Andrógino">Andrógino</option>
            <option value="Intersexo">Intersexo</option>
            <option value="Cis Homem">Cis Homem</option>
            <option value="Cis Mulher">Cis Mulher</option>
            <option value="Questionando">Questionando (ainda não sabe)</option>
            <option value="Outro">Outro (pode inventar)</option>
            <option value="Prefiro não dizer">Prefiro não dizer (medo de julgamento)</option>
          </select>
        </div>

        <input 
          className="bg-black/50 border border-white/20 p-3 rounded text-white font-mono outline-none focus:border-neon-green"
          placeholder="Profissão (ex: Dev, Uber, CLT)" 
          value={job} onChange={(e) => setJob(e.target.value)}
        />

        <input 
          className="bg-black/50 border border-white/20 p-3 rounded text-white font-mono outline-none focus:border-neon-green"
          placeholder="Cidade / Estado (ex: São Paulo, interior de MG)" 
          value={city} onChange={(e) => setCity(e.target.value)}
        />

        <select 
          className="bg-black/50 border border-white/20 p-3 rounded text-white font-mono outline-none focus:border-neon-green appearance-none"
          value={maritalStatus} onChange={(e) => setMaritalStatus(e.target.value)}
        >
          <option value="" disabled>Estado civil...</option>
          <option value="Solteiro">Solteiro</option>
          <option value="Namorando">Namorando</option>
          <option value="Casado">Casado</option>
          <option value="Divorciado">Divorciado</option>
          <option value="Em crise">Em crise com a esposa/marido</option>
          <option value="Viúvo">Viúvo (de depressão)</option>
        </select>

        <select 
          className="bg-black/50 border border-white/20 p-3 rounded text-white font-mono outline-none focus:border-neon-green appearance-none"
          value={salaryLevel} onChange={(e) => setSalaryLevel(e.target.value)}
        >
          <option value="" disabled>Nível salarial...</option>
          <option value="Apertado pra caralho">Apertado pra caralho</option>
          <option value="Médio CLT">Médio CLT</option>
          <option value="Bom mas ainda escravo">Bom mas ainda escravo</option>
          <option value="Rico mas infeliz">Rico mas infeliz</option>
        </select>

        <button onClick={handleStart} className="bg-neon-green text-black font-black py-4 mt-4 rounded uppercase hover:scale-[1.02] transition-all">
          Iniciar Humilhação
        </button>
      </div>
    </motion.div>
  );
}