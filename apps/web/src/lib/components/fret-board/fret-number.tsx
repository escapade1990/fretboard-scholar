import clsx from 'clsx';
import React from 'react';

type Props = React.PropsWithChildren & {
  className?: string | Parameters<typeof clsx>[0];
};

export const FretNumber: React.FC<Props> = ({ className, children }) => (
  <span
    className={clsx(
      'flex items-center justify-center text-xl text-gray-800 hover:blur-none',
      className,
    )}
  >
    {children}
  </span>
);
