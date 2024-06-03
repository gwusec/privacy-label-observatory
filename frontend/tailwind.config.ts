import type { Config } from 'tailwindcss';
const { nextui } = require('@nextui-org/react');

export default {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'light-gradient': 'linear-gradient(to bottom, #ffffff, #581D8B)',
        'dark-gradient': 'linear-gradient(to bottom, #000000, #581D8B 10%, #000000 80%) ',
      },
    },
  },
  darkMode: 'class',
  plugins: [
    nextui({
      prefix: 'nextui',
      addCommonColors: false,
      defaultTheme: 'light',
      defaultExtendTheme: 'light',
      layout: {},
      themes: {
        light: {
          layout: {
            //light theme layout tokens
          },
          colors: { //light theme colors
            background: 'linear-gradient(to bottom, #ffffff, #581D8B)',
            text: '#000000',
          },
        },
        dark: {
          layout: {
            // dark theme layout tokens
          },
          colors: {
            background: 'linear-gradient(to bottom, #000000 5%, #581D8B, #000000)',
            text: '#ffffff',
          },
        },
      },
    }),
  ],
} satisfies Config;
