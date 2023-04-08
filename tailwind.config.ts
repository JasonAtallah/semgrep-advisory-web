import { type Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'npm-red': '#CD3534',
        'semgrep-green': '#15BF95',
      },
    },
  },
  plugins: [require('daisyui')],
} satisfies Config;
