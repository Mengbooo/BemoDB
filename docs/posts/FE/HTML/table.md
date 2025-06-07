---
title: HTML表格
date: '2025-06-07'
tags:
- FE
---

# HTML表格

表格是用于展示结构化数据的HTML元素。通过表格，我们可以将数据按行和列的方式清晰地呈现出来。

## 基本结构

### 核心元素

1. `<table>`：定义表格
2. `<tr>`：定义表格行
3. `<td>`：定义单元格
4. `<th>`：定义表头单元格

### 基本语法

```html
<table>
    <tr>
        <th>表头1</th>
        <th>表头2</th>
    </tr>
    <tr>
        <td>数据1</td>
        <td>数据2</td>
    </tr>
</table>
```

## 表格结构元素

### 1. 表格标题 `<caption>`

```html
<table>
    <caption>员工信息表</caption>
    <!-- 表格内容 -->
</table>
```

### 2. 表格分区

- `<thead>`：表格头部
- `<tbody>`：表格主体
- `<tfoot>`：表格底部

```html
<table>
    <thead>
        <tr>
            <th>姓名</th>
            <th>年龄</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>张三</td>
            <td>25</td>
        </tr>
    </tbody>
    <tfoot>
        <tr>
            <td colspan="2">总计：1人</td>
        </tr>
    </tfoot>
</table>
```

## 单元格属性

### 1. 跨行和跨列

- `colspan`：跨列
- `rowspan`：跨行

```html
<table>
    <tr>
        <td colspan="2">跨两列的单元格</td>
    </tr>
    <tr>
        <td rowspan="2">跨两行的单元格</td>
        <td>普通单元格</td>
    </tr>
    <tr>
        <td>普通单元格</td>
    </tr>
</table>
```

### 2. 对齐方式

```html
<td align="left">左对齐</td>
<td align="center">居中</td>
<td align="right">右对齐</td>
```

::: warning 注意
HTML5中不推荐使用align等样式属性，建议使用CSS来控制样式。
:::

## 表格样式

### 1. 基本样式

```css
table {
    border-collapse: collapse; /* 合并边框 */
    width: 100%;
}

th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
}

th {
    background-color: #f4f4f4;
}
```

### 2. 斑马线样式

```css
tr:nth-child(even) {
    background-color: #f9f9f9;
}
```

### 3. 悬停效果

```css
tr:hover {
    background-color: #f5f5f5;
}
```

## 响应式表格

### 1. 基本响应式

```css
.table-responsive {
    overflow-x: auto;
}
```

```html
<div class="table-responsive">
    <table>
        <!-- 表格内容 -->
    </table>
</div>
```

### 2. 移动端适配

```css
@media screen and (max-width: 600px) {
    table {
        display: block;
    }
    
    thead, tbody, tr, td {
        display: block;
    }
    
    th {
        display: none;
    }
    
    td {
        position: relative;
        padding-left: 50%;
    }
    
    td:before {
        content: attr(data-label);
        position: absolute;
        left: 0;
        width: 45%;
        padding-right: 10px;
        font-weight: bold;
    }
}
```

## 最佳实践

1. 语义化结构
   - 使用适当的表格结构元素
   - 提供清晰的表格标题
   - 使用合适的表头

2. 可访问性
   - 使用适当的表头关系
   - 提供表格摘要
   - 确保键盘导航可用

```html
<table aria-describedby="table-summary">
    <caption>产品列表</caption>
    <!-- 表格内容 -->
</table>
<p id="table-summary" class="sr-only">本表格展示了产品的基本信息</p>
```

3. 性能优化
   - 避免过大的表格
   - 考虑分页显示
   - 使用延迟加载

## 示例

### 完整的表格示例

```html
<table>
    <caption>公司员工信息表</caption>
    <thead>
        <tr>
            <th>姓名</th>
            <th>部门</th>
            <th>职位</th>
            <th>入职时间</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>张三</td>
            <td>技术部</td>
            <td>工程师</td>
            <td>2023-01-15</td>
        </tr>
        <tr>
            <td>李四</td>
            <td>市场部</td>
            <td>经理</td>
            <td>2022-06-01</td>
        </tr>
    </tbody>
    <tfoot>
        <tr>
            <td colspan="4">总计：2人</td>
        </tr>
    </tfoot>
</table>
```

## 注意事项

1. 不要使用表格做页面布局
2. 保持表格结构简单清晰
3. 考虑移动设备的显示效果
4. 注意表格的可访问性
5. 使用CSS控制样式，避免使用HTML样式属性

## 浏览器兼容性

- 基本表格元素：所有浏览器都支持
- 响应式特性：需要现代浏览器
- CSS新特性：可能需要添加前缀

表格是展示结构化数据的有效方式，通过合理使用HTML表格元素和CSS样式，我们可以创建清晰、美观且具有良好可访问性的数据展示界面。

