import { configurationActions } from '../configuration';
import { makeStore } from '../../store';
import { fretboardSelectors } from './fret-board-selectors';

describe('fretboard selectors', () => {
  it('slices each string through the configured fret, inclusive', () => {
    const store = makeStore({ maxFretCount: 5 });
    store.dispatch(configurationActions.setFretCount(2));

    const strings = fretboardSelectors.activeStringsWithNotes(store.getState());

    expect(strings['0'].map(({ name }) => name)).toEqual(['E', 'F', 'F#']);
    expect(strings['0']).toHaveLength(3);
  });

  it('uses the 1-based practice string and removes notes with alternate names', () => {
    const store = makeStore({ maxFretCount: 12 });
    store.dispatch(configurationActions.setStringToPractice(1));

    const notes = fretboardSelectors.notesToPractice(store.getState());

    expect(notes.map(({ name }) => name)).toEqual([
      'E', 'F', 'G', 'A', 'B', 'C', 'D', 'E',
    ]);
    expect(notes.every(({ alternativeName }) => !alternativeName)).toBe(true);
  });

  it('reuses memoized output when selector inputs stay unchanged', () => {
    const store = makeStore({ maxFretCount: 5 });
    const firstResult = fretboardSelectors.activeStringsWithNotes(store.getState());

    store.dispatch(configurationActions.setSettingIsOpen(true));
    const secondResult = fretboardSelectors.activeStringsWithNotes(store.getState());

    expect(secondResult).toBe(firstResult);
  });
});
