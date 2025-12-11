import nextConfig from 'eslint-config-next';

const eslintConfig = [
  {
    ignores: [
      'public/',
      'node_modules/',
      '.next/',
      '.github/',
      'dist/',
      '.vscode/',
      '**/*.log',
      '**/*.env*local',
      '**/*.tsbuildinfo',
      '**/*.d.ts',
      'out/',
    ],
  },
  ...nextConfig,
  {
    rules: {
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-wrapper-object-types': 'off',
      '@typescript-eslint/no-this-alias': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      'react/no-unescaped-entities': 'off',
      // Disable new strict react-hooks rules from Next.js 16
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/static-components': 'off',
      'react-hooks/preserve-manual-memoization': 'off',
      'import/no-anonymous-default-export': 'off',
      '@next/next/no-img-element': 'warn',
    },
  },
];

export default eslintConfig;
