/** @type {import('tailwindcss').Config} */

const { heroui } = require("@heroui/react");
module.exports = {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
		"./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
	],
	theme: {
		extend: {
			fontFamily: {
				noto: ['var(--font-noto-jp)'], 
				yellow: ["var(--font-yellowtail)"] 
			},
			typography: {
				DEFAULT: {
					css: {
						maxWidth: '100ch'
					}
				}
			},
		}
	},
	plugins: [
		require('@tailwindcss/typography'),
		require("tailwindcss-animate"),
		heroui(),
	],
};
