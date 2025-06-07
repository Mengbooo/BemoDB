---
title: Flex 布局
date: '2025-02-18'
tags:
- FE
---

# Flex 布局

Flexbox是一种一维布局模型，它提供了强大而灵活的方式来分配和对齐容器内的元素。

## Flex基础概念

### 开启Flex布局

要使用Flex布局，首先需要在父元素上设置`display: flex`：

```css
.container {
  display: flex; /* 或者 inline-flex */
}
```

### Flex模型

Flex布局包含两个轴：
- 主轴（main axis）：默认水平方向，从左到右
- 交叉轴（cross axis）：与主轴垂直的方向，从上到下

## Flex容器属性

### flex-direction

控制主轴的方向：

```css
.container {
  flex-direction: row;          /* 默认值，水平方向，从左到右 */
  flex-direction: row-reverse;  /* 水平方向，从右到左 */
  flex-direction: column;       /* 垂直方向，从上到下 */
  flex-direction: column-reverse; /* 垂直方向，从下到上 */
}
```

### flex-wrap

控制是否换行：

```css
.container {
  flex-wrap: nowrap;       /* 默认值，不换行 */
  flex-wrap: wrap;         /* 换行 */
  flex-wrap: wrap-reverse; /* 换行，但是反向 */
}
```

### justify-content

控制主轴上的对齐方式：

```css
.container {
  justify-content: flex-start;    /* 默认值，起点对齐 */
  justify-content: flex-end;      /* 终点对齐 */
  justify-content: center;        /* 居中对齐 */
  justify-content: space-between; /* 两端对齐，项目之间的间隔相等 */
  justify-content: space-around;  /* 每个项目两侧的间隔相等 */
  justify-content: space-evenly;  /* 项目与项目之间、项目与容器之间的间隔都相等 */
}
```

### align-items

控制交叉轴上的对齐方式：

```css
.container {
  align-items: stretch;     /* 默认值，如果项目未设置高度，将占满整个容器的高度 */
  align-items: flex-start;  /* 交叉轴的起点对齐 */
  align-items: flex-end;    /* 交叉轴的终点对齐 */
  align-items: center;      /* 交叉轴的中点对齐 */
  align-items: baseline;    /* 项目的第一行文字的基线对齐 */
}
```

## Flex项目属性

### flex-grow

定义项目的放大比例：

```css
.item {
  flex-grow: 0; /* 默认值，不放大 */
  flex-grow: 1; /* 等比例放大 */
}
```

### flex-shrink

定义项目的缩小比例：

```css
.item {
  flex-shrink: 1; /* 默认值，等比例缩小 */
  flex-shrink: 0; /* 不缩小 */
}
```

### flex-basis

定义项目在主轴上的初始大小：

```css
.item {
  flex-basis: auto; /* 默认值 */
  flex-basis: 0;    /* 项目将根据flex-grow的值平分容器空间 */
  flex-basis: 200px; /* 指定具体大小 */
}
```

### flex简写

flex属性是flex-grow、flex-shrink和flex-basis的简写：

```css
.item {
  flex: 0 1 auto;   /* 默认值 */
  flex: 1;          /* 等同于 flex: 1 1 0% */
  flex: auto;       /* 等同于 flex: 1 1 auto */
  flex: none;       /* 等同于 flex: 0 0 auto */
}
```

### align-self

允许单个项目有不同于其他项目的对齐方式：

```css
.item {
  align-self: auto;       /* 默认值，继承父元素的align-items属性 */
  align-self: flex-start; /* 交叉轴的起点对齐 */
  align-self: flex-end;   /* 交叉轴的终点对齐 */
  align-self: center;     /* 交叉轴的中点对齐 */
  align-self: baseline;   /* 项目的第一行文字的基线对齐 */
  align-self: stretch;    /* 如果项目未设置高度，将占满整个容器的高度 */
}
```

## 常见布局实例

### 居中布局

```css
/* 水平垂直居中 */
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

### 导航栏布局

```css
/* 基础导航栏 */
.nav {
  display: flex;
  justify-content: space-between;
}

/* 响应式导航栏 */
@media (max-width: 600px) {
  .nav {
    flex-direction: column;
  }
}
```

### 等高列布局

```css
/* 自动等高列 */
.container {
  display: flex;
  align-items: stretch; /* 默认值 */
}
```

## 注意事项

1. Flex布局会改变元素的display属性，使其块状化
2. 设为Flex布局以后，子元素的float、clear和vertical-align属性将失效
3. 注意浏览器兼容性，特别是在处理旧版浏览器时
4. 合理使用flex简写属性，避免冗余代码