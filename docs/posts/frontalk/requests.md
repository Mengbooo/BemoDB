---
title: 网络请求
date: '2025-04-26'
tags:
- frontalk
---

# 网络请求

::: tip 
- [前端请求进化史 | 从 Form 到 Server Actions](https://www.bilibili.com/video/BV1PQdUYZEAG/?spm_id_from=333.337.search-card.all.click&vd_source=ae63c2d5c481a66256b954757a997831)
- https://zh.javascript.info/network
:::

在前端开发中，网络请求是与后端服务器进行数据交互的重要手段。

## 一、XMLHttpRequest
### 1. 概述
`XMLHttpRequest`（XHR）是一个内置的浏览器对象，用于在后台与服务器进行数据交互。它可以用于获取任何类型的数据，而不仅仅是 XML，并且支持多种数据格式，如 JSON、HTML 等。

### 2. 基本用法
```javascript
// 创建 XHR 对象
let xhr = new XMLHttpRequest();

// 初始化请求
xhr.open('GET', 'https://example.com/api/data');

// 发送请求
xhr.send();

// 监听请求状态变化
xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
        console.log(xhr.responseText);
    }
};
```

### 3. 请求状态
`readyState` 属性表示请求的当前状态，常见的状态值有：
- `0`：未初始化，`open()` 方法还未被调用。
- `1`：已建立连接，`open()` 方法已被调用，但 `send()` 方法还未被调用。
- `2`：请求已发送，`send()` 方法已被调用，并且服务器已经收到请求。
- `3`：正在接收响应，服务器正在返回响应数据。
- `4`：请求完成，响应数据已经完全接收。

### 4. 错误处理
可以通过 `xhr.onerror` 事件来处理请求过程中发生的错误：
```javascript
xhr.onerror = function() {
    console.log('请求发生错误');
};
```

## 二、Fetch API
### 1. 概述
`Fetch API` 是一个现代的、基于 Promise 的网络请求 API，它提供了更简洁、更强大的接口来处理网络请求。

### 2. 基本用法
```javascript
fetch('https://example.com/api/data')
  .then(response => {
        if (!response.ok) {
            throw new Error('请求失败');
        }
        return response.json();
    })
  .then(data => console.log(data))
  .catch(error => console.error(error));
```

### 3. 请求配置
`fetch()` 方法的第二个参数可以用于配置请求，例如设置请求方法、请求头、请求体等：
```javascript
fetch('https://example.com/api/data', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ key: 'value' })
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));
```

### 4. 响应处理
`fetch()` 返回的 `response` 对象提供了多种方法来处理响应数据，如 `json()`、`text()`、`blob()` 等：
```javascript
fetch('https://example.com/api/data')
  .then(response => response.text())
  .then(text => console.log(text))
  .catch(error => console.error(error));
```

## 三、跨域请求
### 1. 同源策略
同源策略是浏览器的一个安全机制，它限制了一个源的网页如何与另一个源的资源进行交互。同源是指协议、域名和端口都相同。

### 2. CORS（跨域资源共享）
CORS 是一种机制，它允许服务器在响应头中声明哪些源可以访问其资源。通过设置 `Access-Control-Allow-Origin` 等响应头，服务器可以控制跨域请求的访问权限。

### 3. JSONP（JSON with Padding）
JSONP 是一种绕过同源策略的技术，它利用了 `<script>` 标签可以跨域加载资源的特性。服务器返回的是一个包含 JSON 数据的 JavaScript 函数调用，客户端通过定义该函数来处理数据。

```html
<script>
    function handleResponse(data) {
        console.log(data);
    }
</script>
<script src="https://example.com/api/data?callback=handleResponse"></script>
```

## 四、WebSocket
### 1. 概述
`WebSocket` 是一种在单个 TCP 连接上进行全双工通信的协议，它允许客户端和服务器之间实时、双向地交换数据。

### 2. 基本用法
```javascript
// 创建 WebSocket 连接
let socket = new WebSocket('wss://example.com/ws');

// 监听连接建立事件
socket.onopen = function() {
    console.log('连接已建立');
    socket.send('Hello, server!');
};

// 监听消息接收事件
socket.onmessage = function(event) {
    console.log('收到消息:', event.data);
};

// 监听连接关闭事件
socket.onclose = function() {
    console.log('连接已关闭');
};
```

## 五、服务器发送事件（SSE）
### 1. 概述
服务器发送事件（Server-Sent Events，SSE）是一种允许服务器向客户端推送实时更新的技术。与 WebSocket 不同，SSE 是单向的，只能从服务器向客户端发送数据。

### 2. 基本用法
```javascript
// 创建 EventSource 对象
let eventSource = new EventSource('https://example.com/sse');

// 监听消息事件
eventSource.onmessage = function(event) {
    console.log('收到服务器推送:', event.data);
};

// 监听错误事件
eventSource.onerror = function() {
    console.log('SSE 连接发生错误');
};
```

综上所述，网络请求在前端开发中扮演着至关重要的角色。`XMLHttpRequest` 是传统的网络请求方式，`Fetch API` 则提供了更现代、更简洁的接口，而 `WebSocket` 和 SSE 则适用于实时数据交互的场景。了解和掌握这些网络请求技术，能够帮助我们更好地开发出功能强大、响应及时的前端应用。 



















































































































































































































































































































































































































































































































































































































































