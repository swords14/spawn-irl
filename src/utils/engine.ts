// src/utils/engine.ts
const API_KEY = import.meta.env.VITE_XAI_API_KEY;
const MODEL = "grok-4.3";

if (!API_KEY) {
  console.error("❌ VITE_XAI_API_KEY não encontrada no .env");
}

// ==================== PARSE ROBUSTO ====================
const parseSafeJSON = (text: string) => {
  try {
    const first = text.indexOf('{');
    const last = text.lastIndexOf('}');
    if (first === -1 || last === -1) throw new Error("Sem JSON");

    let jsonString = text.substring(first, last + 1);
    jsonString = jsonString.replace(/```json|```/g, '').trim();

    const parsed = JSON.parse(jsonString);

    // Normaliza diferentes chaves que o Grok pode retornar nas perguntas
    const questions = parsed.questions || parsed.questoes || parsed.perguntas || parsed;
    return Array.isArray(questions) ? questions : parsed;
  } catch (e) {
    console.error("❌ Parse falhou:", text);
    return null;
  }
};

// ==================== GERADOR DE PERGUNTAS ====================
export const generateAIQuests = async (userName: string) => {
  console.log("🔄 Gerando perguntas para:", userName);

  const systemPrompt = `Você é o Mestre Sádico do SpawnIRL.

Gere **exatamente 5 perguntas** de múltipla escolha extremamente ácidas para "${userName}".

**REGRAS RÍGIDAS** (não quebre):
- Humor negro pesado, vulgar e humilhante.
- Responda **APENAS** com este JSON exato, sem nenhuma palavra fora dele:

{
  "questions": [
    {
      "id": "q1",
      "question": "Pergunta aqui?",
      "options": [
        { "text": "Opção 1", "tags": ["corno", "virgem"] },
        { "text": "Opção 2", "tags": ["bostil", "perdedor"] },
        { "text": "Opção 3", "tags": ["luva de pedreiro", "agiota"] },
        { "text": "Opção 4", "tags": ["brainrot", "fracassado"] }
      ]
    }
  ]
}`;

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
        temperature: 0.85,
        max_tokens: 1400,
      }),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    const content = data.choices[0].message.content;
    console.log("Resposta bruta (perguntas):", content);

    const parsed = parseSafeJSON(content);
    return parsed;
  } catch (error) {
    console.error("❌ Erro nas perguntas:", error);
    alert("Grok não conseguiu gerar as perguntas. Tente novamente.");
    return null;
  }
};

// ==================== BUILD FINAL ====================
export const generateBuildWithAI = async (userTags: string[], userName: string = "seu corno") => {
  console.log("🔄 Gerando build para:", userName);

  // Injetando o formato exato que o ResultScreen.tsx precisa ler
  const systemPrompt = `Você é o Narrador Sádico Supremo do SpawnIRL.
Destrua "${userName}" de forma brutal e engraçada.

**REGRAS RÍGIDAS**:
- Use humor negro, referências a "loss", "bostil" e subcelebridades.
- Responda **APENAS** com este JSON exato, sem nenhuma palavra fora dele:

{
  "title": "Título pesado da build",
  "subtitle": "Frase curta e humilhante",
  "description": "Texto narrativo longo, sujo e destruidor contando o fracasso da vida dele",
  "class": "Nome da classe (ex: Beta Terminal)",
  "final_fate": "Como ele vai morrer ou terminar",
  "stats": {
    "carencia": 99,
    "sofrencia": 100,
    "rage": 40,
    "brainrot": 95,
    "masoquismo": 88,
    "alcolismo": 92
  },
  "advice": "Conselho final sarcástico"
}`;

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
          { role: "user", content: `Gere a build final para "${userName}". Utilize estas tags de fracasso como base: ${userTags.join(", ")}` }
        ],
        temperature: 0.92,
        max_tokens: 1200,
      }),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    const content = data.choices[0].message.content;
    console.log("Resposta bruta (build):", content);

    const parsed = parseSafeJSON(content);
    
    // Validação extra: se a IA não retornar o title, disparamos o erro para cair no fallback
    if (!parsed || !parsed.title) {
       throw new Error("O JSON retornado não tem a estrutura correta.");
    }
    
    return parsed;
  } catch (error) {
    console.error("Erro na Build:", error);
    return {
      title: "Merdestino Absoluto",
      subtitle: `${userName} nasceu pra ser bostil`,
      description: "Sua vida é uma tragédia ambulante. A IA nem se deu ao trabalho de calcular o tamanho do seu prejuízo.",
      class: "Beta Sem Salvação",
      final_fate: "Morte solitária no quarto alugado",
      stats: { carencia: 99, sofrencia: 100, rage: 40, brainrot: 95, masoquismo: 88, alcolismo: 92 },
      advice: "Aceita o loss, seu corno."
    };
  }
};