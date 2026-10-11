import { artworkCategories, type Artwork, type ArtworkCategory } from './artworkCategories';
import { exhibitions, type Exhibition } from './exhibitions';
import type { Language } from '../lib/i18n';

type CategoryCopy = {
  name: string;
  description: string;
};

type ExhibitionCopy = {
  type?: string;
  credit?: string;
  paragraphs: string[];
};

export type LocalizedArtwork = Artwork;
export type LocalizedArtworkCategory = ArtworkCategory & {
  artworks: LocalizedArtwork[];
};

const categoryCopies: Record<Language, Record<string, CategoryCopy>> = {
  it: {
    'still-life/botaniche': {
      name: 'Botaniche',
      description: 'Foglie, rami e alberi: forme vegetali tra impronta, colore e trasformazione.',
    },
    'figura-umana': {
      name: 'Figura Umana',
      description: 'Corpi, gesti e presenze raccolti in una ricerca intima sulla figura.',
    },
    'still-life': {
      name: 'Still Life',
      description: 'Composizioni silenziose dove fiori, oggetti e animali diventano presenza.',
    },
    'misteri-marini': {
      name: 'Misteri Marini',
      description: 'Creature, alghe e forme sommerse tra fantasia, paura e metamorfosi.',
    },
    astratti: {
      name: 'Astratti',
      description: 'Materia, trasparenze e tensioni cromatiche in movimento libero.',
    },
    paesaggi: {
      name: 'Paesaggi',
      description: "Un'esplorazione visiva del paesaggio naturale e interiore.",
    },
  },
  en: {
    'still-life/botaniche': {
      name: 'Botanicals',
      description: 'Leaves, branches, and trees: plant forms explored through impressions, color, and transformation.',
    },
    'figura-umana': {
      name: 'Human Figure',
      description: 'Bodies, gestures, and presences gathered in an intimate study of the figure.',
    },
    'still-life': {
      name: 'Still Life',
      description: 'Quiet compositions where flowers, objects, and animals become presences.',
    },
    'misteri-marini': {
      name: 'Marine Mysteries',
      description: 'Creatures, algae, and submerged forms moving between fantasy, fear, and metamorphosis.',
    },
    astratti: {
      name: 'Abstracts',
      description: 'Matter, transparencies, and chromatic tensions in free movement.',
    },
    paesaggi: {
      name: 'Landscapes',
      description: 'A visual exploration of natural and inner landscape.',
    },
  },
};

const mediumCopies: Record<string, string> = {
  'Mixed media su carta': 'Mixed media on paper',
  'Inchiostro acrilico su Yupo montato su alluminio': 'Acrylic ink on Yupo mounted on aluminum',
  'Acquarello su carta di cotone': 'Watercolor on cotton paper',
  'Acquarello su carta': 'Watercolor on paper',
  'Acquarelli su carta': 'Watercolors on paper',
  'Acquarello su carta cotone': 'Watercolor on cotton paper',
  'China su carta': 'Ink on paper',
  'Inchiostro e acquarello su carta': 'Ink and watercolor on paper',
  'Inchiostro e acquarelli su carta di cotone': 'Ink and watercolors on cotton paper',
  'Carbonico, matita e acrilico su carta': 'Carbon, pencil, and acrylic on paper',
  'Pastello su carta': 'Pastel on paper',
  'Pastello e china su carta': 'Pastel and ink on paper',
  'Matita e lacca su carta': 'Pencil and lacquer on paper',
  'Pastello e pomice acrilico su carta': 'Pastel and acrylic pumice on paper',
  'Inchiostro su carta Yupo': 'Ink on Yupo paper',
  'Inchiostri acrilici su carta Yupo': 'Acrylic inks on Yupo paper',
};

const exhibitionCopies: Record<string, ExhibitionCopy> = {};

const monthCopies: Record<string, string> = {
  Gennaio: 'January',
  Febbraio: 'February',
  Marzo: 'March',
  Aprile: 'April',
  Maggio: 'May',
  Giugno: 'June',
  Luglio: 'July',
  Agosto: 'August',
  Settembre: 'September',
  Ottobre: 'October',
  Novembre: 'November',
  Dicembre: 'December',
};

function localizeDateText(value: string, language: Language) {
  if (language === 'it') return value;

  return Object.entries(monthCopies)
    .reduce((text, [itMonth, enMonth]) => text.replaceAll(itMonth, enMonth), value)
    .replace(/^Dal /, 'From ')
    .replace(/ al /g, ' to ');
}

function localizeMedium(medium: string | undefined, language: Language) {
  if (!medium || language === 'it') return medium;
  if (medium === 'n.a.') return 'n/a';
  return mediumCopies[medium] ?? medium;
}

export function getCategoryCopy(id: string, language: Language): CategoryCopy {
  return categoryCopies[language][id] ?? categoryCopies.it[id] ?? { name: "Archivio", description: "Collezione dimostrativa." };
}

export function localizeArtworkCategory(category: ArtworkCategory, language: Language): LocalizedArtworkCategory {
  const text = getCategoryCopy(category.id, language);

  return {
    ...category,
    name: text.name,
    description: text.description,
    artworks: category.artworks.map((artwork) => ({
      ...artwork,
      medium: localizeMedium(artwork.medium, language),
      format: language === 'en' && artwork.format === 'Dittico' ? 'Diptych' : artwork.format,
      dimensions: language === 'en' ? artwork.dimensions?.replace('ciascun elemento', 'each panel') : artwork.dimensions,
    })),
  };
}

export function getLocalizedArtworkCategories(language: Language) {
  return artworkCategories.map((category) => localizeArtworkCategory(category, language));
}

export function getLocalizedArtworkCategory(id: string | undefined, language: Language) {
  const category = artworkCategories.find((categoryData) => categoryData.id === id);
  return category ? localizeArtworkCategory(category, language) : undefined;
}

export function localizeExhibition(exhibition: Exhibition, language: Language): Exhibition {
  if (language === 'it') return exhibition;

  const text = exhibitionCopies[exhibition.slug];

  return {
    ...exhibition,
    date: localizeDateText(exhibition.date, language),
    period: localizeDateText(exhibition.period, language),
    type: text?.type ?? (exhibition.type ? exhibition.type : undefined),
    paragraphs: text?.paragraphs ?? exhibition.paragraphs,
    credit: text?.credit ?? (exhibition.credit ? exhibition.credit : undefined),
  };
}

export function getLocalizedExhibitions(language: Language) {
  return exhibitions.map((exhibition) => localizeExhibition(exhibition, language));
}

export function getLocalizedExhibition(slug: string | undefined, language: Language) {
  const exhibition = exhibitions.find((exhibitionData) => exhibitionData.slug === slug);
  return exhibition ? localizeExhibition(exhibition, language) : undefined;
}
