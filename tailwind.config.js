/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Newsreader', 'Fraunces', 'Georgia', 'serif'],
      },
      colors: {
        parchment: {
          DEFAULT: '#F7F5F0',
          deep: '#EFECE4',
          subtle: '#FAF9F6',
        },
        sage: {
          50: '#F2F6F3',
          100: '#E4EDE5',
          200: '#C7DBC9',
          300: '#A5C3A8',
          400: '#7E9D83',
          500: '#5A735E',
          600: '#485D4B',
          700: '#3B4F3E',
          800: '#2C3B2F',
          900: '#1E2820',
        },
        earth: {
          50: '#FAF6F2',
          100: '#F4ECE4',
          200: '#E6D7CB',
          300: '#D2BDAE',
          400: '#BD9E8C',
          500: '#A87C64',
          600: '#8A624D',
          700: '#6C4A38',
        },
        ochre: {
          100: '#F9F4E8',
          200: '#EFE3C6',
          300: '#DECFA8',
          400: '#CDAF77',
          500: '#B89C68',
          600: '#9B7F49',
          700: '#7D6433',
        },
        night: {
          bg: '#151A16',
          surface: '#1E241F',
          card: '#242C25',
          border: '#2E382F',
          muted: '#7A867C',
        }
      },
      boxShadow: {
        'calm': '0 4px 20px -2px rgba(44, 53, 46, 0.05)',
        'calm-lg': '0 10px 30px -4px rgba(44, 53, 46, 0.08)',
        'ios': '0 20px 40px -15px rgba(0, 0, 0, 0.15)',
        'm3': '0 1px 3px 1px rgba(0,0,0,0.15), 0 1px 2px 0 rgba(0,0,0,0.30)',
      },
    },
  },
  plugins: [],
};

