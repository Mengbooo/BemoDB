---
title: 内置工具类型
date: '2025-04-09'
tags:
- FE
---

# 内置工具类型

通常情况下，在学习一门编程语言时，我们主要学习的是语法、内置对象以及内置方法：

比如说 JavaScript，这三个概念可以分别对应到 
- `const name = 'xxx'`
- `Object` 
- `Array.prototype.sort`

而对于 TypeScript，则可以对应到 
- `const name: string = 'xxx'`
- `any` 类型
- `工具类型`

对于内置方法，其实就是一批语言层面提供了的通用工具方法，还是以 JavaScript 为例，内置方法既包括了我们可以通过其它方法模拟的 Array.prototype.map，也包括 Function() 这样只能由底层引擎实现的部分。

而 JavaScript 中的内置方法是用来操作值的，TypeScript 的内置方法是用来操作类型的。

这一节，我们要介绍的其实就是 TypeScript 内置的，专用于对类型进行编程的工具方法——我们称之为工具类型。

TypeScript 内置了一批简单的工具类型，它们就是类型别名的使用方式，同时在全局可用，无需导入：

``` typescript
type A = Partial<{}>; // Partial 即是内置的工具类型
```

在介绍过程中，我们只会关注这些工具类型的实际使用方式，对内部的实现原理并不是入门教程需要包括的部分 —— 毕竟，我们在前面学习到的内置类型工具还不足以让我们完全理解类型编程。

在开始前，我们不妨思考一个问题：在日常使用 JavaScript 进行开发时，你和哪个数据结构打交道最多，为什么？

毋庸置疑，一定是对象，毕竟对象能够更完整地描述程序中的各种模型与状态——你是想要使用一个变量描述二十项归属于一个模型的属性，还是要想二十个变量名？同时，对象的扩展功能也是我们依赖的一项重要能力，这些都是面向对象编程范式中的概念，但其实，对于 JS 开发者来说，我们其实还常常忽略了对象的一个重要能力——即`对属性的描述能力`。

在 Class 一节中我们学习到了 Class 成员的可访问性描述，public / private / protected，而在对象类型一节中，我们也了解了类似的概念，即属性可选和属性只读。

JavaScript 中，可以通过 Object.defineProperty 来实现属性的只读，但你可以回想下自己有几次使用过这个能力来标记对象属性为只读？原因无他——使用方式不够直观，同时 JavaScript 开发者对只读的概念并不怎么关心。

而在 TypeScript 中，我们此前了解过的对象类型只读，必须要在声明时就进行描述，同时无法再进行修改。但现在，有了工具类型的帮助，我们可以更愉快地实现`类型修饰`了。

## Partial

第一个登场的工具类型是 Partial，它接收一个对象类型，并将这个对象类型的所有属性都标记为可选，这样我们就不需要一个个将它们标记为可选属性了。

``` typescript
type User = {
  name: string;
  age: number;
  email: string;
};

type PartialUser = Partial<User>;

const user: User = {
  name: 'John Doe',
  age: 30,
  email: 'john.doe@example.com'
};

// 可以不实现全部的属性了！
const partialUser: PartialUser = {
  name: 'John Doe',
  age: 30
};
```

从 Partial 的使用方式我们可以看到，工具类型使用起来就像一个函数——你给它入参，它还你出参，而出入参都是类型！

而这些函数预留的参数，其实也正是我们此前介绍过的，类型世界中的变量 —— 泛型。

如果我们最开始编写了一个内部属性均为必选的对象类型，可以使用 Partial 得到一个属性均为可选的版本。那如果反过来，一开始我们有的就是一个内部属性均为可选的对象类型呢？

## Required

这就要说到另一个类型编程的规律了——大部分工具类型都是成对出现的，有将属性标记为可选的 Partial，就会有将属性标记为必选的 Required，它的使用方式和 Partial 完全一致：

``` typescript
type User = {
  name?: string;
  age?: number;
  email?: string;
};

type RequiredUser = Required<User>;

const user: User = {
  name: 'John Doe'
};

// 现在你必须全部实现这些属性了
const requiredUser: RequiredUser = {
  name: 'John Doe',
  age: 30,
  email: 'john.doe@example.com'
};
```

## Readonly

还记得在对象类型一节中我们讲到的对对象类型属性的几种修饰吗？除了可选以外，还有一个 readonly 修饰，用于`将属性标记为只读`，类似于 Partial，TypeScript 中也内置了一个用于将对象类型所有属性标记为只读的工具类型 Readonly：

``` typescript
type User = {
  name: string;
  age: number;
  email: string;
};

type ReadonlyUser = Readonly<User>;

const user: User = {
  name: 'John Doe',
  age: 30,
  email: 'john.doe@example.com'
};

const readonlyUser: ReadonlyUser = {
  name: 'John Doe',
  age: 30,
  email: 'john.doe@example.com'
};

// 修改 user 对象的属性
user.name = 'Jane Doe';
user.age = 25;
user.email = 'jane.doe@example.com';

// 修改 readonlyUser 对象的属性
// readonlyUser.name = 'Jane Doe';  // 报错
// readonlyUser.age = 25;  // 报错
// readonlyUser.email = 'jane.doe@example.com';  // 报错
```

TypeScript 内置的工具类型中，并不包括与 Readonly 结对出现的版本，你可以认为，只读通常是一个不可逆的行为，如果能够随意将只读修饰移除，就可能破坏了只读带来的安全性。同时，不同于可选与必选，我们最开始获得的类型输入基本不会携带 readonly 修饰。

## Record

在对象类型一节中我们简单介绍了索引签名类型，用于声明一个内部属性键类型一致、键值类型也一致的对象类型，而 TypeScript 中基于索引签名类型提供了一个简化版本 Record，它能够用更简洁的语法实现同样的效果：

``` typescript
type UserProps = 'name' | 'job' | 'email';

// 等价于你一个个实现这些属性了
type User = Record<UserProps, string>;

const user: User = {
  name: 'John Doe',
  job: 'fe-developer',
  email: 'john.doe@example.com'
};
```

你可以使用 Record 类型来声明属性名还未确定的接口类型，如：

``` typescript
type User = Record<string, string>;

const user: User = {
  name: 'John Doe',
  job: 'fe-developer',
  email: 'john.doe@example.com',
  bio: 'Make more interesting things!',
  type: 'vip',
  // ...
};
```

## Pick 与 Omit

除了对象类型的声明与属性修饰，内置工具类型中还包括用于对象类型裁剪的 Pick 与 Omit。

Pick 类型接收一个对象类型，以及一个字面量类型组成的联合类型，这个联合类型只能是由对象类型的属性名组成的。它会对这个对象类型进行裁剪，只保留你传入的属性名组成的部分：

``` typescript
type User = {
  name: string;
  age: number;
  email: string;
  phone: string;
};

// 只提取其中的 name 与 age 信息
type UserBasicInfo = Pick<User, 'name' | 'age'>;

const user: User = {
  name: 'John Doe',
  age: 30,
  email: 'john.doe@example.com',
  phone: '1234567890'
};

const userBasicInfo: UserBasicInfo = {
  name: 'John Doe',
  age: 30
};
```

而 Omit 类型就是 Pick 类型的另一面，它的入参和 Pick 类型一致，但效果却是相反的——它会移除传入的属性名的部分，只保留剩下的部分作为新的对象类型：

``` typescript
type User = {
  name: string;
  age: number;
  email: string;
  phone: string;
};

// 只移除 phone 属性
type UserWithoutPhone = Omit<User, 'phone'>;

const user: User = {
  name: 'John Doe',
  age: 30,
  email: 'john.doe@example.com',
  phone: '1234567890'
};

const userWithoutPhone: UserWithoutPhone = {
  name: 'John Doe',
  age: 30,
  email: 'john.doe@example.com'
};
```

`Pick 与 Omit` 类型是类型编程中相当重要的一个部分，举例来说，我们可以先声明一个代表全局所有状态的大型接口类型：

``` typescript
type User = {
  name: string;
  age: number;
  email: string;
  phone: string;
  address: string;
  gender: string;
  occupation: string;
  education: string;
  hobby: string;
  bio: string;
};
```

然后在我们的子组件中，可能只用到了其中一部分的类型，此时就可以使用 Pick 类型将我们需要的部分择出来：

``` typescript
type UserBasicInfo = Pick<User, 'name' | 'age' | 'email'>;

const userBasicInfo: UserBasicInfo = {
  name: 'John Doe',
  age: 30,
  email: 'john.doe@example.com'
};
```

反之，如果我们用到了大部分类型，只有数个类型需要移除，就可以使用 Omit 类型来减少一些代码量：

``` typescript
type UserDetailedInfo = Omit<User, 'name' | 'age' | 'email'>;

const userDetailedInfo: UserDetailedInfo = {
  phone: '1234567890',
  address: '123 Main St',
  gender: 'male',
  occupation: 'developer',
  education: 'Bachelor',
  hobby: 'reading',
  bio: 'A passionate developer'
};
```

对象类型的处理是内置工具类型中占比较大的部分，除此以外，`集合类型与函数类型`也占有一席之地。

## Exclude 和 Extract

比如集合类型的 `Exclude 和 Extract`，这两个名字可能不太好理解，但如果我说 `差集 与 交集` 你就懂了。`Exclude 和 Extract` 的作用也正是如此，只要你把联合类型看成一个类型组成的集合就好理解了。

首先是代表差集的 `Exclude`，它能够从一个类型中移除另一个类型中也存在的部分：

``` typescript
type UserProps = 'name' | 'age' | 'email' | 'phone' | 'address';
type RequiredUserProps = 'name' | 'email';

// OptionalUserProps = UserProps - RequiredUserProps
type OptionalUserProps = Exclude<UserProps, RequiredUserProps>;

const optionalUserProps: OptionalUserProps = 'age'; // 'age' | 'phone' | 'address';
```

而 `Extract` 则用于提取另一个类型中也存在的部分，即交集：

``` typescript
type UserProps = 'name' | 'age' | 'email' | 'phone' | 'address';
type RequiredUserProps = 'name' | 'email';

type RequiredUserPropsOnly = Extract<UserProps, RequiredUserProps>;

const requiredUserPropsOnly: RequiredUserPropsOnly = 'name'; // 'name' | 'email';
```

## Parameters 和 ReturnType

除了对象类型，函数类型也是一个能够被工具类型处理的重要部分。

不妨先想想，对于函数类型，工具类型能起到什么作用？在函数类型一节中我们已经说到，`函数类型=参数类型+返回值类型`，这个定律适用于所有的函数类型定义。

而我们一般又不会去修改参数与返回值位置的类型，那就只剩下读取了。

内置工具类型中提供了 `Parameters` 和 `ReturnType` 这两个类型来提取函数的参数类型与返回值类型：

``` typescript
type Add = (x: number, y: number) => number;

type AddParams = Parameters<Add>; // [number, number] 类型
type AddResult = ReturnType<Add>; // number 类型

const addParams: AddParams = [1, 2];
const addResult: AddResult = 3;
```

## typeof

那么如果，我们只有一个函数，而并没有这个函数类型呢？此时可以使用 TypeScript 提供的类型查询操作符，即 `typeof`（记得和 JavaScript 的 typeof 区分一下），来获得一个函数的结构化类型，再配合工具类型即可即可：

``` typescript
const addHandler = (x: number, y: number) => x + y;

type Add = typeof addHandler; // (x: number, y: number) => number;

type AddParams = Parameters<Add>; // [number, number] 类型
type AddResult = ReturnType<Add>; // number 类型

const addParams: AddParams = [1, 2];
const addResult: AddResult = 3;
```

## Awaited

你可能会想到，对于异步函数类型，提取出的返回值类型是一个 `Promise<string>` 这样的类型，如果我想提取 Promise 内部的 string 类型呢？贴心的 TypeScript 为你准备了 `Awaited` 类型用于解决这样的问题：

``` typescript
const promise = new Promise<string>((resolve) => {
  setTimeout(() => {
    resolve("Hello, World!");
  }, 1000);
});

type PromiseInput = Promise<string>;
type AwaitedPromiseInput = Awaited<PromiseInput>; // string
```

你可以直接嵌套在 ReturnType 内部使用：

``` typescript
// 定义一个函数，该函数返回一个 Promise 对象
async function getPromise() {
  return new Promise<string>((resolve) => {
    setTimeout(() => {
      resolve("Hello, World!");
    }, 1000);
  });
}

type Result = Awaited<ReturnType<typeof getPromise>>; // string 类型
```

以上这些虽然不是全部的 TypeScript 内置工具类型，但一定是最常用的部分。但是在很多时候，这些内置工具类型并不能满足我们的需要，比如说 Partial，如果我们只希望将某些特定的属性标记为可选，但 Partial 一定是全量生效的，此时该怎么办？

我们并不会详细介绍这些特殊场景的解决方案，但其实目前我们所学习的相关知识已经足够给到你一些启发了，比如特殊属性标记为可选的这个场景，是否可以借助 Pick / Omit 类型的帮助？




















































































































































































































































































































