---
title: 模板字符串类型
date: '2025-04-09'
tags:
- FE
---

# 模板字符串类型

在 ES6 带来的大量语法增强中，对字符串变量来说最重要的语法之一就是`模板字符串类型`。在 ES6 以前，我们想要`拼接变量+字符串`，需要这么做：

``` typescript
const getAMPM = () => isAM ? '上午' : '下午';

const str = 'Hi, ' + name + '. ' + getAMPM() + '好';
```

这种方式不是不能用，但确实相当繁琐和不雅观，变量混杂着常量，还可能混杂着条件判断、函数计算语句，很容易在代码里形成一大块任谁看了都皱眉的硬骨头。

而使用 ES6 的模板字符串表达式，我们可以将它简化为这样的形式：

``` typescript
const str = `Hi, ${name}. ${getAMPM()}好`;
```

模板字符串本质上是一个特殊的字符串，它不使用单双引号，而是使用 ``，同时将变量/计算操作放在 ${} 这么一个我们称之为插槽的表达式内部，提供了更自然的字符串计算方式。

再回到 TS 中，此前我们已经学习了字符串类型与字符串字面量类型，知道它们本质上就对应到 JavaScript 中的字符串变量，那么，模板字符串是否也能反过来在 TypeScript 中找到自己的投影，这样我们就可以实现字面量类型的计算了？

答案是肯定的，为了让你感到更加亲切，TS 中提供了“模板字符串类型”这么一个能力，类似于模板字符串，它可以`实现对字面量类型的计算`，以及`批量生成字符串类型`的能力，我们一个个来看。

首先，模板字符串类型的语法和模板字符串完全一致，包括定义与内部的计算插槽：

``` typescript
type Name = 'xxx';

// "Hi, xxx"
type Greeting = `Hi, ${Name}`;
```

而在类型检查方面，模板字符串类型可以提供更为精确的字符串类型结构描述，比如此前，我们无法检查一个字符串是否满足 `1.2.3` 这样结构的版本号格式：

``` typescript
type Version = string;

const v1: Version = '1.1.0';
const v2: Version = '1.0'; // 没有检查出不符合预期结构
```

而使用模板字符串类型：

``` typescript
type Version = `${number}.${number}.${number}`;

const v1: Version = '1.1.0';
const v2: Version = '1.0'; // 报错：类型 "1.0" 不能赋值给类型 `${number}.${number}.${number}`
const v3: Version = 'a.0.0'; // 报错：类型 "a.0" 不能赋值给类型 `${number}.${number}.${number}`
```

在上一节，我们已经学习`类型别名的函数式用法`，其实它和模板字符串类型也可以有紧密的合作：

``` typescript
type SayHello<T extends string | number> = `Hello ${T}`;

type Greet1 = SayHello<"xxx">; // "Hello xxx"
type Greet2 = SayHello<599>; // "Hello 599"
```

与 JavaScript 中的模板字符串不同的是，模板字符串类型的诞生不仅是为了实现字面量类型的拼接，还有一个重要的能力是`其自动分发的特性`，即当**一个模板字符串类型中的插槽传入了联合类型时，这个模板字符串类型会自动被扩展为使用所有联合类型的组合**。

说起来略显复杂，我们直接看实际的例子：

``` typescript
type Brand = 'iphone' | 'xiaomi' | 'honor';

type SKU = `${Brand}`; // "iphone" | "xiaomi" | "honor"
```

可以看到，由于我们在插槽中传入了一个联合类型，模板字符串类型自动地遍历所有可能的联合类型成员，进行计算后再重新合并回联合类型，因此我们得到了一个新的联合类型——不对，它不是和原来一样吗？

那么我们稍微修改下 SKU 类型别名，加一点固定的组成部分：

``` typescript
type SKU = `${Brand}-latest`; // "iphone-latest" | "xiaomi-latest" | "honor-latest"
```

现在看起来是不是就有点作用了？那如果说我们有多个插槽都被传入了联合类型呢？

``` typescript
type Brand = 'iphone' | 'xiaomi' | 'honor';
type Memory = '16G' | '64G';
type ItemType = 'official' | 'second-hand';

type SKU = `${Brand}-${Memory}-${ItemType}`;
```

这个时候，我们就得到了一个由所有联合类型的可能分支进行排列组合，共 3x2x2 = 12 个类型组成的联合类型：

为什么我们需要这个能力？此前使用字面量类型来提供精确的类型定义时，会面临的一个问题就是当可用的字面量类型过多，自己一个个写会非常的头痛，可能就直接选择用 string 类型了。而现在，假设这些字面量类型满足一定的规律，我们就可以通过模板字符串类型的自动分发特性，来实现由排列组合自动生成联合类型了！










































































































