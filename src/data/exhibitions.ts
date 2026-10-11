export type Exhibition = {
  slug: string;
  year: string;
  date: string;
  period: string;
  title: string;
  type?: string;
  location: string;
  image: string;
  gallery?: string[];
  paragraphs: string[];
  credit?: string;
  videoUrl?: string;
};

export const exhibitions: Exhibition[] = [{slug: 'demo-exhibition', year: '2026', date: 'Ottobre', period: 'Ottobre 2026', title: 'Forme e colore', type: 'Mostra dimostrativa', location: 'Demo gallery', image: '/demo/scene-1.svg', gallery: ['/demo/scene-1.svg', '/demo/scene-2.svg'], paragraphs: ['Contenuto dimostrativo della mostra.']}];

export function getExhibition(slug: string | undefined) { return exhibitions.find(item => item.slug === slug); }
