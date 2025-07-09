---
title: '一卒#006 | Immer.js 的实现原理'
date: '2025-07-09'
tags:

- BemoNote
- JavaScript

---
# 一卒#006 | Immer.js 的实现原理

在React应用开发中，不可变性（Immutability）是一个核心概念。为了保持组件渲染的高效性和状态管理的可预测性，我们需要确保状态对象不被直接修改。然而，在实践中手动处理不可变更新会导致代码冗长且容易出错。Immer.js作为一个优雅的解决方案，让我们可以以可变的方式编写不可变更新逻辑。React官方文档多次提及并推荐使用useImmer，本文将深入剖析Immer.js的实现原理。

## 为什么需要Immer.js

首先，让我们回顾一下在不使用Immer的情况下，如何正确地更新React状态：

```jsx
// 更新对象中的一个属性
setState(prevState => ({
  ...prevState,
  user: {
    ...prevState.user,
    name: 'New Name'
  }
}));

// 更新数组中的一个元素
setState(prevState => prevState.map(
  (item, index) => index === targetIndex ? { ...item, done: true } : item
));
```

这种方式需要我们创建所有变化路径上对象的副本，对于深层嵌套的数据结构尤其麻烦且容易出错。

而使用Immer时，我们可以这样写：

```jsx
// 使用Immer的produce函数
import produce from 'immer';

// 更新对象中的一个属性
setState(produce(draft => {
  draft.user.name = 'New Name';
}));

// 更新数组中的一个元素
setState(produce(draft => {
  draft[targetIndex].done = true;
}));
```

这种方式看起来像是直接修改对象，但实际上Immer会帮我们创建一个不可变的更新。使用React hooks时，可以使用`useImmer`简化状态更新：

```jsx
import { useImmer } from 'use-immer';

function TodoList() {
  const [todos, updateTodos] = useImmer([
    { id: 1, text: 'Learn Immer', done: false }
  ]);
  
  const handleToggle = id => {
    updateTodos(draft => {
      const todo = draft.find(todo => todo.id === id);
      todo.done = !todo.done;
    });
  };
  
  // ...
}
```

## Immer.js的核心概念

Immer.js的工作原理围绕几个核心概念展开：

1. **当前状态（current state）**：初始的、不可变的状态对象
2. **草稿状态（draft state）**：一个看起来可变的代理对象
3. **下一个状态（next state）**：基于对草稿的修改生成的新不可变状态

整个过程可以概括为：

```
produce(currentState, draftState => {
  // 直接修改draftState
}) => nextState
```

## Immer.js的实现原理

### 1. Proxy：魔法背后的秘密

Immer.js的核心魔法来自JavaScript的Proxy API。Proxy允许我们拦截并重定义对对象的基本操作，如属性读取、赋值等。

```javascript
const handler = {
  set(target, prop, value) {
    console.log(`设置属性 ${prop} 为 ${value}`);
    target[prop] = value;
    return true;
  }
};

const original = { count: 0 };
const proxy = new Proxy(original, handler);

proxy.count = 1; // 输出：设置属性 count 为 1
```

Immer利用Proxy创建一个"草稿状态"，当我们操作这个草稿时，Immer会跟踪所有的修改。

### 2. 核心源码分析

下面是Immer.js的核心函数`produce`的简化实现：

```javascript
function produce(baseState, recipe) {
  // 如果recipe是函数，返回一个新的curried函数
  if (typeof recipe === "function") {
    return function(state) {
      return produce(state, recipe);
    };
  }
  
  // 创建代理的状态树
  const proxies = new Map();
  // 用于跟踪哪些对象被修改过
  const copies = new Map();
  
  // 创建代理对象
  const createProxy = (base, parent) => {
    const isArray = Array.isArray(base);
    const draft = shallowCopy(base);
    
    const proxy = new Proxy(draft, {
      get(target, prop) {
        // 特殊处理一些属性，如length
        if (prop === "length") return target.length;
        
        // 获取原始值
        const value = target[prop];
        
        // 如果是对象或数组，递归创建代理
        if (isObject(value)) {
          return getProxy(value, draft);
        }
        
        return value;
      },
      
      set(target, prop, value) {
        // 记录修改，确保我们创建了拷贝
        if (!copies.has(base)) {
          copies.set(base, shallowCopy(base));
        }
        
        // 设置值到拷贝中
        const copy = copies.get(base);
        copy[prop] = value;
        return true;
      }
    });
    
    proxies.set(base, proxy);
    return proxy;
  };
  
  // 获取对象的代理，如果不存在则创建
  const getProxy = (base, parent) => {
    if (proxies.has(base)) return proxies.get(base);
    return createProxy(base, parent);
  };
  
  // 从草稿状态创建最终状态
  const finalize = (base) => {
    if (!isObject(base)) return base;
    
    // 如果对象被修改过，使用拷贝
    if (copies.has(base)) {
      const result = copies.get(base);
      // 递归处理所有属性
      Object.keys(result).forEach(key => {
        result[key] = finalize(result[key]);
      });
      return result;
    }
    
    // 如果没有修改，直接返回原始对象
    return base;
  };
  
  // 创建根代理
  const rootProxy = getProxy(baseState);
  
  // 执行用户提供的recipe函数
  recipe(rootProxy);
  
  // 返回最终状态
  return finalize(baseState);
}
```

这个简化实现展示了Immer的核心逻辑：
1. 创建原始状态的代理
2. 跟踪对代理的修改
3. 只为被修改的部分创建副本
4. 构建并返回最终的不可变状态

### 3. useImmer的实现

`useImmer` Hook是在Immer的`produce`函数基础上构建的简单包装器：

```javascript
import { useState, useCallback } from 'react';
import { produce } from 'immer';

export function useImmer(initialValue) {
  const [val, updateVal] = useState(initialValue);
  
  const setter = useCallback((updater) => {
    // 如果提供的是函数，使用produce处理
    if (typeof updater === 'function') {
      updateVal(produce(updater));
    } else {
      // 否则直接设置新值
      updateVal(updater);
    }
  }, []);
  
  return [val, setter];
}
```

这个实现非常简洁，它将React的`useState`与Immer的`produce`结合，提供了一个无缝的API。

## Immer.js的优化策略

Immer.js虽然让状态更新变得优雅，但也引入了一些性能开销。以下是它采用的一些优化策略：

### 1. 结构共享

Immer只会复制修改路径上的对象，未修改的部分会保持对原对象的引用，这保证了高效的内存使用。

```
originalState ---> { a: {}, b: {}, c: {} }

// 修改属性b后
nextState ---> { a: {}, b': {}, c: {} }
                  |           |
                  +-----------+-- 引用相同的对象
```

### 2. 惰性复制

Immer采用惰性策略，只有在真正需要修改对象时才会创建副本：

```javascript
// Immer内部逻辑的简化版
function set(draft, prop, value) {
  if (!copies.has(draft)) {
    copies.set(draft, shallowCopy(draft));
  }
  const copy = copies.get(draft);
  copy[prop] = value;
}
```

### 3. 自动冻结

在开发环境中，Immer会自动冻结所有生成的状态对象，以防止意外的直接修改：

```javascript
if (process.env.NODE_ENV !== "production") {
  Object.freeze(nextState);
}
```

## Immer.js的局限性

尽管Immer非常强大，但也有一些局限：

1. **性能开销**：代理和跟踪修改会带来一定的运行时开销
2. **不支持所有JavaScript对象**：如Map、Set等需要特殊处理
3. **调试体验**：代理对象可能使调试过程复杂化

在大多数情况下，这些开销是可以接受的，特别是考虑到它带来的开发体验改善。但对于性能极为敏感的场景或大型数据结构，可能需要权衡使用。

## 使用Immer的最佳实践

1. **不要在草稿状态中返回值**：Immer期望你只修改草稿，而不是返回新值
   ```javascript
   // 错误
   produce(state, draft => {
     return { ...draft, modified: true };
   });
   
   // 正确
   produce(state, draft => {
     draft.modified = true;
   });
   ```

2. **避免在不需要的地方使用Immer**：对于简单的更新，直接使用普通的不可变更新可能更高效

3. **结合useCallback优化性能**：特别是在传递更新函数给子组件时
   ```javascript
   const handleToggle = useCallback((id) => {
     updateTodos(draft => {
       const todo = draft.find(todo => todo.id === id);
       todo.done = !todo.done;
     });
   }, [updateTodos]);
   ```




