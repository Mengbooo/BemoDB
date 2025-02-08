# Github 使用指北

GitHub 是一个基于 Git 的在线托管平台，提供 Git 仓库的托管服务。它为开源项目和个人开发者提供了一系列协作工具，如代码审查、问题跟踪、项目管理、Wiki 页面等。GitHub 还提供了图形用户界面，使得用户可以更容易地使用Git的功能。此外，GitHub 还提供了一些社交网络特性，如关注其他用户、星标项目（star）、对项目代码提出改进建议（fork）和提交拉取请求（pull request）。

## 基础概念

### 1. 仓库（Repository）

仓库是项目的容器，包含了项目的所有文件和版本历史。

#### 创建仓库

1. 在Github上创建：
   - 点击右上角"+"按钮
   - 选择"New repository"
   - 填写仓库名称和描述
   - 选择公开/私有
   - 选择是否初始化README

2. 本地创建并关联：
```bash
# 初始化本地仓库
git init

# 添加远程仓库
git remote add origin <repository-url>

# 设置默认分支名称
git branch -M main

# 推送到远程
git push -u origin main
```

3. 克隆现有仓库：
```bash
# 通过HTTPS克隆
git clone https://github.com/username/repository.git

# 通过SSH克隆（需要配置SSH密钥）
git clone git@github.com:username/repository.git

# 克隆特定分支
git clone -b <branch> <repository-url>

# 克隆特定标签
git clone -b <tag> <repository-url>
```

### 2. 分支（Branch）

分支用于并行开发，可以在不影响主分支的情况下开发新功能。

#### 分支操作

1. 创建分支：
```bash
# 创建新分支
git branch feature/new-feature

# 创建并切换到新分支
git checkout -b feature/new-feature

# 从特定提交创建分支
git checkout -b feature/new-feature <commit-hash>
```

2. 切换分支：
```bash
# 切换到已有分支
git checkout main

# 使用新版git命令切换
git switch main

# 切换到上一个分支
git checkout -
```

3. 分支管理：
```bash
# 查看所有本地分支
git branch

# 查看所有远程分支
git branch -r

# 查看所有分支
git branch -a

# 删除本地分支
git branch -d feature/old-feature

# 强制删除本地分支
git branch -D feature/old-feature

# 删除远程分支
git push origin --delete feature/old-feature
```

### 3. 提交（Commit）

提交是对文件修改的保存点，每个提交都有唯一的标识符。

#### 提交操作

1. 暂存修改：
```bash
# 暂存所有修改
git add .

# 暂存特定文件
git add <file-path>

# 暂存部分修改
git add -p

# 查看暂存状态
git status
```

2. 提交修改：
```bash
# 基本提交
git commit -m "feat: add new feature"

# 暂存并提交
git commit -am "fix: bug fix"

# 修改最后一次提交
git commit --amend

# 修改提交信息
git commit --amend -m "新的提交信息"
```

3. 推送到远程：
```bash
# 推送到远程分支
git push origin feature/new-feature

# 强制推送（谨慎使用）
git push -f origin feature/new-feature

# 设置上游分支并推送
git push -u origin feature/new-feature

# 推送所有分支
git push --all origin
```

#### 提交信息规范

建议使用Angular提交规范：

```bash
<type>(<scope>): <subject>

<body>

<footer>

# 类型（type）：
feat:     新功能
fix:      修复bug
docs:     文档更新
style:    代码格式（不影响代码运行的变动）
refactor: 重构（既不是新增功能，也不是修改bug的代码变动）
test:     增加测试
chore:    构建过程或辅助工具的变动

# 示例：
feat(user): add user login function
fix(auth): fix token validation
docs(api): update API documentation
```

::: tip 提示
良好的提交习惯能让项目历史更清晰，方便后期维护和协作。
:::

## 协作流程

### 1. Fork & Pull Request

1. Fork目标仓库到自己的账号
2. 克隆Fork的仓库到本地
3. 创建新分支进行修改
4. 提交修改并推送到Fork的仓库
5. 创建Pull Request

```bash
# 添加上游仓库
git remote add upstream <original-repository-url>

# 同步上游更新
git fetch upstream
git merge upstream/main
```

### 2. Issue管理

- 创建Issue报告问题或提出建议
- 使用标签分类Issue
- 关联Pull Request与Issue
- 使用关键词自动关闭Issue

```markdown
fixes #123  # PR合并后自动关闭Issue
```

### 3. 项目管理

1. Project看板
   - To Do
   - In Progress
   - Done

2. Milestone里程碑
   - 设置目标日期
   - 关联相关Issue
   - 跟踪进度

## 高级功能

### 1. Github Actions

自动化工作流配置：

```yaml
name: CI
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Build
      run: |
        npm install
        npm run build
```

### 2. Github Pages

部署静态网站：

```bash
# 配置Github Pages
git checkout -b gh-pages
git push origin gh-pages
```

### 3. Github Packages

发布包到Github包注册表：

```json
{
  "name": "@username/package",
  "publishConfig": {
    "registry": "https://npm.pkg.github.com"
  }
}
```

## 安全功能

### 1. 密钥管理

```bash
# 生成SSH密钥
ssh-keygen -t ed25519 -C "your_email@example.com"

# 添加到SSH agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
```

### 2. 仓库安全

1. 分支保护规则
   - 要求Pull Request审查
   - 要求状态检查通过
   - 限制强制推送

2. 安全警报
   - 依赖项扫描
   - 代码扫描
   - 密钥扫描

## 最佳实践

### 1. 提交规范

```bash
# 提交类型
feat:     # 新功能
fix:      # 修复bug
docs:     # 文档更新
style:    # 代码格式
refactor: # 重构
test:     # 测试
chore:    # 构建过程或辅助工具
```

### 2. 分支管理

```
main          # 主分支
├── develop   # 开发分支
├── feature/* # 功能分支
├── bugfix/*  # 修复分支
└── release/* # 发布分支
```

### 3. 文档维护

1. README.md
   - 项目描述
   - 安装说明
   - 使用示例
   - 贡献指南

2. CONTRIBUTING.md
   - 贡献流程
   - 代码规范
   - 提交规范

3. CHANGELOG.md
   - 版本更新记录
   - 重要变更说明

## 常见问题

### 1. 冲突解决

```bash
# 更新本地分支
git fetch origin
git merge origin/main

# 解决冲突后
git add .
git commit -m "fix: resolve conflicts"
```

### 2. 撤销操作

```bash
# 撤销提交
git reset --soft HEAD^    # 保留修改
git reset --hard HEAD^    # 丢弃修改

# 撤销暂存
git restore --staged <file>

# 撤销修改
git restore <file>
```

### 3. 历史清理

```bash
# 合并提交
git rebase -i HEAD~3

# 删除敏感信息
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch PATH-TO-FILE" \
  --prune-empty --tag-name-filter cat -- --all
```

## 扩展工具

1. Github Desktop
   - 图形界面操作
   - 简化常用功能

2. Github CLI
   - 命令行操作
   - 自动化脚本

3. Github Copilot
   - AI代码补全
   - 智能建议

## 注意事项

1. 安全性
   - 不要提交敏感信息
   - 使用.gitignore忽略文件
   - 定期更新依赖

2. 性能
   - 避免提交大文件
   - 使用Git LFS存储大文件
   - 定期清理无用分支

3. 协作
   - 及时同步代码
   - 遵循项目规范
   - 保持良好沟通

这份指南涵盖了Github的主要功能和使用方法，可以满足大多数开发场景的需求。随着使用的深入，你可能会发现更多有用的功能和技巧。