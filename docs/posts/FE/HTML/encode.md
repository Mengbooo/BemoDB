---
title: HTML 字符编码详解
date: '2025-02-06'
tags:
- FE
---

# HTML 字符编码详解

## 字符编码基础

字符编码是计算机将字符转换为二进制数据的规则。在 HTML 中，正确的字符编码对于正确显示网页内容至关重要。

### 为什么需要字符编码？

1. **多语言支持**：显示不同语言的字符
2. **特殊字符处理**：处理 HTML 标记和特殊符号
3. **数据传输**：确保数据在传输过程中不会损坏

## e.g : HTML 中的编码声明

### 1. Meta 标签声明

```html
<head>
  <meta charset="UTF-8" />
</head>
```

### 2. HTTP 头部声明

```http
Content-Type: text/html; charset=UTF-8
```

### 3. XML 声明（XHTML）

```xml
<?xml version="1.0" encoding="UTF-8"?>
```

## 常见字符编码

### 1. UTF-8

- Unicode 的实现方式之一
- 可变长度编码（1-4 字节）
- 支持所有 Unicode 字符
- 向后兼容 ASCII
- **推荐使用**

### 2. ASCII

- 7 位编码系统
- 只支持基本的英文字符
- 范围：0-127

### 3. ISO-8859-1

- 8 位编码系统
- 支持西欧语言
- 范围：0-255

### 4. GB2312

- 中文简体字符集
- 双字节编码
- 仅支持常用汉字

### 5. GBK

- GB2312 的扩展
- 支持更多中文字符
- 向后兼容 GB2312

## HTML 实体编码

HTML 实体是一段以 & 开头、以 ; 结尾的字符串，用于表示特殊字符。

### 1. 常用 HTML 实体

```html
&lt;
<!-- < 小于号 -->
&gt;
<!-- > 大于号 -->
&amp;
<!-- & 和号 -->
&quot;
<!-- " 双引号 -->
&apos;
<!-- ' 单引号 -->
&copy;
<!-- © 版权符号 -->
&reg;
<!-- ® 注册商标 -->
&trade;
<!-- ™ 商标符号 -->
&nbsp;
<!-- 不换行空格 -->
```

### 2. 数字实体引用

可以使用十进制或十六进制数字来表示字符：

```html
&#169;
<!-- © 使用十进制 -->
&#xA9;
<!-- © 使用十六进制 -->
```

## 编码问题及解决方案

### 1. 乱码问题

常见原因：

- 编码声明与实际编码不匹配
- 文件保存编码错误
- 服务器配置问题

解决方案：

```html
<!-- 1. 确保文件以 UTF-8 保存 -->
<!-- 2. 正确设置 meta 标签 -->
<meta charset="UTF-8" />
<!-- 3. 设置服务器响应头 -->
Content-Type: text/html; charset=UTF-8
```

### 2. 特殊字符处理

```html
<!-- 1. 使用 HTML 实体 -->
<p>Copyright &copy; 2024</p>

<!-- 2. 使用 Unicode 转义 -->
<p>商标符号：&#8482;</p>

<!-- 3. 使用 Base64 编码（用于图片等资源） -->
<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA..." />
```

## URL 编码

URL 中的特殊字符需要进行编码，这在我们的以往博文`URL简介`中也提到过

```javascript
// JavaScript 中的 URL 编码方法
encodeURI("https://example.com/path?name=张三");
// 结果：https://example.com/path?name=%E5%BC%A0%E4%B8%89

encodeURIComponent("张三");
// 结果：%E5%BC%A0%E4%B8%89
```

## 最佳实践

1. **始终使用 UTF-8**

   ```html
   <meta charset="UTF-8" />
   ```

2. **正确设置服务器配置**

   ```apache
   AddDefaultCharset UTF-8
   ```

3. **保持编码一致性**

   - 编辑器设置
   - 文件保存
   - 服务器配置
   - HTML 声明

4. **处理用户输入**

   ```javascript
   // 对用户输入进行编码
   const userInput = '<script>alert("XSS")</script>';
   const safeInput = escapeHtml(userInput);

   function escapeHtml(unsafe) {
     return unsafe
       .replace(/&/g, "&amp;")
       .replace(/</g, "&lt;")
       .replace(/>/g, "&gt;")
       .replace(/"/g, "&quot;")
       .replace(/'/g, "&#039;");
   }
   ```

   在这段代码中，展示如何对用户的输入内容进行编码，以防止跨站脚本攻击（XSS）。
   > XSS 是一种常见的安全漏洞，攻击者可以通过在网页中注入恶意脚本来窃取用户信息或执行其他恶意操作。

   - **用户输入**：假设`userInput` 是一个包含潜在恶意脚本的字符串。
   - **安全处理**：使用 `escapeHtml` 函数对 `userInput` 进行处理，生成 `safeInput`，确保其中的特殊字符被转义。
   - **转义函数**：`escapeHtml` 函数将输入字符串中的特殊字符（如 `&`, `<`, `>`, `"`, `'`）替换为对应的 HTML 实体（如 `&amp;`, `&lt;`, `&gt;`, `&quot;`, `&#039;`），从而防止这些字符被解释为代码。

   通过这种方式，可以有效地防止用户输入中的恶意代码被执行，提升网页的安全性。

## 编码调试工具

1. **浏览器开发者工具**

   - 查看网页编码
   - 检查 HTTP 响应头

2. **在线工具**
   - [UTF-8 编码转换工具](https://www.utf8-chartable.de/)
   - [HTML 实体编码器](https://www.freeformatter.com/html-entities.html)

## 参考资料

- [字符编码详解](https://www.w3.org/International/articles/definitions-characters/)
- [HTML 字符实体参考](https://html.spec.whatwg.org/multipage/named-characters.html)
- [UTF-8 规范](https://tools.ietf.org/html/rfc3629)
