import { motion } from 'motion/react';
import { CalendarDays } from 'lucide-react';
import { newsArticles } from '../data/news';
import { useLanguage } from '../lib/i18n';

export default function News() {
  const { language, t } = useLanguage();
  const [featuredArticle, ...secondaryArticles] = newsArticles;

  const getArticleCopy = (article: (typeof newsArticles)[number]) => ({
    date: language === 'en' ? article.dateEn : article.date,
    kicker: language === 'en' ? article.kickerEn : article.kicker,
    title: language === 'en' ? article.titleEn : article.title,
    excerpt: language === 'en' ? article.excerptEn : article.excerpt,
    body: language === 'en' ? article.bodyEn : article.body,
    alt: language === 'en' ? article.altEn : article.alt,
  });

  const featured = getArticleCopy(featuredArticle);

  return (
    <div className="min-h-screen bg-ink text-paper">
      <header className="mx-auto max-w-7xl px-5 pb-10 pt-32 sm:px-6 sm:pt-36 md:px-10 md:pb-14">
        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl font-serif text-5xl leading-[0.95] sm:text-6xl md:text-8xl"
        >
          {t('news.title')}
        </motion.h1>
      </header>

      <div className="mx-auto max-w-7xl px-5 pb-7 sm:px-6 md:px-10">
        <p className="border-b border-paper/20 pb-4 text-xs uppercase tracking-[0.24em] text-paper/55">{t('news.featured')}</p>
      </div>

      <motion.article
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.85, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        className="group mx-auto max-w-7xl px-5 pb-24 sm:px-6 md:px-10 md:pb-32"
      >
        <div className="grid overflow-hidden border border-paper/12 bg-paper/[0.04] md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <div className="aspect-[4/3] overflow-hidden bg-paper/5 md:aspect-auto md:min-h-[22rem]">
            <img
              src={featuredArticle.image}
              alt={featured.alt}
              className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.02]"
            />
          </div>
          <div className="flex min-w-0 flex-col justify-center px-5 py-7 sm:px-7 sm:py-8 md:px-10 md:py-10">
            <div className="mb-4 flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-paper/55">
              <span>{featured.kicker}</span>
              <span className="h-px w-8 bg-paper/25" aria-hidden="true" />
              <span className="inline-flex items-center gap-2">
                <CalendarDays size={13} strokeWidth={1.7} aria-hidden="true" />
                {featured.date}
              </span>
            </div>
            <h2 className="font-serif text-3xl italic leading-tight sm:text-4xl md:text-[2.65rem]">{featured.title}</h2>
            <p className="mt-5 text-base leading-relaxed text-paper/75 md:text-lg">{featured.excerpt}</p>
            <p className="mt-5 text-sm leading-7 text-paper/55">{featured.body}</p>
          </div>
        </div>
      </motion.article>

      <section className="bg-paper px-5 py-20 text-ink sm:px-6 md:px-10 md:py-28" aria-label={t('news.latest')}>
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col gap-3 border-b border-stone/60 pb-6 md:flex-row md:items-end md:justify-between">
            <h2 className="font-serif text-4xl leading-tight md:text-5xl">{t('news.latest')}</h2>
            <p className="max-w-md text-sm uppercase tracking-[0.2em] text-muted">{newsArticles.length} {t('news.items')}</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {secondaryArticles.map((article, index) => {
              const articleCopy = getArticleCopy(article);

              return (
                <motion.article
                  key={article.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className="group flex min-w-0 flex-col border border-stone/70 bg-[#f6f4ef] p-2 shadow-[0_18px_46px_rgba(26,26,26,0.06)]"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-stone/60">
                    <img
                      src={article.image}
                      alt={articleCopy.alt}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="flex flex-1 flex-col px-3 py-6 sm:px-5 sm:py-7">
                    <div className="mb-4 flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-muted">
                      <span>{articleCopy.kicker}</span>
                      <span className="h-px w-8 bg-ink/20" aria-hidden="true" />
                      <span>{articleCopy.date}</span>
                    </div>
                    <h3 className="font-serif text-3xl italic leading-tight md:text-4xl">{articleCopy.title}</h3>
                    <p className="mt-5 text-base leading-7 text-ink/68">{articleCopy.excerpt}</p>
                    <p className="mt-5 text-sm leading-7 text-ink/55">{articleCopy.body}</p>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
