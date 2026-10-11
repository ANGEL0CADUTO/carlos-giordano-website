import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type Language = 'it' | 'en';

const languageStorageKey = 'carlos-giordano-language';

export const copy = {
  it: {
    'nav.home': 'Home',
    'nav.works': 'Opere',
    'nav.about': 'Chi sono',
    'nav.exhibitions': 'Mostre',
    'nav.press': 'Dicono di me',
    'nav.news': 'News',
    'nav.contact': 'Contatti',
    'nav.menu': 'Menu',
    'nav.close': 'Chiudi',
    'nav.navigation': 'Navigazione',
    'nav.languageLabel': 'Lingua',
    'nav.switchToEnglish': 'Passa al sito in inglese',
    'nav.switchToItalian': 'Passa al sito in italiano',
    'footer.description': "Pittore contemporaneo che esplora l'intersezione tra figura umana e astrazione naturale.",
    'footer.rights': 'Tutti i diritti riservati.',
    'home.selectedWork': 'Opera selezionata',
    'home.scrollToWorks': 'Scorri alle opere',
    'home.previousWork': 'Opera precedente',
    'home.nextWork': 'Opera successiva',
    'home.visualArchive': 'Opere',
    'home.explore': 'Esplora',
    'home.recentExhibitionsTop': 'Mostre',
    'home.recentExhibitionsBottom': 'Recenti',
    'home.viewAllExhibitions': 'Vedi tutte le mostre',
    'home.exhibitionsArchiveUpdating': 'Archivio mostre completo.',
    'home.exhibitionsArchiveDescription': 'Una selezione cronologica di mostre, immagini, testi e materiali video legati al percorso espositivo di Carlos Giordano.',
    'works.title': 'Opere',
    'works.subtitle': 'Catalogo Generale',
    'works.countSingular': 'opera',
    'works.countPlural': 'opere',
    'videos.title': 'Video',
    'videos.subtitle': 'Raccolta video',
    'videos.backToWorks': 'Torna alle Opere',
    'videos.countPlural': 'video',
    'artwork.backToWorks': 'Torna alle Opere',
    'artwork.backToStillLife': 'Torna a Still Life',
    'artwork.exploreAlso': 'Scopri anche',
    'artwork.format': 'Formato',
    'artwork.categoryNotFound': 'Categoria non trovata',
    'artwork.categoryNotAvailable': 'La sezione richiesta non risulta disponibile.',
    'artwork.year': 'Anno',
    'artwork.medium': 'Tecnica',
    'artwork.dimensions': 'Dimensione',
    'artwork.price': 'Prezzo',
    'artwork.contactForPrice': 'Contattami',
    'footer.privacyPolicy': 'Privacy Policy',
    'footer.cookiePolicy': 'Cookie Policy',
    'footer.cookiePreferences': 'Preferenze Cookie',
    'artwork.closeArtwork': 'Chiudi scheda opera',
    'about.imageAlt': 'Carlos Giordano Giroldi nel suo studio',
    'about.videoCaption': 'Carlos Giordano Giroldi - Intervista Rivista Fil Rouge, 2013',
    'about.paragraph.1': 'Carlos sviluppa la sua formazione artistica a Buenos Aires con l’artista multimediale Margarita Paksa, costruendo fin dall’inizio una solida base nel disegno e nella ricerca sul segno.',
    'about.paragraph.2': 'Prosegue gli studi negli Stati Uniti, al Visual Art Center (New Jersey) e alla Art Students League di New York, dove perfeziona l’uso del pastello e del carboncino applicati alla figura umana. Questa fase definisce un linguaggio gestuale e materico che diventerà centrale nella sua produzione.',
    'about.paragraph.3': 'Si trasferisce poi a Parigi, dove frequenta l’Atelier Art Medium e partecipa a programmi di studio al Louvre dedicati al disegno classico e all’analisi dei grandi maestri. L’esperienza francese amplia la sua visione compositiva e introduce una maggiore attenzione alla struttura dell’immagine.',
    'about.paragraph.4': 'Nel 2010 apre il suo primo atelier in Italia, in Umbria, avviando collaborazioni con gallerie come la Franziska Berger Studio Gallery (Perugia) e ART G.A.P. (Roma). In questi anni il pastello diventa il medium principale, affiancato da acquerello, inchiostro e acrilico.',
    'about.paragraph.5': 'Dal 2016 vive e lavora a Milano, dove evolve ulteriormente la sua ricerca introducendo l’acquerello come elemento dominante e sperimentando con inchiostro acrilico su carta Yupo e materiali organici raccolti nello spazio urbano. Questa combinazione di tecniche e materiali definisce una poetica visiva riconoscibile, caratterizzata da stratificazioni, trasparenze e un forte dialogo tra gesto e natura.',
    'about.paragraph.6': 'Le sue opere sono presenti in collezioni private in Italia, Francia, Spagna, Regno Unito, Stati Uniti, Argentina, Messico e India, confermando un interesse internazionale crescente per il suo lavoro.',
    'exhibitions.title': 'Mostre',
    'exhibitions.open': 'Apri mostra',
    'exhibition.backToExhibitions': 'Torna alle Mostre',
    'exhibition.notFound': 'Mostra non trovata',
    'exhibition.period': 'Periodo',
    'exhibition.location': 'Luogo',
    'exhibition.format': 'Formato',
    'exhibition.video': 'Video',
    'exhibition.materials': 'Materiali della mostra',
    'exhibition.images': 'Immagini',
    'exhibition.galleryHint': "Clicca su un'immagine per aprirla senza lasciare la pagina.",
    'exhibition.galleryDialog': 'galleria immagini',
    'exhibition.closeImage': 'Chiudi immagine',
    'exhibition.previousImage': 'Immagine precedente',
    'exhibition.nextImage': 'Immagine successiva',
    'press.title': 'Dicono di me',
    'press.subtitle': 'Testi critici e stampa',
    'press.chooseText': 'Scegli un testo',
    'press.availableTexts': 'Testi disponibili',
    'press.scrollTexts': 'Scorri i testi disponibili',
    'news.title': 'News',
    'news.subtitle': 'Lavoro, mostre, arte',
    'news.description': 'Notizie sul lavoro di Carlos Giordano, aggiornamenti dallo studio, mostre, materiali d’archivio e sguardi dal mondo dell’arte.',
    'news.featured': 'In evidenza',
    'news.latest': 'Ultime notizie',
    'news.items': 'articoli',
    'press.quote.1': 'La figura umana serve a Carlos per rappresentare la vita dei personaggi che hanno condiviso un tratto della vita dell’autore. L’utilizzo del bianco e nero permette a Carlos di presentare il corpo umano spoglio, a momenti spietato mentre che l’aggiunta del colore ammorbidisce lo stile e rende la figura duttile, quasi malinconica.\n\nLe nature morte di questa mostra ci mostrano un Carlos differente. Il genere della natura morta nasce quando gli oggetti della vita domestica occupano lo spazio pittorico. Di conseguenza Il messaggio è più immediato, sensoriale e ci arriva direttamente al cuore. Dalla raffigurazione esatta e compiaciuta di cose di nessuna importanza come frutta, ortaggi e vivande alla riflessione sulla caducità della vita… Tuttavia alla base di queste opere c’è un disegno ricercato e formale perché per Carlos il disegno è “parola”.',
    'press.quote.2': 'La Natura Morta nasce quando gli oggetti della vita domestica occupano lo spazio pittorico. I quadri di Carlos con i loro dettagli sorprendenti e la loro illuminazione atmosferica, oltre ad essere una delizia per gli occhi esprimono un ulteriore livello di significato, come per esempio riflessioni sulla caducità della vita nella frutta che comincia a marcire.\n\nI quadri di Carlos suggeriscono riposo ma anche movimento come si osserva in una serie di composizioni diagonali. Anche il gioco di colori vivaci - spenti aggiunge dinamismo alle opere con uno straordinario contrasto di colori caldi accostati a delle tinte tenui.',
    'contact.title': 'Contatti',
    'contact.intro': 'Per informazioni su opere disponibili, mostre o collaborazioni.',
    'contact.studio': 'Studio',
    'contact.address': 'Carlos Giordano Giroldi\nVia G. Biancardi 2\n20149 Milano (MI) Italia',
    'contact.appointment': 'Solo su appuntamento',
    'contact.contacts': 'Contatti',
    'contact.social': 'Social',
    'contact.openSocial': 'Apri',
    'contact.writeStudio': 'Scrivi allo studio',
    'contact.formTitle': 'Modulo di contatto',
    'contact.name': 'Nome',
    'contact.namePlaceholder': 'Nome e cognome',
    'contact.emailPlaceholder': 'hello@example.com',
    'contact.message': 'Messaggio',
    'contact.messagePlaceholder': 'Scrivi il tuo messaggio',
    'contact.submit': 'Invia richiesta',
    'contact.sending': 'Invio in corso',
    'contact.success': 'Messaggio inviato. Ti risponderemo al più presto.',
    'contact.validationError': 'Compila nome, email e messaggio prima di inviare.',
    'contact.error': 'Non è stato possibile inviare il messaggio. Riprova tra poco o scrivi direttamente via email.',
    'contact.spamError': 'Invio bloccato dai controlli anti-spam. Riprova tra qualche secondo.',
    'contact.mapTitle': 'Studio Carlos Giordano Giroldi - Via G. Biancardi 2, Milano',
  },
  en: {
    'nav.home': 'Home',
    'nav.works': 'Works',
    'nav.about': 'About',
    'nav.exhibitions': 'Exhibitions',
    'nav.press': 'Press',
    'nav.news': 'News',
    'nav.contact': 'Contact',
    'nav.menu': 'Menu',
    'nav.close': 'Close',
    'nav.navigation': 'Navigation',
    'nav.languageLabel': 'Language',
    'nav.switchToEnglish': 'Switch to English',
    'nav.switchToItalian': 'Switch to Italian',
    'footer.description': 'Contemporary painter exploring the intersection of human figure and natural abstraction.',
    'footer.rights': 'All rights reserved.',
    'home.selectedWork': 'Selected Work',
    'home.scrollToWorks': 'Scroll to works',
    'home.previousWork': 'Previous work',
    'home.nextWork': 'Next work',
    'home.visualArchive': 'Works',
    'home.explore': 'Explore',
    'home.recentExhibitionsTop': 'Recent',
    'home.recentExhibitionsBottom': 'Exhibitions',
    'home.viewAllExhibitions': 'View all exhibitions',
    'home.exhibitionsArchiveUpdating': 'Complete exhibition archive.',
    'home.exhibitionsArchiveDescription': 'A chronological selection of exhibitions, images, texts, and video materials from Carlos Giordano’s exhibition history.',
    'works.title': 'Works',
    'works.subtitle': 'General Catalogue',
    'works.countSingular': 'work',
    'works.countPlural': 'works',
    'videos.title': 'Video',
    'videos.subtitle': 'Video Collection',
    'videos.backToWorks': 'Back to Works',
    'videos.countPlural': 'videos',
    'artwork.backToWorks': 'Back to Works',
    'artwork.backToStillLife': 'Back to Still Life',
    'artwork.exploreAlso': 'See also',
    'artwork.format': 'Format',
    'artwork.categoryNotFound': 'Category not found',
    'artwork.categoryNotAvailable': 'The requested section is not available.',
    'artwork.year': 'Year',
    'artwork.medium': 'Technique',
    'artwork.dimensions': 'Dimensions',
    'artwork.price': 'Price',
    'artwork.contactForPrice': 'Contact me',
    'footer.privacyPolicy': 'Privacy Policy',
    'footer.cookiePolicy': 'Cookie Policy',
    'footer.cookiePreferences': 'Cookie Preferences',
    'artwork.closeArtwork': 'Close artwork sheet',
    'about.imageAlt': 'Carlos Giordano Giroldi in his studio',
    'about.videoCaption': 'Carlos Giordano Giroldi - Fil Rouge Magazine interview, 2013',
    'about.paragraph.1': 'Carlos began studying drawing in Buenos Aires with multimedia artist Margarita Paksa.',
    'about.paragraph.2': 'After moving to the United States, he continued his studies at the Visual Art Center, N.J. and at the Art Students League of New York, deepening his use of pastel and charcoal for the representation of the human figure.',
    'about.paragraph.3': 'A few years later he moved to Paris, where he attended Atelier Art Medium and took part in workshops at the Louvre devoted to drawing classical figures, architectural ruins, and the study of the great masters.',
    'about.paragraph.4': 'In 2010 Carlos opened his first studio in Italy, in Umbria, where he worked mainly with pastel while using watercolor, ink, and acrylic as supporting materials. He began collaborating with galleries including Franziska Berger Studio Gallery in Perugia, ART G.A.P. Gallery in Rome, and several other venues in Italy.',
    'about.paragraph.5': 'Since 2016 he has lived and worked in Milan, where he has expanded the use of watercolor across almost all of his work.',
    'about.paragraph.6': 'His works are held in private collections in Italy, France, Spain, the United Kingdom, the United States, Argentina, Mexico, and India.',
    'exhibitions.title': 'Exhibitions',
    'exhibitions.open': 'Open exhibition',
    'exhibition.backToExhibitions': 'Back to Exhibitions',
    'exhibition.notFound': 'Exhibition not found',
    'exhibition.period': 'Period',
    'exhibition.location': 'Location',
    'exhibition.format': 'Format',
    'exhibition.video': 'Video',
    'exhibition.materials': 'Exhibition materials',
    'exhibition.images': 'Images',
    'exhibition.galleryHint': 'Click an image to open it without leaving the page.',
    'exhibition.galleryDialog': 'image gallery',
    'exhibition.closeImage': 'Close image',
    'exhibition.previousImage': 'Previous image',
    'exhibition.nextImage': 'Next image',
    'press.title': 'Press',
    'press.subtitle': 'Critical Writing & Press',
    'press.chooseText': 'Choose a text',
    'press.availableTexts': 'Available texts',
    'press.scrollTexts': 'Scroll available texts',
    'news.title': 'News',
    'news.subtitle': 'Work, exhibitions, art',
    'news.description': 'News about Carlos Giordano’s work, studio updates, exhibitions, archive materials, and perspectives from the art world.',
    'news.featured': 'Featured',
    'news.latest': 'Latest News',
    'news.items': 'articles',
    'press.quote.1': 'The human figure allows Carlos to represent the lives of the characters who have shared a stretch of the artist’s own life. The use of black and white enables him to present the human body bare, at times almost merciless, while the addition of color softens the style and makes the figure supple, almost melancholic.\n\nThe still lifes in this exhibition reveal a different Carlos. The still-life genre begins when the objects of domestic life occupy pictorial space. As a result, the message is more immediate, sensory, and reaches us directly. From the exact and appreciative depiction of seemingly insignificant things such as fruit, vegetables, and food to a reflection on the transience of life... Yet at the base of these works there is a precise, formal drawing, because for Carlos drawing is “word”.',
    'press.quote.2': 'Still life begins when the objects of domestic life occupy pictorial space. Carlos’s paintings, with their surprising details and atmospheric light, are not only a delight for the eye but also express an additional level of meaning, such as reflections on the transience of life in fruit beginning to decay.\n\nCarlos’s paintings suggest rest but also movement, as seen in a series of diagonal compositions. The play between vivid and muted colors also gives the works dynamism, with an extraordinary contrast of warm colors set against softer tones.',
    'contact.title': 'Contact',
    'contact.intro': 'For information about available works, exhibitions, or collaborations.',
    'contact.studio': 'Studio',
    'contact.address': 'Carlos Giordano Giroldi\nVia G. Biancardi 2\n20149 Milan (MI) Italy',
    'contact.appointment': 'By appointment only',
    'contact.contacts': 'Contact',
    'contact.social': 'Social',
    'contact.openSocial': 'Open',
    'contact.writeStudio': 'Write to the studio',
    'contact.formTitle': 'Contact form',
    'contact.name': 'Name',
    'contact.namePlaceholder': 'Full name',
    'contact.emailPlaceholder': 'hello@example.com',
    'contact.message': 'Message',
    'contact.messagePlaceholder': 'Write your message',
    'contact.submit': 'Send request',
    'contact.sending': 'Sending',
    'contact.success': 'Message sent. We will reply as soon as possible.',
    'contact.validationError': 'Please fill in name, email, and message before sending.',
    'contact.error': 'The message could not be sent. Please try again shortly or write directly by email.',
    'contact.spamError': 'Submission blocked by anti-spam checks. Please try again in a few seconds.',
    'contact.mapTitle': 'Carlos Giordano Giroldi Studio - Via G. Biancardi 2, Milan',
  },
} as const;

export type CopyKey = keyof typeof copy.it;

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  t: (key: CopyKey) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function isLanguage(value: string | null): value is Language {
  return value === 'it' || value === 'en';
}

function getInitialLanguage(): Language {
  // Match the Italian HTML served at this canonical URL during hydration.
  return 'it';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  const setLanguage = useCallback((nextLanguage: Language) => {
    window.localStorage.setItem(languageStorageKey, nextLanguage);
    setLanguageState(nextLanguage);
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguageState((currentLanguage) => {
      const nextLanguage = currentLanguage === 'it' ? 'en' : 'it';
      window.localStorage.setItem(languageStorageKey, nextLanguage);
      return nextLanguage;
    });
  }, []);

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem(languageStorageKey);
    if (isLanguage(savedLanguage)) setLanguageState(savedLanguage);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = useCallback((key: CopyKey) => copy[language][key], [language]);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      toggleLanguage,
      t,
    }),
    [language, setLanguage, t, toggleLanguage],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used inside LanguageProvider');
  }

  return context;
}
