import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#28245F',
          950: '#141133',
          900: '#1D194B',
          card: '#221E53',
          surface: '#2D2969',
          border: '#3F3983',
          light: '#3E3887',
          lighter: '#5850AE',
        },
        gold: {
          DEFAULT: '#FBAE44',
          light: '#FCCD7B',
          dark: '#E39527',
          glow: 'rgba(251, 174, 68, 0.35)',
          subtle: 'rgba(251, 174, 68, 0.12)',
          border: 'rgba(251, 174, 68, 0.30)',
        },
        cyber: {
          dark: '#141133',
          secondary: '#1D194B',
          card: '#221E53',
          cyan: '#FBAE44',
          blue: '#E39527',
          text: '#ffffff',
          muted: 'rgba(255, 255, 255, 0.72)',
          border: 'rgba(251, 174, 68, 0.30)',
        },
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        glow: '0 0 25px rgba(251, 174, 68, 0.22)',
        'glow-lg': '0 0 40px rgba(251, 174, 68, 0.35)',
        card: '0 20px 50px -10px rgba(10, 8, 30, 0.65)',
      },
      fontFamily: {
        sans: ['Poppins', 'var(--font-poppins)', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        poppins: ['Poppins', 'var(--font-poppins)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
