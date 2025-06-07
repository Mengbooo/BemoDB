---
title: 媒体查询入门
date: '2025-02-18'
tags:
- FE
---

# 媒体查询入门

媒体查询允许我们根据设备特征（如屏幕宽度、设备类型等）来应用不同的CSS样式。它是响应式设计的核心技术之一。

## 基础语法

媒体查询的基本语法结构：

```css
@media media-type and (media-feature-rule) {
  /* CSS规则 */
}
```

### 媒体类型

常用的媒体类型包括：

```css
@media screen {
  /* 用于屏幕 */
}

@media print {
  /* 用于打印 */
}

@media all {
  /* 用于所有设备 */
}

@media speech {
  /* 用于屏幕阅读器 */
}
```

### 媒体特征

#### 视口尺寸

使用width和height相关特征：

```css
/* 最小宽度 */
@media (min-width: 600px) {
  .container {
    width: 80%;
  }
}

/* 最大宽度 */
@media (max-width: 800px) {
  .container {
    width: 100%;
  }
}

/* 具体宽度 */
@media (width: 768px) {
  .container {
    width: 750px;
  }
}
```

#### 设备方向

检测设备的横向或纵向状态：

```css
@media (orientation: landscape) {
  /* 横向样式 */
  .container {
    flex-direction: row;
  }
}

@media (orientation: portrait) {
  /* 纵向样式 */
  .container {
    flex-direction: column;
  }
}
```

## 逻辑运算符

### 与操作（and）

同时满足多个条件：

```css
@media screen and (min-width: 600px) and (max-width: 800px) {
  /* 在600px到800px之间的屏幕上应用 */
  .container {
    padding: 20px;
  }
}
```

### 或操作（,）

满足任一条件：

```css
@media screen and (max-width: 600px), screen and (orientation: portrait) {
  /* 在小屏幕或纵向设备上应用 */
  .nav {
    display: none;
  }
}
```

### 非操作（not）

否定一个媒体查询：

```css
@media not all and (orientation: landscape) {
  /* 在非横向设备上应用 */
  .sidebar {
    width: 100%;
  }
}
```

## 现代特性检测

### 悬停能力检测

检测设备是否支持悬停：

```css
@media (hover: hover) {
  /* 支持悬停的设备 */
  .button:hover {
    background: #eee;
  }
}

@media (hover: none) {
  /* 不支持悬停的设备（如触摸屏） */
  .button {
    padding: 1em;  /* 更大的点击区域 */
  }
}
```

### 指针设备检测

检测指针设备的精确度：

```css
@media (pointer: fine) {
  /* 精确指针设备（如鼠标） */
  .link {
    padding: 0.2em;
  }
}

@media (pointer: coarse) {
  /* 粗略指针设备（如触摸屏） */
  .link {
    padding: 1em;
  }
}
```

## 最佳实践

### 断点选择

选择断点的建议：

```css
/* 移动优先设计 */
.element { /* 基础样式 */ }

/* 平板 */
@media (min-width: 768px) {
  .element { /* 平板样式 */ }
}

/* 桌面 */
@media (min-width: 1024px) {
  .element { /* 桌面样式 */ }
}
```

### 避免设备特定断点

不要针对特定设备设置断点：

```css
/* 不推荐 */
@media (width: 768px) { /* iPad样式 */ }

/* 推荐 */
@media (min-width: 750px) and (max-width: 850px) {
  /* 适用于一定范围的样式 */
}
```

### 性能考虑

1. 避免过多的媒体查询
2. 合并相似的媒体查询
3. 使用移动优先的方法减少代码复杂度
4. 考虑使用现代布局技术（如Flexbox和Grid）减少媒体查询的需求