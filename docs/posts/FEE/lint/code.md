---
title: FEE#003 - Lint | 代码规范
date: "2025-07-05"
tags:
  - Front-end engineering
---

# FEE#003 - Lint | 代码规范

::: tip 相关文章
- [项目搭建篇-项目初始化&prettier、eslint、stylelint、lint-staged、husky](https://juejin.cn/post/7353504333999505408) 讲的很详细，不过eslint是8.x版本，和新版本有很多不同
- [ESlint9+Prettier从0开始配置教程](https://juejin.cn/post/7402696141495779363) 配置部分讲的很详细
- https://juejin.cn/book/7034689774719860739/section/7036005890725511209 掘金小册，一种代码规范化解决方案
:::

代码规范在前端工程化中扮演着监督者的角色，它主要用于约束团队成员的编码规范与编码风格。

## 关于代码规范，需要考虑···

在制定代码规范时，我们通常会考虑以下几个核心维度的问题，以确保代码的**一致性、可读性、可维护性和健壮性**。

### 命名规范 (Naming Conventions)

统一的命名规范是提高代码可读性的第一步。

- **变量 (Variables)**: 使用小驼峰命名法 (camelCase)。例如：`userName`, `isLoading`。
- **常量 (Constants)**: 使用大写字母和下划线。例如：`MAX_RETRIES`, `API_URL`。
- **函数 (Functions)**: 使用小驼峰命名法，名称应为动词或动宾短语。例如：`getUserInfo()`, `calculatePrice()`。
- **类 (Classes) 和组件 (Components)**: 使用帕斯卡命名法 (PascalCase)。例如：`class User`, `class ProductDetails`, `Component UserProfile`。
- **文件名**:
  - **JavaScript/TypeScript**: 组件文件使用帕斯卡命名法 (PascalCase)，如 `UserProfile.tsx`。工具或服务类文件使用小驼峰命名法 (camelCase) 或烤串命名法 (kebab-case)，如 `dateUtils.js` 或 `date-utils.js`。
  - **CSS/SCSS**: 使用烤串命名法 (kebab-case)，如 `user-profile.scss`。
- **CSS 类名**: 推荐使用系统性的命名方法，如 **BEM** (Block, Element, Modifier)，以避免全局冲突和样式污染。例如：`.card__title--highlighted`。

### 代码格式化 (Code Formatting)

代码格式化关注代码的外观，风格统一是关键。这些规则通常由 Prettier 等工具自动执行。

- **缩进 (Indentation)**: 统一使用 2 个或 4 个空格，不允许使用 Tab。
- **分号 (Semicolons)**: 统一总是使用或总是不使用分号。
- **空格 (Spacing)**: 在操作符前后、逗号后、代码块 `{}` 前后等地方保持一致的空格。
- **行长度 (Line Length)**: 限制每行的最大字符数（如 80 或 120 个字符），避免横向滚动。
- **引号 (Quotes)**: 在 JavaScript 中统一使用单引号 `'` 或双引号 `"`。
- **换行 (Line Breaks)**: 在长的数组、对象或函数参数列表后，采用一致的换行规则，通常是每个元素占一行。

### 注释规范 (Commenting)

好的注释解释的是代码"为什么"这么做，而不是"做什么"。

- **何时注释**:
  - **复杂逻辑**: 解释复杂的算法或业务逻辑。
  - **临时方案**: 使用 `// TODO:` 标记待办事项，或 `// FIXME:` 标记需要修复的问题。
  - **设计决策**: 解释为什么选择这种实现方式，而不是其他方式。
  - **潜在陷阱**: 对可能导致意外行为的代码进行警告。
- **JSDoc**: 对于公共函数、类和模块，推荐使用 JSDoc (`/** ... */`) 格式进行注释，以便工具可以自动生成文档。
- **避免无用注释**: 不要注释掉不再使用的代码（应通过版本控制删除），也不要解释显而易见的代码。

### JavaScript 语言特性规范

利用现代 JavaScript 的优秀特性，规避其语言陷阱。

- **变量声明**: 优先使用 `const`，当变量需要被重新赋值时使用 `let`，完全避免使用 `var` 以防止变量提升和作用域问题。
- **函数**: 优先使用箭头函数 (`=>`)，因为它更简洁且不绑定自己的 `this`。仅在需要动态 `this`（如类的方法或事件监听器）时使用普通函数。
- **模块化**: 统一使用 ES Modules (`import`/`export`) 进行模块化开发。
- **异步处理**: 优先使用 `async/await` 处理异步操作，它比回调函数或纯 `Promise.then()` 链更具可读性。
- **相等性**: 始终使用严格相等 `===` 和不严格相等 `!==`，避免使用 `==` 和 `!=` 带来的隐式类型转换问题。
- **对象与数组**:
  - 优先使用扩展运算符 (`...`) 进行浅拷贝。
  - 使用解构赋值 (`const { name } = user;`) 来提取属性，使代码更简洁。

### HTML 规范

保证 HTML 结构的语义化、可访问性和稳健性。

- **语义化标签**: 使用正确的 HTML5 标签（如 `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>`）来描述内容结构，有利于 SEO 和可访问性。
- **可访问性 (Accessibility, a11y)**:
  - 为所有 `<img>` 标签提供有意义的 `alt` 属性。
  - 确保表单元素（如 `<input>`, `<textarea>`）与 `<label>` 正确关联。
  - 在适当的时候使用 WAI-ARIA 属性（如 `role`, `aria-*`）来增强复杂交互组件的可访问性。
- **属性**:
  - 属性值统一使用双引号 `""`。
  - 布尔属性（如 `disabled`, `checked`）不需要赋值。

### CSS/SCSS 规范

目标是编写可维护、可扩展和高性能的样式。

- **选择器**:
  - 避免使用 ID 选择器，因为它的特异性过高，难以覆盖。
  - 限制选择器嵌套深度（建议不超过 3 层），以降低特异性，避免产生脆弱的样式。
- **属性顺序**: 按照统一的顺序编写 CSS 属性（例如，按功能分组：布局 → 盒模型 → 字体 → 外观 → 动画），便于查找和修改。
- **单位**: 在项目中统一长度单位的使用策略（例如，`rem` 用于字体和间距，`px` 用于边框）。
- **避免魔法数字**: 避免在代码中使用未经解释的数值（"魔法数字"），应将其定义为 SCSS/Less 变量，并赋予有意义的名称。

### 框架与库规范 (Framework & Library Specifics)

遵循所使用框架或库的最佳实践。

- **React**:
  - **组件命名**: 使用 PascalCase，且文件名与组件名一致。
  - **Hooks 规则**: 只能在函数组件的顶层调用 Hooks，不能在循环、条件或嵌套函数中调用。
  - **状态管理**: 明确何时使用组件内部状态 (`useState`)，何时使用全局状态管理器 (Redux, Zustand 等)。
  - **Props 定义**: 使用 PropTypes 或 TypeScript 定义组件的 props 类型，增强代码的健壮性。

### 自动化工具 (Tooling)

将规范落地到项目中，不能只靠人来遵守，必须依赖自动化工具。

- **Linter (如 ESLint)**: 用于静态代码分析，在编码阶段就发现语法错误、风格问题和潜在的 bug。通常会集成共享的规则集（如 `eslint-config-airbnb`, `eslint-config-standard`）并根据团队需求进行定制。
- **Formatter (如 Prettier)**: 专注于代码格式化，自动处理缩进、空格、分号等所有外观问题，消除相关争论。
- **EditorConfig**: 帮助在不同的编辑器和 IDE 之间维护一致的编码风格（如缩进样式、行尾字符）。
- **Git Hooks (如 Husky & lint-staged)**: 在代码提交到版本库（`git commit`）之前，自动运行 Linter 和 Formatter，确保所有入库的代码都符合团队规范。

综上所述，一个全面的前端代码规范是一套系统性的工程实践，它不仅仅是关于"代码怎么写好看"，更是提升团队协作效率、保障项目长期质量和降低维护成本的关键所在。接下来主要介绍一下 Tooling 部分，包括 Eslint、Prettier、editorConfig、Husky 等工具的使用和配置，这里相当于对社区里零散的文章做一个汇总。

## ESLint 的使用与配置

ESLint 是 JavaScript 和 TypeScript 代码的"质量守护者"。与 Prettier 专注于"代码好不好看"不同，ESLint 更关心"代码好不好"。它的核心使命是通过静态分析，在代码运行前就找出潜在的逻辑错误、不合理的写法以及不符合最佳实践的部分。

### ESLint 的核心理念与工作方式

ESLint 的强大之处在于其高度的可扩展性，它通过几个核心概念协同工作：

- **解析器 (Parser)**: ESLint 需要先理解你写的代码。解析器（如 `@typescript-eslint/parser`）负责将代码转换成一种名为"抽象语法树"（AST）的数据结构，供 ESLint 分析。
- **规则 (Rules)**: 规则是 ESLint 检查工作的最小单元。每一条规则都对应一个代码质量检查点，例如 `no-unused-vars` (禁止未使用的变量) 或 `no-explicit-any` (禁止使用 `any` 类型)。
- **插件 (Plugins)**: 插件是规则的集合，通常针对特定的技术栈或库（如 React、Vue）。例如，`eslint-plugin-react-hooks` 插件提供了一系列专门用于检查 React Hooks 写法的规则。
- **配置 (Configurations)**: 配置文件是这一切的"指挥中心"，它告诉 ESLint 要使用哪个解析器、启用哪些插件以及如何设置每一条规则。

### 新的组合式配置 (`eslint.config.js`)

从 v9 版本开始，ESLint 推荐使用名为"Flat Config"（扁平配置）的新格式，对应的文件就是 `eslint.config.js`。

与旧版 `.eslintrc` 的继承模式不同，新格式采用的是**组合（Composition）**模式。它导出一个配置对象的**数组**，ESLint 会按顺序遍历这个数组，将每个对象的配置叠加起来，形成最终的生效配置。这种模式更清晰、更灵活。

### 从零开始配置一个现代化的 ESLint

让我们为一个典型的 `React + TypeScript` 项目来构建一个 `eslint.config.js`。

1.  **安装核心依赖**
    ```shell
    pnpm add eslint @eslint/js typescript-eslint eslint-plugin-react eslint-plugin-react-hooks -D
    ```
    - `eslint`: 核心库。
    - `@eslint/js`: 提供 ESLint 官方推荐的基础规则集。
    - `typescript-eslint`: 包含了 TypeScript 的解析器和相关规则，是 TS 项目的必需品。
    - `eslint-plugin-react`, `eslint-plugin-react-hooks`: 针对 React 的插件。

2.  **创建 `eslint.config.js`**

    一个结构清晰的配置文件会将不同类型文件、不同用途的配置分块处理。

    ```js
    // eslint.config.js
    import js from '@eslint/js';
    import tseslint from 'typescript-eslint';
    import reactPlugin from 'eslint-plugin-react';
    import hooksPlugin from 'eslint-plugin-react-hooks';
    import globals from 'globals';

    export default tseslint.config(
      // 1. 全局忽略配置
      {
        ignores: ['dist', 'node_modules', '*.config.js'],
      },

      // 2. JS 文件基础配置 (ESLint 官方推荐)
      {
        files: ['**/*.js', '**/*.jsx'],
        ...js.configs.recommended,
        languageOptions: {
          globals: {
            ...globals.browser,
            ...globals.node,
          },
        },
      },

      // 3. TypeScript 文件核心配置
      {
        files: ['**/*.ts', '**/*.tsx'],
        // 使用 tseslint.config 辅助函数，它会智能地组合解析器、插件和规则
        extends: [
          ...tseslint.configs.recommended, // TS 推荐规则
        ],
        languageOptions: {
          parserOptions: {
            // 为类型感知的规则指定 tsconfig.json 路径
            project: true,
            tsconfigRootDir: import.meta.dirname,
          },
        },
      },
      
      // 4. React 相关的专门配置
      {
        files: ['**/*.{jsx,tsx}'],
        plugins: {
          react: reactPlugin,
          'react-hooks': hooksPlugin,
        },
        // React 的推荐规则集
        ...reactPlugin.configs.flat.recommended,
        rules: {
          // 启用 React Hooks 的核心规则
          'react-hooks/rules-of-hooks': 'error',
          'react-hooks/exhaustive-deps': 'warn',
        },
        languageOptions: {
          ...reactPlugin.configs.flat.recommended.languageOptions,
        },
      },

      // 5. 自定义规则和覆盖（这是我们团队自己的规范）
      {
        rules: {
          'quotes': ['error', 'single'],
          '@typescript-eslint/no-explicit-any': 'warn', // 将 no-any 降级为警告
          'react/prop-types': 'off', // 在 TS 项目中禁用 prop-types
        }
      }
    );
    ```

通过这种分层、组合的配置方式，我们可以清晰地管理针对不同文件、不同技术栈的规范，让整个配置的可读性和可维护性大大增强。

## Prettier 的使用与配置

如果说 ESLint 和 Stylelint 是代码的"质量警察"，那么 **Prettier** 就是代码的"首席造型师"。它是一个**固执己见（Opinionated）的代码格式化工具**，其核心哲学就是通过强制推行一套统一、一致的代码风格，来终结团队内部所有关于"代码格式"的无休止争论。

### Prettier 的核心理念

Prettier 不关心你的代码原来长什么样。它会完整地解析你的代码，将其转换为一棵抽象语法树（AST），然后根据它自己的一套优美、一致的规则，将这棵树重新"打印"成代码。

这意味着，无论团队成员使用什么编辑器、有什么样的编码习惯，只要保存文件时触发了 Prettier，最终产出的代码格式都是**完全一致**的。

### 安装与配置

在一个项目中集成 Prettier 非常简单：

1.  **安装 Prettier**
    ```shell
    pnpm add prettier -D
    ```

2.  **创建配置文件**
    在项目根目录创建 `.prettierrc.js` 或 `.prettierrc.json` 文件。虽然 Prettier 很"固执"，但它依然提供了一些最核心的配置项供我们选择。

    一个常见的 `.prettierrc.js` 配置如下：
    ```js
    // .prettierrc.js
    module.exports = {
      // 每行最大字符数
      printWidth: 100,
      // tab 键的宽度，默认为 2
      tabWidth: 2,
      // 是否在语句末尾使用分号
      semi: true,
      // 是否使用单引号
      singleQuote: true,
      // 对象或数组末尾是否添加逗号
      // 'es5' - 在 ES5 中有效的逗号（如对象和数组）
      // 'all' - 尽可能添加逗号（如函数参数）
      trailingComma: 'es5',
      // 在对象字面量的大括号之间打印空格
      bracketSpacing: true,
      // 将多行 HTML（HTML, JSX, Vue, Angular）元素的 > 放在最后一行的末尾，而不是单独放在下一行
      jsxBracketSameLine: false,
      // 箭头函数参数是否总是有括号
      // 'always' - (x) => x
      // 'avoid' - x => x
      arrowParens: 'always',
    };
    ```

### Prettier 与 ESLint 的集成（重要！）

这是配置中最关键的一步。ESLint 拥有一些格式化相关的规则（如 `quotes`, `semi`），而 Prettier 的工作就是格式化代码，因此它们之间存在功能重叠，会产生冲突。

**解决方案是：让 ESLint 放弃所有格式化工作，将其完全交给 Prettier。**

我们需要借助两个工具来扮演"和事佬"的角色：

- `eslint-config-prettier`: 它的作用是**关闭** ESLint 中所有与 Prettier 可能产生冲突的规则。
- `eslint-plugin-prettier`: 它的作用是将 Prettier 的格式化能力作为一条 ESLint **规则**来运行。如果代码格式不符合 Prettier 的要求，ESLint 会抛出一个格式错误。

1.  **安装依赖**
    ```shell
    pnpm add eslint-plugin-prettier eslint-config-prettier -D
    ```

2.  **配置 `eslint.config.js`**
    在你的 `eslint.config.js` 文件中，你需要将 Prettier 的配置**作为最后一个配置块或在 `extends` 的最后**引入，以确保它能覆盖其他配置中的格式规则。

    以我们之前定制的 ESLint 配置为例，可以这样修改：
    ```js
    // eslint.config.js
    import prettierConfig from 'eslint-config-prettier';

    // ... 其他 imports ...

    export default tseslint.config(
      // ... 其他配置 ...

      // 在数组的最后，添加 Prettier 的配置
      // 这个配置对象的作用就是关闭所有与 Prettier 冲突的 ESLint 规则
      prettierConfig,

      // 如果你想让 Prettier 的格式问题在 ESLint 中以错误形式提示
      // 可以再添加 eslint-plugin-prettier 的配置
      {
        files: ['**/*.{ts,tsx,js,jsx}'],
        plugins: {
          prettier: eslintPluginPrettier,
        },
        rules: {
          'prettier/prettier': 'error',
          'arrow-body-style': 'off',
          'prefer-arrow-callback': 'off',
        },
      }
    );
    ```
    > **注意**：最新的实践中，很多人倾向于只使用 `eslint-config-prettier` 来避免冲突，然后通过编辑器的"保存时格式化"功能或独立的 `prettier --write` 命令来执行格式化，而不是通过 `eslint-plugin-prettier`。这样做性能更好。但集成到 ESLint 中可以确保所有格式问题都能被 `lint` 命令捕获，具体选择可根据团队偏好决定。

配置完成后，ESLint 就学会了"求同存异"，专注于代码质量，而将"梳妆打扮"的活儿优雅地交给了 Prettier。

## Stylelint 的使用与配置

在我们谈论代码规范时，ESLint 负责 JavaScript，Prettier 负责代码格式，而 **Stylelint** 则扮演着 CSS 世界里 "Linter" 的角色。它是一个强大且现代化的样式代码检查工具，可以帮助我们和团队保障样式代码的质量和一致性。

### Stylelint 能做什么？

与只关心代码格式的 Prettier 不同，Stylelint 的能力要广泛得多：

1.  **发现潜在错误**：比如无效的颜色值、重复的属性、无法识别的单位等。
2.  **强制执行最佳实践**：比如限制选择器的嵌套深度、禁止使用 ID 选择器、推荐使用复合属性等。
3.  **统一代码风格**：比如规定颜色的表示法（`#fff` vs `#ffffff`）、缩进、单位的大小写等。
4.  **支持现代 CSS**：它原生支持类似 SCSS/Less 的预处理器、CSS-in-JS 库以及 CSS Modules。

### 安装与基本配置

在一个项目中集成 Stylelint 通常包含以下步骤：

1.  **安装核心依赖**：
    ```shell
    # 安装 Stylelint 自身和标准的规则集
    pnpm add stylelint stylelint-config-standard -D
    ```
    - `stylelint`: Stylelint 的核心库。
    - `stylelint-config-standard`: 一套官方推荐的、通用的、现代化的规则集。它包含了对大部分 CSS 规范的合理约定，是绝大多数项目的最佳起点。

2.  **创建配置文件**：
    在项目根目录创建 `stylelint.config.js` 文件 (或 `.stylelintrc.js`)。这是告诉 Stylelint 如何工作的核心。

    一个最基础的配置如下：
    ```js
    // stylelint.config.js
    module.exports = {
      // 继承标准的规则集
      extends: 'stylelint-config-standard',
    };
    ```
    仅仅这样配置，Stylelint 就已经能基于标准规则工作了。

### 进阶配置：支持 SCSS 与自定义规则

在实际项目中，我们通常会使用 SCSS/Sass，并且有团队自己的规范。下面是一个更贴近实战的配置示例：

1.  **安装 SCSS 相关依赖**：
    ```shell
    # 安装针对 SCSS 的标准规则集和让属性按序排列的插件
    pnpm add stylelint-config-standard-scss stylelint-order -D
    ```
    - `stylelint-config-standard-scss`: 继承自 `stylelint-config-standard`，并增加了对 SCSS 语法（如嵌套、变量、混合等）的校验规则。
    - `stylelint-order`: 一个非常实用的插件，用于强制 CSS 属性按照我们指定的顺序书写，极大地提升了代码的可读性。

2.  **编写详细的配置文件**：
    ```js
    // stylelint.config.js
    module.exports = {
      // 继承 SCSS 的标准规则集
      extends: 'stylelint-config-standard-scss',
      
      // 注册插件
      plugins: ['stylelint-order'],

      // 自定义或覆盖规则
      rules: {
        // --- 风格与约定 ---
        'color-function-notation': 'legacy', // 颜色函数使用旧版写法 rgba(0,0,0,0.5) 而非新版 rgba(0 0 0 / 0.5)
        'alpha-value-notation': 'number', // alpha 值使用数字表示（0.5）而非百分比（50%）
        'color-hex-length': 'short', // 尽可能使用简写的十六进制颜色值
        
        // --- 最佳实践与错误防止 ---
        'selector-class-pattern': null, // BEM等命名规范，这里暂时不约束
        'selector-id-pattern': null, // 不约束 id 选择器的命名
        'no-descending-specificity': null, // 允许高优先级的选择器出现在低优先级选择器之后
        'declaration-block-no-redundant-longhand-properties': null, // 允许使用单方向的属性（如 margin-top）而非复合属性
        'scss/at-import-partial-leading-underscore': null, // 允许 @import 引入不带下划线前缀的部分文件
        
        // --- 限制与性能 ---
        'selector-max-id': 0, // 禁止使用 ID 选择器，以保证样式可复用性
        'max-nesting-depth': 3, // 限制选择器的最大嵌套深度为 3，避免样式过于复杂和脆弱
        
        // --- stylelint-order 插件的规则 ---
        'order/properties-order': [
          // 按照"布局 -> 盒模型 -> 字体 -> 外观 -> 动画"的顺序排列
          'position',
          'top',
          'right',
          'bottom',
          'left',
          'z-index',
          'display',
          'flex-flow',
          'flex-direction',
          'flex-wrap',
          'justify-content',
          'align-items',
          'align-content',
          'gap',
          'margin',
          'padding',
          'width',
          'height',
          'font-family',
          'font-size',
          'font-weight',
          'line-height',
          'color',
          'background',
          'border',
          'border-radius',
          'opacity',
          'transition',
        ],
      },
    };
    ```

### 与 Prettier 协作

Stylelint 和 Prettier 都具备格式化样式代码的能力，这会导致冲突。最佳实践是：

- **分工明确**：让 **Stylelint** 负责所有**与 CSS 逻辑和质量相关**的检查，让 **Prettier** 只负责**与代码风格无关的纯格式化**（如缩进、行尾、分号等）。
- **解决冲突**：安装 `stylelint-config-prettier` 这个包，它会自动关闭 Stylelint 中所有可能与 Prettier 冲突的格式化规则，将格式化工作完全交给 Prettier。

```shell
pnpm add stylelint-config-prettier -D
```

然后，在你的 `extends` 数组中，将 `stylelint-config-prettier` 作为**最后一项**添加进去，以确保它能覆盖掉其他规则集中的格式化规则。

```js
// stylelint.config.js
module.exports = {
  extends: [
    'stylelint-config-standard-scss',
    'stylelint-config-prettier' // 确保这是最后一项
  ],
  // ... 其他配置
};
```

通过以上配置，我们便拥有了一套强大且自动化的样式规范体系，能有效地提升项目的可维护性和团队的协作效率。

## Husky 的配置和使用

现在，我们已经拥有了 ESLint, Prettier, Stylelint 这三套强大的规范工具。但问题是，如何确保团队中的每个人都**严格遵守**这些规范呢？单靠自觉和 Code Review 是不够的，我们需要一个自动化流程来强制执行，而 **Husky** 就是实现这个流程的基石。

Husky 是一个让使用 Git 钩子（Git Hooks）变得极其简单的工具。Git 钩子是 Git 在特定事件（如 `commit`, `push`）发生时自动执行的脚本。Husky 让我们可以在项目的 `package.json` 中轻松管理这些脚本，而无需手动操作 `.git/hooks` 目录。

我们的目标是：在每次开发者执行 `git commit` 时，自动对本次将要提交的代码进行规范检查。

### 安装与初始化

1.  **安装 Husky**
    ```shell
    pnpm add husky -D
    ```

2.  **启用 Git 钩子**
    运行以下命令来初始化 Husky，它会在你的项目根目录创建一个 `.husky/` 目录。
    ```shell
    pnpm dlx husky init
    ```
    这个命令做了两件事：
    - 创建 `.husky/` 目录。
    - 在 `.husky/` 目录下创建一个名为 `pre-commit` 的钩子文件示例。

3.  **配置 `prepare` 脚本（重要）**
    为了让其他开发者在克隆你的项目并安装依赖后也能自动启用 Husky 钩子，你需要在 `package.json` 中添加一个 `prepare` 脚本。这个脚本会在 `pnpm install` 之后自动执行。
    ```json
    // package.json
    "scripts": {
      "prepare": "husky"
    }
    ```

完成这几步后，Husky 的基本框架就搭建好了。接下来，我们需要一个更智能的工具来配合它。

## lint-staged 的配置和使用

直接在 `pre-commit` 钩子中运行 `pnpm lint` 或 `pnpm format` 是一个坏主意，因为这会导致**每次提交都检查整个项目**的所有文件。对于大型项目来说，这个过程会非常缓慢，严重影响开发体验。

**lint-staged** 应运而生，它的核心思想非常简单：**只对我们通过 `git add` 添加到暂存区（Staged）的文件执行 Linter 和 Formatter。**

这样一来，检查范围从"整个项目"缩小到了"本次提交"，速度和效率得到了极大的提升。

### 安装与配置

1.  **安装 lint-staged**
    ```shell
    pnpm add lint-staged -D
    ```

2.  **在 `package.json` 中配置**
    我们可以在 `package.json` 文件中添加一个 `lint-staged` 字段，来定义要对哪些文件执行哪些命令。
    ```json
    // package.json
    "lint-staged": {
      "*.{js,jsx,ts,tsx}": [
        "eslint --fix",
        "prettier --write"
      ],
      "*.{css,scss}": [
        "stylelint --fix",
        "prettier --write"
      ],
      "*.{md,json,html}": [
        "prettier --write"
      ]
    }
    ```
    这个配置的含义是：
    - 对所有暂存的 JS/TS 文件，先执行 `eslint --fix` 修复问题，再用 `prettier` 格式化。
    - 对所有暂存的 CSS/SCSS 文件，先执行 `stylelint --fix` 修复问题，再用 `prettier` 格式化。
    - 对其他如 Markdown, JSON 等文件，只用 `prettier` 格式化。

### 联动：将 Husky 与 lint-staged 连接起来

最后一步，就是修改 Husky 创建的 `pre-commit` 钩子文件，让它在被触发时去执行 `lint-staged`。

打开 `.husky/pre-commit` 文件，将其内容修改为：
```sh
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# 执行 lint-staged
pnpm lint-staged
```

### 完整的自动化工作流

至此，我们已经建立起了一套完整的、自动化的代码规范保障流程：

1.  开发者修改代码，然后执行 `git add .` 将文件添加到暂存区。
2.  开发者执行 `git commit -m "..."`。
3.  Git 的 `pre-commit` 事件被触发，从而执行 Husky 配置的 `.husky/pre-commit` 脚本。
4.  该脚本调用 `pnpm lint-staged`。
5.  `lint-staged` 检查 `package.json` 中的配置，找出所有暂存的文件，并对它们执行匹配的命令（ESLint, Stylelint, Prettier）。
6.  **情况一：** 如果所有检查都通过（或者被自动修复），`lint-staged` 会将自动修复后的文件重新添加到暂存区，然后 commit 顺利完成。
7.  **情况二：** 如果某个 Linter 发现了无法自动修复的错误（例如 ESLint 报了一个 error），`lint-staged` 会立即中止，并输出错误信息。commit 过程失败，开发者必须先手动修复问题，然后才能重新提交。

通过这套流程，我们确保了每一行进入代码库的代码，都经过了严格的规范审查，从而极大地保障了项目的长期健康和团队的协作效率。


## 总结

上面这些，基本上就是现在比较主流的一套代码规范化方案，缺点很明晰：三个规范工具需要安装一大堆依赖来保证规则之间不会冲突、配置较为麻烦等等。现在又涌现出了一些新的工具：biome、oxlint等等，这些可以再研究研究。

另外，在 https://github.com/Mengbooo/codeConfig 试着配置了一下上面的几个工具。