---
title: 文本与字体
date: '2025-02-17'
tags:
- FE
---

# 文本与字体

CSS中的文本和字体样式是网页设计中最基础的部分。

## 字体基础

### 字体系列

使用`font-family`属性来设置文本的字体。可以指定一个字体系列列表，浏览器将使用列表中第一个可用的字体：

```css
p {
  font-family: "Trebuchet MS", Verdana, sans-serif;
}
```

#### 网页安全字体

以下字体在大多数系统中都可用：

| 字体名称            | 类型         | 注意                                                     |
| --------------- | ---------- | ------------------------------------------------------ |
| Arial           | sans-serif | 建议添加Helvetica作为首选替代品                                  |
| Courier New     | monospace  | 可以使用Courier作为替代                                       |
| Georgia         | serif      | 优秀的衬线字体                                               |
| Times New Roman | serif      | 传统的衬线字体                                               |
| Verdana         | sans-serif | 专为屏幕设计的无衬线字体                                          |

### 字体大小

使用`font-size`属性设置字体大小：

```css
/* 像素单位 */
p {
  font-size: 16px;
}

/* em单位 */
.child {
  font-size: 1.5em; /* 相对于父元素的字体大小 */
}

/* rem单位 */
.element {
  font-size: 1.2rem; /* 相对于根元素的字体大小 */
}
```

### 字体样式

#### 字体粗细

```css
p {
  font-weight: normal; /* 或 bold */
  font-weight: 700;   /* 100 到 900 的数值 */
}
```

#### 字体风格

```css
p {
  font-style: normal;  /* 正常 */
  font-style: italic;  /* 斜体 */
  font-style: oblique; /* 倾斜 */
}
```

## 文本布局

### 文本对齐

```css
p {
  text-align: left;    /* 左对齐 */
  text-align: right;   /* 右对齐 */
  text-align: center;  /* 居中 */
  text-align: justify; /* 两端对齐 */
}
```

### 行高

```css
p {
  line-height: 1.5;    /* 推荐使用无单位数值 */
  line-height: 20px;   /* 固定行高 */
}
```

### 字母和单词间距

```css
p {
  letter-spacing: 2px;  /* 字母间距 */
  word-spacing: 4px;    /* 单词间距 */
}
```

## 文本装饰

### 文本转换

```css
p {
  text-transform: uppercase;   /* 全大写 */
  text-transform: lowercase;   /* 全小写 */
  text-transform: capitalize; /* 首字母大写 */
}
```

### 文本装饰线

```css
p {
  text-decoration: none;         /* 无装饰 */
  text-decoration: underline;    /* 下划线 */
  text-decoration: line-through; /* 删除线 */
  text-decoration: overline;     /* 上划线 */
}
```

### 文本阴影

```css
h1 {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  /* 水平偏移 垂直偏移 模糊半径 颜色 */
}
```

## Font简写属性

可以使用`font`简写属性同时设置多个字体属性：

```css
p {
  font: italic bold 16px/1.5 Arial, sans-serif;
  /* font-style font-weight font-size/line-height font-family */
}
```

## 最佳实践

1. **字体选择**：
   - 使用网页安全字体作为后备字体
   - 字体列表以首选字体开始，以通用字体系列结束
   - 考虑使用Web Fonts扩展字体选择

2. **可读性**：
   - 正文使用适当的行高（1.5-1.6）
   - 确保足够的对比度
   - 避免过长的行宽

3. **响应式设计**：
   - 使用相对单位（rem、em）
   - 在不同屏幕尺寸下测试文本布局
   - 考虑移动设备的可读性

4. **性能考虑**：
   - 限制使用的字体数量
   - 适当使用字体加粗和变体
   - 注意Web Fonts的加载性能