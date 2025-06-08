import type { Config } from 'tailwindcss';

export default <Config>{
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'dark-900': '#0a0a0a',
        'dark-800': '#161616',
        'dark-700': '#202020',
        'primary': '#e50914',
        'primary-hover': '#f40612',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      }
    }
  }
}