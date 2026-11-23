/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#070b14',
          900: '#0d1527',
          850: '#111b33',
          800: '#162244',
          700: '#1e2e5c',
        },
        patient: {
          DEFAULT: '#10b981',
          light: '#ecfdf5',
          dark: '#059669',
          hover: '#047857'
        },
        doctor: {
          DEFAULT: '#2563eb',
          light: '#eff6ff',
          dark: '#1d4ed8',
          hover: '#1e40af'
        },
        admin: {
          DEFAULT: '#7c3aed',
          light: '#f5f3ff',
          dark: '#6d28d9',
          hover: '#5b21b6'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
        'premium': '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.03)',
      }
    },
  },
  plugins: [],
}

