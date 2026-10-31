import { Note } from '../models';

// Preserve the original position-based weights, including duplicate note positions.
export const selectWeightedNote = (
  notes: Note[],
  previous: Note | undefined,
) => {
  const hasAlternative = notes.some((note) => note !== previous);
  const candidates = notes
    .map((note, index) => ({ note, weight: index + 1 }))
    .filter(({ note }) => !hasAlternative || note !== previous);
  const totalWeight = candidates.reduce(
    (total, { weight }) => total + weight,
    0,
  );
  if (candidates.length === 0) return undefined;
  let choice = Math.random() * totalWeight;

  for (const { note, weight } of candidates) {
    if (choice < weight) return note;
    choice -= weight;
  }
  return candidates[candidates.length - 1]?.note;
};
