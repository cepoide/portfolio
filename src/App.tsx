import { useState, useEffect } from 'react'
import { ThemeProvider } from './context/ThemeContext'
import { LanguageProvider } from './context/LanguageContext'
import MainLayout from './layouts/MainLayout'
import Hero from './sections/Hero'
import TechTicker from './components/TechTicker'
import Works from './components/Works'
import WhyChooseMe from './components/WhyChooseMe'
import Faq from './components/Faq'
import AboutMe from './components/AboutMe'
import Contact from './components/Contact'

function AppContent() {
  const [currentHash, setCurrentHash] = useState(window.location.hash)

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash)
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  useEffect(() => {
    // If the hash is pointing to a section and we are not on the about page
    if (currentHash && currentHash !== '#about') {
      const targetId = currentHash.replace('#', '')
      const element = document.getElementById(targetId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      } else {
        // Wait a small frame for React to mount the main view, then scroll
        const timer = setTimeout(() => {
          const retryElement = document.getElementById(targetId)
          if (retryElement) {
            retryElement.scrollIntoView({ behavior: 'smooth' })
          }
        }, 100)
        return () => clearTimeout(timer)
      }
    } else if (currentHash === '' || currentHash === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [currentHash])

  const isAboutPage = currentHash === '#about'

  return (
    <MainLayout>
      {isAboutPage ? (
        <AboutMe />
      ) : (
        <>
          {/* Render the Full-Bleed Hero Component */}
          <Hero />

          {/* Scrolling Tech Stack Ticker */}
          <TechTicker />

          {/* Works & Projects Showcase Section */}
          <Works />

          {/* Why Choose Me / Why Work With Me Section */}
          <WhyChooseMe />

          {/* Frequently Asked Questions Section */}
          <Faq />

          {/* Localized Contact Form Section */}
          <Contact />
        </>
      )}
    </MainLayout>
  )
}

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </ThemeProvider>
  )
}

export default App
