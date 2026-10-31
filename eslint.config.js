const nx = require('@nx/eslint-plugin');
const next = require('eslint-config-next/core-web-vitals');

module.exports = [
  { ignores: ['**/.next/**', '**/out/**', '**/dist/**', '**/node_modules/**'] },
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  ...nx.configs['flat/react-typescript'],
  ...next,
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    rules: {
      // Keep newly introduced compiler diagnostics visible while preserving the prior lint gate.
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/refs': 'warn',
      'react-hooks/immutability': 'warn',
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: [],
          depConstraints: [{ sourceTag: '*', onlyDependOnLibsWithTags: ['*'] }],
        },
      ],
      '@next/next/no-html-link-for-pages': ['error', 'apps/web/pages'],
    },
  },
];
