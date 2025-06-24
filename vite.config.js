import { defineConfig } from 'vite'

export default defineConfig({
    server: {
        middlewareMode: false,
        fs: {
            allow: ['.']
        }
    }
}) 