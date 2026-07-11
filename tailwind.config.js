/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./*.html', './main.js'],
  theme: {
    extend: {
      colors: {
        coral: {
          50: '#FEF1F3', 100: '#FCDFE3', 200: '#F8BFC8', 300: '#F391A0',
          400: '#EE6278', 500: '#E93551', 600: '#D41735', 700: '#AF132B',
          800: '#8A0F22', 900: '#6E0C1B', 950: '#4A0812'
        },
        turquoise: {
          50: '#F3FBFC', 100: '#E3F5F7', 200: '#C8EBEF', 300: '#A0DDE3',
          400: '#79CFD8', 500: '#52C1CC', 600: '#35AAB5', 700: '#2C8D96',
          800: '#236F76', 900: '#1C595F', 950: '#133B3F'
        },
        lime: {
          50: '#F9FBF3', 100: '#F1F7E4', 200: '#E4EEC8', 300: '#D1E2A1',
          400: '#BDD77A', 500: '#AACB53', 600: '#92B437', 700: '#78952D',
          800: '#5F7524', 900: '#4C5E1D', 950: '#333F13'
        },
        ink: '#2B1A1D',
        'ink-muted': '#6B5A5D'
      },
      fontFamily: {
        heading: ['"Varela Round"', 'sans-serif'],
        body: ['"Nunito Sans"', 'sans-serif']
      },
      boxShadow: {
        'soft-sm': '0 2px 8px rgba(238,98,120,0.08)',
        'soft-md': '0 8px 24px rgba(238,98,120,0.12)',
        'soft-lg': '0 16px 32px rgba(238,98,120,0.16)'
      }
    }
  },
  plugins: []
};
