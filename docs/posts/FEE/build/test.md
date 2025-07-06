---
title: FEE#011 - build | 单元测试
date: "2025-07-06"
tags:
  - Front-end engineering
---

# FEE#011 - build | 单元测试

在现代前端开发中，单元测试已经成为确保代码质量和可维护性的重要环节。通过编写测试用例，我们可以验证代码的正确性、防止回归问题，并为重构提供安全网。在众多测试框架中，Jest 因其零配置、快速、功能丰富的特点，成为了前端单元测试的首选工具。

## Jest：Facebook 出品的全能测试框架

Jest 是由 Facebook 开发的 JavaScript 测试框架，它的设计理念是提供一个"零配置"的测试体验。与其他测试框架相比，Jest 集成了测试运行器、断言库、模拟工具等多种功能，使得开发者可以专注于编写测试逻辑，而不必担心测试环境的搭建。

### Jest 的核心特性

1. **开箱即用**：几乎零配置，安装后即可开始编写测试。
2. **快速并行**：Jest 可以并行执行测试，并且智能地优先运行失败的测试。
3. **内置覆盖率报告**：无需额外工具，即可生成详细的代码覆盖率报告。
4. **强大的模拟能力**：提供了简单易用的模拟（Mock）功能，可以模拟模块、函数、定时器等。
5. **快照测试**：可以捕获 UI 组件的渲染结果，并与之前的快照进行比对。
6. **隔离环境**：每个测试文件都在自己的环境中运行，避免测试间的相互影响。

## 开始使用 Jest

### 安装配置

首先，我们需要安装 Jest：

```bash
# 使用 npm
npm install --save-dev jest

# 或使用 yarn
yarn add --dev jest
```

然后，在 `package.json` 中添加测试脚本：

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

如果你使用 TypeScript，还需要安装相关依赖：

```bash
npm install --save-dev ts-jest @types/jest
```

并创建 `jest.config.js` 文件：

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // 或者对于浏览器环境
  // testEnvironment: 'jsdom',
};
```

### 编写第一个测试

Jest 使用 `test` 或 `it` 函数来定义测试用例，使用 `describe` 函数来组织相关的测试。下面是一个简单的例子：

```javascript
// math.js
export function sum(a, b) {
  return a + b;
}

// math.test.js
import { sum } from './math';

describe('数学函数测试', () => {
  test('1 + 2 应该等于 3', () => {
    expect(sum(1, 2)).toBe(3);
  });
});
```

在这个例子中，`expect` 是 Jest 提供的断言函数，而 `toBe` 是一个匹配器，用于检查值是否严格相等。

## Jest 常用匹配器详解

Jest 提供了丰富的匹配器（Matchers），用于验证不同类型的值。以下是一些常用的匹配器：

### 精确匹配

```javascript
// 严格相等（使用 Object.is）
expect(value).toBe(expected);

// 对象内容相等（递归比较）
expect(object).toEqual(expected);

// 严格相等，但更适合用于浮点数
expect(value).toBeCloseTo(expected, numDigits);
```

### 真值检查

```javascript
// 检查是否为 null
expect(value).toBeNull();

// 检查是否为 undefined
expect(value).toBeUndefined();

// 检查是否已定义（非 undefined）
expect(value).toBeDefined();

// 检查真值性（!!value === true）
expect(value).toBeTruthy();

// 检查假值性（!!value === false）
expect(value).toBeFalsy();
```

### 数字比较

```javascript
// 大于
expect(value).toBeGreaterThan(expected);

// 大于或等于
expect(value).toBeGreaterThanOrEqual(expected);

// 小于
expect(value).toBeLessThan(expected);

// 小于或等于
expect(value).toBeLessThanOrEqual(expected);
```

### 字符串匹配

```javascript
// 字符串包含子串
expect(string).toContain(substring);

// 字符串匹配正则表达式
expect(string).toMatch(/pattern/);
```

### 数组和可迭代对象

```javascript
// 数组或可迭代对象包含特定项
expect(array).toContain(item);

// 数组或对象包含匹配特定条件的项
expect(array).toContainEqual(item);

// 数组长度
expect(array).toHaveLength(number);
```

### 对象属性

```javascript
// 对象包含特定属性
expect(object).toHaveProperty(keyPath, value);
```

### 异常匹配

```javascript
// 函数调用抛出异常
expect(() => { throw new Error('错误') }).toThrow();

// 函数调用抛出特定错误
expect(() => { throw new Error('特定错误') }).toThrow('特定错误');
expect(() => { throw new Error('特定错误') }).toThrow(/特定/);
```

### 否定匹配

所有匹配器都可以通过 `.not` 修饰符来进行否定：

```javascript
expect(value).not.toBe(expected);
```

### 示例：综合使用匹配器

```javascript
describe('用户验证函数', () => {
  const user = {
    name: '张三',
    age: 28,
    roles: ['user', 'admin'],
    address: {
      city: '北京',
      zipCode: '100000'
    }
  };

  test('用户对象应该包含正确的属性和值', () => {
    // 检查对象属性
    expect(user).toHaveProperty('name', '张三');
    expect(user).toHaveProperty('age');
    expect(user.age).toBeGreaterThan(18);
    
    // 检查数组
    expect(user.roles).toHaveLength(2);
    expect(user.roles).toContain('admin');
    
    // 检查嵌套对象
    expect(user.address).toEqual({
      city: '北京',
      zipCode: '100000'
    });
    
    // 检查字符串
    expect(user.address.city).toMatch(/北京/);
  });
});
```

## 异步测试

在前端开发中，异步操作非常常见。Jest 提供了多种方式来测试异步代码：

### Promise

```javascript
// fetchUser.js
export function fetchUser(id) {
  return fetch(`/api/users/${id}`)
    .then(response => response.json());
}

// fetchUser.test.js
import { fetchUser } from './fetchUser';

test('用户数据应该包含正确的名称', () => {
  // 返回 Promise，Jest 会等待它解决
  return fetchUser(1).then(data => {
    expect(data.name).toBe('张三');
  });
});

// 或者使用 async/await
test('用户数据应该包含正确的名称', async () => {
  const data = await fetchUser(1);
  expect(data.name).toBe('张三');
});

// 测试 Promise 拒绝
test('无效 ID 应该导致错误', async () => {
  expect.assertions(1); // 确保至少有一个断言被调用
  try {
    await fetchUser(-1);
  } catch (e) {
    expect(e).toMatch('Invalid ID');
  }
});

// 或者使用 rejects
test('无效 ID 应该导致错误', () => {
  return expect(fetchUser(-1)).rejects.toMatch('Invalid ID');
});
```

### 回调

对于使用回调的代码，可以使用 `done` 参数：

```javascript
test('数据应该正确加载', done => {
  function callback(data) {
    try {
      expect(data).toBe('数据');
      done();
    } catch (error) {
      done(error);
    }
  }
  
  fetchData(callback);
});
```

## 模拟功能

Jest 提供了强大的模拟（Mock）功能，可以模拟函数、模块、定时器等。

### 模拟函数

```javascript
test('回调函数应该被调用', () => {
  // 创建模拟函数
  const mockCallback = jest.fn();
  
  // 使用模拟函数
  forEach([1, 2], mockCallback);
  
  // 检查调用次数
  expect(mockCallback.mock.calls.length).toBe(2);
  
  // 检查第一次调用的第一个参数
  expect(mockCallback.mock.calls[0][0]).toBe(1);
});

// 模拟函数返回值
test('模拟函数应该返回特定值', () => {
  const myMock = jest.fn();
  
  // 设置返回值
  myMock.mockReturnValueOnce(10).mockReturnValueOnce('x').mockReturnValue(true);
  
  console.log(myMock(), myMock(), myMock(), myMock());
  // 输出: 10, 'x', true, true
});
```

### 模拟模块

```javascript
// 模拟整个模块
jest.mock('./mathModule');

// 模拟特定方法
import * as mathModule from './mathModule';
mathModule.sum = jest.fn().mockReturnValue(10);

// 或者使用 spyOn
jest.spyOn(mathModule, 'sum').mockImplementation(() => 10);
```

### 模拟定时器

```javascript
// 使用假定时器
jest.useFakeTimers();

test('定时器应该正确执行', () => {
  const callback = jest.fn();
  
  // 设置定时器
  setTimeout(callback, 1000);
  
  // 快进时间
  jest.advanceTimersByTime(1000);
  
  // 检查回调是否被调用
  expect(callback).toHaveBeenCalled();
});

// 恢复真实定时器
jest.useRealTimers();
```

## 测试 React 组件

Jest 与 React Testing Library 或 Enzyme 配合使用，可以方便地测试 React 组件。

### 使用 React Testing Library

首先安装依赖：

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom
```

然后编写测试：

```jsx
// Button.jsx
import React from 'react';

function Button({ onClick, children }) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}

// Button.test.jsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Button from './Button';

test('按钮应该正确渲染文本', () => {
  const { getByText } = render(<Button>点击我</Button>);
  expect(getByText('点击我')).toBeInTheDocument();
});

test('点击按钮应该触发回调', () => {
  const handleClick = jest.fn();
  const { getByText } = render(
    <Button onClick={handleClick}>点击我</Button>
  );
  
  fireEvent.click(getByText('点击我'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

## 快照测试

快照测试是 Jest 的一个特色功能，特别适合测试 UI 组件的渲染输出。

```jsx
import React from 'react';
import { render } from '@testing-library/react';
import Card from './Card';

test('Card 组件应该正确渲染', () => {
  const { container } = render(
    <Card title="标题" description="描述" />
  );
  
  // 生成快照并与之前的快照比对
  expect(container).toMatchSnapshot();
});
```

首次运行时，Jest 会创建一个快照文件。后续运行时，Jest 会将当前输出与快照进行比对，如果不一致，测试将失败。

## 测试覆盖率

Jest 内置了代码覆盖率报告功能，可以通过 `--coverage` 参数启用：

```bash
jest --coverage
```

这将生成一个详细的覆盖率报告，包括语句覆盖率、分支覆盖率、函数覆盖率和行覆盖率。

你也可以在配置文件中设置覆盖率阈值：

```javascript
// jest.config.js
module.exports = {
  // ...
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

## 测试最佳实践

1. **测试行为，而非实现**：关注函数或组件的输出和副作用，而不是内部实现细节。

2. **一个测试只测一件事**：每个测试应该专注于一个功能点，这样当测试失败时，能够快速定位问题。

3. **使用有意义的测试描述**：好的测试描述应该清晰地表达测试的意图，如"当用户名为空时，提交按钮应该被禁用"。

4. **组织测试结构**：使用 `describe` 嵌套来组织相关的测试，提高可读性。

5. **测试边界条件**：不仅测试正常情况，还要测试边界情况和错误情况。

6. **避免测试间的依赖**：每个测试应该是独立的，不依赖于其他测试的状态。

7. **模拟外部依赖**：使用 Jest 的模拟功能来隔离被测代码与外部依赖。

8. **保持测试简洁**：测试代码也是代码，应该保持简洁、可读和可维护。

## 示例：一个完整的测试套件

下面是一个用户验证模块的完整测试套件示例：

```javascript
// userValidator.js
export function validateUsername(username) {
  if (!username) return '用户名不能为空';
  if (username.length < 3) return '用户名长度不能小于 3 个字符';
  if (username.length > 20) return '用户名长度不能超过 20 个字符';
  if (!/^[a-zA-Z0-9_]+$/.test(username)) return '用户名只能包含字母、数字和下划线';
  return null; // 验证通过
}

export function validatePassword(password) {
  if (!password) return '密码不能为空';
  if (password.length < 6) return '密码长度不能小于 6 个字符';
  if (!/[A-Z]/.test(password)) return '密码必须包含至少一个大写字母';
  if (!/[a-z]/.test(password)) return '密码必须包含至少一个小写字母';
  if (!/[0-9]/.test(password)) return '密码必须包含至少一个数字';
  return null; // 验证通过
}

// userValidator.test.js
import { validateUsername, validatePassword } from './userValidator';

describe('用户名验证', () => {
  test('空用户名应该返回错误', () => {
    expect(validateUsername('')).toBe('用户名不能为空');
  });
  
  test('用户名长度小于 3 应该返回错误', () => {
    expect(validateUsername('ab')).toBe('用户名长度不能小于 3 个字符');
  });
  
  test('用户名长度大于 20 应该返回错误', () => {
    const longUsername = 'a'.repeat(21);
    expect(validateUsername(longUsername)).toBe('用户名长度不能超过 20 个字符');
  });
  
  test('用户名包含非法字符应该返回错误', () => {
    expect(validateUsername('user@name')).toBe('用户名只能包含字母、数字和下划线');
  });
  
  test('有效的用户名应该返回 null', () => {
    expect(validateUsername('valid_user123')).toBeNull();
  });
});

describe('密码验证', () => {
  test('空密码应该返回错误', () => {
    expect(validatePassword('')).toBe('密码不能为空');
  });
  
  test('密码长度小于 6 应该返回错误', () => {
    expect(validatePassword('Ab1')).toBe('密码长度不能小于 6 个字符');
  });
  
  test('密码缺少大写字母应该返回错误', () => {
    expect(validatePassword('abcdef123')).toBe('密码必须包含至少一个大写字母');
  });
  
  test('密码缺少小写字母应该返回错误', () => {
    expect(validatePassword('ABCDEF123')).toBe('密码必须包含至少一个小写字母');
  });
  
  test('密码缺少数字应该返回错误', () => {
    expect(validatePassword('AbcdefGHI')).toBe('密码必须包含至少一个数字');
  });
  
  test('有效的密码应该返回 null', () => {
    expect(validatePassword('Valid123Password')).toBeNull();
  });
});
```