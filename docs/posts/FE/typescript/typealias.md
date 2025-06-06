---
title: 类型别名、联合类型与交叉类型
date: '2025-04-08'
tags:
- FE
---

# 类型别名、联合类型与交叉类型

思考一下，在 JavaScript 中，什么时候我们会需要定义变量和函数？无论你想到了什么样的答案，其实都逃不开两个关键：`引用和复用`。

我们定义变量，是为了后续对这个值可以直接进行引用，即使有多处使用逻辑，也可以很简单地复用这个变量（当然，前提是你没用着用着把它改了）。

函数也是类似，我们定义一个函数就是为了抽象一段通用的数据转换逻辑，然后再提供给其它地方的逻辑消费，这样它们就可以用一个函数名来替换掉一大段重复代码了。

在 TypeScript 中，`类型别名起到的就是变量的作用`，它可以存储一个类型，后续你可以直接引用它即可。就像我们此前学习到的，使用类型别名存储一个函数类型：

``` typescript
type Handler = () => void;

const handler1: Handler = () => {};
const handler2: Handler = () => {};
```

我们也可以使用类型别名来替换接口，实现对对象类型的复用：

``` typescript
type User =  {
  userName: string;
  userAge: number;
  userMarried: boolean;
  userJob?: string;
}

const user: User = { /* ... */ }
```

实际上，类型别名也可以像函数一样接受参数并返回计算结果，我们会在泛型一节继续展开学习。

这里我们先浅尝辄止，了解它的简单使用即可。而在作为变量的场景中，类型别名还和联合类型、交叉类型有着紧密的结合，我们接下来就来一探究竟。

在 JavaScript 中，我们经常会需要写“或”逻辑和“与”逻辑，比如你是一个小孩或老人，比如你是一个程序员且是前端领域，而在类型层面，或逻辑可以由联合类型实现，与逻辑可以由交叉类型实现，我们一个个来看。

首先是`联合类型`，它的语法是这样的：

``` typescript 
A | B | C
```

是不是很像 JavaScript 中的按位或？比如 A || B || C？但需要注意的是，如果你想定义一个联合类型，需要使用类型别名来存放：

``` typescript 
type PossibleTypes = string | number | boolean;
```

正如它所表示的或逻辑，只要你的变量满足其中一个类型成员，就可以被认为满足这个类型，因此你的变量可以在后续被赋值为其它的类型成员：

``` typescript 
let foo: PossibleTypes = 'xxx';

foo = 599;
foo = true;
```

联合类型对其中的类型成员并没有限制，你可以混合原始类型，字面量类型，函数类型，对象类型等等等等。而在实际应用中，最常见的应该是字面量联合类型，它表示一组精确的字面量类型：

``` typescript 
type Status = 'success' | 'failure';
type Code = 200 | 404 | 502;
```

等等，字面量类型是什么？这到底是类型还是值？在原始类型与对象类型一节中，我们并没有提到相关的概念，而是专门放到了这一节，原因就是字面量类型和联合类型简直就是天生一对。

那么字面量类型是什么？先类比到原始类型 string，我们知道被标记为 string 类型的变量只能被赋值为字符串，换句话说，所有的字符串值都属于 string 类型。那么这就显得过于宽泛了，如果我们希望将变量类型约束在几个特定的字符串值之间呢？

比如上面的类型别名 Status，就能表达“这个变量是字符串类型”和“这个变量只能是'success'和'failure'两个字符串”这两个概念。而组成 Status 的这两个“值”，其实就是字面量类型，比如你也可以用字面量类型来作为类型标注：

``` typescript 
const fixedStr: 'xxx' = 'xxx'; // 值只能是 'xxx'
const fixedNum: 599 = 599; // 值只能是 599
```

如果你感觉字面量类型和实际值不好区分，其实只要注意它们出现的位置即可，一个同样的字符串，只要出现在类型标注的位置，那指的当然就是类型啦。

字面量类型是和原始类型以及对象类型对应的——是的，包括对象类型，我们来看完整的示例：

``` typescript 
const literalString: 'linbudu' = 'linbudu';
const literalNumber: 599 = 599;
const literalBoolean: true = true;
const literalObject: { name: 'linbudu' } = { name: 'linbudu' };
const literalArray: [1, 2, 3] = [1, 2, 3];
```

那么，为什么我们需要字面量类型？当然是因为字面量联合类型相比它们对应的原始类型，能够提供更精确的类型信息与类型提示。

理想情况下，如请求状态与用户类型这样值被固定在一个小范围内的属性，都应该使用字面量联合类型进行标注。

除了基于字面量类型的小范围精确标注，我们也可以使用由接口组成的联合类型：

``` typescript 
interface VisitorUser {}
interface CommonUser {}
interface VIPUser {}
interface AdminUser {}

type User = VisitorUser | CommonUser | VIPUser | AdminUser;

const user: User = {
  // ...任意实现一个组成的对象类型
}
```

既然能够将联合类型关联到按位或，那么从按位与逻辑到交叉类型就更好理解了，类似于逻辑或 `||` 到联合类型的 `|`，交叉类型的 `&` 也脱胎自逻辑与 `&&`，我们同样可以使用类型别名来表示一个交叉类型，

``` typescript 
interface UserBasicInfo {}
interface UserJobInfo {}
interface UserFamilyInfo {}

type UserInfo = UserBasicInfo & UserJobInfo & UserFamilyInfo;
```

类型别名 UserInfo 表示，你需要实现 UserBasicInfo、UserJobInfo、UserFamilyInfo 这三个对象类型的所有属性，才能认为是实现了 UserInfo 类型。

交叉类型的本质，其实就是表示一个同时满足这些子类型成员的类型，所以如果你交叉两个对象类型，可以理解为是一个新的类型内部合并了这两个对象类型：

``` typescript 
// 伪代码
type UserInfo = {
  ...UserBasicInfo,
  ...UserJobInfo,
  ...UserFamilyInfo
}
```

你可能会想着，如果尝试交叉两个原始类型，会发现什么情况？

``` typescript 
type Test = string & number; // never 类型
```

出现了一个从未见过的 `never` 类型，它到底表示什么，我们暂时无需了解，只需要知道这意味着一个空的，没有任何意义的类型即可。那么，为什么会出现这种情况？再回想上面说的，“同时满足”这几个字，是否存在既是字符串又是数字的类型呢？

最后，就像我们经常一起使用“或”和“与”一样，联合类型与交叉类型也可以一起使用：

> 我们要发奖了，只要你是一个前端程序员，且熟悉 React，或者你是一个优秀掘金作者，最近一个月发表过文章，就可以领奖”

``` typescript 
// 伪代码
type Reward = (FE & React) | (OutstandingAuthors & PostLastMonth);
```

这里是先交叉再联合，因此只要实现任意一个交叉类型即可，那如果是先联合再交叉呢？

``` typescript 
type UnionIntersection = (1 | 2 | 3) & (1 | 2); // 1 | 2
```

由于我们需要实现所有的联合类型，那么只要这些联合类型存在交集，交集中的类型就可以认为是同时实现了所有联合类型。


















































































































































































































































































