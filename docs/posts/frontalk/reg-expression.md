# 正则表达式

正则表达式是一个查找和替换字符串的强有力的方式。它在前端的使用场景很广，但是它的语法比较复杂，要想完全记住不太现实，故而在这里给出一些参考链接/工具，以及一些它在前端中的情景案例。


## 参考链接：

- https://www.cnblogs.com/baozhengrui/p/18631791
- https://www.runoob.com/regexp/regexp-syntax.html
- https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Regular_expressions
- https://zh.javascript.info/regexp-introduction

## 工具：

- https://www.sojson.com/regex/generate

## 案例：

以下是一些前端使用正则表达式的常见场景及代码示例：

1. **验证用户名**：用户名通常由字母、数字、下划线组成，长度在 3 到 20 个字符之间。

```javascript
function validateUsername(username) {
    const regex = /^[a-zA-Z0-9_]{3,20}$/;
    return regex.test(username);
}

const username1 = "user_123";
const username2 = "ab";
console.log(validateUsername(username1)); // true
console.log(validateUsername(username2)); // false
```

2. **验证密码**：密码要求至少 8 个字符，包含至少一个大写字母、一个小写字母、一个数字和一个特殊字符（如 `!@#$%^&*` 等）。

```javascript
function validatePassword(password) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
}

const password1 = "Abc123!@#";
const password2 = "abc123";
console.log(validatePassword(password1)); // true
console.log(validatePassword(password2)); // false
```

3. **提取 URL 中的参数**：从 URL 中提取指定的参数值。

```javascript
function getUrlParameter(url, paramName) {
    const regex = new RegExp('[?&]' + paramName + '=([^&]*)', 'i');
    const match = url.match(regex);
    return match? decodeURIComponent(match[1]) : null;
}

const url = "https://example.com/?name=John&age=30";
console.log(getUrlParameter(url, "name")); // John
console.log(getUrlParameter(url, "age"));  // 30
```

4. **验证 IP 地址**：验证输入的字符串是否是合法的 IP 地址（IPv4）。

```javascript
function validateIPAddress(ip) {
    const regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return regex.test(ip);
}

const ip1 = "192.168.1.1";
const ip2 = "192.168.1.256";
console.log(validateIPAddress(ip1)); // true
console.log(validateIPAddress(ip2)); // false
```

5. **去除字符串中的 HTML 标签**：将字符串中的 HTML 标签去除，只保留文本内容。

```javascript
function removeHTMLTags(text) {
    const regex = /<[^>]*>/g;
    return text.replace(regex, '');
}

const htmlText = "<p>这是一段包含 <b>加粗</b> 标签的文本。</p>";
console.log(removeHTMLTags(htmlText)); 
// 输出：这是一段包含 加粗 标签的文本。
```

6. **匹配信用卡号格式**：验证信用卡号是否符合常见的格式（以 4、5、6 开头，长度为 16 位数字，每 4 位数字之间可以用空格分隔）。

```javascript
function validateCreditCardNumber(cardNumber) {
    const regex = /^(4|5|6)\d{3}(?:\s?\d{4}){3}$/;
    return regex.test(cardNumber);
}

const cardNumber1 = "4111 1111 1111 1111";
const cardNumber2 = "1234567890123456";
console.log(validateCreditCardNumber(cardNumber1)); // true
console.log(validateCreditCardNumber(cardNumber2)); // false
``` 














































