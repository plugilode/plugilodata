/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace'],
        orbitron: ['Orbitron', 'sans-serif'],
      },
      animation: {
        'matrix-fade': 'matrix-fade 2s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'file-open': 'file-open 1s cubic-bezier(0.4, 0, 0.2, 1)',
        'scroll-down': 'scroll-down 1.5s ease-in-out infinite'
      },
      keyframes: {
        'matrix-fade': {
          '0%, 100%': { opacity: 0.3 },
          '50%': { opacity: 0.6 },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        'file-open': {
          '0%': { 
            transform: 'scale(0.95) rotateX(90deg)',
            opacity: 0 
          },
          '50%': { 
            transform: 'scale(0.95) rotateX(45deg)',
            opacity: 0.5 
          },
          '100%': { 
            transform: 'scale(1) rotateX(0deg)',
            opacity: 1 
          }
        },
        'scroll-down': {
          '0%': { transform: 'translateY(0%)' },
          '100%': { transform: 'translateY(300%)' }
        }
      },
      transformOrigin: {
        'perspective-1000': 'perspective(1000px)',
      },
      translate: {
        'z-96': '24rem',
      },
      rotate: {
        'x-12': 'rotateX(12deg)',
      },
    },
  },
  plugins: [],
};
