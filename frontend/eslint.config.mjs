import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import { defineConfig, globalIgnores } from 'eslint/config'
import tseslint from 'typescript-eslint'

const eslintConfig = defineConfig([
    ...nextVitals,
    ...nextTs,
    tseslint.configs.recommended,

    {
        rules: { curly: 'off' },
    },
    {
        files: ['**/*.ts', '**/*.tsx'],
        rules: {
            curly: 'off',
            'no-console': ['warn', { allow: ['warn', 'error'] }],
            'react-hooks/exhaustive-deps': 'off',
            'react-hooks/set-state-in-effect': 'off',
        },
    },

    // Override default ignores of eslint-config-next.
    globalIgnores([
        // Default ignores of eslint-config-next:
        '.next/**',
        'out/**',
        'build/**',
        'next-env.d.ts',
        'design',
    ]),
])

export default eslintConfig
