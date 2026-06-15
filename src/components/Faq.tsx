import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

interface FaqItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

function FaqItem({ question, answer, isOpen, onToggle }: FaqItemProps) {
  return (
    <div className="border border-tokyo-purple/15 bg-bg-deep/30 rounded-xl overflow-hidden transition-all duration-300 hover:border-theme-accent/30 shadow-sm">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 text-left focus:outline-none select-none cursor-pointer group"
      >
        <span className="text-sm sm:text-base font-bold text-fg-light group-hover:text-theme-accent transition-colors">
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="text-theme-accent shrink-0 ml-4"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-4 h-4 sm:w-5 sm:h-5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-5 pb-5 text-xs sm:text-sm text-fg-medium leading-relaxed border-t border-tokyo-purple/5 pt-3 bg-bg-deep/10">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Faq() {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqItems = [
    { qKey: 'faqQ1', aKey: 'faqA1' },
    { qKey: 'faqQ2', aKey: 'faqA2' },
    { qKey: 'faqQ3', aKey: 'faqA3' },
    { qKey: 'faqQ4', aKey: 'faqA4' }
  ];

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="w-full px-5 py-16 md:py-24 relative z-10 border-b border-tokyo-purple/10 overflow-hidden">
      {/* Background Dot Grid */}
      <div className="tokyo-dot-grid" />

      <div className="w-full max-w-310 mx-auto grid grid-cols-12 gap-5 relative z-10">
        
        {/* Title Block */}
        <div className="col-span-12 text-center mb-10">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-5xl font-extrabold text-fg-light tracking-tight tokyo-title-shadow mb-2"
          >
            {t('faqTitle')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-sm sm:text-base text-fg-medium tokyo-desc-shadow max-w-2xl mx-auto"
          >
            {t('faqSubtitle')}
          </motion.p>
        </div>

        {/* FAQ List (Centered 8 columns layout) */}
        <div className="col-span-12 lg:col-span-8 lg:col-start-3 xl:col-span-6 xl:col-start-4 space-y-4">
          {faqItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <FaqItem
                question={String(t(item.qKey as any))}
                answer={String(t(item.aKey as any))}
                isOpen={openIndex === index}
                onToggle={() => handleToggle(index)}
              />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
