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
        'light-gradient': 'linear-gradient(to bottom, #ffffff, #2b50aa)',
        'dark-gradient': 'linear-gradient(to bottom, #000000, #2b50aa 10%, #000000 80%) ',
      },
      colors: {
        red: '#a31621',
        grey: '#ced3dc'
      }
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
