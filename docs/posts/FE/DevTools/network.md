---
title: Network
date: '2025-06-07'
tags:
- FE
---

# Network

讲讲 Network 面板的使用技巧。

## 隐藏 network overview

你经常查看 `Network` 面板是为了:

- 我想看看请求的时间轴信息
- 我就想看看请求列表- 确认下请求状态，资源大小和响应结果呢

我赌你是后者，如果是这样，那么 `Overview` 的部分就没有任何理由占用 `Network` 接近一半的空间。隐藏它！

于是就可以点击 `TimeLine` 符号

## Request initiator 显示了调用堆栈信息

Network 面板中的 initiator 这一列显明了是哪个脚本的哪一行触发了请求。它显示了在调用堆栈中触发请求的最后一步。但如果你用的是，例如：一个本地化的 fetch API， 那它将会指向一些低层级的类库的代码 - 例如 当我们在 Angular 配合使用 Axios 或者 zone.js 的时候，这时指向的是 xhr.js

除了这些外部库之外，如果你希望查看代码的哪一部分触发了请求。 将鼠标悬停在显示的 initiator（例如 外部库）上，你将看到完整的调用堆栈，包括你的文件

## 请求过滤

`Network` 面板中的过滤器输入框接受字符串或正则表达式，对应显示匹配的请求。 但是你也可以使用它来过滤很多属性。

只需输入 例如 `method` 或者 `mime-type` 

如果想要显示所有可能的关键字，在空白的输入框按下 `[ctrl] + [space]`

## 自定义请求表

在请求表中，你可以看到有关每个请求的几条信息，例如：Status， Type， Initiator， Size 和 Time。但是你同样可以添加更多(例如 Method)。

## 重新发送 `XHR` 的请求

Network > Headers > Replay XHR

## XHR/fetch 断点

在某一特定时刻，你想要对已发送的 “ajax” 请求进行捕获怎么做呢？ 可以使用 `XHR/fetch breakpoint` 。

::: tip 
这些只能在 Source 面板中设置
:::

你可以添加部分 URL 作为触发器或监听任何请求：

Sources > XHR/fetch Breakpoints > 点击 + 添加一个请求断点 > 填入URL来暂停这些requests/或者保持空白来暂停任何的requests > 右键断点从而移除它












































































































































































































