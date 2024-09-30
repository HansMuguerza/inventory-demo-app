/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	theme: {
		fontFamily: {
			sans: ["Inter", "Roboto", "sans-serif"],
		},
		extend: {},
	},
	plugins: [require("tailwindcss-animate")],
};
