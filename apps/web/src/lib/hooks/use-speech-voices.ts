import { useEffect, useState } from 'react';

export const useSpeechVoices = (lang = 'en-US') => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const populateVoices = () => {
      const availableVoices = speechSynthesis
        .getVoices()
        .filter((voice) => voice.lang === lang);
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
        setLoading(false);
      }
    };

    speechSynthesis.addEventListener('voiceschanged', populateVoices);
    populateVoices();

    return () => {
      speechSynthesis.removeEventListener('voiceschanged', populateVoices);
    };
  }, [lang]);

  return { voices, loading };
};
