export type PressText = {
  id: string;
  title: string;
  author: string;
  attribution?: string;
  publication?: string;
  text: string;
  textEn: string;
};

export const pressTexts: PressText[] = [{ id: 'demo', title: 'Studio notes', author: 'Demo studio', text: 'Testo dimostrativo per la sezione stampa. Le recensioni originali non sono distribuite.', textEn: 'Sample content for the press section. Original reviews are not distributed.' }];
