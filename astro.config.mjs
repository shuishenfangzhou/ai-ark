// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  // 集成React和Tailwind
  integrations: [react(), tailwind()],
  // 基础路径（根据部署环境调整，默认/）
  base: '/',
  // 构建输出目录
  outDir: './dist',
  // 开发服务器配置
  server: {
    port: 3000,
    open: true, // 启动时自动打开浏览器
  },
});
