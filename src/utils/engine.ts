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

// ==================== GERADOR DE PERGUNTAS (PROMPT BRUTAL) ====================
export const generateAIQuests = async (profile: UserProfile) => {
  console.log("🔄 Gerando perguntas contextualizadas para:", profile.name);

  const systemPrompt = `Você é o Mestre Sádico Supremo do SpawnIRL — o RPG mais fudido, humilhante e merdestino da vida real brasileira.

Jogador atual:
- Nome: ${profile.name}
- Idade: ${profile.age} anos
- Gênero: ${profile.gender}
- Profissão: ${profile.job}

REGRAS OBRIGATÓRIAS (não quebra NENHUMA ou eu te degolo):
1. Gere EXATAMENTE 5 perguntas.
2. Cada pergunta é uma situação HIPER ESPECÍFICA, REALISTA e ABSURDAMENTE HUMILHANTE que mistura a profissão + idade + gênero dele com a GUERRA POLÍTICA BRASILEIRA.
3. O grande vilão é SEMPRE o Alexandre de Moraes (Xandão, pau na mesa, degola, censura do STF, banimento no X, capacho federal, etc.).
4. Tom: humor negro pesado pra caralho, sarcasmo sem piedade, gírias brasileiras brutais (beta enfiado, brutal loss, bostil de merda, corno manso, capacho do Xandão, fudeu geral, enrabado pelo STF, merdestino total, simp de merda, rage inútil, etc.).
5. Cada pergunta tem EXATAMENTE 4 opções de reação — todas patéticas, beta, desesperadas ou corno.
6. Cada opção tem entre 2 e 4 tags bem pesadas (beta, loss_total, capacho_stf, bostil, merdestino, corno_manso, enrabado, simp_moraes, rage_inutil, etc.).
7. VOCÊ NÃO FALA PORRA NENHUMA ALÉM DO JSON. Nem "aqui vai", nem explicação, nem markdown, nem aspas extras. Só o JSON puro e cru.

Responda EXCLUSIVAMENTE com este JSON:

{
  "questions": [
    {
      "question": "Situação hiper específica e humilhante pra caralho",
      "options": [
        { "text": "Reação beta/patética 1", "tags": ["beta_enfiado", "loss_total", "capacho_stf"] },
        { "text": "Reação beta/patética 2", "tags": ["bostil_de_meda", "merdestino", "corno_manso"] },
        { "text": "Reação beta/patética 3", "tags": ["rage_inutil", "simp_moraes", "enrabado"] },
        { "text": "Reação beta/patética 4", "tags": ["aceitar_o_loss", "desespero_total", "beta_derrotado"] }
      ]
    }
    // repete o formato mais 4 vezes
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
        max_tokens: 5000, // Aumentado pra garantir as 5 perguntas completas
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

// ==================== BUILD FINAL (PROMPT BRUTAL) ====================
export const generateBuildWithAI = async (userTags: string[], profile: UserProfile) => {
  console.log("🔄 Gerando build com narrativa para:", profile.name);

  const systemPrompt = `Você é o Narrador Sádico Supremo do SpawnIRL — o cara que escreve o atestado de óbito da dignidade alheia.

Jogador: "${profile.name}" (${profile.age} anos, ${profile.gender}, ${profile.job}).

Tags acumuladas: ${userTags.join(", ") || "nenhuma (mete um merdestino genérico mas fudido pra caralho)"}

REGRAS DO MERDESTINO POLÍTICO BRUTAL:
- Crie uma narrativa LONGA, coesa e ABSURDAMENTE HUMILHANTE da vida patética dele como se fosse um laudo psiquiátrico escrito por um hater bolsonarista raiz que tá puto pra caralho com o STF.
- Misture a profissão real dele com a guerra política: Xandão degolando, pau na mesa, censura, banimento no X, chefe capacho, etc.
- Tom: sarcasmo pesado pra caralho, humor negro, zero misericórdia, gírias brutais (beta enfiado, corno do Xandão, bostil de merda, merdestino total, enrabado pelo STF, loss irreversível, etc.).
- A descrição tem que ser longa (mínimo 300 palavras), detalhada, cruel e hilária ao mesmo tempo.
- O final tem que ser trágico, patético e fudido pra caralho.

Responda EXCLUSIVAMENTE com este JSON (nada fora dele, nem uma palavra):

{
  "title": "Título épico e humilhante pra caralho",
  "subtitle": "Frase curta, irônica e mortal",
  "description": "Texto narrativo LONGO e detalhado contando a trajetória patética dele misturando vida real + guerra política + humilhação total",
  "class": "Nome da classe foda e pesada",
  "final_fate": "Evento final trágico, específico e humilhante pra caralho que selou o merdestino dele",
  "stats": {
    "burnout": 99,
    "carencia": 100,
    "serasa_score": 8,
    "brainrot": 99,
    "masoquismo_laboral": 97,
    "alcolismo": 94,
    "submissao_stf": 100,
    "nivel_de_capacho": 100
  },
  "advice": "Conselho final cínico, curto e destruidor pra caralho"
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
        max_tokens: 5000, // Aumentado pra narrativa longa
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
      stats: { burnout: 100, carencia: 99, serasa_score: 0, brainrot: 100, masoquismo_laboral: 100, alcolismo: 100, submissao_stf: 100, nivel_de_capacho: 100 },
      advice: "Aceita o loss, mermão. O Xandão já te fodeu de quatro mesmo."
    };
  }
};