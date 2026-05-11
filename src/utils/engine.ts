import db from '../data/database.json';

// Função auxiliar para pegar um item aleatório de um array
const getRandomItem = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];

export const generateBuild = (userTags: string[]) => {
  // 1. Achar a melhor Classe
  let bestClass = db.classes[0];
  let maxScore = -1;

  db.classes.forEach((cls) => {
    let score = 0;
    cls.requirements.forEach(req => {
      if (userTags.includes(req)) score++;
    });

    // Fator RNG leve para desempate
    score += Math.random() * 0.5;

    if (score > maxScore) {
      maxScore = score;
      bestClass = cls;
    }
  });

  // 2. Achar Spawn, Buffs e Debuffs filtrados pelas tags (ou aleatórios)
  const spawn = getRandomItem(db.spawns);
  
  const possibleBuffs = db.buffs.filter(b => b.tags.some(t => userTags.includes(t)));
  const buff = possibleBuffs.length > 0 ? getRandomItem(possibleBuffs) : getRandomItem(db.buffs);

  const possibleDebuffs = db.debuffs.filter(d => d.tags.some(t => userTags.includes(t)));
  const debuff = possibleDebuffs.length > 0 ? getRandomItem(possibleDebuffs) : getRandomItem(db.debuffs);

  return {
    characterClass: bestClass,
    spawn,
    buff,
    debuff,
    stats: {
      int: Math.floor(Math.random() * 100),
      cha: Math.floor(Math.random() * 100),
      lck: Math.floor(Math.random() * 100)
    }
  };
};