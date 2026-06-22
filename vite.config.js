import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
<<<<<<< HEAD
// https://vitejs.dev/config/
=======

>>>>>>> 5d73c961b8b00a97ccf6a031ed7db878f06aa342
export default defineConfig({
    plugins: [react()],
    optimizeDeps: {
        exclude: ['lucide-react'],
    },
});
