import { motion } from 'motion/react';
import { Play } from 'lucide-react';
import { useLanguage } from '../lib/i18n';

const aboutVideoUrl = 'https://www.youtube.com/watch?v=xmAZ5l2imag&t=16s';

export default function About() {
  const { t } = useLanguage();
  const paragraphs = [
    t('about.paragraph.1'),
    t('about.paragraph.2'),
    t('about.paragraph.3'),
    t('about.paragraph.4'),
    t('about.paragraph.5'),
    t('about.paragraph.6'),
  ];

  return (
    <div className="pt-32 pb-20 px-6 md:px-10 min-h-screen">
      <div className="mx-auto grid max-w-[92rem] grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-16 xl:-translate-x-12 xl:gap-20 2xl:-translate-x-20">

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="lg:col-span-6 lg:pt-36 xl:pt-44 2xl:pt-48"
        >
          <div className="lg:sticky lg:top-36">
            <div className="mx-auto w-full max-w-[70%] overflow-hidden lg:mr-0">
              <img
                src="/demo/scene-2.svg"
                alt={t('about.imageAlt')}
                className="h-auto w-full"
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="lg:col-span-6 lg:pt-20"
        >
          <h1 className="mb-6 font-serif text-4xl leading-tight sm:text-5xl md:mb-8 lg:text-6xl">Carlos Giordano Giroldi</h1>

          <div className="prose prose-lg prose-p:font-serif prose-p:text-lg md:prose-p:text-xl prose-p:leading-relaxed prose-p:text-ink/80 max-w-none">
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

        </motion.div>

      </div>

      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.35 }}
        className="mx-auto mt-24 max-w-3xl border-t border-stone/50 pt-12 md:mt-28 md:pt-16"
      >
        <p className="mb-4 text-xs uppercase tracking-[0.2em] text-muted">{t('exhibition.video')}</p>
        <div className="aspect-video overflow-hidden bg-[#1a1a1a]">
          <a
            href={aboutVideoUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={t('about.videoCaption')}
            className="group relative flex h-full w-full items-center justify-center overflow-hidden bg-[#1a1a1a]"
          >
            <img
              src="/demo/scene-4.svg"
              alt=""
              className="h-full w-full object-cover opacity-90 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
              loading="lazy"
            />
            <span className="absolute inset-0 bg-ink/25 transition-colors duration-300 group-hover:bg-ink/10" aria-hidden="true" />
            <span className="absolute flex h-14 w-14 items-center justify-center rounded-full bg-paper/95 text-ink shadow-[0_14px_32px_rgba(0,0,0,0.25)] transition-transform duration-300 group-hover:scale-105" aria-hidden="true">
              <Play size={23} strokeWidth={1.8} className="ml-0.5" />
            </span>
          </a>
        </div>
        <h2 className="mt-4 break-words border-b border-stone/50 pb-4 font-serif text-2xl italic leading-tight">{t('about.videoCaption')}</h2>
      </motion.section>
    </div>
  );
}
