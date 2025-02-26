import { defineConfig } from "vite";
import react from "@vitejs/plugin-react"

export default defineConfig({
  root: 'Frontend',
  plugins: [react()],
  base: "/",
  build:{
    outDir: "../static",
    rollupOptions:{
      input:{
        admin:"Frontend/admin.html",
        student:"Frontend/student.html"
       }
  }
},

proxy: {
  "/admin": {
    target: "http://localhost:3000/admin",
    changeOrigin: true,
    secure: false,
  },
  "/student": {
    target: "http://localhost:3000/student",
    changeOrigin: true,
    secure: false,
  },
},

})