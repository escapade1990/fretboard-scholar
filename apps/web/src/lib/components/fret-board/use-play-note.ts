import { useEffect, useState, useRef, useCallback } from 'react';
import { Note } from '../../models';
import { useAppSelector } from '../../redux';
import { fretboardSelectors } from '../../redux/features';
import { useSpeechVoices } from '../../hooks';

export const usePlayNote = () => {
  // State for playing status and countdown
  const [isPlaying, setIsPlaying] = useState(false);
  const [oneSecLeft, setOneSecLeft] = useState(false);

  // Refs for playing status and animation frame
  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;
  const animationFrameId = useRef<number>();

  // Selectors for notes, interval, voiceUri, and textToSpeechEnabled
  const notes = useAppSelector(fretboardSelectors.notesToPractice);
  const interval = useAppSelector(
    (state) => state.configuration.interval * 1000,
  );
  const voiceUri: string | undefined = useAppSelector(
    (state) => state.configuration.voiceUri,
  );
  const isTextToSpeechEnabled: boolean = useAppSelector(
    (state) => state.configuration.textToSpeech,
  );

  // Check if text-to-speech is supported
  const ttsIsSupported =
    typeof window !== 'undefined' && 'speechSynthesis' in window;

  // Speech voices
  const { voices, loading: voicesAreLoading } = useSpeechVoices();

  // Speech utterance
  const utterance = useRef(new SpeechSynthesisUtterance());

  // State for current and previous notes
  const [currentNote, setCurrentNote] = useState<Note>();
  const previousNote = useRef<Note>();

  // Effect for setting voice
  useEffect(() => {
    if (voiceUri && !voicesAreLoading) {
      const voice = voices.find((v) => v.voiceURI === voiceUri);
      if (voice) {
        utterance.current.voice = voice;
      }
    } else if (voices.length > 0) {
      // Fallback to the default voice
      utterance.current.voice = voices[0];
    }
  }, [voiceUri, voices, voicesAreLoading]);

  // Effect for speech synthesis
  useEffect(() => {
    if (ttsIsSupported && isPlaying && isTextToSpeechEnabled && currentNote) {
      utterance.current.text = currentNote.name; // Assuming 'name' is a property of Note
      window.speechSynthesis.speak(utterance.current);
    } else {
      window.speechSynthesis.cancel(); // Cancel any ongoing speech
    }
  }, [isTextToSpeechEnabled, currentNote, isPlaying, ttsIsSupported]);

  // Function for playing notes
  const playNotes = useCallback(() => {
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

  // Function for toggling play
  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => {
      const nextIsPlaying = !prev;
      if (nextIsPlaying) {
        playNotes();
      }
      return nextIsPlaying;
    });
  }, [playNotes]);

  // Effect for animation frame
  useEffect(() => {
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
