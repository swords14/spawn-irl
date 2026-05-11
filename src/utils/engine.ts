// src/utils/engine.ts
const API_KEY = import.meta.env.VITE_XAI_API_KEY;
const MODEL = "grok-4-1-raciocínio-rápido";

if (!API_KEY) {
  console.error("❌ VITE_XAI_API_KEY não encontrada no .env");
}

// ==================== FALLBACK (5 perguntas boas) ====================
const fallbackQuests = [
  {
    id: "q1",
    question: "Qual seu nível de corno atual, Latrocínio da Silva?",
    options: [
      { text: "Sou corno profissional nível Deus", tags: ["corno_feliz", "beta_max"] },
      { text: "Ainda estou no denial", tags: ["beta", "carente"] },
      { text: "Eu traio primeiro (mentira kkk)", tags: ["rage", "caotico"] },
      { text: "Sou virgem, nem isso eu consigo", tags: ["patetico", "depressao"] }
    ]
  },
  {
    id: "q2",
    question: "O agiota tá na porta, o que você faz?",
    options: [
      { text: "Peço desculpa e ofereço o cu pra pagar", tags: ["masoquista", "beta"] },
      { text: "Grito RECEBA e tomo porrada", tags: ["rage", "caotico"] },
      { text: "Finjo que não tô em casa", tags: ["patetico", "npc"] },
      { text: "Pago no Pix e choro depois", tags: ["sofrencia", "perdedor"] }
    ]
  },
  {
    id: "q3",
    question: "Qual seu final de semana ideal?",
    options: [
      { text: "Beber até vomitar sangue vendo Tigresa VIP", tags: ["alcoholic", "depressao"] },
      { text: "Mandar áudio chorando pra ex", tags: ["carente", "patetico"] },
      { text: "Maratonar Luva de Pedreiro sem tomar banho", tags: ["brainrot", "nostalgico_fracassado"] },
      { text: "Ir pra festa e acordar sendo processado", tags: ["caotico", "preso_futuro"] }
    ]
  },
  {
    id: "q4",
    question: "Qual vai ser seu futuro financeiro?",
    options: [
      { text: "Devendo 200k pro agiota", tags: ["perdedor", "realidade_br"] },
      { text: "Uber com Gol 2008 quebrado", tags: ["humilhado", "beta"] },
      { text: "React de Bluezao ganhando R$4 por mês", tags: ["brainrot", "famoso_fracassado"] },
      { text: "Sócio do Monark e ainda mais pobre", tags: ["esquisito", "preso_futuro"] }
    ]
  },
  {
    id: "q5",
    question: "Como você acha que vai morrer?",
    options: [
      { text: "Overdose de cachaça + Rivotril", tags: ["depressao", "alcoholic"] },
      { text: "Sozinho, descoberto depois de 2 meses", tags: ["patetico", "sofrencia"] },
      { text: "Levando tiro indo comprar cigarro", tags: ["rage", "realidade_br"] },
      { text: "Suicídio vendo a ex com o Neymar", tags: ["carente", "masoquista"] }
    ]
  }
];

// ==================== GERADOR DE PERGUNTAS ====================
export const generateAIQuests = async (userName: string) => {
  const systemPrompt = `Gere 5 perguntas ácidas para ${userName}. Responda apenas com JSON.`;

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
        max_tokens: 900,
      }),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    const content = data.choices[0].message.content;
    const parsed = JSON.parse(content);

    return parsed.questions || parsed;
  } catch (error) {
    console.error("API falhou → usando fallback:", error);
    return fallbackQuests;
  }
};

// ==================== GERADOR DA BUILD FINAL ====================
export const generateBuildWithAI = async (userTags: string[], userName: string = "seu corno") => {
  // ... (mantive a versão anterior que estava funcionando)
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
      description: "Você é um latrocínio da silva ambulante.",
      class: "Beta Sem Salvação",
      final_fate: "Morte solitária no quarto alugado",
      stats: { carencia: 99, sofrencia: 100, rage: 40, brainrot: 95, masoquismo: 88, alcolismo: 92 },
      advice: "Aceita o loss, seu corno."
    };
  }
};