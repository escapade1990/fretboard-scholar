/** @jest-environment jsdom */
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { Timer } from './timer';

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

describe('Timer', () => {
  let root: Root;
  let container: HTMLDivElement;
  let frames: Map<number, FrameRequestCallback>;
  let canceledFrames: number[];
  let nextFrameId: number;
  let requestDescriptor: PropertyDescriptor | undefined;
  let cancelDescriptor: PropertyDescriptor | undefined;

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
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
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
  });

  const renderTimer = (isPlaying: boolean) =>
    act(() => root.render(React.createElement(Timer, { isPlaying })));

  const advanceFrame = (timestamp: number) => {
    const nextEntry = frames.entries().next().value as
      [number, FrameRequestCallback] | undefined;
    if (!nextEntry) throw new Error('No animation frame is queued');
    frames.delete(nextEntry[0]);
    act(() => nextEntry[1](timestamp));
  };

  it('formats elapsed time as minutes and seconds, then resets and cancels on stop', () => {
    renderTimer(false);
    expect(container.textContent).toBe('0:00');

    renderTimer(true);
    expect(frames.size).toBe(1);
    advanceFrame(1_000);
    advanceFrame(61_000);

    expect(container.textContent).toBe('1:00');
    expect(frames.size).toBe(1);
    const scheduledFrameId = [...frames.keys()][0];

    renderTimer(false);

    expect(container.textContent).toBe('0:00');
    expect(canceledFrames).toContain(scheduledFrameId);
    expect(frames.size).toBe(0);
  });
});
