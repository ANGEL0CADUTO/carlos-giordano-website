import { motion } from 'motion/react';
import type { ComponentPropsWithoutRef } from 'react';
import { useEffect } from 'react';
import { useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import type { Exhibition } from '../data/exhibitions';
import { getLocalizedExhibitions } from '../data/localizedContent';
import { useLanguage } from '../lib/i18n';

const exhibitionsScrollStorageKey = 'carlos-giordano-mostre-scroll';

const itemAnimation = {
  initial: { opacity: 0, y: 30, filter: 'brightness(1.18)' },
  whileInView: { opacity: 1, y: 0, filter: 'brightness(1)' },
  viewport: { once: true, amount: 0.15, margin: '0px 0px -40px 0px' },
  transition: { duration: 0.6, ease: 'easeOut' },
} as const;

type DesktopNodeProps = ComponentPropsWithoutRef<'div'> & {
  exhibition: Exhibition;
  index: number;
  openLabel: string;
};
type MobileNodeProps = ComponentPropsWithoutRef<'div'> & {
  exhibition: Exhibition;
  isLast: boolean;
  openLabel: string;
};

function getTimelineKey(exhibition: Exhibition) {
  return exhibition.year + '-' + exhibition.date + '-' + exhibition.title;
}

function saveExhibitionsScrollPosition() {
  window.sessionStorage.setItem(exhibitionsScrollStorageKey, String(window.scrollY));
}

function ExhibitionText({ exhibition, openLabel, align = 'left' }: { exhibition: Exhibition; openLabel: string; align?: 'left' | 'right' }) {
  return (
    <div className={align === 'right' ? 'text-right' : ''}>
      <div className={(align === 'right' ? 'justify-end' : 'justify-start') + ' mb-4 flex flex-wrap items-center gap-2'}>
        <span className="font-display text-3xl font-bold leading-none tracking-normal text-[#1a1a1a] xl:text-4xl">
          {exhibition.year}
        </span>
        <span className="border border-[#8b7d5e]/45 bg-[#e8e6df] px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[#8b7d5e]">
          {exhibition.date}
        </span>
      </div>
      <h3 className="mb-3 font-display text-3xl font-bold uppercase leading-[0.95] tracking-normal text-[#1a1a1a] transition-opacity group-hover:opacity-70 xl:text-4xl">
        {exhibition.title}
      </h3>
      <p className={(align === 'right' ? 'ml-auto' : '') + ' flex w-fit max-w-[280px] items-start gap-2 whitespace-pre-line text-left text-[15px] leading-[1.75] text-[#2d2d2d]'}>
        <MapPin size={15} strokeWidth={1.8} className="mt-[0.35em] flex-shrink-0 text-[#8b7d5e]" aria-hidden="true" />
        <span>{exhibition.location}</span>
      </p>
      <span className="mt-5 inline-block text-xs uppercase tracking-[0.2em] text-[#8b7d5e] opacity-0 transition-opacity group-hover:opacity-100">
        {openLabel}
      </span>
    </div>
  );
}

function TimelineImage({ exhibition, size = 'desktop' }: { exhibition: Exhibition; size?: 'desktop' | 'mobile' }) {
  const frameClass = size === 'desktop'
    ? 'h-[240px] w-[240px] 2xl:h-[320px] 2xl:w-[320px]'
    : 'h-[180px] w-full max-w-[180px] sm:h-[136px] sm:w-[136px]';

  return (
    <div className={frameClass + " flex flex-shrink-0 items-center justify-center overflow-hidden bg-[#e8e6df] p-2 shadow-sm transition-transform duration-500 group-hover:scale-[1.02]"}>
      <img src={exhibition.image} alt={exhibition.title} loading="lazy" decoding="async" className="h-full w-full object-contain" />
    </div>
  );
}

function DesktopNode({ exhibition, index, openLabel }: DesktopNodeProps) {
  const isLeft = index % 2 === 1;

  return (
    <motion.div {...itemAnimation} className="relative mb-36 xl:mb-52">
      <div className="absolute left-1/2 top-0 z-10 h-4 w-4 -translate-x-1/2 rounded-full border-[4px] border-[#1a1a1a] bg-white" />

      {isLeft ? (
        <>
          <div className="absolute right-[calc(50%+7px)] top-[7px] w-[48px] border-t-2 border-dashed border-[#b0a382] 2xl:w-[68px]" />
          <div className="absolute right-[calc(50%+54px)] top-[4px] h-2 w-2 rounded-full bg-[#b0a382] 2xl:right-[calc(50%+74px)]" />
          <div className="mr-[calc(50%+72px)] 2xl:mr-[calc(50%+96px)]">
            <Link to={'/mostre/' + exhibition.slug} onClick={saveExhibitionsScrollPosition} className="group flex items-start justify-end gap-5 2xl:gap-7">
              <ExhibitionText exhibition={exhibition} openLabel={openLabel} align="right" />
              <TimelineImage exhibition={exhibition} />
            </Link>
          </div>
        </>
      ) : (
        <>
          <div className="absolute left-[calc(50%+7px)] top-[7px] w-[48px] border-t-2 border-dashed border-[#b0a382] 2xl:w-[68px]" />
          <div className="absolute left-[calc(50%+54px)] top-[4px] h-2 w-2 rounded-full bg-[#b0a382] 2xl:left-[calc(50%+74px)]" />
          <div className="ml-[calc(50%+72px)] 2xl:ml-[calc(50%+96px)]">
            <Link to={'/mostre/' + exhibition.slug} onClick={saveExhibitionsScrollPosition} className="group flex items-start gap-5 2xl:gap-7">
              <TimelineImage exhibition={exhibition} />
              <ExhibitionText exhibition={exhibition} openLabel={openLabel} />
            </Link>
          </div>
        </>
      )}
    </motion.div>
  );
}

function MobileNode({ exhibition, isLast, openLabel }: MobileNodeProps) {
  return (
    <motion.div {...itemAnimation} className={'relative ' + (isLast ? 'mb-12' : 'mb-20')}>
      <div className="absolute left-[-31px] top-1 z-10 h-[13px] w-[13px] rounded-full border-[4px] border-[#1a1a1a] bg-white" />
      <div className="absolute left-[-19px] top-[7px] w-7 border-t-2 border-dashed border-[#b0a382]" />
      <Link to={'/mostre/' + exhibition.slug} onClick={saveExhibitionsScrollPosition} className="group flex flex-col gap-4 sm:flex-row sm:items-start">
        <TimelineImage exhibition={exhibition} size="mobile" />
        <ExhibitionText exhibition={exhibition} openLabel={openLabel} />
      </Link>
    </motion.div>
  );
}

export default function Exhibitions() {
  const { language, t } = useLanguage();
  const exhibitions = getLocalizedExhibitions(language);

  useEffect(() => {
    document.documentElement.classList.add('exhibitions-scrollbar');
    document.body.classList.add('exhibitions-scrollbar');

    return () => {
      document.documentElement.classList.remove('exhibitions-scrollbar');
      document.body.classList.remove('exhibitions-scrollbar');
    };
  }, []);

  useLayoutEffect(() => {
    const savedScroll = window.sessionStorage.getItem(exhibitionsScrollStorageKey);
    if (!savedScroll) return;

    window.scrollTo(0, Number(savedScroll));
  }, []);

  useEffect(() => {
    const savedScroll = window.sessionStorage.getItem(exhibitionsScrollStorageKey);
    if (!savedScroll) return;

    const cleanupTimer = window.setTimeout(() => {
      window.sessionStorage.removeItem(exhibitionsScrollStorageKey);
    }, 150);

    return () => window.clearTimeout(cleanupTimer);
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#f5f5f5] font-sans text-[#2d2d2d]">
      <div className="fixed bottom-0 left-0 top-0 hidden w-[3px] bg-[#8b7d5e]/30 md:block" />

      <div className="mx-auto w-full max-w-[1680px] px-6 py-12 sm:px-10 sm:py-16 lg:px-12 lg:py-20 xl:px-16">
        <motion.h1
          initial={{ opacity: 0, y: 18, filter: 'brightness(1.16)' }}
          animate={{ opacity: 1, y: 0, filter: 'brightness(1)' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-20 ml-12 w-fit font-display text-[36px] font-bold leading-[0.92] tracking-normal text-[#1a1a1a] sm:mb-24 sm:ml-24 sm:text-[46px] md:ml-32 lg:mb-32 lg:ml-40 lg:text-[56px]"
        >
          {t('exhibitions.title')}
        </motion.h1>

        <div className="relative hidden xl:block">
          <div className="absolute bottom-0 left-1/2 top-0 w-0.5 -translate-x-1/2 bg-[#8b7d5e]" />
          {exhibitions.map((exhibition, index) => (
            <DesktopNode key={getTimelineKey(exhibition)} exhibition={exhibition} index={index} openLabel={t('exhibitions.open')} />
          ))}
        </div>

        <div className="relative pl-10 sm:pl-12 xl:hidden">
          <div className="absolute bottom-0 left-4 top-0 w-0.5 bg-[#8b7d5e]" />
          {exhibitions.map((exhibition, index) => (
            <MobileNode
              key={getTimelineKey(exhibition)}
              exhibition={exhibition}
              isLast={index === exhibitions.length - 1}
              openLabel={t('exhibitions.open')}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
