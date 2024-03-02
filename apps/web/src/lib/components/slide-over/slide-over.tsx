import { Dialog, Transition, TransitionChildProps } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import React from 'react';

type Props = React.PropsWithChildren & {
  title: string;
  isOpen: boolean;
  onClose: () => void;
};

const fadeTransition: TransitionChildProps<typeof React.Fragment> = {
  enter: 'ease-in-out duration-500',
  enterFrom: 'opacity-0',
  enterTo: 'opacity-100',
  leave: 'ease-in-out duration-500',
  leaveFrom: 'opacity-100',
  leaveTo: 'opacity-0',
};

const slideTransition: TransitionChildProps<typeof React.Fragment> = {
  enter: 'transform transition ease-in-out duration-500 sm:duration-700',
  enterFrom: '-translate-x-full',
  enterTo: 'translate-x-0',
  leave: 'transform transition ease-in-out duration-500 sm:duration-700',
  leaveFrom: 'translate-x-0',
  leaveTo: '-translate-x-full',
};

export const SlideOver: React.FC<Props> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  return (
    <Transition.Root show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child as={React.Fragment} {...fadeTransition}>
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full">
              <Transition.Child as={React.Fragment} {...slideTransition}>
                <Dialog.Panel className="pointer-events-auto relative w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-auto bg-white py-6 shadow-xl">
                    <div className="flex justify-between px-4 sm:px-6">
                      <Dialog.Title className="text-base font-semibold uppercase leading-6 text-gray-900">
                        {title}
                      </Dialog.Title>
                      <button
                        type="button"
                        className="rounded-md text-gray-300 hover:text-gray-900 focus:text-gray-900"
                        onClick={onClose}
                      >
                        <span className="absolute -inset-2.5" />
                        <span className="sr-only">Close panel</span>
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                    <div className="relative mt-6 flex-1 px-4 sm:px-6">
                      {children}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
