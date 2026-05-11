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

    const questions = parsed.questions || parsed.questoes || parsed.perguntas || parsed;
    return Array.isArray(questions) ? questions : parsed;
  } catch (e) {
    console.error("❌ Parse falhou:", text);
    return null;
  }
};

// ==================== GERADOR DE PERGUNTAS (COERENTE) ====================
export const generateAIQuests = async (userName: string) => {
  console.log("🔄 Gerando perguntas contextualizadas para:", userName);

  // PROMPT ATUALIZADO: Foco em situações cotidianas e coesão
  const systemPrompt = `Você é o Mestre de RPG do SpawnIRL, um jogo de humor ácido.

Sua missão é criar 5 situações cotidianas miseráveis para o jogador "${userName}".

**REGRAS PARA A NARRATIVA (CRÍTICO)**:
1. CRIE CENÁRIOS: Descreva uma situação específica de fracasso no Brasil (ex: encontro do Tinder desastroso, entrevista de emprego CLT 6x1, cobrador de dívida, parente pedindo dinheiro).
2. AS OPÇÕES DEVEM FAZER SENTIDO: As respostas devem ser reações diretas à situação narrada, mas com atitudes patéticas, covardes ou absurdas.
3. VARIEDADE: Não repita as mesmas piadas ou memes. Use gírias atuais (loss, gain, Serasa, Tigrinho, beta), mas com inteligência e coerência lógica.
4. Responda APENAS com o JSON exato abaixo, sem explicações:

{
  "questions": [
    {
      "id": "q1",
      "question": "Você está no ônibus lotado a caminho do seu subemprego e uma idosa pede seu lugar. O que você faz, ${userName}?",
      "options": [
        { "text": "Começa a mancar fingindo ter torcido o pé no Tigrinho.", "tags": ["mentiroso", "loss"] },
        { "text": "Cede o lugar e chora baixinho pensando na ex.", "tags": ["beta", "carente"] },
        { "text": "Finge que está dormindo enquanto ouve podcast de coach.", "tags": ["alienado", "bostil"] },
        { "text": "Levanta e aproveita para fugir do cobrador.", "tags": ["caloteiro", "desespero"] }
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
        temperature: 0.8, // <-- Baixei um pouco para melhorar o nexo lógico
        max_tokens: 1400,
      }),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    const parsed = parseSafeJSON(content);
    return parsed;
  } catch (error) {
    console.error("❌ Erro nas perguntas:", error);
    alert("Grok não conseguiu gerar as perguntas. Tente novamente.");
    return null;
  }
};

// ==================== BUILD FINAL (COERENTE) ====================
export const generateBuildWithAI = async (userTags: string[], userName: string = "seu corno") => {
  console.log("🔄 Gerando build com narrativa para:", userName);

  // PROMPT ATUALIZADO: Foco em criar uma história com começo, meio e fim trágico
  const systemPrompt = `Você é o Narrador do SpawnIRL.
Sua função é criar o laudo final da vida de "${userName}" usando as tags: ${userTags.join(", ")}.

**REGRAS PARA A NARRATIVA**:
1. Crie uma história coesa e lógica. Não jogue apenas palavras aleatórias. Explique de forma bem-humorada e sarcástica COMO as escolhas dele o levaram à ruína.
2. O texto deve parecer um atestado médico psiquiátrico escrito por um hater brasileiro.
3. Responda APENAS com este JSON:

{
  "title": "Título pesado da build",
  "subtitle": "Frase curta, irônica e humilhante",
  "description": "Texto narrativo de 2 parágrafos contando a trajetória lógica e patética da vida dele com base nas escolhas feitas.",
  "class": "Nome da classe (ex: Escravo CLT, Investidor de Pirâmide)",
  "final_fate": "O evento específico e trágico que encerra a vida dele",
  "stats": {
    "carencia": 99,
    "sofrencia": 100,
    "rage": 40,
    "brainrot": 95,
    "masoquismo": 88,
    "alcolismo": 92
  },
  "advice": "Conselho final cínico"
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
          { role: "user", content: `Escreva o laudo final para "${userName}".` }
        ],
        temperature: 0.85, // <-- Baixado para focar na história
        max_tokens: 1200,
      }),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    const parsed = parseSafeJSON(content);
    
    if (!parsed || !parsed.title) {
       throw new Error("O JSON retornado não tem a estrutura correta.");
    }
    
    return parsed;
  } catch (error) {
    console.error("Erro na Build:", error);
    return {
      title: "Falha Catastrófica",
      subtitle: `${userName} quebrou o sistema`,
      description: "A sua mediocridade foi tanta que travou os servidores da IA. Não há laudo capaz de descrever isso.",
      class: "Erro 404 de Dignidade",
      final_fate: "Esquecido em um banco de dados corrompido",
      stats: { carencia: 99, sofrencia: 100, rage: 40, brainrot: 95, masoquismo: 88, alcolismo: 92 },
      advice: "Aceita o bug, irmão."
    };
  }
};