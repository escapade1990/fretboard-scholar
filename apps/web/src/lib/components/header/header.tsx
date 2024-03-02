'use client';

import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import React from 'react';
import { SettingsButton } from '../buttons';

const navigation = [
  {
    name: 'Notes',
    description: 'Learn notes on fretboard',
    href: '/',
  },
  {
    name: 'Inspired by',
    description: 'Inspired by',
    href: 'https://www.youtube.com/watch?v=oqK0WrcokpM',
  },
];

export const Header: React.FC = () => {
  const pathName = usePathname();
  const headerText = navigation.find((n) => n.href === pathName)?.description;

  return (
    <>
      <Disclosure as="nav" className="bg-gray-800">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                <div className="flex">
                  <div className="-ml-2 flex">
                    <SettingsButton />
                  </div>
                  <div className="hidden md:block">
                    <div className="ml-5 flex items-baseline space-x-4">
                      {navigation.map((item) => {
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            target={
                              item.href.startsWith('http') ? `_blank` : '_self'
                            }
                            className={clsx(
                              item.href === pathName
                                ? 'bg-gray-900 text-white'
                                : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                              'rounded-md px-3 py-2 text-sm font-medium',
                            )}
                            aria-current={
                              item.href === pathName ? 'page' : undefined
                            }
                          >
                            {item.name}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="-mr-2 flex md:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="md:hidden">
              <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                {navigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as="a"
                    href={item.href}
                    className={clsx(
                      item.href === pathName
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                      'block rounded-md px-3 py-2 text-base font-medium',
                    )}
                    aria-current={item.href === pathName ? 'page' : undefined}
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            {headerText}
          </h1>
        </div>
      </header>
    </>
  );
};
