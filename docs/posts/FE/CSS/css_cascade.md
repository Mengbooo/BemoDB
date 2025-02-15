# 层叠、继承与优先级

CSS（层叠样式表）中的"层叠"是一个核心概念，它决定了如何处理多个样式规则之间的冲突。本文将详细介绍CSS中的层叠、继承和优先级机制。

## 层叠（Cascade）

层叠是CSS的一个基本特征，它定义了如何合并来自多个源的属性值。当多个规则应用到同一个元素时，层叠机制会根据以下因素决定最终使用哪个样式：

1. 样式来源
2. 选择器优先级
3. 代码顺序

### 样式来源

样式的来源按照优先级从高到低排序：

1. 内联样式（style属性）
2. 内部样式（style标签）和外部样式（link标签）
3. 浏览器默认样式

## 继承（Inheritance）

继承允许子元素自动获取父元素的某些CSS属性值。

### 可继承的属性

常见的可继承属性包括：

- 文字相关：`color`、`font-family`、`font-size`、`font-weight`、`line-height`
- 文本相关：`text-align`、`text-indent`
- 可见性：`visibility`
- 光标：`cursor`

### 不可继承的属性

常见的不可继承属性包括：

- 盒模型相关：`width`、`height`、`margin`、`padding`、`border`
- 定位相关：`position`、`top`、`right`、`bottom`、`left`
- 背景相关：`background`

### 控制继承

CSS提供了几个特殊值来控制继承：

- `inherit`：强制继承父元素的值
- `initial`：将属性设置为默认值
- `unset`：如果属性是可继承的则继承，否则使用初始值
- `revert`：重置为浏览器默认样式

## 优先级（Specificity）

当多个选择器作用于同一个元素时，优先级决定了最终应用哪个样式。

### 优先级计算规则

优先级按照以下方式计算（从高到低）：

1. `!important` 声明
2. 内联样式：1000分
3. ID选择器：100分
4. 类选择器、属性选择器、伪类：10分
5. 元素选择器、伪元素：1分
6. 通配符（*）：0分

示例：

```css
#header .nav li { /* 优先级：111 */
    color: blue;
}

.nav li.active { /* 优先级：21 */
    color: red;
}
```

### 优先级实践建议

1. 避免使用 `!important`
2. 使用类选择器而不是ID选择器
3. 不要过度嵌套选择器
4. 保持选择器简单且有意义

## 实际应用示例

```css
/* 基础样式 */
.button {
    background: gray;
    color: white;
}

/* 特定状态 */
.button.primary {
    background: blue;
}

/* 避免使用过于具体的选择器 */
.header .nav .button.primary { /* 不推荐 */
    background: green;
}
```

