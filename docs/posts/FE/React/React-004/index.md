---
title: 'React#004 | 脱围机制'
date: '2025-07-09'
tags:
- FE
- React
---

# React#004 | 脱围机制

React 的声明式编程模型让我们能够以组件和状态的方式思考UI，而不必直接操作DOM。但在某些特殊场景下，我们需要"脱离"这种模型，直接与底层DOM交互或执行一些特殊操作。这些机制就是React的"脱围机制"（Escape Hatches）。本文将详细介绍React提供的各种脱围机制及其适用场景。

## 引用值：useRef

### 基本概念

`useRef` 是React提供的一个Hook，返回一个可变的引用对象，该对象在组件整个生命周期内保持不变。它有两个主要用途：

1. 访问DOM元素
2. 保存任意可变值，且不触发重新渲染

```jsx
import { useRef } from 'react';

function TextInputWithFocusButton() {
  // 创建ref对象
  const inputRef = useRef(null);
  
  function handleClick() {
    // 使用ref访问DOM元素并调用其方法
    inputRef.current.focus();
  }
  
  return (
    <>
      <input ref={inputRef} type="text" />
      <button onClick={handleClick}>
        聚焦输入框
      </button>
    </>
  );
}
```

### 引用值与状态的区别

引用值（ref）与状态（state）的关键区别：

1. 修改ref.current不会触发重新渲染
2. ref是可变的，而状态是不可变的
3. ref不会在渲染过程中发生变化，而状态可能会

```jsx
function Stopwatch() {
  const [startTime, setStartTime] = useState(null);
  const [now, setNow] = useState(null);
  const intervalRef = useRef(null);

  function handleStart() {
    setStartTime(Date.now());
    setNow(Date.now());
    
    // 存储定时器ID，不需要触发重新渲染
    intervalRef.current = setInterval(() => {
      setNow(Date.now());
    }, 10);
  }
  
  function handleStop() {
    clearInterval(intervalRef.current);
  }
  
  // 计算经过时间
  let secondsPassed = 0;
  if (startTime != null && now != null) {
    secondsPassed = (now - startTime) / 1000;
  }
  
  return (
    <>
      <h1>经过时间: {secondsPassed.toFixed(3)}</h1>
      <button onClick={handleStart}>开始</button>
      <button onClick={handleStop}>停止</button>
    </>
  );
}
```

## 操作DOM：使用Refs

虽然React自动处理大部分DOM操作，但有时我们需要直接访问DOM元素。比如：

- 管理焦点、文本选择或媒体播放
- 触发强制动画
- 集成第三方DOM库

### 访问DOM节点

```jsx
function VideoPlayer({ src }) {
  const videoRef = useRef(null);
  
  function handlePlay() {
    videoRef.current.play();
  }
  
  function handlePause() {
    videoRef.current.pause();
  }
  
  return (
    <>
      <video ref={videoRef} src={src} />
      <button onClick={handlePlay}>播放</button>
      <button onClick={handlePause}>暂停</button>
    </>
  );
}
```

### 最佳实践

1. 使用ref访问DOM是一个"脱围"操作，应该谨慎使用
2. 大多数情况下，内置功能已经足够（如表单控制）
3. 不要过度使用ref来管理应用流程

## 同步外部系统：useEffect

`useEffect` 让你可以将组件与外部系统同步，例如：

- 与网络、浏览器API或第三方库交互
- 设置订阅
- 修改DOM
- 获取数据

### 基本用法

```jsx
import { useState, useEffect } from 'react';

function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  
  useEffect(() => {
    // 设置
    const connection = createConnection(roomId);
    connection.connect();
    
    // 处理消息事件
    connection.on('message', (message) => {
      setMessages(prev => [...prev, message]);
    });
    
    // 清理函数
    return () => {
      connection.disconnect();
    };
  }, [roomId]); // 依赖数组
  
  // ...渲染消息列表...
}
```

### 依赖数组与重新同步

依赖数组控制Effect的执行时机：

1. 空数组 `[]` - 只在组件挂载和卸载时执行
2. 有依赖 `[a, b]` - 当依赖项改变时执行
3. 不提供数组 - 每次渲染后执行

```jsx
function ProfilePage({ userId }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    // 当userId变化时，这个Effect会重新运行
    async function fetchUser() {
      const response = await fetch(`/api/users/${userId}`);
      const data = await response.json();
      setUser(data);
    }
    
    fetchUser();
  }, [userId]); // 只在userId变化时重新执行
  
  if (user === null) {
    return <p>加载中...</p>;
  }
  
  return (
    <>
      <h1>{user.name}</h1>
      <p>邮箱: {user.email}</p>
    </>
  );
}
```

### 使用Effect的常见错误

1. 忘记处理竞态条件
2. 创建无限循环
3. 依赖数组不完整

```jsx
// 处理竞态条件的例子
function SearchResults({ query }) {
  const [results, setResults] = useState(null);
  
  useEffect(() => {
    let ignore = false;
    
    async function fetchResults() {
      const response = await fetch(`/api/search?q=${query}`);
      const data = await response.json();
      
      // 避免在已经卸载或重新获取的情况下设置状态
      if (!ignore) {
        setResults(data);
      }
    }
    
    fetchResults();
    
    // 清理函数设置标志位
    return () => {
      ignore = true;
    };
  }, [query]);
  
  // ...
}
```

### 什么时候不需要Effect

以下情况不应使用Effect：

1. 转换数据 - 直接在渲染期间进行
2. 处理用户事件 - 在事件处理程序中处理
3. 购买商品、发送消息等非交互效果 - 使用事件处理器

```jsx
// 🚫 不需要Effect
function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  
  // 错误：不需要Effect来计算派生值
  const [fullName, setFullName] = useState('');
  useEffect(() => {
    setFullName(firstName + ' ' + lastName);
  }, [firstName, lastName]);
  
  // ...
}

// ✅ 直接在渲染期间计算
function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  
  // 计算派生值
  const fullName = firstName + ' ' + lastName;
  
  // ...
}
```

## 精确控制DOM更新：useLayoutEffect

`useLayoutEffect` 与 `useEffect` 的API完全相同，但它会在浏览器重绘屏幕之前同步执行。这对于测量布局或防止可见的闪烁很有用。

```jsx
import { useState, useLayoutEffect, useRef } from 'react';

function Tooltip({ text, children }) {
  const [tooltipHeight, setTooltipHeight] = useState(0);
  const tooltipRef = useRef(null);
  
  useLayoutEffect(() => {
    // 在DOM更新后但浏览器绘制前执行
    // 这样可以避免视觉闪烁
    const height = tooltipRef.current.getBoundingClientRect().height;
    setTooltipHeight(height);
  }, []);
  
  return (
    <div className="tooltip-container">
      {children}
      <div 
        className="tooltip"
        ref={tooltipRef}
        style={{ bottom: tooltipHeight }}
      >
        {text}
      </div>
    </div>
  );
}
```

### useEffect vs useLayoutEffect

- **useEffect**: 在浏览器绘制后异步执行，不会阻塞视觉更新
- **useLayoutEffect**: 在浏览器绘制前同步执行，会阻塞视觉更新

一般来说，应该优先使用useEffect，只有当遇到视觉闪烁或需要在绘制前测量DOM时，才使用useLayoutEffect。

## 跨组件交互：forwardRef和useImperativeHandle

### 转发Refs

`forwardRef` 允许组件接收ref并将其转发给子组件：

```jsx
import { forwardRef } from 'react';

// 使用forwardRef接收父组件传递的ref
const MyInput = forwardRef(function MyInput(props, ref) {
  return <input ref={ref} {...props} />;
});

function Form() {
  const inputRef = useRef(null);
  
  function handleClick() {
    inputRef.current.focus();
  }
  
  return (
    <>
      {/* 可以直接将ref传递给自定义组件 */}
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>聚焦输入框</button>
    </>
  );
}
```

### 自定义暴露给父组件的实例值

`useImperativeHandle` 让你自定义通过ref暴露给父组件的实例值：

```jsx
import { forwardRef, useRef, useImperativeHandle } from 'react';

// 使用useImperativeHandle自定义暴露的方法
const FancyInput = forwardRef(function FancyInput(props, ref) {
  const inputRef = useRef(null);
  
  // 自定义暴露的方法
  useImperativeHandle(ref, () => ({
    // 只暴露我们想要父组件使用的方法
    focus() {
      inputRef.current.focus();
    },
    // 添加自定义功能
    setCustomValue(value) {
      inputRef.current.value = value.toUpperCase();
    }
  }));
  
  return <input ref={inputRef} {...props} />;
});

function Form() {
  const fancyInputRef = useRef(null);
  
  function handleClick() {
    // 调用自定义方法
    fancyInputRef.current.setCustomValue('hello');
    fancyInputRef.current.focus();
  }
  
  return (
    <>
      <FancyInput ref={fancyInputRef} />
      <button onClick={handleClick}>
        设置值并聚焦
      </button>
    </>
  );
}
```

这种方式可以限制父组件对子组件DOM的访问，只暴露必要的功能，增强封装性。

## 逃离渲染树：Portals

Portal允许你将子节点渲染到父组件DOM层次结构之外的DOM节点中：

```jsx
import { createPortal } from 'react-dom';

function Modal({ isOpen, children, onClose }) {
  if (!isOpen) return null;
  
  // 将内容渲染到body末尾的一个特定DOM节点
  return createPortal(
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-button" onClick={onClose}>
          关闭
        </button>
        <div className="modal-content">
          {children}
        </div>
      </div>
    </div>,
    document.getElementById('modal-root') // 目标DOM节点
  );
}

function App() {
  const [showModal, setShowModal] = useState(false);
  
  return (
    <>
      <button onClick={() => setShowModal(true)}>
        显示模态框
      </button>
      
      <Modal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)}
      >
        <h2>模态框内容</h2>
        <p>这个内容实际上渲染在DOM树的其他位置！</p>
      </Modal>
    </>
  );
}
```

Portal适用于需要"逃离"父组件CSS限制的场景，如模态框、提示框、浮层等。虽然在DOM上这些元素位于其他位置，但在React组件树中，它们仍然是正常的子组件，可以获取context和冒泡事件。

## 自定义Hook：抽象脱围逻辑

自定义Hook是复用状态逻辑的强大机制，尤其适合封装脱围机制的复杂逻辑：

```jsx
// 自定义Hook：管理localStorage
function useLocalStorage(key, initialValue) {
  // 懒初始化，尝试从localStorage获取数据
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  // 自定义设置方法，同时更新状态和localStorage
  const setValue = value => {
    try {
      // 允许value是函数，类似setState
      const valueToStore = 
        value instanceof Function ? value(storedValue) : value;
      
      // 保存state
      setStoredValue(valueToStore);
      
      // 保存到localStorage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
}

// 使用自定义Hook
function SavedSettings() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  
  return (
    <div>
      <select 
        value={theme}
        onChange={e => setTheme(e.target.value)}
      >
        <option value="light">浅色</option>
        <option value="dark">深色</option>
      </select>
      <p>当前主题: {theme}</p>
    </div>
  );
}
```

自定义Hook是组合多个React钩子的函数，以提取和重用组件逻辑。它们不仅可以封装脱围机制的逻辑，还能通过功能分离使代码更容易理解和测试。

## 最佳实践与注意事项

### 何时使用脱围机制

脱围机制是强大的工具，但并非所有问题的默认解决方案。应遵循以下原则：

1. **首选声明式解决方案**: 在使用脱围机制前，先尝试声明式方法解决问题
2. **隔离副作用**: 将副作用和命令式代码限制在明确的区域，不要让它们扩散
3. **谨慎直接操作DOM**: 只在必要时使用refs操作DOM
4. **维护React单向数据流**: 脱围机制不应打破数据流方向

### 常见问题和解决方案

| 问题 | 推荐解决方案 |
|------|------------|
| 获取DOM测量或直接操作DOM | useRef + (视情况)useLayoutEffect |
| 管理非React状态的外部系统 | useEffect(同步) + useRef(存储实例) |
| 数据获取 | useEffect，或考虑使用专门的数据获取库 |
| 表单验证 | 首选受控组件，必要时使用ref |
| 动画 | 考虑使用CSS或专门的动画库 |
| 模态框、提示框等 | createPortal |

## 总结

React的脱围机制提供了在声明式编程模型外处理特殊场景的能力，主要包括：

- **useRef**: 维护跨渲染的可变引用
- **DOM Refs**: 直接与DOM元素交互
- **useEffect**: 连接外部系统和处理副作用
- **useLayoutEffect**: 在浏览器绘制前同步处理DOM
- **forwardRef & useImperativeHandle**: 自定义组件实例暴露的功能
- **Portals**: 在DOM树的不同位置渲染内容
- **自定义Hooks**: 封装和复用脱围逻辑

理解这些机制何时使用以及如何正确使用是构建复杂React应用的关键。脱围机制应该谨慎使用，但当正确应用时，它们能够显著增强应用的功能和灵活性。
