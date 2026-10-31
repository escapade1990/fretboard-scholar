/** @jest-environment jsdom */
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { makeStore } from '../../../redux/store';
import { configurationActions } from '../../../redux/features';
import { Settings } from './settings-slide-over';

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

it('preserves the saved voice while voices load and selects it when available', async () => {
  const key = 'fretboard-scholar-settings__voice-uri';
  const speechDescriptor = Object.getOwnPropertyDescriptor(
    window,
    'speechSynthesis',
  );
  let voices: SpeechSynthesisVoice[] = [];
  let listener: EventListener | undefined;
  const speech = {
    getVoices: () => voices,
    addEventListener: (_type: string, callback: EventListener) => {
      listener = callback;
    },
    removeEventListener: () => {
      listener = undefined;
    },
  };
  Object.defineProperty(window, 'speechSynthesis', {
    configurable: true,
    value: speech,
  });
  localStorage.setItem(key, 'voice:saved');
  const store = makeStore({ maxFretCount: 24 });
  store.dispatch(configurationActions.setVoiceUri('voice:saved'));
  store.dispatch(configurationActions.setTextToSpeech(true));
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);

  try {
    await act(async () => {
      root.render(
        React.createElement(Provider, { store }, React.createElement(Settings)),
      );
    });
    expect(localStorage.getItem(key)).toBe('voice:saved');
    expect(store.getState().configuration.voiceUri).toBe('voice:saved');

    const fallback = {
      lang: 'en-US',
      voiceURI: 'voice:fallback',
      name: 'Fallback',
    } as SpeechSynthesisVoice;
    voices = [fallback];
    await act(async () => {
      listener?.(new Event('voiceschanged'));
      store.dispatch(configurationActions.setSettingIsOpen(true));
    });
    expect(localStorage.getItem(key)).toBe('voice:saved');
    expect(store.getState().configuration.voiceUri).toBe('voice:saved');
    expect(document.body.textContent).toContain('Fallback');

    voices = [
      fallback,
      {
        lang: 'en-US',
        voiceURI: 'voice:saved',
        name: 'Saved voice',
      } as SpeechSynthesisVoice,
    ];
    await act(async () => listener?.(new Event('voiceschanged')));
    expect(document.body.textContent).toContain('Saved voice');
    expect(localStorage.getItem(key)).toBe('voice:saved');
    expect(store.getState().configuration.voiceUri).toBe('voice:saved');
  } finally {
    await act(async () => root.unmount());
    container.remove();
    localStorage.removeItem(key);
    if (speechDescriptor)
      Object.defineProperty(window, 'speechSynthesis', speechDescriptor);
    else Reflect.deleteProperty(window, 'speechSynthesis');
  }
});
