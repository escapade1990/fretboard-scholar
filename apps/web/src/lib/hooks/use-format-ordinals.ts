import React from 'react';

const pluralRules = new Intl.PluralRules('en-US', { type: 'ordinal' });
const suffixes = new Map([
  ['one', 'st'],
  ['two', 'nd'],
  ['few', 'rd'],
  ['other', 'th'],
]);

export const useFormatOrdinals = () => {
  const formatOrdinals = React.useCallback((n: number) => {
    const rule = pluralRules.select(n);
    const suffix = suffixes.get(rule);
    return `${n}${suffix}`;
  }, []);

  return formatOrdinals;
};
