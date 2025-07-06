---
title: FEE#009 - build | 构建应用
date: "2025-07-06"
tags:
  - Front-end engineering
---

# FEE#009 - build | 构建应用

在现代前端开发中，我们编写的代码（例如 JSX、TypeScript、Sass、ESNext 语法）往往无法直接在浏览器中运行。我们需要一个"构建"（Build）过程，将其转换为浏览器可以理解的静态资源（HTML、CSS、JavaScript）。构建工具就是自动化完成这个过程的"魔法师"。

多年来，`Webpack` 一直是这个领域的霸主，以其无与伦比的灵活性和强大的生态系统定义了前端工程化的标准。然而，随着项目规模的增长，`Webpack` 带来的开发体验问题——尤其是漫长的启动和热更新时间——也日益凸显。

正是在这个背景下，`Vite` 横空出世。它以一种全新的思路，极大地改善了开发体验，迅速成为前端社区的新宠。我们将分析它们的设计理念、工作方式和适用场景。

## Webpack：万物皆可模块的"集大成者"

`Webpack` 是一个静态模块打包器（Static Module Bundler）。它的核心哲学是：**在你的项目中，一切皆为模块**。不仅仅是 JavaScript 文件，CSS、图片、字体等所有资源都可以被视为模块。`Webpack` 从一个或多个入口文件（entry point）开始，递归地构建一个"依赖图"（Dependency Graph），这个图包含了项目中所有模块及其之间的依赖关系，然后将它们打包成一个或多个浏览器可用的静态资源（bundle）。

### 核心概念

理解 `Webpack` 需要掌握其四大核心概念：

1.  **入口（Entry）**: `Webpack` 从哪个文件开始构建其内部的依赖图。
2.  **出口（Output）**: `Webpack` 将打包好的资源（bundles）输出到哪里，以及如何命名这些文件。
3.  **加载器（Loader）**: `Webpack` 本身只理解 JavaScript 和 JSON 文件。**Loader** 让 `Webpack` 能够去处理其他类型的文件，并将它们转换为有效的模块，以供应用程序使用，以及被添加到依赖图中。例如，`babel-loader` 可以将 ES6+ 代码转换为 ES5，`css-loader` 可以让 `import './style.css'` 语法在 JavaScript 中生效。
4.  **插件（Plugin）**: 插件是 `Webpack` 的支柱。Loader 用于转换特定类型的模块，而插件则可以执行范围更广的任务，从打包优化和压缩，到重新定义环境变量，功能极其强大。例如，`HtmlWebpackPlugin` 可以自动生成一个 HTML 文件并引入打包好的 JS，`TerserWebpackPlugin` 可以压缩 JavaScript 代码。

### 工作方式

-   **开发环境**: 当你启动 `webpack-dev-server` 时，`Webpack` 会在内存中完成整个应用的打包过程，然后启动一个服务器来提供这些打包后的文件。虽然它通过热模块替换（HMR）来提升修改代码后的更新速度，但**首次启动时，它必须遍历并打包所有模块**，这在大型项目中可能会花费数十秒甚至数分钟。
-   **生产环境**: 运行 `webpack build` 时，`Webpack` 会进行大量的优化，如代码压缩、Tree Shaking（摇树）、代码分割等，以生成体积最小、性能最优的静态资源，用于线上部署。

### 一个简单的 Webpack 配置示例 (`webpack.config.js`)

```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // 模式：production 会开启优化，development 则侧重于开发体验
  mode: 'development',
  // 入口文件
  entry: './src/index.js',
  // 出口配置
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  // Loader 配置
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader', // 处理 JS 文件
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'], // 处理 CSS 文件
      },
    ],
  },
  // 插件配置
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
  ],
  // 开发服务器配置
  devServer: {
    static: './dist',
    hot: true,
  },
};
```

## Vite：利用浏览器原生能力的"革新者"

`Vite` (法语意为 "快") 是一个全新的前端构建工具，它旨在提供极致的开发体验。`Vite` 的核心创新在于，它巧妙地利用了现代浏览器原生支持 ES 模块（ESM）这一特性，彻底改变了开发服务器的工作模式。

### 工作方式

`Vite` 的工作方式在开发和生产环境截然不同，这正是其精髓所在。

-   **开发环境（No-Bundle）**: 当你启动 `vite` 开发服务器时，它**几乎在瞬间就完成了启动**。因为它不需要预先打包任何东西。它的工作流程是：
    1.  浏览器向开发服务器请求入口 HTML 文件。
    2.  `Vite` 返回 HTML，其中包含一个模块化的 script 标签，如 `<script type="module" src="/src/main.js"></script>`。
    3.  浏览器解析到 `import` 语句时，会按需、并行地通过 HTTP 请求每一个导入的模块。
    4.  `Vite` 的开发服务器会拦截这些请求，对请求的文件进行即时编译（例如将 JSX 转换为 JS），然后返回给浏览器。
    
    这种"按需编译"的方式意味着，无论你的项目有多大，`Vite` 的启动时间都基本是恒定的。热更新（HMR）也因此受益，当一个文件被修改时，`Vite` 只需要让浏览器重新请求这一个模块即可，速度快得惊人。

-   **生产环境（Bundle）**: 直接在生产环境中使用未打包的 ES 模块会导致过多的网络请求（网络瀑布问题），影响加载性能。因此，当运行 `vite build` 时，`Vite` 会使用 **`Rollup`**（一个性能出色且专注于 ES 模块的打包器）在底层进行传统的打包、压缩和优化操作，生成用于生产环境的高度优化过的静态资源。

## 对比与选择

| 特性 | Webpack | Vite |
| :--- | :--- | :--- |
| **开发服务器** | 基于打包（Bundle-based） | 基于浏览器原生ESM（No-bundle） |
| **启动速度** | 慢，随项目体积增长 | **极快**，几乎是即时的 |
| **热更新(HMR)** | 较快，但需重新计算部分打包 | **极快**，通常是毫秒级 |
| **配置** | 复杂，需要大量手动配置 | **简单**，零配置启动，易于扩展 |
| **生态系统** | **极其成熟**，插件和加载器非常丰富 | 较新，但主流需求已完全覆盖 |
| **生产打包** | Webpack 自身 | Rollup |

### 如何选择？

-   **新项目首选 `Vite`**: 对于绝大多数新的 Web 应用（无论使用 React、Vue、Svelte 等），`Vite` 都是当之无愧的首选。它带来的开发体验提升是革命性的，能极大地提高开发效率。

-   **何时考虑 `Webpack`**?
    -   **维护大型遗留项目**: 如果一个项目已经深度绑定了 `Webpack` 复杂的构建流程和特有的插件，迁移成本可能会很高。
    -   **需要高度定制化的复杂构建**: 在一些非典型的场景下，比如需要对打包过程进行精细到极致的控制，`Webpack` 强大的可配置性依然有其用武之地。
    -   **浏览器兼容性要求极低**: `Vite` 的开发模式依赖于原生 ESM，这意味着它不支持非常古老的浏览器。虽然生产构建可以配置兼容性，但在开发阶段就需要现代浏览器。

-   **缺点**: 生态系统相对 `Webpack` 较新（但发展迅速）。由于开发和生产环境的底层机制不同（ESBuild + Native ESM vs. Rollup），在极少数情况下可能会遇到只在生产环境中出现的 bug。

---

## Vite 进阶使用：从入门到精通

Vite 以其"开箱即用"的特性著称，但要应对真实世界的复杂项目，掌握其进阶配置同样重要。

#### 1. 环境变量

Vite 通过 `.env` 文件智能加载环境变量。你可以在根目录创建 `.env` (所有模式下加载)、`.env.development` (仅开发模式加载)、`.env.production` (仅生产模式加载) 文件。Vite 会自动暴露这些变量到 `import.meta.env` 对象上。

```env
# .env.development
VITE_API_BASE_URL=/api
```
在代码中访问：
```javascript
const baseUrl = import.meta.env.VITE_API_BASE_URL; // -> '/api'
```
注意：只有以 `VITE_` 为前缀的变量才会暴露给客户端代码，以防意外泄露敏感信息。

#### 2. 开发服务器代理

为了解决开发时的跨域问题，可以配置代理将 API 请求转发到真实的后端服务。

```javascript
// vite.config.js
export default {
  server: {
    proxy: {
      // 将 /api 请求代理到 http://jsonplaceholder.typicode.com
      '/api': {
        target: 'http://jsonplaceholder.typicode.com',
        changeOrigin: true, // 必须设置为 true
        rewrite: (path) => path.replace(/^\/api/, ''), // 重写请求路径
      },
    },
  },
};
```

#### 3. 路径别名

配置路径别名可以极大地提升代码的可读性和可维护性。

```javascript
// vite.config.js
import path from 'path';

export default {
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
};
```

#### 4. 依赖预构建 (optimizeDeps)

Vite 在首次启动时，会使用 `esbuild` 对项目中的 CommonJS 或 UMD 依赖进行"预构建"，将其转换为原生的 ESM 模块。这有两个目的：一是兼容性，二是性能（将许多小文件合并成一个大模块）。大多数情况下 Vite 会自动检测，但有时你需要手动干预：

```javascript
// vite.config.js
export default {
  optimizeDeps: {
    // 默认情况下，Vite 会自动寻找，但有时需要你手动指定
    include: ['some-cjs-lib'],
    // 有些包你可能不希望 Vite 进行预构建
    exclude: ['my-special-lib'],
  },
};
```

#### 5. Glob 导入

Vite 提供了一个强大的 `import.meta.glob` 功能，可以从文件系统导入多个模块，非常适合用于自动化路由注册、组件库导入等场景。

```javascript
// 自动导入 ./modules 目录下所有的路由配置
const modules = import.meta.glob('./modules/*.js');

const routes = Object.keys(modules).map((key) => {
  // ... 从 modules[key] 中获取路由信息
});
```

## Webpack 深度构建优化策略

Webpack 功能强大，但其性能和产出物体积也需要精心的优化。优化策略主要围绕两个核心目标展开：一是**提升构建速度**，减少开发者的等待时间；二是**减小产物体积**，提升用户端的加载性能。

### 方案：减少打包时间

#### 1. 缩减范围 (Reduce Scope)

减少 Webpack 需要处理的文件数量是最高效的提速方法。

-   **`exclude` & `include`**: 在配置 Loader 时，明确使用 `include` 指定要处理的目录，并用 `exclude` 排除掉无需处理的目录（尤其是 `node_modules`）。
    ```javascript
    module: {
      rules: [
        {
          test: /\.js$/,
          // 只对 src 目录下的 JS 文件应用 babel-loader
          include: path.resolve(__dirname, 'src'),
          // 排除 node_modules 目录
          exclude: /node_modules/,
          use: 'babel-loader',
        },
      ],
    },
    ```
-   **`resolve.extensions`**: 配置此选项时，应将最常用的文件类型放在前面，并避免使用过多不必要的扩展名，以减少 Webpack 的文件查找次数。

#### 2. 缓存副本 (Cache Copies)

对编译结果进行缓存，在下次构建时只重新编译改动过的文件。

-   **Webpack 5 内置缓存**: 这是最推荐的方式。通过 `cache` 配置，可以将编译结果缓存在内存或文件系统中。
    ```javascript
    // webpack.config.js
    module.exports = {
      // ...
      cache: {
        type: 'filesystem', // 'memory' 或 'filesystem'
        // 可选配置
        buildDependencies: {
          // 当这些文件变化时，缓存将失效
          config: [__filename],
        },
      },
    };
    ```
-   **Loader 缓存**: 许多耗时的 Loader 也提供了自己的缓存选项，如 `babel-loader`。
    ```javascript
    use: {
      loader: 'babel-loader',
      options: {
        cacheDirectory: true, // 开启 Babel 缓存
      },
    },
    ```

#### 3. 定向搜索 (Directed Search)

优化 Webpack 的模块解析路径，使其更快地找到文件。

-   **`resolve.alias`**: 为常用且路径较深的模块创建别名，避免 Webpack 进行层层查找。
    ```javascript
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        'react': path.resolve(__dirname, 'node_modules/react'),
      },
    },
    ```

#### 4. 提前构建 (Pre-building)

对于项目中不常变更的第三方库（vendor），可以将其预先打包，避免每次构建都重新编译它们。

-   **`DllPlugin`**: 这是实现此功能的核心。你需要创建一个独立的 `webpack.dll.config.js` 来打包第三方库，它会生成一个 `bundle` 文件和一个 `manifest.json` 文件。然后在主配置文件中，使用 `DllReferencePlugin` 来引用这个 manifest，这样主构建流程就会跳过对这些库的分析。

#### 5. 并行构建 (Parallel Build)

利用多核 CPU 的能力，同时执行多个任务。

-   **`thread-loader`**: 可以将非常耗时的 Loader（如 `babel-loader`）放置在一个独立的 worker 池中运行。
    ```javascript
    rules: [
      {
        test: /\.js$/,
        use: [
          'thread-loader', // 将此 loader 放置在其他 loader 之前
          'babel-loader',
        ],
      },
    ],
    ```
-   **`TerserWebpackPlugin` 并行压缩**: 在 `production` 模式下，JS 压缩插件 `TerserWebpackPlugin` 默认就会开启并行压缩。

#### 6. 可视结构 (Visual Structure)

优化前，先要找到瓶颈。使用分析工具可以让你的优化工作有的放矢。

-   **`webpack-bundle-analyzer`**: 它可以生成一个直观的、可交互的打包结果分析图，清晰地展示每个模块在最终 bundle 中的大小，是定位大体积模块的利器。

### 方案：减少打包体积

#### 1. 分割代码 (Code Splitting)

将代码拆分成多个小块（chunk），然后按需加载或并行加载，而不是一次性加载一个巨大的文件。

-   **`optimization.splitChunks`**: Webpack 内置的代码分割功能。最常见的用法是将 `node_modules` 中的第三方库单独打包。
    ```javascript
    optimization: {
      splitChunks: {
        chunks: 'all', // 对所有类型的 chunk 进行分割
      },
    },
    ```
-   **动态 `import()`**: 在代码中使用 `import('module-name')` 语法，Webpack 会自动将该模块分割成一个独立的 chunk，在代码执行到此处时才进行异步加载。

#### 2. 摇树优化 (Tree Shaking)

自动移除 JavaScript 上下文中未引用的"死代码"（dead-code）。它依赖于 ES2015 模块系统（即 `import` 和 `export`）。在 `production` 模式下，Tree Shaking 是默认开启的。要使其生效，需要确保你的 Babel 配置不会将 ES 模块转换为 CommonJS 模块（`@babel/preset-env` 的 `modules` 选项设为 `false`）。

#### 3. 动态垫片 (Dynamic Polyfills)

与其为所有浏览器打包一份庞大的 Polyfill 文件，不如根据用户的浏览器按需提供。这通常不是 Webpack 直接处理的，而是一种策略，例如使用 `polyfill.io` 服务，它会根据请求的 `User-Agent` 头返回最精简的 Polyfill 集合。

#### 4. 按需加载 (On-demand Loading)

这是代码分割最典型的应用场景。例如，在实现路由懒加载时：
```javascript
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// 使用动态 import() 实现组件的懒加载
const HomePage = React.lazy(() => import('./routes/HomePage'));
const AboutPage = React.lazy(() => import('./routes/AboutPage'));

const App = () => (
  <Router>
    <React.Suspense fallback={<div>Loading...</div>}>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/about" component={AboutPage} />
      </Switch>
    </React.Suspense>
  </Router>
);
```
这样，`AboutPage` 的代码只会在用户访问 `/about` 路径时才会被下载和执行。

#### 5. 作用提升 (Scope Hoisting)

在 `production` 模式下，Webpack 会尽可能地将多个模块的代码合并到一个函数作用域中，以减少函数的包裹和内存占用，提升代码在浏览器中的执行速度。这个功能由 `optimization.concatenateModules` 控制，生产模式下默认开启。

#### 6. 压缩资源 (Compress Resources)

-   **JavaScript 压缩**: `production` 模式下默认使用 `TerserWebpackPlugin` 来压缩 JS 代码。
-   **CSS 压缩**: 需要使用 `css-minimizer-webpack-plugin`，并将其添加到 `optimization.minimizer` 数组中。
    ```javascript
    const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
    // ...
    optimization: {
      minimizer: [
        new TerserWebpackPlugin(), // JS 压缩
        new CssMinimizerPlugin(), // CSS 压缩
      ],
    },
    ```
-   **图片压缩**: 可以使用 `image-webpack-loader` 或其现代替代品（如 `@svgr/webpack` 处理 SVG）来在构建时压缩图片资源。

## 对比与选择
| 特性 | Webpack | Vite |
| :--- | :--- | :--- |
// ... existing code ...
