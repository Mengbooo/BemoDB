---
title: 表单/控件
date: '2025-06-07'
tags:
- FE
---

# 表单/控件

表单（form）以及例如 `<input>` 的控件（control）元素有许多特殊的属性和事件。

当我们学习了这些相关内容后，处理表单会变得更加方便。

表单导航：

`document.forms`

一个表单元素可以通过 `document.forms[name/index]` 访问到。

`form.elements`

表单元素可以通过 `form.elements[name/index]` 的方式访问，或者也可以使用 `form[name/index]`。elements 属性也适用于 `<fieldset>`。

`element.form`

元素通过 `form` 属性来引用它们所属的表单。

value 可以被通过 `input.value，textarea.value，select.value` 等来获取到。（对于单选按钮（radio button）和复选框（checkbox），可以使用 input.checked 来确定是否选择了一个值。

对于 `<select>`，我们可以通过索引 `select.selectedIndex` 来获取它的 value，也可以通过 `<option>` 集合 `select.options` 来获取它的 value。

## 聚焦：focus/blur

在元素获得/失去焦点时会触发 `focus` 和 `blur` 事件。

它们的特点是：

- 它们不会冒泡。但是可以改为在捕获阶段触发，或者使用 focusin/focusout。
- 大多数元素默认不支持聚焦。使用 tabindex 可以使任何元素变成可聚焦的。

可以通过 document.activeElement 来获取当前所聚焦的元素。

## 事件：change，input，cut，copy，paste

数据更改事件:

| 事件           | 描述                 | 特点                                                                                                                    |
| -------------- | -------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| change         | 值被改变。           | 对于文本输入，当失去焦点时触发。                                                                                        |
| input          | 文本输入的每次更改。 | 立即触发，与 change 不同。                                                                                              |
| cut/copy/paste | 剪贴/拷贝/粘贴行为。 | 行为可以被阻止。event.clipboardData 属性可以用于访问剪贴板。除了火狐（Firefox）之外的浏览器都支持 navigator.clipboard。 |

## 表单：事件和方法提交

提交表单时，会触发 submit 事件，它通常用于在将表单发送到服务器之前对表单进行校验，或者中止提交，并使用 JavaScript 来处理表单。

### 事件：submit

提交表单主要有两种方式：

- 第一种 —— 点击 `<input type="submit">` 或 `<input type="image">`。
- 第二种 —— 在 input 字段中按下 Enter 键。

这两个行为都会触发表单的 submit 事件。处理程序可以检查数据，如果有错误，就显示出来，并调用 `event.preventDefault()`，这样表单就不会被发送到服务器了。

### 方法：submit

如果要手动将表单提交到服务器，我们可以调用 `form.submit()`。

这样就不会产生 submit 事件。这里假设如果开发人员调用 `form.submit()`，就意味着此脚本已经进行了所有相关处理。



























































































































