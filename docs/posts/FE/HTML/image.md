# HTML 图像标签详解

## 基本图像标签 `<img>`

`<img>` 标签用于在网页中嵌入图像，它是一个空元素（不需要结束标签）。

### 1. 基本语法

```html
<img src="path/to/image.jpg" alt="图片描述">
```

### 2. 必要属性

- **src**：指定图像的路径（必需）
- **alt**：图像的替代文本（必需，用于可访问性）

### 3. 可选属性

```html
<img src="image.jpg" 
     alt="示例图片"
     height="200"         <!-- 高度 -->
     width="300"          <!-- 宽度 -->
     loading="lazy"       <!-- 延迟加载 -->
     decoding="async"     <!-- 异步解码 -->
     title="图片标题"      <!-- 悬停提示 -->
>
```

## 图像路径

### 1. 相对路径
```html
<!-- 同级目录 -->
<img src="image.jpg">

<!-- 子目录 -->
<img src="images/photo.jpg">

<!-- 上级目录 -->
<img src="../images/photo.jpg">
```

### 2. 绝对路径
```html
<!-- 完整URL -->
<img src="https://example.com/images/photo.jpg">

<!-- 根目录路径 -->
<img src="/images/photo.jpg">
```

## 响应式图像

### 1. srcset 属性
用于不同屏幕密度的图像源：

```html
<img src="small.jpg"
     srcset="small.jpg 300w,
             medium.jpg 600w,
             large.jpg 900w"
     sizes="(max-width: 320px) 300px,
            (max-width: 640px) 600px,
            900px"
     alt="响应式图片">
```

### 2. picture 元素
为不同场景提供不同图像源：

```html
<picture>
    <source media="(min-width: 800px)" srcset="large.jpg">
    <source media="(min-width: 400px)" srcset="medium.jpg">
    <img src="small.jpg" alt="响应式图片">
</picture>
```

## 图像优化

### 1. 加载优化
```html
<!-- 延迟加载 -->
<img loading="lazy" src="image.jpg" alt="懒加载">

<!-- 预加载重要图片 -->
<link rel="preload" as="image" href="important.jpg">
```

### 2. 性能优化
```html
<!-- 使用适当的图像格式 -->
<picture>
    <source type="image/webp" srcset="image.webp">
    <source type="image/jpeg" srcset="image.jpg">
    <img src="image.jpg" alt="优化的图片">
</picture>
```

## 图像布局

### 1. 基本布局
```html
<!-- 居中对齐 -->
<div style="text-align: center">
    <img src="image.jpg" alt="居中图片">
</div>

<!-- 浮动布局 -->
<img src="image.jpg" alt="浮动图片" style="float: left; margin: 0 10px 10px 0">
```

### 2. 响应式布局
```css
/* 响应式图片 */
img {
    max-width: 100%;
    height: auto;
}

/* 保持宽高比 */
.image-container {
    position: relative;
    padding-bottom: 56.25%; /* 16:9 比例 */
}

.image-container img {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
}
```

## 图像可访问性

### 1. 替代文本
```html
<!-- 描述性的 alt 文本 -->
<img src="cat.jpg" alt="一只橙色的猫咪正在睡觉">

<!-- 装饰性图片可以使用空 alt -->
<img src="decoration.jpg" alt="">
```

### 2. 图片说明
```html
<!-- 使用 figure 和 figcaption -->
<figure>
    <img src="chart.jpg" alt="2024年销售数据图表">
    <figcaption>图1：2024年第一季度销售数据分析</figcaption>
</figure>
```

## 常见问题和解决方案

### 1. 图片未加载时的占位
```html
<!-- 使用占位图 -->
<img src="image.jpg" 
     alt="图片"
     onerror="this.src='placeholder.jpg'">

<!-- 或使用 CSS 背景色 -->
<img style="background-color: #f0f0f0">
```

### 2. 图片变形
```css
/* 保持宽高比 */
img {
    object-fit: cover;    /* 裁剪以填充 */
    object-fit: contain;  /* 保持比例完整显示 */
}
```

## 最佳实践

1. **性能考虑**
   - 使用适当的图片格式
   - 压缩图片大小
   - 使用响应式图片
   - 实现延迟加载

2. **可访问性**
   - 始终提供有意义的 alt 文本
   - 使用适当的图片说明
   - 确保足够的颜色对比度

3. **维护性**
   - 使用有意义的文件名
   - 保持图片资源结构化管理
   - 记录图片尺寸和用途

## 参考资料

- [MDN 图片元素](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/img)
- [响应式图片最佳实践](https://developer.mozilla.org/zh-CN/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)
- [图片优化指南](https://web.dev/fast/#optimize-your-images)