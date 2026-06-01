import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// La clé API et le system prompt sont exclusivement côté serveur (api/chat.js).
// Ce composant n'a aucune connaissance des credentials Mistral.

const WELCOME_MESSAGE = {
  id: 'welcome',
  role: 'assistant',
  content: "Bienvenue chez TimeTravel Agency ! Je suis votre conseiller en voyages temporels. Quelle époque vous fait rêver — la Belle Époque parisienne, la Renaissance florentine, ou l'ère des dinosaures ?",
}

// ——— Sub-components ———

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 max-w-[80%]">
      <div className="w-7 h-7 flex-shrink-0 flex items-center justify-center border border-gold/40 bg-dark">
        <span className="text-gold text-xs">T</span>
      </div>
      <div className="bg-[#1e1e1e] border border-gold/10 px-4 py-3">
        <div className="flex gap-1.5 items-center h-4">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-gold/60"
              animate={{ y: [0, -5, 0] }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.15,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function MessageBubble({ message }) {
  const isUser = message.role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`flex items-end gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'} max-w-full`}
    >
      {!isUser && (
        <div className="w-7 h-7 flex-shrink-0 flex items-center justify-center border border-gold/40 bg-dark">
          <span className="text-gold text-xs font-display">T</span>
        </div>
      )}
      <div
        className={`max-w-[78%] px-4 py-3 text-sm font-body font-light leading-relaxed ${
          isUser
            ? 'text-dark bg-gold'
            : 'text-gray-200 bg-[#1e1e1e] border border-gold/10'
        }`}
        style={isUser ? { color: '#0a0a0a', fontWeight: 500 } : {}}
      >
        {message.content}
      </div>
    </motion.div>
  )
}

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  )
}

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-6 h-6">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

// ——— Main Component ———

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([WELCOME_MESSAGE])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [hasUnread, setHasUnread] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  useEffect(() => {
    if (isOpen) {
      setHasUnread(false)
      setTimeout(() => inputRef.current?.focus(), 200)
    }
  }, [isOpen])

  const sendMessage = useCallback(async () => {
    const text = input.trim()
    if (!text || isTyping) return

    setInput('')

    const userMsg = { id: Date.now(), role: 'user', content: text }
    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    setIsTyping(true)

    // Strip internal `id` field — the API only needs role + content
    const apiMessages = updatedMessages.map(({ role, content }) => ({ role, content }))

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.error ?? `HTTP ${response.status}`)
      }

      const botMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: data.content ?? "Je n'ai pas pu obtenir de réponse. Veuillez réessayer.",
      }
      setMessages((prev) => [...prev, botMsg])
      if (!isOpen) setHasUnread(true)
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'assistant',
          content: `Une erreur est survenue : ${err.message}. Vérifiez que le serveur local tourne (npm run dev:api).`,
        },
      ])
    } finally {
      setIsTyping(false)
    }
  }, [input, isTyping, messages, isOpen])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const clearConversation = () => {
    setMessages([WELCOME_MESSAGE])
    setInput('')
  }

  return (
    <>
      {/* ——— Chat Window ——— */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 flex flex-col w-[calc(100vw-2rem)] sm:w-96 h-[520px] max-h-[80vh] bg-dark-card border border-gold/20 shadow-2xl"
            style={{ boxShadow: '0 0 0 1px rgba(212,175,55,0.15), 0 24px 64px rgba(0,0,0,0.8)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gold/15 flex-shrink-0">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-2 h-2 rounded-full bg-gold"
                />
                <div>
                  <p className="font-body text-xs tracking-[0.3em] uppercase text-gold leading-none">
                    Assistant TimeTravel
                  </p>
                  <p className="font-body text-[10px] text-gray-600 mt-0.5">
                    Conseiller en voyages temporels
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={clearConversation}
                  title="Nouvelle conversation"
                  className="text-gray-600 hover:text-gold transition-colors duration-200"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-4 h-4">
                    <polyline points="23 4 23 10 17 10" />
                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                  </svg>
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-600 hover:text-gold transition-colors duration-200"
                >
                  <CloseIcon />
                </button>
              </div>
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-4 scroll-smooth">
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>

            {/* Divider */}
            <div
              className="h-px flex-shrink-0"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.15), transparent)' }}
            />

            {/* Input area */}
            <div className="px-4 py-4 flex-shrink-0">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Posez-moi vos questions sur les voyages temporels..."
                  disabled={isTyping}
                  className="flex-1 min-w-0 bg-dark border border-gold/15 text-gray-200 placeholder-gray-600 px-4 py-2.5 text-sm font-body font-light focus:outline-none focus:border-gold/40 transition-colors duration-200 disabled:opacity-50"
                />
                <motion.button
                  onClick={sendMessage}
                  disabled={isTyping || !input.trim()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-dark transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ background: 'linear-gradient(135deg, #d4af37, #e8cc6a)' }}
                >
                  <SendIcon />
                </motion.button>
              </div>
              <p className="text-[10px] text-gray-700 mt-2 text-center font-body">
                Propulsé par Mistral AI · Fictif à des fins créatives
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ——— Floating Toggle Button ——— */}
      <motion.button
        onClick={() => setIsOpen((o) => !o)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="fixed bottom-6 right-4 sm:right-6 z-50 w-14 h-14 flex items-center justify-center text-dark shadow-lg"
        style={{
          background: isOpen
            ? '#1a1a1a'
            : 'linear-gradient(135deg, #d4af37 0%, #e8cc6a 50%, #a88a1f 100%)',
          border: isOpen ? '1px solid rgba(212,175,55,0.4)' : 'none',
          boxShadow: isOpen
            ? '0 0 20px rgba(212,175,55,0.1)'
            : '0 8px 32px rgba(212,175,55,0.35)',
        }}
        aria-label={isOpen ? 'Fermer le chat' : 'Ouvrir le chat'}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="text-gold"
            >
              <CloseIcon />
            </motion.span>
          ) : (
            <motion.span
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="text-dark"
            >
              <ChatIcon />
            </motion.span>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {hasUnread && !isOpen && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 border border-dark flex items-center justify-center text-[9px] text-white font-bold"
            >
              1
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  )
}
