import Theme from "vitepress/theme";
import "./style/var.css";
import imageViewer from "vitepress-plugin-image-viewer";
import vImageViewer from "vitepress-plugin-image-viewer/lib/vImageViewer.vue";
import { useRoute } from "vitepress";

export default {
  ...Theme,
  enhanceApp(ctx) {
    Theme.enhanceApp(ctx);
    // 注册全局组件（可选）
    ctx.app.component("vImageViewer", vImageViewer);
  },
  setup() {
    const route = useRoute();
    // 启用插件
    imageViewer(route);
  },
};
