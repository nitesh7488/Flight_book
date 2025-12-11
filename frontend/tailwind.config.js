/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
   extend: {
  animation: {
    "slide-left": "slide-left .35s ease",
    "fade-down": "fade-down .25s ease",
  },
  keyframes: {
    "slide-left": {
      "0%": { transform: "translateX(100%)" },
      "100%": { transform: "translateX(0)" },
    },
    "fade-down": {
      "0%": { transform: "translateY(-6px)", opacity: "0" },
      "100%": { transform: "translateY(0)", opacity: "1" },
    },
  },
}

  },
  plugins: [],
}
