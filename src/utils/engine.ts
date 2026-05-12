// src/utils/engine.ts

// ❌ REMOVEMOS O API_KEY E O MODELO DAQUI! 
// Eles agora moram exclusivamente no backend (Serverless Functions) para evitar roubo.

export interface UserProfile {
  name: string;
  age: string;
  gender: string;
  job: string;
  city: string;
  maritalStatus: string;
  salaryLevel: string;
}

// ==================== PARSE ROBUSTO ====================
// O tratador de JSON fica no frontend para limpar a resposta caso o servidor mande sujeira
const parseSafeJSON = (text: string) => {
  try {
    const first = text.indexOf('{');
    const last = text.lastIndexOf('}');
    if (first === -1 || last === -1) throw new Error("Sem JSON");
    
    let jsonString = text.substring(first, last + 1);
    jsonString = jsonString.replace(/```json\n?/g, '').replace(/```/g, '').trim();
    
    const parsed = JSON.parse(jsonString);
    const questions = parsed.questions || parsed.questoes || parsed.perguntas || parsed;
    
    return Array.isArray(questions) ? questions : parsed;
  } catch (e) {
    console.error("❌ Parse falhou. Conteúdo recebido:", text);
    return null;
  }
};

// ==================== CHAMADAS DA API ====================
export const generateAIQuests = async (profile: UserProfile) => {
  console.log("🔄 Pedindo para o servidor gerar perguntas para:", profile.name);

  try {
    // Aponta para a SUA rota segura na Vercel
    const response = await fetch("/api/quests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // Passamos apenas os dados do usuário, sem prompts e sem chaves
      body: JSON.stringify(profile), 
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const rawContent = await response.json();
    return parseSafeJSON(rawContent);
  } catch (error) {
    console.error("❌ Erro nas perguntas:", error);
    alert("O servidor backend fritou. Tente novamente.");
    return null;
  }
};

export const generateBuildWithAI = async (userTags: string[], profile: UserProfile) => {
  console.log("🔄 Pedindo para o servidor gerar o laudo de:", profile.name);

  try {
    // Aponta para a SUA rota segura na Vercel
    const response = await fetch("/api/build", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userTags, profile }),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const rawContent = await response.json();
    const parsed = parseSafeJSON(rawContent);

    if (!parsed || !parsed.title) throw new Error("JSON inválido");
    return parsed;
  } catch (error) {
    console.error("Erro na Build:", error);
    return {
      title: "Merdestino Catastrófico",
      subtitle: `${profile.name} virou meme eterno`,
      description: "Sua vida é tão loss que a conexão caiu antes da IA terminar de rir.",
      class: "Beta Brasileiro Nível 100",
      final_fate: "Tomou timeout no servidor da vida",
      stats: { burnout: 100, carencia: 100, serasa_score: 0, brainrot: 100, masoquismo_laboral: 100, alcolismo: 100, nivel_de_loss: 100 },
      advice: "O loss foi tanto que quebrou a Vercel. Aceita o destino."
    };
  }
};