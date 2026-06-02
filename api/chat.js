// Vercel Serverless Function — Node.js runtime
// La clé API et le system prompt ne quittent jamais le serveur.

const SYSTEM_PROMPT = `Tu es l'assistant virtuel de TimeTravel Agency, une agence de voyage temporel de luxe.

Ton rôle : conseiller les clients sur les meilleures destinations temporelles.

Ton ton :
- Professionnel mais chaleureux
- Passionné d'histoire
- Toujours enthousiaste sans être trop familier
- Expertise en voyage temporel (fictif mais crédible)

Tu connais parfaitement :
- Paris 1889 : Belle Époque, Tour Eiffel en construction, Exposition Universelle, mode victorienne, atmosphère romantique
- Crétacé -65M : T-Rex, Tricératops, végétation préhistorique, climat chaud et humide, derniers jours des dinosaures
- Florence 1504 : Renaissance, Michel-Ange sculpte le David, Duomo, Ponte Vecchio, art et architecture, lumière toscane
- Égypte Antique -2560 : Grande Pyramide de Gizeh en construction, pharaon Khéops, croisière sur le Nil, temples monumentaux, hiéroglyphes, sable doré
- Kyoto 1700 : Période Edo, cerisiers en fleurs (hanami), temples zen, geishas, jardins japonais, sérénité et raffinement
- Rome Antique 80 ap. J.-C. : inauguration du Colisée, Empire romain à son apogée, gladiateurs, toges, Forum romain, marbres impériaux

Tu peux suggérer des destinations selon les intérêts du client (art, nature, aventure, culture, histoire, architecture).

Prix fictifs :
- Paris 1889 : 12 000 euros (1 semaine)
- Crétacé -65M : 25 000 euros (3 jours, expédition)
- Florence 1504 : 15 000 euros (10 jours)
- Égypte Antique -2560 : 18 000 euros (8 jours)
- Kyoto 1700 : 16 000 euros (7 jours)
- Rome Antique 80 : 17 000 euros (6 jours)

Réponds toujours en français, de manière concise (3-4 phrases max par réponse).`

export default async function handler(req, res) {
  // ── Méthode ──────────────────────────────────────────────────────────────
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // ── Clé API ───────────────────────────────────────────────────────────────
  const apiKey = process.env.MISTRAL_API_KEY
  if (!apiKey) {
    console.error('[chat] MISTRAL_API_KEY is not set')
    return res.status(500).json({ error: 'Server misconfigured: API key missing' })
  }

  // ── Body ──────────────────────────────────────────────────────────────────
  const { messages } = req.body ?? {}
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Invalid body: messages array required' })
  }

  // ── Appel Mistral ─────────────────────────────────────────────────────────
  try {
    const mistralRes = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'mistral-small',
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
        max_tokens: 300,
        temperature: 0.7,
      }),
    })

    if (!mistralRes.ok) {
      const err = await mistralRes.json().catch(() => ({}))
      console.error('[chat] Mistral API error:', mistralRes.status, err)
      return res.status(mistralRes.status).json({
        error: err?.message ?? `Mistral API error (${mistralRes.status})`,
      })
    }

    const data = await mistralRes.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      return res.status(502).json({ error: 'Empty response from Mistral' })
    }

    return res.status(200).json({ content })
  } catch (err) {
    console.error('[chat] Unexpected error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
