// api/quests.ts
import { getQuestsPrompt } from './prompts.js';

export default async function handler(req: any, res: any) {
  // 1. Bloqueia qualquer tentativa que não seja um envio de dados (POST)
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Só aceito POST, beta.' });
  }

  const profile = req.body;
  
  // Puxa a chave segura configurada no painel da Vercel (sem o VITE_)
  const API_KEY = process.env.XAI_API_KEY; 
  const MODEL = "grok-4-1-fast-non-reasoning";

  if (!API_KEY) {
    console.error("❌ XAI_API_KEY não configurada na Vercel.");
    return res.status(500).json({ error: 'Erro de configuração do servidor.' });
  }

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

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro da xAI: ${errorText}`);
    }

    const data = await response.json();
    
    // Devolve o texto bruto para o React processar
    res.status(200).json(data.choices[0].message.content);
    
  } catch (error: any) {
    console.error("❌ Erro no backend (quests):", error);
    res.status(500).json({ error: "O servidor da xAI fritou.", details: error.message });
  }
}