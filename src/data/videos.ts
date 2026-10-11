export type Video = {
  title: string;
  embedUrl: string;
  sourceUrl?: string;
  thumbnail: string;
  orientation: 'portrait' | 'landscape';
};

export const videos: Video[] = [];
