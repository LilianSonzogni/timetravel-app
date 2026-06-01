import { motion } from 'framer-motion'

const features = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth="1.2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Sécurité Temporelle Garantie',
    description:
      "Chaque voyage est encadré par notre protocole de sécurité chronologique breveté, garantissant un retour intact dans votre époque d'origine.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth="1.2">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" strokeLinecap="round" />
      </svg>
    ),
    title: 'Expériences Authentiques',
    description:
      "Nous vous plongeons véritablement dans l'époque visitée : costumes d'époque, langues locales et immersion culturelle totale assurés.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth="1.2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: 'Guides Experts Certifiés',
    description:
      'Nos historiens et archéologues vous accompagnent, formés spécifiquement pour chaque époque afin de maximiser la richesse de votre voyage.',
  },
]

export default function About() {
  return (
    <section id="apropos" className="py-28 lg:py-36 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, #d4af37, transparent)' }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, #d4af37, transparent)' }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left: Text */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="font-body text-xs tracking-[0.4em] uppercase text-gold/70 mb-6"
            >
              — Notre Histoire —
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-display text-4xl md:text-5xl lg:text-6xl font-light text-gray-100 leading-tight mb-8"
            >
              L'Art du Voyage
              <br />
              <span className="gold-gradient-text italic font-medium">à Travers les Âges</span>
            </motion.h2>

            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-16 h-px mb-8 origin-left"
              style={{ background: 'linear-gradient(90deg, #d4af37, transparent)' }}
            />

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="font-body font-light text-gray-400 text-base leading-loose mb-6"
            >
              Fondée en 2018 par un collectif de physiciens et d'historiens passionnés,
              TimeTravel Agency est la première agence au monde à proposer des voyages
              temporels authentiques à une clientèle exigeante.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="font-body font-light text-gray-400 text-base leading-loose mb-10"
            >
              Notre mission est simple : rendre l'histoire vivante. Chaque destination est
              méticuleusement préparée pour vous offrir une immersion totale, dans le respect
              absolu du continuum temporel et de votre sécurité.
            </motion.p>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.5 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="btn-outline-gold"
            >
              Notre manifeste
            </motion.button>
          </div>

          {/* Right: Features */}
          <div className="flex flex-col gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.15 }}
                className="flex gap-6 group"
              >
                {/* Icon */}
                <div className="flex-shrink-0 w-14 h-14 border border-gold/30 flex items-center justify-center text-gold group-hover:bg-gold/5 group-hover:border-gold/60 transition-all duration-300">
                  {feature.icon}
                </div>

                {/* Text */}
                <div>
                  <h3 className="font-display text-xl font-light text-gray-100 mb-2 group-hover:text-gold transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="font-body font-light text-gray-500 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
