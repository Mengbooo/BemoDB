---
title: CSS设计中的缺陷列表
date: '2025-06-07'
tags:
- recording
---

# CSS设计中的缺陷列表
::: tip 文章信息
Origin url : https://wiki.csswg.org/ideas/mistakes

2023/04/10 written by fantasai

translated & reprinted by Bolaxious in 2025.2.8

:::
如果有人发明了时光机，这些问题应该被修正。:P

## 命名和语法问题

1. `white-space: nowrap` 应该是 `white-space: no-wrap`，且换行行为不应该被添加到 `white-space` 属性中
2. `animation-iteration-count` 应该简化为 `animation-count`（就像 `column-count` 一样）
3. `vertical-align` 不应该应用于表格单元格。相反，CSS3的对齐属性应该在Level 1就存在
4. `vertical-align: middle` 应该叫做 `text-middle` 或 `x-middle`，因为它实际上并不是真正的居中，这样的命名更能描述它的实际作用
5. `border-radius` 应该叫做 `corner-radius`
6. `hyphens` 属性应该叫做 `hyphenate`（之所以叫hyphens是因为XSL:FO人员反对使用hyphenate）
7. `*-blend-mode` 属性应该简化为 `*-blend`

## 计算和行为问题

1. 百分比高度应该基于fill-available计算，而不是在auto情况下未定义
2. 表格布局应该更合理
3. `box-sizing` 默认值应该是 `border-box`
4. 带有一个值的 `background-size` 应该复制其值，而不是将第二个值默认为auto。`translate()` 也是如此
5. `background-position` 和 `border-spacing`（所有双轴属性）应该先指定垂直值，以匹配四方向属性如margin
6. 四值简写（如margin）应该按逆时针方向排列
7. `z-index` 应该叫做 `z-order` 或 `depth`，并且应该在所有元素上都能正常工作（就像在flex项目上一样）
8. `word-wrap`/`overflow-wrap` 不应该存在，而应该作为 `white-space` 的关键字，就像 `nowrap`（`no-wrap`）一样
9. 单个盒子的上下边距不应该自动折叠，这是所有边距折叠问题的根源

## 颜色相关

1. `currentColor` 关键字应该保留连字符，写作 `current-color`。同样适用于所有其他多词颜色关键字名称
2. 应该有一个可预测的颜色命名系统（如CNS），而不是最终采用的任意X11名称
3. `rgba()` 和 `hsla()` 不应该存在，`rgb()` 和 `hsl()` 应该有一个可选的第四个参数

## 选择器相关

1. 后代组合器应该是 `»`，间接兄弟组合器应该是 `++`，这样选择器的ascii艺术之间就有一些逻辑关系
2. 选择器的未来兼容性很差。我们应该在顶层逗号处分割，只忽略未知/无效的部分，而不是整个选择器

## 其他设计问题

1. `@import` 规则的问题：
   - 除非指定缓存头，否则总是需要网络请求
   - 每个导入都需要构建新的CSSStyleSheet对象，即使它们完全相同
   - 应该有更激进的基于URL的去重，并允许共享样式表对象

2. 注释几乎可以在CSS的任何地方出现，这使得它们在对象模型中基本上无法表示，进而使得直接在对象模型上构建编辑功能变得不可能

3. Flexbox中的对齐属性应该是相对于书写模式的，而不是相对于flex-flow的，这样就可以有合理理解的名称，如 `align-inline-*` 和 `align-block-*`

4. `shape-outside` 的名称中应该包含 `wrap-`，因为人们会假设形状也应该像 `clip-path` 那样裁剪内容

5. 不应该用 `!important` —— 这对工程师来说读起来像"不重要"。我们应该选择另一种写法

## 浏览器和性能问题

1. 表格（像其他非块元素，如flex容器）应该形成伪堆叠上下文
2. 绝对定位的替换元素在设置了对立偏移属性（如left+right）时应该拉伸，而不是起始对齐
3. `overflow: scroll` 应该引入堆叠上下文
4. `size` 应该是width和height的简写，而不是带有不同定义的@page属性

## 规范和语法问题

1. Unicode范围的语法应该与CSS的其他部分一致，如 `u0001-u00c8`
2. Unicode范围不应该有自己的微语法和标记化处理
3. `font-family` 应该要求字体名称必须加引号（像所有其他来自"外部"的CSS值一样）
4. 我们可能应该避免在网格属性中混合关键字（span）和标识符，可能通过使用函数符号（如span(2)）来解决

::: tip 注意
这些问题中的一些已经在新的规范中得到解决或改进，但由于向后兼容性的考虑，原有的设计仍然需要继续支持。
:::