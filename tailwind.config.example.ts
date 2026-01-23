// tailwind.config.example.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        sigel: {
          primary: '#2C4A3E',
          'primary-dark': '#1F3329',
          'primary-light': '#3D5C4E',
          verified: '#3D5C4E',
          pending: '#F59E0B',
          blocked: '#DC2626',
        },
        checklist: {
          bom: '#19a13d',
          regular: '#F59E0B',
          imprestavel: '#DC2626',
          faltando: '#6B7280',
        },
      },
    },
  },
  plugins: [],
};

export default config;
