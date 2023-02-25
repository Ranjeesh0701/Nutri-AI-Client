import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {
      FOOD_API_KEY:"10f68b5465bc40ea90e691b6b94997cd"
    }
  }
})
