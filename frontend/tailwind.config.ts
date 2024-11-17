import type { Config } from 'tailwindcss';
const { nextui } = require('@nextui-org/react');

const colors = require('tailwindcss/colors')


export default {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      backgroundImage: {
        'light-gradient': 'linear-gradient(to bottom, #ffffff 40%, #5A5A5A)',
        'dark-gradient': 'linear-gradient(to bottom, #000000 50%, #5A5A5A) ',
      },
      colors: {
        ...colors,
        red: '#000000',
        grey: '#5A5A5A',
        dred: '#ffffff',
        blue: '#0047AB'
      }
    },
  },
  darkMode: 'class',
  plugins: [
    require('flowbite/plugin'),
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
            background: '#ffffff',
            text: '#000000',
          },
        },
        dark: {
          layout: {
            // dark theme layout tokens
          },
          colors: {
            background: '#000000',
            text: '#ffffff',
          },
        },
      },
    }),
  ],
} satisfies Config;
 