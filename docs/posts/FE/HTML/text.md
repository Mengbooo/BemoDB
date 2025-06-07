---
title: HTML 文本标签详解
date: '2025-02-07'
tags:
- FE
---

# HTML 文本标签详解

## 基础文本标签

### 1. 标题标签 `<h1>` - `<h6>`
HTML 提供六个级别的标题：
```html
<h1>一级标题</h1>
<h2>二级标题</h2>
<h3>三级标题</h3>
<h4>四级标题</h4>
<h5>五级标题</h5>
<h6>六级标题</h6>
```

注意事项：
- 一个页面通常只使用一个 `<h1>` 标签
- 标题要按层级使用，不要跳级
- 不要为了样式效果而使用标题标签

### 2. 段落标签 `<p>`
用于定义段落文本：
```html
<p>这是一个段落。段落标签会自动在其前后创建一些边距。</p>
<p>这是另一个段落。</p>
```

### 3. 换行标签 `<br>`
强制换行，是一个空元素：
```html
这是第一行<br>
这是第二行
```

## 文本格式化标签

### 1. 文本样式
```html
<strong>粗体文本</strong>
<em>斜体文本</em>
<mark>高亮文本</mark>
<del>删除线文本</del>
<ins>下划线文本</ins>
<sub>下标</sub>
<sup>上标</sup>
```

### 2. 引用和引文

#### 块引用 `<blockquote>`
```html
<blockquote cite="https://example.com">
    <p>这是一段长引用文本。引用的内容会有缩进效果。</p>
    <cite>——引用来源</cite>
</blockquote>
```

#### 行内引用 `<q>`
```html
<p>正如某人所说：<q>这是一段短引用</q></p>
```

#### 引文 `<cite>`
```html
<p><cite>维基百科</cite> 是一个自由的百科全书。</p>
```

### 3. 代码相关

#### 行内代码 `<code>`
```html
<p>HTML中的 <code>&lt;p&gt;</code> 标签用于定义段落。</p>
```

#### 预格式化文本 `<pre>`
保留文本的空格和换行：
```html
<pre>
function hello() {
    console.log("Hello World!");
}
</pre>
```

#### 键盘输入 `<kbd>`
```html
<p>请按 <kbd>Ctrl</kbd> + <kbd>C</kbd> 复制文本。</p>
```

## 文本容器标签

### 1. 通用容器
```html
<div>块级容器</div>
<span>行内容器</span>
```

### 2. 语义化容器
```html
<article>文章内容</article>
<section>区块内容</section>
<aside>侧边内容</aside>
```

## 特殊文本标签

### 1. 缩写 `<abbr>`
```html
<p><abbr title="World Wide Web">WWW</abbr> 是互联网的一个重要部分。</p>
```

### 2. 地址 `<address>`
```html
<address>
    作者：张三<br>
    网站：example.com<br>
    邮箱：zhangsan@example.com
</address>
```

### 3. 时间 `<time>`
```html
<time datetime="2024-03-19">2024年3月19日</time>
```

## 文本标签的最佳实践

1. **语义化使用**
   - 根据内容含义选择合适的标签
   - 不要为了样式效果滥用标签
   - 保持结构清晰

2. **可访问性考虑**
   - 使用适当的标题层级
   - 为缩写提供完整描述
   - 保持文本结构合理

3. **SEO优化**
   - 合理使用标题标签
   - 确保重要内容使用语义化标签
   - 适当使用强调标签

4. **代码规范**
   ```html
   <!-- 推荐的写法 -->
   <article>
       <h1>文章标题</h1>
       <p>第一段落...</p>
       <h2>子标题</h2>
       <p>第二段落...</p>
   </article>
   ```

## 常见问题和解决方案

### 1. 空格和换行处理
```html
<!-- 使用 pre 保留格式 -->
<pre>
    这里的空格
    和换行都会
    被保留
</pre>

<!-- 使用 CSS 处理空格 -->
<p style="white-space: pre-line">
    这里的换行
    会被保留
</p>
```

### 2. 特殊字符处理
```html
<!-- 使用 HTML 实体 -->
&lt;  <!-- < -->
&gt;  <!-- > -->
&amp; <!-- & -->
&quot; <!-- " -->
&copy; <!-- © -->
```

## 参考资料

- [MDN HTML 文本内容](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element#文本内容)
- [HTML Living Standard](https://html.spec.whatwg.org/multipage/text-level-semantics.html)