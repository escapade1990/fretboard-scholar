import React from 'react';
import { Switch as HeadlessSwitch } from '@headlessui/react';

type Props = {
  enabled: boolean;
  setEnabled: (checked: boolean) => void;
};

export const Switch: React.FC<Props> = ({ enabled, setEnabled }) => {
  return (
    <HeadlessSwitch
      checked={enabled}
      onChange={setEnabled}
      className={`${enabled ? 'bg-gray-800' : 'bg-gray-300'}
          relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out`}
    >
      <span className="sr-only">Use setting</span>
      <span
        aria-hidden="true"
        className={`${enabled ? 'translate-x-5' : 'translate-x-0'}
            pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
      />
    </HeadlessSwitch>
  );
};
