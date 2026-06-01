import { motion } from 'framer-motion'

const footerLinks = {
  navigation: [
    { label: 'Accueil', href: '#accueil' },
    { label: 'Destinations', href: '#destinations' },
    { label: 'À Propos', href: '#apropos' },
    { label: 'Contact', href: '#contact' },
  ],
  legal: [
    { label: 'Mentions légales', href: '#' },
    { label: 'Politique de confidentialité', href: '#' },
    { label: 'CGV', href: '#' },
  ],
  social: [
    { label: 'Instagram', href: '#' },
    { label: 'LinkedIn', href: '#' },
    { label: 'X / Twitter', href: '#' },
  ],
}

const handleNavClick = (e, href) => {
  if (href.startsWith('#') && href.length > 1) {
    e.preventDefault()
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }
}

export default function Footer() {
  return (
    <footer id="contact" className="relative bg-dark border-t border-gold/10">
      {/* Top gold line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, #d4af37 30%, #d4af37 70%, transparent)' }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-5">
              <span className="font-display text-2xl font-light tracking-[0.15em] uppercase text-gray-100">
                Time<span className="gold-gradient-text font-medium">Travel</span>
              </span>
              <div className="font-body text-[10px] tracking-[0.5em] uppercase text-gold/60 mt-1">
                Agency
              </div>
            </div>
            <p className="font-body font-light text-gray-500 text-sm leading-relaxed max-w-xs">
              L'excellence du voyage dans le temps depuis 2018. Votre histoire, notre passion.
            </p>

            {/* Social */}
            <div className="flex gap-4 mt-6">
              {footerLinks.social.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className="w-9 h-9 border border-gold/20 flex items-center justify-center text-gold/40 hover:text-gold hover:border-gold/60 transition-all duration-300 font-body text-xs"
                  title={s.label}
                >
                  {s.label[0]}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-body text-[10px] tracking-[0.4em] uppercase text-gold/60 mb-6">Navigation</h4>
            <ul className="flex flex-col gap-3">
              {footerLinks.navigation.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="font-body text-sm text-gray-500 hover:text-gold transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-body text-[10px] tracking-[0.4em] uppercase text-gold/60 mb-6">Informations</h4>
            <ul className="flex flex-col gap-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="font-body text-sm text-gray-500 hover:text-gold transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact CTA */}
          <div>
            <h4 className="font-body text-[10px] tracking-[0.4em] uppercase text-gold/60 mb-6">Réservations</h4>
            <p className="font-body font-light text-gray-500 text-sm leading-relaxed mb-6">
              Prêt à traverser les âges ? Contactez notre équipe de conseillers temporels.
            </p>
            <motion.a
              href="mailto:contact@timetravel-agency.com"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-gold inline-block text-center w-full"
            >
              <span>Prendre contact</span>
            </motion.a>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-8 border-t border-gold/10 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <p className="font-body text-xs text-gray-600">
            © 2026 TimeTravel Agency. Tous droits réservés.
          </p>
          <p className="font-body text-xs text-gray-700 italic">
            Le temps est votre destination.
          </p>
        </div>
      </div>
    </footer>
  )
}
