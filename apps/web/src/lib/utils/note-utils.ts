import { FretBoardTuning, Note } from '../models';
import { noteNames, notes } from '../data';

export const getNotesForString =
  (fretCount: number) => (startingNoteName: string) => {
    const reulst: Note[] = [];
    let currentNoteIndex = noteNames.indexOf(startingNoteName);

    // debugger;
    for (let fret = 0; fret <= fretCount; fret++) {
      const note = notes[noteNames[currentNoteIndex]];
      reulst.push(note);
      currentNoteIndex = (currentNoteIndex + 1) % noteNames.length;
    }

    return reulst;
  };

export const getNotesPerString = (
  fretCount: number,
  tuning: FretBoardTuning = 'EADGBE',
) => {
  const getNotes = getNotesForString(fretCount);
  const result = tuning
    .split('')
    .reverse()
    .reduce<{ [stringNumber: string]: Note[] }>((acc, tutningNote, index) => {
      acc[index] = getNotes(tutningNote);
      return acc;
    }, {});

  return result;
};
