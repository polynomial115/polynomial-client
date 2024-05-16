// vite.config.ts
import { defineConfig } from "file:///D:/Documents/Programming/JavaScript/Polynomial/polynomial-client/node_modules/.pnpm/vite@5.2.10_@types+node@20.12.7/node_modules/vite/dist/node/index.js";
import react from "file:///D:/Documents/Programming/JavaScript/Polynomial/polynomial-client/node_modules/.pnpm/@vitejs+plugin-react-swc@3.6.0_vite@5.2.10_@types+node@20.12.7_/node_modules/@vitejs/plugin-react-swc/index.mjs";
import mkcert from "file:///D:/Documents/Programming/JavaScript/Polynomial/polynomial-client/node_modules/.pnpm/vite-plugin-mkcert@1.17.5_vite@5.2.10_@types+node@20.12.7_/node_modules/vite-plugin-mkcert/dist/mkcert.mjs";
var vite_config_default = defineConfig({
  plugins: [react(), mkcert()],
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:1999",
        changeOrigin: true,
        secure: false,
        ws: true,
        rewrite: (path) => path.replace(/^\/api/, "")
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxEb2N1bWVudHNcXFxcUHJvZ3JhbW1pbmdcXFxcSmF2YVNjcmlwdFxcXFxQb2x5bm9taWFsXFxcXHBvbHlub21pYWwtY2xpZW50XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxEb2N1bWVudHNcXFxcUHJvZ3JhbW1pbmdcXFxcSmF2YVNjcmlwdFxcXFxQb2x5bm9taWFsXFxcXHBvbHlub21pYWwtY2xpZW50XFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9Eb2N1bWVudHMvUHJvZ3JhbW1pbmcvSmF2YVNjcmlwdC9Qb2x5bm9taWFsL3BvbHlub21pYWwtY2xpZW50L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2MnXG5pbXBvcnQgbWtjZXJ0IGZyb20gJ3ZpdGUtcGx1Z2luLW1rY2VydCdcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG5cdHBsdWdpbnM6IFtyZWFjdCgpLCBta2NlcnQoKV0sXG5cdHNlcnZlcjoge1xuXHRcdHByb3h5OiB7XG5cdFx0XHQnL2FwaSc6IHtcblx0XHRcdFx0dGFyZ2V0OiAnaHR0cDovLzEyNy4wLjAuMToxOTk5Jyxcblx0XHRcdFx0Y2hhbmdlT3JpZ2luOiB0cnVlLFxuXHRcdFx0XHRzZWN1cmU6IGZhbHNlLFxuXHRcdFx0XHR3czogdHJ1ZSxcblx0XHRcdFx0cmV3cml0ZTogcGF0aCA9PiBwYXRoLnJlcGxhY2UoL15cXC9hcGkvLCAnJylcblx0XHRcdH1cblx0XHR9XG5cdH1cbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQThYLFNBQVMsb0JBQW9CO0FBQzNaLE9BQU8sV0FBVztBQUNsQixPQUFPLFlBQVk7QUFHbkIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDM0IsU0FBUyxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUM7QUFBQSxFQUMzQixRQUFRO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTixRQUFRO0FBQUEsUUFDUCxRQUFRO0FBQUEsUUFDUixjQUFjO0FBQUEsUUFDZCxRQUFRO0FBQUEsUUFDUixJQUFJO0FBQUEsUUFDSixTQUFTLFVBQVEsS0FBSyxRQUFRLFVBQVUsRUFBRTtBQUFBLE1BQzNDO0FBQUEsSUFDRDtBQUFBLEVBQ0Q7QUFDRCxDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
