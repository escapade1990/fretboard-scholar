import { useEffect, useState, useRef, useCallback } from 'react';
import { Note } from '../../models';
import { useAppSelector } from '../../redux';
import { fretboardSelectors } from '../../redux/features';
import { useSpeechVoices } from '../../hooks';
import { selectWeightedNote } from '../../utils/select-weighted-note';

export const usePlayNote = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [oneSecLeft, setOneSecLeft] = useState(false);
  const [selection, setSelection] = useState<{
    note: Note | undefined;
    serial: number;
  }>();
  const selectionSerial = useRef(0);
  const currentNote = selection?.note;
  const previousNote = useRef<Note | undefined>(undefined);
  const notes = useAppSelector(fretboardSelectors.notesToPractice);
  const interval = useAppSelector(
    (state) => state.configuration.interval * 1000,
  );
  const voiceUri = useAppSelector((state) => state.configuration.voiceUri);
  const isTextToSpeechEnabled = useAppSelector(
    (state) => state.configuration.textToSpeech,
  );
  const { voices } = useSpeechVoices();
  const settings = useRef({ notes, interval });

  useEffect(() => {
    settings.current = { notes, interval };
  }, [notes, interval]);

  useEffect(() => {
    if (!isPlaying) {
      setOneSecLeft(false);
      return;
    }

    let lastNoteAt = performance.now();
    let frame: number;
    let active = true;

    const selectNextNote = () => {
      const selected = selectWeightedNote(
        settings.current.notes,
        previousNote.current,
      );
      previousNote.current = selected;
      setSelection({ note: selected, serial: ++selectionSerial.current });
    };

    selectNextNote();
    setOneSecLeft(settings.current.interval <= 1000);

    const tick = (timestamp: number) => {
      if (!active) return;
      const elapsed = timestamp - lastNoteAt;
      const currentInterval = settings.current.interval;
      if (elapsed >= currentInterval) {
        selectNextNote();
        lastNoteAt = timestamp;
        setOneSecLeft(currentInterval <= 1000);
      } else {
        setOneSecLeft(elapsed >= currentInterval - 1000);
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => {
      active = false;
      cancelAnimationFrame(frame);
    };
  }, [isPlaying]);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    const synthesis = window.speechSynthesis;
    if (
      isPlaying &&
      isTextToSpeechEnabled &&
      currentNote &&
      selection?.serial === selectionSerial.current &&
      typeof SpeechSynthesisUtterance !== 'undefined'
    ) {
      const utterance = new SpeechSynthesisUtterance();
      utterance.text = currentNote.name;
      utterance.voice =
        voices.find((voice) => voice.voiceURI === voiceUri) ??
        voices[0] ??
        null;
      synthesis.speak(utterance);
    }
    return () => synthesis.cancel();
  }, [
    isPlaying,
    isTextToSpeechEnabled,
    currentNote,
    selection,
    voiceUri,
    voices,
  ]);

  const togglePlay = useCallback(() => setIsPlaying((playing) => !playing), []);

  return { isPlaying, togglePlay, currentNote, oneSecLeft };
};
