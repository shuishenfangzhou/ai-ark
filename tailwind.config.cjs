/** @type {import('tailwindcss').Config} */
module.exports = {
  // 扫描范围：所有src下的文件
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
  ],
  theme: {
    extend: {
      // 后续可扩展自定义主题（如颜色、字体）
      colors: {
        primary: '#165DFF', // 示例：企业级主色调
        secondary: '#6B7280',
      },
    },
  },
  plugins: [],
};
