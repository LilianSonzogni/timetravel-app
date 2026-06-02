import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { destinations } from './Destinations'

const QUESTIONS = [
  {
    question: "Quelle expérience vous attire le plus ?",
    answers: [
      { label: "L'art et la création", scores: { florence: 3, paris: 2, kyoto: 1 } },
      { label: "La nature sauvage et primitive", scores: { cretace: 3, egypte: 1 } },
      { label: "La grandeur monumentale", scores: { egypte: 3, rome: 2 } },
      { label: "Le raffinement et l'élégance", scores: { kyoto: 3, paris: 2, florence: 1 } },
    ],
  },
  {
    question: "Quelle époque vous fascine le plus ?",
    answers: [
      { label: "La préhistoire et ses mystères", scores: { cretace: 3, egypte: 1 } },
      { label: "L'Antiquité et ses empires", scores: { egypte: 3, rome: 3 } },
      { label: "La Renaissance et les arts", scores: { florence: 3, paris: 2 } },
      { label: "Les civilisations traditionnelles", scores: { kyoto: 3, florence: 1, paris: 1 } },
    ],
  },
  {
    question: "Quelle ambiance vous ressource ?",
    answers: [
      { label: "Une capitale vibrante et festive", scores: { paris: 3, rome: 2 } },
      { label: "Une nature primitive et immense", scores: { cretace: 3, egypte: 1 } },
      { label: "La sérénité et la contemplation", scores: { kyoto: 3, florence: 1 } },
      { label: "Des monuments qui défient le temps", scores: { egypte: 3, rome: 3, paris: 1 } },
    ],
  },
  {
    question: "Que rêvez-vous de vivre ?",
    answers: [
      { label: "Un événement historique unique", scores: { paris: 3, rome: 3, egypte: 2 } },
      { label: "La rencontre avec des créatures légendaires", scores: { cretace: 3 } },
      { label: "Côtoyer des génies et des légendes", scores: { rome: 3, egypte: 2, florence: 1 } },
      { label: "Une poésie visuelle intemporelle", scores: { kyoto: 3, florence: 2, paris: 1 } },
    ],
  },
]

const STATIC_DESCRIPTIONS = {
  paris: "Votre esprit artistique et votre soif de beauté vous portent naturellement vers la Belle Époque. Paris 1889 vous réserve l'inauguration de la Tour Eiffel, les bals sur les boulevards haussmanniens et une élégance de vivre incomparable — la quintessence du voyage pour les amoureux de culture et d'esthétique.",
  cretace: "Votre nature d'explorateur intrépide vous appelle vers les confins du temps. Le Crétacé vous confrontera aux derniers dinosaures dans des paysages d'une beauté primitive absolue — une expédition réservée aux esprits les plus audacieux, loin de tout ce que l'humanité a jamais connu.",
  florence: "Votre sensibilité artistique d'exception vous désigne pour la Renaissance florentine. Florence 1504, c'est croiser Michel-Ange au sortir de son atelier, voir le David tout juste achevé et absorber l'effervescence créatrice la plus intense de l'histoire humaine.",
  egypte: "Votre fascination pour la grandeur et les mystères millénaires vous conduit en Égypte Antique. Assister à l'érection de la Grande Pyramide sous le soleil implacable du désert, naviguer sur le Nil sacré — une expérience à la mesure de votre soif d'absolu.",
  kyoto: "Votre quête de sérénité et de raffinement vous mène au Japon de la période Edo. Kyoto 1700 vous offre la contemplation des cerisiers en fleurs, la méditation dans des jardins zen millénaires et la rencontre avec une civilisation d'une délicatesse incomparable.",
  rome: "Votre goût pour la grandeur et le spectacle vous place au cœur de l'Empire romain à son apogée. L'inauguration du Colisée en 80 ap. J.-C. — les clameurs de la foule, les gladiateurs, les marbres impériaux — est une expérience à la mesure d'un voyageur comme vous.",
}

function computeScores(answers) {
  const totals = { paris: 0, cretace: 0, florence: 0, egypte: 0, kyoto: 0, rome: 0 }
  answers.forEach((answerIndex, questionIndex) => {
    const scoreMap = QUESTIONS[questionIndex].answers[answerIndex].scores
    Object.entries(scoreMap).forEach(([id, pts]) => {
      totals[id] = (totals[id] || 0) + pts
    })
  })
  return totals
}

function getWinner(scores) {
  return Object.entries(scores).reduce((a, b) => (b[1] > a[1] ? b : a))[0]
}

async function fetchAIDescription(destinationTitle, answers) {
  const answerLabels = answers
    .map((ai, qi) => `${QUESTIONS[qi].question} → ${QUESTIONS[qi].answers[ai].label}`)
    .join('\n')

  const prompt = `Un voyageur vient de répondre à ce quiz de destination temporelle :\n${answerLabels}\n\nSa destination recommandée est : ${destinationTitle}.\n\nRédige une explication personnalisée (3-4 phrases max) pourquoi cette destination lui correspond parfaitement. Commence par "Votre profil de voyageur" ou une formulation équivalente.`

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10000)

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [{ role: 'user', content: prompt }] }),
      signal: controller.signal,
    })
    clearTimeout(timeout)
    if (!res.ok) return null
    const data = await res.json()
    return data.content || null
  } catch {
    clearTimeout(timeout)
    return null
  }
}

export default function Quiz() {
  const [phase, setPhase] = useState('intro')
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState([])
  const [result, setResult] = useState(null)

  async function handleAnswer(answerIndex) {
    const newAnswers = [...answers, answerIndex]
    setAnswers(newAnswers)

    if (newAnswers.length < QUESTIONS.length) {
      setCurrentQ(currentQ + 1)
      return
    }

    setPhase('loading')

    const scores = computeScores(newAnswers)
    const winnerId = getWinner(scores)
    const destination = destinations.find((d) => d.id === winnerId)

    const aiDescription = await fetchAIDescription(destination.title, newAnswers)

    setResult({
      destination,
      description: aiDescription || STATIC_DESCRIPTIONS[winnerId],
      isAI: !!aiDescription,
    })
    setPhase('result')
  }

  function restart() {
    setPhase('intro')
    setCurrentQ(0)
    setAnswers([])
    setResult(null)
  }

  function scrollToDestination(id) {
    const el = document.getElementById(`dest-${id}`)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <section id="quiz" className="py-28 lg:py-36 px-6 max-w-4xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-16">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="font-body text-xs tracking-[0.4em] uppercase text-gold/70 mb-5"
        >
          — Votre Voyage Idéal —
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-display text-5xl md:text-6xl lg:text-7xl font-light text-gray-100 leading-tight"
        >
          Trouvez Votre
          <br />
          <span className="gold-gradient-text italic font-medium">Destination</span>
        </motion.h2>

        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
          className="w-24 h-px mx-auto mt-8"
          style={{ background: 'linear-gradient(90deg, transparent, #d4af37, transparent)' }}
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="font-body font-light text-gray-400 mt-6 max-w-xl mx-auto text-base leading-relaxed"
        >
          Quatre questions pour révéler l'époque qui vous correspond.
        </motion.p>
      </div>

      {/* Quiz Body */}
      <AnimatePresence mode="wait">

        {phase === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-8"
          >
            <div className="w-20 h-20 border border-gold/30 flex items-center justify-center">
              <svg viewBox="0 0 48 48" fill="none" className="w-9 h-9 text-gold" stroke="currentColor" strokeWidth="1.5">
                <circle cx="24" cy="24" r="18" />
                <path d="M24 15v9l5.5 5.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <p className="font-body text-gray-400 text-center max-w-md leading-relaxed">
              Notre algorithme de correspondance temporelle analyse votre profil de voyageur pour vous orienter vers l'époque qui résonnera le plus avec votre sensibilité.
            </p>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setPhase('questions')}
              className="px-10 py-4 font-body text-xs tracking-[0.3em] uppercase font-semibold text-dark"
              style={{ background: 'linear-gradient(135deg, #d4af37, #e8cc6a, #a88a1f)' }}
            >
              Commencer le Quiz
            </motion.button>
          </motion.div>
        )}

        {phase === 'questions' && (
          <motion.div
            key={`q-${currentQ}`}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Progress bar */}
            <div className="flex items-center gap-4 mb-10">
              <div className="flex-1 h-px bg-white/10 relative overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 h-full"
                  style={{ background: 'linear-gradient(90deg, #d4af37, #e8cc6a)' }}
                  animate={{ width: `${(currentQ / QUESTIONS.length) * 100}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
              <span className="font-body text-xs text-gold/60 tracking-widest shrink-0">
                {currentQ + 1} / {QUESTIONS.length}
              </span>
            </div>

            {/* Question text */}
            <h3 className="font-display text-3xl md:text-4xl font-light text-gray-100 mb-10 text-center">
              {QUESTIONS[currentQ].question}
            </h3>

            {/* Answer grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {QUESTIONS[currentQ].answers.map((answer, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleAnswer(i)}
                  className="p-5 text-left border border-gold/20 bg-dark-card hover:bg-gold/5 hover:border-gold/50 transition-all duration-300 group"
                >
                  <span className="font-body text-sm font-light text-gray-300 group-hover:text-gray-100 transition-colors duration-200 leading-relaxed">
                    {answer.label}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {phase === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center gap-8 py-20"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              className="w-14 h-14 rounded-full border border-gold/20"
              style={{ borderTopColor: '#d4af37' }}
            />
            <p className="font-body text-gray-500 text-xs tracking-[0.35em] uppercase">
              Analyse de votre profil en cours…
            </p>
          </motion.div>
        )}

        {phase === 'result' && result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center gap-8"
          >
            {/* Result card */}
            <div className="w-full border border-gold/30 bg-dark-card overflow-hidden">
              {/* 16:9 destination image */}
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={`${result.destination.images['16-9']}.webp`}
                  alt={result.destination.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-card via-dark-card/20 to-transparent" />

                <div className="absolute top-4 left-4">
                  <span className="font-body text-[10px] tracking-[0.35em] uppercase px-3 py-1.5 border border-gold/60 text-gold bg-dark/70 backdrop-blur-sm">
                    {result.destination.era}
                  </span>
                </div>

                <div className="absolute top-4 right-4">
                  <span className="font-body text-[10px] tracking-[0.3em] uppercase px-3 py-1.5 text-dark font-semibold"
                    style={{ background: 'linear-gradient(135deg, #d4af37, #e8cc6a)' }}
                  >
                    Votre destination
                  </span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-display text-3xl md:text-4xl font-light text-gray-100 leading-tight">
                    {result.destination.title}
                  </h3>
                </div>
              </div>

              {/* Explanation */}
              <div className="p-6 lg:p-8">
                <div className="w-10 h-px mb-6" style={{ background: 'linear-gradient(90deg, #d4af37, transparent)' }} />
                <p className="font-body font-light text-gray-300 leading-relaxed text-base">
                  {result.description}
                </p>
                {result.isAI && (
                  <p className="mt-5 font-body text-[10px] tracking-[0.25em] uppercase text-gold/40">
                    Analyse personnalisée par IA
                  </p>
                )}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:justify-center">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => scrollToDestination(result.destination.id)}
                className="px-8 py-4 font-body text-xs tracking-[0.3em] uppercase font-semibold text-dark"
                style={{ background: 'linear-gradient(135deg, #d4af37, #e8cc6a, #a88a1f)' }}
              >
                Découvrir cette destination
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={restart}
                className="px-8 py-4 font-body text-xs tracking-[0.3em] uppercase text-gold border border-gold/30 hover:bg-gold/5 hover:border-gold/60 transition-all duration-300"
              >
                Refaire le quiz
              </motion.button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </section>
  )
}
