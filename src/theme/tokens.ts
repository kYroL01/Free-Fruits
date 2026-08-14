export type ColorTokens = {
  bg: string;
  surface: string;
  surface2: string;
  text: string;
  dim: string;
  line: string;
  green: string;
  greenSoft: string;
  fuchsia: string;
  fuchsiaSoft: string;
  gold: string;
  goldSoft: string;
  land: string;
  road: string;
  park: string;
  water: string;
  ph: string;
};

export const lightTokens: ColorTokens = {
  bg: '#F5F7F2',
  surface: '#FFFFFF',
  surface2: '#EDF1E9',
  text: '#10160F',
  dim: '#6C7A6E',
  line: 'rgba(16,22,15,0.10)',
  green: '#12734A',
  greenSoft: '#E2F1E6',
  fuchsia: '#D4148B',
  fuchsiaSoft: '#FCE3F1',
  gold: '#A87400',
  goldSoft: '#F7EBCF',
  land: '#E9ECE1',
  road: '#FFFFFF',
  park: '#D6E8CE',
  water: '#CDDFEA',
  ph: 'rgba(16,22,15,0.06)',
};

export const darkTokens: ColorTokens = {
  bg: '#0D1210',
  surface: '#161D18',
  surface2: '#1E2721',
  text: '#EDF3EC',
  dim: '#8FA093',
  line: 'rgba(255,255,255,0.13)',
  green: '#43C384',
  greenSoft: 'rgba(67,195,132,0.15)',
  fuchsia: '#FF57BC',
  fuchsiaSoft: 'rgba(255,87,188,0.16)',
  gold: '#EFC154',
  goldSoft: 'rgba(239,193,84,0.16)',
  land: '#121814',
  road: '#212A23',
  park: '#18291C',
  water: '#152431',
  ph: 'rgba(255,255,255,0.07)',
};

/** Rarity is always colour-coded AND text-labelled — never colour alone (accessibility). */
export type Rarity = 'common' | 'rare' | 'legendary' | 'unrated';

export function rarityColor(tokens: ColorTokens, rarity: Rarity): string {
  switch (rarity) {
    case 'common':
      return tokens.green;
    case 'rare':
      return tokens.fuchsia;
    case 'legendary':
      return tokens.gold;
    case 'unrated':
      return tokens.dim;
  }
}

export function raritySoftColor(tokens: ColorTokens, rarity: Rarity): string {
  switch (rarity) {
    case 'common':
      return tokens.greenSoft;
    case 'rare':
      return tokens.fuchsiaSoft;
    case 'legendary':
      return tokens.goldSoft;
    case 'unrated':
      return tokens.surface2;
  }
}
