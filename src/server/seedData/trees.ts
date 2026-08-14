import type { ConditionReason, Tree } from '@/domain/types';
import { findSpecies } from './species';

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

type SeedSpec = {
  id: string;
  speciesId: string;
  lat: number;
  lng: number;
  street: string;
  finderId: string;
  finderHandle: string;
  confirmations: number;
  pending: boolean;
  fence: boolean;
  createdDaysAgo: number;
  latestReport?: { kind: 'good' | 'bad'; reason: ConditionReason; daysAgo: number; by: string };
};

// Scattered along the Jardí del Túria and nearby Valencia neighbourhoods (Ciutat Vella, Ruzafa,
// El Carmen, Malvarrosa, Benimaclet) — placeholder coordinates for a mock-data build, not a
// verified survey of real trees.
const SEEDS: SeedSpec[] = [
  { id: 't1', speciesId: 'orange', lat: 39.4746, lng: -0.3591, street: 'Jardí del Túria · Ciutat de les Arts', finderId: 'me', finderHandle: 'you_in_valencia', confirmations: 2, pending: false, fence: false, createdDaysAgo: 40, latestReport: { kind: 'good', reason: 'fruit_ready', daysAgo: 3, by: 'laura_v' } },
  { id: 't2', speciesId: 'loquat', lat: 39.4715, lng: -0.3688, street: 'Jardí del Túria · Pont de Fusta', finderId: 'u2', finderHandle: 'michele_f', confirmations: 2, pending: false, fence: false, createdDaysAgo: 60, latestReport: { kind: 'good', reason: 'fruit_ripening', daysAgo: 6, by: 'ana_p' } },
  { id: 't3', speciesId: 'fig', lat: 39.4744, lng: -0.3808, street: 'Carrer de Quart · El Carme', finderId: 'u3', finderHandle: 'jordi_r', confirmations: 1, pending: true, fence: false, createdDaysAgo: 5 },
  { id: 't4', speciesId: 'lemon', lat: 39.4632, lng: -0.3752, street: 'Carrer de Sueca · Russafa', finderId: 'u4', finderHandle: 'nuria_g', confirmations: 2, pending: false, fence: false, createdDaysAgo: 90, latestReport: { kind: 'good', reason: 'fruit_ready', daysAgo: 10, by: 'jordi_r' } },
  { id: 't5', speciesId: 'wild-fennel', lat: 39.4701, lng: -0.3399, street: 'Jardí del Túria · Palau de la Música', finderId: 'u5', finderHandle: 'paco_m', confirmations: 0, pending: true, fence: false, createdDaysAgo: 1 },
  { id: 't6', speciesId: 'rosemary', lat: 39.4658, lng: -0.3271, street: 'Passeig Marítim · Malva-rosa', finderId: 'me', finderHandle: 'you_in_valencia', confirmations: 2, pending: false, fence: false, createdDaysAgo: 120, latestReport: { kind: 'good', reason: 'fruit_ready', daysAgo: 45, by: 'ana_p' } },
  { id: 't7', speciesId: 'mulberry', lat: 39.4818, lng: -0.3547, street: 'Carrer de Serra · Benimaclet', finderId: 'u6', finderHandle: 'ana_p', confirmations: 2, pending: false, fence: true, createdDaysAgo: 200, latestReport: { kind: 'bad', reason: 'dry', daysAgo: 20, by: 'nuria_g' } },
  { id: 't8', speciesId: 'sage', lat: 39.4587, lng: -0.3841, street: 'Jardins de Monforte', finderId: 'u2', finderHandle: 'michele_f', confirmations: 1, pending: true, fence: false, createdDaysAgo: 8 },
  { id: 't9', speciesId: 'thyme', lat: 39.4573, lng: -0.4012, street: 'Parc de Capçalera', finderId: 'u3', finderHandle: 'jordi_r', confirmations: 2, pending: false, fence: false, createdDaysAgo: 75, latestReport: { kind: 'good', reason: 'fruit_ready', daysAgo: 33, by: 'paco_m' } },
  { id: 't10', speciesId: 'peach', lat: 39.4693, lng: -0.3535, street: 'Jardí del Túria · Pont de l’Exposició', finderId: 'u5', finderHandle: 'paco_m', confirmations: 0, pending: true, fence: false, createdDaysAgo: 2 },
  { id: 't11', speciesId: 'basil', lat: 39.4628, lng: -0.3719, street: 'Mercat de Russafa', finderId: 'u4', finderHandle: 'nuria_g', confirmations: 2, pending: false, fence: false, createdDaysAgo: 15, latestReport: { kind: 'good', reason: 'fruit_ready', daysAgo: 4, by: 'laura_v' } },
  { id: 't12', speciesId: 'bay-laurel', lat: 39.4762, lng: -0.3752, street: 'Torres de Serrans', finderId: 'u6', finderHandle: 'ana_p', confirmations: 2, pending: false, fence: false, createdDaysAgo: 300, latestReport: { kind: 'good', reason: 'fruit_ready', daysAgo: 90, by: 'jordi_r' } },
  { id: 't13', speciesId: 'plum', lat: 39.4809, lng: -0.3487, street: 'Carrer d’Alboraia · Benimaclet', finderId: 'u1', finderHandle: 'laura_v', confirmations: 1, pending: true, fence: false, createdDaysAgo: 12 },
  { id: 't14', speciesId: 'cherry', lat: 39.4645, lng: -0.3823, street: 'Carrer de Quart · El Carme', finderId: 'u2', finderHandle: 'michele_f', confirmations: 2, pending: false, fence: true, createdDaysAgo: 55, latestReport: { kind: 'good', reason: 'fruit_ripening', daysAgo: 2, by: 'nuria_g' } },
  { id: 't15', speciesId: 'apple', lat: 39.4718, lng: -0.3305, street: 'Ciutat de les Arts i les Ciències', finderId: 'u3', finderHandle: 'jordi_r', confirmations: 2, pending: false, fence: false, createdDaysAgo: 100, latestReport: { kind: 'bad', reason: 'season_over', daysAgo: 8, by: 'paco_m' } },
  { id: 't16', speciesId: 'wild-mint', lat: 39.4589, lng: -0.3958, street: 'Riu Túria · Nou d’Octubre', finderId: 'u4', finderHandle: 'nuria_g', confirmations: 2, pending: false, fence: false, createdDaysAgo: 30, latestReport: { kind: 'good', reason: 'fruit_ready', daysAgo: 1, by: 'ana_p' } },
  { id: 't17', speciesId: 'oregano', lat: 39.4671, lng: -0.3618, street: 'Plaça de l’Ajuntament', finderId: 'u5', finderHandle: 'paco_m', confirmations: 0, pending: true, fence: false, createdDaysAgo: 0 },
  { id: 't18', speciesId: 'fig', lat: 39.4736, lng: -0.3441, street: 'Jardí del Túria · Pont de les Flors', finderId: 'u6', finderHandle: 'ana_p', confirmations: 2, pending: false, fence: false, createdDaysAgo: 65, latestReport: { kind: 'good', reason: 'fruit_ripening', daysAgo: 5, by: 'michele_f' } },
];

export function buildSeedTrees(): Tree[] {
  return SEEDS.map((s) => {
    const species = findSpecies(s.speciesId);
    if (!species) throw new Error(`Unknown seed species: ${s.speciesId}`);
    return {
      id: s.id,
      speciesId: s.speciesId,
      rarity: species.rarity,
      points: species.points,
      location: { lat: s.lat, lng: s.lng },
      street: s.street,
      finderId: s.finderId,
      finderHandle: s.finderHandle,
      confirmations: s.confirmations,
      confirmationsNeeded: 2,
      pending: s.pending,
      fence: s.fence,
      photoUri: null,
      latestReport: s.latestReport
        ? {
            kind: s.latestReport.kind,
            reason: s.latestReport.reason,
            at: daysAgo(s.latestReport.daysAgo),
            by: s.latestReport.by,
          }
        : null,
      createdAt: daysAgo(s.createdDaysAgo),
    };
  });
}
