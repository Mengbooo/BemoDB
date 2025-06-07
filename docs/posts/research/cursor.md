---
title: something about Cursor
date: '2025-06-07'
tags:
- research
---

# something about Cursor
上个月，我主要使用的 IDE 从 VScode 换成了 Cursor，体感只能说是相当的无缝（于我而言就是多了一个对话框），不过Cursor本身的使用有点小门槛，这里记录一下有关 Cursor 使用的一些 tips。

## 快捷键
1. `Cmd/Ctrl + K`：激活AI对话框
2. `Cmd/Ctrl + L`：选中当前行
3. `Cmd/Ctrl + /`：切换行注释
4. `Cmd/Ctrl + Shift + P`：打开命令面板

## chat、composer 和 bug finder
- chat和平时我们使用的对话模型其实差不多，个人感觉可以问问一些简单的问题。反正我这一个月也没用几次
- composer是最主要的一个功能，它主要能帮你做代码相关的工作例如生成、修改。并能补全到文件中
- bug finder则主要关注于解决bug，用的也比较少，在composer中一般就能解决bug

## 如何搜索
使用 `@` 能实现很多功能，例如 @web 能实现联网搜索、@+文件路径（这个也可以通过拖拽文件到聊天框实现）实现文件索引、@codebase能触发代码库的查询。

## 亮点功能
- 上传图片可以根据图片写网页
- 上下文理解（比原来的 VScode 的 FittenCode 插件强太多了）
- AI agent 具有的大部分优点它都有
- ···

## 无限续杯
Cursor pro的价格还是有点贵，不过好在它能无限续杯。为此你需要：
- 注册一个 2925无限邮，这个能实现注册 n 个试用账号，但是到后面 Cursor 会查询你的机器码，然后就会导致不能再白嫖。
- 下载`cursor-fake-machine`插件改变Cursor的机器码，这个在 Cursor 插件里就能搜到。
- 或者`go-cursor-help`，对于我这样的Windows用户，在 PowerShell 里运行：
```
irm https://raw.githubusercontent.com/yuaotian/go-cursor-help/master/scripts/install.ps1 | iex
```
::: details For Linux\MacOS
curl -fsSL https://raw.githubusercontent.com/yuaotian/go-cursor-help/master/scripts/install.sh | sudo bash
:::

::: danger Updated 250418
嘻嘻，被封号了
:::