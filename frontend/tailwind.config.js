/** @type {import('tailwindcss').Config} */
export default {
   content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
   theme: {
      extend: {
         fontFamily: {
            sans: ['InterVariable', 'system-ui', 'sans-serif'],
         },
         colors: {
            primary: '#000000',
            secondary: '#AAAAAA',
            background: '#FFFFFF',
            wrong: '#FF0000',
         },
      },
   },
   plugins: [],
};
