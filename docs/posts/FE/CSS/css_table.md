---
title: 表格样式
date: '2025-06-07'
tags:
- FE
---

# 表格样式

CSS中的表格样式可以让数据展示更加清晰美观。
## 基础表格结构

一个语义化的HTML表格结构应该包含以下部分：

```html
<table>
  <caption>表格标题</caption>
  <thead>
    <tr>
      <th scope="col">表头1</th>
      <th scope="col">表头2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">行标题</th>
      <td>数据</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <th scope="row" colspan="2">表尾</th>
    </tr>
  </tfoot>
</table>
```

## 间距与布局

### 表格布局模式

```css
table {
  /* 固定布局模式，性能更好，更可预测 */
  table-layout: fixed;
  width: 100%;
  
  /* 边框合并 */
  border-collapse: collapse;
  border: 3px solid #333;
}
```

### 设置列宽

```css
/* 使用选择器设置特定列的宽度 */
thead th:nth-child(1) {
  width: 30%;
}

thead th:nth-child(2) {
  width: 20%;
}
```

### 单元格间距

```css
th,
td {
  padding: 12px;
  text-align: left;
}
```

## 表格样式美化

### 表头和表尾样式

```css
thead,
tfoot {
  background-color: #333;
  color: white;
}

thead th,
tfoot th,
tfoot td {
  border: 2px solid #333;
}
```

### 斑马条纹效果

```css
/* 奇数行背景 */
tbody tr:nth-child(odd) {
  background-color: #f2f2f2;
}

/* 偶数行背景 */
tbody tr:nth-child(even) {
  background-color: #fff;
}
```

### 悬停效果

```css
tbody tr:hover {
  background-color: #ddd;
}
```

### 表格标题样式

```css
caption {
  padding: 10px;
  font-style: italic;
  caption-side: bottom; /* 标题位置 */
  color: #666;
  text-align: right;
}
```

## 响应式表格

对于移动设备，可以使用以下技巧：

```css
/* 在小屏幕上允许水平滚动 */
.table-container {
  overflow-x: auto;
}

/* 或者将表格转为垂直布局 */
@media screen and (max-width: 600px) {
  table {
    display: block;
  }
  
  tr {
    display: grid;
    grid-template-columns: 1fr 2fr;
    margin-bottom: 1em;
  }
}
```

## 最佳实践

1. **表格布局**：
   - 使用`table-layout: fixed`提高性能
   - 设置合理的列宽比例
   - 使用`border-collapse: collapse`统一边框

2. **可访问性**：
   - 使用适当的表格结构（thead、tbody、tfoot）
   - 为表头单元格设置正确的scope属性
   - 提供清晰的表格标题

3. **响应式设计**：
   - 考虑小屏幕设备的展示方式
   - 在必要时允许水平滚动
   - 可以考虑在移动端改变布局方式

4. **视觉层次**：
   - 使用斑马条纹提高可读性
   - 设置合适的内边距
   - 使用对比色区分表头和数据区