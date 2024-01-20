/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      backgroundImage: () => ({
        bg: "url('/bg.svg')"
      }),
      backgroundPosition: () => ({
        bg: 'center center'
      }),
      backgroundSize: () => ({
        bg: 'cover'
      })
    }
  },
  plugins: []
}
