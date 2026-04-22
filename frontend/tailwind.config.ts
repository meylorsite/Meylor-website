import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#003A83',
          dark: '#002A63',
          light: '#004DA3',
        },
        accent: {
          DEFAULT: '#01A9E4',
          light: '#33BBE9',
          dark: '#0087B8',
        },
        amber: {
          DEFAULT: '#FFBF00',
          light: '#FFD24D',
        },
        danger: {
          DEFAULT: '#FF2B01',
          light: '#FF5533',
        },
        success: {
          DEFAULT: '#007F44',
          light: '#009F55',
        },
      },
      fontFamily: {
        sans: ['var(--font-alexandria)', 'system-ui', 'sans-serif'],
        arabic: ['var(--font-alexandria)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'blob': 'blob 7s infinite',
        'ken-burns': 'kenBurns 20s ease-in-out infinite alternate',
        'drift': 'drift 12s ease-in-out infinite',
        'drift-slow': 'driftSlow 15s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        kenBurns: {
          '0%': { transform: 'scale(1) translate(0, 0)' },
          '100%': { transform: 'scale(1.08) translate(-1%, -1%)' },
        },
        drift: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '25%': { transform: 'translate(30px, -25px)' },
          '50%': { transform: 'translate(-15px, 15px)' },
          '75%': { transform: 'translate(20px, 10px)' },
        },
        driftSlow: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '33%': { transform: 'translate(-25px, 20px)' },
          '66%': { transform: 'translate(15px, -15px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
