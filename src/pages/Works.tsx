import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { getLocalizedArtworkCategories } from '../data/localizedContent';
import { videos } from '../data/videos';
import { useLanguage } from '../lib/i18n';

export default function Works() {
  const { language, t } = useLanguage();
  const allCategories = getLocalizedArtworkCategories(language);
  const artworkCategories = allCategories.filter((category) => !category.parentId);
  const artworkCount = (id: string) => allCategories
    .filter((category) => category.id === id || category.parentId === id)
    .reduce((count, category) => count + category.artworks.length, 0);
  const videoCover = videos.find((video) => video.title === 'Well-Known Secrets') ?? videos[0] ?? { thumbnail: '/demo/scene-1.svg' };

  return (
    <div className="min-h-screen px-4 pb-10 pt-20 sm:px-6 sm:pt-24 md:px-10 lg:pt-20">
      <header className="works-overview-header mx-auto mb-8 sm:mb-9 lg:mb-7">
        <h1 className="mb-3 font-serif text-4xl leading-tight sm:text-5xl lg:text-5xl">{t('works.title')}</h1>
        <p className="text-xs uppercase tracking-widest text-muted sm:text-sm">{t('works.subtitle')}</p>
      </header>

      <div className="works-overview-grid mx-auto grid grid-cols-1 gap-8 sm:grid-cols-2 md:justify-center md:gap-x-7 md:gap-y-4">
        {artworkCategories.map((cat, i) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: i * 0.1 }}
            className="works-overview-card mx-auto w-full"
          >
            <Link to={`/opere/${cat.id}`} className="group block">
              <div className="mb-3 aspect-[4/5] overflow-hidden">
                <img
                  src={cat.cover}
                  alt={cat.name}
                  loading={i < 2 ? 'eager' : 'lazy'}
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                />
              </div>
              <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-stone/50 pb-2.5">
                <h2 className="min-w-0 flex-1 break-words font-serif text-xl leading-tight transition-opacity group-hover:opacity-70">{cat.name}</h2>
                <span className="shrink-0 text-xs text-muted">
                  {artworkCount(cat.id)} {artworkCount(cat.id) === 1 ? t('works.countSingular') : t('works.countPlural')}
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: artworkCategories.length * 0.1 }}
          className="works-overview-card mx-auto w-full"
        >
          <Link to="/opere/video" className="group block">
            <div className="mb-3 flex aspect-[4/5] items-center justify-center overflow-hidden">
              <img
                src={videoCover.thumbnail}
                alt={t('videos.title')}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
              />
            </div>
            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-stone/50 pb-2.5">
              <h2 className="min-w-0 flex-1 break-words font-serif text-xl leading-tight transition-opacity group-hover:opacity-70">{t('videos.title')}</h2>
              <span className="shrink-0 text-xs text-muted">
                {videos.length} {t('videos.countPlural')}
              </span>
            </div>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
