/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				primary: '#81A5C3',
				'primary-focus': '#91B5D3',
				'primary-back': '#B1D5F3',
				'primary-text': '#677384'
			}
		}
	},
	plugins: []
};
