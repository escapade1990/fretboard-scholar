/** @jest-environment jsdom */
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { useLocalStorageSettings } from './use-local-storage-settings';

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

const keys = {
  fretCount: 'fretboard-scholar-settings__fret-count',
  stringToPractice: 'fretboard-scholar-settings__string-to-practice',
  interval: 'fretboard-scholar-settings__interval',
  blurFretboard: 'fretboard-scholar-settings__blur-fretboard',
  focusMode: 'fretboard-scholar-settings__focus-mode',
  highlightNotesOnAllStrings:
    'fretboard-scholar-settings__highlight-notes-on-all-strings',
  textToSpeech: 'fretboard-scholar-settings__text-to-speech',
  voiceUri: 'fretboard-scholar-settings__voice-uri',
};

describe('useLocalStorageSettings', () => {
  let root: Root;
  let container: HTMLDivElement;
  let settings!: ReturnType<typeof useLocalStorageSettings>;

  const Harness = () => {
    settings = useLocalStorageSettings();
    return null;
  };

  beforeEach(() => {
    window.localStorage.clear();
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    act(() => root.render(React.createElement(Harness)));
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
  });

  it('returns defaults and initializes each established storage key', () => {
    const [, getters] = settings;

    expect(getters.getFretCount()).toBe(12);
    expect(getters.getStringToPractice()).toBe(6);
    expect(getters.getInterval()).toBe(5);
    expect(getters.getBlurFretboard()).toBe(true);
    expect(getters.getFocusMode()).toBe(false);
    expect(getters.getHighlightNotesOnAllStrings()).toBe(true);
    expect(getters.getTextToSpeech()).toBe(false);
    expect(getters.getVoiceUri()).toBeUndefined();

    expect(
      Object.values(keys).map((key) => window.localStorage.getItem(key)),
    ).toEqual(['12', '6', '5', 'true', 'false', 'true', 'false', '']);
  });

  it('reads valid stored numeric, boolean, and raw voice URI values', () => {
    window.localStorage.setItem(keys.fretCount, '18');
    window.localStorage.setItem(keys.stringToPractice, '3');
    window.localStorage.setItem(keys.interval, '7');
    window.localStorage.setItem(keys.blurFretboard, 'false');
    window.localStorage.setItem(keys.focusMode, 'true');
    window.localStorage.setItem(keys.highlightNotesOnAllStrings, 'false');
    window.localStorage.setItem(keys.textToSpeech, 'true');
    window.localStorage.setItem(keys.voiceUri, 'voice:en-US?variant=1');

    const [, getters] = settings;

    expect(getters.getFretCount()).toBe(18);
    expect(getters.getStringToPractice()).toBe(3);
    expect(getters.getInterval()).toBe(7);
    expect(getters.getBlurFretboard()).toBe(false);
    expect(getters.getFocusMode()).toBe(true);
    expect(getters.getHighlightNotesOnAllStrings()).toBe(false);
    expect(getters.getTextToSpeech()).toBe(true);
    expect(getters.getVoiceUri()).toBe('voice:en-US?variant=1');
  });

  it('writes numeric and boolean settings as plain storage values and voice URI raw', () => {
    const [setters] = settings;

    setters.setFretCount(20);
    setters.setStringToPractice(2);
    setters.setInterval(9);
    setters.setBlurFretboard(false);
    setters.setFocusMode(true);
    setters.setHighlightNotesOnAllStrings(false);
    setters.setTextToSpeech(true);
    setters.setVoiceUri('voice:fr-FR?name=Claire');

    expect(
      Object.values(keys).map((key) => window.localStorage.getItem(key)),
    ).toEqual([
      '20',
      '2',
      '9',
      'false',
      'true',
      'false',
      'true',
      'voice:fr-FR?name=Claire',
    ]);
  });

  it('uses defaults for malformed or out-of-range stored settings without deleting them', () => {
    window.localStorage.setItem(keys.fretCount, '{broken');
    window.localStorage.setItem(keys.stringToPractice, '7');
    window.localStorage.setItem(keys.interval, '2');
    window.localStorage.setItem(keys.blurFretboard, '1');

    const [, getters] = settings;

    expect(() => getters.getFretCount()).not.toThrow();
    expect(getters.getFretCount()).toBe(12);
    expect(getters.getStringToPractice()).toBe(6);
    expect(getters.getInterval()).toBe(5);
    expect(getters.getBlurFretboard()).toBe(true);
    expect(window.localStorage.getItem(keys.fretCount)).toBe('{broken');
    expect(window.localStorage.getItem(keys.stringToPractice)).toBe('7');
    expect(window.localStorage.getItem(keys.interval)).toBe('2');
    expect(window.localStorage.getItem(keys.blurFretboard)).toBe('1');
  });

  it('uses defaults and tolerates reads and writes when storage access is denied', () => {
    window.localStorage.setItem(keys.fretCount, '17');
    const descriptor = Object.getOwnPropertyDescriptor(window, 'localStorage');
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      get: () => {
        throw new DOMException('Access denied', 'SecurityError');
      },
    });

    try {
      const [, getters] = settings;
      const [setters] = settings;

      expect(() => {
        expect(getters.getFretCount()).toBe(12);
        expect(getters.getStringToPractice()).toBe(6);
        expect(getters.getInterval()).toBe(5);
        expect(getters.getBlurFretboard()).toBe(true);
        expect(getters.getFocusMode()).toBe(false);
        expect(getters.getHighlightNotesOnAllStrings()).toBe(true);
        expect(getters.getTextToSpeech()).toBe(false);
        expect(getters.getVoiceUri()).toBeUndefined();
        setters.setFretCount(19);
        setters.setVoiceUri('voice:en-GB');
      }).not.toThrow();
    } finally {
      if (descriptor) {
        Object.defineProperty(window, 'localStorage', descriptor);
      } else {
        delete (window as Window & { localStorage?: Storage }).localStorage;
      }
    }

    expect(window.localStorage.getItem(keys.fretCount)).toBe('17');
  });
});
