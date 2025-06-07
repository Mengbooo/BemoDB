---
title: '`<script>` 与 `<noscript>`'
date: '2025-02-07'
tags:
- FE
---

# `<script>` 与 `<noscript>`

`<script>` 标签用于在HTML文档中嵌入或引用JavaScript代码，而 `<noscript>` 标签用于为不支持或禁用JavaScript的用户提供替代内容。

## `<script>` 标签

### 基本语法

```html
<!-- 内部脚本 -->
<script>
    // JavaScript代码
</script>

<!-- 外部脚本 -->
<script src="script.js"></script>
```

### 重要属性

1. `src`：引入外部JavaScript文件的URL
2. `type`：指定脚本的类型
   - 现代网页通常可以省略，默认为 `text/javascript`
   - 对于模块脚本（ES6+），使用 `type="module"`

3. `async`：异步加载脚本
   - 脚本下载时不阻塞页面解析
   - 下载完成后立即执行，不保证执行顺序

4. `defer`：延迟执行脚本
   - 脚本下载时不阻塞页面解析
   - 在文档解析完成后，按照顺序执行

5. `crossorigin`：跨域资源共享设置
   - `anonymous`：不发送用户凭证
   - `use-credentials`：发送用户凭证

### 常见用法示例

```html
<!-- 基本外部脚本 -->
<script src="app.js"></script>

<!-- 异步加载脚本 -->
<script src="analytics.js" async></script>

<!-- 延迟加载脚本 -->
<script src="main.js" defer></script>

<!-- ES6模块脚本 -->
<script type="module" src="module.js"></script>

<!-- 内联脚本 -->
<script>
    document.addEventListener('DOMContentLoaded', () => {
        console.log('页面加载完成');
    });
</script>
```

### 加载策略

1. 普通脚本
```html
<script src="script.js"></script>
```
- 阻塞HTML解析
- 按照出现顺序执行

2. async脚本
```html
<script src="script.js" async></script>
```
- 不阻塞HTML解析
- 加载完立即执行
- 适用于独立脚本

3. defer脚本
```html
<script src="script.js" defer></script>
```
- 不阻塞HTML解析
- DOM完成后执行
- 保证执行顺序

::: tip 加载顺序对比
[脚本加载策略对比](https://blog.csdn.net/weixin_63726940/article/details/145149558)
:::

## `<noscript>` 标签

### 基本语法

```html
<noscript>
    <!-- 当JavaScript被禁用时显示的内容 -->
</noscript>
```

### 使用场景

1. 提供无JavaScript提示
```html
<noscript>
    <p>请启用JavaScript以获得最佳体验。</p>
</noscript>
```

2. 提供替代内容
```html
<noscript>
    <img src="static-image.jpg" alt="静态图片">
</noscript>
```

3. 提供替代样式
```html
<noscript>
    <link rel="stylesheet" href="no-js.css">
</noscript>
```

## 最佳实践

1. 脚本放置位置
   - 推荐放在`</body>`前
   - 使用`defer`属性时可以放在`<head>`中

```html
<!DOCTYPE html>
<html>
<head>
    <script src="critical.js" defer></script>
</head>
<body>
    <!-- 页面内容 -->
    <script src="app.js"></script>
</body>
</html>
```

2. 性能优化
   - 使用适当的加载策略（async/defer）
   - 合理拆分代码块
   - 考虑代码压缩和缓存

```html
<!-- 关键脚本 -->
<script src="core.js" defer></script>

<!-- 非关键脚本 -->
<script src="analytics.js" async></script>
```

3. 模块化开发
```html
<script type="module">
    import { feature } from './modules/feature.js';
    feature.init();
</script>
```

## 注意事项

1. 避免在HTML中直接写大量JavaScript代码
2. 注意脚本加载顺序和依赖关系
3. 合理使用async和defer属性
4. 考虑无JavaScript场景的降级处理
5. 注意跨域资源的安全设置

## 浏览器兼容性

- `<script>`：所有浏览器都支持基本功能
- `async`和`defer`：现代浏览器普遍支持
- `type="module"`：需要现代浏览器支持
- `<noscript>`：所有浏览器都支持

合理使用`<script>`和`<noscript>`标签可以提升网页性能和用户体验。通过选择适当的加载策略和提供合适的降级方案，我们可以构建更健壮的网页应用。

