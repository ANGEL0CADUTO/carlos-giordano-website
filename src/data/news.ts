export type NewsArticle = {
  id: string;
  date: string;
  dateEn: string;
  kicker: string;
  kickerEn: string;
  title: string;
  titleEn: string;
  excerpt: string;
  excerptEn: string;
  body: string;
  bodyEn: string;
  image: string;
  alt: string;
  altEn: string;
};

export const newsArticles: NewsArticle[] = [
  {
    id: 'atelier-milano-opere-su-carta',
    date: 'Maggio 2026',
    dateEn: 'May 2026',
    kicker: 'Atelier',
    kickerEn: 'Studio',
    title: 'Nuove opere su carta nello studio di Milano',
    titleEn: 'New Works on Paper in the Milan Studio',
    excerpt:
      'Una selezione recente di acquerelli e inchiostri entra nel percorso di studio, tra figure sospese, trasparenze e materia organica.',
    excerptEn:
      'A recent selection of watercolors and inks enters the studio path, between suspended figures, transparencies, and organic matter.',
    body:
      'Il lavoro più recente di Carlos Giordano approfondisce il rapporto tra gesto, acqua e superficie. Le nuove carte nascono come apparizioni lente: immagini trattenute, campiture leggere, segni che affiorano senza perdere la loro fragilità.',
    bodyEn:
      'Carlos Giordano’s recent work deepens the relationship between gesture, water, and surface. The new papers appear slowly: held images, light fields, and marks that emerge without losing their fragility.',
    image: '/demo/scene-4.svg',
    alt: 'Opera floreale di Carlos Giordano con peonia bianca',
    altEn: 'Floral work by Carlos Giordano with a white peony',
  },
  {
    id: 'mostre-materiali-archivio',
    date: 'Aprile 2026',
    dateEn: 'April 2026',
    kicker: 'Archivio',
    kickerEn: 'Archive',
    title: 'Materiali di mostra e nuove immagini in archivio',
    titleEn: 'Exhibition Materials and New Images in the Archive',
    excerpt:
      'L’archivio digitale si arricchisce con fotografie, testi e documenti legati alle mostre più recenti e al percorso espositivo italiano.',
    excerptEn:
      'The digital archive expands with photographs, texts, and documents connected to the most recent exhibitions and the Italian exhibition path.',
    body:
      'La sezione mostre continua a costruire una lettura cronologica del lavoro: immagini di allestimento, materiali critici e dettagli delle opere restituiscono il clima di ogni esposizione senza separarlo dalla ricerca pittorica.',
    bodyEn:
      'The exhibitions section continues to build a chronological reading of the work: installation images, critical materials, and artwork details convey the atmosphere of each show without separating it from the painterly research.',
    image: '/demo/scene-2.svg',
    alt: 'Immagine di mostra di Carlos Giordano',
    altEn: 'Exhibition image by Carlos Giordano',
  },
  {
    id: 'sguardo-mondo-arte-carta',
    date: 'Marzo 2026',
    dateEn: 'March 2026',
    kicker: 'Mondo dell’arte',
    kickerEn: 'Art World',
    title: 'Il ritorno della carta nella pittura contemporanea',
    titleEn: 'The Return of Paper in Contemporary Painting',
    excerpt:
      'La carta torna al centro di molte ricerche contemporanee: non più supporto preparatorio, ma spazio autonomo di sperimentazione.',
    excerptEn:
      'Paper is returning to the center of many contemporary practices: no longer just a preparatory support, but an autonomous space for experimentation.',
    body:
      'Acquerello, inchiostro, pastello e tecniche miste permettono una pittura più immediata e vulnerabile. È una direzione vicina al lavoro di Carlos, dove il segno resta visibile e la materia conserva memoria del gesto.',
    bodyEn:
      'Watercolor, ink, pastel, and mixed media allow painting to become more immediate and vulnerable. It is a direction close to Carlos’s work, where the mark remains visible and the material preserves the memory of the gesture.',
    image: '/demo/scene-3.svg',
    alt: 'Opera astratta di Carlos Giordano con segni organici',
    altEn: 'Abstract work by Carlos Giordano with organic marks',
  },
  {
    id: 'dietro-le-quinte-video',
    date: 'Febbraio 2026',
    dateEn: 'February 2026',
    kicker: 'Video',
    kickerEn: 'Video',
    title: 'Nuovi materiali video per raccontare il processo',
    titleEn: 'New Video Materials to Tell the Process',
    excerpt:
      'La raccolta video diventa uno spazio parallelo alle opere, con interviste, documenti di mostra e frammenti del lavoro in studio.',
    excerptEn:
      'The video collection becomes a space parallel to the works, with interviews, exhibition documents, and fragments from the studio process.',
    body:
      'Il video permette di restituire ritmo, voce e tempo: elementi che spesso restano fuori dall’immagine finita, ma che aiutano a leggere la costruzione dell’opera e il percorso dell’artista.',
    bodyEn:
      'Video brings back rhythm, voice, and time: elements often left outside the finished image, yet useful for reading the construction of the work and the artist’s path.',
    image: '/demo/scene-4.svg',
    alt: 'Anteprima video dell’intervista Fil Rouge',
    altEn: 'Video thumbnail from the Fil Rouge interview',
  },
  {
    id: 'mostre-prossime-selezione-opere',
    date: 'Gennaio 2026',
    dateEn: 'January 2026',
    kicker: 'Mostre',
    kickerEn: 'Exhibitions',
    title: 'Selezione di opere per nuovi progetti espositivi',
    titleEn: 'Selecting Works for New Exhibition Projects',
    excerpt:
      'Figure umane, paesaggi interiori e nature vive entrano in dialogo per preparare nuove possibilità di allestimento.',
    excerptEn:
      'Human figures, inner landscapes, and living still lifes enter into dialogue while preparing new exhibition possibilities.',
    body:
      'Ogni mostra richiede una scelta precisa: non soltanto opere belle, ma opere capaci di sostenere un ritmo, una sequenza, un passaggio emotivo tra una sala e l’altra.',
    bodyEn:
      'Every exhibition requires a precise selection: not only beautiful works, but works capable of sustaining a rhythm, a sequence, and an emotional passage from one room to another.',
    image: '/demo/scene-1.svg',
    alt: 'Paesaggio marino di Carlos Giordano',
    altEn: 'Seascape by Carlos Giordano',
  },
  {
    id: 'nota-critica-colore-trasparenza',
    date: 'Dicembre 2025',
    dateEn: 'December 2025',
    kicker: 'Ricerca',
    kickerEn: 'Research',
    title: 'Colore, trasparenza e stratificazione',
    titleEn: 'Color, Transparency, and Layering',
    excerpt:
      'Una nota sul ruolo della trasparenza nella costruzione dell’immagine, tra velature leggere e contrasti più fisici.',
    excerptEn:
      'A note on the role of transparency in image construction, between light veils and more physical contrasts.',
    body:
      'Nelle opere recenti il colore non chiude la forma, ma la attraversa. Le stratificazioni diventano una memoria visibile del processo, dove ogni passaggio modifica il precedente senza cancellarlo.',
    bodyEn:
      'In recent works, color does not close the form; it passes through it. Layers become a visible memory of the process, where each passage changes the previous one without erasing it.',
    image: '/demo/scene-3.svg',
    alt: 'Opera astratta con trasparenze cromatiche',
    altEn: 'Abstract work with chromatic transparencies',
  },
  {
    id: 'osservatorio-mostre-artisti',
    date: 'Novembre 2025',
    dateEn: 'November 2025',
    kicker: 'Mondo dell’arte',
    kickerEn: 'Art World',
    title: 'Mostre, studi d’artista e nuove forme di racconto',
    titleEn: 'Exhibitions, Artists’ Studios, and New Ways of Storytelling',
    excerpt:
      'Le mostre oggi vivono anche attraverso archivi digitali, video, testi brevi e immagini di processo che prolungano l’esperienza espositiva.',
    excerptEn:
      'Today exhibitions also live through digital archives, videos, short texts, and process images that extend the exhibition experience.',
    body:
      'Per un artista, raccontare il lavoro significa costruire continuità tra studio, mostra e pubblico. Le news possono diventare un diario selettivo: aggiornamenti, sguardi esterni e riflessioni sul contesto dell’arte.',
    bodyEn:
      'For an artist, telling the work means building continuity between studio, exhibition, and audience. News can become a selective journal: updates, outside perspectives, and reflections on the art context.',
    image: '/demo/scene-4.svg',
    alt: 'Materiale espositivo della mostra Sublimi Contrasti',
    altEn: 'Exhibition material from Sublimi Contrasti',
  },
];
