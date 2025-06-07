---
title: URL 简介
date: '2025-06-07'
tags:
- FE
---

# URL 简介

前端要干的活很大一部分是`索取资源-加载资源`，这就不得不提到 URL，译名为"统一资源定位符"（Uniform Resource Locator），中文叫"网址"。"资源定位"是个很贴切的词语，所谓资源，可以简单理解成各种可以通过互联网访问的文件，比如网页、图像、音频、视频、JavaScript 脚本；只要资源可以通过互联网访问，它就必然有对应的 URL。一个 URL 对应一个资源，但是同一个资源可能对应多个 URL。

## URL 的组成部分

让我们通过一个完整的 URL 示例来分析其组成部分：

``` txt
https://www.example.com:80/path/to/myfile.html?key1=value1&key2=value2#anchor
```

### 1. 协议（Protocol）`https://`
- 表示客户端和服务器之间通信的协议
- 常见协议：http、https、ftp、file 等
- https 是 http 的安全版本，使用 SSL/TLS 加密通信

### 2. 主机名（Hostname）`www.example.com`
- 可以是域名或 IP 地址
- 域名是 IP 地址的别名，更容易记忆
- 通过 DNS 服务将域名解析为 IP 地址

### 3. 端口号（Port）`:80`
- 用于指定服务器上的特定服务
- 是可选的，如果省略则使用默认端口
- HTTP 默认端口是 80
- HTTPS 默认端口是 443

### 4. 路径（Path）`/path/to/myfile.html`
- 指向服务器上资源的具体位置
- 使用斜杠（/）分隔目录和文件
- 可以包含多级目录

### 5. 查询参数（Query Parameters）`?key1=value1&key2=value2`
- 以问号（?）开始
- 使用 & 符号分隔多个参数
- 每个参数都是键值对（key=value）形式
- 用于向服务器传递额外信息

### 6. 片段标识符（Fragment Identifier）| 锚点 `#anchor`
- 以井号（#）开始
- 指向页面内的特定部分
- 不会发送到服务器
- 常用于页面内导航
- 点击这段文字的标题前面的`#`再观察URL试试🤗

## URL 编码

URL 只能使用 ASCII 字符集来通过因特网进行发送。由于 URL 常常会包含 ASCII 集合之外的字符，所以需要进行 URL 编码。

URL 编码使用 "%" 其后跟随两位的十六进制数来替换非 ASCII 字符。

例如：
- 空格被编码为：`%20`
- 中文"中国"被编码为：`%E4%B8%AD%E5%9B%BD`

```javascript
// JavaScript 中的 URL 编码/解码方法
encodeURIComponent('中国'); // "%E4%B8%AD%E5%9B%BD"
decodeURIComponent('%E4%B8%AD%E5%9B%BD'); // "中国"
```

## URL 的特殊形式

### 1. 相对 URL
- 不包含协议和主机名的 URL
- 相对于当前页面的位置解析
- 例如：`../images/photo.jpg`

### 2. 数据 URL
- 以 `data:` 开头
- 直接在 URL 中嵌入数据
- 常用于小图片或简单文本
``` txt
data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==
```

### 3. 锚点 URL
- 只包含片段标识符
- 用于页面内跳转
- 例如：`#section1`

## URL 最佳实践

1. **安全性考虑**
   - 使用 HTTPS 而不是 HTTP
   - 注意 URL 中的敏感信息
   - 对用户输入进行编码

2. **可读性**
   - 使用有意义的路径名
   - 保持 URL 结构清晰
   - 避免过长的 URL

3. **兼容性**
   - 避免特殊字符
   - 考虑 URL 长度限制
   - 使用小写字母

4. **SEO 友好**
   - 使用有意义的关键词
   - 保持 URL 简洁
   - 使用连字符（-）而不是下划线（_）

## 相关 API

在前端开发中，我们可以使用以下 API 来处理 URL：

```javascript
// URL 对象
const url = new URL('https://example.com/path?name=test');
console.log(url.hostname); // "example.com"
console.log(url.searchParams.get('name')); // "test"

// Location 对象
console.log(window.location.href); // 当前页面的完整 URL
console.log(window.location.pathname); // 当前页面的路径部分

// URLSearchParams
const params = new URLSearchParams('?name=test&age=25');
console.log(params.get('name')); // "test"
```


## 绝对 URL 与相对 URL

### 绝对 URL
绝对 URL 包含了访问资源所需的全部信息，无论当前页面的位置如何，都能准确定位到资源。

```html
<img src="https://example.com/images/photo.jpg">
<a href="https://example.com/about.html">关于我们</a>
```

特点：
- 完整指定了协议和主机名
- 不依赖当前页面的位置
- 可以指向任何位置的资源
- 文件移动时不需要修改

### 相对 URL
相对 URL 是相对于当前文档位置的路径。它不包含协议和主机名，更简洁但依赖于上下文。

```html
<!-- 当前页面位置：https://example.com/blog/post.html -->
<img src="../images/photo.jpg">  <!-- 解析为：https://example.com/images/photo.jpg -->
<a href="./about.html">关于</a>  <!-- 解析为：https://example.com/blog/about.html -->
```

常见的相对路径表示：
- `./` 当前目录
- `../` 上一级目录
- `../../` 上上级目录
- `/` 网站根目录
- 直接写文件名表示当前目录
- VScode有URL自动填充插件

## `<base>` 标签
`<base>` 标签用于指定文档中所有相对 URL 的基础 URL。它必须放在 `<head>` 标签内，且在所有使用 URL 的元素之前。

```html
<head>
  <base href="https://example.com/blog/">
</head>
<body>
  <!-- 以下URL会基于base标签解析 -->
  <img src="images/photo.jpg">  <!-- https://example.com/blog/images/photo.jpg -->
  <a href="about.html">关于</a> <!-- https://example.com/blog/about.html -->
</body>
```

`<base>` 标签的特点：
1. 一个文档只能有一个 `<base>` 元素
2. 必须包含 `href` 或 `target` 属性（或两者都包含）
3. 影响所有相对 URL，包括：
   - `<a>` 的 href 属性
   - `<img>` 的 src 属性
   - `<link>` 的 href 属性
   - `<form>` 的 action 属性等

::: warning 注意事项
1. 如果页面中有 `<base>` 标签，那么页面内的锚点链接也会受影响：
```html
<base href="https://example.com/blog/">
<!-- 错误用法：会跳转到 https://example.com/blog/#section1 -->
<a href="#section1">跳转到章节1</a>

<!-- 正确用法：使用完整URL -->
<a href="https://example.com/blog/current-page.html#section1">跳转到章节1</a>
```

2. 动态修改 `<base>` 标签的 href 属性不会改变已经解析过的 URL
:::

### URL 路径解析规则

1. **绝对路径**：
```html
<img src="https://example.com/images/photo.jpg">
<!-- 直接使用完整URL -->
```

2. **以斜杠开头的路径**：
```html
<img src="/images/photo.jpg">
<!-- 相对于域名根目录 -->
```

3. **相对路径**：
```html
<img src="../images/photo.jpg">
<!-- 相对于当前文件位置 -->
```

4. **基于 base 的路径**：
```html
<base href="https://example.com/blog/">
<img src="images/photo.jpg">
<!-- 相对于base标签指定的URL -->
```
## 参考资料

- [URL Living Standard](https://url.spec.whatwg.org/)
- [MDN URL API](https://developer.mozilla.org/zh-CN/docs/Web/API/URL)
- [RFC 3986](https://tools.ietf.org/html/rfc3986)
