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
        brand: {
          navy: '#272460',
          amber: '#FBAE43',
          ink: '#1A1845',
          ivory: '#F7F4EE',
          sky: '#B9DDEB',
          red: '#EE3944',
        },
        navy: {
          DEFAULT: '#272460',
          950: '#1A1845',
          900: '#1D194B',
          card: '#221E53',
          surface: '#2D2969',
          border: '#3F3983',
          light: '#3E3887',
          lighter: '#5850AE',
        },
        gold: {
          DEFAULT: '#FBAE43',
          light: '#FCCD7B',
          dark: '#E39527',
          glow: 'rgba(251, 174, 67, 0.35)',
          subtle: 'rgba(251, 174, 67, 0.12)',
          border: 'rgba(251, 174, 67, 0.30)',
        },
        cyber: {
          dark: '#1A1845',
          secondary: '#272460',
          card: '#221E53',
          cyan: '#B9DDEB',
          amber: '#FBAE43',
          blue: '#272460',
          text: '#F7F4EE',
          muted: '#B9DDEB',
          border: 'rgba(185, 221, 235, 0.25)',
        },
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        glow: '0 0 25px rgba(251, 174, 67, 0.22)',
        'glow-lg': '0 0 40px rgba(251, 174, 67, 0.35)',
        card: '0 20px 50px -10px rgba(10, 8, 30, 0.65)',
      },
      fontFamily: {
        display: ['Cinzel', 'Georgia', 'serif'],
        sans: ['Manrope', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        manrope: ['Manrope', 'sans-serif'],
        cinzel: ['Cinzel', 'serif'],
      },
    },
  },
  plugins: [],
};

export default config;
