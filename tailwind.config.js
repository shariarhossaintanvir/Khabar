/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff4f2',
          100: '#ffe6e1',
          200: '#ffcfc6',
          300: '#ffab9d',
          400: '#ff7b65',
          500: '#ff5a36', // Warm coral
          600: '#ff4d2e', // Primary KHABAR Brand Color (Warm Coral / Red-Orange)
          700: '#e03e22',
          800: '#b83019',
          900: '#942917',
          DEFAULT: '#ff4d2e',
        },
        charcoal: {
          50: '#f6f7f9',
          100: '#eceef2',
          200: '#d5dae2',
          300: '#b1bccb',
          400: '#8696ad',
          500: '#647590',
          600: '#4e5d75',
          700: '#3f4b5e',
          800: '#1f242d', // Secondary deep charcoal
          900: '#16191e', // Darkest charcoal
          DEFAULT: '#16191e',
        },
        surface: {
          warm: '#faf9f5', // Warm cream background
          50: '#ffffff',
          100: '#f8f9fa',
          200: '#f1f3f5',
          300: '#e9ecef',
          400: '#dee2e6',
        },
        ink: {
          DEFAULT: '#16191e',
          light: '#2d3748',
          muted: '#64748b',
          faint: '#94a3b8',
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', '"Inter"', 'system-ui', 'sans-serif'],
        bengali: ['"Hind Siliguri"', '"Noto Sans Bengali"', '"Inter"', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 10px -2px rgba(22, 25, 30, 0.05), 0 1px 4px -1px rgba(22, 25, 30, 0.03)',
        'card-hover': '0 14px 28px -4px rgba(22, 25, 30, 0.1), 0 4px 10px -2px rgba(22, 25, 30, 0.04)',
        'modal': '0 20px 40px -8px rgba(22, 25, 30, 0.25)',
        'brand': '0 8px 20px -4px rgba(255, 77, 46, 0.35)',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
}
