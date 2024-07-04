module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './node_modules/flowbite/**/*.js'],
  theme: {
    extend: {
      colors: {
        primary: '#00acb4',
        secondary: '#058187',
        customBackgroundHome: '#e1e7ef',
      },
    },
  },
  plugins: [require('flowbite/plugin')],
};
