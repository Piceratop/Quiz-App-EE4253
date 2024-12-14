/** @type {import('tailwindcss').Config} */
export default {
   content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
   theme: {
      extend: {
         fontFamily: {
            sans: ["var(--font-inter)", "system-ui", "sans-serif"],
         },
         colors: {
            primary: {
               50: "#F0F9FF",
               100: "#C9E4FF",
               200: "#99D1FF",
               300: "#66B8FF",
               400: "#4399FF",
               500: "#1A85FF",
               600: "#007BFF",
               700: "#0063D1",
               800: "#0053A5",
               900: "#00417A",
            },
         },
      },
   },
   plugins: [],
};
