import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { videos } from '../data/videos';
import { useLanguage } from '../lib/i18n';

function getVideoLinkUrl(embedUrl: string) {
  const url = new URL(embedUrl);
  const isYoutubeEmbed = url.hostname.includes('youtube.com') && url.pathname.startsWith('/embed/');

  if (!isYoutubeEmbed) {
    return embedUrl;
  }

  const videoId = url.pathname.split('/').filter(Boolean).pop();
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

export default function Videos() {
  const { t } = useLanguage();
  const [showFloatingBackLink, setShowFloatingBackLink] = useState(false);
  const backLinkRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    const node = backLinkRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(([entry]) => {
      setShowFloatingBackLink(!entry.isIntersecting);
    });

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen px-4 pb-20 pt-28 sm:px-6 sm:pt-32 md:px-10">
      <p role="note" className="mx-auto mb-6 max-w-5xl text-sm">Demo: original videos are not included in this source edition.</p>
      <header className="mx-auto mb-14 max-w-7xl sm:mb-20">
        <Link ref={backLinkRef} to="/opere" className="mb-8 inline-block text-xs uppercase tracking-[0.2em] opacity-60 transition-opacity hover:opacity-100">
          &larr; {t('videos.backToWorks')}
        </Link>
        <AnimatePresence>
          {showFloatingBackLink && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="fixed left-4 top-36 z-[900] hidden sm:left-6 md:left-10 md:block"
            >
              <Link to="/opere" className="inline-block border-b border-ink/20 bg-paper/80 py-1 text-xs uppercase tracking-[0.2em] opacity-70 backdrop-blur transition-opacity hover:opacity-100">
                &larr; {t('videos.backToWorks')}
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
        <h1 className="mb-5 font-serif text-4xl leading-tight sm:mb-6 sm:text-5xl md:text-6xl">{t('videos.title')}</h1>
        <p className="text-sm uppercase tracking-widest text-muted">{t('videos.subtitle')}</p>
      </header>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 md:grid-cols-2 lg:gap-14">
        {videos.map((video, index) => (
          <motion.article
            key={video.embedUrl}
            id={video.sourceUrl ? 'botaniche' : undefined}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.08 }}
            className="min-w-0"
          >
            <div className="border border-stone/70 bg-[#efede7] p-2 shadow-[0_18px_46px_rgba(26,26,26,0.08)] sm:p-3">
              <div className={(video.orientation === 'portrait' ? 'mx-auto aspect-[9/16] max-h-[72svh] max-w-[min(100%,28rem)]' : 'aspect-video') + ' overflow-hidden bg-[#1a1a1a]'}>
                {video.sourceUrl ? (
                  <video
                    controls
                    playsInline
                    preload="none"
                    poster={video.thumbnail}
                    aria-label={video.title}
                    className="h-full w-full object-contain"
                  >
                    <source src={video.sourceUrl} type="video/mp4" />
                    <a href={video.sourceUrl}>{video.title}</a>
                  </video>
                ) : (
                  <a
                    href={getVideoLinkUrl(video.embedUrl)}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={video.title}
                    className="group relative flex h-full w-full items-center justify-center overflow-hidden bg-[#1a1a1a]"
                  >
                    <img
                      src={video.thumbnail}
                      alt=""
                      className="h-full w-full object-cover opacity-90 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
                      loading="lazy"
                    />
                    <span className="absolute inset-0 bg-ink/25 transition-colors duration-300 group-hover:bg-ink/10" aria-hidden="true" />
                    <span className="absolute flex h-14 w-14 items-center justify-center rounded-full bg-paper/95 text-ink shadow-[0_14px_32px_rgba(0,0,0,0.25)] transition-transform duration-300 group-hover:scale-105" aria-hidden="true">
                      <Play size={23} strokeWidth={1.8} className="ml-0.5" />
                    </span>
                  </a>
                )}
              </div>
            </div>
            <h2 className="mt-4 break-words border-b border-stone/50 pb-4 font-serif text-2xl italic leading-tight">{video.title}</h2>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
