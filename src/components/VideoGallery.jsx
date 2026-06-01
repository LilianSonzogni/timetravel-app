import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { destinations } from './Destinations'

function VideoCard({ destination, index }) {
  const videoRef = useRef(null)
  const containerRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [progress, setProgress] = useState(0)

  // Lazy load: inject src only when card enters viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLoaded) {
          if (videoRef.current) {
            videoRef.current.src = destination.video
          }
          setIsLoaded(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    const el = containerRef.current
    if (el) observer.observe(el)
    return () => { if (el) observer.unobserve(el) }
  }, [destination.video, isLoaded])

  // Track playback progress for the progress bar
  useEffect(() => {
    const vid = videoRef.current
    if (!vid) return
    const onTimeUpdate = () => {
      if (vid.duration) setProgress((vid.currentTime / vid.duration) * 100)
    }
    const onEnded = () => setIsPlaying(false)
    vid.addEventListener('timeupdate', onTimeUpdate)
    vid.addEventListener('ended', onEnded)
    return () => {
      vid.removeEventListener('timeupdate', onTimeUpdate)
      vid.removeEventListener('ended', onEnded)
    }
  }, [])

  const togglePlay = () => {
    const vid = videoRef.current
    if (!vid) return
    if (isPlaying) {
      vid.pause()
      setIsPlaying(false)
    } else {
      vid.play().then(() => setIsPlaying(true)).catch(() => {})
    }
  }

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, delay: index * 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="relative group overflow-hidden bg-dark-card border border-gold/20 card-glow hover:card-glow-hover hover:border-gold/40 transition-all duration-500"
    >
      {/* Video element */}
      <div className="relative aspect-video overflow-hidden">
        <video
          ref={videoRef}
          preload="none"
          loop
          muted
          playsInline
          poster={`${destination.images['16-9']}.webp`}
          className="w-full h-full object-cover"
        />

        {/* Dark overlay that fades on play */}
        <div
          className={`absolute inset-0 bg-dark/50 transition-opacity duration-500 ${
            isPlaying ? 'opacity-0' : 'opacity-100'
          }`}
        />

        {/* Play / Pause button */}
        <button
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pause' : 'Lecture'}
          className="absolute inset-0 flex items-center justify-center group/btn"
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            animate={{ opacity: isPlaying ? 0 : 1, scale: isPlaying ? 0.8 : 1 }}
            transition={{ duration: 0.3 }}
            className="w-16 h-16 border border-gold/70 flex items-center justify-center backdrop-blur-sm bg-dark/40 group-hover/btn:bg-gold/10 transition-colors duration-300"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-gold ml-0.5">
              <path d="M8 5v14l11-7z" />
            </svg>
          </motion.div>

          {/* Pause indicator (shown only while playing, on hover) */}
          {isPlaying && (
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              className="absolute flex items-center justify-center w-16 h-16 border border-gold/50 bg-dark/50 backdrop-blur-sm"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-gold">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            </motion.div>
          )}
        </button>

        {/* Era badge */}
        <div className="absolute top-4 left-4 pointer-events-none">
          <span className="font-body text-[10px] tracking-[0.35em] uppercase px-3 py-1.5 border border-gold/60 text-gold bg-dark/70 backdrop-blur-sm">
            {destination.era}
          </span>
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10">
          <div
            className="h-full bg-gold transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Info */}
      <div className="px-6 py-5 flex items-center justify-between">
        <div>
          <h3 className="font-display text-xl font-light text-gray-100 group-hover:text-gold transition-colors duration-300">
            {destination.title}
          </h3>
          <p className="font-body text-xs tracking-widest uppercase text-gold/50 mt-1">
            {destination.subtitle}
          </p>
        </div>

        {/* Loading indicator */}
        {!isLoaded && (
          <div className="w-5 h-5 border border-gold/30 border-t-gold rounded-full animate-spin" />
        )}
      </div>
    </motion.div>
  )
}

export default function VideoGallery() {
  return (
    <section id="videos" className="py-28 lg:py-36 relative overflow-hidden">
      {/* Ambient background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(212,175,55,0.04) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="font-body text-xs tracking-[0.4em] uppercase text-gold/70 mb-5"
          >
            — Aperçus Exclusifs —
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-5xl md:text-6xl lg:text-7xl font-light text-gray-100 leading-tight"
          >
            Revivez les
            <br />
            <span className="gold-gradient-text italic font-medium">Moments Clés</span>
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
            Des extraits exclusifs filmés lors de nos expéditions. Cliquez pour lancer la lecture.
          </motion.p>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {destinations.map((dest, i) => (
            <VideoCard key={dest.id} destination={dest} index={i} />
          ))}
        </div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-10 font-body text-xs text-gray-600 tracking-widest uppercase"
        >
          Les vidéos sont chargées uniquement lorsqu'elles entrent dans votre champ de vision
        </motion.p>
      </div>
    </section>
  )
}
