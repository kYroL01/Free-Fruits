/** Placeholder avatar set — the real 8 illustrated plant SVGs referenced by the original design
 * prototype's `AVATARS` array weren't available to this build; these emoji tiles stand in until
 * real art is sourced (flagged follow-up). */
export type AvatarDef = { id: string; emoji: string; tint: string };

export const AVATARS: AvatarDef[] = [
  { id: 'fig', emoji: '🍇', tint: '#7C3F73' },
  { id: 'lemon', emoji: '🍋', tint: '#D9A62E' },
  { id: 'olive', emoji: '🫒', tint: '#5C7A3B' },
  { id: 'peach', emoji: '🍑', tint: '#E8896B' },
  { id: 'mint', emoji: '🌿', tint: '#3E8E5C' },
  { id: 'cactus', emoji: '🌵', tint: '#3E8E5C' },
  { id: 'rosemary', emoji: '🌱', tint: '#4E7A4E' },
  { id: 'dandelion', emoji: '🌼', tint: '#C9A227' },
];

export function findAvatar(id: string): AvatarDef {
  return AVATARS.find((a) => a.id === id) ?? AVATARS[0];
}
