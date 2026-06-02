import { motion } from 'framer-motion'
import DestinationCard from './DestinationCard'

export const destinations = [
  {
    id: 'paris',
    title: 'Paris 1889 — Belle Époque',
    subtitle: 'Belle Époque',
    era: 'XIXe siècle',
    images: {
      '16-9': '/assets/images/paris_16-9',
      '1-1':  '/assets/images/paris_1-1',
      '9-16': '/assets/images/paris_9-16',
    },
    video: '/assets/videos/paris.mp4',
    description:
      "Revivez l'inauguration de la Tour Eiffel et l'effervescence de l'Exposition Universelle. Promenez-vous sur les boulevards haussmanniens dans l'élégance de la Belle Époque.",
  },
  {
    id: 'cretace',
    title: "Crétacé — 65 Millions d'Années",
    subtitle: 'Ère Mésozoïque',
    era: 'Mésozoïque',
    images: {
      '16-9': '/assets/images/cretace_16-9',
      '1-1':  '/assets/images/cretace_1-1',
      '9-16': '/assets/images/cretace_9-16',
    },
    video: '/assets/videos/cretace.mp4',
    description:
      "Observez les derniers dinosaures dans leur habitat naturel. Une expérience immersive au cœur de la préhistoire, entre fougères géantes et créatures majestueuses.",
  },
  {
    id: 'florence',
    title: 'Florence 1504 — Renaissance',
    subtitle: 'La Renaissance Florentine',
    era: 'XVIe siècle',
    images: {
      '16-9': '/assets/images/florence_16-9',
      '1-1':  '/assets/images/florence_1-1',
      '9-16': '/assets/images/florence_9-16',
    },
    video: '/assets/videos/florence.mp4',
    description:
      "Côtoyez les plus grands artistes de la Renaissance. Admirez le Duomo sous la lumière toscane et plongez dans l'âge d'or de l'art et de l'architecture.",
  },
  {
    id: 'egypte',
    title: 'Égypte Antique — 2560 av. J.-C.',
    subtitle: "L'Âge des Pharaons",
    era: 'Antiquité',
    images: {
      '16-9': '/assets/images/egypte_16-9',
      '1-1':  '/assets/images/egypte_1-1',
      '9-16': '/assets/images/egypte_9-16',
    },
    video: '/assets/videos/egypte.mp4',
    description:
      "Assistez à la construction de la Grande Pyramide de Gizeh. Naviguez sur le Nil et découvrez la splendeur monumentale de l'Égypte des pharaons, entre sable doré et ciel azur.",
  },
  {
    id: 'kyoto',
    title: 'Kyoto 1700 — Période Edo',
    subtitle: 'Le Japon Traditionnel',
    era: 'Époque Edo',
    images: {
      '16-9': '/assets/images/kyoto_16-9',
      '1-1':  '/assets/images/kyoto_1-1',
      '9-16': '/assets/images/kyoto_9-16',
    },
    video: '/assets/videos/kyoto.mp4',
    description:
      "Plongez dans la sérénité du Japon traditionnel. Contemplez les cerisiers en fleurs, les temples ancestraux et l'élégance raffinée des geishas dans un jardin zen intemporel.",
  },
  {
    id: 'rome',
    title: 'Rome Antique — 80 ap. J.-C.',
    subtitle: "L'Empire Romain",
    era: 'Antiquité Romaine',
    images: {
      '16-9': '/assets/images/rome_16-9',
      '1-1':  '/assets/images/rome_1-1',
      '9-16': '/assets/images/rome_9-16',
    },
    video: '/assets/videos/rome.mp4',
    description:
      "Vivez l'inauguration du Colisée au cœur de l'Empire romain. Mêlez-vous à la foule en toge, admirez les marbres impériaux et ressentez la grandeur de la Rome éternelle.",
  },
]

export default function Destinations() {
  return (
    <section id="destinations" className="py-28 lg:py-36 px-6 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-20">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="font-body text-xs tracking-[0.4em] uppercase text-gold/70 mb-5"
        >
          — Nos Voyages —
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-display text-5xl md:text-6xl lg:text-7xl font-light text-gray-100 leading-tight"
        >
          Destinations
          <br />
          <span className="gold-gradient-text italic font-medium">d'Exception</span>
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
          Six époques soigneusement sélectionnées pour leur richesse historique et leurs expériences inoubliables.
        </motion.p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {destinations.map((dest, i) => (
          <DestinationCard key={dest.id} destination={dest} index={i} />
        ))}
      </div>
    </section>
  )
}
