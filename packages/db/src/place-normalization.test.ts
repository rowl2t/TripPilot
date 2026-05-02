import { describe, expect, it } from 'vitest';
import { normalizePlace, dedupeScore, upsertPlaceCandidates, reconcileSavedLinkPlaces } from './place-normalization';

describe('place normalization and dedupe', () => {
  it('treats same place with different notation as duplicate', () => {
    const a = normalizePlace({ name: 'N Seoul Tower (남산타워)', city: 'Seoul', lat: 37.5512, lng: 126.9882 });
    const b = normalizePlace({ name: 'n seoul tower', city: 'Seoul', lat: 37.5513, lng: 126.9881 });
    expect(dedupeScore(a, b).matched).toBe(true);
  });

  it('does not merge same name in different cities', () => {
    const a = normalizePlace({ name: 'Central Park', city: 'New York', lat: 40.78, lng: -73.96 });
    const b = normalizePlace({ name: 'Central Park', city: 'Sydney', lat: -33.88, lng: 151.21 });
    expect(dedupeScore(a, b).matched).toBe(false);
  });

  it('merges candidate without place_id by proximity and name', () => {
    const result = upsertPlaceCandidates([
      normalizePlace({ name: 'Gyeongbokgung Palace', city: 'Seoul', lat: 37.5796, lng: 126.9770, categories: ['history'] })
    ], [
      { name: 'gyeongbokgung palace', city: 'Seoul', lat: 37.5797, lng: 126.9771, categories: ['landmark'], rating: 4.8 }
    ]);
    expect(result.places.length).toBe(1);
    expect(result.places[0].categories).toContain('landmark');
  });

  it('records possible duplicates and reconciles saved link places', () => {
    const seeded = [normalizePlace({ name: 'Lotte World', city: 'Seoul', lat: 37.5110, lng: 127.0980, google_place_id: 'gp_lotte' })];
    const out = upsertPlaceCandidates(seeded, [{ name: 'Lotte World Adventure', city: 'Seoul', lat: 37.5115, lng: 127.0979 }]);
    expect(out.possibleDuplicates.length).toBeGreaterThanOrEqual(1);

    const links = reconcileSavedLinkPlaces([{ place_name: 'lotte world', city: 'Seoul', lat: 37.5111, lng: 127.0981 }], out.places);
    expect(links[0].linked_place_name).toBe('Lotte World');
  });
});
