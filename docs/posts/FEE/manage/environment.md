---
title: FEE#006 - manage | 环境管理
date: "2025-07-05"
tags:
  - Front-end engineering
---

# FEE#006 - manage | 环境管理

在前端工程化的实践中，我们经常会遇到需要同时维护多个项目的情况。然而，不同的项目可能依赖于不同版本的 Node.js。例如，一个旧项目可能需要 Node.js 14，而一个新项目则可能需要 Node.js 18 或更高版本。如果手动在系统中切换 Node.js 版本，过程会非常繁琐且容易出错。因此，使用 Node.js 版本管理工具就显得至关重要。

## 为什么需要管理 Node.js 版本？

1.  **项目依赖**: 不同的项目可能对 Node.js 的版本有特定的要求。`package.json` 中的 `engines` 字段就明确指定了项目期望运行的 Node.js 版本范围。
2.  **兼容性问题**: Node.js 的新版本可能会引入不向后兼容的变更，或者废弃一些旧的 API。直接升级全局的 Node.js 版本可能会导致旧项目无法正常运行。
3.  **体验新特性**: 有时我们希望尝试一些 Node.js 新版本带来的实验性功能，但又不想影响现有项目的稳定性。
4.  **团队协作**: 保持团队成员之间使用一致的 Node.js 版本，可以避免因环境差异导致 "在我这里是好的" 这类问题。

为了解决这些问题，社区涌现了许多优秀的 Node.js 版本管理工具。下面我们介绍几种最流行的工具。

## 主流的 Node.js 版本管理工具

目前，市面上有许多工具可以帮助我们轻松地在不同 Node.js 版本之间进行切换，其中最受欢迎的主要有 `nvm`、`n` 和 `fnm`。

### nvm (Node Version Manager)

`nvm` 是最广为人知的 Node.js 版本管理工具。值得注意的是，`nvm` 本身并不支持 Windows，但在 Windows 平台上有一个功能类似的独立项目叫做 `nvm-windows`。它们的使用方式和命令非常相似。

#### 安装

*   **macOS / Linux**:
    可以通过 cURL 或 Wget 命令一键安装。官方推荐的安装方式是：
    ```bash
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
    ```
    安装完成后，需要根据提示将几行代码添加到你的 shell 配置文件中（如 `.bash_profile`, `.zshrc` 等）。

*   **Windows**:
    对于 Windows 用户，需要下载并运行 `nvm-windows` 的安装包。可以从 [nvm-windows 的 releases 页面](https://github.com/coreybutler/nvm-windows/releases) 找到最新的安装程序。安装过程是图形化的，非常简单。

#### 常用命令

`nvm` 的命令非常直观：

*   `nvm install <version>`: 安装指定版本的 Node.js。例如 `nvm install 18.17.0` 或 `nvm install lts/hydrogen`。
*   `nvm use <version>`: 切换到指定版本的 Node.js。这个命令只在当前 shell 会话中生效。
*   `nvm ls` 或 `nvm list`: 列出所有已安装的 Node.js 版本。
*   `nvm alias default <version>`: 设置默认的 Node.js 版本。这样每次打开新的 shell 会话时，都会自动使用这个版本。
*   `nvm current`: 显示当前正在使用的版本。
*   `nvm uninstall <version>`: 卸载指定的版本。

`nvm` 通过修改 `PATH` 环境变量的原理来实现版本切换，功能强大且稳定，是许多开发者的首选。

### n

`n` 是一个非常轻量级且简洁的 Node.js 版本管理工具，交互式 UI 做得非常出色。它的一个主要特点是不支持 Windows 系统。

#### 安装

`n` 通常通过 `npm` 全局安装：
```bash
npm install -g n
```

#### 常用命令

`n` 的命令非常简洁：

*   `n <version>`: 安装并切换到指定版本。
*   `n`: 打开一个交互式菜单，让你用上下箭头在已安装的版本中选择。
*   `n latest`: 安装并使用最新的 Node.js 版本。
*   `n lts`: 安装并使用最新的 LTS 版本。
*   `n rm <version>`: 删除指定版本。

`n` 的优点是简单易用，但它直接将 Node.js 安装到系统目录（如 `/usr/local`），可能会与系统的包管理器（如 Homebrew）产生一些权限或冲突问题。

### fnm (Fast Node Manager)

`fnm` 是一个新兴的 Node.js 版本管理器，它使用 Rust 编写，主打的特点就是"快"。它的性能比 `nvm` 要好很多，尤其是在 shell 启动时，`fnm` 对速度的优化非常明显。

#### 安装

`fnm` 同样支持跨平台安装。

*   **macOS / Linux (using Homebrew or script)**:
    ```bash
    # 使用 Homebrew
    brew install fnm
    # 或者使用脚本
    curl -fsSL https://fnm.vercel.app/install | bash
    ```
*   **Windows (using Scoop or Chocolatey)**:
    ```bash
    # 使用 Scoop
    scoop install fnm
    # 使用 Chocolatey
    choco install fnm
    ```
    安装后同样需要根据提示将 `fnm env` 命令添加到你的 shell 配置文件中。

#### 常用命令

`fnm` 的命令设计得与 `nvm` 非常相似，迁移成本很低：

*   `fnm install <version>`: 安装版本。
*   `fnm use <version>`: 切换版本。
*   `fnm list`: 列出已安装版本。
*   `fnm default <version>`: 设置默认版本。

如果你对 shell 的启动速度有要求，或者喜欢尝试新潮且高效的工具，`fnm` 是一个绝佳的选择。

## 总结与建议

| 工具 | 优点 | 缺点 | 推荐场景 |
| :--- | :--- | :--- | :--- |
| **nvm** | 功能强大，生态成熟，社区支持好 | 启动 shell 时有轻微延迟，Windows 版本是独立项目 | 大多数开发场景，特别是需要稳定可靠的方案时 |
| **n** | 简单轻量，交互式 UI 体验好 | 不支持 Windows，可能会有权限问题 | macOS/Linux 用户，追求极简操作 |
| **fnm** | 速度极快，跨平台支持好，兼容 `.nvmrc` | 相对较新，生态和社区不如 nvm 成熟 | 对性能和 shell 启动速度有极致要求的用户 |

总的来说，这三款工具都非常优秀。
- 如果你是一个 Windows 用户，`nvm-windows` 是最稳妥的选择。
- 如果你是 macOS/Linux 用户，`nvm` 和 `fnm` 都是不错的选择，你可以根据自己对性能和生态的偏好来决定。
- 如果你喜欢极简的工具，并且不介意它的一些局限性，`n` 也会是一个有趣的尝试。

通过使用这些版本管理工具，我们可以告别手动管理 Node.js 版本的混乱，更高效、更专业地进行前端开发。

































































































































