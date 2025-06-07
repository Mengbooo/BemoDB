---
title: HTML表单
date: '2025-02-08'
tags:
- FE
---

# HTML表单

表单是网页中用于收集用户输入的重要元素。通过表单，用户可以输入数据并提交给服务器进行处理。

## 基本结构

### 表单容器

```html
<form action="提交地址" method="提交方法">
    <!-- 表单元素 -->
</form>
```

### 重要属性

1. `action`：指定表单数据提交的地址
2. `method`：指定提交方法
   - `get`：数据通过URL传递
   - `post`：数据通过请求体传递
3. `enctype`：指定数据编码方式
   - `application/x-www-form-urlencoded`：默认值
   - `multipart/form-data`：用于文件上传
   - `text/plain`：纯文本格式

## 表单控件

### 1. 文本输入 `<input>`

```html
<!-- 单行文本 -->
<input type="text" name="username" placeholder="请输入用户名">

<!-- 密码 -->
<input type="password" name="password">

<!-- 数字 -->
<input type="number" min="0" max="100">

<!-- 邮箱 -->
<input type="email">

<!-- 电话 -->
<input type="tel">

<!-- URL -->
<input type="url">

<!-- 搜索 -->
<input type="search">
```

### 2. 多行文本 `<textarea>`

```html
<textarea name="message" rows="4" cols="50">
默认内容
</textarea>
```

### 3. 选择控件

```html
<!-- 下拉选择 -->
<select name="city">
    <option value="">请选择城市</option>
    <option value="bj">北京</option>
    <option value="sh">上海</option>
</select>

<!-- 单选按钮 -->
<input type="radio" name="gender" value="male" id="male">
<label for="male">男</label>
<input type="radio" name="gender" value="female" id="female">
<label for="female">女</label>

<!-- 复选框 -->
<input type="checkbox" name="hobby" value="reading" id="reading">
<label for="reading">阅读</label>
<input type="checkbox" name="hobby" value="sports" id="sports">
<label for="sports">运动</label>
```

### 4. 文件上传

```html
<input type="file" name="photo" accept="image/*">
```

### 5. 按钮

```html
<!-- 提交按钮 -->
<input type="submit" value="提交">
<!-- 或者 -->
<button type="submit">提交</button>

<!-- 重置按钮 -->
<input type="reset" value="重置">

<!-- 普通按钮 -->
<button type="button">点击</button>
```

## 表单分组

### 1. 字段集 `<fieldset>`

```html
<form>
    <fieldset>
        <legend>个人信息</legend>
        <label>姓名：<input type="text" name="name"></label>
        <label>年龄：<input type="number" name="age"></label>
    </fieldset>
</form>
```

### 2. 标签 `<label>`

```html
<!-- 显式关联 -->
<label for="username">用户名：</label>
<input type="text" id="username" name="username">

<!-- 隐式关联 -->
<label>
    密码：
    <input type="password" name="password">
</label>
```

## 表单验证

### 1. HTML5验证属性

```html
<!-- 必填字段 -->
<input type="text" required>

<!-- 正则表达式验证 -->
<input type="text" pattern="[A-Za-z]{3}">

<!-- 长度限制 -->
<input type="text" minlength="3" maxlength="12">

<!-- 数值范围 -->
<input type="number" min="0" max="100" step="5">
```

### 2. 自定义验证

```html
<input type="text" oninvalid="this.setCustomValidity('请输入有效的用户名')"
       oninput="this.setCustomValidity('')">
```

## 样式美化

### 1. 基本样式

```css
input, select, textarea {
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    width: 100%;
    box-sizing: border-box;
}

button {
    padding: 8px 16px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

button:hover {
    background-color: #45a049;
}
```

### 2. 状态样式

```css
/* 焦点状态 */
input:focus {
    outline: none;
    border-color: #4CAF50;
    box-shadow: 0 0 5px rgba(76,175,80,0.5);
}

/* 禁用状态 */
input:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
}

/* 验证状态 */
input:invalid {
    border-color: #ff0000;
}
```

## 最佳实践

1. 表单布局
   - 使用合适的标签
   - 保持一致的对齐
   - 合理分组相关字段

```html
<form class="form-container">
    <div class="form-group">
        <label for="email">邮箱：</label>
        <input type="email" id="email" name="email" required>
    </div>
    <div class="form-group">
        <label for="password">密码：</label>
        <input type="password" id="password" name="password" required>
    </div>
</form>
```

2. 可访问性
   - 使用语义化标签
   - 提供清晰的标签
   - 添加适当的提示信息

3. 用户体验
   - 提供即时反馈
   - 保持简单清晰
   - 适当使用占位符

## 注意事项

1. 始终进行服务器端验证
2. 注意表单安全性
3. 合理使用HTML5新特性
4. 考虑移动设备适配
5. 提供适当的错误提示

## 浏览器兼容性

- 基本表单元素：所有浏览器都支持
- HTML5新特性：现代浏览器支持
- 验证API：需要检查具体特性支持情况

表单是网页交互的重要组成部分，通过合理使用表单元素和验证机制，我们可以创建用户友好的数据收集界面。记住始终要在服务器端进行数据验证，客户端验证只是为了提供更好的用户体验。