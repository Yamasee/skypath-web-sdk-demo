/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        light: "0 0 10px 0 rgba(0,0,0,.25)",
        dark: "0 0 4px 0 rgba(0,0,0,.4)",
        darkest: "0 0 2px 0 hsla(0,0%,9%,.35)",
      },
    },
  },
  plugins: [import("@tailwindcss/forms")],
};

export default config;