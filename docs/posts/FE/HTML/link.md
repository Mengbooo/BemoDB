---
title: HTML链接标签 - `<link>`
date: '2025-06-07'
tags:
- FE
---

# HTML链接标签 - `<link>`

`<link>` 标签是HTML文档中的一个重要元素，它位于 `<head>` 部分，用于定义当前文档与外部资源之间的关系。最常见的用途是链接CSS样式表，但它还有许多其他用途。

## 基本语法

```html
<link rel="关系" href="资源路径" type="资源类型">
```

## 重要属性

1. `rel`（必需）：指定当前文档与被链接文档之间的关系
   - `stylesheet`：链接CSS样式表
   - `icon`：指定网站图标
   - `preload`：要求浏览器提前下载并缓存指定资源，通常用于关键资源如字体、CSS等
   - `prefetch`：预获取资源，提示浏览器在空闲时预先加载可能需要的资源，优先级低于preload
   - `alternate`：定义文档的替代版本，如不同语言版本、打印版本或RSS源
   - `canonical`：指定当前页面的规范URL，用于处理重复内容，告诉搜索引擎哪个URL是首选版本

2. `href`：指定外部资源的URL
   - 可以是绝对路径或相对路径

3. `type`：规定被链接文档的MIME类型
   - `text/css`：CSS文件
   - `image/x-icon`：图标文件

4. `media`：规定被链接文档将被显示在什么设备上
   - `all`：所有设备
   - `screen`：电脑屏幕
   - `print`：打印预览/打印页面
   - `(max-width: 800px)`：媒体查询

## 常见用法示例

### 1. 链接CSS样式表

```html
<!-- 基本样式表链接 -->
<link rel="stylesheet" href="styles.css">

<!-- 带媒体查询的样式表 -->
<link rel="stylesheet" href="mobile.css" media="(max-width: 600px)">

<!-- 带优先级的样式表 -->
<link rel="preload" href="critical.css" as="style">
```

### 2. 设置网站图标

```html
<!-- 基本图标 -->
<link rel="icon" href="favicon.ico">

<!-- 适配不同设备的图标 -->
<link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png">
```

### 3. 资源预加载

```html
<!-- 预加载字体 -->
<link rel="preload" href="font.woff2" as="font" type="font/woff2" crossorigin>

<!-- 预加载图片 -->
<link rel="preload" href="hero.jpg" as="image">
```

### 4. 替代样式表

```html
<link rel="alternate stylesheet" href="darkmode.css" title="暗色主题">
<link rel="alternate stylesheet" href="lightmode.css" title="亮色主题">
```

## 最佳实践

1. 样式表优化
   - 关键CSS内联到HTML中
   - 非关键CSS使用异步加载
   - 使用媒体查询优化加载

```html
<!-- 异步加载CSS -->
<link rel="stylesheet" href="styles.css" media="print" onload="this.media='all'">

<!-- 预加载关键资源 -->
<link rel="preload" href="critical.css" as="style">
<link rel="stylesheet" href="critical.css">
```

2. 图标设置
   - 提供多种尺寸的图标
   - 使用适当的图标格式
   - 指定正确的MIME类型
::: details 什么是MIME类型
MIME是"Multipurpose Internet Mail Extensions"的缩写，用于标识文件的类型。例如：text/html、image/jpeg等
:::

```html
<link rel="icon" type="image/svg+xml" href="favicon.svg">
<link rel="alternate icon" type="image/png" href="favicon.png">
```

1. 性能优化
   - 使用`preload`加载关键资源
   - 使用`prefetch`提前加载未来需要的资源
   - 适当使用`dns-prefetch`和`preconnect`

```html
<!-- DNS预解析 -->
<link rel="dns-prefetch" href="https://fonts.googleapis.com">

<!-- 预先建立连接 -->
<link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>
```

## 注意事项

1. `rel`属性是必需的，否则`link`标签无效
2. 正确设置资源的MIME类型
3. 注意资源加载的优先级
4. 避免加载不必要的资源
5. 考虑资源加载对性能的影响

## 浏览器兼容性

大多数现代浏览器都完全支持`<link>`标签的基本功能。但是，一些新特性（如`preload`、`prefetch`）可能需要检查具体的浏览器支持情况。建议在使用新特性时添加适当的降级处理。

`<link>`标签是构建现代网页不可或缺的元素，合理使用可以优化资源加载，提升用户体验，改善网站性能。通过上述的属性和技巧，我们可以更好地控制外部资源的加载和使用。