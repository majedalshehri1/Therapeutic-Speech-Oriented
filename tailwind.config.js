/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				primaryColor: '#1EB9D2',
				secondaryColor: '#E5F3F6',
				backgroundColor: '#F0F6F9'
			}
		}
	},
	plugins: []
};
