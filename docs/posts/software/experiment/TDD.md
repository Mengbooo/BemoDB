# TDD测试驱动开发实验
``` 
## 实验名称
TDD测试驱动开发实验

## 实验目的
- 理解TDD测试驱动开发的思想
- 掌握TDD测试驱动开发的基本过程。

## 实验内容和要求
- 阅读：Kent Beck 《测试驱动开发》
- 基于TDD开发一个判断字符串是IP4地址的功能
- 使用任何OO语言
- 使用xUnit测试框架
```
## TDD（Test-Driven Development）

TDD（Test-Driven Development）即测试驱动开发，是一种软件开发方法论，其核心在于先编写测试用例，再依据这些测试用例来编写实现代码。

### 中心思想

- 以测试为导向：TDD 强调测试用例优先编写，这有助于开发者在开始编码前就明确代码需要实现的功能和达到的标准。它使得开发者从使用者的角度去思考软件的功能，确保代码的可测试性和实用性。
- 快速反馈：通过频繁运行测试，开发者能迅速得知代码是否符合预期。一旦测试失败，就可以及时对代码进行修改和调整，避免问题在开发后期积累，降低修复成本。
- 持续改进：TDD 鼓励开发者进行小步迭代开发。每次只实现满足当前测试用例的最小功能，然后通过不断添加新的测试用例和优化代码，逐步完善软件功能，提高代码质量。
- 保证代码质量：由于测试用例覆盖了代码的功能需求，遵循 TDD 开发出来的代码具有较高的可维护性、可扩展性和稳定性，减少了出现 bug 的概率。

### 基本过程
TDD 的基本过程通常遵循 “红 - 绿 - 重构” 的循环，具体步骤如下：
#### 1. 编写测试用例（红）
开发者根据需求分析，编写一个或多个测试用例。这些测试用例描述了代码应该具备的功能和预期的输出。在这个阶段，由于还没有实现具体的代码，测试用例必然会失败，所以被称为 “红”。

以下是一个使用 JavaScript 和 Jest 测试框架的简单示例，假设要实现一个加法函数：

``` javascript
// sum.test.js
function sum(a, b) {
    // 此时函数体为空，还未实现具体逻辑
}

test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3);
});
```
#### 2. 编写实现代码（绿）

为了让测试用例通过，开发者编写足够的实现代码。在这个阶段，重点是让测试用例能够成功运行，而不是追求代码的完美。只要代码能够满足当前测试用例的要求即可，即使代码可能存在冗余或不够优雅。

``` javascript
// sum.test.js
function sum(a, b) {
    return a + b;
}

test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3);
});
```

当运行上述测试用例时，由于 sum 函数已经实现了加法逻辑，测试用例会通过，此时处于 “绿” 的状态。
#### 重构代码（重构）
在测试用例通过后，开发者对代码进行重构。重构的目的是优化代码的结构、提高代码的可读性和可维护性，同时确保所有的测试用例仍然能够通过。重构过程中，不改变代码的外部行为，只对内部实现进行调整。

``` javascript
// sum.test.js
// 重构后的代码，添加注释提高可读性
/**
 * 计算两个数的和
 * @param {number} a - 第一个加数
 * @param {number} b - 第二个加数
 * @returns {number} - 两个数的和
 */
function sum(a, b) {
    return a + b;
}

test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3);
});
```
#### 4. 重复循环

完成重构后，根据新的需求或功能，再次编写新的测试用例，进入下一个 “红 - 绿 - 重构” 的循环，不断迭代开发，逐步完善软件的功能。

## 概念理解
### OO 语言

OO 语言是一种基于对象概念的编程语言范式，它将现实世界中的事物抽象为对象，每个对象都有自己的属性（数据）和方法（行为）。OO 语言强调封装、继承和多态这三个核心特性。

### xUnit 框架

xUnit 是一系列单元测试框架的统称，其中 “x” 代表不同的编程语言，如 JUnit 是针对 Java 语言的单元测试框架，NUnit 是用于.NET 平台的测试框架，Python 中的 unittest 框架也属于 xUnit 家族。这些框架提供了一组工具和规范，帮助开发者编写、组织和运行单元测试。

## 基于TDD开发一个判断字符串是IP4地址的功能

这里我们采用JavaScript语言和Jest测试框架，它们分别属于OO语言和xUnit框架。下面按照 TDD 的 “红 - 绿 - 重构” 循环来开发一个判断字符串是否为 IPv4 地址的功能。

### 1. 编写测试用例（红）

首先，我们要编写测试用例来描述判断字符串是否为 IPv4 地址的功能。IPv4 地址由四个 0 - 255 之间的数字组成，用点号分隔。

``` javascript
// 此时函数还未实现，只是占位
function isIPv4(str) {
    return false;
}

test('should return true for valid IPv4 address', () => {
    expect(isIPv4('192.168.1.1')).toBe(true);
});

test('should return false for invalid IPv4 address', () => {
    expect(isIPv4('256.256.256.256')).toBe(false);
});
```
在这个阶段，由于 isIPv4 函数只是简单地返回 false，所以测试用例会失败。

### 2. 编写实现代码（绿）

接下来，我们要编写足够的代码让测试用例通过。

在这个实现中，我们首先将字符串按点号分割成数组，然后检查数组的长度是否为 4。接着，我们遍历数组中的每个部分，检查其是否为有效的数字，并且该数字是否在 0 - 255 之间。

``` javascript
function isIPv4(str) {
    const parts = str.split('.');
    if (parts.length!== 4) {
        return false;
    }
    for (let part of parts) {
        if (!/^\d+$/.test(part)) {
            return false;
        }
        const num = parseInt(part, 10);
        if (num < 0 || num > 255) {
            return false;
        }
    }
    return true;
}

test('should return true for valid IPv4 address', () => {
    expect(isIPv4('192.168.1.1')).toBe(true);
});

test('should return false for invalid IPv4 address', () => {
    expect(isIPv4('256.256.256.256')).toBe(false);
});
```
在这个实现中，我们首先将字符串按点号分割成数组，然后检查数组的长度是否为 4。接着，我们遍历数组中的每个部分，检查其是否为有效的数字，并且该数字是否在 0 - 255 之间。

### 3. 重构代码（重构）
目前的代码已经可以通过测试，但我们可以对其进行一些优化，提高代码的可读性和可维护性。

``` javascript
function isIPv4(str) {
    // 分割字符串
    const parts = str.split('.');
    if (parts.length!== 4) {
        return false;
    }

    // 检测每个部分是否属于 0 ~ 255 并返回布尔值
    const isValidPart = (part) => {
        // 检测是否为数字
        if (!/^\d+$/.test(part)) {
            return false;
        }
        const num = parseInt(part, 10);
        return num >= 0 && num <= 255;
    };

    // 检测是否都通过测试，否则返回 false
    return parts.every(isValidPart);
}

// 测试用例 1
test('should return true for valid IPv4 address', () => {
    expect(isIPv4('192.168.1.1')).toBe(true);
});

// 测试用例 2
test('should return false for invalid IPv4 address', () => {
    expect(isIPv4('256.256.256.256')).toBe(false);
});
```

在重构后的代码中，我们将检查每个部分是否有效的逻辑封装到了 isValidPart 函数中，并且使用 every 方法来检查数组中的每个部分是否都有效，并且加入了注释，这样代码的结构更加清晰。

## 实验总结
通过本次实验我深入体验了 TDD 开发模式的优势。先编写测试用例的方式使得在开发前就对功能需求有了清晰认识，在开发过程中也能快速得到反馈，及时调整代码。Jest 测试框架提供的断言机制和测试用例组织方式，极大地便利了测试工作的开展。同时，在开发过程中，对正则表达式、数组方法（如split、every）的熟练运用，进一步加深了对 JavaScript 语言的理解和掌握。在未来的开发工作中，将继续合理采用 TDD 方法，结合合适的测试框架，以提高代码质量和开发效率。
