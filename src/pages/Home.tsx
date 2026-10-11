import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { artworkCategories } from '../data/artworkCategories';
import { useLanguage } from '../lib/i18n';

type HeroSlide = {
  src: string;
  title: string;
  year?: string;
  categoryId: string;
};

const newHeroSlideSrcs = new Set([
  '/demo/scene-1.svg',
  '/demo/scene-3.svg',
  '/demo/scene-4.svg',
  '/demo/scene-1.svg',
  '/demo/scene-2.svg',
  '/demo/scene-4.svg',
  '/demo/scene-1.svg',
  '/demo/scene-3.svg',
  '/demo/scene-4.svg',
  '/demo/scene-3.svg',
  '/demo/scene-1.svg',
  '/demo/scene-3.svg',
  '/demo/scene-1.svg',
  '/demo/scene-2.svg',
  '/demo/scene-2.svg',
  '/demo/scene-3.svg',
  '/demo/scene-1.svg',
  '/demo/scene-1.svg',
  '/demo/scene-3.svg',
  '/demo/scene-4.svg',
  '/demo/scene-2.svg',
  '/demo/scene-1.svg',
  '/demo/scene-1.svg',
  '/demo/scene-3.svg',
  '/demo/scene-1.svg',
  '/demo/scene-4.svg',
  '/demo/scene-1.svg',
  '/demo/scene-4.svg',
  '/demo/scene-3.svg',
  '/demo/scene-4.svg',
]);

const portraitHeroSlideSrcs = new Set([
  '/demo/scene-2.svg',
  '/demo/scene-4.svg',
  '/demo/scene-1.svg',
  '/demo/scene-1.svg',
  '/demo/scene-4.svg',
  '/demo/scene-2.svg',
  '/demo/scene-3.svg',
  '/demo/scene-1.svg',
  '/demo/scene-3.svg',
  '/demo/scene-2.svg',
  '/demo/scene-1.svg',
  '/demo/scene-2.svg',
  '/demo/scene-2.svg',
  '/demo/scene-2.svg',
  '/demo/scene-3.svg',
  '/demo/scene-4.svg',
  '/demo/scene-4.svg',
  '/demo/scene-3.svg',
  '/demo/scene-1.svg',
  '/demo/scene-4.svg',
  '/demo/scene-3.svg',
  '/demo/scene-3.svg',
  '/demo/scene-3.svg',
  '/demo/scene-1.svg',
  '/demo/scene-2.svg',
  '/demo/scene-3.svg',
  '/demo/scene-3.svg',
  '/demo/scene-4.svg',
  '/demo/scene-3.svg',
  '/demo/scene-3.svg',
  '/demo/scene-3.svg',
  '/demo/scene-1.svg',
  '/demo/scene-3.svg',
  '/demo/scene-4.svg',
  '/demo/scene-1.svg',
  '/demo/scene-1.svg',
  '/demo/scene-4.svg',
  '/demo/scene-1.svg',
  '/demo/scene-3.svg',
  '/demo/scene-1.svg',
  '/demo/scene-1.svg',
  '/demo/scene-3.svg',
  '/demo/scene-4.svg',
  '/demo/scene-3.svg',
  '/demo/scene-1.svg',
  '/demo/scene-4.svg',
  '/demo/scene-3.svg',
  '/demo/scene-2.svg',
  '/demo/scene-4.svg',
  '/demo/scene-1.svg',
  '/demo/scene-4.svg',
  '/demo/scene-3.svg',
  '/demo/scene-3.svg',
  '/demo/scene-3.svg',
  '/demo/scene-2.svg',
  '/demo/scene-1.svg',
  '/demo/scene-1.svg',
  '/demo/scene-1.svg',
  '/demo/scene-4.svg',
  '/demo/scene-3.svg',
  '/demo/scene-2.svg',
  '/demo/scene-1.svg',
  '/demo/scene-2.svg',
  '/demo/scene-1.svg',
  '/demo/scene-1.svg',
  '/demo/scene-2.svg',
  '/demo/scene-4.svg',
  '/demo/scene-3.svg',
  '/demo/scene-4.svg',
  '/demo/scene-2.svg',
  '/demo/scene-1.svg',
  '/demo/scene-1.svg',
  '/demo/scene-1.svg',
  '/demo/scene-3.svg',
  '/demo/scene-1.svg',
  '/demo/scene-4.svg',
  '/demo/scene-1.svg',
  '/demo/scene-3.svg',
  '/demo/scene-2.svg',
  '/demo/scene-1.svg',
  '/demo/scene-4.svg',
  '/demo/scene-3.svg',
]);

function stableHash(value: string) {
  return [...value].reduce((hash, character) => ((hash << 5) - hash + character.charCodeAt(0)) | 0, 0);
}

function insertCasualHeroSlides(baseSlides: HeroSlide[], slidesToInsert: HeroSlide[]) {
  if (slidesToInsert.length === 0) return baseSlides;

  const protectedLeadCount = 10;
  const insertPositions = [12, 23, 35, 48, 62, 77, 93, 110];
  const result = [...baseSlides];

  slidesToInsert.forEach((slide, index) => {
    const requestedPosition = insertPositions[index] ?? protectedLeadCount + index * 13;
    const insertionIndex = Math.min(Math.max(requestedPosition, protectedLeadCount), result.length);
    result.splice(insertionIndex, 0, slide);
  });

  return result;
}

function buildHeroSlides(): HeroSlide[] {
  const categoryOrder = ['still-life', 'paesaggi', 'astratti', 'figura-umana', 'misteri-marini', 'still-life/botaniche'];
  const toHeroSlide = (categoryId: string, artwork: (typeof artworkCategories)[number]['artworks'][number]) => ({
    src: artwork.src,
    title: artwork.title,
    year: artwork.year,
    categoryId: categoryId,
  });

  const newSlides = categoryOrder.flatMap((categoryId) => {
    const category = artworkCategories.find((item) => item.id === categoryId);

    return [...(category?.artworks ?? [])]
      .filter((artwork) => newHeroSlideSrcs.has(artwork.src))
      .sort((a, b) => stableHash(a.src) - stableHash(b.src))
      .map((artwork) => toHeroSlide(categoryId, artwork));
  });

  const groupedSlides = categoryOrder.map((categoryId) => {
    const category = artworkCategories.find((item) => item.id === categoryId);

    return [...(category?.artworks ?? [])]
      .filter((artwork) => !newHeroSlideSrcs.has(artwork.src))
      .sort((a, b) => stableHash(a.src) - stableHash(b.src))
      .map((artwork) => toHeroSlide(categoryId, artwork));
  });

  const mixedSlides: HeroSlide[] = [];
  const longestGroup = Math.max(...groupedSlides.map((slides) => slides.length));

  for (let index = 0; index < longestGroup; index += 1) {
    groupedSlides.forEach((slides) => {
      const slide = slides[index];
      if (slide) mixedSlides.push(slide);
    });
  }

  const uniqueSlides = Array.from(new Map(mixedSlides.map((slide) => [slide.src, slide])).values());
  const firstSlide = uniqueSlides.find((slide) => slide.src === '/demo/scene-4.svg');
  const ossessioneSlide = uniqueSlides.find((slide) => slide.title === 'Ossessione');
  const orderedSlides = [
    ...(firstSlide ? [firstSlide] : []),
    ...uniqueSlides.filter((slide) => slide.src !== firstSlide?.src && slide.src !== ossessioneSlide?.src),
  ];

  if (!ossessioneSlide) return insertCasualHeroSlides(orderedSlides, newSlides);

  const insertionIndex = Math.max(orderedSlides.length - 8, 1);
  return insertCasualHeroSlides([
    ...orderedSlides.slice(0, insertionIndex),
    ossessioneSlide,
    ...orderedSlides.slice(insertionIndex),
  ], newSlides);
}

const heroSlides = buildHeroSlides();

export default function Home() {
  const [activeSlide, setActiveSlide] = useState(0);
  const hasUsedInitialSlideDelay = useRef(false);
  const currentSlide = heroSlides[activeSlide];
  const artworkLink = `/opere/${currentSlide.categoryId}?artwork=${encodeURIComponent(currentSlide.src)}`;
  const isPortraitSlide = portraitHeroSlideSrcs.has(currentSlide.src);
  const frameWidthClass = isPortraitSlide ? 'hero-frame-width-narrow' : 'hero-frame-width';
  const frameAspectClass = isPortraitSlide ? 'aspect-[4/5]' : 'aspect-[4/3] xl:aspect-[16/10] 2xl:aspect-[16/9]';
  const { t, language } = useLanguage();

  useEffect(() => {
    const slideDelay = !hasUsedInitialSlideDelay.current && activeSlide === 0 ? 4200 : 5200;
    const timeout = window.setTimeout(() => {
      hasUsedInitialSlideDelay.current = true;
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, slideDelay);

    return () => window.clearTimeout(timeout);
  }, [activeSlide]);

  function showPreviousSlide() {
    setActiveSlide((current) => (current - 1 + heroSlides.length) % heroSlides.length);
  }

  function showNextSlide() {
    setActiveSlide((current) => (current + 1) % heroSlides.length);
  }

  return (
    <div className="w-full">
      <section className="mx-auto max-w-4xl px-6 pt-28 text-center md:pt-32">
        <h1 className="font-serif text-3xl leading-tight md:text-4xl">Carlos Giordano Giroldi</h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-ink/75">
          {language === 'it'
            ? 'Pittore contemporaneo a Milano. Un percorso tra figura umana, paesaggi, nature morte e astrazione, attraverso acquarelli e tecniche miste su carta.'
            : 'Contemporary painter based in Milan. A journey through the human figure, landscapes, still life and abstraction, using watercolors and mixed media on paper.'}
        </p>
        <nav aria-label={language === 'it' ? 'Scopri il lavoro di Carlos' : 'Explore Carlos’s work'} className="mt-5 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm underline underline-offset-4">
          <Link to="/opere">{t('nav.works')}</Link>
          <Link to="/chi-sono">{t('nav.about')}</Link>
          <Link to="/mostre">{t('nav.exhibitions')}</Link>
        </nav>
      </section>
      {/* Framed Hero Slideshow */}
      <section className="relative flex min-h-[75svh] w-full items-center justify-center overflow-x-hidden bg-[#f6f6f3] px-4 pb-10 pt-24 sm:px-6 md:px-8 md:pb-12 md:pt-28">
        <div className="flex w-full max-w-[1780px] flex-col items-center">
          <div className="hero-slide-stage">
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={currentSlide.src}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, ease: 'easeInOut' }}
                className={frameWidthClass + " flex flex-col gap-4 text-ink sm:gap-5"}
              >
                <Link to={artworkLink} className="relative block border border-[#deded8] bg-[#f2f2ee] p-1.5 shadow-[0_24px_70px_rgba(17,17,17,0.12)] sm:p-2 md:p-2.5" aria-label={currentSlide.title}>
                  <div className={frameAspectClass + " relative w-full overflow-hidden bg-[#f8f8f5]"}>
                    <motion.img
                      initial={{ scale: 1.01 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0.995 }}
                      transition={{ duration: 1, ease: 'easeInOut' }}
                      src={currentSlide.src}
                      alt={currentSlide.title}
                      className="absolute inset-0 h-full w-full object-contain"
                    />
                  </div>
                </Link>

                <div>
                  <p className="mb-2 text-xs uppercase tracking-[0.3em] opacity-70">{t('home.selectedWork')}</p>
                  <h2 className="break-words font-serif text-[1.55rem] leading-tight italic tracking-wide sm:text-3xl md:text-4xl">
                    {currentSlide.title}{currentSlide.year ? `, ${currentSlide.year}` : ''}
                  </h2>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        <button
          type="button"
          onClick={showPreviousSlide}
          aria-label={t('home.previousWork')}
          className="absolute left-3 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center text-ink/35 transition-colors hover:text-ink/65 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/35 md:left-8 md:flex"
        >
          <ChevronLeft size={34} strokeWidth={1.2} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={showNextSlide}
          aria-label={t('home.nextWork')}
          className="absolute right-3 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center text-ink/35 transition-colors hover:text-ink/65 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/35 md:right-8 md:flex"
        >
          <ChevronRight size={34} strokeWidth={1.2} aria-hidden="true" />
        </button>
      </section>

    </div>
  );
}
