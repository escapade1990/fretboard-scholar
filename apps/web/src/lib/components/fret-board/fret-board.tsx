import { useAppSelector } from '../../redux';
import React from 'react';
import { fretboardSelectors } from '../../redux/features';
import clsx from 'clsx';
import { usePlayNote } from './use-play-note';
import { PauseCircleIcon, PlayCircleIcon } from '@heroicons/react/24/outline';
import { Note } from '../../models';

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
    <>
      <ul className="flex flex-col gap-1">
        {Object.entries(guitarStrings).map(([guitarString, notes]) => {
          // If focusMode is true and the current string is not the stringToPractice, return null
          if (focusMode && Number(guitarString) !== stringToPractice - 1) {
            return null;
          }

          return (
            <li key={`${guitarString}`}>
              <ul
                className={clsx('flex h-12 gap-1 sm:h-16 md:h-20', {
                  'h-4 sm:h-8 md:h-12': fretCount > 12,
                })}
              >
                {notes.map((note, index) => {
                  return (
                    <li
                      key={`${guitarString}-${index}-${note.name}`}
                      className={clsx(
                        {
                          'blur-none': playdNoteStyles(guitarString, note),
                          'blur-md':
                            blurFretboard &&
                            !playdNoteStyles(guitarString, note),
                          'basis-4 sm:basis-8 md:basis-12': fretCount > 12,
                          'lg:animate-shake lg:animate-thrice lg:animate-ease-linear':
                            playdNoteStyles(guitarString, note),
                        },
                        'flex shrink-0 flex-grow basis-4 items-center justify-center rounded-md bg-white shadow hover:blur-none sm:basis-8 md:basis-12',
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
      <div className="flex gap-1 pt-4">
        {guitarStrings[0].map((_, index) => {
          return (
            <span
              key={index}
              className="flex shrink-0 flex-grow basis-4 items-center justify-center text-xl hover:blur-none sm:basis-8 md:basis-12"
            >
              {index}
            </span>
          );
        })}
      </div>
      <div className="flex flex-col items-center gap-4 pt-8">
        <div className="relative">
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
    </>
  );
};
