import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import eslintPluginUnicorn from 'eslint-plugin-unicorn'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

export default tseslint.config(
    {ignores: ['dist']},
    {
        extends: [js.configs.recommended, eslintPluginPrettierRecommended, ...tseslint.configs.recommended],
        files: ['**/*.{ts,js}'],
        languageOptions: {
            ecmaVersion: 2022,
            globals: globals.node,
        },
        linterOptions: {
            noInlineConfig: true,
        },
        parserOptions: {
            project: './tsconfig.json'
        },
        plugins: {
            unicorn: eslintPluginUnicorn,
        },
        rules: {
            'max-lines-per-function': ['error', {max: 120, skipComments: true, skipBlankLines: true}],
            '@typescript-eslint/no-magic-numbers': ['error', {ignore: [0, 1, -1], ignoreReadonlyClassProperties: true}],
            'no-magic-strings': 'off',
            '@typescript-eslint/no-floating-promises': 'error',
            '@typescript-eslint/no-unused-vars': ['error', {caughtErrorsIgnorePattern: '^_'}],
            '@typescript-eslint/consistent-type-imports': 'error',
            '@typescript-eslint/explicit-function-return-type': 'error',
            '@typescript-eslint/consistent-type-assertions': ['error', {assertionStyle: 'never'}],
            '@typescript-eslint/explicit-member-accessibility': [
                'error',
                {accessibility: 'explicit', overrides: {constructors: 'off'}},
            ],
            '@typescript-eslint/member-ordering': 'error',
            '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
            'unicorn/no-array-callback-reference': 'off',
            'unicorn/no-array-for-each': 'off',
            'unicorn/no-array-reduce': 'off',
            'unicorn/no-null': 'off',
            'unicorn/number-literal-case': 'off',
            'unicorn/numeric-separators-style': 'off',
            'unicorn/prevent-abbreviations': 'off',
            'padding-line-between-statements': [
                'error',
                {blankLine: 'always', prev: 'import', next: 'function'},
                {blankLine: 'always', prev: 'import', next: 'class'},
                {blankLine: 'always', prev: 'import', next: 'export'},
                {blankLine: 'always', prev: 'import', next: 'const'},
            ],
        },
    },
    {
        files: ['**/*.test.{ts}'],
        rules: {
            '@typescript-eslint/consistent-type-assertions': 'off',
            '@typescript-eslint/no-magic-numbers': 'off',
        },
    }
)
