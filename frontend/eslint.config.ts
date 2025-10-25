import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';

export default [
    {
        ignores: ["dist", "build", "node_modules", "public", "**/*.d.ts"]
    },
    {
        files: ["**/*.{js,jsx,ts,tsx}"],
        languageOptions: {
            ecmaVersion: 2020,
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.es2020,
            },
            parser: tsparser,
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
                ecmaFeatures: {
                    jsx: true,
                },
                project: ["./tsconfig.json"],
                tsconfigRootDir: import.meta.dirname,
            },
        },
        plugins: {
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
            '@typescript-eslint': tseslint,
        },
        rules: {
            ...js.configs.recommended.rules,
            ...reactHooks.configs.recommended.rules,
            'react-refresh/only-export-components': [
                'warn',
                { allowConstantExport: true },
            ],
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    "argsIgnorePattern": "^_",
                    "varsIgnorePattern": "^_",
                    "ignoreRestSiblings": true
                }
            ],
            "@typescript-eslint/explicit-function-return-type": "off",
            "@typescript-eslint/explicit-module-boundary-types": "off",
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/no-non-null-assertion": "warn",
            "@typescript-eslint/prefer-const": "error",
            "@typescript-eslint/no-var-requires": "off",
            "@typescript-eslint/ban-ts-comment": "warn",
            "@typescript-eslint/no-empty-function": "warn",
            "@typescript-eslint/consistent-type-imports": "error",
            "@typescript-eslint/no-inferrable-types": "error",
            "prefer-const": "error",
            "no-var": "error",
            "no-console": ["warn", { "allow": ["warn", "error", "info"] }],
            "no-debugger": "warn",
            "no-duplicate-imports": "error",
            "no-unused-expressions": "error",
            "no-unused-labels": "error",
            "no-undef": "off",
            "no-unreachable": "error",
            "eqeqeq": ["error", "always"],
            "curly": ["error", "all"],
            "dot-notation": "error",
            "no-eval": "error",
            "no-implied-eval": "error",
            "no-new-func": "error",
            "no-script-url": "error",
            "no-self-compare": "error",
            "no-sequences": "error",
            "no-throw-literal": "error",
            "no-useless-call": "error",
            "no-useless-concat": "error",
            "no-useless-return": "error",
            "radix": "error",
            "yoda": "error",
            "camelcase": ["error", { "properties": "never" }],
            "consistent-this": ["error", "self"],
            "func-style": ["error", "declaration", { "allowArrowFunctions": true }],
            "max-depth": ["error", 4],
            "max-len": ["error", { "code": 120, "ignoreUrls": true }],
            "max-lines": ["error", { "max": 500, "skipBlankLines": true, "skipComments": true }],
            "max-params": ["error", 5],
            "new-cap": "error",
            "no-array-constructor": "error",
            "no-bitwise": "error",
            "no-lonely-if": "error",
            "no-mixed-operators": "error",
            "no-multi-assign": "error",
            "no-multiple-empty-lines": ["error", { "max": 2, "maxBOF": 0, "maxEOF": 1 }],
            "no-nested-ternary": "error",
            "no-new-object": "error",
            "no-trailing-spaces": "error",
            "no-unneeded-ternary": "error",
            "no-whitespace-before-property": "error",
            "object-curly-spacing": ["error", "always"],
            "operator-assignment": ["error", "always"],
            "operator-linebreak": ["error", "before"],
            "padded-blocks": ["error", "never"],
            "prefer-object-spread": "error",
            "quote-props": ["error", "as-needed"],
            "quotes": ["error", "single", { "avoidEscape": true }],
            "semi": ["error", "always"],
            "semi-spacing": "error",
            "space-before-blocks": "error",
            "space-before-function-paren": ["error", { "anonymous": "always", "named": "never", "asyncArrow": "always" }],
            "space-in-parens": ["error", "never"],
            "space-infix-ops": "error",
            "space-unary-ops": "error",
            "spaced-comment": ["error", "always"],
            "switch-colon-spacing": "error",
            "template-tag-spacing": "error",
            "unicode-bom": ["error", "never"],
            "arrow-body-style": ["error", "as-needed"],
            "arrow-parens": ["error", "always"],
            "arrow-spacing": "error",
            "constructor-super": "error",
            "generator-star-spacing": ["error", { "before": false, "after": true }],
            "no-class-assign": "error",
            "no-confusing-arrow": "error",
            "no-const-assign": "error",
            "no-dupe-class-members": "error",
            "no-new-symbol": "error",
            "no-this-before-super": "error",
            "no-useless-computed-key": "error",
            "no-useless-constructor": "error",
            "no-useless-rename": "error",
            "object-shorthand": "error",
            "prefer-arrow-callback": "error",
            "prefer-destructuring": ["error", { "object": true, "array": false }],
            "prefer-numeric-literals": "error",
            "prefer-rest-params": "error",
            "prefer-spread": "error",
            "prefer-template": "error",
            "rest-spread-spacing": ["error", "never"],
            "sort-imports": ["error", { "ignoreDeclarationSort": true }],
            "symbol-description": "error",
            "template-curly-spacing": "error",
            "yield-star-spacing": ["error", "after"]
        },
    },
    {
        files: ["**/context/**/*.{ts,tsx}"],
        rules: {
            "@typescript-eslint/no-explicit-any": "off"
        }
    },
    {
        files: ["**/*.d.ts"],
        rules: {
            "@typescript-eslint/no-explicit-any": "off"
        }
    }
]; 