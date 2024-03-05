'use client';

import { useAppSelector } from '../../redux';
import React from 'react';
import { fretboardSelectors } from '../../redux/features';
import clsx from 'clsx';
import { usePlayNote } from './use-play-note';
import { PauseCircleIcon, PlayCircleIcon } from '@heroicons/react/24/outline';
import { Note } from '../../models';
import Timer from './timer';
import { FretNumber } from './fret-number';

export const Fretboard: React.FC = () => {
  const fretCount = useAppSelector((state) => state.configuration.fretCount);
  const focusMode = useAppSelector((state) => state.configuration.focusMode);
  const stringToPractice = useAppSelector(
    (state) => state.configuration.stringToPractice,
  );
  const blurFretboard = useAppSelector(
    (state) => state.configuration.blurFretboard,
  );

  const guitarStrings = useAppSelector(
    fretboardSelectors.activeStringsWithNotes,
  );

  const playdNoteStyles = (guitarString: string, note: Note) =>
    isPlaying &&
    oneSecLeft &&
    Number(guitarString) === stringToPractice - 1 &&
    note === currentNote;

  const { isPlaying, currentNote, togglePlay, oneSecLeft } = usePlayNote();

  return (
    <div>
      {/* Fret board */}
      <div className="flex gap-1 rounded-md">
        {guitarStrings[0].map((_, index) => {
          return (
            <FretNumber key={index} className="h-12 w-full">
              {index}
            </FretNumber>
          );
        })}
      </div>
      <ul className="flex flex-col gap-2 rounded-md">
        {Object.entries(guitarStrings).map(([guitarString, notes]) => {
          if (focusMode && Number(guitarString) !== stringToPractice - 1) {
            return null;
          }

          return (
            <li key={`${guitarString}`}>
              <ul
                className={clsx('flex gap-1', {
                  'h-4 sm:h-8 md:h-12': fretCount > 12,
                })}
              >
                {notes.map((note, index) => {
                  const isNotePlayed = playdNoteStyles(guitarString, note);
                  return (
                    <li
                      key={`${guitarString}-${index}-${note.name}`}
                      className={clsx(
                        {
                          'z-10 blur-none': isNotePlayed,
                          'blur-md':
                            blurFretboard &&
                            !playdNoteStyles(guitarString, note),
                          'lg:animate-shake lg:animate-thrice lg:animate-ease-linear':
                            isNotePlayed,
                          'bg-blue-500 text-white': isNotePlayed,
                          'bg-white text-gray-700': !isNotePlayed,
                        },
                        'flex h-12 w-full items-center justify-center rounded-md shadow transition-colors duration-300 hover:blur-none',
                      )}
                    >
                      <span className="text-3xl">{note.name}</span>
                    </li>
                  );
                })}
              </ul>
            </li>
          );
        })}
      </ul>

      <div className="flex gap-1 rounded-md">
        {guitarStrings[0].map((_, index) => {
          return (
            <FretNumber key={index} className="h-12 w-full">
              {index}
            </FretNumber>
          );
        })}
      </div>
      {/* Fret board  end*/}

      <div className="flex flex-col items-center gap-4 pt-8">
        <div className="relative flex flex-col items-center">
          <button
            type="button"
            className="rounded-md text-gray-500 hover:text-gray-900 focus:text-gray-900"
            onClick={togglePlay}
          >
            <span className="absolute -inset-2.5" />
            <span className="sr-only">Start</span>
            {isPlaying ? (
              <PauseCircleIcon className="h-12 w-12" aria-hidden="true" />
            ) : (
              <PlayCircleIcon className="h-12 w-12" aria-hidden="true" />
            )}
          </button>
          {isPlaying && <Timer isPlaying={isPlaying} />}
        </div>
        <div>
          {isPlaying ? (
            <div
              className="animate-fade-right animate-once animate-duration-500 text-9xl"
              key={currentNote?.name}
            >
              {currentNote?.name}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
