module.exports = {
	"env": {
		"browser": true,
		"es6": true,
		"node": true,
	},
	"extends": [
		"eslint:recommended",
		"plugin:vue/essential",
	],
	"parserOptions": {
		"ecmaVersion": 2018,
		"sourceType": "module",
		"parser": "babel-eslint",
	},
	"plugins": [
		"vue",
	],
	"root": true,
	"rules": {
		"comma-dangle": [
			"error",
			"always-multiline",
		],
		"eol-last": [
			"error",
			"always",
		],
		"indent": [
			"error",
			"tab",
		],
		"linebreak-style": [
			"error",
			"unix",
		],
		"no-console": [
			"error",
		],
		"no-debugger": [
			"error",
		],
		"no-trailing-spaces": [
			"error",
		],
		"quotes": [
			"error",
			"double",
		],
		"semi": [
			"error",
			"always",
		],
		"space-before-function-paren": [
			"error",
			"never",
		],
		"vue/attribute-hyphenation": [
			"off",
		],
	},
};
