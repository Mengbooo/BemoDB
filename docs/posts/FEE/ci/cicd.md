---
title: FEE#012 - CI/CD | GitHub Actions 实战指南
date: "2025-07-06"
tags:
  - Front-end engineering
---

# FEE#012 - CI/CD | GitHub Actions 实战指南

还记得我们以前是怎么发布前端项目的吗？手动运行测试、手动打包、手动上传到服务器...每一步都充满了人工操作的痛苦和可能的错误。如今，CI/CD（持续集成/持续交付）已经成为现代前端开发的标配，而GitHub Actions则是最受欢迎的CI/CD工具之一。

## CI/CD：从概念到实践

在深入GitHub Actions之前，让我们先简单理解一下CI/CD的核心概念：

- **持续集成（CI）**：频繁地将代码合并到主分支，并自动进行构建和测试，尽早发现问题。
- **持续交付/部署（CD）**：自动将验证通过的代码部署到测试环境或生产环境。

想象一下，你刚完成了一个新功能的开发，提交了代码并创建了Pull Request。此时，GitHub Actions自动开始工作：运行代码检查、执行测试、构建应用...如果一切顺利，它甚至可以自动部署到测试环境。这就是CI/CD的魅力所在。

## GitHub Actions：工作原理与核心概念

GitHub Actions是GitHub提供的自动化工作流工具，它允许你直接在GitHub仓库中定义、创建和运行自动化工作流。

### 核心概念

1. **工作流（Workflow）**：自动化流程的配置，定义在仓库的`.github/workflows`目录下的YAML文件中。

2. **事件（Event）**：触发工作流的GitHub事件，如push、pull request或定时触发。

3. **作业（Job）**：工作流中的一个独立任务单元，可以包含多个步骤。

4. **步骤（Step）**：作业中的最小单位，可以运行命令或使用动作。

5. **动作（Action）**：可重用的工作单元，相当于预定义好的步骤，可以直接引用。

6. **运行器（Runner）**：执行工作流的服务器，GitHub提供免费的运行器，也可以使用自托管的运行器。

### 工作流文件结构

一个典型的GitHub Actions工作流文件（如`.github/workflows/ci.yml`）结构如下：

```yaml
name: CI/CD Pipeline  # 工作流名称

on:  # 触发条件
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:  # 定义作业
  build:  # 作业名称
    runs-on: ubuntu-latest  # 运行环境
    
    steps:  # 步骤列表
    - name: Checkout code  # 步骤名称
      uses: actions/checkout@v3  # 使用预定义的动作
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:  # 动作的参数
        node-version: '16'
```

## 从零开始：为前端项目配置GitHub Actions

接下来，我们将一步步为一个典型的React前端项目配置完整的CI/CD流程。

### 第一步：创建基础工作流文件

首先，在你的项目中创建`.github/workflows/ci-cd.yml`文件：

```yaml
name: 前端CI/CD流程

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: 使用Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '16'
        cache: 'npm'
    - name: 安装依赖
      run: npm ci
    - name: 运行测试
      run: npm test
    - name: 构建应用
      run: npm run build
```

这个简单的工作流会在每次推送到main分支或创建针对main分支的Pull Request时触发，然后检出代码、设置Node.js环境、安装依赖、运行测试并构建应用。

### 第二步：添加代码质量检查

代码质量对于团队协作至关重要，我们可以添加ESLint和Prettier检查：

```yaml
- name: 代码风格检查
  run: npm run lint
  
- name: 代码格式检查
  run: npm run format:check
```

确保你的`package.json`中有相应的脚本：

```json
{
  "scripts": {
    "lint": "eslint src --ext .js,.jsx,.ts,.tsx",
    "format:check": "prettier --check \"src/**/*.{js,jsx,ts,tsx,css,scss}\""
  }
}
```

### 第三步：优化测试和构建过程

为了提高CI/CD的效率，我们可以添加缓存和并行执行：

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: 使用Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '16'
        cache: 'npm'
    - name: 安装依赖
      run: npm ci
    - name: 代码检查
      run: npm run lint
    - name: 运行测试
      run: npm test
      
  build:
    needs: test  # 等待测试作业完成
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: 使用Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '16'
        cache: 'npm'
    - name: 安装依赖
      run: npm ci
    - name: 构建应用
      run: npm run build
    - name: 上传构建产物
      uses: actions/upload-artifact@v3
      with:
        name: build-files
        path: build/
```

这样，我们将测试和构建分成了两个独立的作业，并且只有在测试通过后才会执行构建。同时，我们还保存了构建产物，以便后续部署使用。

### 第四步：添加自动部署

最后，我们添加自动部署到不同环境的配置：

```yaml
deploy-staging:
  needs: build
  if: github.event_name == 'push' && github.ref == 'refs/heads/main'
  runs-on: ubuntu-latest
  steps:
  - name: 下载构建产物
    uses: actions/download-artifact@v3
    with:
      name: build-files
      path: build
  - name: 部署到测试环境
    uses: netlify/actions/cli@master
    with:
      args: deploy --dir=build --site-id ${{ secrets.NETLIFY_SITE_ID_STAGING }}
    env:
      NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}

deploy-production:
  needs: deploy-staging
  if: github.event_name == 'push' && github.ref == 'refs/heads/main'
  runs-on: ubuntu-latest
  environment:
    name: production
    url: https://your-app-production.netlify.app
  steps:
  - name: 下载构建产物
    uses: actions/download-artifact@v3
    with:
      name: build-files
      path: build
  - name: 部署到生产环境
    uses: netlify/actions/cli@master
    with:
      args: deploy --dir=build --prod --site-id ${{ secrets.NETLIFY_SITE_ID_PRODUCTION }}
    env:
      NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
```

注意，我们使用了GitHub的环境（environment）功能来增加生产环境部署的保护，这可能需要手动批准。

## 实战案例：完整的React应用CI/CD流程

让我们来看一个更完整的React应用CI/CD配置示例，包含了测试、构建、部署和通知功能。

### 项目结构

```
my-react-app/
├── .github/
│   └── workflows/
│       └── ci-cd.yml
├── src/
│   ├── components/
│   ├── pages/
│   └── App.js
├── .eslintrc.js
├── .prettierrc
├── jest.config.js
├── package.json
└── README.md
```

### 完整的CI/CD配置

```yaml
name: React应用CI/CD流程

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  # 代码质量检查
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: 设置Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'
          cache: 'npm'
      - name: 安装依赖
        run: npm ci
      - name: 运行ESLint
        run: npm run lint
      - name: 检查代码格式
        run: npm run format:check

  # 单元测试
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: 设置Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'
          cache: 'npm'
      - name: 安装依赖
        run: npm ci
      - name: 运行测试
        run: npm test -- --coverage
      - name: 上传测试覆盖率报告
        uses: codecov/codecov-action@v3
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
          
  # 构建应用
  build:
    needs: [lint, test]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: 设置Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'
          cache: 'npm'
      - name: 安装依赖
        run: npm ci
      - name: 构建应用
        run: npm run build
        env:
          REACT_APP_API_URL: ${{ secrets.API_URL }}
      - name: 上传构建产物
        uses: actions/upload-artifact@v3
        with:
          name: build-files
          path: build/
          retention-days: 1

  # 部署到测试环境
  deploy-staging:
    needs: build
    if: github.event_name == 'push' && (github.ref == 'refs/heads/develop' || github.ref == 'refs/heads/main')
    runs-on: ubuntu-latest
    environment:
      name: staging
      url: ${{ steps.deploy.outputs.deploy-url }}
    steps:
      - name: 下载构建产物
        uses: actions/download-artifact@v3
        with:
          name: build-files
          path: build
      - name: 部署到Netlify测试环境
        id: deploy
        uses: netlify/actions/cli@master
        with:
          args: deploy --dir=build --alias=staging
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
      - name: 发送Slack通知
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          fields: repo,message,commit,author,action,workflow
          text: '测试环境部署完成 👉 ${{ steps.deploy.outputs.deploy-url }}'
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
        if: always()

  # 部署到生产环境
  deploy-production:
    needs: deploy-staging
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://your-app.com
    steps:
      - name: 下载构建产物
        uses: actions/download-artifact@v3
        with:
          name: build-files
          path: build
      - name: 部署到Netlify生产环境
        uses: netlify/actions/cli@master
        with:
          args: deploy --dir=build --prod
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
      - name: 发送Slack通知
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          fields: repo,message,commit,author,action,workflow
          text: '🚀 生产环境部署完成'
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
        if: always()
```

### 配置说明

这个完整的配置包含了以下几个部分：

1. **代码质量检查**：使用ESLint和Prettier检查代码质量和格式。

2. **单元测试**：运行Jest测试并上传覆盖率报告到Codecov。

3. **构建应用**：构建React应用并保存构建产物。

4. **部署到测试环境**：当代码推送到develop或main分支时，自动部署到Netlify的测试环境。

5. **部署到生产环境**：当代码推送到main分支时，在测试环境部署成功后，自动部署到Netlify的生产环境（可能需要手动批准）。

6. **通知**：使用Slack通知部署结果。

## GitHub Actions的高级技巧

### 1. 使用环境变量和密钥

GitHub Actions提供了安全存储和使用密钥的机制：

```yaml
steps:
  - name: 使用API密钥
    run: echo ${{ secrets.API_KEY }}
```

你可以在仓库的Settings > Secrets and variables > Actions中添加密钥。

### 2. 条件执行

根据不同条件执行步骤：

```yaml
steps:
  - name: 只在主分支执行
    if: github.ref == 'refs/heads/main'
    run: echo "这是主分支"
```

### 3. 矩阵构建

在多种环境中测试你的应用：

```yaml
jobs:
  test:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        node-version: [14, 16, 18]
    steps:
      - uses: actions/checkout@v3
      - name: 使用Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
      - run: npm test
```

### 4. 重用工作流

创建可重用的工作流，减少重复配置：

```yaml
# .github/workflows/reusable.yml
name: 可重用工作流
on:
  workflow_call:
    inputs:
      node-version:
        required: true
        type: string
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: ${{ inputs.node-version }}
```

在其他工作流中使用：

```yaml
jobs:
  call-workflow:
    uses: ./.github/workflows/reusable.yml
    with:
      node-version: '16'
```

### 5. 手动触发工作流

创建可以手动触发的工作流：

```yaml
on:
  workflow_dispatch:
    inputs:
      environment:
        description: '部署环境'
        required: true
        default: 'staging'
        type: choice
        options:
        - staging
        - production
```

这样，你可以在GitHub界面上手动触发工作流，并选择部署环境。

## GitHub Actions最佳实践

### 1. 保持工作流简洁明了

- 使用有意义的名称
- 添加注释说明复杂的步骤
- 将相关步骤组织在同一个作业中

### 2. 优化构建速度

- 使用缓存减少依赖安装时间
- 只在必要时运行测试和构建
- 并行执行独立的作业

```yaml
- name: 缓存依赖
  uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-
```

### 3. 安全最佳实践

- 使用最小权限原则
- 定期更新Actions版本
- 审查第三方Actions的安全性

```yaml
permissions:
  contents: read
  issues: write
```

### 4. 自动化版本发布

使用GitHub Actions自动创建版本标签和发布说明：

```yaml
- name: 创建版本
  if: github.event_name == 'push' && github.ref == 'refs/heads/main'
  uses: actions/create-release@v1
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  with:
    tag_name: v${{ github.run_number }}
    release_name: Release v${{ github.run_number }}
    draft: false
    prerelease: false
```

### 5. 使用自托管运行器

对于特殊需求或性能要求高的构建，可以使用自托管的运行器：

```yaml
jobs:
  build:
    runs-on: self-hosted
```

## 常见问题与解决方案

### 1. 构建速度慢

**解决方案**：
- 使用缓存机制
- 只构建必要的部分
- 优化测试执行时间

### 2. 部署失败

**解决方案**：
- 检查环境变量和密钥
- 确保构建产物正确
- 添加详细的错误日志

### 3. 测试在CI中失败但本地成功

**解决方案**：
- 检查环境差异
- 添加调试信息
- 使用相同的Node.js版本

## 总结

GitHub Actions为前端开发者提供了强大而灵活的CI/CD解决方案，让你可以专注于代码开发，而将测试、构建和部署等繁琐任务交给自动化流程处理。通过本文介绍的配置方法和最佳实践，你应该能够为自己的前端项目设置一个完整的CI/CD流程。

好的CI/CD流程不是一成不变的，而是需要根据项目需求和团队反馈不断调整和优化。随着你对GitHub Actions的深入了解，你会发现它能够满足各种复杂的自动化需求，帮助你的团队提高开发效率和代码质量。


