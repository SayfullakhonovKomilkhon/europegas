/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0056b3', // Professional blue for automotive industry
          light: '#3378c5',
          dark: '#003d7a',
        },
        secondary: {
          DEFAULT: '#e63946', // Accent red for call-to-action elements
          light: '#ff5a67',
          dark: '#c01e2b',
        },
        neutral: {
          DEFAULT: '#f8f9fa',
          dark: '#343a40',
        }
      },
      fontFamily: {
        sans: ['Roboto', 'Arial', 'sans-serif'],
        heading: ['Montserrat', 'Helvetica', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 6px rgba(0, 0, 0, 0.1)',
        'hover': '0 10px 15px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [],
} 