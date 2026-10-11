import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { getCategoryCopy } from '../data/localizedContent';
import { useLanguage } from '../lib/i18n';

const landscapeImages = [
  '/demo/scene-3.svg',
  '/demo/scene-2.svg',
  '/demo/scene-2.svg',
  '/demo/scene-4.svg',
  '/demo/scene-1.svg',
  '/demo/scene-2.svg',
  '/demo/scene-1.svg',
  '/demo/scene-4.svg',
  '/demo/scene-3.svg',
  '/demo/scene-1.svg',
  '/demo/scene-3.svg',
  '/demo/scene-2.svg',
  '/demo/scene-2.svg',
  '/demo/scene-1.svg',
  '/demo/scene-1.svg',
  '/demo/scene-4.svg',
  '/demo/scene-2.svg',
  '/demo/scene-4.svg',
  '/demo/scene-4.svg',
  '/demo/scene-3.svg',
  '/demo/scene-3.svg',
  '/demo/scene-2.svg',
  '/demo/scene-3.svg',
  '/demo/scene-1.svg',
  '/demo/scene-4.svg',
  '/demo/scene-3.svg',
  '/demo/scene-3.svg',
];

const spans = [
  'md:col-span-8 md:col-start-3',
  'md:col-span-7',
  'md:col-span-5 md:col-start-8 md:mt-28',
  'md:col-span-10 md:col-start-2',
  'md:col-span-6',
  'md:col-span-6 md:col-start-7 md:mt-20',
  'md:col-span-5 md:col-start-2',
  'md:col-span-7 md:col-start-6 md:mt-24',
  'md:col-span-8 md:col-start-3',
  'md:col-span-6',
  'md:col-span-5 md:col-start-8 md:mt-32',
  'md:col-span-7 md:col-start-2',
];

function formatTitle(src: string) {
  const fileName = decodeURIComponent(src)
    .split('/')
    .pop()
    ?.replace(/\.[^.]+$/, '')
    .replace(/^CG_paesaggi_/, '')
    .replace(/-\d+-scaled$/, '')
    .replace(/\s\(\d+\)$/, '')
    .replace(/_/g, '-')
    .replace(/-/g, ' ');

  return (fileName ?? 'Paesaggio')
    .split(' ')
    .filter(Boolean)
    .map((word) => {
      if (word.toLowerCase() === 'cg') return 'CG';
      if (word.toLowerCase() === 'doro') return "d'Oro";
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

export default function Paesaggi() {
  const { language, t } = useLanguage();
  const category = getCategoryCopy('paesaggi', language);

  return (
    <div className="min-h-screen px-6 pb-24 pt-32 md:px-10">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-20 md:mb-32">
          <Link to="/opere" className="mb-8 inline-block text-xs uppercase tracking-[0.2em] opacity-60 transition-opacity hover:opacity-100">
            &larr; {t('artwork.backToWorks')}
          </Link>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6 font-serif text-4xl italic sm:text-5xl md:text-6xl"
          >
            {category.name}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-2xl text-lg opacity-70 md:text-xl"
          >
            {category.description}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 gap-x-10 gap-y-20 md:grid-cols-12 md:gap-y-40">
          {landscapeImages.map((src, index) => {
            const title = formatTitle(src);

            return (
              <motion.div
                key={src}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 1 }}
                className={spans[index % spans.length]}
              >
                <div className="group cursor-pointer">
                  <div className="overflow-hidden bg-stone">
                    <img
                      src={src}
                      alt={title}
                      loading="lazy"
                      decoding="async"
                      className="h-auto w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-4 flex items-baseline justify-between gap-6 border-b border-stone/50 pb-4">
                    <h3 className="font-serif text-xl italic md:text-2xl">{title}</h3>
                    <span className="shrink-0 text-xs uppercase tracking-widest text-muted">{category.name}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
