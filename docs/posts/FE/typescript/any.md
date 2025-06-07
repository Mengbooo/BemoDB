---
title: any/unknown/类型断言
date: '2025-06-07'
tags:
- FE
---

# any/unknown/类型断言

到目前我们已经学习了变量与函数的类型标注，但不知你是否想过，既然这些类型都需要我们自己提供，那如果说哪天代码实在是太复杂了，我们不知道怎么写类型了应该怎么办？

## any

这种情况实际上是相当常见的，比如对于新入门+新接手这个项目的开发者来说，可能费了九牛二虎之力好不容易标注了自己觉得算是比较完美的类型，但一写上去又到处都是报错。又或者说你在把一个 JavaScript 项目迁移到 TypeScript，一时半会也搞不清到底这个变量在这里是什么类型...

即使时间充裕，我们也不一定能耐下心来精雕细琢，为了解决这种情况，TypeScript 特意为你提供了 `any` 类型，它的使用方式就和你此前已经学习的类型标注是完全一样的，只需要替换掉原本的类型即可：

``` typescript
let x: any;

function myFunc(param: any): any { ... }

const myArray: any[] = [1, "hello", true];

let myObject: any = { prop1: "hello", prop2: 123 };
```

那么，这样替换之后，对原本的类型有什么影响吗？想想 any 这个词代表什么？anyone、anywhere、anyhow...，在这些单词里，any 主打的就是一个“任意”。

而在类型层面，我们也可以这么理解，`any 类型 = string + number + boolean + 任意对象类型 + 拥有任意参数类型与任意返回值类型的函数类型 + ...`，它就是无所不包的

因此，在我们不知道对一个变量提供何种类型时，就可以`使用 any 类型来作为临时性的过渡`方案 —— 听起来很好，但为什么只是`临时过度`？

你可能已经想到了，既然 any 类型能表示所有类型，那它还能带给我们精确的类型提示吗？当然不能，实际上使用了 any 类型，就意味着告诉类型检查系统，这个变量我给它开白名单了:

``` typescript
let foo: any = 'Hi';

foo.bar.handler();
```

很明显这段代码实际执行是会报错的，但是由于你自己声明了放弃类型检查，它并不会被检查出来。

这很明显是相当危险的行为，也和我们选择 TypeScript 的原因相悖，因为使用了 any 类型之后，要想代码能够正常运行，你其实又相当于恢复到之前使用 JavaScript 时期，人工记忆变量类型的方式了。所以我们说它是临时性的过渡方案 —— 一旦你完成了对整个程序逻辑的梳理，最后还是应该把正确的具体类型填补上去。

## unknown

`any 类型 = 万能类型 + 放弃类型检查`，其中「万能类型」是我们想要的，能不能只要这个部分，而不要「放弃类型检查」这个危险的行为呢？

当然！考虑到 any 类型的危险性，TypeScript 中还提供了一个功能类似的家伙：unknown 类型，用于表示万能类型的同时，保留类型检查。我们先看万能类型的部分：

``` typescript
function myFunc(param: unknown) {
  // ...
}

myFunc({});
myFunc([]);
myFunc(true);
```

很不错，看起来都没报错，和 any 类型一样好用。但如果我们尝试在这个函数内使用参数呢？

``` typescript
function myFunc(param: unknown) {
  param.forEach((element) => {}); // X “param”的类型为“未知”。
}
```

注意到了吗？在我们尝试使用一个 unknown 类型的变量时，类型检查系统阻止了我们，它要求我们先为这个变量提供一个具体的类型后才能使用。而我们这里调用了 forEach 方法，很明显，我们希望它是一个数组类型！

但此时在代码中，param 的类型已经被固定为 unknown，此时我们应该如何修改一个变量的类型？

## 类型断言

这个时候我们就可以引入本节的第二个新概念——类型断言了。

如果你此前并没有接触过“断言”这个概念，可以简单理解为，**它能够修改一个变量的类型——无论是TS自己推导的，还是你手动标注的**。

这个概念的重要之处在于，此前我们学习到的类型标注就像是一次成型 —— 一旦你为这个变量提供了类型，或者是赋值之后，这个变量的类型就已经固定了，我们无法再对它进行修改。而现在有了类型断言，我们现在可以指着这个变量告诉 TS，这个类型看起来是一个字符串，其实它是一个数字！

我们回到上面的例子，如果要将 unknown 类型的变量断言到数组类型，我们可以这么写：

``` typescript
function myFunc(param: unknown) {
  (param as unknown[]).forEach((element) => {});
}
```

我们将参数类型断言到了一个成员类型为 unknown 的数组类型，而在后面的使用过程中，我们可能需要对数组成员进一步操作：

``` typescript
function myFunc(param: unknown) {
  (param as unknown[]).forEach((element) => {
    element = element + 1;
  });
}
```

虽然我们心里希望 element 是数字类型，但是 TS 可猜不到。此时，你可以考虑将 param 的类型一步到位的完善，也可以在后续使用时一步步完善：

``` typescript
function myFunc(param: unknown) {
  (param as number[]).forEach((element) => {
    element = element + 1;
  });
}

function myFunc(param: unknown) {
  (param as unknown[]).forEach((element) => {
    element = (element as number) + 1;
  });
}
```

这两种方式使用起来并没有明显的差异，但第二种一步步断言的方式更能体现类型断言的意义：`一个变量最开始是未知的类型，但随着后续的一步步使用，我们通过类型断言慢慢地完善这个类型的轮廓，最后完成对初始类型的定义`。

总结一下，any 类型和 unknown 类型都能提供万能类型的作用，但不同之处在于，使用 any 类型后就丧失了类型检查的保护，可以对变量进行任意操作。

而使用 unknown 类型时，虽然我们每进行一次操作都需要进行类型断言，断言到当前我们预期的类型，但这却能实现类型信息反向补全的功能，为最终我们的具体类型埋下伏笔。

上面我们了解的是初始提供 any / unknown 类型，然后通过类型断言将其断言到预期类型的操作。**实际上，还有一个更常见的场景是将一个拥有具体类型的变量断言到 any / unknown 类型**：

``` typescript
const str: string = "xxx";

(str as any).handler().result.prop; // ...
```

为什么我们需要这么做？因为很多时候，你面临的项目中并不会是完全没有类型定义的，这些变量可能最开始也是被维护者精心设计了类型的，但随着项目的不断迭代和维护者的更替，它们才日渐年久失修，导致你在使用这些变量时需要面对大量的类型报错。

所以这个时候我们就可以请出类型断言，先将其断言到一个万能类型，然后就重复我们上面学习的，随着一步步调用不断完善类型，然后最后回头补全的过程。

另外一个常见的场景是，某些时候 TypeScript 的类型分析会显得不那么符合直觉，比如这个例子：

``` typescript
interface IUser {
  name: string;
  job?: IJob;
}

interface IJob {
  title: string;
}

const user: IUser = {
  name: 'foo',
  job: {
    title: 'bar',
  },
};

const { name, job = {} } = user;

const { title } = job; // 类型“{}”上不存在属性“title”。
```

由于我们在第一次解构赋值时，为 job 提供了一个空对象作为默认值，TypeScript 会认为此时 job 的类型就是一个空对象，所以我们在第二次解构赋值时，就无法从 job 上获得 title 属性了。要解决这个问题，我们可以在第一次解构赋值时将这个空对象断言到预期的类型：

``` typescript
const { name, job = {} as IJob } = user;

const { title } = job;
```

























































































































































