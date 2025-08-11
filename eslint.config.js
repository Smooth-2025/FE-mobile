import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { globalIgnores } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import unusedImports from 'eslint-plugin-unused-imports';

export default tseslint.config([
  // 빌드 산출물 무시
  globalIgnores(['dist']),

  // TS/React 파일 대상
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },

    // 협업용 규칙/설정
    plugins: {
      import: importPlugin,
      'jsx-a11y': jsxA11y,
      'unused-imports': unusedImports,
    },
    settings: {
      'import/resolver': {
        typescript: {
          // paths를 쓰면 project 지정 가능
          project: './tsconfig.json',
        },
      },
    },
    rules: {
      /* ===== Import 정리 / 안정성 ===== */
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling', 'index'],
            'object',
            'type',
          ],
          'newlines-between': 'never',
        },
      ],
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',
      'import/no-cycle': ['warn', { maxDepth: 1 }],
      // default export 금지하려면 주석 해제
      // 'import/no-default-export': 'warn',

      /* ===== 미사용 코드 제거 ===== */
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        { vars: 'all', args: 'after-used', argsIgnorePattern: '^_' },
      ],
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',

      /* ===== 타입 import 일관성 ===== */
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', disallowTypeAnnotations: false },
      ],

      /* ===== 안전성/일관성 기본 ===== */
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      curly: ['error', 'all'],
      eqeqeq: ['error', 'always'],

      /* ===== 접근성 기본선 (웹) ===== */
      ...jsxA11y.configs.recommended.rules,
    },
  },
  /* ===== 항상 마지막: Prettier와 충돌하는 ESLint 룰 비활성화 ===== */
  eslintConfigPrettier,
]);
