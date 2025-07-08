---
title: 'React#001 | 描述UI'
date: '2025-07-08'
tags:
- FE
- React
---

# React#001 | 描述UI

React 是一个用于构建用户界面的 JavaScript 库，它的核心思想是通过组件化的方式来构建界面。与传统直接操作DOM的命令式编程不同，React采用声明式编程范式，让开发者只需描述"UI在给定状态下应该是什么样子"，而不必关心"如何通过DOM操作达到这个状态"。

在本文中，我们将按照React官方文档的结构，深入探讨React中描述UI的核心概念，包括组件的创建和组合、组件导入导出、JSX语法、Props传递、条件渲染、列表渲染以及保持组件纯粹性的重要性，这些是构建React应用的基础。

## 你的第一个组件

组件是React的核心概念。React应用由被称为"组件"的独立UI片段构建而成。本质上，React组件就是可以包含标签的JavaScript函数（或类）。组件可以小到一个按钮，也可以大到整个页面。

### 定义组件

在React中，组件是返回标签的JavaScript函数：

```jsx
function Profile() {
  return (
    <img
      src="https://i.imgur.com/MK3eW3As.jpg"
      alt="Katherine Johnson"
      className="avatar"
    />
  );
}
```

### 使用组件

一旦定义了组件，就可以在其他组件中使用它：

```jsx
export default function Gallery() {
  return (
    <section>
      <h1>了不起的科学家</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

在上面的例子中，`Gallery`组件渲染了三个`Profile`组件。

### 组件的嵌套和组织

组件可以嵌套使用，形成复杂的UI结构，这使得我们可以独立开发每个部分：

```jsx
function Profile() {
  return (
    <div className="profile">
      <Avatar />
      <ProfileInfo />
    </div>
  );
}

function Avatar() {
  return (
    <img
      src="https://i.imgur.com/MK3eW3As.jpg"
      alt="Katherine Johnson"
      className="avatar"
    />
  );
}

function ProfileInfo() {
  return (
    <div>
      <h2>Katherine Johnson</h2>
      <p>数学家、物理学家和航天工程师</p>
    </div>
  );
}
```

### 组件的特点和优势

1. **可重用性**：一旦创建，组件可以在应用的任何地方重复使用
2. **可维护性**：组件化使代码更容易理解和维护，每个组件都有明确的职责
3. **关注点分离**：将UI拆分为独立、可复用的部分，每个部分专注于单一功能
4. **测试友好**：独立组件更容易进行单元测试

### 组件的命名规则

React 组件名称必须以大写字母开头：

```jsx
function Button() { // 正确：以大写字母开头的组件名
  // ...
}

function header() { // 错误：React 会将其视为普通HTML标签
  // ...
}
```

这是因为React将小写字母开头的标签视为HTML标签，而将大写字母开头的标签视为组件。

**陷阱提示**：
- 组件名称必须以大写字母开头，否则React会将其视为HTML标签而非组件
- 每个组件必须返回有效的JSX元素或null
- 组件应该遵循单一职责原则，每个组件只做一件事

## 组件的导入与导出

随着应用规模的增长，将组件拆分到不同文件中会使代码更加清晰和可维护。这就需要使用JavaScript的模块系统来导入和导出组件。

### 导出组件

你可以通过两种主要方式导出组件：

#### 默认导出（推荐用于每个文件只有一个组件的情况）：

```jsx
// Profile.js
export default function Profile() {
  return (
    <img
      src="https://i.imgur.com/MK3eW3As.jpg"
      alt="Katherine Johnson"
      className="avatar"
    />
  );
}
```

#### 具名导出（适用于从一个文件导出多个组件）：

```jsx
// Buttons.js
export function PrimaryButton({ children }) {
  return <button className="primary">{children}</button>;
}

export function SecondaryButton({ children }) {
  return <button className="secondary">{children}</button>;
}
```

### 导入组件

与导出对应，导入也有两种主要方式：

#### 导入默认导出的组件：

```jsx
import Profile from './Profile.js';

function App() {
  return <Profile />;
}
```

#### 导入具名导出的组件：

```jsx
import { PrimaryButton, SecondaryButton } from './Buttons.js';

function App() {
  return (
    <div>
      <PrimaryButton>保存</PrimaryButton>
      <SecondaryButton>取消</SecondaryButton>
    </div>
  );
}
```

### 导入和导出的注意事项

1. **相对路径**：导入路径通常使用`./`开头表示相对路径
2. **文件扩展名**：`.js`扩展名可以省略，但包含它可以使导入更加明确
3. **默认导出与具名导出的混用**：一个文件可以同时包含默认导出和多个具名导出

```jsx
// Form.js
export function FormField({ children }) {
  return <div className="form-field">{children}</div>;
}

export default function Form({ children }) {
  return <form>{children}</form>;
}

// 导入
import Form, { FormField } from './Form.js';
```

### 组织和重构组件

随着应用增长，可能需要将组件移动或重构到新位置。这种情况下，更新所有导入路径可能会很繁琐。为此，可以创建一个"桶"文件（通常命名为`index.js`）来重新导出组件：

```jsx
// components/index.js
export { default as Avatar } from './Avatar.js';
export { default as Profile } from './Profile.js';
export { default as Gallery } from './Gallery.js';

// 其他文件中使用
import { Avatar, Profile, Gallery } from './components';
```

**陷阱提示**：
- 导入路径区分大小写，特别是在部署到Linux等操作系统时
- 避免循环依赖，即两个文件互相导入对方
- 过度使用"桶"文件可能会影响代码分割和性能，请谨慎使用

## 使用 JSX 书写标签语言

JSX 是 JavaScript 的语法扩展，允许你在 JavaScript 文件中编写类似 HTML 的标签。虽然有其他方式描述UI，但大多数 React 开发者喜欢 JSX 的简洁性。

### JSX 的规则

#### 1. 只能返回一个根元素

如果需要返回多个元素，可以将它们包裹在一个共同的父元素中，如 `<div>` 或空的 Fragment（`<>...</>`）：

```jsx
// 错误：没有共同的父元素
function ListItems() {
  return (
    <li>项目 1</li>
    <li>项目 2</li>
  );
}

// 正确：使用div作为包装器
function ListItems() {
  return (
    <div>
      <li>项目 1</li>
      <li>项目 2</li>
    </div>
  );
}

// 正确：使用Fragment避免额外嵌套
function ListItems() {
  return (
    <>
      <li>项目 1</li>
      <li>项目 2</li>
    </>
  );
}
```

#### 2. 标签必须闭合

JSX 要求所有标签必须正确闭合，可以使用自闭合标签或成对的开始和结束标签：

```jsx
// 正确：自闭合标签
<img src="image.jpg" alt="描述" />

// 正确：成对标签
<div>内容</div>

// 错误：未闭合标签
<img src="image.jpg" alt="描述">
```

#### 3. 使用驼峰式命名大部分属性

由于JSX更接近JavaScript而不是HTML，React DOM使用驼峰式命名属性而不是HTML的属性名：

```jsx
// HTML
<button onclick="handleClick()" class="btn" tabindex="0">点击</button>

// JSX
<button onClick={handleClick} className="btn" tabIndex={0}>点击</button>
```

特殊情况：
- `aria-*` 和 `data-*` 属性保持原样，使用连字符

### JSX 的本质

JSX 实际上是 `React.createElement()` 函数调用的语法糖：

```jsx
// 这段JSX代码
<div className="container">
  <h1>标题</h1>
  <p>段落</p>
</div>

// 会被转换为这段JavaScript代码
React.createElement(
  'div',
  { className: 'container' },
  React.createElement('h1', null, '标题'),
  React.createElement('p', null, '段落')
);
```

这就是为什么每个JSX文件都需要导入React（在React 17之前是必须的）。

### JSX 防止注入攻击

默认情况下，React DOM在渲染之前会转义JSX中嵌入的任何值，确保应用不会被注入攻击。所有内容在渲染前都会被转换为字符串，这有助于防止XSS攻击。

### JSX 表示对象

Babel 会将JSX编译为React.createElement()调用。以下两种方式是等价的：

```jsx
// 使用JSX
const element = (
  <h1 className="greeting">
    Hello, world!
  </h1>
);

// 不使用JSX
const element = React.createElement(
  'h1',
  {className: 'greeting'},
  'Hello, world!'
);
```

**陷阱提示**：
- JSX 标签的第一部分确定了React元素的类型，大写字母开头的JSX标签表示React组件
- 所有JSX元素都必须闭合，无论是自闭合标签还是成对标签
- 由于JSX编译后是函数调用，因此不能在条件语句或循环中使用if和for，但可以在JSX外部使用这些语句

## 在 JSX 中通过大括号使用 JavaScript

JSX 允许你在标记中嵌入 JavaScript 逻辑和变量。大括号 `{}` 是进入"JavaScript 领域"的特殊标记。

### 使用大括号传递字符串以外的值

当你想在JSX中使用JavaScript变量或表达式时，可以使用大括号：

```jsx
// 传递数值
<NumberDisplay value={42} />

// 传递表达式的结果
<Rectangle width={2 + 2} height={4 + 4} />

// 传递字符串字面量
<Message text="Hello" /> // 等同于 <Message text={"Hello"} />

// 传递变量
const name = "John";
<Greeting name={name} />
```

### 使用 JavaScript 对象

在JSX中，大括号`{}`表示JavaScript表达式的开始和结束。如果需要在JSX中传递JavaScript对象（也使用`{}`表示），则需要额外一层括号：

```jsx
// 这里的双大括号不是特殊语法，只是一个在{}中的对象字面量
<div style={{ color: 'red', fontSize: '14px' }}>文本</div>
```

### 在 JSX 中使用 "&&" 操作符

`&&` 操作符常用于条件渲染，基于短路求值特性：

```jsx
function Item({ name, isPacked }) {
  return (
    <li>
      {name} {isPacked && '✓'}
    </li>
  );
}
```

**注意**：只有当左侧条件为`true`时，才会渲染右侧内容。但要小心假值，特别是`0`会被渲染出来。

### 在 JSX 中使用三元运算符（?:）

另一种条件渲染的方式是使用三元运算符：

```jsx
function Item({ name, isPacked }) {
  return (
    <li>
      {isPacked ? name + ' ✓' : name}
    </li>
  );
}
```

你也可以嵌套使用JSX和条件语句：

```jsx
function Item({ name, isPacked }) {
  return (
    <li>
      {isPacked ? (
        <del>
          {name + ' ✓'}
        </del>
      ) : (
        name
      )}
    </li>
  );
}
```

### 大括号的限制

在JSX中，大括号内只能放置表达式，不能包含语句（如if语句或for循环）。

如果需要使用更复杂的逻辑，可以：

1. 在组件中使用if语句并返回不同的JSX

```jsx
function Message({ isError, message }) {
  if (isError) {
    return <div className="error">{message}</div>;
  }
  return <div>{message}</div>;
}
```

2. 在JSX中使用立即执行函数表达式

```jsx
function TodoList({ todos, filter }) {
  const visibleTodos = getFilteredTodos(todos, filter);
  return (
    <ul>
      {(() => {
        if (visibleTodos.length === 0) {
          return <p>没有匹配的待办事项</p>;
        }
        
        return visibleTodos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ));
      })()}
    </ul>
  );
}
```

**陷阱提示**：
- 大括号内只能包含表达式，不能包含语句
- 条件渲染时，使用`&&`操作符需注意左侧表达式为0时的情况
- 对于复杂条件逻辑，考虑将其提取为单独的函数或变量
- 空格在JSX中会被保留，但开始和结束标签之间的空行会被忽略

## 将 Props 传递给组件

React组件使用props（属性）来相互通信。每个父组件可以通过提供props来向其子组件传递信息。

### Props 的基本使用

Props类似于HTML属性，但你可以传递任何JavaScript值，包括对象、数组和函数：

```jsx
function Avatar({ person, size }) {
  return (
    <img
      className="avatar"
      src={getImageUrl(person)}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

export default function Profile() {
  return (
    <div>
      <Avatar
        person={{ name: 'Lin Lanying', imageId: '1bX5QH6' }}
        size={100}
      />
    </div>
  );
}
```

### 指定默认值

你可以为props指定默认值，当父组件没有指定这个prop时使用：

```jsx
function Avatar({ person, size = 100 }) {
  // 如果没有提供size，它将默认为100
  return (
    <img
      className="avatar"
      src={getImageUrl(person)}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}
```

### 转发 props

有时候你不需要使用组件接收的所有props，而是想将它们传递给子组件。你可以使用展开语法来简化这个过程：

```jsx
function Profile({ person, size, className, ...otherProps }) {
  return (
    <div className={`profile ${className}`}>
      <Avatar
        person={person}
        size={size}
        {...otherProps}
      />
    </div>
  );
}
```

### 传递 JSX 作为 children

当你在一个JSX标签内嵌套内容时，父组件将在名为`children`的prop中接收该内容：

```jsx
function Card({ children, title }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      <div className="content">
        {children}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Card title="关于">
      <p>你好，我是Lin Lanying。</p>
      <p>我住在杭州，喜欢摄影和设计。</p>
    </Card>
  );
}
```

### Props的不可变性

React中的所有props都是只读的。当一个组件需要改变它的props时，它应该请求父组件传递不同的props（通过事件处理或其他方式）：

```jsx
// ❌ 错误示例：修改props
function Counter({ count }) {
  // 这是错误的，count是只读的！
  count = count + 1;
  return <h1>{count}</h1>;
}

// ✅ 正确示例：不修改props
function Counter({ count, onClick }) {
  return (
    <div>
      <h1>{count}</h1>
      <button onClick={onClick}>增加</button>
    </div>
  );
}

// 父组件
function App() {
  const [count, setCount] = useState(0);
  return (
    <Counter 
      count={count} 
      onClick={() => setCount(count + 1)} 
    />
  );
}
```

**陷阱提示**：
- Props是只读的快照，每次渲染都会收到新的props版本
- 不要尝试修改props，应该请求父组件传递不同的props
- 当你需要响应用户输入时，应该设置state而不是修改props

## 条件渲染

在React中，你可以根据不同的条件创建不同的UI。

### 条件渲染的方法

#### 1. 使用if语句条件渲染

最直观的方法是使用if语句来决定返回什么：

```jsx
function Item({ name, isPacked }) {
  if (isPacked) {
    return <li>{name} ✓</li>;
  }
  return <li>{name}</li>;
}
```

#### 2. 使用三元运算符（?:）条件渲染

对于简单的条件，可以使用三元运算符来实现更紧凑的代码：

```jsx
function Item({ name, isPacked }) {
  return (
    <li>
      {isPacked ? name + ' ✓' : name}
    </li>
  );
}
```

你也可以嵌套JSX以实现更复杂的条件渲染：

```jsx
function Item({ name, isPacked }) {
  return (
    <li>
      {isPacked ? (
        <del>{name + ' ✓'}</del>
      ) : (
        name
      )}
    </li>
  );
}
```

#### 3. 使用逻辑与运算符（&&）条件渲染

另一种常见模式是使用`&&`运算符进行条件渲染：

```jsx
function Item({ name, isPacked }) {
  return (
    <li>
      {name} {isPacked && '✓'}
    </li>
  );
}
```

**注意**：左侧必须是布尔值，否则可能会有意外结果。比如，如果左侧是`0`，整个表达式会变为`0`而不是什么都不渲染。

#### 4. 变量存储条件元素

对于更复杂的条件逻辑，可以使用变量存储JSX，然后在返回语句中包含这个变量：

```jsx
function Message({ isError, message }) {
  let messageElement;
  
  if (isError) {
    messageElement = <div className="error">{message}</div>;
  } else {
    messageElement = <div className="info">{message}</div>;
  }
  
  return (
    <div>
      {messageElement}
    </div>
  );
}
```

#### 5. 使用null阻止渲染

在某些情况下，你可能不想渲染任何内容。虽然你必须从组件中返回一些东西，但可以返回`null`：

```jsx
function WarningMessage({ warning }) {
  if (!warning) {
    return null;
  }
  
  return (
    <div className="warning">
      警告: {warning}
    </div>
  );
}
```

**陷阱提示**：
- 使用条件渲染时，确保最终渲染的JSX是有效的
- 当使用`&&`操作符时，确保左侧是布尔表达式，避免使用`0`等可能导致意外渲染的值
- 如果条件渲染逻辑过于复杂，考虑将其拆分为更小的组件

## 渲染列表

通常，你需要基于数据集合显示多个相似组件。这时可以使用JavaScript的数组方法和JSX来渲染组件列表。

### 使用map()渲染数据集合

最常见的是使用`map()`方法将数据数组转换为React元素数组：

```jsx
const people = [
  'Creola Katherine Johnson: 数学家',
  'Mario José Molina-Pasquel Henríquez: 化学家',
  'Mohammad Abdus Salam: 物理学家',
  'Percy Lavon Julian: 化学家',
  'Subrahmanyan Chandrasekhar: 天体物理学家'
];

export default function List() {
  const listItems = people.map(person => <li>{person}</li>);
  return <ul>{listItems}</ul>;
}
```

### 使用key保持列表项唯一性

上面的代码会产生警告，因为每个列表项需要一个唯一的"key"属性：

```jsx
export default function List() {
  const listItems = people.map(person =>
    <li key={person}>{person}</li>
  );
  return <ul>{listItems}</ul>;
}
```

更好的做法是使用ID作为key：

```jsx
const people = [
  { id: 0, name: 'Creola Katherine Johnson', profession: '数学家' },
  { id: 1, name: 'Mario José Molina-Pasquel Henríquez', profession: '化学家' },
  { id: 2, name: 'Mohammad Abdus Salam', profession: '物理学家' },
  // ...
];

export default function List() {
  const listItems = people.map(person =>
    <li key={person.id}>
      <p><b>{person.name}</b></p>
      <p>{person.profession}</p>
    </li>
  );
  return <ul>{listItems}</ul>;
}
```

### 为什么key很重要？

key告诉React每个组件对应的是数组中的哪一项，这样React可以在更新时保持正确的状态。如果项目的顺序可能会改变（比如排序或过滤），不要使用索引作为key，因为这会导致性能问题和状态错误。

### 在哪里获取key

常见的key来源：
- 数据库中的ID
- 本地生成的唯一ID（如使用`uuid`库）
- 稳定的索引（只有在项目顺序不会改变时）

### 列表和key的规则

1. key在兄弟节点之间必须唯一
2. key不应该改变，否则违背了使用key的目的
3. 不要在渲染时生成key（如使用`Math.random()`）

### 显示过滤后的列表

列表渲染通常与过滤结合使用：

```jsx
function FilterableList({ items, searchQuery }) {
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <ul>
      {filteredItems.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}
```

**陷阱提示**：
- 每个列表项需要一个唯一且稳定的key
- 不要使用`Math.random()`等不稳定的值作为key
- 尽量不要使用索引作为key，特别是当列表项可能会重新排序时
- key是React的提示，不会传递给组件。如果需要同样的值，使用不同的prop名称显式传递

## 保持组件纯粹

React的设计部分受到函数式编程概念的启发，其中有一个关键概念是"纯函数"。在React中，组件应该是纯函数：对于相同的输入，始终产生相同的JSX。

### 什么是纯函数

纯函数具有以下特征：
1. 只处理自己的任务，不会修改调用它之前就存在的对象或变量
2. 相同的输入，总是返回相同的输出

例如，这是一个纯函数：

```js
function sum(a, b) {
  return a + b;
}
```

而这是一个非纯函数，因为它修改了外部变量：

```js
let total = 0;
function addToTotal(num) {
  total += num; // 修改了外部变量
  return total;
}
```

### React组件的纯粹性

在React中，组件应该像纯函数一样工作。它们不应该修改组件存在之前就已经创建的任何对象或变量：

```jsx
// ❌ 不纯的组件
let guest = 0;

function Cup() {
  guest = guest + 1; // 修改预先存在的变量
  return <h2>Tea cup for guest #{guest}</h2>;
}

// ✅ 纯组件
function Cup({ guest }) {
  return <h2>Tea cup for guest #{guest}</h2>;
}
```

### 副作用与渲染

React的渲染过程必须保持纯粹，这意味着组件只应该返回JSX，而不应该在渲染过程中修改任何对象或变量：

```jsx
// ❌ 不纯的组件：渲染过程中修改了DOM
function BadCounter() {
  const [count, setCount] = useState(0);
  
  // 🚩 错误：在渲染过程中修改DOM
  document.title = `你点击了 ${count} 次`;
  
  return (
    <button onClick={() => setCount(count + 1)}>
      点击 {count} 次
    </button>
  );
}

// ✅ 纯组件：使用useEffect处理副作用
function GoodCounter() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    document.title = `你点击了 ${count} 次`;
  }, [count]); // 在渲染后执行，而不是渲染过程中
  
  return (
    <button onClick={() => setCount(count + 1)}>
      点击 {count} 次
    </button>
  );
}
```

### React中的严格模式

在开发环境中，React会调用每个组件函数两次，以帮助你找到不纯的组件。这是React的"严格模式"的一部分，它可以帮助发现依赖于渲染顺序等问题。

### 局部变量

在组件中声明的局部变量是可以的，因为它们在每次渲染时都会重新创建：

```jsx
function RecentPosts() {
  const posts = fetchPosts(); // 假设fetchPosts()是纯函数
  const recentPosts = posts.filter(post => post.date >= getLastWeek());
  
  return (
    <ul>
      {recentPosts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

### 如何修复不纯的组件

1. **使用状态**：当你想在重新渲染之间"保留"数据时，使用state而不是外部变量

2. **使用副作用**：对于需要"跳出React"并与外部系统同步的代码，使用useEffect

**陷阱提示**：
- 确保组件在相同输入下总是返回相同的JSX
- 避免在渲染过程中修改任何预先存在的变量
- 不要在渲染过程中执行API调用、设置定时器等副作用
- 将副作用移到事件处理函数或useEffect中

## 将 UI 视为树

React为UI构建了一个内部的树状表示形式。这种树状结构帮助React高效地确定需要更新哪些部分，以及可以跳过哪些部分。

### 渲染树

当React渲染组件时，它会跟踪它们的"家族树"，就像家谱一样：

```jsx
export default function Gallery() {
  return (
    <section>
      <h1>了不起的科学家</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}

function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}
```

在这个例子中，树结构是：
- `Gallery`
  - `section`
    - `h1`
    - `Profile` (`img`)
    - `Profile` (`img`) 
    - `Profile` (`img`)

### 组件树与DOM树

React使用树结构来管理和组织对组件的了解。树从根组件开始，分支到渲染的任何其他组件。

与DOM树不同，React树包含了组件，是对UI的抽象表示，而不是实际DOM元素。

### 树的重要性

理解React的树结构帮助我们:
1. 理解数据如何流动（从父组件到子组件）
2. 调试渲染性能问题（例如，确定重新渲染的范围）
3. 使用开发工具可视化渲染过程

React的树形结构与浏览器的DOM树形成对应关系，这使React能够高效地将变化应用到DOM。

### 渲染分支和叶子

在组件树中：
- "分支"组件：主要用于组织其他组件并传递数据
- "叶子"组件：通常在树的末端，包含更多的标记和样式

**陷阱提示**：
- React应用程序从根组件开始渲染
- 组件可以渲染其他组件，但不能创建相互嵌套的循环依赖
- 组件树是一个有用的心理模型，有助于理解数据的流动

## 总结

在本文中，我们深入探讨了React中描述UI的核心概念，从组件的创建到列表渲染，从JSX语法到组件的纯粹性。我们了解到：

1. React使用组件化的方式构建用户界面，每个组件都是一个返回标签的JavaScript函数
2. 组件可以相互嵌套，形成组件树结构
3. JSX是JavaScript的语法扩展，允许在JavaScript中编写类似HTML的标记
4. Props是组件接收数据的方式，是只读的
5. 条件渲染允许基于条件显示不同的UI
6. 列表渲染允许从数据集合创建多个相似的组件
7. 保持组件纯粹是React的重要理念，组件应该像纯函数一样工作
8. React内部维护一个树状结构来表示UI，这帮助它高效地进行更新

掌握这些概念是构建React应用的基础。在后续的文章中，我们将探索如何为这些UI添加交互性，处理用户输入并管理组件状态。

### 最佳实践总结

1. **组件设计**
   - 每个组件只做一件事
   - 保持组件小而专注
   - 使用明确的命名

2. **Props处理**
   - 把props视为只读的
   - 使用解构来简化props的访问
   - 为频繁使用的props提供默认值

3. **JSX使用**
   - 保持JSX简洁可读
   - 提取复杂的条件渲染逻辑到独立函数
   - 使用Fragment避免不必要的DOM节点

4. **列表渲染**
   - 总是为列表项提供唯一的key
   - 避免使用索引作为key（除非列表是静态的）
   - 对大型列表考虑虚拟化技术

5. **保持纯粹**
   - 避免在渲染过程中修改已存在的对象
   - 使用不可变更新模式
   - 将副作用移到事件处理函数或useEffect中

