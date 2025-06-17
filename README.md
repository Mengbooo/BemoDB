# BemoDB

[![Powered by VitePress](https://img.shields.io/badge/Powered%20by-VitePress-blue)](https://vitepress.dev/)

这是 Bolaxious 的个人博客和技术文档库，使用 VitePress 构建。用于记录学习笔记、技术思考和一些日常分享。

在线访问: [https://mengbooo.github.io/BemoDB/](https://mengbooo.github.io/BemoDB/)

## 🛠️ 技术栈

- **核心框架**: 使用 [VitePress](https://vitepress.dev/) 作为静态站点生成器。
- **开发语言**: 项目主要使用 TypeScript 提升代码质量和可维护性。
- **包管理器**: 采用 `pnpm` 管理项目依赖。
- **功能扩展**:
  - **归档与标签**：借鉴[这篇文章](https://ivestszheng.github.io/posts/%E5%89%8D%E7%AB%AF/VitePress%20%E5%AE%9E%E7%8E%B0%E5%BD%92%E6%A1%A3%E4%B8%8E%E6%A0%87%E7%AD%BE%E5%88%86%E7%B1%BB)实现了归档和标签功能
  - **数学公式**: 通过 `markdown-it-katex` 支持 LaTeX 公式渲染。
  - **访问分析**: 集成了 Microsoft Clarity 和百度统计，用于分析用户行为和流量。
  - **图片预览**: 使用 `vitepress-plugin-image-viewer` 提供图片预览功能。
  - **RSS 订阅**: 通过 `vitepress-plugin-rss` 自动生成订阅源。
- **响应式设计**: VitePress 默认主题在桌面和移动设备上都有良好的阅读体验。

## 📄 许可

本项目采用 [Apache-2.0](https://opensource.org/licenses/Apache-2.0) 许可。