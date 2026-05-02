export interface PlaceCandidate {
  id?: string;
  google_place_id?: string | null;
  name: string;
  city?: string | null;
  address?: string | null;
  lat?: number | null;
  lng?: number | null;
  aliases?: string[];
  categories?: string[];
  rating?: number | null;
  price_level?: number | null;
  source_payload?: Record<string, unknown>;
}

export interface NormalizedPlace extends PlaceCandidate {
  normalized_name: string;
  normalized_address?: string;
  aliases: string[];
}

export interface DuplicateMatchResult { matched: boolean; confidence: number; reason: string }

const normalizeText = (value: string): string => value
  .trim()
  .toLowerCase()
  .replace(/\([^)]*\)/g, ' ')
  .replace(/[^\p{L}\p{N}\s]/gu, ' ')
  .replace(/\s+/g, ' ')
  .trim();

export const normalizePlace = (input: PlaceCandidate): NormalizedPlace => {
  const normalized_name = normalizeText(input.name);
  const normalized_address = input.address ? normalizeText(input.address) : undefined;
  const aliases = Array.from(new Set([input.name, ...(input.aliases ?? [])].map(normalizeText).filter(Boolean)));
  return { ...input, normalized_name, normalized_address, aliases };
};

const distanceMeters = (aLat: number, aLng: number, bLat: number, bLng: number): number => {
  const R = 6371000;
  const dLat = (bLat - aLat) * Math.PI / 180;
  const dLng = (bLng - aLng) * Math.PI / 180;
  const x = dLng * Math.cos((aLat + bLat) * Math.PI / 360);
  return Math.sqrt(dLat * dLat + x * x) * R;
};

export const dedupeScore = (a: NormalizedPlace, b: NormalizedPlace): DuplicateMatchResult => {
  if (a.google_place_id && b.google_place_id && a.google_place_id === b.google_place_id) return { matched: true, confidence: 1, reason: 'google_place_id' };

  let score = 0;
  const sameName = a.normalized_name === b.normalized_name || a.aliases.some((x) => b.aliases.includes(x));
  if (sameName) score += 0.45;
  if ((a.city ?? '').toLowerCase() === (b.city ?? '').toLowerCase() && a.city) score += 0.2;

  if (a.lat != null && a.lng != null && b.lat != null && b.lng != null) {
    const d = distanceMeters(a.lat, a.lng, b.lat, b.lng);
    if (d <= 80) score += 0.35;
    else if (d <= 250) score += 0.2;
  }

  return { matched: score >= 0.7, confidence: Number(score.toFixed(2)), reason: sameName ? 'name-city-proximity' : 'insufficient' };
};

export const mergePlaces = (existing: NormalizedPlace, incoming: NormalizedPlace): NormalizedPlace => ({
  ...existing,
  google_place_id: existing.google_place_id ?? incoming.google_place_id,
  aliases: Array.from(new Set([...existing.aliases, ...incoming.aliases])),
  categories: Array.from(new Set([...(existing.categories ?? []), ...(incoming.categories ?? [])])),
  rating: incoming.rating ?? existing.rating,
  price_level: incoming.price_level ?? existing.price_level,
  source_payload: { ...(existing.source_payload ?? {}), ...(incoming.source_payload ?? {}) },
  address: incoming.address ?? existing.address,
  normalized_address: incoming.normalized_address ?? existing.normalized_address,
  lat: incoming.lat ?? existing.lat,
  lng: incoming.lng ?? existing.lng
});

export const upsertPlaceCandidates = (existing: NormalizedPlace[], incomingRaw: PlaceCandidate[]) => {
  const places = [...existing];
  const possibleDuplicates: Array<{ incomingName: string; existingName: string; confidence: number }> = [];

  for (const raw of incomingRaw) {
    const incoming = normalizePlace(raw);
    let merged = false;
    for (let i = 0; i < places.length; i += 1) {
      const m = dedupeScore(places[i], incoming);
      if (m.matched) {
        places[i] = mergePlaces(places[i], incoming);
        merged = true;
        break;
      }
      if (m.confidence >= 0.5) possibleDuplicates.push({ incomingName: incoming.name, existingName: places[i].name, confidence: m.confidence });
    }
    if (!merged) places.push(incoming);
  }

  return { places, possibleDuplicates };
};

export const reconcileSavedLinkPlaces = (savedLinkPlaces: Array<{ place_name: string; city?: string | null; lat?: number | null; lng?: number | null; place_id?: string | null }>, places: NormalizedPlace[]) =>
  savedLinkPlaces.map((row) => {
    const normalized = normalizePlace({ name: row.place_name, city: row.city, lat: row.lat, lng: row.lng, google_place_id: row.place_id });
    const matched = places.find((p) => dedupeScore(p, normalized).matched);
    return { ...row, place_id: matched?.google_place_id ?? row.place_id ?? null, linked_place_name: matched?.name ?? null };
  });
