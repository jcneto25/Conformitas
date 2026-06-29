/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{ts,html}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: { DEFAULT: '#1a3a5c', light: '#2d5a8e', dark: '#0f2440' },
        accent: '#c9a84c',
        surface: '#ffffff',
        background: '#f4f5f7',
        'text-main': '#1a1a2e',
        'text-sec': '#5a6a7e',
        border: '#d0d5dd',
        divider: '#eaecf0',
        success: '#16a34a',
        critical: '#dc2626',
        warning: '#d97706',
        info: '#2563eb',
        'success-bg': '#dcfce7',
        'critical-bg': '#fee2e2',
        'warning-bg': '#fef3c7',
        'info-bg': '#dbeafe',
      },
    },
  },
  plugins: [],
};
