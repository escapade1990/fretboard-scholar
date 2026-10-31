/** @jest-environment jsdom */
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { Provider } from 'react-redux';
import { makeStore } from '../../redux/store';
import { configurationActions } from '../../redux/features';
import { usePlayNote } from './use-play-note';

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

describe('usePlayNote', () => {
  let root: Root;
  let container: HTMLDivElement;
  let hookResult: ReturnType<typeof usePlayNote> | undefined;
  let frames: Map<number, FrameRequestCallback>;
  let canceledFrames: number[];
  let nextFrameId: number;
  let requestDescriptor: PropertyDescriptor | undefined;
  let cancelDescriptor: PropertyDescriptor | undefined;
  let speechDescriptor: PropertyDescriptor | undefined;
  let utteranceDescriptor: PropertyDescriptor | undefined;
  let manuallyUnmounted: boolean;

  const Harness = () => {
    hookResult = usePlayNote();
    return null;
  };

  beforeEach(() => {
    frames = new Map();
    canceledFrames = [];
    nextFrameId = 1;
    requestDescriptor = Object.getOwnPropertyDescriptor(
      window,
      'requestAnimationFrame',
    );
    cancelDescriptor = Object.getOwnPropertyDescriptor(
      window,
      'cancelAnimationFrame',
    );
    speechDescriptor = Object.getOwnPropertyDescriptor(
      window,
      'speechSynthesis',
    );
    utteranceDescriptor = Object.getOwnPropertyDescriptor(
      globalThis,
      'SpeechSynthesisUtterance',
    );
    Object.defineProperty(window, 'requestAnimationFrame', {
      configurable: true,
      value: (callback: FrameRequestCallback) => {
        const id = nextFrameId++;
        frames.set(id, callback);
        return id;
      },
    });
    Object.defineProperty(window, 'cancelAnimationFrame', {
      configurable: true,
      value: (id: number) => {
        canceledFrames.push(id);
        frames.delete(id);
      },
    });

    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    hookResult = undefined;
    manuallyUnmounted = false;
  });

  afterEach(() => {
    if (!manuallyUnmounted) act(() => root.unmount());
    container?.remove();
    if (requestDescriptor) {
      Object.defineProperty(window, 'requestAnimationFrame', requestDescriptor);
    } else {
      Reflect.deleteProperty(window, 'requestAnimationFrame');
    }
    if (cancelDescriptor) {
      Object.defineProperty(window, 'cancelAnimationFrame', cancelDescriptor);
    } else {
      Reflect.deleteProperty(window, 'cancelAnimationFrame');
    }
    if (speechDescriptor) {
      Object.defineProperty(window, 'speechSynthesis', speechDescriptor);
    } else {
      Reflect.deleteProperty(window, 'speechSynthesis');
    }
    if (utteranceDescriptor) {
      Object.defineProperty(
        globalThis,
        'SpeechSynthesisUtterance',
        utteranceDescriptor,
      );
    } else {
      delete (
        globalThis as typeof globalThis & {
          SpeechSynthesisUtterance?: typeof SpeechSynthesisUtterance;
        }
      ).SpeechSynthesisUtterance;
    }
    jest.restoreAllMocks();
  });

  const installSpeechSupport = (voices: SpeechSynthesisVoice[] = []) => {
    const spoken: SpeechSynthesisUtterance[] = [];
    const canceled = jest.fn();
    class MockUtterance {
      text = '';
      voice: SpeechSynthesisVoice | null = null;
    }
    const speechApi = {
      getVoices: () => voices,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      cancel: canceled,
      speak: (utterance: SpeechSynthesisUtterance) => spoken.push(utterance),
    } as unknown as SpeechSynthesis;
    Object.defineProperty(globalThis, 'SpeechSynthesisUtterance', {
      configurable: true,
      value: MockUtterance,
    });
    Object.defineProperty(window, 'speechSynthesis', {
      configurable: true,
      value: speechApi,
    });
    return { speechApi, spoken, canceled };
  };

  it('starts immediately without speech support, schedules one frame, and cancels it on stop', () => {
    expect('speechSynthesis' in window).toBe(false);
    expect('SpeechSynthesisUtterance' in globalThis).toBe(false);

    const store = makeStore({ maxFretCount: 24 });
    expect(() => {
      act(() => {
        root.render(
          React.createElement(
            Provider,
            { store },
            React.createElement(Harness),
          ),
        );
      });
    }).not.toThrow();

    if (!hookResult) return;

    act(() => hookResult?.togglePlay());
    expect(hookResult?.isPlaying).toBe(true);
    expect(hookResult?.currentNote).toBeDefined();
    expect(frames.size).toBe(1);

    const scheduledFrameId = [...frames.keys()][0];
    act(() => hookResult?.togglePlay());

    expect(hookResult?.isPlaying).toBe(false);
    expect(canceledFrames).toContain(scheduledFrameId);
    expect(frames.size).toBe(0);
  });

  it('chooses a later available fret and changes to a distinct note on the next tick', () => {
    installSpeechSupport();
    const store = makeStore({ maxFretCount: 24 });
    store.dispatch(configurationActions.setFretCount(3));
    const random = jest.spyOn(Math, 'random');
    random.mockReturnValueOnce(0.99).mockReturnValueOnce(0);
    let now = 100;
    jest.spyOn(performance, 'now').mockImplementation(() => now);

    act(() => {
      root.render(
        React.createElement(Provider, { store }, React.createElement(Harness)),
      );
    });
    act(() => hookResult?.togglePlay());

    expect(hookResult?.currentNote?.name).toBe('G');
    expect(frames.size).toBe(1);

    const [frameId, callback] = [...frames.entries()][0];
    frames.delete(frameId);
    now = 5_100;
    act(() => callback(now));

    expect(hookResult?.currentNote?.name).toBe('E');
    expect(frames.size).toBe(1);
  });

  it('uses the current string and interval after settings change during playback', () => {
    installSpeechSupport();
    const store = makeStore({ maxFretCount: 24 });
    store.dispatch(configurationActions.setFretCount(3));
    store.dispatch(configurationActions.setStringToPractice(1));
    const random = jest.spyOn(Math, 'random');
    random.mockReturnValueOnce(0.99).mockReturnValueOnce(0);
    let now = 100;
    jest.spyOn(performance, 'now').mockImplementation(() => now);

    act(() => {
      root.render(
        React.createElement(Provider, { store }, React.createElement(Harness)),
      );
    });
    act(() => hookResult?.togglePlay());
    expect(hookResult?.currentNote?.name).toBe('G');

    act(() => {
      store.dispatch(configurationActions.setStringToPractice(2));
      store.dispatch(configurationActions.setInterval(3));
    });
    now = 3_100;
    const queuedFrames = [...frames.entries()];
    const [frameId, callback] = queuedFrames[queuedFrames.length - 1];
    frames.delete(frameId);
    act(() => callback(now));

    expect(hookResult?.currentNote?.name).toBe('B');
  });

  it('advances on schedule when the first animation timestamp is zero', () => {
    installSpeechSupport();
    const store = makeStore({ maxFretCount: 24 });
    store.dispatch(configurationActions.setFretCount(3));
    const random = jest.spyOn(Math, 'random');
    random.mockReturnValueOnce(0.99).mockReturnValueOnce(0);
    let now = 0;
    jest.spyOn(performance, 'now').mockImplementation(() => now);

    act(() => {
      root.render(
        React.createElement(Provider, { store }, React.createElement(Harness)),
      );
    });
    act(() => hookResult?.togglePlay());
    expect(hookResult?.currentNote?.name).toBe('G');

    const [frameId, callback] = [...frames.entries()][0];
    frames.delete(frameId);
    now = 5_000;
    act(() => callback(now));

    expect(hookResult?.currentNote?.name).toBe('E');
  });

  it('uses the selected voice and cancels speech when disabled, paused, and unmounted', () => {
    const selectedVoice = {
      lang: 'en-US',
      voiceURI: 'voice:selected',
      name: 'Selected voice',
    } as SpeechSynthesisVoice;
    const { spoken, canceled } = installSpeechSupport([selectedVoice]);
    const store = makeStore({ maxFretCount: 24 });
    store.dispatch(configurationActions.setFretCount(3));
    store.dispatch(configurationActions.setTextToSpeech(true));
    store.dispatch(configurationActions.setVoiceUri('voice:selected'));
    jest.spyOn(Math, 'random').mockReturnValueOnce(0).mockReturnValueOnce(0.99);

    act(() => {
      root.render(
        React.createElement(Provider, { store }, React.createElement(Harness)),
      );
    });
    act(() => hookResult?.togglePlay());

    expect(spoken).toHaveLength(1);
    expect(spoken[0].voice).toBe(selectedVoice);

    const cancelCountBeforeDisable = canceled.mock.calls.length;
    act(() => store.dispatch(configurationActions.setTextToSpeech(false)));
    expect(canceled.mock.calls.length).toBeGreaterThan(
      cancelCountBeforeDisable,
    );

    const cancelCountBeforePause = canceled.mock.calls.length;
    act(() => hookResult?.togglePlay());
    expect(canceled.mock.calls.length).toBeGreaterThan(cancelCountBeforePause);

    act(() => store.dispatch(configurationActions.setTextToSpeech(true)));
    act(() => hookResult?.togglePlay());
    expect(spoken).toHaveLength(2);

    const cancelCountBeforeUnmount = canceled.mock.calls.length;
    act(() => root.unmount());
    manuallyUnmounted = true;
    expect(canceled.mock.calls.length).toBeGreaterThan(
      cancelCountBeforeUnmount,
    );
  });

  it('falls back to an available voice when configured voice is missing', () => {
    const fallbackVoice = {
      lang: 'en-US',
      voiceURI: 'voice:default',
      name: 'Default voice',
    } as SpeechSynthesisVoice;
    const { spoken } = installSpeechSupport([fallbackVoice]);
    const store = makeStore({ maxFretCount: 24 });
    store.dispatch(configurationActions.setFretCount(3));
    store.dispatch(configurationActions.setTextToSpeech(true));
    store.dispatch(configurationActions.setVoiceUri('voice:missing'));
    jest.spyOn(Math, 'random').mockReturnValue(0);

    act(() => {
      root.render(
        React.createElement(Provider, { store }, React.createElement(Harness)),
      );
    });
    act(() => hookResult?.togglePlay());

    expect(spoken).toHaveLength(1);
    expect(spoken[0].voice).toBe(fallbackVoice);
  });
});
