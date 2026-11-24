import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: './schema.json',
  documents: ['modules/**/*.{ts,tsx,js,jsx}', 'pages/**/*.{ts,tsx,js,jsx}'],
  generates: {
    'modules/apollo/generated.ts': {
      plugins: ['typescript-operations'],
      config: {
        avoidOptionals: false,
        nonOptionalTypename: true,
        enumsAsTypes: true,
        scalars: {
          DateTimeISO: 'string',
          Date: 'string',
          Timestamp: 'number',
          JSON: 'any',
          LowerCaseString: 'string',
          Locale: 'string',
        },
      },
    },
  },
};

export default config;
