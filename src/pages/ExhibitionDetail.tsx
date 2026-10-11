import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Play } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { getLocalizedExhibition } from '../data/localizedContent';
import { useLanguage } from '../lib/i18n';

function getYoutubeVideoId(videoUrl: string) {
  return new URL(videoUrl).pathname.split('/').filter(Boolean).pop() ?? '';
}

function getYoutubeWatchUrl(videoUrl: string) {
  const url = new URL(videoUrl);
  const videoId = getYoutubeVideoId(videoUrl);
  const watchUrl = new URL('https://www.youtube.com/watch');

  if (videoId) {
    watchUrl.searchParams.set('v', videoId);
  }

  const start = url.searchParams.get('start');
  if (start) {
    watchUrl.searchParams.set('t', start + 's');
  }

  return watchUrl.toString();
}

export default function ExhibitionDetail() {
  const { exhibitionSlug } = useParams();
  const { language, t } = useLanguage();
  const exhibition = getLocalizedExhibition(exhibitionSlug, language);
  const gallery = exhibition?.gallery ?? [];
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const selectedImage = selectedImageIndex === null ? null : gallery[selectedImageIndex];
  const imageLabel = language === 'it' ? 'immagine' : 'image';

  useEffect(() => {
    document.documentElement.classList.add('exhibitions-scrollbar');
    document.body.classList.add('exhibitions-scrollbar');

    return () => {
      document.documentElement.classList.remove('exhibitions-scrollbar');
      document.body.classList.remove('exhibitions-scrollbar');
    };
  }, []);

  useEffect(() => {
    if (selectedImageIndex === null) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setSelectedImageIndex(null);
      }

      if (event.key === 'ArrowLeft') {
        setSelectedImageIndex((current) => current === null ? current : (current - 1 + gallery.length) % gallery.length);
      }

      if (event.key === 'ArrowRight') {
        setSelectedImageIndex((current) => current === null ? current : (current + 1) % gallery.length);
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gallery.length, selectedImageIndex]);

  if (!exhibition) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] px-6 py-32 text-[#1a1a1a] md:px-10">
        <div className="mx-auto max-w-6xl">
          <Link to="/mostre" className="mb-8 inline-block text-xs uppercase tracking-[0.2em] text-[#2d2d2d]/60 transition-opacity hover:opacity-100">
            &larr; {t('exhibition.backToExhibitions')}
          </Link>
          <h1 className="font-serif text-5xl italic">{t('exhibition.notFound')}</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] px-5 pb-24 pt-32 text-[#1a1a1a] sm:px-8 md:px-10">
      <article className="mx-auto max-w-[1500px]">
        <Link to="/mostre" className="mb-10 inline-block text-xs uppercase tracking-[0.2em] text-[#2d2d2d]/60 transition-opacity hover:opacity-100">
          &larr; {t('exhibition.backToExhibitions')}
        </Link>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-16 xl:gap-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="lg:sticky lg:top-28 lg:self-start"
          >
            <div className="border border-[#d7d2c5] bg-[#efede7] p-2 shadow-[0_22px_70px_rgba(26,26,26,0.10)] sm:p-3">
              <div className="flex max-h-[78svh] min-h-[18rem] items-center justify-center bg-[#faf9f5]">
                <img src={exhibition.image} alt={exhibition.title} className="max-h-[76svh] w-full object-contain" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
          >
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.24em] text-[#8b7d5e]">
              {exhibition.year} / {exhibition.date}
            </p>
            <h1 className="font-display text-4xl font-bold uppercase leading-[0.92] tracking-normal text-[#1a1a1a] sm:text-5xl lg:text-6xl">
              {exhibition.title}
            </h1>

            <dl className="mt-10 grid grid-cols-1 gap-5 border-y border-[#8b7d5e]/35 py-7 text-sm leading-relaxed text-[#2d2d2d] sm:grid-cols-[8rem_1fr] sm:gap-x-8">
              <dt className="text-xs uppercase tracking-[0.2em] text-[#8b7d5e]">{t('exhibition.period')}</dt>
              <dd>{exhibition.period}</dd>
              <dt className="text-xs uppercase tracking-[0.2em] text-[#8b7d5e]">{t('exhibition.location')}</dt>
              <dd className="whitespace-pre-line">{exhibition.location}</dd>
              {exhibition.type && (
                <>
                  <dt className="text-xs uppercase tracking-[0.2em] text-[#8b7d5e]">{t('exhibition.format')}</dt>
                  <dd>{exhibition.type}</dd>
                </>
              )}
            </dl>

            <div className="mt-10 space-y-6 font-serif text-xl leading-relaxed text-[#2d2d2d] md:text-2xl">
              {exhibition.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            {exhibition.credit && (
              <p className="mt-10 text-xs uppercase tracking-[0.2em] text-[#2d2d2d]/60">{exhibition.credit}</p>
            )}

            {exhibition.videoUrl && (
              <div className="mt-12">
                <p className="mb-4 text-xs uppercase tracking-[0.2em] text-[#8b7d5e]">{t('exhibition.video')}</p>
                <div className="aspect-video overflow-hidden bg-[#1a1a1a]">
                  <a
                    href={getYoutubeWatchUrl(exhibition.videoUrl)}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={exhibition.title}
                    className="group relative flex h-full w-full items-center justify-center overflow-hidden bg-[#1a1a1a]"
                  >
                    <img
                      src={`/demo/scene-3.svg`}
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
              </div>
            )}
          </motion.div>
        </div>

        {exhibition.gallery?.length ? (
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18, ease: 'easeOut' }}
            className="mt-20 border-t border-[#8b7d5e]/30 pt-12 sm:mt-24 sm:pt-16"
          >
            <div className="mb-8 flex flex-col gap-3 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-[#8b7d5e]">
                  {t('exhibition.materials')}
                </p>
                <h2 className="font-display text-3xl font-bold uppercase leading-none tracking-normal text-[#1a1a1a] sm:text-4xl">
                  {t('exhibition.images')}
                </h2>
              </div>
              <p className="max-w-md text-sm leading-relaxed text-[#2d2d2d]/70">
                {t('exhibition.galleryHint')}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {exhibition.gallery.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setSelectedImageIndex(index)}
                  className="group border border-[#d7d2c5] bg-[#efede7] p-2 text-left shadow-[0_18px_46px_rgba(26,26,26,0.08)] transition-transform duration-500 hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8b7d5e] sm:p-3"
                >
                  <span className="flex h-[min(64svh,420px)] min-h-[17rem] items-center justify-center bg-[#faf9f5] p-2 sm:h-[min(68svh,500px)] sm:min-h-[20rem]">
                    <img
                      src={image}
                      alt={exhibition.title + ' - ' + imageLabel + ' ' + (index + 1)}
                      loading="lazy"
                      className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.015]"
                    />
                  </span>
                </button>
              ))}
            </div>
          </motion.section>
        ) : null}
      </article>

      {selectedImage && selectedImageIndex !== null ? (
        <div
          className="fixed inset-0 z-[1300] bg-[#111]/85 px-4 py-4 text-[#1a1a1a] backdrop-blur-sm sm:px-6 sm:py-6"
          role="dialog"
          aria-modal="true"
          aria-label={exhibition.title + ' - ' + t('exhibition.galleryDialog')}
          onClick={() => setSelectedImageIndex(null)}
        >
          <div
            className="mx-auto flex h-full max-w-[1500px] flex-col overflow-hidden bg-[#f5f5f5] shadow-[0_30px_90px_rgba(0,0,0,0.35)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex flex-shrink-0 items-center justify-between gap-4 border-b border-[#d7d2c5] px-4 py-3 sm:px-6">
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#8b7d5e]">
                  {selectedImageIndex + 1} / {gallery.length}
                </p>
                <p className="mt-1 truncate font-display text-xl font-bold uppercase tracking-normal text-[#1a1a1a] sm:text-2xl">
                  {exhibition.title}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedImageIndex(null)}
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center border border-[#d7d2c5] bg-[#faf9f5] text-xl leading-none text-[#1a1a1a] transition-colors hover:bg-[#e8e6df] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8b7d5e]"
                aria-label={t('exhibition.closeImage')}
              >
                x
              </button>
            </div>

            <div className="hidden min-h-0 flex-1 grid-cols-[4rem_minmax(0,1fr)_4rem] items-center gap-4 p-5 md:grid lg:p-8">
              <button
                type="button"
                onClick={() => setSelectedImageIndex((selectedImageIndex - 1 + gallery.length) % gallery.length)}
                className="flex h-14 w-14 items-center justify-center justify-self-start border border-[#d7d2c5] bg-[#faf9f5] text-3xl leading-none transition-colors hover:bg-[#e8e6df] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8b7d5e]"
                aria-label={t('exhibition.previousImage')}
              >
                &lt;
              </button>

              <div className="flex h-full min-h-0 items-center justify-center bg-[#faf9f5] p-4">
                <img
                  src={selectedImage}
                  alt={exhibition.title + ' - ' + imageLabel + ' ' + (selectedImageIndex + 1)}
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              <button
                type="button"
                onClick={() => setSelectedImageIndex((selectedImageIndex + 1) % gallery.length)}
                className="flex h-14 w-14 items-center justify-center justify-self-end border border-[#d7d2c5] bg-[#faf9f5] text-3xl leading-none transition-colors hover:bg-[#e8e6df] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8b7d5e]"
                aria-label={t('exhibition.nextImage')}
              >
                &gt;
              </button>
            </div>

            <div className="hidden flex-shrink-0 gap-3 overflow-x-auto border-t border-[#d7d2c5] bg-[#efede7] p-3 md:flex">
              {gallery.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setSelectedImageIndex(index)}
                  className={(index === selectedImageIndex ? 'border-[#8b7d5e] bg-white' : 'border-[#d7d2c5] bg-[#faf9f5] opacity-70 hover:opacity-100') + ' flex h-20 w-24 flex-shrink-0 items-center justify-center border p-1 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8b7d5e]'}
                  aria-label={exhibition.title + ' - ' + imageLabel + ' ' + (index + 1)}
                >
                  <img src={image} alt="" className="h-full w-full object-contain" loading="lazy" />
                </button>
              ))}
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-4 md:hidden">
              <div className="space-y-5">
                {[...gallery.slice(selectedImageIndex), ...gallery.slice(0, selectedImageIndex)].map((image, offset) => {
                  const index = (selectedImageIndex + offset) % gallery.length;

                  return (
                    <div
                      key={image}
                      className={(index === selectedImageIndex ? 'border-[#8b7d5e]' : 'border-[#d7d2c5]') + ' border bg-[#efede7] p-2'}
                    >
                    <div className="flex min-h-[70svh] items-center justify-center bg-[#faf9f5] p-2">
                      <img
                        src={image}
                        alt={exhibition.title + ' - ' + imageLabel + ' ' + (index + 1)}
                        className="max-h-[78svh] w-full object-contain"
                        loading="lazy"
                      />
                    </div>
                    <p className="mt-2 text-center text-[11px] uppercase tracking-[0.18em] text-[#8b7d5e]">
                      {index + 1} / {gallery.length}
                    </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
