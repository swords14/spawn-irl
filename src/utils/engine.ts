// Importando os arquivos e dando nomes mais descritivos para o objeto principal
import classesData from '../data/classes.json';
import spawnsData from '../data/spawns.json';
import buffsData from '../data/buffs.json';
import debuffsData from '../data/debuffs.json';
import canonEventsData from '../data/canon_events.json';
import endingsData from '../data/endings.json';

// Função utilitária para calcular o score de um item baseado nas tags do usuário
const calculateScore = (userTags: string[], itemTags: string[]) => {
  if (!itemTags || !Array.isArray(itemTags)) return 0;
  return itemTags.reduce((score, tag) => (userTags.includes(tag) ? score + 1 : score), 0);
};

// Função para pegar um item aleatório com peso (weighted random)
const getBestMatch = (userTags: string[], dataArray: any[]) => {
  // Trava de segurança: se não vier um array, retorna nulo para não quebrar a tela
  if (!dataArray || !Array.isArray(dataArray)) return null;

  const scoredItems = dataArray.map(item => {
    // Procura pelas tags na propriedade "tags" ou "tags_required" (como está no seu JSON)
    const itemTags = item.tags || item.tags_required || [];
    // Calcula o score base + um fator de aleatoriedade para não ser sempre igual
    const score = calculateScore(userTags, itemTags) + Math.random();
    return { ...item, score };
  });

  // Ordena pelo score e pega o melhor
  return scoredItems.sort((a, b) => b.score - a.score)[0];
};

export const generateBuild = (userTags: string[]) => {
  // Agora estamos passando a propriedade interna que contém o array de fato
  const characterClass = getBestMatch(userTags, classesData.classes);
  const spawn = getBestMatch(userTags, spawnsData.spawns);
  const buff = getBestMatch(userTags, buffsData.buffs);
  const debuff = getBestMatch(userTags, debuffsData.debuffs);
  // Pelo seu print, a chave do array dentro de canon_events.json se chama "events"
  const canonEvent = getBestMatch(userTags, canonEventsData.events); 
  const ending = getBestMatch(userTags, endingsData.endings);

  return {
    characterClass,
    spawn,
    buff,
    debuff,
    canonEvent,
    ending,
    stats: {
      aura: Math.floor(Math.random() * 10000) - 5000, // Pode ser negativa
      sanidade: Math.floor(Math.random() * 100),
      sorte: Math.floor(Math.random() * 100),
      shape: Math.floor(Math.random() * 100)
    }
  };
};