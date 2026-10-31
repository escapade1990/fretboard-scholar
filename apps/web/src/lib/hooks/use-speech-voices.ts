import { useEffect, useState } from 'react';

export const useSpeechVoices = (lang = 'en-US') => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      setVoices([]);
      setLoading(false);
      return;
    }

    const synthesis = window.speechSynthesis;
    const populateVoices = () => {
      setVoices(synthesis.getVoices().filter((voice) => voice.lang === lang));
      setLoading(false);
    };

    synthesis.addEventListener('voiceschanged', populateVoices);
    populateVoices();
    return () => synthesis.removeEventListener('voiceschanged', populateVoices);
  }, [lang]);

  return { voices, loading };
};
