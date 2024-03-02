import React from 'react';
import { Note } from '../../models';
import { useAppSelector } from '../../redux';
import { fretboardSelectors } from '../../redux/features';

export const usePlayNote = () => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [oneSecLeft, setOneSecLeft] = React.useState(false);

  const isPlayingRef = React.useRef(isPlaying);
  isPlayingRef.current = isPlaying;

  const notes = useAppSelector(fretboardSelectors.notesToPractice);
  const interval = useAppSelector(
    (state) => state.configuration.interval * 1000,
  );

  const [currentNote, setCurrentNote] = React.useState<Note>();
  const previousNote = React.useRef<Note>();
  const animationFrameId = React.useRef<number>();

  const playNotes = React.useCallback(() => {
    const timestamp = performance.now();
    if (!animationFrameId.current) {
      animationFrameId.current = timestamp;
    }
    const elapsed = timestamp - animationFrameId.current;
    if (elapsed >= interval || !isPlayingRef.current) {
      const availableNotes = notes.filter(
        (note) => note !== previousNote.current,
      );
      const randomIndex = Math.floor(Math.random() * availableNotes.length);
      const randomNote = availableNotes[randomIndex];
      previousNote.current = randomNote;
      setCurrentNote(randomNote);
      animationFrameId.current = timestamp;
      setOneSecLeft(false);
    } else if (elapsed >= interval - 1000 && !oneSecLeft) {
      setOneSecLeft(true);
    }
    if (isPlayingRef.current) {
      requestAnimationFrame(playNotes);
    }
  }, [interval, notes, oneSecLeft, setOneSecLeft]);

  const togglePlay = React.useCallback(() => {
    setIsPlaying((prev) => {
      const nextIsPlaying = !prev;
      if (nextIsPlaying) {
        playNotes();
      }
      return nextIsPlaying;
    });
  }, [playNotes]);

  React.useEffect(() => {
    if (isPlaying) {
      requestAnimationFrame(playNotes);
    } else if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isPlaying, playNotes]);

  return {
    isPlaying,
    togglePlay,
    currentNote,
    oneSecLeft,
  };
};
