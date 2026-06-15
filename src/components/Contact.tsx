import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

export default function Contact() {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    details: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsError(false);
    setIsSent(false);
    
    try {
      const response = await fetch('https://formspree.io/f/mzdqyqeg', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setIsSent(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          details: ''
        });
        setTimeout(() => setIsSent(false), 4000);
      } else {
        setIsError(true);
      }
    } catch (error) {
      setIsError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="w-full px-5 py-16 md:py-24 relative z-10 border-b border-tokyo-purple/10 overflow-hidden">
      {/* Background Dot Grid */}
      <div className="tokyo-dot-grid" />

      <div className="w-full max-w-310 mx-auto grid grid-cols-12 gap-5 relative z-10">
        
        {/* Centered Contact Form and Direct reach out */}
        <div className="col-span-12 lg:col-span-8 lg:col-start-3 xl:col-span-6 xl:col-start-4 flex flex-col justify-between">
          <div>
            <motion.h2 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl sm:text-5xl font-extrabold text-fg-light tracking-tight tokyo-title-shadow mb-2 text-center"
            >
              {t('contactTitle')}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-sm sm:text-base text-fg-medium tokyo-desc-shadow mb-10 text-center"
            >
              {t('contactSubtitle')}
            </motion.p>

            <form onSubmit={handleSubmit} className="space-y-7">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-fg-comment mb-2 select-none">
                    {t('contactLabelName')}
                  </label>
                  <input 
                    required 
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={String(t('contactPlaceName'))} 
                    className="w-full border-0 border-b border-tokyo-purple/20 bg-transparent py-2.5 text-sm text-fg-light placeholder:text-fg-comment/50 focus:outline-none focus:border-theme-accent transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-fg-comment mb-2 select-none">
                    {t('contactLabelEmail')}
                  </label>
                  <input 
                    required 
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={String(t('contactPlaceEmail'))} 
                    className="w-full border-0 border-b border-tokyo-purple/20 bg-transparent py-2.5 text-sm text-fg-light placeholder:text-fg-comment/50 focus:outline-none focus:border-theme-accent transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-fg-comment mb-2 select-none">
                  {t('contactLabelPhone')}
                </label>
                <input 
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder={String(t('contactPlacePhone'))} 
                  className="w-full border-0 border-b border-tokyo-purple/20 bg-transparent py-2.5 text-sm text-fg-light placeholder:text-fg-comment/50 focus:outline-none focus:border-theme-accent transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-fg-comment mb-2 select-none">
                  {t('contactLabelDetails')}
                </label>
                <textarea 
                  required 
                  rows={3}
                  name="details"
                  value={formData.details}
                  onChange={handleChange}
                  placeholder={String(t('contactPlaceDetails'))} 
                  className="w-full border-0 border-b border-tokyo-purple/20 bg-transparent py-2.5 text-sm text-fg-light placeholder:text-fg-comment/50 focus:outline-none focus:border-theme-accent transition-colors resize-none"
                />
              </div>

              <div className="flex flex-col items-center pt-2">
                <button 
                  type="submit" 
                  disabled={isSubmitting || isSent}
                  className="flex items-center gap-2 bg-theme-accent text-bg-deep font-extrabold px-8 py-3.5 rounded-xl transition-all duration-300 hover:shadow-[0_0_15px_var(--theme-accent-shadow)] disabled:opacity-60 cursor-pointer select-none"
                >
                  <span>
                    {isSent 
                      ? (language === 'es' ? '¡Enviado!' : 'Sent!') 
                      : isSubmitting 
                        ? (language === 'es' ? 'Enviando...' : 'Sending...') 
                        : t('contactSubmit')}
                  </span>
                  {!isSent && !isSubmitting && (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  )}
                </button>
                {isError && (
                  <p className="text-xs text-tokyo-hot-pink font-semibold text-center mt-3">
                    {language === 'es' 
                      ? 'Hubo un problema al enviar el formulario. Por favor, intenta de nuevo.' 
                      : 'There was a problem submitting the form. Please try again.'}
                  </p>
                )}
              </div>
            </form>
          </div>

          {/* Direct reach out channels */}
          <div className="mt-12 pt-8 border-t border-tokyo-purple/10 flex flex-col items-center">
            <p className="text-[10px] font-bold text-fg-comment uppercase tracking-widest mb-4 select-none text-center">
              {t('contactReachOut')}
            </p>
            <div className="flex flex-row justify-center items-center gap-4 w-full">
              <a 
                href="https://wa.me/542216173581" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-12 h-12 flex items-center justify-center rounded-xl border border-tokyo-purple/15 bg-bg-deep/40 hover:border-emerald-500/40 hover:bg-emerald-500/5 hover:scale-105 active:scale-95 transition-all duration-300 group cursor-pointer"
                title="WhatsApp"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" className="w-5 h-5 text-emerald-500 group-hover:scale-110 transition-transform duration-300">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                </svg>
              </a>

              <a 
                href="mailto:soymarcosarauz@gmail.com" 
                className="w-12 h-12 flex items-center justify-center rounded-xl border border-tokyo-purple/15 bg-bg-deep/40 hover:border-theme-accent/40 hover:bg-theme-accent-bg hover:scale-105 active:scale-95 transition-all duration-300 group cursor-pointer"
                title="Email"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" className="w-5 h-5 text-theme-accent group-hover:scale-110 transition-transform duration-300">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
              </a>

              <a 
                href="https://discord.com/users/629812608777715722" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-12 h-12 flex items-center justify-center rounded-xl border border-tokyo-purple/15 bg-bg-deep/40 hover:border-tokyo-blue/40 hover:bg-tokyo-blue/5 hover:scale-105 active:scale-95 transition-all duration-300 group cursor-pointer"
                title="Discord"
              >
                <svg className="w-5 h-5 text-tokyo-blue fill-current group-hover:scale-110 transition-transform duration-300" viewBox="0 0 127.14 96.36">
                  <path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.44,8.07C3.66,31.58-1.86,54.65,1,77.53A105.73,105.73,0,0,0,32,96.36a77.7,77.7,0,0,0,6.63-10.85,68.43,68.43,0,0,1-10.4-5c.89-.65,1.76-1.34,2.58-2a75.58,75.58,0,0,0,72.48,0c.83.71,1.69,1.4,2.58,2a68.43,68.43,0,0,1-10.4,5,77.7,77.7,0,0,0,6.63,10.85,105.73,105.73,0,0,0,31-18.83C129.87,50.75,123.82,27.82,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.83,46,53.83,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.07,46,96.07,53,91,65.69,84.69,65.69Z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
