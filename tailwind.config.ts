import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#1a1a1a',
          secondary: '#d4af37',
          accent: '#8b4513',
        },
      },
    },
  },
  plugins: [],
}
export default config
