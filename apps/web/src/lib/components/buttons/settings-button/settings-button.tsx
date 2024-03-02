'use client';

import { Cog8ToothIcon } from '@heroicons/react/24/outline';
import React from 'react';
import { Settings } from './settings-slide-over';
import { useAppDispatch } from '../../../redux';
import { configurationActions } from '../../../redux/features';

export const SettingsButton: React.FC = () => {
  const dispatch = useAppDispatch();

  return (
    <>
      <button
        type="button"
        onClick={() => dispatch(configurationActions.setSettingIsOpen(true))}
        className="relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
      >
        <span className="absolute -inset-1.5" />
        <span className="sr-only">View notifications</span>
        <Cog8ToothIcon className="block h-6 w-6" aria-hidden="true" />
      </button>
      <Settings />
    </>
  );
};
