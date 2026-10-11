import { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { pressTexts } from '../data/pressTexts';
import { useLanguage } from '../lib/i18n';
import { cn } from '../lib/utils';

export default function Press() {
  const { language, t } = useLanguage();
  const [activeTextId, setActiveTextId] = useState(pressTexts[0].id);
  const activeTextRef = useRef<HTMLDivElement>(null);
  const textListRef = useRef<HTMLDivElement>(null);
  const activeText = pressTexts.find((text) => text.id === activeTextId) ?? pressTexts[0];
  const activeTextBody = language === 'en' ? activeText.textEn : activeText.text;
  const activeMeta = activeText.attribution ?? [activeText.author, activeText.publication].filter(Boolean).join(' — ');
  const handleTextSelect = (textId: string) => {
    setActiveTextId(textId);
    window.requestAnimationFrame(() => {
      activeTextRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };
  const scrollTextList = () => {
    textListRef.current?.scrollBy({ left: 220, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-ink px-5 pb-20 pt-32 text-paper sm:px-6 md:px-10">
      <header className="max-w-4xl mx-auto mb-32 text-center">
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl mb-6">{t('press.title')}</h1>
        <p className="text-sm uppercase tracking-widest opacity-50">{t('press.subtitle')}</p>
      </header>

      <section className="mx-auto mb-24 max-w-5xl" aria-label={t('press.chooseText')}>
        <p className="mb-5 text-center text-xs uppercase tracking-[0.2em] opacity-45">{t('press.availableTexts')}</p>
        <div className="relative">
          <div ref={textListRef} className="flex gap-2 overflow-x-auto border-y border-paper/15 py-4 pr-14 md:flex-wrap md:justify-center md:overflow-visible md:pr-0">
            {pressTexts.map((pressText) => {
              const isActive = pressText.id === activeText.id;

              return (
                <button
                  key={pressText.id}
                  type="button"
                  onClick={() => handleTextSelect(pressText.id)}
                  aria-pressed={isActive}
                  className={cn(
                    'min-h-11 flex-shrink-0 border px-4 py-2 text-left text-[11px] uppercase tracking-[0.16em] transition-colors md:flex-shrink',
                    isActive
                      ? 'border-paper bg-paper text-ink'
                      : 'border-paper/20 text-paper/60 hover:border-paper/60 hover:text-paper',
                  )}
                >
                  {pressText.title}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={scrollTextList}
            aria-label={t('press.scrollTexts')}
            className="absolute bottom-[5px] right-[-6px] top-[-3px] flex w-14 items-center justify-end bg-gradient-to-l from-ink via-ink/90 to-transparent pr-1 text-paper/80 md:hidden"
          >
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.25, repeat: Infinity, ease: 'easeInOut' }}
              className="flex h-9 w-9 items-center justify-center"
            >
              <ChevronRight size={24} strokeWidth={1.7} />
            </motion.span>
          </button>
        </div>
      </section>

      <motion.div
        ref={activeTextRef}
        key={activeText.id}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-4xl scroll-mt-28 text-center"
      >
        <h2 className="mb-10 font-serif text-4xl italic leading-tight md:text-6xl">{activeText.title}</h2>
        <div className="mb-10 whitespace-pre-line text-balance font-serif text-xl leading-relaxed md:text-3xl">
          {activeTextBody}
        </div>
        {activeMeta && (
          <div className="text-xs uppercase tracking-[0.2em] opacity-60">
            <span className="font-bold">{activeMeta}</span>
          </div>
        )}
      </motion.div>
    </div>
  );
}
