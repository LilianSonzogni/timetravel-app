/**
 * Serveur API local pour le développement.
 * Simule les Vercel Serverless Functions sur port 3001.
 * Vite proxie /api/* vers ce serveur (voir vite.config.js).
 *
 * Lancement : npm run dev:api
 *   (ou : node --env-file=.env.local scripts/local-api.js)
 *
 * Requiert Node.js >= 20.6 pour --env-file.
 * Zéro dépendance npm.
 */

import http from 'http'

const PORT = 3001
const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY

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

Tu peux suggérer des destinations selon les intérêts du client (art, nature, aventure, culture, histoire).

Prix fictifs :
- Paris 1889 : 12 000 euros (1 semaine)
- Crétacé -65M : 25 000 euros (3 jours, expédition)
- Florence 1504 : 15 000 euros (10 jours)

Réponds toujours en français, de manière concise (3-4 phrases max par réponse).`

// ── Helpers ──────────────────────────────────────────────────────────────────

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = ''
    req.on('data', (chunk) => { raw += chunk })
    req.on('end', () => {
      try { resolve(JSON.parse(raw || '{}')) } catch { reject(new Error('Invalid JSON')) }
    })
    req.on('error', reject)
  })
}

function send(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(body))
}

// ── Server ───────────────────────────────────────────────────────────────────

const server = http.createServer(async (req, res) => {
  // Strip query string for matching
  const pathname = req.url?.split('?')[0]

  if (pathname !== '/api/chat') {
    return send(res, 404, { error: 'Not found' })
  }

  if (req.method !== 'POST') {
    return send(res, 405, { error: 'Method not allowed' })
  }

  if (!MISTRAL_API_KEY) {
    console.error('[local-api] MISTRAL_API_KEY not found — add it to .env.local')
    return send(res, 500, { error: 'MISTRAL_API_KEY missing in .env.local' })
  }

  let body
  try {
    body = await readBody(req)
  } catch {
    return send(res, 400, { error: 'Invalid JSON body' })
  }

  const { messages } = body
  if (!Array.isArray(messages) || messages.length === 0) {
    return send(res, 400, { error: 'messages array required' })
  }

  try {
    const mistralRes = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${MISTRAL_API_KEY}`,
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
      console.error('[local-api] Mistral error:', mistralRes.status, err)
      return send(res, mistralRes.status, { error: err?.message ?? 'Mistral API error' })
    }

    const data = await mistralRes.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) return send(res, 502, { error: 'Empty response from Mistral' })

    console.log(`[local-api] OK — ${content.slice(0, 60)}…`)
    return send(res, 200, { content })
  } catch (err) {
    console.error('[local-api] Unexpected error:', err.message)
    return send(res, 500, { error: 'Internal server error' })
  }
})

server.listen(PORT, () => {
  const keyStatus = MISTRAL_API_KEY ? '✓ chargée' : '✗ manquante (ajouter dans .env.local)'
  console.log(`
  ┌─────────────────────────────────────────────┐
  │  Local API Server — TimeTravel Agency        │
  ├─────────────────────────────────────────────┤
  │  Écoute sur  : http://localhost:${PORT}         │
  │  Route       : POST /api/chat               │
  │  Proxy Vite  : localhost:5173/api/chat →    │
  │                localhost:${PORT}/api/chat        │
  │  Clé API     : ${keyStatus.padEnd(29)}│
  └─────────────────────────────────────────────┘
`)
})
