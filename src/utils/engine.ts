// src/utils/engine.ts
const API_KEY = import.meta.env.VITE_XAI_API_KEY;

// Modelo DIRETO ao ponto, focado em entregar o JSON sem "pensar" em voz alta
const MODEL = "grok-4-1-fast-non-reasoning";

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
    jsonString = jsonString.replace(/```json\n?/g, '').replace(/```/g, '').trim();

    const parsed = JSON.parse(jsonString);

    // Normaliza chaves de perguntas
    const questions = parsed.questions || parsed.questoes || parsed.perguntas || parsed;
    return Array.isArray(questions) ? questions : parsed;
  } catch (e) {
    console.error("❌ Parse falhou. Conteúdo recebido:", text);
    return null;
  }
};

// Definindo a interface para o perfil do usuário
export interface UserProfile {
  name: string;
  age: string;
  gender: string;
  job: string;
}

// ==================== GERADOR DE PERGUNTAS ====================
export const generateAIQuests = async (profile: UserProfile) => {
  console.log("🔄 Gerando perguntas contextualizadas para:", profile.name);

  const systemPrompt = `Você é o Mestre Sádico do SpawnIRL, um RPG brutal da vida real.

O jogador atual é:
- Nome: ${profile.name}
- Idade: ${profile.age} anos
- Gênero: ${profile.gender}
- Profissão: ${profile.job}

**REGRAS CRÍTICAS**:
1. CRIE CENÁRIOS DIRECIONADOS: Baseie as 5 perguntas NA IDADE, GÊNERO E PROFISSÃO DELE. Torne as situações extremamente específicas e humilhantes.
2. Seja sarcástico, pesado e use gírias brasileiras (loss, bostil, CLT, Serasa).
3. Cada pergunta DEVE ter 4 opções absurdas/patéticas de reação.
4. Cada opção DEVE ter um array de 'tags' classificando a atitude.
5. VOCÊ DEVE RESPONDER EXCLUSIVAMENTE COM O JSON ABAIXO E MAIS NENHUMA PALAVRA:

{
  "questions": [
    {
      "question": "Situação baseada na vida dele aqui?",
      "options": [
        { "text": "Atitude fracassada 1", "tags": ["tag1", "tag2"] },
        { "text": "Atitude beta 2", "tags": ["tag3", "tag4"] },
        { "text": "Reação desesperada 3", "tags": ["tag5"] },
        { "text": "Aceitação do loss 4", "tags": ["tag6"] }
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
        temperature: 0.8,
        max_tokens: 4000, // <-- Limite dobrado para garantir que o JSON não seja cortado
      }),
    });

    if (!response.ok) {
      const errBody = await response.json();
      console.error("🚨 Erro detalhado da xAI (Quests):", errBody);
      throw new Error(`HTTP ${response.status}`);
    }

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

// ==================== BUILD FINAL ====================
export const generateBuildWithAI = async (userTags: string[], profile: UserProfile) => {
  console.log("🔄 Gerando build com narrativa para:", profile.name);

  const systemPrompt = `Você é o Narrador do SpawnIRL.
Sua função é criar o laudo final da vida de "${profile.name}" (Idade: ${profile.age}, Gênero: ${profile.gender}, Profissão: ${profile.job}).
Use as seguintes tags que ele acumulou no jogo para basear o destino dele: ${userTags.join(", ")}.

**REGRAS PARA A NARRATIVA**:
1. Crie uma história coesa e lógica de destruição pessoal baseada na profissão e idade dele.
2. O texto deve parecer um atestado psiquiátrico escrito por um hater brasileiro.
3. VOCÊ DEVE RESPONDER EXCLUSIVAMENTE COM O JSON ABAIXO E MAIS NENHUMA PALAVRA:

{
  "title": "Título pesado e profissional da build",
  "subtitle": "Frase curta, irônica e humilhante",
  "description": "Texto narrativo longo contando a trajetória lógica e patética da vida dele com base no emprego e escolhas feitas.",
  "class": "Nome da classe focada na profissão (ex: Escravo CLT Sênior)",
  "final_fate": "O evento específico e trágico que encerra a vida dele",
  "stats": {
    "burnout": 99,
    "carencia": 100,
    "serasa_score": 40,
    "brainrot": 95,
    "masoquismo_laboral": 88,
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
        messages: [{ role: "system", content: systemPrompt }],
        temperature: 0.85,
        max_tokens: 4000, // <-- Limite dobrado aqui também
      }),
    });

    if (!response.ok) {
      const errBody = await response.json();
      console.error("🚨 Erro detalhado da xAI (Build):", errBody);
      throw new Error(`HTTP ${response.status}`);
    }

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
      subtitle: `${profile.name} quebrou o sistema`,
      description: "Sua mediocridade foi tanta que travou os servidores da IA. Não há laudo capaz de descrever isso.",
      class: "Erro 404 de Dignidade",
      final_fate: "Esquecido em um banco de dados corrompido",
      stats: { burnout: 100, carencia: 99, serasa_score: 0, brainrot: 100, masoquismo_laboral: 100, alcolismo: 100 },
      advice: "Aceita o bug, irmão."
    };
  }
};