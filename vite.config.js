import { defineConfig } from "vite";
import react from "@vitejs/plugin-react"

export default defineConfig({
  root: 'Frontend',
  plugins: [react()],
  base: "/election-app/",
  build:{
    outDir: "../dist",
    rollupOptions:{
      input:{
        admin:"Frontend/admin.html",
        student:"Frontend/student.html"
       }
  }
}
})