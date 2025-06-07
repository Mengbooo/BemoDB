---
title: Grid 布局
date: '2025-06-07'
tags:
- FE
---

# Grid 布局

CSS Grid是一个二维布局系统，它可以同时处理行和列，使复杂的布局变得简单直观。

## Grid基础概念

### 开启Grid布局

要使用Grid布局，需要在父元素上设置`display: grid`：

```css
.container {
  display: grid;
}
```

### 定义网格

使用`grid-template-columns`和`grid-template-rows`定义列和行：

```css
.container {
  display: grid;
  grid-template-columns: 200px 200px 200px;  /* 三列，每列200px */
  grid-template-rows: 100px 100px;           /* 两行，每行100px */
}
```

### 网格间距

使用`gap`属性设置网格间的间隙：

```css
.container {
  display: grid;
  gap: 20px;                /* 行列间距都是20px */
  row-gap: 20px;           /* 行间距 */
  column-gap: 20px;        /* 列间距 */
}
```

## 灵活的网格

### fr单位

使用`fr`单位按比例分配空间：

```css
.container {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;  /* 按1:2:1的比例分配宽度 */
}
```

### repeat()函数

使用`repeat()`函数重复定义相同的列或行：

```css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);  /* 三个相等的列 */
  grid-template-columns: repeat(2, 2fr 1fr);  /* 重复2fr 1fr两次 = 2：1：2：1 */
}
```

### minmax()函数

使用`minmax()`函数设置尺寸范围：

```css
.container {
  display: grid;
  grid-template-columns: repeat(3, minmax(100px, 1fr));
  /* 每列最小100px，最大1fr */
}
```

### 自动填充列

使用`auto-fill`和`auto-fit`创建响应式网格：

```css
.container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  /* 自动填充宽度最小200px的列 */
}
```

## 网格项目定位

### 基于线的定位

使用网格线编号放置元素：

```css
.item {
  grid-column: 1 / 3;  /* 从第1条列线到第3条列线 */
  grid-row: 2 / 4;     /* 从第2条行线到第4条行线 */
}
```

### grid-template-areas

使用命名区域定位元素：

```css
.container {
  display: grid;
  grid-template-areas: 
    "header header header"
    "sidebar content content"
    "footer footer footer";
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.content { grid-area: content; }
.footer { grid-area: footer; }
```

## 对齐方式

### 网格项目对齐

控制网格项目在单元格内的对齐：

```css
.container {
  /* 水平对齐 */
  justify-items: start | end | center | stretch;
  
  /* 垂直对齐 */
  align-items: start | end | center | stretch;
}
```

### 整体网格对齐

控制整个网格在容器内的对齐：

```css
.container {
  /* 水平对齐 */
  justify-content: start | end | center | space-between | space-around;
  
  /* 垂直对齐 */
  align-content: start | end | center | space-between | space-around;
}
```

## 常见布局实例

### 12列网格系统

```css
.container {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 20px;
}

.span-4 {
  grid-column: span 4;  /* 跨越4列 */
}
```

### 响应式布局

```css
.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}
```

### 叠加布局

```css
.container {
  display: grid;
  grid-template: 100vh / 100vw;  /* 创建一个视口大小的单元格 */
}

.item {
  grid-area: 1 / 1;  /* 所有项目重叠在同一个单元格 */
}
```

## 注意事项

1. Grid布局是二维的，同时控制行和列
2. 使用Grid Inspector工具可以帮助调试布局
3. 考虑使用命名网格线来提高代码可维护性
4. 注意浏览器兼容性，特别是对旧版浏览器的支持