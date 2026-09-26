import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { spawn } from 'node:child_process'
import path from 'node:path'

let phpProcess = null

function phpBackendPlugin() {
  return {
    name: 'vite-php-backend',
    configureServer(server) {
      if (process.env.VITEST || process.env.NODE_ENV === 'test') {
        return
      }
      if (!phpProcess) {
        const routerPath = path.resolve('api/dev-router.php')
        phpProcess = spawn('php', ['-S', '127.0.0.1:8099', routerPath], {
          stdio: 'ignore',
        })

        const cleanup = () => {
          if (phpProcess) {
            phpProcess.kill()
            phpProcess = null
          }
        }

        process.on('exit', cleanup)
        process.on('SIGINT', cleanup)
        process.on('SIGTERM', cleanup)
        server.httpServer?.on('close', cleanup)
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), phpBackendPlugin()],
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8099',
        changeOrigin: true,
      },
    },
  },
})
