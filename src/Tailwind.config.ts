import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Add your custom colors here if needed
      },
      animation: {
        // Add custom animations from tw-animate-css if needed
      },
    },
  },
  plugins: [],
}

export default config