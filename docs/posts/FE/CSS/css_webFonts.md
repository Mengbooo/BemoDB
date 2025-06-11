# Web字体

Web字体是一种CSS特性，允许我们为网页指定自定义字体，而不必受限于系统安装的字体。本文将介绍如何使用Web字体。

## 字体基础回顾

在传统的Web开发中，我们只能使用Web安全字体，即那些在大多数系统中都预装的字体：

```css
p {
  font-family: Helvetica, "Trebuchet MS", Verdana, sans-serif;
}
```

这种方法的局限性在于字体选择非常有限。Web字体技术解决了这个问题。

## Web字体的使用

### @font-face规则

使用`@font-face`规则来声明自定义字体：

```css
@font-face {
  font-family: "myFont";
  src: url("myFont.ttf");
}

/* 使用自定义字体 */
html {
  font-family: "myFont", "Bitstream Vera Serif", serif;
}
```

### 多格式支持

为了确保跨浏览器兼容性，需要提供多种字体格式：

```css
@font-face {
  font-family: "myFont";
  src: 
    url("myFont.woff2") format("woff2"),
    url("myFont.woff") format("woff"),
    url("myFont.ttf") format("truetype");
}
```

常见的字体格式包括：
- WOFF2：最新最优化的格式
- WOFF：较新的格式，兼容性好
- TTF/OTF：较老的格式
- EOT：仅IE支持的格式

## 获取Web字体

### 免费字体来源

1. **Google Fonts**：
   - 免费服务
   - 使用简单
   - 性能优化好

2. **Font Squirrel**：
   - 提供免费字体
   - 包含字体生成器
   - 可下载字体文件

### 付费字体服务

1. **Adobe Fonts**（原Typekit）：
   - 高质量字体
   - 与Creative Cloud集成
   - 专业级服务

2. **其他服务**：
   - fonts.com
   - myfonts.com
   - fontspring.com

## 使用字体服务

### Google Fonts示例

1. 在HTML中引入字体：
```html
<link href="https://fonts.googleapis.com/css2?family=Open+Sans&display=swap" rel="stylesheet">
```

2. 在CSS中使用字体：
```css
body {
  font-family: 'Open Sans', sans-serif;
}
```

## 性能考虑

### 优化加载

1. **选择合适的格式**：
   - 优先使用WOFF2
   - 提供WOFF作为备选
   - 根据需要提供其他格式

2. **控制字体大小**：
   - 只加载需要的字符
   - 使用font-display控制加载行为
   - 考虑使用字体子集

```css
@font-face {
  font-family: "myFont";
  src: url("myFont.woff2") format("woff2");
  font-display: swap;
  unicode-range: U+000-5FF; /* 仅加载拉丁字符 */
}
```
::: details  font-display 属性有以下几个可选值：
- auto：浏览器将使用其默认的字体显示策略。
- block：在字体加载期间，浏览器会隐藏文本，直到字体加载完成。如果字体加载失败，则会使用备用字体。
- swap：浏览器会立即使用备用字体显示文本，并在自定义字体加载完成后替换为自定义字体。如果自定义字体加载失败，则继续使用备用字体。
- fallback：浏览器会先尝试使用自定义字体。如果自定义字体在短暂的时间内（如100ms）没有加载完成，则会切换到备用字体。如果自定义字体在后续加载完成，浏览器也不会替换回自定义字体。
- optional：与 fallback 类似，但如果自定义字体在短暂时间内没有加载完成，浏览器会继续使用备用字体，并且即使自定义字体在后续加载完成，也不会进行替换。
:::
## 最佳实践

1. **字体选择**：
   - 选择适合网站风格的字体
   - 考虑可读性和易用性
   - 确保有合适的备选字体

2. **性能优化**：
   - 限制使用的字体数量
   - 优先使用系统字体
   - 合理使用字体变体

3. **可访问性**：
   - 确保文本可读性
   - 提供合适的备选方案
   - 考虑用户的网络条件

4. **法律合规**：
   - 确保拥有使用权
   - 遵守字体许可协议
   - 注意商业使用限制