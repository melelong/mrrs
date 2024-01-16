import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [
    tsconfigPaths() // 解析 tsconfig.json 中的路径映射
  ],
  build: {
    target: 'es2015',
    outDir: 'dist',
    lib: {
      entry: 'src/index.ts',
      formats: ['cjs', 'es', 'umd'], // 输出多种格式
      fileName: (format) => `${format}/index.${format}.js`, // 根据输出格式生成文件名
      name: 'utils'
    },
    rollupOptions: {
      plugins: []
    }
  }
})
