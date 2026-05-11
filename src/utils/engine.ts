// src/utils/engine.ts
const API_KEY = import.meta.env.VITE_XAI_API_KEY;

// Modelo escolhido: mais barato e com raciocínio
const MODEL = "grok-4-1-fast-reasoning"; 

if (!API_KEY) {
  console.error("❌ API KEY NÃO ENCONTRADA! Verifique o arquivo .env");
}

/**
 * Tenta extrair e parsear o JSON de forma agressiva,
 * ignorando textos de "reasoning" antes ou depois do JSON.
 */
const parseSafeJSON = (text: string) => {
  try {
    // 1. Encontra o primeiro colchete aberto e o último colchete fechado
    const firstBracket = text.indexOf('{');
    const lastBracket = text.lastIndexOf('}');
    
    // Se não encontrou chaves, não é um JSON válido
    if (firstBracket === -1 || lastBracket === -1) {
      throw new Error("Nenhum objeto JSON encontrado no texto.");
    }

    // 2. Extrai apenas o que está dentro das chaves (incluindo elas)
    let jsonString = text.substring(firstBracket, lastBracket + 1);

    // 3. (Opcional, mas seguro) Remove formatação markdown se houver DENTRO da string extraída
    jsonString = jsonString.replace(/```json\n?/g, '').replace(/```/g, '').trim();

    return JSON.parse(jsonString);
  } catch (e) {
    console.error("❌ Falha crítica no Parse! O JSON estava malformado ou incompleto:", text);
    return null;
  }
};

// ==================== GERADOR DE PERGUNTAS DINÂMICAS ====================
export const generateAIQuests = async (userName: string) => {
  console.log("🔄 Tentando gerar perguntas para:", userName);

  // Prompt ajustado para pedir menos "explicação"
  const systemPrompt = `Você é o Mestre Sádico do SpawnIRL.
  Gere exatamente 5 perguntas de múltipla escolha para o usuário "${userName}".
  
  REGRAS OBRIGATÓRIAS:
  1. Humor ácido e referências brasileiras (loss, Tigrinho, beta, Serasa).
  2. Cada pergunta DEVE ter 4 opções.
  3. Cada opção DEVE ter um array de 'tags' (ex: ["gado", "loss"]).
  
  VOCÊ DEVE RESPONDER EXCLUSIVAMENTE COM O JSON ABAIXO E MAIS NENHUMA PALAVRA:
  {
    "questions": [
      {
        "question": "Texto da pergunta?",
        "options": [
          { "text": "Texto da opção 1", "tags": ["tag1", "tag2"] },
          { "text": "Texto da opção 2", "tags": ["tag3"] },
          { "text": "Texto da opção 3", "tags": ["tag4"] },
          { "text": "Texto da opção 4", "tags": ["tag5"] }
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
        // response_format: { type: "json_object" } foi removido temporariamente
        // porque alguns modelos de reasoning ignoram e quebram se forçados.
        temperature: 0.8,
        max_tokens: 2000, 
      }),
    });

    if (!response.ok) {
      const errBody = await response.json();
      console.error("🚨 Erro detalhado da xAI (Quests):", errBody);
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    const rawContent = data.choices[0].message.content;
    const parsed = parseSafeJSON(rawContent);

    if (parsed && (parsed.questions || parsed.perguntas)) {
      return parsed.questions || parsed.perguntas;
    }
    
    return null;
  } catch (error) {
    console.error("❌ Erro ao gerar perguntas:", error);
    return null;
  }
};

// ==================== GERADOR DA BUILD FINAL ====================
export const generateBuildWithAI = async (userTags: string[], userName: string = "seu corno") => {
  console.log("🔄 Gerando build final para:", userName);

  const systemPrompt = `Você é o Narrador Sádico do SpawnIRL. Gere uma build cruel para "${userName}".
  
  REGRAS:
  - Baseie-se nestas tags de fracasso: ${userTags.join(", ")}.
  - Use humor negro e referências de subcelebridades brasileiras.
  
  VOCÊ DEVE RESPONDER EXCLUSIVAMENTE COM O JSON ABAIXO E MAIS NENHUMA PALAVRA:
  {
    "title": "Título pesado",
    "subtitle": "Frase curta",
    "description": "Texto longo e humilhante",
    "class": "Nome da classe",
    "final_fate": "Como ele termina",
    "stats": { "carencia": 0, "brainrot": 0, "loss": 0, "aura": 0 },
    "advice": "Conselho final"
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
          { role: "user", content: `Gere a build para ${userName} com as tags: ${userTags.join(", ")}` }
        ],
        // response_format: { type: "json_object" } removido
        temperature: 0.95,
        max_tokens: 1500, 
      }),
    });

    if (!response.ok) {
      const errBody = await response.json();
      console.error("🚨 Erro detalhado da xAI (Build):", errBody);
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    const rawContent = data.choices[0].message.content;
    const parsed = parseSafeJSON(rawContent);

    if (parsed) {
      return parsed;
    }

    throw new Error("JSON da build falhou no parse.");
  } catch (error) {
    console.error("❌ Erro na Build:", error);
    return {
      title: "Merdestino Absoluto",
      subtitle: "A IA desistiu de você",
      description: "Sua existência é tão medíocre que o sistema entrou em colapso tentando processar tanto fracasso.",
      class: "Beta Terminal",
      final_fate: "Morte por tédio em um subemprego",
      stats: { carencia: 99, brainrot: 100, loss: 100, aura: 0 },
      advice: "Não tente novamente."
    };
  }
};