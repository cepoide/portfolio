import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { projects } from '../utils/projectsData';
import type { Project } from '../utils/projectsData';

export default function Works() {
  const { t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<'all' | 'web' | 'apps'>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  // Filter projects based on active tab
  const filteredProjects = projects.filter((project) => {
    if (activeFilter === 'all') return true;
    return project.category.includes(activeFilter);
  });

  // Handle keyboard navigation for the details modal and zoom lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (zoomedImage) {
        if (e.key === 'Escape') {
          setZoomedImage(null);
        }
        return;
      }

      if (!selectedProject) return;

      if (e.key === 'Escape') {
        setSelectedProject(null);
      } else if (e.key === 'ArrowRight' && selectedProject.images) {
        setActiveImageIndex((prev) => 
          prev === (selectedProject.images!.length - 1) ? 0 : prev + 1
        );
      } else if (e.key === 'ArrowLeft' && selectedProject.images) {
        setActiveImageIndex((prev) => 
          prev === 0 ? selectedProject.images!.length - 1 : prev - 1
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProject, zoomedImage]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedProject]);

  const openProjectModal = (project: Project) => {
    setSelectedProject(project);
    setActiveImageIndex(0);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedProject?.images) {
      setActiveImageIndex((prev) => 
        prev === (selectedProject.images!.length - 1) ? 0 : prev + 1
      );
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedProject?.images) {
      setActiveImageIndex((prev) => 
        prev === 0 ? selectedProject.images!.length - 1 : prev - 1
      );
    }
  };

  const filters: { id: 'all' | 'web' | 'apps'; labelKey: 'filterAll' | 'filterWeb' | 'filterApps' }[] = [
    { id: 'all', labelKey: 'filterAll' },
    { id: 'web', labelKey: 'filterWeb' },
    { id: 'apps', labelKey: 'filterApps' }
  ];

  return (
    <section id="projects" className="w-full px-5 py-16 md:py-24 relative z-10 border-b border-tokyo-purple/10 overflow-hidden">
      {/* Background Dot Grid for continuity */}
      <div className="tokyo-dot-grid" />
      
      <div className="w-full max-w-310 mx-auto grid grid-cols-12 gap-5 relative z-10">
        
        {/* Section Header */}
        <div className="col-span-12 mb-10 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-5xl font-extrabold text-fg-light tracking-tight tokyo-title-shadow mb-4"
          >
            {t('worksTitle')}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-sm sm:text-base md:text-lg text-fg-medium max-w-2xl mx-auto tokyo-desc-shadow"
          >
            {t('worksSubtitle')}
          </motion.p>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="col-span-12 flex justify-center mb-10">
          <div className="relative flex items-center bg-bg-deep/40 border border-tokyo-purple/15 rounded-full p-1 shadow-md text-xs sm:text-sm font-bold flex-wrap gap-1">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`relative px-4 py-2 rounded-full transition-colors duration-300 select-none cursor-pointer flex items-center justify-center ${
                  activeFilter === filter.id 
                    ? 'text-theme-accent' 
                    : 'text-fg-comment hover:text-fg-light'
                }`}
              >
                {activeFilter === filter.id && (
                  <motion.span
                    layoutId="activeFilter"
                    className="absolute inset-0 bg-theme-accent-bg border border-theme-accent-border rounded-full tokyo-active-filter"
                    transition={{ type: "spring", stiffness: 380, damping: 28 }}
                  />
                )}
                <span className="relative z-10 whitespace-nowrap">{t(filter.labelKey)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Works Cards Grid */}
        <div className="col-span-12 grid grid-cols-12 gap-5">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => {
              const isPanda = project.id === 'panda_view';
              const isLauncher = project.id === 'launcher_tauri';
              
              return (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  viewport={{ once: true }}
                  transition={{ 
                    opacity: { duration: 0.4 },
                    layout: { type: "spring", stiffness: 350, damping: 30 },
                    scale: { duration: 0.4 }
                  }}
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
                    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
                  }}
                  className={`group tokyo-spotlight-card backdrop-blur-xs cursor-pointer ${
                    isPanda 
                      ? 'col-span-12 md:col-span-8 h-90 sm:h-110' 
                      : isLauncher 
                        ? 'col-span-12 md:col-span-6 lg:col-span-4 h-90 sm:h-100 lg:h-110' 
                        : 'col-span-12 md:col-span-6 lg:col-span-4 h-90 sm:h-100'
                  }`}
                  onClick={() => openProjectModal(project)}
                >
                  <div className="flex flex-col justify-between w-full h-full bg-bg-deep/90 rounded-[inherit] overflow-hidden z-20 relative">
                    {/* Project Screenshot Container */}
                    <div className="relative w-full h-[55%] sm:h-[60%] overflow-hidden bg-bg-deep/40">
                      <img 
                        src={project.image} 
                        alt={String(t(project.titleKey))} 
                        className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-104"
                        loading="lazy"
                      />
                      
                      {/* Dark gradient shadow inside image */}
                      <div className="absolute inset-0 bg-linear-to-t from-bg-dark via-bg-dark/10 to-transparent opacity-80" />
                      
                      {/* Extra badge for featured project */}
                      {project.featured && (
                        <span className="absolute top-4 left-4 bg-tokyo-pink/15 border border-tokyo-pink/30 text-tokyo-pink text-[10px] font-extrabold uppercase px-2 py-1 rounded-md tracking-wider">
                          {t('worksFeatured')}
                        </span>
                      )}

                      {/* Category Label badge */}
                      <span className="absolute bottom-3 left-4 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-tokyo-purple/10 border border-tokyo-purple/35 text-tokyo-purple">
                        {t(project.catKey)}
                      </span>
                    </div>

                    {/* Card content text */}
                    <div className="p-5 flex-1 flex flex-col justify-between relative z-10">
                      <div>
                        {/* Logo and title */}
                        <div className="flex items-center gap-3 mb-2">
                          {project.logo && (
                            <img 
                              src={project.logo} 
                              alt="Logo" 
                              className="w-5 h-5 object-contain"
                            />
                          )}
                          <h3 className="text-base sm:text-lg font-bold text-fg-light group-hover:text-theme-accent transition-colors">
                            {t(project.titleKey)}
                          </h3>
                        </div>
                        
                        {/* Short Description */}
                        <p className="text-xs text-fg-medium line-clamp-2 leading-relaxed mb-4">
                          {t(project.descKey)}
                        </p>
                      </div>

                      {/* Technologies list badges */}
                      <div>
                        <div className="flex flex-wrap gap-1.5 overflow-hidden">
                          {project.technologies.slice(0, 4).map((tech) => (
                            <span 
                              key={tech} 
                              className="text-[9px] font-extrabold font-mono px-2 py-0.5 rounded-md bg-bg-deep border border-tokyo-purple/10 text-fg-comment"
                            >
                              {tech}
                            </span>
                          ))}
                          {project.technologies.length > 4 && (
                            <span className="text-[9px] font-extrabold font-mono px-1.5 py-0.5 rounded-md bg-bg-deep border border-tokyo-purple/10 text-theme-accent">
                              +{project.technologies.length - 4}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

      </div>

      {/* Lightbox / Slideshow Modal */}
      {createPortal(
        <AnimatePresence>
          {selectedProject && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-150 flex items-center justify-center bg-bg-dark/95 backdrop-blur-md p-4 sm:p-6"
              onClick={() => setSelectedProject(null)}
            >
            {/* Modal Box */}
            <motion.div 
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-5xl bg-bg-deep/80 border border-tokyo-purple/20 rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:grid lg:grid-cols-12 h-[85vh] lg:h-[70vh]"
              onClick={(e) => e.stopPropagation()}
            >
              
              {/* Image Showcase Panel (Left/Top side - 7 cols in lg) */}
              <div className="lg:col-span-8 bg-black relative h-[55%] lg:h-full group/modal flex flex-col min-h-0">
                
                {(() => {
                  const currentImage = selectedProject.images ? selectedProject.images[activeImageIndex] : selectedProject.image;
                  const isLogo = currentImage.endsWith('.svg') || currentImage.includes('logo');
                  return (
                    <div className="relative w-full flex-1 min-h-0 overflow-y-auto scrollbar-thin scrollbar-thumb-tokyo-purple scrollbar-track-transparent p-4">
                      {/* Floating Zoom Indicator Button */}
                      <button 
                        onClick={() => setZoomedImage(currentImage)}
                        className="absolute top-4 right-4 z-20 p-2 rounded-full border border-white/10 bg-black/40 text-white/60 hover:text-white hover:bg-black/60 hover:scale-105 transition-all duration-300 cursor-pointer shadow-md select-none opacity-0 group-hover/modal:opacity-100"
                        title="Zoom Image"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.637 10.637ZM10.5 7.5v6m3-3h-6" />
                        </svg>
                      </button>

                      {isLogo ? (
                        <div className="w-full h-full flex items-center justify-center">
                          <AnimatePresence mode="wait">
                            <motion.img 
                              key={currentImage}
                              src={currentImage}
                              alt="Screenshot" 
                              initial={{ opacity: 0, scale: 0.98 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 1.02 }}
                              transition={{ duration: 0.3 }}
                              className="max-w-40 sm:max-w-48 md:max-w-56 object-contain select-none"
                            />
                          </AnimatePresence>
                        </div>
                      ) : (
                        <AnimatePresence mode="wait">
                          <motion.img 
                            key={currentImage}
                            src={currentImage}
                            alt="Screenshot" 
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.02 }}
                            transition={{ duration: 0.3 }}
                            className="w-full h-auto block rounded-lg shadow-lg"
                          />
                        </AnimatePresence>
                      )}
                    </div>
                  );
                })()}

                {/* Carousel Navigation Arrows */}
                {selectedProject.images && selectedProject.images.length > 1 && (
                  <>
                    <button 
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full border border-tokyo-purple/20 bg-bg-deep/60 hover:border-tokyo-teal/50 text-fg-light hover:text-tokyo-teal transition-all cursor-pointer shadow-md select-none"
                      title={String(t('worksPrevImage'))}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                      </svg>
                    </button>
                    
                    <button 
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full border border-tokyo-purple/20 bg-bg-deep/60 hover:border-tokyo-teal/50 text-fg-light hover:text-tokyo-teal transition-all cursor-pointer shadow-md select-none"
                      title={String(t('worksNextImage'))}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                      </svg>
                    </button>
                  </>
                )}

                {/* Slides counter badge */}
                {selectedProject.images && selectedProject.images.length > 1 && (
                  <span className="absolute bottom-4 left-4 text-[10px] font-extrabold uppercase px-2 py-1 rounded bg-bg-deep/80 border border-tokyo-purple/20 text-fg-medium select-none font-mono">
                    {activeImageIndex + 1} / {selectedProject.images.length}
                  </span>
                )}
              </div>

              {/* Information Panel (Right/Bottom side - 4 cols in lg) */}
              <div className="lg:col-span-4 p-6 flex flex-col justify-between h-[45%] lg:h-full border-t lg:border-t-0 lg:border-l border-tokyo-purple/15 bg-bg-deep/40 relative">
                
                {/* Close Button inside Information Panel */}
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-5 right-5 p-2 rounded-full border border-tokyo-purple/20 bg-bg-deep/20 text-fg-comment hover:text-tokyo-rose hover:border-tokyo-rose/40 hover:scale-105 transition-all cursor-pointer shadow-md"
                  title={String(t('worksModalClose'))}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Main Information Block */}
                <div className="overflow-y-auto flex-1 pr-1 scrollbar-thin scrollbar-thumb-tokyo-purple scrollbar-track-transparent">
                  {/* Category */}
                  <span className="text-[10px] font-extrabold uppercase text-tokyo-teal/80 select-none block mb-1">
                    {t(selectedProject.catKey)}
                  </span>
                  
                  {/* Title */}
                  <div className="flex items-center gap-3 mb-4">
                    {selectedProject.logo && (
                      <img 
                        src={selectedProject.logo} 
                        alt="Logo" 
                        className="w-6 h-6 object-contain"
                      />
                    )}
                    <h3 className="text-xl sm:text-2xl font-extrabold text-fg-light">
                      {t(selectedProject.titleKey)}
                    </h3>
                  </div>
                  
                  {/* Detailed Description */}
                  <p className="text-xs sm:text-sm text-fg-medium leading-relaxed mb-6 font-medium">
                    {t(selectedProject.descKey)}
                  </p>

                  {/* List of Technologies */}
                  <div className="mb-6">
                    <h4 className="text-[10px] font-extrabold uppercase text-fg-comment tracking-wider mb-2 select-none">
                      {t('worksTech')}
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedProject.technologies.map((tech) => (
                        <span 
                          key={tech} 
                          className="text-[10px] font-extrabold font-mono px-2.5 py-0.5 rounded-md bg-theme-tech-bg border border-theme-tech-border text-theme-tech-text select-none hover:bg-theme-tech-hover-bg hover:border-theme-tech-hover-border transition-colors duration-200"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Links */}
                  {(selectedProject.liveUrl || selectedProject.githubUrl) && (
                    <div className="flex flex-wrap gap-2.5 mt-6 mb-2">
                      {selectedProject.liveUrl && (
                        <a 
                          href={selectedProject.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-btn-demo-bg border border-btn-demo-border text-btn-demo-text hover:bg-btn-demo-hover-bg hover:border-btn-demo-hover-border hover:text-btn-demo-hover-text transition-colors duration-300 shadow-md select-none cursor-pointer"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" className="w-3.5 h-3.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                          </svg>
                          <span>{t('worksDemoText')}</span>
                        </a>
                      )}
                      {selectedProject.githubUrl && (
                        <a 
                          href={selectedProject.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-btn-git-bg border border-btn-git-border text-btn-git-text hover:bg-btn-git-hover-bg hover:border-btn-git-hover-border hover:text-btn-git-hover-text transition-colors duration-300 shadow-md select-none cursor-pointer"
                        >
                          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                          </svg>
                          <span>GitHub</span>
                        </a>
                      )}
                    </div>
                  )}
                </div>

                {/* Gallery Thumbnail Row (Panda View) */}
                {selectedProject.images && selectedProject.images.length > 1 && (
                  <div className="border-t border-tokyo-purple/15 pt-4 mt-2">
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 w-full scrollbar-none select-none">
                      {selectedProject.images.map((img, index) => (
                        <button
                          key={img}
                          onClick={() => setActiveImageIndex(index)}
                          className={`relative w-11 h-7 rounded border overflow-hidden shrink-0 cursor-pointer transition-all duration-200 ${
                            activeImageIndex === index 
                              ? 'border-tokyo-teal scale-105 shadow-[0_0_6px_rgba(25,249,216,0.2)]' 
                              : 'border-tokyo-purple/20 hover:border-tokyo-purple/50'
                          }`}
                        >
                          <img 
                            src={img} 
                            alt={`${t('worksCarouselImage')} ${index + 1}`} 
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

              </div>
              
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body
    )}

      {/* Full-screen Zoom Lightbox */}
      {createPortal(
        <AnimatePresence>
          {zoomedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-200 flex items-center justify-center bg-black/95 backdrop-blur-lg cursor-zoom-out p-4 sm:p-8 md:p-12"
              onClick={() => setZoomedImage(null)}
            >
            {/* Close button */}
            <button
              onClick={() => setZoomedImage(null)}
              className="absolute top-6 right-6 p-3 rounded-full border border-white/10 bg-white/5 text-white/70 hover:text-white hover:border-white/30 hover:scale-105 transition-all cursor-pointer shadow-md z-210"
              title={String(t('worksModalClose'))}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Scrollable image container for tall/large images */}
            <div 
              className="relative w-full h-full overflow-auto flex justify-center items-start scrollbar-none"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.img
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                src={zoomedImage}
                alt="Zoomed Screenshot"
                className="max-w-full h-auto object-contain cursor-zoom-out select-none rounded-lg shadow-2xl my-auto"
                onClick={() => setZoomedImage(null)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body
    )}
    </section>
  );
}
