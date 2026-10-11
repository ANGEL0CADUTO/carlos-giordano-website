export type Artwork = {
  fileName: string;
  src: string;
  title: string;
  year?: string;
  medium?: string;
  dimensions?: string;
  format?: string;
  priceInquiry?: boolean;
};

export type ArtworkCategory = {
  id: string;
  parentId?: string;
  name: string;
  folder: string;
  titlePrefix: string;
  description: string;
  cover: string;
  artworks: Artwork[];
  images: string[];
};

const categories = [
  ["paesaggi", "Paesaggi"], ["astratti", "Astratti"], ["figura-umana", "Figura umana"],
  ["misteri-marini", "Misteri marini"], ["still-life", "Still life"], ["still-life/botaniche", "Botaniche"], ["archivio", "Archivio"],
];

export const artworkCategories: ArtworkCategory[] = categories.map(([id, name]) => {
  const artworks = Array.from({ length: 6 }, (_, index) => ({
    fileName: `demo-${index + 1}.svg`, src: `/demo/scene-${index + 1}.svg`, title: `Studio ${index + 1}`,
    year: "2026", medium: "Illustrazione dimostrativa", dimensions: "1200 × 800", priceInquiry: false,
  }));
  return { id, name, folder: id, titlePrefix: "Studio", description: "Collezione dimostrativa della galleria.", cover: artworks[0].src, artworks, images: artworks.map(item => item.src), ...(id.includes("/") ? {parentId: "still-life"} : {}) };
});

export function getArtworkCategory(id: string | undefined) { return artworkCategories.find(category => category.id === id); }
