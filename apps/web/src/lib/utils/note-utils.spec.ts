import { getNotesForString, getNotesPerString } from './note-utils';

describe('getNotesForString', () => {
  it('returns open note through requested fret, including both boundaries', () => {
    const notes = getNotesForString(2)('E');

    expect(notes.map(({ name }) => name)).toEqual(['E', 'F', 'F#']);
    expect(notes).toHaveLength(3);
  });

  it('continues chromatically across the end of the note cycle', () => {
    const notes = getNotesForString(3)('B');

    expect(notes.map(({ name }) => name)).toEqual(['B', 'C', 'C#', 'D']);
  });

  it('returns only open note when fret count is zero', () => {
    expect(getNotesForString(0)('A').map(({ name }) => name)).toEqual(['A']);
  });
});

describe('getNotesPerString', () => {
  it('numbers standard tuning from the highest string at index zero', () => {
    const strings = getNotesPerString(2);

    expect(strings['0'].map(({ name }) => name)).toEqual(['E', 'F', 'F#']);
    expect(strings['5'].map(({ name }) => name)).toEqual(['E', 'F', 'F#']);
  });

  it('uses supplied tuning and includes open note plus each requested fret', () => {
    const strings = getNotesPerString(1, 'DG' as unknown as 'EADGBE');

    expect(Object.keys(strings)).toEqual(['0', '1']);
    expect(strings['0'].map(({ name }) => name)).toEqual(['G', 'G#']);
    expect(strings['1'].map(({ name }) => name)).toEqual(['D', 'D#']);
  });
});
