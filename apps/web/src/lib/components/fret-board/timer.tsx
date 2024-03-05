'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

type Props = { isPlaying: boolean };

export const Timer: React.FC<Props> = ({ isPlaying }) => {
  const [seconds, setSeconds] = useState(0);
  const secondsRef = useRef(seconds);
  const start = useRef<number | null>(null);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    secondsRef.current = seconds;
  }, [seconds]);

  const tick = useCallback((timestamp: number) => {
    if (start.current === null) {
      start.current = timestamp;
    }

    const elapsedSeconds = Math.floor((timestamp - start.current) / 1000);

    if (elapsedSeconds !== secondsRef.current) {
      setSeconds(elapsedSeconds);
    }

    frame.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    if (isPlaying) {
      frame.current = requestAnimationFrame(tick);
    } else {
      if (frame.current) {
        cancelAnimationFrame(frame.current);
      }
      setSeconds(0);
      start.current = null;
    }

    return () => {
      if (frame.current) {
        cancelAnimationFrame(frame.current);
      }
    };
  }, [isPlaying, tick]);

  return (
    <div className="animate-pulse text-2xl">
      {Math.floor(seconds / 60)}:{seconds % 60 < 10 ? '0' : ''}
      {seconds % 60}
    </div>
  );
};

export default Timer;
