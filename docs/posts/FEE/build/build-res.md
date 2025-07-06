---
title: FEE#010 - build | 类库打包
date: "2025-07-06"
tags:
  - Front-end engineering
---

# FEE#010 - build | 类库打包

在前端开发中，我们经常需要编写可复用的代码库（Library）并将其分享给他人使用。与应用打包不同，类库打包有着自己独特的需求和挑战：更小的体积、更好的兼容性、更友好的 API 设计，以及对 Tree-shaking 的良好支持。

在众多打包工具中，Rollup 因其简洁高效的设计理念，成为了类库打包的首选工具。本文将深入探讨如何使用 Rollup 构建高质量的 JavaScript 类库。

## Rollup：为类库打包而生

Rollup 是一个 JavaScript 模块打包器，专注于代码体积优化和 ES 模块（ESM）的处理。与 Webpack 这类应用级打包工具相比，Rollup 的设计哲学更加简洁和专注：**只做一件事，并做到极致**。这件事就是将分散的代码模块打包成高效、精简的库。

### Rollup 的核心优势

1. **天然的 Tree-shaking**：Rollup 是第一个普及 Tree-shaking 概念的工具，它能够静态分析 ES 模块的导入导出，自动移除未使用的代码。这对于类库尤为重要，因为使用者通常只需要类库的部分功能。

2. **更干净的输出**：Rollup 生成的代码非常接近手写的代码，没有大量的模块加载器代码和运行时依赖，这使得最终的产物更加轻量和可读。

3. **多种输出格式**：Rollup 支持输出多种模块格式，如 ESM、CommonJS、UMD 等，使得你的类库可以在不同环境中使用，包括浏览器、Node.js、甚至是 Deno。

4. **强大的插件生态**：虽然 Rollup 核心功能专注于 ESM 打包，但它的插件系统允许你处理各种资源类型和构建需求。

## 基础配置：从零开始构建一个类库

让我们从一个简单的 Rollup 配置开始，逐步构建一个完整的类库打包流程。

### 安装必要的依赖

```bash
# 安装 Rollup 及常用插件
npm install rollup @rollup/plugin-node-resolve @rollup/plugin-commonjs @rollup/plugin-babel @rollup/plugin-terser --save-dev

# 如果使用 TypeScript
npm install typescript @rollup/plugin-typescript --save-dev
```

### 创建配置文件

在项目根目录创建 `rollup.config.js`：

```javascript
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import pkg from './package.json' assert { type: 'json' };

export default {
  // 入口文件
  input: 'src/index.js',
  
  // 输出配置
  output: [
    // ESM 版本
    {
      file: pkg.module,
      format: 'es',
      exports: 'named',
      sourcemap: true,
    },
    // CommonJS 版本 (用于 Node.js)
    {
      file: pkg.main,
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
    },
    // UMD 版本 (用于浏览器)
    {
      file: pkg.browser,
      format: 'umd',
      name: 'MyLibrary', // 全局变量名
      exports: 'named',
      sourcemap: true,
    }
  ],
  
  // 插件
  plugins: [
    // 解析第三方依赖
    resolve(),
    // 将 CommonJS 模块转换为 ES 模块
    commonjs(),
    // 使用 Babel 转译代码
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
    }),
    // 压缩代码 (仅用于生产环境)
    process.env.NODE_ENV === 'production' && terser(),
  ],
  
  // 外部依赖，不会被打包进最终产物
  external: Object.keys(pkg.peerDependencies || {}),
};
```

### 配置 package.json

```json
{
  "name": "my-library",
  "version": "1.0.0",
  "description": "A sample library built with Rollup",
  "main": "dist/index.cjs.js",      // CommonJS 入口
  "module": "dist/index.esm.js",    // ESM 入口
  "browser": "dist/index.umd.js",   // UMD 入口
  "types": "dist/index.d.ts",       // TypeScript 类型声明
  "files": [
    "dist"
  ],
  "scripts": {
    "build": "rollup -c",
    "dev": "rollup -c -w",
    "prepublishOnly": "npm run build"
  },
  "peerDependencies": {
    "react": "^17.0.0"
  },
  "devDependencies": {
    // ... 开发依赖
  }
}
```

## 高级配置：打造专业级类库

基础配置可以满足简单的需求，但一个专业的类库通常需要更多高级特性。

### TypeScript 支持

对于现代 JavaScript 类库，TypeScript 几乎是标配。它不仅提供了类型安全，还能为使用者提供更好的 IDE 支持。

```javascript
// rollup.config.js
import typescript from '@rollup/plugin-typescript';

export default {
  // ... 其他配置
  plugins: [
    // ... 其他插件
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: 'dist',
    }),
  ],
};
```

对应的 `tsconfig.json`：

```json
{
  "compilerOptions": {
    "target": "es2018",
    "module": "esnext",
    "moduleResolution": "node",
    "declaration": true,
    "outDir": "dist",
    "strict": true,
    "esModuleInterop": true
  },
  "include": ["src"]
}
```

### CSS 处理

如果你的类库包含样式，可以使用 `rollup-plugin-postcss` 处理 CSS：

```javascript
import postcss from 'rollup-plugin-postcss';

export default {
  // ... 其他配置
  plugins: [
    // ... 其他插件
    postcss({
      extract: true, // 将 CSS 提取到单独的文件
      minimize: true, // 压缩 CSS
      // 或者注入到 JS 中
      // inject: true,
    }),
  ],
};
```

### 依赖处理策略

类库打包时，对依赖的处理尤为重要。通常有三种策略：

1. **外部化（External）**：不将依赖打包进产物，而是声明为外部依赖，由使用者提供。这适用于 React、Vue 这类常见框架。

2. **打包（Bundled）**：将依赖直接打包进产物。适用于小型工具函数或不常见的依赖。

3. **部分打包**：只打包核心功能，将大型或可选的依赖外部化。

```javascript
export default {
  // ... 其他配置
  
  // 方法一：手动指定外部依赖
  external: ['react', 'react-dom'],
  
  // 方法二：自动将所有依赖视为外部依赖
  external: Object.keys(pkg.dependencies || {})
    .concat(Object.keys(pkg.peerDependencies || {})),
};
```

### 代码拆分

对于较大的类库，可以使用代码拆分（Code Splitting）来实现按需加载：

```javascript
export default {
  input: {
    main: 'src/index.js',
    utils: 'src/utils.js',
  },
  output: {
    dir: 'dist',
    format: 'es',
    entryFileNames: '[name].js',
    chunkFileNames: '[name]-[hash].js',
  },
};
```

## 实战：构建一个完整的类库

让我们通过一个实际的例子，展示如何构建一个包含多种功能的类库。

假设我们要构建一个名为 `awesome-utils` 的工具库，它包含日期处理、字符串操作和数学计算等功能。

### 项目结构

```
awesome-utils/
├── src/
│   ├── date/
│   │   ├── format.ts
│   │   └── index.ts
│   ├── string/
│   │   ├── capitalize.ts
│   │   └── index.ts
│   ├── math/
│   │   ├── sum.ts
│   │   └── index.ts
│   └── index.ts
├── package.json
├── rollup.config.js
└── tsconfig.json
```

### 入口文件 (src/index.ts)

```typescript
export * from './date';
export * from './string';
export * from './math';
```

### 最终的 Rollup 配置

```javascript
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import dts from 'rollup-plugin-dts';
import pkg from './package.json' assert { type: 'json' };

// 共享配置
const shared = {
  input: 'src/index.ts',
  plugins: [
    resolve(),
    commonjs(),
    typescript({ tsconfig: './tsconfig.json' }),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
      extensions: ['.js', '.ts'],
    }),
  ],
};

export default [
  // ESM, CJS, UMD 版本
  {
    ...shared,
    output: [
      {
        file: pkg.module,
        format: 'es',
      },
      {
        file: pkg.main,
        format: 'cjs',
        exports: 'named',
      },
      {
        file: pkg.browser,
        format: 'umd',
        name: 'AwesomeUtils',
        plugins: [terser()],
      },
    ],
  },
  
  // 类型声明文件
  {
    input: 'src/index.ts',
    output: {
      file: pkg.types,
      format: 'es',
    },
    plugins: [dts()],
  },
  
  // 子模块入口（实现按需导入）
  ...['date', 'string', 'math'].map(name => ({
    ...shared,
    input: `src/${name}/index.ts`,
    output: {
      file: `dist/${name}.js`,
      format: 'es',
    },
  })),
];
```

### package.json 中的导出配置

为了支持子路径导入，我们可以使用 package.json 的 `exports` 字段：

```json
{
  "name": "awesome-utils",
  "version": "1.0.0",
  "main": "dist/index.cjs.js",
  "module": "dist/index.esm.js",
  "browser": "dist/index.umd.js",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.esm.js",
      "require": "./dist/index.cjs.js",
      "types": "./dist/index.d.ts"
    },
    "./date": {
      "import": "./dist/date.js",
      "types": "./dist/date/index.d.ts"
    },
    "./string": {
      "import": "./dist/string.js",
      "types": "./dist/string/index.d.ts"
    },
    "./math": {
      "import": "./dist/math.js",
      "types": "./dist/math/index.d.ts"
    }
  },
  "sideEffects": false
}
```

这样，使用者就可以按需导入特定功能：

```javascript
// 导入整个库
import { formatDate, capitalize, sum } from 'awesome-utils';

// 或者按需导入
import { formatDate } from 'awesome-utils/date';
```

## Rollup vs Webpack：何时选择 Rollup？

虽然 Webpack 是构建应用的强大工具，但 Rollup 在类库打包方面有着明显的优势：

| 特性 | Rollup | Webpack |
| :--- | :--- | :--- |
| **产物体积** | **更小**，没有额外的运行时代码 | 较大，包含模块加载器和运行时 |
| **代码可读性** | **更高**，接近手写代码 | 较低，包含大量样板代码 |
| **Tree-shaking** | **原生支持**，效果极佳 | 支持，但效果不如 Rollup |
| **多种输出格式** | **原生支持** ESM/CJS/UMD/IIFE | 需要额外配置 |
| **代码拆分** | 支持，但功能较简单 | **功能更强大** |
| **HMR 和开发体验** | 基本支持 | **功能更完善** |
| **配置复杂度** | **简单**，专注于打包 | 复杂，功能全面 |

因此，当你需要构建一个类库时，Rollup 通常是更好的选择，尤其是：

- 你的类库主要提供 JavaScript API
- 你希望支持 Tree-shaking
- 你需要输出多种模块格式
- 你追求更小的体积和更干净的代码
