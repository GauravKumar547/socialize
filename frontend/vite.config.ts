import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
            '@/components': resolve(__dirname, 'src/components'),
            '@/pages': resolve(__dirname, 'src/pages'),
            '@/context': resolve(__dirname, 'src/context'),
            '@/network': resolve(__dirname, 'src/network'),
            '@/types': resolve(__dirname, 'src/types'),
            '@/utils': resolve(__dirname, 'src/utils'),
            '@/assets': resolve(__dirname, 'src/assets'),
        }
    },
    server: {
        port: 5173,
        open: true
    },
    build: {
        target: 'es2024',
        sourcemap: true,
        rollupOptions: {
            output: {
                manualChunks: {
                    react: ['react', 'react-dom'],
                    mui: ['@mui/material', '@mui/icons-material'],
                    firebase: ['firebase/app', 'firebase/storage', 'firebase/analytics'],
                    router: ['react-router-dom'],
                    socket: ['socket.io-client']
                }
            }
        }
    }
}) 