import type { Alert } from '@/domain/types';

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(d.getHours() - Math.floor(Math.random() * 20));
  return d.toISOString();
}

export function buildSeedAlerts(): Alert[] {
  return [
    {
      id: 'a1',
      kind: 'nearby_unverified',
      title: 'Someone logged a fig 60 m away',
      body: 'A new fig tree near Carrer de Quart is waiting on its first on-site check.',
      at: daysAgo(0),
      read: false,
      treeId: 't3',
    },
    {
      id: 'a2',
      kind: 'claim_review',
      title: 'A duplicate claim needs your input',
      body: 'Someone claimed a separate tree near your peach at Pont de l’Exposició. Your review counts.',
      at: daysAgo(0.4),
      read: false,
      treeId: 't10',
    },
    {
      id: 'a3',
      kind: 'reopened_checkin',
      title: 'Your mulberry is back in season',
      body: 'It has been over 30 days since the last report, and mulberries are ripening again.',
      at: daysAgo(1),
      read: false,
      treeId: 't7',
    },
    {
      id: 'a4',
      kind: 'info',
      title: 'Two foragers confirmed your orange',
      body: 'Ciutat de les Arts · your tree is now verified and on the public map.',
      at: daysAgo(3),
      read: true,
      treeId: 't1',
    },
    {
      id: 'a5',
      kind: 'nearby_unverified',
      title: 'A wild fennel needs a second check',
      body: 'Jardí del Túria, near Palau de la Música — one confirmation so far.',
      at: daysAgo(1.2),
      read: false,
      treeId: 't5',
    },
    {
      id: 'a6',
      kind: 'info',
      title: 'Welcome to Free Fruits, Valencia',
      body: 'Nothing ripe should rot. Start with the map — every pin is one tap away.',
      at: daysAgo(6),
      read: true,
    },
  ];
}
