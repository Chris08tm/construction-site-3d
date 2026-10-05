export default {content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        paper: '#F5F4EF',
        ink: '#0E1A2B',
        muted: '#5B6675',
        line: '#DAD8D0',
        accent: '#D9622B',
        blueprint: {
          DEFAULT: '#1B4C93',
          deep: '#0B2650',
          mid: '#163E7A',
          light: '#CFE0FA',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
};
