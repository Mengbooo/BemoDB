---
title: 链接样式
date: '2025-06-07'
tags:
- FE
---

# 链接样式

CSS中的链接样式是网页交互设计中的重要组成部分。本文将介绍如何为链接添加样式。

## 链接状态

链接可以处于不同的状态，每个状态都可以使用对应的伪类来设置样式：

- **Link**：未访问的链接，使用`:link`伪类
- **Visited**：已访问的链接，使用`:visited`伪类
- **Hover**：鼠标悬停的链接，使用`:hover`伪类
- **Focus**：键盘聚焦的链接，使用`:focus`伪类
- **Active**：激活（点击）的链接，使用`:active`伪类

### 默认样式

链接的默认样式包括：

```css
/* 浏览器默认样式示例 */
a {
  text-decoration: underline;  /* 下划线 */
  cursor: pointer;            /* 手型光标 */
}

a:link {
  color: blue;               /* 未访问为蓝色 */
}

a:visited {
  color: purple;            /* 已访问为紫色 */
}

a:active {
  color: red;               /* 激活时为红色 */
}
```

## 设置链接样式

### 基本样式设置

以下是一个完整的链接样式示例：

```css
/* 记住顺序：LVFHA (Love Fears HAte) */
a {
  text-decoration: none;
  padding: 2px 1px 0;
}

a:link {
  color: #265301;
}

a:visited {
  color: #437A16;
}

a:focus {
  background: #BAE498;
}

a:hover {
  background: #CDFEAA;
}

a:active {
  background: #265301;
  color: #CDFEAA;
}
```

### 包含图标的链接

可以为特定类型的链接（如外部链接）添加图标：

```css
/* 为外部链接添加图标 */
a[href^="http"] {
  background: url("external-link.png") no-repeat 100% 0;
  background-size: 16px 16px;
  padding-right: 19px;
}
```

### 导航菜单样式

将链接样式化为按钮，常用于导航菜单：

```css
.nav-menu {
  display: flex;
  gap: 0.625%;
}

.nav-menu a {
  flex: 1;
  text-decoration: none;
  text-align: center;
  line-height: 3;
  color: black;
  background: #f4f4f4;
}

.nav-menu a:hover {
  background: #ddd;
}

.nav-menu a:active {
  background: #333;
  color: white;
}
```

## 最佳实践

1. **状态区分**：
   - 确保不同状态有明显的视觉差异
   - 保持状态变化的连贯性
   - 提供清晰的交互反馈

2. **可访问性**：
   - 保持足够的颜色对比度
   - 不要只依赖颜色来区分状态
   - 确保焦点状态清晰可见

3. **样式顺序**：
   - 遵循LVFHA顺序（`:link`, `:visited`, `:focus`, `:hover`, `:active`）
   - 确保样式不会相互覆盖
   - 考虑移动设备的触摸交互

4. **视觉提示**：
   - 为外部链接添加适当的图标
   - 使用合适的鼠标指针样式
   - 提供明确的悬停效果

## 注意事项

1. 出于安全考虑，`:visited`伪类只能修改链接的颜色相关属性
2. 确保链接样式不会与周围内容混淆
3. 在移动设备上，`:hover`效果可能不适用
4. 考虑使用`outline`属性来显示焦点状态，而不是移除它
