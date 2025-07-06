---
title: FEE#008 - manage | 包管理器
date: "2025-07-06"
tags:
  - Front-end engineering
---

# FEE#008 - manage | 包管理器

在现代前端工程化的世界里，我们几乎不可能从零开始构建一个项目。我们会依赖大量的第三方库和工具来提高开发效率和软件质量。而"包管理器"（Package Manager）就是帮助我们自动化地安装、更新、配置和卸载这些依赖的工具。

在 Node.js 生态中，包管理器的发展历程，实际上就是一部不断与"依赖地狱"作斗争的历史。从最初的 `npm`，到 `Yarn` 的出现，再到 `pnpm` 的兴起，每一次变革都旨在解决依赖管理中遇到的核心问题。理解它们的演进和设计哲学，能帮助我们做出更明智的技术选型。

## 主流包管理器详解

### 1. npm (Node Package Manager)

`npm` 是 Node.js 官方的、最老牌的包管理器。只要你安装了 Node.js，`npm` 就会被默认安装，这使得它的用户基数最为庞大。

**设计与演进**:
- **早期 (v1-v2)**: 采用"嵌套"的 `node_modules` 结构，每个依赖都有自己的 `node_modules` 文件夹。这导致了严重的"依赖重复"和"路径过长"问题。
  举个例子，假设你的项目依赖 `foo` 和 `bar`，而它们俩都依赖 `baz`。在嵌套结构下，`node_modules` 会是这样：
  ```
  node_modules/
  ├── foo@1.0.0/
  │   └── node_modules/
  │       └── baz@1.0.0/
  └── bar@1.0.0/
      └── node_modules/
          └── baz@1.0.0/
  ```
  可以看到，`baz` 被安装了两次，造成了磁盘空间的浪费。

- **现代 (v3+)**: 为了解决上述问题，`npm` 引入了"扁平化"的 `node_modules` 结构。它会尝试将所有依赖都提升（hoist）到顶层。
  同样是上面的例子，在扁平化结构下，`node_modules` 会变成这样：
  ```
  node_modules/
  ├── foo@1.0.0/
  ├── bar@1.0.0/
  └── baz@1.0.0/
  ```
  `baz` 只被安装了一次，所有依赖它的包（`foo` 和 `bar`）都可以访问到它。这一改变极大地提升了效率，但也无意中催生了"幽灵依赖"问题——即项目可以访问到未在 `package.json` 中声明的包。此外，从 `npm v5` 开始引入的 `package-lock.json` 文件解决了依赖版本不确定的问题。

**优缺点**:
- **优点**: 无需额外安装，社区庞大，生态成熟，`npm scripts` 功能强大。
- **缺点**: 历史包袱较重，扁平化带来的幽灵依赖问题对项目稳定性构成潜在威胁。

**常用命令**:
```bash
npm install
npm install <package_name>
npm uninstall <package_name>
npm run <script_name>
```

### 2. Yarn (Yet Another Resource Negotiator)

Yarn 由 Facebook 在 2016 年推出，旨在解决当时 `npm` 存在的性能慢、不确定性和安全性等核心痛点。

**设计与演进**:
- **核心理念**: Yarn 的设计目标是**速度、可靠性和安全性**。它通过并行下载、全局缓存机制显著提升了安装速度。其标志性的 `yarn.lock` 文件保证了依赖安装的"确定性"，即任何人在任何机器上安装，得到的 `node_modules` 结构都是完全一样的。
- **结构**: Yarn 同样采用了和 `npm` v3+ 类似的扁平化 `node_modules` 结构，因此也存在幽灵依赖的问题。
- **版本割裂**: Yarn v2+（Berry）引入了 Plug'n'Play (PnP) 策略，不再使用 `node_modules`，这虽然带来了极致的启动速度，但也引发了与现有生态的兼容性问题，采纳率相对有限。我们通常讨论的 Yarn 指的是其 v1 经典版本。

**优缺点**:
- **优点**: 性能优异，确定性强，Workspaces 对 Monorepo 支持良好。
- **缺点**: 需要额外安装，v2+版本存在生态兼容性挑战。

**常用命令 (Yarn v1)**:
```bash
yarn install (或直接 yarn)
yarn add <package_name>
yarn remove <package_name>
yarn <script_name>
```

### 3. pnpm (Performant npm)

`pnpm` 是一个后起之秀，它的核心设计理念是**速度和极致的磁盘空间效率**，并从根本上解决了"幽灵依赖"问题。

**设计与演进**:
- **核心理念**: `pnpm` 采用**内容寻址存储 + 符号链接（Symlinks）**的策略。所有包的物理文件只会在全局存储区（`~/.pnpm-store`）存放一次。在项目中，`node_modules` 通过符号链接指向全局仓库中的文件。
- **结构**: `pnpm` 的 `node_modules` 结构非常巧妙。只有在 `package.json` 中明确声明的依赖，才会以符号链接的形式出现在 `node_modules` 顶层。而所有包的实体文件，以及它们之间的依赖关系，则被有序地存放在一个名为 `.pnpm` 的隐藏目录中。
  还是那个例子，`pnpm` 生成的结构（简化后）如下：
  ```
  node_modules/
  ├── foo -> ./.pnpm/foo@1.0.0/node_modules/foo  (我是个符号链接)
  ├── bar -> ./.pnpm/bar@1.0.0/node_modules/bar  (我也是个符号链接)
  └── .pnpm/
      ├── foo@1.0.0/
      │   └── node_modules/
      │       ├── foo/ (这里是我的实体文件)
      │       └── baz -> ../../baz@1.0.0/node_modules/baz (我需要 baz，pnpm 给我链接过来)
      ├── bar@1.0.0/
      │   └── node_modules/
      │       ├── bar/ (这里是我的实体文件)
      │       └── baz -> ../../baz@1.0.0/node_modules/baz (我也需要 baz，pnpm 给我链接过来)
      └── baz@1.0.0/
          └── node_modules/
              └── baz/ (baz 的实体文件，全局只有一份)
  ```
  这种方式确保了你的代码无法访问到未在 `package.json` 中声明的 `baz`，因为顶层根本没有它。这就彻底杜绝了幽灵依赖。

**优缺点**:
- **优点**: 磁盘空间占用极小，安装速度（尤其在缓存命中时）极快，依赖管理严格可靠，对 Monorepo 的支持被公认为最出色。
- **缺点**: 极少数不遵循 Node.js 模块解析标准的旧工具可能无法正确处理符号链接。

**常用命令**:
```bash
pnpm install
pnpm add <package_name>
pnpm remove <package_name>
pnpm <script_name>
```

## 深度解析：潜伏在项目中的"幽灵依赖"

"幽灵依赖" (Phantom Dependencies) 是在使用 `npm` 或 `Yarn` 的扁平化 `node_modules` 结构时，一种非常常见但极其危险的现象。它指的是**项目代码能够引用到那些并未在 `package.json` 中明确声明的包。**

这个问题的根源在于"提升"（hoisting）机制。虽然提升解决了依赖重复的问题，但它也把所有子依赖都暴露在了 `node_modules` 的顶层，让你的代码可以轻易地访问到它们。

#### 一个典型的"埋雷"与"爆雷"场景

让我们通过一个具体的场景，看看幽灵依赖是如何悄无声息地破坏你的项目的：

**第一步：埋下隐患 (The "Good" Times)**

1.  你在你的 `webapp` 项目中，安装了一个非常流行的工具包，比如 `vite`。
    ```bash
    npm install vite
    ```

2.  你查阅 `vite` 的 `package.json`，发现它依赖了 `esbuild` 这个强大的 JavaScript 编译器和打包工具。

3.  当你运行 `npm install` 后，`npm` 会将 `esbuild` "提升"到 `node_modules` 的顶层。
    ```
    node_modules/
    ├── vite/
    └── esbuild/  <-- 被提升上来的子依赖
    ```

4.  某一天，你需要一个快速的 JS 转换功能，你记起了 `esbuild`。你尝试在你的代码中直接 `require('esbuild')` 或 `import 'esbuild'`，然后惊奇地发现——它竟然可以工作！你没有在 `package.json` 中添加 `esbuild`，但代码运行得很好。你觉得这很方便，于是就这么用了。

至此，一颗定时炸弹已经被埋下。你的项目现在隐式地依赖了 `esbuild`。

**第二步：引爆炸弹 (When Things Go Wrong)**

几个月后，发生了以下任意一种情况：

*   **场景A：`vite` 更新**
    `vite` 的作者发布了一个新版本，决定用 `swc` 来替换 `esbuild` 以获得更好的性能。你开心地运行 `npm update vite`。

*   **场景B：依赖清理**
    一位新同事加入了项目，他非常注重规范，运行了 `npm prune` 或者删掉 `node_modules` 和 `lock` 文件重装，以确保依赖的纯净。

在这两种情况下，`npm` 会重新计算依赖树。它发现 `esbuild` 不再是任何包的直接或间接依赖了，于是**毫不留情地将它从 `node_modules` 中删除了**。

此时，当你再次运行你的项目时，所有之前调用了 `esbuild` 的地方都会抛出 `Error: Cannot find module 'esbuild'` 的致命错误。项目瞬间崩溃。

你会感到非常困惑：为什么之前一直好好的代码突然不能工作了？`package.json` 里明明没有动过 `esbuild` 相关的配置。这就是幽灵依赖最可怕的地方：它让你的依赖关系变得不可靠、不可预测，并且在问题爆发时，很难追踪到根本原因。

#### 如何避免幽灵依赖？

1.  **养成良好习惯**: 始终确保你代码中 `import`/`require` 的每一个包，都在 `package.json` 中有明确的声明。如果你需要用 `esbuild`，就老老实实地运行 `npm install esbuild -D`。
2.  **使用 `pnpm`**: 这是最根本的解决方案。`pnpm` 的符号链接机制从设计上就杜绝了幽灵依赖的出现，确保你的代码只能访问到你明确声明过的依赖，让你的项目更加健壮。

## Monorepo：新时代的多项目管理方案

随着前端应用变得越来越复杂，我们常常需要将一个庞大的系统拆分成多个、更小、更专注的包（package）。例如，一个项目中可能包含：
- `@my-app/webapp`: 主应用
- `@my-app/mobile`: 移动端应用
- `@my-app/ui`: 共享的 React 组件库
- `@my-app/utils`: 共享的工具函数库
- `@my-app/eslint-config`: 统一的 ESLint 配置
- `@my-app/tsconfig`: 统一的 TypeScript 配置

管理这些相互关联的包，就引出了两种主要的策略：`Polyrepo` 和 `Monorepo`。

### Polyrepo 的困境：当每个项目都是一座孤岛

`Polyrepo`（多仓库）是传统的做法：为每一个包创建一个独立的 Git 仓库。这种方式在项目初期很简单，但随着包的数量和它们之间关联的增强，很快就会演变成一场管理噩梦：

1.  **版本管理的混乱**：`@my-app/ui` 更新了一个组件，`webapp` 和 `mobile` 都需要使用这个新版本。你必须先发布 `ui` 包，然后分别去 `webapp` 和 `mobile` 的仓库里更新依赖版本，再发布它们。这个过程极其繁琐、耗时且容易出错。
2.  **代码复用与同步困难**：想在多个项目中共享 ESLint 或 TypeScript 配置？你只能把配置文件传来传去，或者把它们也发布成一个 npm 包。当配置需要更新时，又是一轮痛苦的同步过程。
3.  **原子化提交的缺失**：一个功能的实现可能需要同时修改 `ui` 包和 `webapp` 包。在 Polyrepo 中，这会被分散在两个仓库的两个独立的 commit 和 PR 中，使得代码审查（Code Review）难以关联上下文，也让代码回滚变得异常复杂。
4.  **重复的工程化配置**：每个仓库都需要独立配置 CI/CD、构建脚本、测试环境，造成了大量的重复劳动。

### Monorepo 的哲学：聚合力量，简化协作

`Monorepo`（单体仓库）正是为了解决上述所有问题而生。它是一种将所有相关联的包都放在同一个 Git 仓库中进行管理的代码策略。这**并不是简单地把所有代码都塞进一个大文件夹**，而是一套基于现代化工具链的、结构化的工程化方案。

其核心优势在于：

-   **简化的依赖管理**：借助 `workspaces` 特性，你可以直接在 `webapp` 中引用 `ui` 包的源码，而无需经过发布流程。所有内部包之间的依赖关系通过符号链接实现，任何修改都能即时生效。
-   **原子化的变更**：一个 commit 可以同时包含对 `ui` 和 `webapp` 的修改。这使得功能开发、Bug修复和重构都变得无比清晰，一个 PR 就能搞定所有事情。
-   **极致的代码共享**：创建共享的 `tsconfig`、`eslint-config` 或 `utils` 包变得轻而易举，所有项目都能方便地复用它们，保证了整个代码库的一致性和规范性。
-   **统一的工作流**：所有包共享一套构建、测试和发布的 CI/CD 流程，大大减少了重复配置。

### 超越 Workspaces：专业 Monorepo 工具的角色

虽然 `pnpm` 等包管理器提供的 `workspaces` 功能是 Monorepo 的基石，但当项目规模变得非常庞大时，我们还需要更专业的工具来解决两个核心问题：**"如何高效地运行任务"** 和 **"如何避免不必要的重复工作"**。

这就是 **`Turborepo`** 和 **`Nx`** 这类 "Monorepo 构建系统" 或 "任务运行器" 大显身手的地方。它们在 `pnpm` 的基础上，提供了更强大的能力：

-   **任务编排**：理解包之间的依赖关系。例如，在构建 `webapp` 之前，它知道必须先构建 `ui` 包。
-   **远程缓存**：`Turborepo` 可以将构建产物（如 `dist` 目录）缓存到云端。当你的同事或者 CI 服务器需要构建同一个 commit 时，可以直接下载缓存，而不是在本地重新构建一遍，极大地缩短了构建时间。
-   **任务筛选**：只对发生变化了的包，以及依赖这些变化包的其他包，执行构建或测试任务，避免了对整个代码库进行不必要的操作。

### 实战：搭建一个基于 pnpm + Turborepo 的高性能 Monorepo

让我们以前面的 `pnpm` 示例为基础，将其升级为一个更贴近生产环境的、由 `Turborepo` 驱动的 Monorepo。

**1. 初始化项目并引入 Turborepo**
```bash
# 使用 Turborepo 官方脚手架快速创建
npx create-turbo@latest
```
这个命令会自动帮你生成一个包含 `pnpm-workspace.yaml`、示例 `apps` 和 `packages` 的标准 Monorepo 结构，并且根目录的 `package.json` 中已经配置好了 `turbo` 命令。

**2. 核心配置文件：`turbo.json`**

`Turborepo` 的所有魔力都配置在根目录的 `turbo.json` 文件中。
```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      // "build" 任务依赖于它所在包的所有内部依赖的 "build" 任务
      "dependsOn": ["^build"],
      // "build" 任务的产出物在这些目录，Turborepo 会缓存它们
      "outputs": ["dist/**", ".next/**"]
    },
    "lint": {},
    "dev": {
      // "dev" 任务是持续运行的，并且不会产生可缓存的输出
      "cache": false,
      "persistent": true
    }
  }
}
```

**3. 创建共享的 TypeScript 配置**

让我们创建一个共享的 `tsconfig` 包，供所有其他包使用。

-   创建包：`mkdir -p packages/tsconfig`
-   在 `packages/tsconfig/package.json` 中写入：
    ```json
    { "name": "@my-app/tsconfig", "version": "0.0.0" }
    ```
-   在 `packages/tsconfig/base.json` 中写入你的基础 TS 配置：
    ```json
    {
      "$schema": "https://json.schemastore.org/tsconfig",
      "display": "Default",
      "compilerOptions": {
        "target": "es2021",
        "module": "commonjs",
        // ... 其他通用配置
      }
    }
    ```

**4. 在其他包中使用共享配置**

现在，在 `apps/webapp` 的 `package.json` 中添加对这个配置包的依赖：
```bash
# 在 webapp 目录下
pnpm add @my-app/tsconfig@workspace:* --save-dev
```

然后，在 `apps/webapp/tsconfig.json` 中，你可以直接继承这个共享配置：
```json
{
  "extends": "@my-app/tsconfig/base.json",
  "compilerOptions": {
    // ... webapp 特有的配置
  },
  "include": ["."],
  "exclude": ["dist", "build", "node_modules"]
}
```

**5. 运行任务**

有了 `Turborepo`，你不再需要用 `--filter` 来单独运行每个包的命令。直接在根目录运行：
```bash
# Turborepo 会自动检测所有包含 "build" 脚本的包，
# 并按照正确的依赖顺序，以最大并发度去执行它们。
# 第一次会比较慢，但之后由于缓存，速度会飞快。
turbo build
```

通过 `pnpm Workspaces` + `Turborepo` 的组合，我们构建起了一个既结构清晰、协作简单，又具备极致运行效率和高度可扩展性的现代化 Monorepo 工作流。

在此库中做了实现：https://github.com/Mengbooo/codeConfig 

## 总结与选择建议

| 特性 | npm | Yarn (v1 Classic) | pnpm |
| :--- | :--- | :--- | :--- |
| **node_modules 结构** | 扁平 | 扁平 | 符号链接 + 非扁平 |
| **磁盘空间** | 较大 | 较大 | **极小** |
| **安装速度** | 中等 | 快 | **极快** |
| **幽灵依赖** | 存在 | 存在 | **不存在** |
| **Monorepo 支持** | 良好 (Workspaces) | 优秀 (Workspaces) | **卓越** |
| **确定性** | 是 (`package-lock.json`) | 是 (`yarn.lock`) | 是 (`pnpm-lock.yaml`) |

**如何选择？**
- **新项目 / 个人项目**: **强烈推荐 `pnpm`**。它集速度、效率和严格性于一身，代表了未来的发展方向。
- **大型 Monorepo 项目**: **首选 `pnpm`**。其卓越的性能和磁盘空间管理能力在大型复杂项目中表现得淋漓尽致。
- **需要最大兼容性的老项目**: 如果项目依赖了一些非常古老的工具，或者团队成员对新工具接受度不高，**`npm`** 仍然是一个最稳妥、最不会出错的选择。
- **维护旧项目**: 如果项目已经在使用 **Yarn v1**，并且工作得很好，那么继续使用它完全没有问题。但对于新项目，除非你有特定理由要使用 Yarn Berry，否则 `pnpm` 通常是更好的起点。

最终，选择哪个包管理器取决于你的项目需求、团队偏好和对工具特性的权衡。但毫无疑问，`pnpm` 凭借其创新的设计，正在成为越来越多开发者的首选。


