'use client';

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../redux';
import { configurationActions } from '../../../redux/features';
import { SlideOver } from '../../slide-over';
import {
  useFormatOrdinals,
  useLocalStorageSettings,
  useSpeechVoices,
} from '../../../hooks';
import { Switch } from '../../switch';
import { TextToSpeechList } from './text-to-speech-list';

export const Settings: React.FC = () => {
  const isFirstRender = React.useRef(true);

  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.configuration.settingIsOpen);
  const onClose = () => dispatch(configurationActions.setSettingIsOpen(false));

  const formatOrdinals = useFormatOrdinals();

  const fretCount = useAppSelector((state) => state.configuration.fretCount);
  const stringToPractice = useAppSelector(
    (state) => state.configuration.stringToPractice,
  );
  const interval = useAppSelector((state) => state.configuration.interval);
  const blurFretboard = useAppSelector(
    (state) => state.configuration.blurFretboard,
  );
  const focusMode = useAppSelector((state) => state.configuration.focusMode);
  const highlightNotesOnAllStrings = useAppSelector(
    (state) => state.configuration.highlightNotesOnAllStrings,
  );
  const textToSpeech = useAppSelector(
    (state) => state.configuration.textToSpeech,
  );

  const voiceUri = useAppSelector((state) => state.configuration.voiceUri);

  const ttsIsSupported =
    typeof window !== 'undefined' && 'speechSynthesis' in window;

  const [
    {
      setFretCount,
      setStringToPractice,
      setInterval,
      setBlurFretboard,
      setFocusMode,
      setHighlightNotesOnAllStrings,
      setTextToSpeech,
      setVoiceUri,
    },
  ] = useLocalStorageSettings();

  const { voices, loading: voicesAreLoading } = useSpeechVoices();
  const [selectedVoice, setSelectedVoice] =
    useState<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    if (voicesAreLoading) return;
    const selectedVoice =
      voices.find((voice) => voice.voiceURI === voiceUri) ?? voices[0];

    setSelectedVoice(selectedVoice ?? null);
    setVoiceUri(selectedVoice?.voiceURI ?? '');
  }, [voices, voiceUri, voicesAreLoading, setVoiceUri]);

  return (
    <SlideOver title="Settings" isOpen={isOpen} onClose={onClose}>
      <div className="flex h-full flex-col gap-4">
        <div>
          <div className="relative mb-4">
            <label>
              Fret count ({fretCount})
              <input
                value={fretCount}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  setFretCount(value);
                  dispatch(configurationActions.setFretCount(value));
                }}
                type="range"
                min="3"
                max="24"
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-700"
              />
            </label>
            <span className="absolute left-0 -bottom-6 text-sm ">Min (3)</span>
            <span className="absolute right-0 -bottom-6 text-sm ">
              Max (24)
            </span>
          </div>
        </div>

        <div>
          <label>
            String to practice ({formatOrdinals(Number(stringToPractice))})
            <input
              value={stringToPractice}
              onChange={(e) => {
                const value = Number(e.target.value);
                setStringToPractice(value);
                dispatch(configurationActions.setStringToPractice(value));
              }}
              type="range"
              min="1"
              max="6"
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-700"
            />
          </label>
        </div>
        <div>
          <label>
            Interval ({Number(interval)} sec)
            <input
              value={interval}
              onChange={(e) => {
                const value = Number(e.target.value);
                setInterval(value);
                dispatch(configurationActions.setInterval(value));
              }}
              type="range"
              min="3"
              max="10"
              step="0.5"
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-700"
            />
          </label>
        </div>

        <div className="flex items-center justify-between gap-4">
          <span>Blur fretboard</span>
          <Switch
            enabled={blurFretboard}
            setEnabled={(value) => {
              setBlurFretboard(value);
              dispatch(configurationActions.setBlurFretBoard(value));
            }}
          />
        </div>
        <div className="flex items-center justify-between gap-4">
          <span>Focus on single string</span>
          <Switch
            enabled={focusMode}
            setEnabled={(value) => {
              setFocusMode(value);
              dispatch(configurationActions.setFocusMode(value));
            }}
          />
        </div>
        <div className="flex items-center justify-between gap-4">
          <span>Show notes on all strings</span>
          <Switch
            enabled={highlightNotesOnAllStrings}
            setEnabled={(value) => {
              setHighlightNotesOnAllStrings(value);
              dispatch(
                configurationActions.setHighlightNotesOnAllStrings(value),
              );
            }}
          />
        </div>
        {ttsIsSupported && !voicesAreLoading && (
          <>
            <div className="flex items-center justify-between gap-4">
              <span>Use text-to-speach</span>
              <Switch
                enabled={textToSpeech}
                setEnabled={(value) => {
                  setTextToSpeech(value);
                  dispatch(configurationActions.setTextToSpeech(value));
                }}
              />
            </div>
            {textToSpeech && (
              <div className="flex items-center justify-between gap-4">
                <span>Voice</span>
                <TextToSpeechList
                  className="h-8 w-2/3"
                  selected={selectedVoice}
                  voices={voices}
                  onVoiceSelect={(voice) => {
                    setVoiceUri(voice?.voiceURI ?? '');
                    dispatch(configurationActions.setVoiceUri(voice?.voiceURI));
                  }}
                />
              </div>
            )}
          </>
        )}
      </div>
    </SlideOver>
  );
};
