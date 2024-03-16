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

  // This function is used to play notes with a higher index being prioritized
  const playNotes = useCallback(() => {
    // Get the current timestamp
    const timestamp = performance.now();

    // If this is the first frame, set the current timestamp as the initial animation frame ID
    if (!animationFrameId.current) {
      animationFrameId.current = timestamp;
    }

    // Calculate the elapsed time since the last frame
    const elapsed = timestamp - animationFrameId.current;

    // If the elapsed time is greater than or equal to the interval, or if the playing status has changed, select a new note
    if (elapsed >= interval || !isPlayingRef.current) {
      // Calculate the total weight of the notes, where each note's weight is its index plus one
      const totalWeight = notes.reduce(
        (total, _, index) => total + index + 1,
        0,
      );

      // Initialize the selected note as the previous note
      let selectedNote = previousNote.current;

      // While the selected note is the same as the previous note, select a new note
      while (selectedNote === previousNote.current) {
        // Generate a random number between 0 and the total weight
        let randomNum = Math.random() * totalWeight;

        // Iterate over the notes
        for (let i = 0; i < notes.length; i++) {
          // If the random number is less than the current note's weight, select the current note and break the loop
          if (randomNum < i + 1) {
            selectedNote = notes[i];
            break;
          }

          // Subtract the current note's weight from the random number
          randomNum -= i + 1;
        }
      }

      // Set the selected note as the current note and the previous note
      previousNote.current = selectedNote;
      setCurrentNote(selectedNote);

      // Reset the animation frame ID to the current timestamp
      animationFrameId.current = timestamp;

      // Reset the one second left flag
      setOneSecLeft(false);
    } else if (elapsed >= interval - 1000 && !oneSecLeft) {
      // If there's one second left until the next note and the one second left flag hasn't been set, set the flag
      setOneSecLeft(true);
    }

    // If the playing status is true, request the next animation frame
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
