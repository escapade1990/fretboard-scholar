import { Note } from '../models';
import { selectWeightedNote } from './select-weighted-note';

describe('selectWeightedNote', () => {
  afterEach(() => jest.restoreAllMocks());

  it('returns undefined for an empty note pool', () => {
    expect(selectWeightedNote([], undefined)).toBeUndefined();
  });

  it('returns a single note even when it is the previous note', () => {
    const onlyNote: Note = { name: 'E' };
    jest.spyOn(Math, 'random').mockReturnValue(0.75);

    expect(selectWeightedNote([onlyNote], onlyNote)).toBe(onlyNote);
  });

  it('excludes every occurrence of the previous note when alternatives exist', () => {
    const previous: Note = { name: 'E' };
    const alternative: Note = { name: 'F' };
    jest.spyOn(Math, 'random').mockReturnValue(0.99);

    expect(
      selectWeightedNote([previous, alternative, previous], previous),
    ).toBe(alternative);
  });

  it('uses independent weighted intervals from original positions, including duplicates', () => {
    const first: Note = { name: 'E' };
    const middle: Note = { name: 'F' };
    const notes = [first, middle, first];
    const random = jest.spyOn(Math, 'random');
    random
      .mockReturnValueOnce(1 / 12)
      .mockReturnValueOnce(0.25)
      .mockReturnValueOnce(0.75);

    expect(selectWeightedNote(notes, undefined)).toBe(first);
    expect(selectWeightedNote(notes, undefined)).toBe(middle);
    expect(selectWeightedNote(notes, undefined)).toBe(first);
  });

  it('keeps original positional weights after excluding the previous note', () => {
    const previous: Note = { name: 'E' };
    const firstAlternative: Note = { name: 'F' };
    const secondAlternative: Note = { name: 'G' };
    jest.spyOn(Math, 'random').mockReturnValue(0.35);

    expect(
      selectWeightedNote(
        [previous, firstAlternative, secondAlternative],
        previous,
      ),
    ).toBe(firstAlternative);
  });
});
