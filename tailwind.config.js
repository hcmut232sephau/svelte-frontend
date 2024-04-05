/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    fontFamily: {
      'sans': ['"IBM Plex Sans"', 'ui-sans-serif', 'system-ui'],
      'serif': ['ui-serif'],
      'mono': ['ui-monospace'],
    },
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "dark", "cupcake", "black"],
  },
}

