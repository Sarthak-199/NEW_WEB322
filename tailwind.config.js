/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './views/**/*.ejs', // Include EJS files in the 'views' directory
    './src/**/*.js',    // Include JavaScript files
    // Add more file paths as needed
  ],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
};
