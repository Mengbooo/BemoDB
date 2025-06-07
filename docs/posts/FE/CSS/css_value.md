---
title: 值与单位
date: '2025-06-07'
tags:
- FE
---

# 值与单位

CSS中的每个属性都允许拥有一个或一组值.
## 数字、长度和百分比

### 数值类型

在CSS中常见的数值类型包括：

- `<integer>`：整数，如 1024 或 -55
- `<number>`：可以包含小数点的数字，如 0.255、128 或 -1.2
- `<dimension>`：带有单位的数字，如 45deg、5s 或 10px
- `<percentage>`：百分比值，如 50%

### 长度单位

CSS中的长度单位分为两类：绝对长度单位和相对长度单位。

#### 绝对长度单位

| 单位 | 名称     | 等价换算                  |
| -- | ------ | --------------------- |
| cm | 厘米     | 1cm = 37.8px         |
| mm | 毫米     | 1mm = 1/10cm         |
| Q  | 四分之一毫米 | 1Q = 1/40cm          |
| in | 英寸     | 1in = 2.54cm = 96px  |
| pc | 派卡     | 1pc = 1/6in          |
| pt | 磅      | 1pt = 1/72in         |
| px | 像素     | 1px = 1/96in         |

在屏幕显示中，最常用的是`px`（像素）单位。

#### 相对长度单位

常用的相对长度单位包括：

- `em`：相对于元素的字体大小
- `rem`：相对于根元素的字体大小
- `vw`：视口宽度的1%
- `vh`：视口高度的1%

### em和rem的区别

```css
/* em示例 */
.parent {
    font-size: 16px;
}
.child {
    font-size: 1.5em; /* 16px * 1.5 = 24px */
}

/* rem示例 */
html {
    font-size: 16px;
}
.element {
    font-size: 1.5rem; /* 16px * 1.5 = 24px */
}
```

### 百分比

百分比总是相对于其他值设置的：

```css
.container {
    width: 400px;
}
.box {
    width: 50%; /* 200px，相对于容器宽度 */
    font-size: 80%; /* 相对于父元素的字体大小 */
}
```

## 颜色

CSS提供了多种指定颜色的方式：

### 颜色关键词

```css
.box {
    color: red;
    background-color: black;
    border-color: rebeccapurple;
}
```

### 十六进制颜色

```css
.box {
    color: #ff0000; /* 红色 */
    background-color: #000000; /* 黑色 */
}
```

### RGB和RGBA

```css
.box {
    color: rgb(255 0 0); /* 红色 */
    background-color: rgb(0 0 0 / 0.5); /* 半透明黑色 */
}
```

### HSL和HSLA

```css
.box {
    color: hsl(0 100% 50%); /* 红色 */
    background-color: hsl(0 0% 0% / 0.5); /* 半透明黑色 */
}
```

## 图片

`<image>`数据类型可以是URL图片或渐变：

```css
.box {
    /* URL图片 */
    background-image: url(path/to/image.jpg);
    
    /* 渐变 */
    background-image: linear-gradient(90deg, blue, red);
}
```

## 位置

`<position>`用于定位元素，通常用于`background-position`等属性：

```css
.box {
    background-position: top right; /* 使用关键词 */
    background-position: 100% 50%; /* 使用百分比 */
    background-position: 20px 50px; /* 使用具体数值 */
}
```

## 函数

CSS中的一些常用函数：

```css
/* 计算函数 */
.box {
    width: calc(100% - 20px);
}

/* 颜色函数 */
.box {
    color: rgb(255 0 0);
    background-color: hsl(120 100% 50%);
}

/* 变换函数 */
.box {
    transform: rotate(45deg);
}
```

## 实践建议

1. 选择合适的单位：
   - 使用相对单位（rem、em）来实现可伸缩的设计
   - 使用px用于固定大小的元素
   - 使用百分比实现流式布局

2. 颜色使用：
   - 保持项目中颜色表示方式的一致性
   - 考虑使用CSS变量存储颜色值
   - 适当使用透明度实现视觉效果

3. 值的可维护性：
   - 避免魔法数字，使用有意义的值
   - 使用calc()函数进行复杂计算
   - 合理使用CSS变量存储常用值