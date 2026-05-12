// src/utils/engine.ts
import { getQuestsPrompt, getBuildPrompt } from './prompts';

const API_KEY = import.meta.env.VITE_XAI_API_KEY;
const MODEL = "grok-4-1-fast-non-reasoning";

if (!API_KEY) {
  console.error("❌ VITE_XAI_API_KEY não encontrada no .env");
}

export interface UserProfile {
  name: string;
  age: string;
  gender: string;
  job: string;
}

// ==================== PARSE ROBUSTO ====================
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
  console.log("🔄 Gerando perguntas contextualizadas para:", profile.name);

  try {
    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: "system", content: getQuestsPrompt(profile) }],
        temperature: 0.75,
        max_tokens: 6000,
      }),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    return parseSafeJSON(data.choices[0].message.content);
  } catch (error) {
    console.error("❌ Erro nas perguntas:", error);
    alert("Grok não conseguiu gerar as perguntas. Tente novamente.");
    return null;
  }
};

export const generateBuildWithAI = async (userTags: string[], profile: UserProfile) => {
  console.log("🔄 Gerando build com narrativa para:", profile.name);

  try {
    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: "system", content: getBuildPrompt(userTags, profile) }],
        temperature: 0.85,
        max_tokens: 5000,
      }),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    const parsed = parseSafeJSON(data.choices[0].message.content);

    if (!parsed || !parsed.title) throw new Error("JSON inválido");
    return parsed;
  } catch (error) {
    console.error("Erro na Build:", error);
    return {
      title: "Merdestino Catastrófico",
      subtitle: `${profile.name} virou meme eterno`,
      description: "Sua vida é tão loss que nem o Grok conseguiu descrever direito.",
      class: "Beta Brasileiro Nível 100",
      final_fate: "Virou capa de tweet com 500k likes",
      stats: { burnout: 100, carencia: 100, serasa_score: 0, brainrot: 100, masoquismo_laboral: 100, alcolismo: 100, nivel_de_loss: 100 },
      advice: "Aceita o loss, mermão. O Brasil já te fodeu."
    };
  }
};