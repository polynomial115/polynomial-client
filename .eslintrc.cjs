module.exports = {
	root: true,
	env: { browser: true, es2020: true },
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended-type-checked',
		'plugin:@typescript-eslint/stylistic-type-checked',
		'plugin:react-hooks/recommended',
		'plugin:react/recommended',
		'plugin:react/jsx-runtime',
		'plugin:prettier/recommended'
	],
	ignorePatterns: ['dist', '.eslintrc.cjs'],
	parser: '@typescript-eslint/parser',
	plugins: ['react-refresh', 'react-compiler'],
	rules: {
		'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
		'@typescript-eslint/no-unused-vars': 'warn',
		'@typescript-eslint/no-floating-promises': 'off',
		'@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: false }],
		'react/jsx-fragments': 'error',
		'react/jsx-no-useless-fragment': 'error',
		'react/destructuring-assignment': 'error',
		'react/self-closing-comp': 'error',
		'react/jsx-curly-brace-presence': 'error',
		'react-compiler/react-compiler': 'error'
	},
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
		project: ['./tsconfig.json', './tsconfig.node.json'],
		tsconfigRootDir: __dirname
	},
	settings: {
		react: {
			version: 'detect'
		}
	}
}
