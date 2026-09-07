/**
 * The eight illustrated plant avatars, ported verbatim from the design canvas
 * (`Free Fruits.dc.html`, the `AVATARS` array in its prototype). All paths are authored against a
 * 100x100 viewBox and drawn by `components/ui/AvatarGlyph`.
 *
 * Layer order, and the shared fills each layer uses:
 *   stem   — stroked in `leafDark`
 *   leafA  — filled with the leaf gradient (leafLight -> leafDark)
 *   leafB  — same gradient at 85% opacity
 *   vein   — stroked white
 *   body / part2 / part3 — filled with the body gradient (bodyLight -> bodyDark)
 *   then, clipped to body+part2+part3: a `bodyDark` shading wash, `swoosh`, `mark`
 * Any path left empty is simply not drawn.
 */
export type AvatarDef = {
  id: string;
  label: string;
  /** Fallback initial, used where the artwork cannot be drawn. */
  glyph: string;
  bodyLight: string;
  bodyDark: string;
  leafLight: string;
  leafDark: string;
  body: string;
  part2: string;
  part3: string;
  leafA: string;
  leafB: string;
  vein: string;
  stem: string;
  mark: string;
  swoosh: string;
};

/** The default leaf pair, shared by every fruit that keeps the generic two-leaf sprig. */
const LEAF_LIGHT = '#5FA036';
const LEAF_DARK = '#2E5E1C';

/** The generic sprig: two leaves, one vein, a short stem. Overridden by the herbs. */
const SPRIG = {
  leafA: 'M50,40 C37,39 25,27 23,9 C42,7 53,21 50,40 Z',
  leafB: 'M53,40 C59,37 67,32 71,21 C60,18 51,27 53,40 Z',
  vein: 'M47,37 C40,28 33,20 26,13',
  stem: 'M50,36 C50,39 50,41 50,44',
} as const;

const EMPTY = {
  body: '',
  part2: '',
  part3: '',
  leafA: '',
  leafB: '',
  vein: '',
  stem: '',
  mark: '',
  swoosh: '',
} as const;

export const AVATARS: AvatarDef[] = [
  {
    ...EMPTY,
    ...SPRIG,
    id: 'fig',
    label: 'Fig',
    glyph: 'F',
    bodyLight: '#9B62B4',
    bodyDark: '#5A2472',
    leafLight: LEAF_LIGHT,
    leafDark: LEAF_DARK,
    body: 'M50,40 C58,49 74,57 74,73 C74,86 63,95 50,95 C37,95 26,86 26,73 C26,57 42,49 50,40 Z',
    swoosh: 'M26,80 C38,70 60,86 78,64',
  },
  {
    ...EMPTY,
    ...SPRIG,
    id: 'lemon',
    label: 'Lemon',
    glyph: 'L',
    bodyLight: '#F9DC55',
    bodyDark: '#D08A04',
    leafLight: LEAF_LIGHT,
    leafDark: LEAF_DARK,
    body: 'M12,67 C18,52 33,43 50,43 C67,43 82,52 88,67 C82,82 67,91 50,91 C33,91 18,82 12,67 Z',
    part2: 'M88,63 C94,64 97,67 97,67 C97,67 94,70 88,71 Z',
    swoosh: 'M18,74 C36,64 60,82 86,60',
  },
  {
    ...EMPTY,
    ...SPRIG,
    id: 'olive',
    label: 'Olive',
    glyph: 'O',
    bodyLight: '#B4C455',
    bodyDark: '#4C6A1D',
    leafLight: '#7FAF3F',
    leafDark: '#33581A',
    body: 'M50,42 C62,42 69,55 69,69 C69,84 60,94 50,94 C40,94 31,84 31,69 C31,55 38,42 50,42 Z',
    swoosh: 'M33,78 C42,70 58,86 68,66',
  },
  {
    ...EMPTY,
    ...SPRIG,
    id: 'peach',
    label: 'Peach',
    glyph: 'P',
    bodyLight: '#FBA96F',
    bodyDark: '#DE4A2E',
    leafLight: LEAF_LIGHT,
    leafDark: LEAF_DARK,
    body: 'M50,42 C64,42 78,53 78,68 C78,83 65,95 50,95 C35,95 22,83 22,68 C22,53 36,42 50,42 Z',
    mark: 'M50,45 C44,58 46,76 54,93',
    swoosh: 'M16,76 C34,66 58,84 84,60',
  },
  {
    ...EMPTY,
    id: 'mint',
    label: 'Mint',
    glyph: 'M',
    bodyLight: '#7BDCA6',
    bodyDark: '#12805A',
    leafLight: '#7BDCA6',
    leafDark: '#12805A',
    stem: 'M50,96 C50,80 50,64 50,48',
    leafA: 'M49,90 C33,84 21,65 25,38 C47,43 57,65 49,90 Z',
    leafB: 'M53,72 C66,68 77,53 77,32 C59,36 48,52 53,72 Z',
    vein: 'M46,86 C38,72 32,56 29,44',
  },
  {
    ...EMPTY,
    id: 'cactus',
    label: 'Cactus',
    glyph: 'K',
    bodyLight: '#86D293',
    bodyDark: '#25604A',
    leafLight: '#86D293',
    leafDark: '#25604A',
    body: 'M41,96 L41,56 C41,47 45,42 50,42 C55,42 59,47 59,56 L59,96 Z',
    part2: 'M41,78 L33,78 C27,78 25,72 25,65 L25,57 C25,52 27,50 30,50 C33,50 35,52 35,57 L35,68 L41,68 Z',
    part3: 'M59,72 L67,72 C73,72 75,66 75,59 L75,53 C75,48 77,46 80,46 C83,46 85,48 85,53 L85,61 C85,73 76,82 59,82 Z',
    swoosh: 'M50,52 C50,66 50,82 50,94',
  },
  {
    ...EMPTY,
    id: 'rosemary',
    label: 'Rosemary',
    glyph: 'R',
    bodyLight: '#8FB56A',
    bodyDark: '#3E6B2E',
    leafLight: '#8FB56A',
    leafDark: '#3E6B2E',
    stem: 'M50,96 C50,74 49,54 50,36',
    leafA:
      'M48.5,88 L31.5,77.5 L33.9,85.3 Z M51.5,82 L67.6,72.0 L65.4,79.4 Z M48.5,76 L33.3,66.5 L35.4,73.6 Z M51.5,70 L65.9,61.1 L63.9,67.7 Z M48.5,64 L35.0,55.6 L36.9,61.8 Z M51.5,58 L64.1,50.2 L62.4,56.0 Z M48.5,52 L36.8,44.7 L38.4,50.1 Z M51.5,46 L62.4,39.3 L60.9,44.3 Z M48.5,40 L38.5,33.8 L39.9,38.4 Z M50,40 C53,32 52,26 50,20 C48,26 47,32 50,40 Z',
  },
  {
    ...EMPTY,
    id: 'dandelion',
    label: 'Dandelion',
    glyph: 'D',
    bodyLight: '#F9DC55',
    bodyDark: '#D08A04',
    leafLight: '#7CB342',
    leafDark: '#33581A',
    stem: 'M50,95 C51,76 54,58 60,44',
    leafA:
      'M50,94 L34.0,95.1 L37.8,84.3 L27.6,82.0 L30.8,71.5 L21.2,68.8 L23.7,58.8 L14.8,55.6 L16.7,46.0 L20,44 L25.1,40.9 L28.9,47.2 L32.6,53.4 L36.4,59.7 L40.1,65.9 L43.9,72.2 L47.6,78.4 L51.4,84.7 Z',
    leafB:
      'M50,94 L62.6,95.8 L62.8,86.0 L71.6,84.2 L72.5,75.0 L80.7,72.7 L82.1,64.0 L80,62 L76.4,58.6 L71.4,63.9 L66.4,69.2 L61.4,74.6 L56.4,79.9 L51.4,85.2 Z',
    body: 'M62,14 C72,14 80,21 80,30 C80,39 72,45 62,45 C52,45 44,39 44,30 C44,21 52,14 62,14 Z',
    swoosh: 'M45,38 C54,30 66,44 80,26',
  },
];

export function findAvatar(id: string): AvatarDef {
  return AVATARS.find((a) => a.id === id) ?? AVATARS[0];
}
