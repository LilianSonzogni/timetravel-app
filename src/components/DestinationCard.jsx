import { useState } from 'react'
import { motion } from 'framer-motion'

function ResponsiveImage({ images, alt }) {
  const base9_16  = images['9-16']
  const base1_1   = images['1-1']
  const base16_9  = images['16-9']

  return (
    <picture className="w-full h-full">
      {/* Mobile portrait: < 640px → 9:16 */}
      <source media="(max-width: 639px)" srcSet={`${base9_16}.webp`}  type="image/webp" />
      <source media="(max-width: 639px)" srcSet={`${base9_16}.png`} />

      {/* Tablet: 640px–1023px → 1:1 */}
      <source media="(max-width: 1023px)" srcSet={`${base1_1}.webp`}  type="image/webp" />
      <source media="(max-width: 1023px)" srcSet={`${base1_1}.png`} />

      {/* Desktop: ≥ 1024px → 16:9 (WebP first) */}
      <source srcSet={`${base16_9}.webp`} type="image/webp" />

      <img
        src={`${base16_9}.png`}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover"
      />
    </picture>
  )
}

export default function DestinationCard({ destination, index }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.article
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className={`relative bg-dark-card border border-gold/20 overflow-hidden group cursor-pointer transition-all duration-500 ${
        hovered ? 'card-glow-hover border-gold/50' : 'card-glow'
      }`}
    >
      {/* Responsive image container — portrait on mobile, square on tablet, widescreen on desktop */}
      <div className="relative aspect-[9/16] sm:aspect-square lg:aspect-video overflow-hidden">
        <motion.div
          className="w-full h-full"
          animate={{ scale: hovered ? 1.08 : 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <ResponsiveImage images={destination.images} alt={destination.title} />
        </motion.div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-card via-dark-card/20 to-transparent" />

        {/* Era Badge */}
        <div className="absolute top-4 left-4">
          <span className="font-body text-[10px] tracking-[0.35em] uppercase px-3 py-1.5 border border-gold/60 text-gold bg-dark/70 backdrop-blur-sm">
            {destination.era}
          </span>
        </div>

        {/* Shimmer on hover */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0, x: hovered ? '100%' : '-100%' }}
          transition={{ duration: 0.6 }}
          className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"
        />
      </div>

      {/* Text Content */}
      <div className="p-6 lg:p-8">
        <h3 className="font-display text-2xl lg:text-3xl font-light text-gray-100 mb-2 leading-tight group-hover:text-gold transition-colors duration-300">
          {destination.title}
        </h3>

        <p className="font-body text-xs tracking-widest uppercase text-gold/70 mb-4">
          {destination.subtitle}
        </p>

        <div className="w-10 h-px mb-5" style={{ background: 'linear-gradient(90deg, #d4af37, transparent)' }} />

        <p className="font-body font-light text-gray-400 text-sm leading-relaxed mb-6">
          {destination.description}
        </p>

        <motion.button
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-3 font-body text-xs tracking-widest uppercase text-gold hover:text-gold-light transition-colors duration-300"
        >
          <span>En savoir plus</span>
          <motion.span
            animate={{ x: hovered ? 4 : 0 }}
            transition={{ duration: 0.3 }}
            className="text-base"
          >
            →
          </motion.span>
        </motion.button>
      </div>

      {/* Bottom gold accent line */}
      <motion.div
        animate={{ scaleX: hovered ? 1 : 0 }}
        initial={{ scaleX: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="absolute bottom-0 left-0 right-0 h-px origin-left"
        style={{ background: 'linear-gradient(90deg, #d4af37, #e8cc6a, #a88a1f)' }}
      />
    </motion.article>
  )
}
