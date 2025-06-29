// tailwind.config.ts
import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx,js,jsx}",
    "./src/components/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      // Aquí puedes extender colores, fuentes, etc.
    },
  },
  plugins: [],
}

export default config
