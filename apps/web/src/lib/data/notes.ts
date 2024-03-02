import { Note } from '../models';

const enharmonicMap: Record<string, string> = {
  'C#': 'Db',
  Db: 'C#',
  'D#': 'Eb',
  Eb: 'D#',
  'F#': 'Gb',
  Gb: 'F#',
  'G#': 'Ab',
  Ab: 'G#',
  'A#': 'Bb',
  Bb: 'A#',
};

export const noteNameToNote = (note: string) => {
  const result: Note = {
    name: note,
    alternativeName: enharmonicMap[note],
  };

  return result;
};

export const noteNames = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
];

export const notes: Record<string, Note> = {
  A: noteNameToNote('A'),
  'A#': noteNameToNote('A#'),
  B: noteNameToNote('B'),
  C: noteNameToNote('C'),
  'C#': noteNameToNote('C#'),
  D: noteNameToNote('D'),
  'D#': noteNameToNote('D#'),
  E: noteNameToNote('E'),
  F: noteNameToNote('F'),
  'F#': noteNameToNote('F#'),
  G: noteNameToNote('G'),
  'G#': noteNameToNote('G#'),
};
