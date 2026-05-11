// src/utils/engine.ts
const API_KEY = import.meta.env.VITE_XAI_API_KEY;
const MODEL = "grok-4-1-raciocínio-rápido";

if (!API_KEY) {
  console.error("❌ VITE_XAI_API_KEY não encontrada no .env");
}

// ==================== FALLBACK DE PERGUNTAS (caso API falhe) ====================
const fallbackQuests = [
  {
    id: "q1",
    question: "Qual seu nível de corno atual, seu bostil?",
    options: [
      { text: "Sou corno profissional nível Deus", tags: ["corno_feliz", "beta_max"] },
      { text: "Ainda estou no denial", tags: ["beta", "carente"] },
      { text: "Eu que traio primeiro", tags: ["rage", "caotico"] },
      { text: "Sou virgem, nem isso eu consigo", tags: ["patetico", "depressao"] }
    ]
  },
  {
    id: "q2",
    question: "Como você reage quando o agiota aparece na porta?",
    options: [
      { text: "Peço desculpa e ofereço o cu", tags: ["masoquista", "beta"] },
      { text: "Grito RECEBA e tomo porrada", tags: ["rage", "caotico"] },
      { text: "Finjo que não estou em casa", tags: ["patetico", "npc"] },
      { text: "Pago com Pix e choro depois", tags: ["sofrencia", "perdedor"] }
    ]
  }
  // ... (posso adicionar mais se precisar)
];

// ==================== 1. GERADOR DE PERGUNTAS DINÂMICAS ====================
export const generateAIQuests = async (userName: string) => {
  if (!API_KEY) {
    console.warn("API Key não encontrada → usando fallback");
    return fallbackQuests;
  }

  const systemPrompt = `Gere 5 perguntas ácidas e engraçadas para ${userName}. Responda apenas com JSON válido.`;

  try {
    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: "system", content: systemPrompt }],
        response_format: { type: "json_object" },
        temperature: 0.85,
        max_tokens: 800,
      }),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) throw new Error("Resposta vazia");

    const parsed = JSON.parse(content);
    return parsed.questions || parsed;
  } catch (error) {
    console.error("API falhou, usando perguntas de fallback:", error);
    return fallbackQuests;
  }
};

// ==================== 2. GERADOR DA BUILD FINAL ====================
export const generateBuildWithAI = async (userTags: string[], userName: string = "seu corno") => {
  // (mantive sua versão anterior aqui - está boa)
  const systemPrompt = `Você é o Narrador Sádico Supremo do SpawnIRL. Destrua o usuário sem piedade.`;

  const userPrompt = `Destrua "${userName}" com as tags: ${userTags.join(", ")}. Retorne apenas JSON.`;

  try {
    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.95,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  } catch (error) {
    console.error("Erro na Build:", error);
    return {
      title: "Merdestino Absoluto",
      subtitle: `${userName} nasceu pra ser bostil`,
      description: "A API morreu, mas seu merdestino continua intacto.",
      class: "Beta Sem Salvação",
      final_fate: "Morte solitária no quarto alugado",
      stats: { carencia: 99, sofrencia: 100, rage: 40, brainrot: 95, masoquismo: 88, alcolismo: 92 },
      advice: "Aceita o loss, seu corno."
    };
  }
};