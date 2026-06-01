import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1, delay, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function Hero() {
  const videoRef = useRef(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {})
    }
  }, [])

  const scrollToDestinations = () => {
    document.querySelector('#destinations')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="accueil" className="relative w-full h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        src="/assets/videos/paris.mp4"
        autoPlay
        muted
        loop
        playsInline
      />

      {/* Layered overlays */}
      <div className="absolute inset-0 bg-dark/75" />
      <div className="absolute inset-0 bg-gradient-to-b from-dark/40 via-transparent to-dark/90" />
      <div className="absolute inset-0 bg-gradient-to-r from-dark/50 via-transparent to-dark/30" />

      {/* Decorative corner lines */}
      <div className="absolute top-28 left-8 lg:left-16 w-12 h-12 border-t border-l border-gold/30" />
      <div className="absolute top-28 right-8 lg:right-16 w-12 h-12 border-t border-r border-gold/30" />
      <div className="absolute bottom-24 left-8 lg:left-16 w-12 h-12 border-b border-l border-gold/30" />
      <div className="absolute bottom-24 right-8 lg:right-16 w-12 h-12 border-b border-r border-gold/30" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        {/* Eyebrow */}
        <motion.p
          custom={0.2}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="font-body text-xs tracking-[0.4em] uppercase text-gold/80 mb-8"
        >
          — Agence de Voyage Temporel —
        </motion.p>

        {/* Main Title */}
        <motion.h1
          custom={0.5}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light leading-[1.05] text-gray-100 mb-4 text-shadow-gold"
        >
          Explorez l'Histoire,
          <br />
          <span className="gold-gradient-text italic font-medium">Réinventée</span>
        </motion.h1>

        {/* Gold separator line */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
          className="w-32 h-px mx-auto my-8"
          style={{ background: 'linear-gradient(90deg, transparent, #d4af37, transparent)' }}
        />

        {/* Subtitle */}
        <motion.p
          custom={1.1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="font-body font-light text-lg md:text-xl text-gray-300 tracking-wide mb-12 max-w-2xl mx-auto"
        >
          Voyagez dans le temps avec élégance et sécurité
        </motion.p>

        {/* CTA */}
        <motion.div
          custom={1.4}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={scrollToDestinations}
            className="btn-gold"
          >
            <span>Découvrir nos destinations</span>
          </motion.button>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        onClick={scrollToDestinations}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer group"
      >
        <span className="font-body text-[10px] tracking-[0.3em] uppercase text-gold/50 group-hover:text-gold/80 transition-colors duration-300">
          Défiler
        </span>
        <div className="w-px h-12 relative overflow-hidden bg-gold/10">
          <motion.div
            animate={{ y: ['-100%', '200%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-x-0 h-1/2 bg-gradient-to-b from-transparent to-gold"
          />
        </div>
      </motion.div>
    </section>
  )
}
