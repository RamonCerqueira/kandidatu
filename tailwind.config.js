/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: '#142C4E', 50: '#EEF2F8', 100: '#D6E0EE', 600: '#1B3A68', 700: '#142C4E', 900: '#0B1B33' },
        accent: { DEFAULT: '#19A875', 50: '#E8F8F1', 600: '#14905F' },
        gold: { DEFAULT: '#E9B95B', 50: '#FDF6E7' },
        bissau: {
          red: '#CE1126',
          yellow: '#FCD116',
          green: '#009E49',
          star: '#0F172A',
        },
        canvas: '#F6F8FA',
        ink: { DEFAULT: '#182536', muted: '#758195' },
        line: '#E6EBF0',
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      borderRadius: { card: '10px' },
      boxShadow: {
        soft: '0 1px 2px rgba(20,44,78,.04), 0 4px 16px rgba(20,44,78,.06)',
        lift: '0 10px 30px rgba(20,44,78,.14)',
      },
    },
  },
  plugins: [],
}
