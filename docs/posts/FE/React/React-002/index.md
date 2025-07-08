---
title: 'React#002 | 添加交互'
date: '2025-07-08'
tags:
- FE
- React
---

# React#002 | 添加交互

React 的核心思想是通过组件构建用户界面，而添加交互是让这些界面变得生动和有用的关键。在本文中，我们将探讨如何为 React 应用添加交互性，包括响应事件、使用状态管理数据、组件记忆以及理解 React 的渲染机制等核心概念。

## 响应事件

在 React 中，你可以添加事件处理函数来响应用户交互，如点击、悬停、表单输入聚焦等操作。

### 添加事件处理函数

要添加事件处理函数，首先需要定义一个函数，然后将其作为 prop 传递给 JSX 标签。React 事件处理有一些特点：

- 事件处理函数以小驼峰命名（如 `onClick` 而非 `onclick`）
- 通过 JSX 传递函数作为事件处理器，而不是字符串

```jsx
function MyButton() {
  function handleClick() {
    alert('你点击了按钮！');
  }

  return (
    <button onClick={handleClick}>
      点击我
    </button>
  );
}
```

注意 `onClick={handleClick}` 结尾没有括号。不要调用事件处理函数，只需传递它即可。当用户点击按钮时，React 会调用你的事件处理函数。

你也可以使用箭头函数定义内联事件处理器：

```jsx
<button onClick={() => {
  alert('你点击了按钮！');
}}>
  点击我
</button>
```

### 在事件处理函数中读取 props

事件处理函数可以读取组件的 props：

```jsx
function AlertButton({ message, children }) {
  return (
    <button onClick={() => alert(message)}>
      {children}
    </button>
  );
}

export default function Toolbar() {
  return (
    <div>
      <AlertButton message="正在播放！">
        播放电影
      </AlertButton>
      <AlertButton message="正在上传！">
        上传图片
      </AlertButton>
    </div>
  );
}
```

### 向事件处理函数传递数据

有时你需要向事件处理函数传递额外的参数。例如，如果你有一个产品列表，并希望在点击"购买"按钮时传递产品ID：

```jsx
function ProductList() {
  const products = [
    { id: 1, name: '苹果' },
    { id: 2, name: '橙子' }
  ];

  function handleBuy(productId) {
    console.log('购买产品：', productId);
  }

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name}
          <button onClick={() => handleBuy(product.id)}>
            购买
          </button>
        </li>
      ))}
    </ul>
  );
}
```

### 阻止默认行为

在 React 中，不能通过返回 `false` 来阻止默认行为，必须显式调用 `e.preventDefault()`：

```jsx
function Form() {
  function handleSubmit(e) {
    e.preventDefault();
    console.log('你提交了表单');
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" />
      <button type="submit">提交</button>
    </form>
  );
}
```

这里的 `e` 是一个合成事件对象，React 根据 W3C 规范定义了这个对象，因此你不必担心跨浏览器兼容性问题。

### 事件传播

事件处理器也会捕获来自组件子元素的事件。我们称事件会在树中"冒泡"或"传播"：它从事件发生的地方开始，然后沿着树向上传播。

```jsx
function Toolbar() {
  return (
    <div className="Toolbar" onClick={() => {
      alert('你点击了工具栏！');
    }}>
      <button onClick={() => alert('正在播放！')}>
        播放电影
      </button>
      <button onClick={() => alert('正在上传！')}>
        上传图片
      </button>
    </div>
  );
}
```

如果你点击任一按钮，首先会执行它的 `onClick`，然后执行父 `<div>` 的 `onClick`。因此会显示两条消息。如果你直接点击工具栏，则只会执行父 `<div>` 的 `onClick`。

如果你想阻止事件传播，需要调用 `e.stopPropagation()`：

```jsx
function Button({ onClick, children }) {
  return (
    <button onClick={e => {
      e.stopPropagation();
      onClick();
    }}>
      {children}
    </button>
  );
}
```

## 状态：组件的记忆

组件通常需要根据交互改变屏幕上显示的内容。用户在输入框中输入文本、点击按钮切换面板、导航到不同页面等操作都需要组件"记住"一些信息，这就是状态（state）的作用。

### 添加状态变量

要在组件中添加状态变量，需要从 React 导入 `useState` Hook：

```jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      点击了 {count} 次
    </button>
  );
}
```

`useState` 返回一个数组，包含两个值：
1. 当前状态值（`count`）
2. 更新状态的函数（`setCount`）

### 状态的基本特性

状态有几个重要特性：

1. **状态是隔离和私有的**：同一个组件的多个实例各自拥有独立的状态
2. **状态是组件的"记忆"**：状态在重新渲染之间保持不变
3. **状态更新会触发重新渲染**：当你更新状态时，React 会重新渲染组件

### 使用多个状态变量

一个组件可以有多个状态变量：

```jsx
function Form() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isValid, setIsValid] = useState(false);
  
  // ...
}
```

当状态结构比较复杂时，可以考虑使用对象或数组：

```jsx
const [form, setForm] = useState({
  name: '',
  email: ''
});

// 更新对象状态时，需要保留其他字段
function handleNameChange(e) {
  setForm({
    ...form,
    name: e.target.value
  });
}
```

### 状态更新的注意事项

React 中的状态更新有一些重要特性：

1. **状态更新是异步的**：调用状态设置函数后，变量不会立即改变
2. **React 会批量处理状态更新**：多个状态更新可能会被合并为一次重新渲染
3. **状态应该被视为只读的**：不要直接修改状态对象，而是创建新的副本

当新的状态依赖于前一个状态时，应该使用函数形式的更新：

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(prevCount => prevCount + 1);
    // 可以连续调用多次
    setCount(prevCount => prevCount + 1);
  }

  return (
    <button onClick={handleClick}>
      点击增加
    </button>
  );
}
```

## 渲染和提交

当组件的状态更新时，React 会重新渲染组件。理解 React 的渲染过程对于构建高效的应用非常重要。

### 渲染过程

React 渲染组件的过程分为三个步骤：

1. **触发渲染**：初次渲染或状态更新时
2. **组件渲染**：React 调用组件函数获取新的 JSX
3. **提交到 DOM**：React 更新 DOM 以匹配新的 JSX

### 渲染触发条件

组件渲染有两种情况：

1. **初次渲染**：当应用启动时
2. **状态更新时**：组件或其祖先的状态被更新时

### 渲染不等于 DOM 更新

重要的是要理解，"渲染"并不意味着 React 会更新 DOM。React 只会计算需要对 DOM 进行的最小必要更改。

```jsx
function Counter() {
  const [count, setCount] = useState(0);
  console.log('组件渲染了!'); // 每次状态更新都会执行

  return (
    <div>
      <p>计数: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        增加
      </button>
    </div>
  );
}
```

即使组件函数在每次状态更新时都会执行，React 也只会更新实际发生变化的 DOM 元素（在这个例子中是计数文本）。

## 状态作为快照

React 中的状态更像是一个快照，而不是可变变量。设置状态不会改变已有的状态变量，而是触发一次新的渲染。

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1); // 使用的是当前渲染中的 count 值
    console.log(count);  // 仍然显示设置前的值
  }

  return (
    <button onClick={handleClick}>
      点击了 {count} 次
    </button>
  );
}
```

这种行为可能看起来很奇怪，但它有助于避免许多常见的错误。理解状态的这种"快照"特性对于正确处理异步代码至关重要。

### 在一次事件中多次更新状态

如果你需要在同一个事件中多次更新同一个状态，可以使用函数形式的更新：

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(c => c + 1); // 使用前一个状态值
    setCount(c => c + 1); // 使用更新后的状态值
    setCount(c => c + 1); // 使用更新后的状态值
  }

  return (
    <button onClick={handleClick}>
      +3
    </button>
  );
}
```

## 更新对象和数组状态

虽然 React 中的状态是不可变的，但这并不意味着你不能存储对象和数组。只是在更新它们时，需要创建新的对象或数组，而不是修改现有的。

### 更新对象

```jsx
function Form() {
  const [person, setPerson] = useState({
    name: '张三',
    age: 25
  });

  function handleNameChange(e) {
    setPerson({
      ...person,        // 复制其他字段
      name: e.target.value // 更新特定字段
    });
  }

  return (
    <input
      value={person.name}
      onChange={handleNameChange}
    />
  );
}
```

### 更新数组

```jsx
function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: '学习 React' },
    { id: 2, text: '找工作' }
  ]);

  function handleAddTodo() {
    const newTodo = { id: todos.length + 1, text: '新任务' };
    setTodos([...todos, newTodo]); // 创建新数组
  }

  function handleRemoveTodo(id) {
    setTodos(todos.filter(todo => todo.id !== id));
  }

  function handleUpdateTodo(id, newText) {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, text: newText } : todo
    ));
  }

  return (
    <>
      <button onClick={handleAddTodo}>添加任务</button>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            {todo.text}
            <button onClick={() => handleRemoveTodo(todo.id)}>
              删除
            </button>
            <button onClick={() => handleUpdateTodo(todo.id, todo.text + ' (已更新)')}>
              更新
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
```

### 常见的数组操作

以下是一些常见的数组操作及其在 React 中的不可变更新方式：

1. **添加元素**：使用展开运算符 `[...arr, newItem]` 或 `[newItem, ...arr]`
2. **删除元素**：使用 `filter()` 方法 `arr.filter(item => item.id !== itemToRemove.id)`
3. **更新元素**：使用 `map()` 方法 `arr.map(item => item.id === itemToUpdate.id ? { ...item, ...updates } : item)`
4. **替换元素**：结合 `slice()` 和展开运算符
5. **排序元素**：先复制数组，再排序 `[...arr].sort()`

### Immer 简化不可变更新

对于复杂的嵌套对象或数组，使用扩展运算符进行不可变更新可能会变得很繁琐。这时可以考虑使用 Immer 库来简化更新逻辑：

```jsx
import { useImmer } from 'use-immer';

function TodoList() {
  const [todos, updateTodos] = useImmer([
    { id: 1, text: '学习 React', done: false },
    { id: 2, text: '找工作', done: false }
  ]);

  function handleToggleTodo(id) {
    updateTodos(draft => {
      const todo = draft.find(t => t.id === id);
      todo.done = !todo.done;
    });
  }

  // ...
}
```

Immer 让你可以编写看起来像是直接修改对象的代码，但实际上它会在内部创建一个新的不可变副本。

## 表单处理

在 React 中处理表单是一个常见的需求，通常我们会使用"受控组件"模式。

### 受控组件

在 HTML 中，表单元素如 `<input>`、`<textarea>` 和 `<select>` 通常维护自己的状态。在 React 中，我们通常将表单元素的状态存储在组件的 state 中：

```jsx
function Form() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    console.log('提交的数据:', { name, email });
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="姓名"
      />
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="邮箱"
      />
      <button type="submit">提交</button>
    </form>
  );
}
```

这种方式的优点是：
1. 可以立即对用户输入进行验证
2. 可以有条件地禁用提交按钮
3. 可以强制输入格式

### 处理多个输入

当有多个输入字段时，可以使用一个对象来存储所有字段的值：

```jsx
function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log('提交的数据:', formData);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="姓名"
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="邮箱"
      />
      <textarea
        name="message"
        value={formData.message}
        onChange={handleChange}
        placeholder="留言"
      />
      <button type="submit">提交</button>
    </form>
  );
}
```

## 总结

在本文中，我们探讨了 React 中添加交互的核心概念：

1. **响应事件**：通过事件处理函数响应用户交互
2. **使用状态**：通过 `useState` Hook 为组件添加"记忆"
3. **理解渲染过程**：触发渲染、组件渲染和提交到 DOM
4. **状态作为快照**：理解 React 中状态的不可变特性
5. **更新对象和数组**：正确处理复杂状态的更新
6. **表单处理**：使用受控组件管理表单数据

掌握这些概念是构建交互式 React 应用的基础。随着你对 React 的深入理解，你将能够创建更加复杂和高效的用户界面。

