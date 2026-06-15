import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

export default function AboutMe() {
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full pt-28 pb-20 relative z-10 overflow-hidden min-h-dvh flex flex-col justify-center"
    >
      {/* Background Dot Grid */}
      <div className="tokyo-dot-grid" />

      <div className="w-full max-w-310 mx-auto px-5 relative z-10">
        
        {/* Back Button */}
        <div className="mb-10 flex">
          <a
            href="#"
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-fg-comment hover:text-theme-accent transition-colors group cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform duration-300"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            <span>{t('aboutBackBtn')}</span>
          </a>
        </div>

        {/* Title */}
        <div className="mb-12 text-center lg:text-left">
          <h1 className="text-4xl sm:text-6xl font-extrabold text-fg-light tracking-tight tokyo-title-shadow mb-3 animate-pulse-slow">
            {t('aboutTitle')}
          </h1>
          <p className="text-sm sm:text-base text-fg-medium tokyo-desc-shadow max-w-2xl">
            {t('aboutSubtitle')}
          </p>
        </div>

        {/* Grid Container */}
        <div className="grid grid-cols-12 gap-y-10 lg:gap-10 items-start">
          
          {/* Col 1: Stylized Profile Card (4 columns on desktop) */}
          <div className="col-span-12 lg:col-span-4 flex flex-col items-center">
            <div className="w-full rounded-2xl border border-tokyo-purple/15 bg-bg-deep/40 p-6 flex flex-col items-center shadow-lg relative overflow-hidden group">
              {/* Inner ambient glow */}
              <div className="absolute inset-0 bg-radial-to-br from-theme-accent/5 via-transparent to-transparent pointer-events-none" />

              {/* Portrait Wrapper */}
              <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden border border-tokyo-purple/10 bg-bg-dark mb-6 relative group-hover:border-theme-accent/30 transition-colors duration-300">
                <img
                  src="/me.png"
                  alt="Marcos Arauz"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-105"
                />
              </div>

              {/* Identity details */}
              <h2 className="text-xl font-extrabold text-fg-light tracking-tight text-center mb-1">
                Marcos Arauz
              </h2>
              <p className="text-xs font-bold text-theme-accent uppercase tracking-widest text-center mb-6">
                Developer & Designer
              </p>

              {/* Roles/Capabilities capsules */}
              <div className="w-full space-y-3 pt-6 border-t border-tokyo-purple/5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-fg-comment font-medium">Ubicación / Location</span>
                  <span className="text-fg-medium font-semibold">Buenos Aires, ARG</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-fg-comment font-medium">Modalidad / Availability</span>
                  <span className="text-theme-accent font-semibold">Remote / Freelance</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-fg-comment font-medium">Idioma / Language</span>
                  <span className="text-fg-medium font-semibold">Español / English</span>
                </div>
              </div>

              {/* CTA Link to Contact */}
              <a
                href="#contact"
                className="w-full mt-8 bg-theme-accent text-bg-deep text-center font-extrabold py-3 rounded-xl hover:shadow-[0_0_15px_var(--theme-accent-shadow)] transition-all duration-300 text-xs uppercase tracking-wider cursor-pointer"
              >
                {t('navTalkButton')}
              </a>
            </div>
          </div>

          {/* Col 2: Narrative & Specializations (8 columns on desktop) */}
          <div className="col-span-12 lg:col-span-8 space-y-10">
            
            {/* Biography narrative */}
            <div className="space-y-5 text-sm sm:text-base text-fg-medium leading-relaxed font-medium">
              <h3 className="text-lg font-extrabold text-fg-light uppercase tracking-wider select-none mb-3">
                {t('aboutStoryTitle')}
              </h3>
              <p>{t('aboutStoryP1')}</p>
              <p>{t('aboutStoryP2')}</p>
              <p>{t('aboutStoryP3')}</p>
              <p>{t('aboutStoryP4')}</p>
              <p>{t('aboutStoryP5')}</p>
              <p>{t('aboutStoryP6')}</p>
            </div>

            {/* Specialization area cards */}
            <div>
              <h3 className="text-lg font-extrabold text-fg-light uppercase tracking-wider select-none mb-6">
                {t('aboutSkillsTitle')}
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                
                {/* Skill 1: UX/UI Design */}
                <div className="p-5 border border-tokyo-purple/10 bg-bg-deep/20 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-tokyo-pink/10 border border-tokyo-pink/20 text-tokyo-pink flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1-1.622-3.395m3.434-4.897a3 3 0 1 1 5.78-1.128 2.25 2.25 0 0 0 2.4-2.245 4.5 4.5 0 0 1-8.4 2.245c0 .399.078.78.22 1.128Zm0 0a15.997 15.997 0 0 1-3.388 1.62m5.043.025a15.996 15.996 0 0 0 1.622 3.395m-3.434 4.897a15.99 15.99 0 0 0 3.395-1.622m-4.897 3.434a15.99 15.99 0 0 1-1.622-3.395m3.434-4.897a15.991 15.991 0 0 1 3.395 1.622m-4.897-3.434a15.992 15.992 0 0 0-1.622 3.395" />
                    </svg>
                  </div>
                  <h4 className="text-sm font-bold text-fg-light mb-2">{t('aboutSkill1')}</h4>
                  <p className="text-xs text-fg-comment leading-relaxed font-medium">
                    Figma, Adobe Creative Suite, UX/UI, wireframes, user testing, vector layouts, visual branding.
                  </p>
                </div>

                {/* Skill 2: Frontend Dev */}
                <div className="p-5 border border-tokyo-purple/10 bg-bg-deep/20 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-tokyo-teal/10 border border-tokyo-teal/20 text-tokyo-teal flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
                    </svg>
                  </div>
                  <h4 className="text-sm font-bold text-fg-light mb-2">{t('aboutSkill2')}</h4>
                  <p className="text-xs text-fg-comment leading-relaxed font-medium">
                    React, Next.js, JavaScript, TypeScript, Tailwind CSS, HTML5/CSS3, responsive grids, micro-animations.
                  </p>
                </div>

                {/* Skill 3: Backend & DB */}
                <div className="p-5 border border-tokyo-purple/10 bg-bg-deep/20 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-tokyo-purple/10 border border-tokyo-purple/20 text-tokyo-purple flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0v3.75" />
                    </svg>
                  </div>
                  <h4 className="text-sm font-bold text-fg-light mb-2">{t('aboutSkill3')}</h4>
                  <p className="text-xs text-fg-comment leading-relaxed font-medium">
                    PHP, Node.js, SQL Server, MySQL, Laravel, APIs integration, server configuration, query optimization.
                  </p>
                </div>

                {/* Skill 4: Servers & Games */}
                <div className="p-5 border border-tokyo-purple/10 bg-bg-deep/20 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-tokyo-blue/10 border border-tokyo-blue/20 text-tokyo-blue flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 0 1-3-3V3.75m3 10.5a3 3 0 0 0 3 3h7.5a3 3 0 0 0 3-3m-13.5 0a3 3 0 0 0-3 3v3.75m3-3.75a3 3 0 0 1 3-3h7.5a3 3 0 0 1 3 3m0-10.5V3.75m0 7.5a3 3 0 0 0 3-3V3.75m-3 3.75h3.75m-1.5 10.5h1.5M10.5 18h3m-6.75-7.5h7.5" />
                    </svg>
                  </div>
                  <h4 className="text-sm font-bold text-fg-light mb-2">{t('aboutSkill4')}</h4>
                  <p className="text-xs text-fg-comment leading-relaxed font-medium">
                    VPS infrastructure, cPanel, CMS installation, MMORPG setups (Mu Online, WoW, Lineage II, Rakion, Habbo).
                  </p>
                </div>

              </div>
            </div>

          </div>
        </div>

      </div>
    </motion.div>
  );
}
