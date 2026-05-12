// api/build.ts
import { getBuildPrompt } from './prompts.js';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Só aceito POST.' });
  }

  const { userTags, profile } = req.body;
  
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
        messages: [{ role: "system", content: getBuildPrompt(userTags, profile) }],
        temperature: 0.85,
        max_tokens: 5000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro da xAI: ${errorText}`);
    }

    const data = await response.json();
    
    res.status(200).json(data.choices[0].message.content);
    
  } catch (error: any) {
    console.error("❌ Erro no backend (build):", error);
    res.status(500).json({ error: "O servidor da xAI fritou.", details: error.message });
  }
}