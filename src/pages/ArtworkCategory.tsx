import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, X } from 'lucide-react';
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom';
import type { Artwork } from '../data/artworkCategories';
import { getLocalizedArtworkCategories, getLocalizedArtworkCategory } from '../data/localizedContent';
import { useLanguage } from '../lib/i18n';

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

function waitForImage(image: HTMLImageElement) {
  if (image.complete && image.naturalWidth > 0) {
    return image.decode?.().catch(() => undefined) ?? Promise.resolve();
  }

  return new Promise<void>((resolve) => {
    const finish = () => {
      image.removeEventListener('load', finish);
      image.removeEventListener('error', finish);
      resolve();
    };

    image.addEventListener('load', finish, { once: true });
    image.addEventListener('error', finish, { once: true });
  });
}

function waitForGalleryImagesUntil(galleryNode: HTMLDivElement, artworkNode: HTMLDivElement) {
  const images = Array.from(galleryNode.querySelectorAll('img'));
  const targetImage = artworkNode.querySelector('img');
  const targetIndex = targetImage ? images.indexOf(targetImage) : -1;
  const imagesToWaitFor = targetIndex >= 0 ? images.slice(0, targetIndex + 1) : Array.from(artworkNode.querySelectorAll('img'));

  return Promise.all(imagesToWaitFor.map(waitForImage));
}

function centerArtworkNode(artworkNode: HTMLDivElement) {
  const rect = artworkNode.getBoundingClientRect();
  const top = rect.top + window.scrollY - Math.max((window.innerHeight - rect.height) / 2, 24);

  window.scrollTo({
    top: Math.max(top, 0),
    behavior: 'auto',
  });
}

function ArtworkDetails({
  artwork,
  labels,
  compact = false,
}: {
  artwork: Artwork;
  labels: { year: string; medium: string; dimensions: string; format: string; price: string; contactForPrice: string };
  compact?: boolean;
}) {
  const details = [
    artwork.year && { label: labels.year, value: artwork.year },
    artwork.medium && { label: labels.medium, value: artwork.medium },
    artwork.dimensions && { label: labels.dimensions, value: artwork.dimensions },
    artwork.format && { label: labels.format, value: artwork.format },
  ].filter(Boolean) as Array<{ label: string; value: string }>;
  const showGeneralInquiry = !compact && !artwork.priceInquiry;

  if (!details.length && compact && artwork.priceInquiry) return null;

  return (
    <dl className={compact ? 'mt-3 space-y-1.5 text-xs leading-relaxed text-muted' : 'mt-8 space-y-4 text-sm leading-relaxed text-ink/75'}>
      {details.map((detail) => (
        <div key={detail.label} className={compact ? 'grid grid-cols-1 gap-x-4 gap-y-0.5 min-[430px]:grid-cols-[6.5rem_1fr]' : 'grid grid-cols-1 gap-x-6 gap-y-1 sm:grid-cols-[8rem_1fr]'}>
          <dt className="break-words uppercase tracking-[0.18em] text-muted">{detail.label}</dt>
          <dd className="min-w-0 break-words text-ink/80">{detail.value}</dd>
        </div>
      ))}
      {!compact && artwork.priceInquiry && (
        <div className="grid grid-cols-1 gap-x-6 gap-y-1 sm:grid-cols-[8rem_1fr]">
          <dt className="break-words uppercase tracking-[0.18em] text-muted">{labels.price}</dt>
          <dd className="min-w-0 break-words text-ink/80">
            <Link to="/contatti#modulo-contatti" className="border-b border-ink/30 transition-opacity hover:opacity-70">
              {labels.contactForPrice}
            </Link>
          </dd>
        </div>
      )}
      {showGeneralInquiry && (
        <div className={compact ? 'pt-2' : 'grid grid-cols-1 gap-x-6 gap-y-1 sm:grid-cols-[8rem_1fr]'}>
          {!compact && <dt className="break-words uppercase tracking-[0.18em] text-muted">Info</dt>}
          <dd className="min-w-0 break-words text-ink/80">
            {compact ? (
              <span className="border-b border-ink/25">{labels.contactForPrice}</span>
            ) : (
              <Link to="/contatti#modulo-contatti" className="border-b border-ink/30 transition-opacity hover:opacity-70">
                {labels.contactForPrice}
              </Link>
            )}
          </dd>
        </div>
      )}
    </dl>
  );
}

export default function ArtworkCategory() {
  const { categoryId, subcategoryId } = useParams();
  const resolvedCategoryId = subcategoryId ? `${categoryId}/${subcategoryId}` : categoryId;
  const [searchParams, setSearchParams] = useSearchParams();
  const { language, t } = useLanguage();
  const category = getLocalizedArtworkCategory(resolvedCategoryId, language);
  const subcategories = category
    ? getLocalizedArtworkCategories(language).filter((item) => item.parentId === category.id)
    : [];
  const backPath = category?.parentId ? `/opere/${category.parentId}` : '/opere';
  const backLabel = category?.parentId ? t('artwork.backToStillLife') : t('artwork.backToWorks');
  const linkedArtworkSrc = searchParams.get('artwork');
  const movedArtworkCategory = linkedArtworkSrc
    ? subcategories.find((item) => item.artworks.some((artwork) => artwork.src === linkedArtworkSrc))
    : undefined;
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [showFloatingBackLink, setShowFloatingBackLink] = useState(false);
  const backLinkRef = useRef<HTMLAnchorElement | null>(null);
  const galleryRef = useRef<HTMLDivElement | null>(null);
  const artworkRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const detailLabels = {
    year: t('artwork.year'),
    medium: t('artwork.medium'),
    dimensions: t('artwork.dimensions'),
    format: t('artwork.format'),
    price: t('artwork.price'),
    contactForPrice: t('artwork.contactForPrice'),
  };

  useEffect(() => {
    if (!selectedArtwork) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeSelectedArtwork();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedArtwork]);

  useEffect(() => {
    document.documentElement.classList.add('artwork-gallery-scrollbar');
    document.body.classList.add('artwork-gallery-scrollbar');

    return () => {
      document.documentElement.classList.remove('artwork-gallery-scrollbar');
      document.body.classList.remove('artwork-gallery-scrollbar');
    };
  }, []);

  useEffect(() => {
    const node = backLinkRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(([entry]) => {
      setShowFloatingBackLink(!entry.isIntersecting);
    });

    observer.observe(node);

    return () => observer.disconnect();
  }, [resolvedCategoryId]);

  useEffect(() => {
    setSelectedArtwork(null);
  }, [resolvedCategoryId]);

  useEffect(() => {
    if (!category || !linkedArtworkSrc) return;

    const linkedArtwork = category.artworks.find((artwork) => artwork.src === linkedArtworkSrc);
    if (!linkedArtwork) return;

    let cancelled = false;
    const galleryNode = galleryRef.current;
    const node = artworkRefs.current[linkedArtwork.src];
    if (!galleryNode || !node) return;

    setSelectedArtwork((current) => current?.src === linkedArtwork.src ? current : linkedArtwork);

    waitForGalleryImagesUntil(galleryNode, node).then(() => {
      if (cancelled) return;

      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          if (cancelled) return;
          centerArtworkNode(node);

          window.setTimeout(() => {
            if (!cancelled) centerArtworkNode(node);
          }, 250);
        });
      });
    });

    return () => {
      cancelled = true;
    };
  }, [resolvedCategoryId, language, linkedArtworkSrc]);

  function closeSelectedArtwork() {
    setSelectedArtwork(null);

    if (!linkedArtworkSrc) return;

    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.delete('artwork');
    setSearchParams(nextSearchParams, { replace: true });
  }

  if (movedArtworkCategory) {
    return <Navigate replace to={`/opere/${movedArtworkCategory.id}?${searchParams.toString()}`} />;
  }

  if (!category) {
    return (
      <div className="min-h-screen px-4 pb-20 pt-28 sm:px-6 sm:pb-24 sm:pt-32 md:px-10">
        <div className="mx-auto max-w-7xl pt-14">
          <Link to="/opere" className="mb-8 inline-block text-xs uppercase tracking-[0.2em] opacity-60 transition-opacity hover:opacity-100">
            &larr; {t('artwork.backToWorks')}
          </Link>
          <h1 className="mb-6 font-serif text-4xl italic leading-tight sm:text-5xl md:text-6xl">{t('artwork.categoryNotFound')}</h1>
          <p className="max-w-2xl text-lg opacity-70">{t('artwork.categoryNotAvailable')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 pb-20 pt-28 sm:px-6 sm:pb-24 sm:pt-32 md:px-10">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-12 sm:mb-16 md:mb-32">
          <Link ref={backLinkRef} to={backPath} className="mb-8 inline-block text-xs uppercase tracking-[0.2em] opacity-60 transition-opacity hover:opacity-100">
            &larr; {backLabel}
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
                <Link to={backPath} className="inline-block border-b border-ink/20 bg-paper/80 py-1 text-xs uppercase tracking-[0.2em] opacity-70 backdrop-blur transition-opacity hover:opacity-100">
                  &larr; {backLabel}
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6 break-words font-serif text-4xl italic leading-tight sm:text-5xl md:text-6xl"
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
          {subcategories.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
              {subcategories.map((child) => (
                <Link
                  key={child.id}
                  to={`/opere/${child.id}`}
                  className="inline-flex min-h-11 items-center gap-3 text-sm text-ink/70 transition-colors hover:text-ink"
                >
                  <span className="text-xs text-muted">{t('artwork.exploreAlso')}</span>
                  <span className="inline-flex items-center gap-1.5">
                    <img src={child.cover} alt="" width={34} height={25} decoding="async" className="h-[25.2px] w-[33.6px] shrink-0 object-contain" />
                    <span className="border-b border-ink/25 pb-0.5">{child.name}</span>
                  </span>
                  <span className="text-xs text-muted">{child.artworks.length} {t('works.countPlural')}</span>
                  <ArrowUpRight size={15} strokeWidth={1.5} aria-hidden="true" />
                </Link>
              ))}
            </div>
          )}
        </div>

        <div ref={galleryRef} className="grid grid-cols-1 gap-x-10 gap-y-14 sm:gap-y-16 md:grid-cols-12 md:gap-y-32 lg:gap-y-40">
          {category.artworks.map((artwork, index) => (
            <motion.div
              key={artwork.src}
              ref={(node) => {
                artworkRefs.current[artwork.src] = node;
              }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 1 }}
              className={spans[index % spans.length] + ' min-w-0'}
            >
              <button type="button" onClick={() => setSelectedArtwork(artwork)} className="group block w-full cursor-pointer text-left">
                <figure className="mx-auto w-fit max-w-full">
                  <div className="overflow-hidden">
                    <img
                      src={artwork.src}
                      alt={artwork.title}
                      loading="lazy"
                      decoding="async"
                      className="mx-auto h-auto max-h-[60svh] max-w-[94%] object-contain transition-transform duration-1000 ease-out group-hover:scale-105 sm:max-h-[70svh] sm:max-w-[96%] md:max-h-[78svh] md:max-w-full"
                    />
                  </div>
                  <figcaption className="mt-4 border-b border-stone/50 pb-4">
                    <div className="flex flex-wrap items-baseline justify-between gap-3 sm:gap-6">
                      <h3 className="min-w-0 flex-1 break-words font-serif text-xl italic leading-tight md:text-2xl">{artwork.title}</h3>
                      <span className="shrink-0 text-xs uppercase tracking-widest text-muted">{category.name}</span>
                    </div>
                    <ArtworkDetails artwork={artwork} labels={detailLabels} compact />
                  </figcaption>
                </figure>
              </button>
            </motion.div>
          ))}
        </div>

        {subcategories.length > 0 && (
          <div className="mt-20 border-t border-stone/50 pt-12 md:mt-32 md:pt-16">
            {subcategories.map((child) => (
              <Link
                key={child.id}
                to={`/opere/${child.id}`}
                className="group mx-auto grid max-w-5xl items-center gap-6 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] sm:gap-10"
              >
                <img src={child.cover} alt={child.artworks[0]?.title ?? child.name} loading="lazy" decoding="async" className="aspect-[4/3] w-full object-contain" />
                <div className="min-w-0">
                  <p className="mb-3 text-xs uppercase tracking-[0.18em] text-muted">{t('artwork.exploreAlso')}</p>
                  <div className="flex items-center justify-between gap-4">
                    <h2 className="break-words font-serif text-3xl italic leading-tight">{child.name}</h2>
                    <ArrowUpRight size={24} strokeWidth={1.5} aria-hidden="true" className="shrink-0 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                  </div>
                  <p className="mt-3 text-xs uppercase tracking-widest text-muted">
                    {child.artworks.length} {t('works.countPlural')}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedArtwork && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[1200] bg-ink/75 px-2 py-3 backdrop-blur-sm sm:px-4 sm:py-4 md:p-6 lg:p-8"
            role="dialog"
            aria-modal="true"
            aria-label={selectedArtwork.title}
            onClick={closeSelectedArtwork}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative mx-auto grid max-h-[calc(100svh-1.5rem)] w-full max-w-[1600px] grid-cols-1 overflow-y-auto bg-paper text-ink shadow-2xl sm:max-h-[calc(100svh-2rem)] md:max-h-[calc(100svh-3rem)] md:grid-cols-[minmax(0,1fr)_20rem] xl:grid-cols-[minmax(0,1fr)_22rem]"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex min-h-[14rem] items-center justify-center bg-[#f4f4f1] p-3 sm:min-h-[20rem] sm:p-5 md:min-h-[min(82svh,48rem)] md:p-6 lg:p-8">
                <img src={selectedArtwork.src} alt={selectedArtwork.title} className="max-h-[58svh] w-full object-contain sm:max-h-[68svh] md:max-h-[82svh]" />
              </div>
              <aside className="min-w-0 border-t border-stone/70 p-5 sm:p-6 md:border-l md:border-t-0 md:p-8">
                <button
                  type="button"
                  aria-label={t('artwork.closeArtwork')}
                  onClick={closeSelectedArtwork}
                  className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center border border-stone/70 bg-paper/90 text-ink transition-opacity hover:opacity-70"
                >
                  <X size={17} strokeWidth={1.5} />
                </button>
                <p className="mb-4 break-words text-xs uppercase tracking-[0.2em] text-muted">{category.name}</p>
                <h2 className="break-words pr-10 font-serif text-3xl italic leading-tight sm:text-4xl md:text-5xl">{selectedArtwork.title}</h2>
                <ArtworkDetails artwork={selectedArtwork} labels={detailLabels} />
              </aside>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
