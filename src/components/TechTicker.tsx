

import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion'

interface TechItem {
  name: string
  filename: string
}

export default function TechTicker() {
  const containerRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  
  const topRadius = useMotionValue(0)
  const bottomRadius = useMotionValue(0)
  const topOpacity = useMotionValue(0)
  const bottomOpacity = useMotionValue(0)

  const topSpotlightRadius = useSpring(topRadius, { damping: 25, stiffness: 120 })
  const bottomSpotlightRadius = useSpring(bottomRadius, { damping: 25, stiffness: 120 })
  const topSpringOpacity = useSpring(topOpacity, { damping: 25, stiffness: 120 })
  const bottomSpringOpacity = useSpring(bottomOpacity, { damping: 25, stiffness: 120 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    mouseX.set(x)

    const halfHeight = rect.height / 2
    if (y < halfHeight) {
      // Top half proximity math: 1 at y = 0, 0 at y = halfHeight
      const proximity = Math.max(0, 1 - (y / halfHeight))
      
      topRadius.set(30 + proximity * 90)     // Scale radius from 30px to 120px
      topOpacity.set(0.1 + proximity * 0.8)  // Scale opacity from 0.1 to 0.9
      
      bottomRadius.set(0)
      bottomOpacity.set(0)
    } else {
      // Bottom half proximity math: 1 at y = rect.height, 0 at y = halfHeight
      const proximity = Math.max(0, 1 - ((rect.height - y) / halfHeight))
      
      topRadius.set(0)
      topOpacity.set(0)
      
      bottomRadius.set(30 + proximity * 90)   // Scale radius from 30px to 120px
      bottomOpacity.set(0.1 + proximity * 0.8)// Scale opacity from 0.1 to 0.9
    }
  }

  const handleMouseLeave = () => {
    topRadius.set(0)
    topOpacity.set(0)
    bottomRadius.set(0)
    bottomOpacity.set(0)
  }

  const topBorderBg = useMotionTemplate`radial-gradient(circle ${topSpotlightRadius}px at ${mouseX}px 50%, color-mix(in srgb, var(--tokyo-hot-pink) 60%, transparent) 0%, transparent 100%)`
  const bottomBorderBg = useMotionTemplate`radial-gradient(circle ${bottomSpotlightRadius}px at ${mouseX}px 50%, color-mix(in srgb, var(--tokyo-teal) 60%, transparent) 0%, transparent 100%)`

  const row1: TechItem[] = [
    { name: 'React', filename: 'react-original.svg' },
    { name: 'Next.js', filename: 'nextjs-original.svg' },
    { name: 'TypeScript', filename: 'typescript-original.svg' },
    { name: 'JavaScript', filename: 'javascript-original.svg' },
    { name: 'HTML5', filename: 'html5-original.svg' },
    { name: 'CSS3', filename: 'css3-original.svg' },
    { name: 'Tailwind CSS', filename: 'tailwindcss-original.svg' },
    { name: 'Bootstrap', filename: 'bootstrap-original.svg' },
    { name: 'Node.js', filename: 'nodejs-original.svg' },
    { name: 'MongoDB', filename: 'mongodb-original.svg' },
    { name: 'Git', filename: 'git-original.svg' },
    { name: 'VS Code', filename: 'vscode-original.svg' },
    { name: 'Figma', filename: 'figma-original.svg' },
    { name: 'Canva', filename: 'canva-original.svg' },
    { name: 'Illustrator', filename: 'illustrator-line.svg' },
    { name: 'Photoshop', filename: 'photoshop-original.svg' },
    { name: 'After Effects', filename: 'aftereffects-original.svg' },
    { name: 'Vercel', filename: 'vercel-original.svg' },
    { name: 'Cloudflare', filename: 'cloudflare-original.svg' },
    { name: 'Astro', filename: 'astro-original.svg' },
  ]

  const row2: TechItem[] = [
    { name: 'PHP', filename: 'php-original.svg' },
    { name: 'MySQL', filename: 'mysql-original.svg' },
    { name: 'MariaDB', filename: 'mariadb-original.svg' },
    { name: 'SQL Developer', filename: 'sqldeveloper-original.svg' },
    { name: 'Java', filename: 'java-original.svg' },
    { name: 'Python', filename: 'python-original.svg' },
    { name: 'Lua', filename: 'lua-original.svg' },
    { name: '.NET', filename: 'dot-net-original.svg' },
    { name: 'Electron', filename: 'electron-original.svg' },
    { name: 'Tauri', filename: 'tauri-original.svg' },
    { name: 'WordPress', filename: 'wordpress-original.svg' },
    { name: 'WooCommerce', filename: 'woocommerce-original.svg' },
    { name: 'Angular', filename: 'angular-original.svg' },
    { name: 'Android', filename: 'android-original.svg' },
    { name: 'Android Studio', filename: 'androidstudio-original.svg' },
    { name: 'Apache', filename: 'apache-original.svg' },
    { name: 'AWS', filename: 'amazonwebservices-original-wordmark.svg' },
    { name: 'Nodemon', filename: 'nodemon-original.svg' },
    { name: 'Discord.js', filename: 'discordjs-original.svg' },
    { name: 'XML', filename: 'xml-original.svg' },
  ]

  // Repeating the arrays 4 times to ensure seamless infinite looping on wider displays
  const duplicatedRow1 = [...row1, ...row1, ...row1, ...row1]
  const duplicatedRow2 = [...row2, ...row2, ...row2, ...row2]

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="w-full py-8 overflow-hidden bg-bg-deep/10 border-t border-b border-t-tokyo-purple/5 border-b-tokyo-purple/5 relative z-10 select-none tokyo-ticker-fade cursor-default"
    >
      {/* Top Border Glow Reveal (Pink) */}
      <motion.div 
        style={{ background: topBorderBg, opacity: topSpringOpacity }}
        className="absolute top-0 left-0 w-full h-[1.5px] pointer-events-none z-20"
      />

      {/* Bottom Border Glow Reveal (Teal) */}
      <motion.div 
        style={{ background: bottomBorderBg, opacity: bottomSpringOpacity }}
        className="absolute bottom-0 left-0 w-full h-[1.5px] pointer-events-none z-20"
      />
      
      {/* Row 1: Scrolls Left */}
      <div className="overflow-hidden mb-6">
        <div className="flex gap-4 sm:gap-8 animate-scroll-left-fast sm:animate-scroll-left-desktop w-max">
          {duplicatedRow1.map((tech, idx) => (
            <div 
              key={`${tech.name}-r1-${idx}`} 
              className="shrink-0 flex items-center justify-center w-18 sm:w-30 h-12 sm:h-18"
            >
              <img 
                src={`/logos/${tech.filename}`} 
                alt={tech.name} 
                loading="lazy"
                className="w-9 sm:w-14 h-9 sm:h-14 object-contain opacity-35 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-300 transform hover:scale-110 cursor-pointer"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Row 2: Scrolls Right */}
      <div className="overflow-hidden">
        <div className="flex gap-4 sm:gap-8 animate-scroll-right-fast sm:animate-scroll-right-desktop w-max">
          {duplicatedRow2.map((tech, idx) => (
            <div 
              key={`${tech.name}-r2-${idx}`} 
              className="shrink-0 flex items-center justify-center w-18 sm:w-30 h-12 sm:h-18"
            >
              <img 
                src={`/logos/${tech.filename}`} 
                alt={tech.name} 
                loading="lazy"
                className="w-9 sm:w-14 h-9 sm:h-14 object-contain opacity-35 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-300 transform hover:scale-110 cursor-pointer"
              />
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
