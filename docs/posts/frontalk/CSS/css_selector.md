# CSS 选择器

CSS选择器是CSS规则的第一部分，它能帮助我们精确地选择要样式化的HTML元素。掌握选择器的使用对于编写高效的CSS代码至关重要。

## 基础选择器

### 1. 通用选择器 (*)
选择页面上的所有元素。
```css
* {
    margin: 0;
    padding: 0;
}
```

### 2. 元素选择器
直接使用HTML标签名称作为选择器。
```css
p {
    color: blue;
}

h1 {
    font-size: 24px;
}
```

### 3. 类选择器 (.)
使用点号(.)选择特定class的元素。
```css
.highlight {
    background-color: yellow;
}

.text-center {
    text-align: center;
}
```

### 4. ID选择器 (#)
使用井号(#)选择特定id的元素。
```css
#header {
    background-color: black;
    color: white;
}
```

### 5. 属性选择器
选择具有特定属性或属性值的元素。
```css
/* 选择所有具有title属性的元素 */
[title] {
    cursor: help;
}

/* 选择所有href属性值以https开头的链接 */
[href^="https"] {
    color: green;
}

/* 选择所有href属性值以.pdf结尾的链接 */
[href$=".pdf"] {
    background: url('pdf-icon.png') no-repeat;
    padding-left: 20px;
}
```

## 组合选择器

### 1. 后代选择器（空格）
选择某个元素的所有后代元素。
```css
div p {
    margin-bottom: 10px;
}
```

### 2. 子元素选择器（>）
只选择直接子元素。
```css
ul > li {
    list-style: square;
}
```

### 3. 相邻兄弟选择器（+）
选择紧接在某个元素后的元素。
```css
h2 + p {
    font-size: 1.2em;
}
```

### 4. 通用兄弟选择器（~）
选择某个元素后的所有兄弟元素。
```css
h2 ~ p {
    color: gray;
}
```

## 伪类选择器

伪类用于定义元素的特殊状态。

### 1. 链接伪类
```css
/* 未访问的链接 */
a:link {
    color: blue;
}

/* 已访问的链接 */
a:visited {
    color: purple;
}

/* 鼠标悬停状态 */
a:hover {
    text-decoration: underline;
}

/* 激活状态（鼠标点击时） */
a:active {
    color: red;
}
```

### 2. 结构性伪类
```css
/* 第一个子元素 */
li:first-child {
    font-weight: bold;
}

/* 最后一个子元素 */
li:last-child {
    border-bottom: none;
}

/* 奇数项 */
tr:nth-child(odd) {
    background-color: #f2f2f2;
}

/* 偶数项 */
tr:nth-child(even) {
    background-color: #ffffff;
}
```

### 3. 状态伪类
```css
/* 禁用的输入框 */
input:disabled {
    background-color: #eee;
}

/* 选中的复选框 */
input:checked {
    border-color: blue;
}

/* 获得焦点的输入框 */
input:focus {
    outline: 2px solid blue;
}
```

## 伪元素选择器

伪元素用于创建一些不在DOM树中的元素。

```css
/* 第一行 */
p::first-line {
    font-size: 1.2em;
}

/* 第一个字母 */
p::first-letter {
    font-size: 2em;
    float: left;
}

/* 在元素之前插入内容 */
.quote::before {
    content: "「";
    color: #666;
}

/* 在元素之后插入内容 */
.quote::after {
    content: "」";
    color: #666;
}
```

## 选择器优先级

CSS选择器的优先级（从上到下优先级逐级降低）：

- 内联样式
- ID选择器
- 类选择器、属性选择器
- 素选择器、伪元素
- 通用选择器(*)

例如：
```css
/* 优先级：4 */
p { color: red; }

/* 优先级：3 */
.text { color: blue; }

/* 优先级：1 */
#unique { color: green; }

/* 优先级：2 */
p.text { color: yellow; }
```

## 最佳实践

1. 避免过度使用ID选择器
2. 优先使用类选择器
3. 避免选择器嵌套过深
4. 使用有意义的类名
5. 保持选择器的可维护性和重用性

## 示例

下面是一个综合运用各种选择器的实例：

```css
/* 基础样式 */
.container > * {
    margin-bottom: 1em;
}

/* 文章标题 */
article h1:first-child {
    font-size: 2em;
    color: #333;
}

/* 列表样式 */
.content-list > li:nth-child(odd) {
    background-color: #f5f5f5;
}

/* 表单元素 */
input[type="text"]:focus {
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0,123,255,0.5);
}

/* 链接样式 */
.nav-links a:not(:last-child)::after {
    content: " |";
    color: #ccc;
}
```

## 参考

[MDN CSS](https://developer.mozilla.org/zh-CN/docs/Learn_web_development/Core/Styling_basics/What_is_CSS) 十分详细