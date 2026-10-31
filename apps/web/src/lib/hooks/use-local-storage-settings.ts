import { configurationInitialState } from '../redux/features';

const settingsKeyPrefix = 'fretboard-scholar-settings';
const keys = {
  fretCount: `${settingsKeyPrefix}__fret-count`,
  stringToPractice: `${settingsKeyPrefix}__string-to-practice`,
  interval: `${settingsKeyPrefix}__interval`,
  blurFretboard: `${settingsKeyPrefix}__blur-fretboard`,
  focusMode: `${settingsKeyPrefix}__focus-mode`,
  highlightNotesOnAllStrings: `${settingsKeyPrefix}__highlight-notes-on-all-strings`,
  textToSpeech: `${settingsKeyPrefix}__text-to-speech`,
  voiceUri: `${settingsKeyPrefix}__voice-uri`,
};

function writeSetting(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Storage may be unavailable or denied by the browser.
  }
}

function readSetting<T>(
  key: string,
  defaultValue: T,
  serialize: (value: T) => string,
  parse: (value: string) => T,
): T {
  try {
    const stored = window.localStorage.getItem(key);
    if (stored === null) {
      writeSetting(key, serialize(defaultValue));
      return defaultValue;
    }
    return parse(stored);
  } catch {
    return defaultValue;
  }
}

function jsonSetting<T extends number | boolean>(
  key: string,
  defaultValue: T,
  isValid: (value: unknown) => value is T,
) {
  return {
    set: (value: T) => writeSetting(key, JSON.stringify(value)),
    get: () =>
      readSetting(key, defaultValue, JSON.stringify, (stored) => {
        const value: unknown = JSON.parse(stored);
        return isValid(value) ? value : defaultValue;
      }),
  };
}

const isBoolean = (value: unknown): value is boolean =>
  typeof value === 'boolean';
const isNumberInRange =
  (min: number, max: number, step: number) =>
  (value: unknown): value is number =>
    typeof value === 'number' &&
    Number.isFinite(value) &&
    value >= min &&
    value <= max &&
    Number.isInteger((value - min) / step);

const fretCount = jsonSetting(
  keys.fretCount,
  configurationInitialState.fretCount,
  isNumberInRange(3, 24, 1),
);
const stringToPractice = jsonSetting(
  keys.stringToPractice,
  configurationInitialState.stringToPractice,
  isNumberInRange(1, 6, 1),
);
const interval = jsonSetting(
  keys.interval,
  configurationInitialState.interval,
  isNumberInRange(3, 10, 0.5),
);
const blurFretboard = jsonSetting(
  keys.blurFretboard,
  configurationInitialState.blurFretboard,
  isBoolean,
);
const focusMode = jsonSetting(
  keys.focusMode,
  configurationInitialState.focusMode,
  isBoolean,
);
const highlightNotesOnAllStrings = jsonSetting(
  keys.highlightNotesOnAllStrings,
  configurationInitialState.highlightNotesOnAllStrings,
  isBoolean,
);
const textToSpeech = jsonSetting(
  keys.textToSpeech,
  configurationInitialState.textToSpeech,
  isBoolean,
);

const settings = [
  {
    setFretCount: fretCount.set,
    setStringToPractice: stringToPractice.set,
    setInterval: interval.set,
    setBlurFretboard: blurFretboard.set,
    setFocusMode: focusMode.set,
    setHighlightNotesOnAllStrings: highlightNotesOnAllStrings.set,
    setTextToSpeech: textToSpeech.set,
    setVoiceUri: (value: string) => writeSetting(keys.voiceUri, value),
  },
  {
    getFretCount: fretCount.get,
    getStringToPractice: stringToPractice.get,
    getInterval: interval.get,
    getBlurFretboard: blurFretboard.get,
    getFocusMode: focusMode.get,
    getHighlightNotesOnAllStrings: highlightNotesOnAllStrings.get,
    getTextToSpeech: textToSpeech.get,
    getVoiceUri: () =>
      readSetting(
        keys.voiceUri,
        '',
        (value) => value,
        (value) => value,
      ) || undefined,
  },
] as const;

export const useLocalStorageSettings = () => settings;
