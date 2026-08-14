export type Reward = {
  id: string;
  title: string;
  body: string;
  cost: number;
  /** Orchardist tier is listed among the rewards but can never actually be bought — tier is
   * earned by points balance, not spent into. */
  locked?: boolean;
};

export const REWARDS: Reward[] = [
  {
    id: 'sapling',
    title: 'Fund a real sapling',
    body: 'We plant a real fruit tree on a Valencia street with a local nursery partner.',
    cost: 500,
  },
  {
    id: 'rare_layer',
    title: 'Rare-fruit map layer',
    body: 'Unlock a map overlay highlighting every Rare and Legendary tree in the city.',
    cost: 300,
  },
  {
    id: 'orchardist_tier',
    title: 'Orchardist tier',
    body: 'The top tier is earned by foraging, not bought — keep logging trees to get there.',
    cost: 2000,
    locked: true,
  },
];
