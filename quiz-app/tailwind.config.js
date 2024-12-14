/** @type {import('tailwindcss').Config} */
export default {
   content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
   theme: {
      extend: {
         fontFamily: {
            sans: ["InterVariable", "system-ui", "sans-serif"],
         },
         colors: {
            primary: "#003c48",
            secondary: "#4cd8e4",
            background: "#e6f4f1",
            wrong: "#a53d00",
         },
      },
   },
   plugins: [],
};
