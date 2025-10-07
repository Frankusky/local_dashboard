import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    tsconfigPaths(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff,woff2,ttf}"],
        // IMPORTANTE: Cachear la ruta principal
        runtimeCaching: [
          {
            // Para tu propia app - usa NetworkFirst
            urlPattern: /\.(html|css|js|json)$/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "app-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
              networkTimeoutSeconds: 3, // Timeout corto para fallback rápido
            },
          },
          {
            // Para la ruta principal de tu app
            urlPattern: /\/.*/i, // Todas las rutas de tu dominio
            handler: "NetworkFirst",
            options: {
              cacheName: "pages-cache",
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
              networkTimeoutSeconds: 3,
            },
          },
          {
            // Assets estáticos (siempre desde cache si están disponibles)
            urlPattern: /\.(png|jpg|jpeg|svg|ico|woff|woff2|ttf)$/i,
            handler: "CacheFirst",
            options: {
              cacheName: "static-assets",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
            },
          },
          {
            urlPattern: /^https:\/\/unpkg\.com\/.*\.(woff2|woff|ttf)/i,
            handler: "CacheFirst",
            options: {
              cacheName: "primeicons-fonts",
              expiration: {
                maxEntries: 5,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
            },
          },
        ],
      },
    }),
  ],
});
