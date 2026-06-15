import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

export default function WhyChooseMe() {
  const { t } = useLanguage();

  const cards = [
    {
      titleKey: 'whyCard1Title',
      descKey: 'whyCard1Desc',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M21.801 10A10 10 0 1 1 17 3.335" />
          <path d="m9 11 3 3L22 4" />
        </svg>
      )
    },
    {
      titleKey: 'whyCard2Title',
      descKey: 'whyCard2Desc',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="m18 16 4-4-4-4" />
          <path d="m6 8-4 4 4 4" />
          <path d="m14.5 4-5 16" />
        </svg>
      )
    },
    {
      titleKey: 'whyCard3Title',
      descKey: 'whyCard3Desc',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <line x1="12" x2="12" y1="2" y2="22" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      )
    }
  ] as const;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <section id="why-choose-me" className="w-full px-5 py-16 md:py-24 relative z-10 border-b border-tokyo-purple/10 overflow-hidden">
      {/* Background Dot Grid */}
      <div className="tokyo-dot-grid" />

      <div className="w-full max-w-310 mx-auto grid grid-cols-12 gap-5 relative z-10">
        
        {/* Section Header */}
        <div className="col-span-12 mb-12 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-5xl font-extrabold text-fg-light tracking-tight tokyo-title-shadow mb-4"
          >
            {t('whyTitle')}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-sm sm:text-base md:text-lg text-fg-medium max-w-3xl mx-auto tokyo-desc-shadow leading-relaxed"
          >
            {t('whyDesc')}
          </motion.p>
        </div>

        {/* 3 columns grid for cards */}
        <div className="col-span-12 grid grid-cols-12 gap-5">
          {cards.map((card, index) => (
            <motion.div
              key={card.titleKey}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onMouseMove={handleMouseMove}
              className="col-span-12 md:col-span-4 group tokyo-spotlight-card backdrop-blur-xs cursor-default flex flex-col justify-between"
            >
              <div className="flex flex-col items-start relative h-full bg-bg-deep/90 p-6 rounded-[inherit] z-20 overflow-hidden">
                {/* Header Row: Icon + Title */}
                <div className="flex items-center gap-3 mb-4 w-full">
                  {/* Glowing Icon container */}
                  <div className="w-10 h-10 rounded-xl bg-theme-accent-bg border border-theme-accent-border/35 flex items-center justify-center text-theme-accent shrink-0 transition-all duration-300">
                    {card.icon}
                  </div>
                  {/* Title */}
                  <h3 className="text-base sm:text-lg font-bold text-fg-light group-hover:text-theme-accent transition-colors duration-300 leading-tight">
                    {t(card.titleKey)}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-fg-medium leading-relaxed font-medium">
                  {t(card.descKey)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
