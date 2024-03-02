import { Note } from './note';

export type GuitarString = {
  number: number;
  openNote: Note;
  notesOnFrets: Note[];
};
