import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons'
import { useLanguage } from '../context/LanguageContext'

export default function Hero() {
  const { t, language } = useLanguage()
  const cvPath = language === 'es' ? '/marcos_arauz_es.pdf' : '/marcos_arauz_eng.pdf'
  // Glow background coordinates tracking cursor
  const mouseX1 = useMotionValue(300)
  const mouseY1 = useMotionValue(200)
  const mouseX2 = useMotionValue(900)
  const mouseY2 = useMotionValue(500)

  // Spotlight coordinates relative to the text element container
  const spotlightX = useMotionValue(0)
  const spotlightY = useMotionValue(0)
  const spotlightRadius = useSpring(useMotionValue(0), { damping: 20, stiffness: 100 })

  // Spring physics config for ambient floating glows (slower, smoother, cloud-like)
  const springConfig = { damping: 55, stiffness: 8, mass: 2.0 }
  const glowX1 = useSpring(mouseX1, springConfig)
  const glowY1 = useSpring(mouseY1, springConfig)
  const glowX2 = useSpring(mouseX2, springConfig)
  const glowY2 = useSpring(mouseY2, springConfig)

  // Reference to sections and text container
  const heroRef = useRef<HTMLDivElement>(null)
  const textContainerRef = useRef<HTMLDivElement>(null)

  const physicsRef = useRef({
    x1: 300, y1: 200,
    vx1: 0.15, vy1: 0.1,
    x2: 900, y2: 500,
    vx2: -0.12, vy2: -0.12,
    width: 1200,
    height: 800
  })

  const mousePosRef = useRef({
    x: 0,
    y: 0,
    active: false
  })

  useEffect(() => {
    const updateDimensions = () => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect()
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
      const marginY = 80
      const minX = -marginX
      const maxX = W + marginX
      const minY = -marginY
      const maxY = H + marginY

      // Update positions
      p.x1 += p.vx1
      p.y1 += p.vy1
      p.x2 += p.vx2
      p.y2 += p.vy2

      // Mouse push force (repulsion) - extremely gentle nudge
      if (m.active) {
        // Glow 1
        const dx1 = p.x1 - m.x
        const dy1 = p.y1 - m.y
        const dist1 = Math.sqrt(dx1*dx1 + dy1*dy1)
        if (dist1 < 300 && dist1 > 0) {
          const pushForce = (1 - dist1 / 300) * 0.02
          p.vx1 += (dx1 / dist1) * pushForce
          p.vy1 += (dy1 / dist1) * pushForce
        }

        // Glow 2
        const dx2 = p.x2 - m.x
        const dy2 = p.y2 - m.y
        const dist2 = Math.sqrt(dx2*dx2 + dy2*dy2)
        if (dist2 < 300 && dist2 > 0) {
          const pushForce = (1 - dist2 / 300) * 0.02
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
      mouseX1.set(p.x1)
      mouseY1.set(p.y1)
      mouseX2.set(p.x2)
      mouseY2.set(p.y2)

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

    mousePosRef.current = {
      x,
      y,
      active: true
    }
  };

  const handleMouseLeave = () => {
    mousePosRef.current.active = false
  };

  // Handles cursor tracking inside the text container for the radial mask reveal
  const handleTextMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!textContainerRef.current) return
    const rect = textContainerRef.current.getBoundingClientRect()
    spotlightX.set(e.clientX - rect.left)
    spotlightY.set(e.clientY - rect.top)
    spotlightRadius.set(130) // Reveal colors within a 130px radius
  }

  const handleTextMouseEnter = () => {
    spotlightRadius.set(130)
  }

  const handleTextMouseLeave = () => {
    spotlightRadius.set(0) // Hide color reveal, falling back to solid off-white
  }

  // Create responsive radial mask template for the solid text layer
  // A circular mask centered at cursor position makes the top white text transparent,
  // which reveals the colorful linear gradient text layer resting underneath.
  const maskImageTemplate = useMotionTemplate`radial-gradient(circle ${spotlightRadius}px at ${spotlightX}px ${spotlightY}px, transparent 0%, black 100%)`

  return (
    <motion.section 
      ref={heroRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="w-full min-h-dvh flex flex-col justify-center items-center relative py-16 px-5 bg-linear-to-br from-hero-grad-start via-hero-grad-via to-hero-grad-end border-b border-tokyo-purple/10 overflow-hidden"
    >
      {/* Background Dotted Grid Pattern */}
      <div className="tokyo-dot-grid" />

      {/* Glow 1: Teal */}
      <motion.div 
        style={{ x: glowX1, y: glowY1 }}
        className="absolute top-0 left-0 w-125 h-125 -ml-62.5 -mt-62.5 pointer-events-none select-none"
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
          className="w-full h-full bg-glow-teal rounded-full blur-3xl"
        />
      </motion.div>

      {/* Glow 2: Pink */}
      <motion.div 
        style={{ x: glowX2, y: glowY2 }}
        className="absolute top-0 left-0 w-125 h-125 -ml-62.5 -mt-62.5 pointer-events-none select-none"
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
          className="w-full h-full bg-glow-pink rounded-full blur-3xl"
        />
      </motion.div>
      
      {/* Figma 12-column grid alignment for Hero content */}
      <div className="w-full max-w-310 mx-auto grid grid-cols-12 gap-5 relative z-10 items-center justify-center text-center">
        
        {/* Title Block (Spans all 12 columns) */}
        <div className="col-span-12 flex justify-center">
          <motion.div
            ref={textContainerRef}
            onMouseMove={handleTextMouseMove}
            onMouseEnter={handleTextMouseEnter}
            onMouseLeave={handleTextMouseLeave}
            initial={{ opacity: 0, scale: 0.95, filter: 'blur(15px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ 
              delay: 0.3, 
              duration: 1.2,
              ease: [0.16, 1, 0.3, 1]
            }}
            className="relative cursor-default inline-block"
          >
            <div className="tokyo-title-shadow">
              {/* Underlay (Bottom Layer): The colorful gradient text */}
              <h1 
                className="text-6xl sm:text-8xl md:text-9xl font-extrabold bg-linear-to-r from-tokyo-pink via-tokyo-light-pink to-tokyo-teal bg-clip-text text-transparent leading-none tracking-tighter"
              >
                Marcos Arauz
              </h1>

              {/* Overlay (Top Layer): Solid off-white text, dynamically masked around mouse cursor to reveal gradient */}
              <motion.h1 
                style={{ 
                  WebkitMaskImage: maskImageTemplate, 
                  maskImage: maskImageTemplate 
                }}
                className="absolute inset-0 text-6xl sm:text-8xl md:text-9xl font-extrabold text-tokyo-offwhite leading-none tracking-tighter pointer-events-none"
              >
                Marcos Arauz
              </motion.h1>
            </div>
          </motion.div>
        </div>

        {/* Description Block (Spans all 12 columns) */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            delay: 0.6, 
            duration: 0.8,
            ease: "easeOut"
          }}
          className="col-span-12 max-w-3xl mx-auto text-sm sm:text-base md:text-lg lg:text-xl text-fg-medium leading-relaxed font-medium mt-4 px-4 tokyo-desc-shadow"
        >
          {t('heroDescription')}
        </motion.p>

        {/* Social Links (Spans all 12 columns) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            delay: 0.8, 
            duration: 0.8,
            ease: "easeOut"
          }}
          className="col-span-12 max-w-3xl mx-auto w-full px-4 mt-6 flex flex-wrap gap-4 justify-start"
        >
          <a
            href="https://www.linkedin.com/in/marcos-arauz-498003361/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold text-fg-medium border border-tokyo-purple/15 bg-bg-deep/30 hover:border-tokyo-hot-pink/40 hover:text-tokyo-hot-pink hover:bg-tokyo-hot-pink/5 transition-all duration-300 shadow-md shadow-black/10 hover:shadow-tokyo-hot-pink/10"
          >
            <FontAwesomeIcon icon={faLinkedin} className="text-lg" />
            <span>LinkedIn</span>
          </a>

          <a
            href="https://github.com/cepoide"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold text-fg-medium border border-tokyo-purple/15 bg-bg-deep/30 hover:border-tokyo-teal/40 hover:text-tokyo-teal hover:bg-tokyo-teal/5 transition-all duration-300 shadow-md shadow-black/10 hover:shadow-tokyo-teal/10"
          >
            <FontAwesomeIcon icon={faGithub} className="text-lg" />
            <span>GitHub</span>
          </a>

          <a
            href={cvPath}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold text-fg-medium border border-tokyo-purple/15 bg-bg-deep/30 hover:border-theme-accent/40 hover:text-theme-accent hover:bg-theme-accent/5 transition-all duration-300 shadow-md shadow-black/10 hover:shadow-theme-accent/10 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <span>{t('heroCVButton')}</span>
          </a>
        </motion.div>
      </div>
    </motion.section>
  )
}
