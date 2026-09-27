/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          950: '#09090B',
          900: '#0F0F11',
          800: '#18181C',
          700: '#24242B',
          600: '#32323B',
        },
        gold: {
          400: '#F3E5AB',
          500: '#D4AF37',
          600: '#B8860B',
          700: '#996515',
        },
        parchment: {
          50: '#FBF9F5',
          100: '#F5F2EB',
          200: '#EFECE6',
          300: '#E2DDD3',
          400: '#C8C2B5',
        },
        patriot: {
          saffron: '#E67E22',
          white: '#F5F5F5',
          green: '#27AE60',
          crimson: '#8B0000',
        }
      },
      fontFamily: {
        serif: ['Cinzel', 'Georgia', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'grain-pattern': "url('https://transparenttextures.com/patterns/dark-denim.png')",
        'paper-texture': "url('https://transparenttextures.com/patterns/paper-fibers.png')",
      }
    },
  },
  plugins: [],
}
