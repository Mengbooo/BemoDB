---
title: position 及其属性
date: '2025-06-07'
tags:
- FE
---

# position 及其属性

CSS定位允许我们将元素从正常的文档流中取出，并使其具有不同的行为。

## 定位基础

### position属性

CSS提供了以下几种定位方式：

```css
.element {
  /* 默认值 */
  position: static;
  
  /* 相对定位 */
  position: relative;
  
  /* 绝对定位 */
  position: absolute;
  
  /* 固定定位 */
  position: fixed;
  
  /* 粘性定位 */
  position: sticky;
}
```

## 静态定位（static）

这是默认的定位方式，元素按照正常的文档流进行布局：

```css
.static {
  position: static;
  /* top、right、bottom、left 和 z-index 属性无效 */
}
```

## 相对定位（relative）

相对于元素原本的位置进行定位：

```css
.relative {
  position: relative;
  top: 20px;    /* 向下移动20px */
  left: 20px;   /* 向右移动20px */
}
```

特点：
- 不会影响其他元素的位置
- 参照点是元素原本的位置
- 仍然占据原来的空间

## 绝对定位（absolute）

相对于最近的定位祖先元素进行定位：

```css
.absolute {
  position: absolute;
  top: 0;
  right: 0;
  /* 将元素定位到最近的定位祖先元素的右上角 */
}

/* 创建定位上下文 */
.parent {
  position: relative;
}
```

特点：
- 脱离正常文档流
- 不占据空间
- 相对于最近的非static定位祖先元素定位

## 固定定位（fixed）

相对于浏览器视口进行定位：

```css
.fixed {
  position: fixed;
  bottom: 20px;
  right: 20px;
  /* 固定在视口右下角 */
}
```

特点：
- 脱离正常文档流
- 不随页面滚动而移动
- 始终相对于视口定位

## 粘性定位（sticky）

根据滚动位置在相对定位和固定定位之间切换：

```css
.sticky {
  position: sticky;
  top: 0;
  /* 当元素距离视口顶部0px时固定 */
}
```

### 常见应用场景

```css
/* 固定导航栏 */
.navbar {
  position: sticky;
  top: 0;
  background: white;
  z-index: 100;
}

/* 返回顶部按钮 */
.back-to-top {
  position: fixed;
  bottom: 20px;
  right: 20px;
}
```

## 定位层级（z-index）

控制定位元素的堆叠顺序：

```css
.element {
  position: relative;
  z-index: 1;    /* 数值越大，越靠前显示 */
}
```

### 堆叠上下文

```css
.parent {
  position: relative;
  z-index: 1;
}

.child {
  position: absolute;
  z-index: 999; /* 只在父元素的堆叠上下文中比较 */
}
```

## 定位偏移值

可以使用多种单位设置偏移值：

```css
.element {
  position: absolute;
  /* 像素值 */
  top: 20px;
  
  /* 百分比（相对于定位上下文） */
  left: 50%;
  
  /* 视口单位 */
  right: 10vw;
  
  /* 计算值 */
  bottom: calc(100% - 20px);
}
```

## 常见布局技巧

### 居中定位

```css
/* 绝对定位居中 */
.center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* 固定宽高的居中 */
.center-fixed {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  width: 200px;
  height: 200px;
}
```

### 覆盖层

```css
/* 全屏遮罩 */
.overlay {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
}
```

### 定位上下文的选择

1. 相对于视口：使用fixed
2. 相对于文档：使用absolute + 相对于body
3. 相对于特定容器：使用absolute + 相对于position非static的祖先元素
4. 滚动时固定：使用sticky