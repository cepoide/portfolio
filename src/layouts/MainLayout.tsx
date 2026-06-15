import { useState, useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import { useLanguage } from '../context/LanguageContext'

interface MainLayoutProps {
  children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { theme, toggleTheme } = useTheme()
  const { language, setLanguage, t } = useLanguage()
  const [isScrolled, setIsScrolled] = useState(false)

  // Glow background coordinates tracking cursor for footer
  const footerMouseX1 = useMotionValue(300)
  const footerMouseY1 = useMotionValue(175)
  const footerMouseX2 = useMotionValue(900)
  const footerMouseY2 = useMotionValue(175)

  // Spring physics config for responsive footer glows (slower, smoother, cloud-like)
  const footerSpringConfig = { damping: 55, stiffness: 8, mass: 2.0 }
  const footerGlowX1 = useSpring(footerMouseX1, footerSpringConfig)
  const footerGlowY1 = useSpring(footerMouseY1, footerSpringConfig)
  const footerGlowX2 = useSpring(footerMouseX2, footerSpringConfig)
  const footerGlowY2 = useSpring(footerMouseY2, footerSpringConfig)

  // Top border spotlight tracking variables
  const footerMouseX = useMotionValue(0)
  const footerBorderRadius = useMotionValue(0)
  const footerBorderOpacity = useMotionValue(0)

  const footerBorderSpotlightRadius = useSpring(footerBorderRadius, { damping: 25, stiffness: 120 })
  const footerBorderSpringOpacity = useSpring(footerBorderOpacity, { damping: 25, stiffness: 120 })

  const footerBorderBg = useMotionTemplate`radial-gradient(circle ${footerBorderSpotlightRadius}px at ${footerMouseX}px 50%, color-mix(in srgb, var(--theme-accent) 60%, transparent) 0%, transparent 100%)`

  const footerRef = useRef<HTMLDivElement>(null)
  const physicsRef = useRef({
    x1: 300, y1: 175,
    vx1: 0.15, vy1: 0.1,
    x2: 900, y2: 175,
    vx2: -0.12, vy2: -0.12,
    width: 1200,
    height: 350
  })

  const mousePosRef = useRef({
    x: 0,
    y: 0,
    active: false
  })

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const updateDimensions = () => {
      if (footerRef.current) {
        const rect = footerRef.current.getBoundingClientRect()
        physicsRef.current.width = rect.width
        physicsRef.current.height = rect.height
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)

    let animationFrameId: number

    const updatePhysics = () => {
      const p = physicsRef.current
      const m = mousePosRef.current
      const W = p.width
      const H = p.height

      // Boundaries for centers (allow going slightly off-screen for natural feel)
      const marginX = 80
      const marginY = 40
      const minX = -marginX
      const maxX = W + marginX
      const minY = -marginY
      const maxY = H + marginY

      // Update positions
      p.x1 += p.vx1
      p.y1 += p.vy1
      p.x2 += p.vx2
      p.y2 += p.vy2

      // Mouse push force (repulsion)
      if (m.active) {
        // Glow 1
        const dx1 = p.x1 - m.x
        const dy1 = p.y1 - m.y
        const dist1 = Math.sqrt(dx1*dx1 + dy1*dy1)
        if (dist1 < 250 && dist1 > 0) {
          const pushForce = (1 - dist1 / 250) * 0.02
          p.vx1 += (dx1 / dist1) * pushForce
          p.vy1 += (dy1 / dist1) * pushForce
        }

        // Glow 2
        const dx2 = p.x2 - m.x
        const dy2 = p.y2 - m.y
        const dist2 = Math.sqrt(dx2*dx2 + dy2*dy2)
        if (dist2 < 250 && dist2 > 0) {
          const pushForce = (1 - dist2 / 250) * 0.02
          p.vx2 += (dx2 / dist2) * pushForce
          p.vy2 += (dy2 / dist2) * pushForce
        }
      }

      // Enforce speed limits (min and max speed to keep movement steady and slow)
      const limitSpeed = (vx: number, vy: number, minSpd: number, maxSpd: number) => {
        const spd = Math.sqrt(vx*vx + vy*vy)
        if (spd === 0) return { vx: minSpd, vy: 0 }
        if (spd > maxSpd) {
          return { vx: (vx / spd) * maxSpd, vy: (vy / spd) * maxSpd }
        }
        if (spd < minSpd) {
          return { vx: (vx / spd) * minSpd, vy: (vy / spd) * minSpd }
        }
        return { vx, vy }
      };

      const res1 = limitSpeed(p.vx1, p.vy1, 0.05, 0.25)
      p.vx1 = res1.vx
      p.vy1 = res1.vy

      const res2 = limitSpeed(p.vx2, p.vy2, 0.05, 0.25)
      p.vx2 = res2.vx
      p.vy2 = res2.vy

      // Bounce off boundaries
      if (p.x1 < minX) { p.vx1 = Math.abs(p.vx1); p.x1 = minX; }
      else if (p.x1 > maxX) { p.vx1 = -Math.abs(p.vx1); p.x1 = maxX; }

      if (p.y1 < minY) { p.vy1 = Math.abs(p.vy1); p.y1 = minY; }
      else if (p.y1 > maxY) { p.vy1 = -Math.abs(p.vy1); p.y1 = maxY; }

      if (p.x2 < minX) { p.vx2 = Math.abs(p.vx2); p.x2 = minX; }
      else if (p.x2 > maxX) { p.vx2 = -Math.abs(p.vx2); p.x2 = maxX; }

      if (p.y2 < minY) { p.vy2 = Math.abs(p.vy2); p.y2 = minY; }
      else if (p.y2 > maxY) { p.vy2 = -Math.abs(p.vy2); p.y2 = maxY; }

      // Apply coordinates to framer motion values
      footerMouseX1.set(p.x1)
      footerMouseY1.set(p.y1)
      footerMouseX2.set(p.x2)
      footerMouseY2.set(p.y2)

      animationFrameId = requestAnimationFrame(updatePhysics)
    }

    animationFrameId = requestAnimationFrame(updatePhysics)

    return () => {
      window.removeEventListener('resize', updateDimensions)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 1. Position tracking for border spotlight
    footerMouseX.set(x)

    // 2. Proximity calculation for top border
    const limit = 150
    const proximity = Math.max(0, 1 - (y / limit))
    
    footerBorderRadius.set(30 + proximity * 90)      // Radius from 30px to 120px
    footerBorderOpacity.set(0.1 + proximity * 0.8)   // Opacity from 0.1 to 0.9

    // 3. Update mouse coordinates for physics simulation (relative to footer top-left)
    mousePosRef.current = {
      x,
      y,
      active: true
    }
  };

  const handleMouseLeave = () => {
    // Reset top border spotlight
    footerBorderRadius.set(0)
    footerBorderOpacity.set(0)
    
    // Set mouse coordinates inactive in physics simulation
    mousePosRef.current.active = false
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className="min-h-screen bg-bg-dark text-fg-medium flex flex-col font-sans antialiased"
    >
      {/* Glassmorphic Navbar */}
      <header 
        className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${
          isScrolled 
            ? 'bg-bg-dark/80 backdrop-blur-md border-b border-tokyo-purple/10 shadow-lg shadow-black/15 py-1' 
            : 'bg-transparent border-b border-transparent py-3'
        }`}
      >
        <div className="w-full max-w-310 mx-auto px-5 grid grid-cols-12 gap-5 h-14 items-center">
          <div className="col-span-12 flex items-center justify-between">
            <a href="#" className="text-xl font-extrabold tracking-tighter text-fg-light hover:text-theme-accent transition-colors">
              Marcos Arauz
            </a>
            <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-fg-medium">
              <a href="#about" className="hover:text-theme-accent transition-colors">{t('navAbout')}</a>
              <a href="#projects" className="hover:text-theme-accent transition-colors">{t('navProjects')}</a>
              <a href="#faq" className="hover:text-theme-accent transition-colors">{t('navFaq')}</a>
              <a href="#contact" className="hover:text-theme-accent transition-colors">{t('navContact')}</a>
            </nav>
            <div className="flex items-center gap-4">
              {/* Language Selector Capsule (Tokyo Panda Neon Sliding Toggle) */}
              <div className="relative flex items-center bg-bg-deep/50 border border-tokyo-purple/20 hover:border-tokyo-purple/40 rounded-full p-0.5 shadow-md text-xs font-extrabold transition-all duration-300">
                <button 
                  onClick={() => setLanguage('es')} 
                  className={`relative px-3 py-1 rounded-full transition-colors duration-300 select-none cursor-pointer flex items-center justify-center min-w-8.5 h-6 ${
                    language === 'es' 
                      ? 'text-theme-accent' 
                      : 'text-fg-comment hover:text-fg-light'
                  }`}
                >
                  {language === 'es' && (
                    <motion.span
                      layoutId="activeLang"
                      className="absolute inset-0 bg-theme-accent-bg border border-theme-accent-border rounded-full tokyo-active-filter"
                      transition={{ type: "spring", stiffness: 380, damping: 26 }}
                    />
                  )}
                  <span className="relative z-10">ES</span>
                </button>
                
                <button 
                  onClick={() => setLanguage('en')} 
                  className={`relative px-3 py-1 rounded-full transition-colors duration-300 select-none cursor-pointer flex items-center justify-center min-w-8.5 h-6 ${
                    language === 'en' 
                      ? 'text-theme-accent' 
                      : 'text-fg-comment hover:text-fg-light'
                  }`}
                >
                  {language === 'en' && (
                    <motion.span
                      layoutId="activeLang"
                      className="absolute inset-0 bg-theme-accent-bg border border-theme-accent-border rounded-full tokyo-active-filter"
                      transition={{ type: "spring", stiffness: 380, damping: 26 }}
                    />
                  )}
                  <span className="relative z-10">EN</span>
                </button>
              </div>

              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full border border-tokyo-purple/20 bg-bg-deep/30 text-fg-light hover:border-tokyo-hot-pink/40 hover:text-tokyo-hot-pink transition-all duration-300 cursor-pointer shadow-md hover:scale-105"
                title={theme === 'dark' ? t('themeTooltipLight') : t('themeTooltipDark')}
              >
                {theme === 'dark' ? (
                  // Sun Icon (SVG)
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m0 13.5V21M5.25 5.25l1.591 1.591M18.25 18.25l1.591 1.591M3 12h2.25m13.5 0H21M5.25 18.75l1.591-1.591M18.25 5.25l1.591-1.591M12 7.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Z" />
                  </svg>
                ) : (
                  // Moon Icon (SVG)
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                  </svg>
                )}
              </button>

              <a 
                href="#contact" 
                className="relative px-5 py-2 rounded-full overflow-hidden text-xs font-extrabold bg-tokyo-purple text-bg-deep transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(176,132,235,0.5)] cursor-pointer inline-flex items-center justify-center group"
              >
                {/* Neon Spotlight Swipe Overlay */}
                <span className="absolute inset-0 w-[200%] h-full tokyo-spotlight-swipe translate-x-[-70%] group-hover:translate-x-[70%] transition-transform duration-1000 ease-out" />
                
                <span className="relative z-10">{t('navTalkButton')}</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid-aligned Container */}
      <main className="flex-1 w-full">
        {/* Children components will be rendered here.
            They can use "grid grid-cols-12 gap-[20px]" to align directly to the Figma grid. */}
        {children}
      </main>

      <footer 
        ref={footerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="w-full pt-16 pb-8 bg-bg-deep/40 relative z-10 overflow-hidden group/footer"
      >
        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-tokyo-purple/10 overflow-hidden z-20 pointer-events-none">
          <motion.div 
            style={{ background: footerBorderBg, opacity: footerBorderSpringOpacity }}
            className="absolute inset-0 w-full h-full"
          />
        </div>

        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
          <motion.div 
            style={{ x: footerGlowX1, y: footerGlowY1 }}
            className="absolute top-0 left-0 w-137.5 h-137.5 -ml-68.75 -mt-68.75 pointer-events-none select-none"
          >
            <motion.div
              animate={{
                scale: [1, 1.15, 0.9, 1],
                opacity: [0.75, 1, 0.8, 0.75]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-full h-full bg-tokyo-teal/15 rounded-full blur-[90px]"
            />
          </motion.div>
          <motion.div 
            style={{ x: footerGlowX2, y: footerGlowY2 }}
            className="absolute top-0 left-0 w-137.5 h-137.5 -ml-68.75 -mt-68.75 pointer-events-none select-none"
          >
            <motion.div
              animate={{
                scale: [1, 1.18, 0.85, 1],
                opacity: [0.75, 1, 0.8, 0.75]
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-full h-full bg-tokyo-pink/15 rounded-full blur-[90px]"
            />
          </motion.div>
        </div>
        
        <div className="w-full max-w-310 mx-auto px-5 grid grid-cols-12 gap-y-8 md:gap-x-5 relative z-10">
          
          {/* Col 1: Branding, Tagline & Social/Contact links (8 cols) */}
          <div className="col-span-12 md:col-span-8 flex flex-col items-start">
            <a href="#" className="text-2xl font-extrabold tracking-tighter text-fg-light hover:text-theme-accent transition-colors mb-3">
              MARCOS ARAUZ
            </a>
            
            <p className="text-sm text-fg-medium max-w-lg leading-relaxed mb-6">
              {t('footerDesc')}
            </p>

            <div className="space-y-3">
              {/* LinkedIn */}
              <a 
                href="https://www.linkedin.com/in/marcos-arauz-498003361/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-3 text-sm text-fg-medium hover:text-theme-accent transition-colors group"
              >
                <svg className="w-4 h-4 text-theme-accent fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                <span>LinkedIn</span>
              </a>

              {/* GitHub */}
              <a 
                href="https://github.com/cepoide" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-3 text-sm text-fg-medium hover:text-theme-accent transition-colors group"
              >
                <svg className="w-4 h-4 text-theme-accent fill-current" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span>GitHub</span>
              </a>

              {/* WhatsApp */}
              <a 
                href="https://wa.me/542216173581" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-3 text-sm text-fg-medium hover:text-theme-accent transition-colors group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" className="w-4 h-4 text-theme-accent">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                </svg>
                <span>+54 221 617-3581</span>
              </a>

              {/* Email */}
              <a 
                href="mailto:soymarcosarauz@gmail.com" 
                className="flex items-center gap-3 text-sm text-fg-medium hover:text-theme-accent transition-colors group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" className="w-4 h-4 text-theme-accent">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
                <span>soymarcosarauz@gmail.com</span>
              </a>

              {/* Location */}
              <div className="flex items-center gap-3 text-sm text-fg-medium select-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-theme-accent">
                  <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>Buenos Aires, Argentina</span>
              </div>
            </div>
          </div>

          {/* Col 2: Navigation Links (4 cols) */}
          <div className="col-span-12 md:col-span-4 flex flex-col items-start md:items-end">
            <div className="flex flex-col items-start md:items-end">
              <h4 className="text-xs font-bold uppercase tracking-widest text-fg-comment mb-4 select-none">
                {t('footerNavTitle')}
              </h4>
              <ul className="space-y-2.5 text-sm flex flex-col items-start md:items-end">
                <li>
                  <a href="#about" className="text-fg-medium hover:text-theme-accent transition-colors">
                    {t('navAbout')}
                  </a>
                </li>
                <li>
                  <a href="#projects" className="text-fg-medium hover:text-theme-accent transition-colors">
                    {t('navProjects')}
                  </a>
                </li>
                <li>
                  <a href="#faq" className="text-fg-medium hover:text-theme-accent transition-colors">
                    {t('navFaq')}
                  </a>
                </li>
                <li>
                  <a href="#contact" className="text-fg-medium hover:text-theme-accent transition-colors">
                    {t('navContact')}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar separator & Copyright (12 cols) */}
          <div className="col-span-12 mt-8 pt-8 border-t border-tokyo-purple/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-fg-comment select-none">
            <p>© {new Date().getFullYear()} {t('footerCopyright')}</p>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-1.5 hover:text-theme-accent transition-colors font-bold uppercase tracking-wider cursor-pointer group"
            >
              <span>Back to Top</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform duration-300">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
              </svg>
            </button>
          </div>

        </div>
      </footer>
    </motion.div>
  )
}
