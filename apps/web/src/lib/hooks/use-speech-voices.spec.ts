/** @jest-environment jsdom */
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { useSpeechVoices } from './use-speech-voices';

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

describe('useSpeechVoices', () => {
  let root: Root;
  let container: HTMLDivElement;
  let result!: ReturnType<typeof useSpeechVoices>;
  let speechDescriptor: PropertyDescriptor | undefined;
  let availableVoices: SpeechSynthesisVoice[];
  let handlers: EventListener[];
  let speechApi: SpeechSynthesis;

  const Harness = () => {
    result = useSpeechVoices();
    return null;
  };

  beforeEach(() => {
    speechDescriptor = Object.getOwnPropertyDescriptor(
      window,
      'speechSynthesis',
    );
    availableVoices = [];
    handlers = [];
    speechApi = {
      getVoices: () => availableVoices,
      addEventListener: (_type, listener) => {
        handlers.push(listener as EventListener);
      },
      removeEventListener: (_type, listener) => {
        handlers = handlers.filter((handler) => handler !== listener);
      },
    } as unknown as SpeechSynthesis;
    Object.defineProperty(window, 'speechSynthesis', {
      configurable: true,
      value: speechApi,
    });
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
    if (speechDescriptor) {
      Object.defineProperty(window, 'speechSynthesis', speechDescriptor);
    } else {
      Reflect.deleteProperty(window, 'speechSynthesis');
    }
  });

  it('returns only voices matching the requested language', () => {
    availableVoices = [
      { lang: 'en-US', voiceURI: 'english-us' } as SpeechSynthesisVoice,
      { lang: 'fr-FR', voiceURI: 'french' } as SpeechSynthesisVoice,
    ];

    act(() => root.render(React.createElement(Harness)));

    expect(result.voices.map(({ voiceURI }) => voiceURI)).toEqual([
      'english-us',
    ]);
    expect(result.loading).toBe(false);
  });

  it('finishes loading when no matching voices exist and removes its listener', () => {
    act(() => root.render(React.createElement(Harness)));

    expect(result.voices).toEqual([]);
    expect(result.loading).toBe(false);
    expect(handlers).toHaveLength(1);

    act(() => root.unmount());

    expect(handlers).toHaveLength(0);
  });
});
