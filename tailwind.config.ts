import { Config } from "tailwindcss";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        "progress-indeterminate": {
          "0%": { transform: "translateX(-100%)", width: "40%" },
          "50%": { width: "60%" },
          "100%": { transform: "translateX(250%)", width: "40%" },
        },
      },
      animation: {
        "progress-indeterminate": "progress-indeterminate 1.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
