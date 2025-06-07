---
title: 背景与边框
date: '2025-06-07'
tags:
- FE
---

# 背景与边框

CSS 中的背景和边框属性提供了丰富的样式选项，可以创造出各种视觉效果。

## 背景样式

### 背景颜色

使用 `background-color` 属性可以设置元素的背景颜色：

```css
.box {
  background-color: #567895;
  /* 也可以使用其他颜色值 */
  background-color: rgb(255, 0, 0);
  background-color: rgba(255, 0, 0, 0.5); /* 或写作rgb(255 0 0 /0.5) */
  background-color: hsl(0, 100%, 50%); /* 同上也有 hsla */
}
```

### 背景图像

`background-image` 属性用于设置背景图片：

```css
.box {
  background-image: url(path/to/image.jpg);
}
```

#### 背景图像的控制选项

1. **背景平铺**（`background-repeat`）：

```css
.box {
  background-repeat: no-repeat; /* 不平铺 */
  background-repeat: repeat-x; /* 水平平铺 */
  background-repeat: repeat-y; /* 垂直平铺 */
  background-repeat: repeat; /* 完全平铺 */
}
```

2. **背景尺寸**（`background-size`）：

```css
.box {
  background-size: 100px 200px; /* 具体尺寸 */
  background-size: 50% 50%; /* 百分比 */
  background-size: cover; /* 覆盖整个容器 */
  background-size: contain; /* 确保图片完全显示 */
}
```

3. **背景定位**（`background-position`）：

```css
.box {
  background-position: top right; /* 关键字 */
  background-position: 20px 10%; /* 具体值 */
  background-position: 20px top; /* 混合使用 */
  background-position: right 10px top 20px; /* 四值语法 */
}
```

### 渐变背景

CSS 支持多种渐变类型：

```css
.box {
  /* 线性渐变 */
  background-image: linear-gradient(to right, red, blue);

  /* 径向渐变 */
  background-image: radial-gradient(circle, red, blue);
}
```

### 多重背景

可以同时设置多个背景图像，它们会按照声明顺序叠加：

```css
.box {
  background-image: url(top.png), url(middle.png), url(bottom.png);
  background-position: right bottom, left top, right top;
  background-repeat: no-repeat, repeat, no-repeat;
}
```

### 背景附加

`background-attachment` 属性控制背景图像在页面滚动时的行为：

```css
.box {
  background-attachment: scroll; /* 随页面滚动 */
  background-attachment: fixed; /* 固定在视口 */
  background-attachment: local; /* 随元素内容滚动 */
}
```

## 边框样式

### 基本边框

边框的基本属性包括宽度、样式和颜色：

```css
.box {
  border: 1px solid black; /* 简写形式 */

  /* 分开设置 */
  border-width: 1px;
  border-style: solid;
  border-color: black;

  /* 单边设置 */
  border-top: 1px solid black;
  border-right: 2px dashed red;
  border-bottom: 3px dotted blue;
  border-left: 4px double green;
}
```

### 圆角边框

使用 `border-radius` 属性创建圆角效果：

```css
.box {
  /* 所有角相同 */
  border-radius: 10px;

  /* 单独设置每个角 */
  border-radius: 10px 20px 30px 40px;

  /* 椭圆圆角 */
  border-top-right-radius: 1em 10%;
}
```

## 实践建议

1. **背景图片的无障碍性考虑**：

   - 确保背景上的文字有足够的对比度
   - 指定背景色作为图片加载失败的后备方案
   - 重要内容不要放在背景图片中

2. **性能优化**：

   - 压缩背景图片
   - 适当使用背景缓存
   - 考虑使用 CSS 渐变代替简单的背景图片

3. **响应式设计**：
   - 使用相对单位设置边框
   - 灵活运用 `background-size`
   - 合理使用多重背景
