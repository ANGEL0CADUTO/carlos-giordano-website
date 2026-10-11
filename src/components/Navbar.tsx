import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage, type Language } from '../lib/i18n';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileScrolled, setIsMobileScrolled] = useState(false);
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const updateMobileScrolled = () => {
      setIsMobileScrolled(window.innerWidth < 768 && window.scrollY > 24);
    };

    updateMobileScrolled();
    window.addEventListener('scroll', updateMobileScrolled, { passive: true });
    window.addEventListener('resize', updateMobileScrolled);

    return () => {
      window.removeEventListener('scroll', updateMobileScrolled);
      window.removeEventListener('resize', updateMobileScrolled);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const links = [
    { path: '/', label: t('nav.home') },
    { path: '/opere', label: t('nav.works') },
    { path: '/chi-sono', label: t('nav.about') },
    { path: '/mostre', label: t('nav.exhibitions') },
    { path: '/dicono-di-me', label: t('nav.press') },
    { path: '/contatti', label: t('nav.contact') },
  ];

  const isDarkPage = location.pathname === '/dicono-di-me' || location.pathname === '/news';
  const isDarkBg = isDarkPage;
  const textColor = isDarkBg ? 'text-white' : 'text-ink';
  const dimMobileLogo = isMobileScrolled && !isOpen;
  const languageOptions: Array<{ code: Language; label: string }> = [
    { code: 'it', label: 'Italiano' },
    { code: 'en', label: 'English' },
  ];
  const languageSwitch = (compact = false) => (
    <div className={compact ? 'border-t border-stone/50 pt-6' : 'mt-8 border-t border-stone/40 pt-6'}>
      <p className="mb-3 text-[11px] uppercase tracking-[0.22em] text-muted">{t('nav.languageLabel')}</p>
      <div className="grid grid-cols-2 gap-2">
        {languageOptions.map((option) => (
          <button
            key={option.code}
            type="button"
            onClick={() => setLanguage(option.code)}
            aria-label={option.code === 'en' ? t('nav.switchToEnglish') : t('nav.switchToItalian')}
            aria-pressed={language === option.code}
            className={cn(
              'min-h-11 border px-3 text-[11px] uppercase tracking-[0.18em] transition-colors',
              language === option.code
                ? 'border-ink bg-ink text-paper'
                : 'border-stone/60 text-ink/65 hover:border-ink hover:text-ink',
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={cn("fixed top-0 left-0 w-full z-[1000] p-5 sm:p-6 md:p-10 flex justify-between items-start pointer-events-none transition-colors duration-500", textColor)}
      >
        <Link to="/" className="pointer-events-auto group">
          <img
            src="/demo/logo.svg"
            alt="Carlos Giordano Giroldi"
            className={cn(
              'h-16 object-contain transition-all duration-500 md:h-24 md:opacity-100',
              dimMobileLogo ? 'opacity-45' : 'opacity-100',
            )}
          />
        </Link>

        <div className="relative z-[1001] pointer-events-auto" ref={menuRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="min-h-11 uppercase text-xs tracking-[0.2em] font-medium hover:opacity-70 transition-opacity"
          >
            {isOpen ? t('nav.close') : t('nav.menu')}
          </button>

          <AnimatePresence>
            {isOpen && (
              <>
                {/* Desktop Dropdown */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="hidden md:block absolute top-full right-0 z-[1001] mt-6 w-64 max-w-[calc(100vw-2rem)] bg-paper text-ink shadow-2xl p-8 border border-stone/20"
                >
                  <ul className="space-y-4">
                    {links.map((link, i) => (
                      <motion.li
                        key={link.path}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05, duration: 0.4 }}
                      >
                        <Link
                          to={link.path}
                          className={cn(
                            "font-serif text-2xl transition-opacity duration-300 block",
                            location.pathname === link.path ? "italic opacity-100" : "opacity-60 hover:opacity-100"
                          )}
                        >
                          {link.label}
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                  {languageSwitch()}
                </motion.div>

                {/* Mobile Panel */}
                <motion.button
                  type="button"
                  aria-label={t('nav.close')}
                  onClick={() => setIsOpen(false)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="fixed inset-0 z-[1000] bg-ink/10 backdrop-blur-[2px] md:hidden"
                />
                <motion.div
                  initial={{ opacity: 0, y: -18, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -18, scale: 0.98 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="fixed left-4 right-4 top-24 z-[1001] max-h-[calc(100svh-7rem)] overflow-y-auto border border-stone/60 bg-paper/95 px-6 py-6 text-ink shadow-2xl backdrop-blur-md sm:px-7 sm:py-7 md:hidden"
                >
                  <div className="mb-8 flex items-center justify-between border-b border-stone/50 pb-5">
                    <span className="text-[11px] uppercase tracking-[0.24em] text-muted">{t('nav.navigation')}</span>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] hover:opacity-70 transition-opacity"
                    >
                      {t('nav.close')} <X size={14} strokeWidth={1.5} />
                    </button>
                  </div>

                  <ul className="space-y-4">
                    {links.map((link, i) => (
                      <motion.li
                        key={link.path}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05, duration: 0.4 }}
                      >
                        <Link
                          to={link.path}
                          className={cn(
                            "block font-serif text-[clamp(2rem,10vw,2.45rem)] leading-[1.02] transition-opacity duration-300",
                            location.pathname === link.path ? "italic opacity-100" : "opacity-65 hover:opacity-100"
                          )}
                        >
                          {link.label}
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                  {languageSwitch(true)}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>
    </>
  );
}
