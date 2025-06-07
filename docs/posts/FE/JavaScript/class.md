---
title: 类
date: '2025-03-31'
tags:
- FE
---

# 类
在面向对象的编程中，class 是用于创建对象的可扩展的程序代码模版，它为对象提供了状态（成员变量）的初始值和行为（成员函数或方法）的实现。

## 基本语法
在日常开发中，我们经常需要创建许多相同类型的对象，例如用户（users）、商品（goods）或者任何其他东西。

正如我们在 构造器和操作符 "new" 一章中已经学到的，new function 可以帮助我们实现这种需求。

但在现代 JavaScript 中，还有一个更高级的“类（class）”构造方式，它引入许多非常棒的新功能，这些功能对于面向对象编程很有用。

### “class” 语法
基本语法是：
``` javascript
class MyClass {
  // class 方法
  constructor() { ... }
  method1() { ... }
  method2() { ... }
  method3() { ... }
  ...
}
```

然后使用 new MyClass() 来创建具有上述列出的所有方法的新对象。

new 会自动调用 constructor() 方法，因此我们可以在 constructor() 中初始化对象。

例如：

``` javascript
class User {

  constructor(name) {
    this.name = name;
  }

  sayHi() {
    alert(this.name);
  }

}

// 用法：
let user = new User("John");
user.sayHi();
```
当 new User("John") 被调用：

- 一个新对象被创建。
- constructor 使用给定的参数运行，并将其赋值给 this.name。

……然后我们就可以调用对象方法了，例如 user.sayHi。

::: warning 类的方法之间没有逗号
对于新手开发人员来说，常见的陷阱是在类的方法之间放置逗号，这会导致语法错误。

不要把这里的符号与对象字面量相混淆。在类中，不需要逗号。
::: 

### 什么是 class？
所以，class 到底是什么？正如人们可能认为的那样，这不是一个全新的语言级实体。

让我们揭开其神秘面纱，看看类究竟是什么。这将有助于我们理解许多复杂的方面。

在 JavaScript 中，类是一种函数。

看看下面这段代码：

``` javascript
class User {
  constructor(name) { this.name = name; }
  sayHi() { alert(this.name); }
}

// 佐证：User 是一个函数
alert(typeof User); // function
```
class User {...} 构造实际上做了如下的事儿：

- 创建一个名为 User 的函数，该函数成为类声明的结果。该函数的代码来自于 - constructor 方法（如果我们不编写这种方法，那么它就被假定为空）。
- 存储类中的方法，例如 User.prototype 中的 sayHi。

当 new User 对象被创建后，当我们调用其方法时，它会从原型中获取对应的方法，正如我们在 F.prototype 一章中所讲的那样。因此，对象 new User 可以访问类中的方法。

我们可以将 class User 声明的结果解释为：
``` javascript
// User:constructor(name){
//     this.name = name;
// }

//             |
//             |
//             |

// User.prototype:
//     sayHi:function
//     constructor:User
```
下面这些代码很好地解释了它们：

``` javascript
class User {
  constructor(name) { this.name = name; }
  sayHi() { alert(this.name); }
}

// class 是一个函数
alert(typeof User); // function

// ...或者，更确切地说，是 constructor 方法
alert(User === User.prototype.constructor); // true

// 方法在 User.prototype 中，例如：
alert(User.prototype.sayHi); // sayHi 方法的代码

// 在原型中实际上有两个方法
alert(Object.getOwnPropertyNames(User.prototype)); // constructor, sayHi
```
### 不仅仅是语法糖
人们常说 class 是一个语法糖（旨在使内容更易阅读，但不引入任何新内容的语法），因为我们实际上可以在不使用 class 的情况下声明相同的内容：

``` javascript
// 用纯函数重写 class User

// 1. 创建构造器函数
function User(name) {
  this.name = name;
}
// 函数的原型（prototype）默认具有 "constructor" 属性，
// 所以，我们不需要创建它

// 2. 将方法添加到原型
User.prototype.sayHi = function() {
  alert(this.name);
};

// 用法：
let user = new User("John");
user.sayHi();
```
这个定义的结果与使用类得到的结果基本相同。因此，这确实是将 class 视为一种定义构造器及其原型方法的语法糖的理由。

尽管，它们之间存在着重大差异：

1. 首先，通过 class 创建的函数具有特殊的内部属性标记 `[[IsClassConstructor]]: true`。因此，它与手动创建并不完全相同。

编程语言会在许多地方检查该属性。例如，与普通函数不同，必须使用 new 来调用它：

``` javascript
class User {
  constructor() {}
}

alert(typeof User); // function
User(); // Error: Class constructor User cannot be invoked without 'new'
```
此外，大多数 JavaScript 引擎中的类构造器的字符串表示形式都以 “class…” 开头
``` javascript
class User {
  constructor() {}
}

alert(User); // class User { ... }
```

2. 类方法不可枚举。 类定义将 "prototype" 中的所有方法的 enumerable 标志设置为 false。

这很好，因为如果我们对一个对象调用 for..in 方法，我们通常不希望 class 方法出现。

3. 类总是使用 use strict。 在类构造中的所有代码都将自动进入严格模式。

class 语法还带来了许多其他功能，我们稍后将会探索它们。

### 类表达式
就像函数一样，类可以在另外一个表达式中被定义，被传递，被返回，被赋值等。

这是一个类表达式的例子：

``` javascript
let User = class {
  sayHi() {
    alert("Hello");
  }
};
```

类似于命名函数表达式（Named Function Expressions），类表达式可能也应该有一个名字。

如果类表达式有名字，那么该名字仅在类内部可见：

``` javascript
// “命名类表达式（Named Class Expression）”
// (规范中没有这样的术语，但是它和命名函数表达式类似)
let User = class MyClass {
  sayHi() {
    alert(MyClass); // MyClass 这个名字仅在类内部可见
  }
};

new User().sayHi(); // 正常运行，显示 MyClass 中定义的内容

alert(MyClass); // error，MyClass 在外部不可见
```
我们甚至可以动态地“按需”创建类，就像这样：

``` javascript
function makeClass(phrase) {
  // 声明一个类并返回它
  return class {
    sayHi() {
      alert(phrase);
    }
  };
}

// 创建一个新的类
let User = makeClass("Hello");

new User().sayHi(); // Hello
```
### Getters/setters
就像对象字面量，类可能包括 getters/setters，计算属性（computed properties）等。

这是一个使用 get/set 实现 user.name 的示例：

``` javascript
class User {

  constructor(name) {
    // 调用 setter
    this.name = name;
  }

  get name() {
    return this._name;
  }

  set name(value) {
    if (value.length < 4) {
      alert("Name is too short.");
      return;
    }
    this._name = value;
  }

}

let user = new User("John");
alert(user.name); // John

user = new User(""); // Name is too short.
```
从技术上来讲，这样的类声明可以通过在 User.prototype 中创建 getters 和 setters 来实现。
### 计算属性名称 `[…]`

这里有一个使用中括号 `[...]` 的计算方法名称示例：

``` javascript
class User {

  ['say' + 'Hi']() {
    alert("Hello");
  }

}

new User().sayHi();
```
这种特性很容易记住，因为它们和对象字面量类似。

### Class 字段
::: warning 旧的浏览器可能需要 polyfill
类字段（field）是新添加到语言中的。
:::

之前，我们的类仅具有方法。

“类字段”是一种允许添加任何属性的语法。

例如，让我们在 class User 中添加一个 name 属性：

``` javascript
class User {
  name = "John";

  sayHi() {
    alert(`Hello, ${this.name}!`);
  }
}

new User().sayHi(); // Hello, John!
```
所以，我们就只需在表达式中写 “ = ”，就这样。

类字段的重要区别在于，它们会被挂在实例对象上，而非 User.prototype 上：
``` javascript
class User {
  name = "John";
}

let user = new User();
alert(user.name); // John
alert(User.prototype.name); // undefined
```
我们也可以在赋值时使用更复杂的表达式和函数调用：

``` javascript
class User {
  name = prompt("Name, please?", "John");
}

let user = new User();
alert(user.name); // John
```

### 使用类字段制作绑定方法

正如 函数绑定 一章中所讲的，JavaScript 中的函数具有动态的 this。它取决于调用上下文。

因此，如果一个对象方法被传递到某处，或者在另一个上下文中被调用，则 this 将不再是对其对象的引用。

例如，此代码将显示 undefined：

``` javascript
class Button {
  constructor(value) {
    this.value = value;
  }

  click() {
    alert(this.value);
  }
}

let button = new Button("hello");

setTimeout(button.click, 1000); // undefined
```
这个问题被称为“丢失 this”。

我们在 函数绑定 一章中讲过，有两种可以修复它的方式：
- 传递一个包装函数，例如 setTimeout(() => button.click(), 1000)。
- 将方法绑定到对象，例如在 constructor 中。

类字段提供了另一种非常优雅的语法：

``` javascript
class Button {
  constructor(value) {
    this.value = value;
  }
  click = () => {
    alert(this.value);
  }
}

let button = new Button("hello");

setTimeout(button.click, 1000); // hello
```
类字段 click = () => {...} 是基于每一个对象被创建的，在这里对于每一个 Button 对象都有一个独立的方法，在内部都有一个指向此对象的 this。我们可以把 button.click 传递到任何地方，而且 this 的值总是正确的。

在浏览器环境中，它对于进行事件监听尤为有用。

## 类继承
类继承是一个类扩展另一个类的一种方式。

因此，我们可以在现有功能之上创建新功能。
### “extends” 关键字
假设我们有 class Animal：
``` javascript
class Animal {
  constructor(name) {
    this.speed = 0;
    this.name = name;
  }
  run(speed) {
    this.speed = speed;
    alert(`${this.name} runs with speed ${this.speed}.`);
  }
  stop() {
    this.speed = 0;
    alert(`${this.name} stands still.`);
  }
}

let animal = new Animal("My animal");
```
……然后我们想创建另一个 class Rabbit：

因为 rabbit 是 animal，所以 class Rabbit 应该是基于 class Animal 的，可以访问 animal 的方法，以便 rabbit 可以做“一般”动物可以做的事儿。

扩展另一个类的语法是：`class Child extends Parent`。

让我们创建一个继承自 Animal 的 class Rabbit：

``` javascript
class Rabbit extends Animal {
  hide() {
    alert(`${this.name} hides!`);
  }
}

let rabbit = new Rabbit("White Rabbit");

rabbit.run(5); // White Rabbit runs with speed 5.
rabbit.hide(); // White Rabbit hides!
```
class Rabbit 的对象可以访问例如 rabbit.hide() 等 Rabbit 的方法，还可以访问例如 rabbit.run() 等 Animal 的方法。

在内部，关键字 extends 使用了很好的旧的原型机制进行工作。它将 Rabbit.prototype.`[[Prototype]]` 设置为 Animal.prototype。所以，如果在 Rabbit.prototype 中找不到一个方法，JavaScript 就会从 Animal.prototype 中获取该方法。

![svg](https://zh.javascript.info/article/class-inheritance/animal-rabbit-extends.svg)

例如，要查找 rabbit.run 方法，JavaScript 引擎会进行如下检查（如图所示从下到上）：

- 查找对象 rabbit（没有 run）。
- 查找它的原型，即 Rabbit.prototype（有 hide，但没有 run）。
- 查找它的原型，即（由于 extends）Animal.prototype，在这儿找到了 run 方法。

我们可以回忆一下 原生的原型 这一章的内容，JavaScript 内建对象同样也使用原型继承。例如，Date.prototype.[[Prototype]] 是 Object.prototype。这就是为什么日期可以访问通用对象的方法。

::: tip 在 extends 后允许任意表达式
类语法不仅允许指定一个类，在 extends 后可以指定任意表达式。

例如，一个生成父类的函数调用：
``` javascript
function f(phrase) {
  return class {
    sayHi() { alert(phrase); }
  };
}

class User extends f("Hello") {}

new User().sayHi(); // Hello
```
这里 class User 继承自 f("Hello") 的结果。

这对于高级编程模式，例如当我们根据许多条件使用函数生成类，并继承它们时来说可能很有用。
::: 

### 重写方法
现在，让我们继续前行并尝试重写一个方法。默认情况下，所有未在 class Rabbit 中指定的方法均从 class Animal 中直接获取。

但是如果我们在 Rabbit 中指定了我们自己的方法，例如 stop()，那么将会使用它：

``` javascript
class Rabbit extends Animal {
  stop() {
    // ……现在这个将会被用作 rabbit.stop()
    // 而不是来自于 class Animal 的 stop()
  }
}
```
然而通常，我们不希望完全替换父类的方法，而是**希望在父类方法的基础上进行调整或扩展其功能**。我们在我们的方法中做一些事儿，但是在它之前或之后或在过程中会调用父类方法。

Class 为此提供了 "super" 关键字。

- 执行 super.method(...) 来调用一个父类方法。
- 执行 super(...) 来调用一个父类 constructor（只能在我们的 constructor 中）。

例如，让我们的 rabbit 在停下来的时候自动 hide：


``` javascript
class Animal {

  constructor(name) {
    this.speed = 0;
    this.name = name;
  }

  run(speed) {
    this.speed = speed;
    alert(`${this.name} runs with speed ${this.speed}.`);
  }

  stop() {
    this.speed = 0;
    alert(`${this.name} stands still.`);
  }

}

class Rabbit extends Animal {
  hide() {
    alert(`${this.name} hides!`);
  }

  stop() {
    super.stop(); // 调用父类的 stop
    this.hide(); // 然后 hide
  }
}

let rabbit = new Rabbit("White Rabbit");

rabbit.run(5); // White Rabbit runs with speed 5.
rabbit.stop(); // White Rabbit stands still. White Rabbit hides!
```
现在，Rabbit 在执行过程中调用父类的 super.stop() 方法，所以 Rabbit 也具有了 stop 方法。

::: tip 箭头函数没有 super
正如我们在 深入理解箭头函数 一章中所提到的，箭头函数没有 super。

如果被访问，它会从外部函数获取。例如：

``` javascript
class Rabbit extends Animal {
  stop() {
    setTimeout(() => super.stop(), 1000); // 1 秒后调用父类的 stop
  }
}
```
箭头函数中的 super 与 stop() 中的是一样的，所以它能按预期工作。如果我们在这里指定一个“普通”函数，那么将会抛出错误：
``` javascript
// 意料之外的 super
setTimeout(function() { super.stop() }, 1000);
```
::: 

### 重写 constructor
对于重写 constructor 来说，则有点棘手。

到目前为止，Rabbit 还没有自己的 constructor。

根据 规范，如果一个类扩展了另一个类并且没有 constructor，那么将生成下面这样的“空” constructor：

``` javascript
class Rabbit extends Animal {
  // 为没有自己的 constructor 的扩展类生成的
  constructor(...args) {
    super(...args);
  }
}
```
正如我们所看到的，它调用了父类的 constructor，并传递了所有的参数。如果我们没有写自己的 constructor，就会出现这种情况。

现在，我们给 Rabbit 添加一个自定义的 constructor。除了 name 之外，它还会指定 earLength。
``` javascript
class Animal {
  constructor(name) {
    this.speed = 0;
    this.name = name;
  }
  // ...
}

class Rabbit extends Animal {

  constructor(name, earLength) {
    this.speed = 0;
    this.name = name;
    this.earLength = earLength;
  }

  // ...
}

// 不工作！
let rabbit = new Rabbit("White Rabbit", 10); // Error: this is not defined.
```

哎呦！我们得到了一个报错。现在我们没法新建 rabbit。是什么地方出错了？

简短的解释是：

`继承类的 constructor 必须调用 super(...)，并且 (!) 一定要在使用 this 之前调用。`

……但这是为什么呢？这里发生了什么？确实，这个要求看起来很奇怪。

当然，本文会给出一个解释。让我们深入细节，这样你就可以真正地理解发生了什么。

在 JavaScript 中，继承类（所谓的“派生构造器”，英文为 “derived constructor”）的构造函数与其他函数之间是有区别的。派生构造器具有特殊的内部属性 `[[ConstructorKind]]:"derived"`。这是一个特殊的内部标签。

该标签会影响它的 new 行为：

- 当通过 new 执行一个常规函数时，它将创建一个空对象，并将这个空对象赋值给 this。
- 但是当继承的 constructor 执行时，它不会执行此操作。它期望父类的 constructor 来完成这项工作。

因此，派生的 constructor 必须调用 super 才能执行其父类（base）的 constructor，否则 this 指向的那个对象将不会被创建。并且我们会收到一个报错。

为了让 Rabbit 的 constructor 可以工作，它需要在使用 this 之前调用 super()，就像下面这样：

``` javascript
class Animal {

  constructor(name) {
    this.speed = 0;
    this.name = name;
  }

  // ...
}

class Rabbit extends Animal {

  constructor(name, earLength) {
    super(name);
    this.earLength = earLength;
  }

  // ...
}

// 现在可以了
let rabbit = new Rabbit("White Rabbit", 10);
alert(rabbit.name); // White Rabbit
alert(rabbit.earLength); // 10
```

### 重写类字段: 一个棘手的注意要点
这里提供了一个更好的视角来窥探这门语言，且解释了它的行为为什么可能会是 bugs 的来源(但不是非常频繁)。

我们不仅可以重写方法，还可以重写类字段。

不过，当我们在父类构造器中访问一个被重写的字段时，有一个诡异的行为，这与绝大多数其他编程语言都很不一样。

请思考此示例：

``` javascript
class Animal {
  name = 'animal';

  constructor() {
    alert(this.name); // (*)
  }
}

class Rabbit extends Animal {
  name = 'rabbit';
}

new Animal(); // animal
new Rabbit(); // animal
```
这里，Rabbit 继承自 Animal，并且用它自己的值重写了 name 字段。

因为 Rabbit 中没有自己的构造器，所以 Animal 的构造器被调用了。

有趣的是在这两种情况下：new Animal() 和 new Rabbit()，在 (*) 行的 alert 都打印了 animal。

`换句话说，父类构造器总是会使用它自己字段的值，而不是被重写的那一个。`

古怪的是什么呢？

如果这还不清楚，那么让我们用方法来进行比较。

这里是相同的代码，但是我们调用 this.showName() 方法而不是 this.name 字段：

``` javascript
class Animal {
  showName() {  // 而不是 this.name = 'animal'
    alert('animal');
  }

  constructor() {
    this.showName(); // 而不是 alert(this.name);
  }
}

class Rabbit extends Animal {
  showName() {
    alert('rabbit');
  }
}

new Animal(); // animal
new Rabbit(); // rabbit
```
请注意：这时的输出是不同的。

这才是我们本来所期待的结果。当父类构造器在派生的类中被调用时，它会使用被重写的方法。

……但对于类字段并非如此。正如前文所述，父类构造器总是使用父类的字段。

这里为什么会有这样的区别呢？

实际上，原因在于字段初始化的顺序。类字段是这样初始化的：

- 对于基类（还未继承任何东西的那种），在构造函数调用前初始化。
- 对于派生类，在 super() 后立刻初始化。

在我们的例子中，Rabbit 是派生类，里面没有 constructor()。正如先前所说，这相当于一个里面只有 super(...args) 的空构造器。

所以，new Rabbit() 调用了 super()，因此它执行了父类构造器，并且（根据派生类规则）只有在此之后，它的类字段才被初始化。在父类构造器被执行的时候，Rabbit 还没有自己的类字段，这就是为什么 Animal 类字段被使用了。

这种字段与方法之间微妙的区别只特定于 JavaScript。

幸运的是，这种行为仅在一个被重写的字段被父类构造器使用时才会显现出来。接下来它会发生的东西可能就比较难理解了，所以我们要在这里对此行为进行解释。

如果出问题了，我们可以通过使用方法或者 getter/setter 替代类字段，来修复这个问题。

### 深入：内部探究和 `[[HomeObject]]`
这是关于继承和 super 背后的内部机制。

让我们更深入地研究 super。我们将在这个过程中发现一些有趣的事儿。

首先要说的是，从我们迄今为止学到的知识来看，super 是不可能运行的。

的确是这样，让我们问问自己，以技术的角度它是如何工作的？当一个对象方法执行时，它会将当前对象作为 this。随后如果我们调用 `super.method()`，那么引擎需要从当前对象的原型中获取 method。但这是怎么做到的？

这个任务看起来是挺容易的，但其实并不简单。引擎知道当前对象的 this，所以它可以获取父 method 作为 `this.__proto__.method`。不幸的是，这个“天真”的解决方法是行不通的。

让我们演示一下这个问题。简单起见，我们使用普通对象而不使用类。

如果你不想知道更多的细节知识，你可以跳过此部分，并转到下面的 `[[HomeObject]]` 小节。这没关系的。但如果你感兴趣，想学习更深入的知识，那就继续阅读吧。

在下面的例子中，`rabbit.__proto__ = animal`。现在让我们尝试一下：在 `rabbit.eat()` 我们将会使用 `this.__proto__` 调用 `animal.eat()`：

``` javascript
let animal = {
  name: "Animal",
  eat() {
    alert(`${this.name} eats.`);
  }
};

let rabbit = {
  __proto__: animal,
  name: "Rabbit",
  eat() {
    // 这就是 super.eat() 可以大概工作的方式
    this.__proto__.eat.call(this); // (*)
  }
};

rabbit.eat(); // Rabbit eats.
```
在 (*) 这一行，我们从原型（animal）中获取 eat，并在当前对象的上下文中调用它。请注意，.call(this) 在这里非常重要，因为简单的调用 `this.__proto__.eat()` 将在原型的上下文中执行 eat，而非当前对象。

在上面的代码中，它确实按照了期望运行：我们获得了正确的 alert。

现在，让我们在原型链上再添加一个对象。我们将看到这件事是如何被打破的：

``` javascript
let animal = {
  name: "Animal",
  eat() {
    alert(`${this.name} eats.`);
  }
};

let rabbit = {
  __proto__: animal,
  eat() {
    // ...bounce around rabbit-style and call parent (animal) method
    this.__proto__.eat.call(this); // (*)
  }
};

let longEar = {
  __proto__: rabbit,
  eat() {
    // ...do something with long ears and call parent (rabbit) method
    this.__proto__.eat.call(this); // (**)
  }
};

longEar.eat(); // Error: Maximum call stack size exceeded
```

代码无法再运行了！我们可以看到，在试图调用 longEar.eat() 时抛出了错误。

原因可能不那么明显，但是如果我们跟踪 longEar.eat() 调用，就可以发现原因。在 (*) 和 (**) 这两行中，this 的值都是当前对象（longEar）。这是至关重要的一点：所有的对象方法都将当前对象作为 this，而非原型或其他什么东西。

因此，在 (*) 和 (**) 这两行中，`this.__proto__` 的值是完全相同的：都是 rabbit。它们俩都调用的是 rabbit.eat，它们在不停地循环调用自己，而不是在原型链上向上寻找方法。

这张图介绍了发生的情况：

![this-super-loop](https://zh.javascript.info/article/class-inheritance/this-super-loop.svg)


1. 在 longEar.eat() 中，(**) 这一行调用 rabbit.eat 并为其提供 this=longEar。

``` javascript
// 在 longEar.eat() 中我们有 this = longEar
this.__proto__.eat.call(this) // (**)
// 变成了
longEar.__proto__.eat.call(this)
// 也就是
rabbit.eat.call(this);
```

2. 之后在 rabbit.eat 的 (*) 行中，我们希望将函数调用在原型链上向更高层传递，但是 this=longEar，所以 `this.__proto__.eat` 又是 rabbit.eat！

``` javascript
// 在 rabbit.eat() 中我们依然有 this = longEar
this.__proto__.eat.call(this) // (*)
// 变成了
longEar.__proto__.eat.call(this)
// 或（再一次）
rabbit.eat.call(this);
```

3. ……所以 rabbit.eat 在不停地循环调用自己，因此它无法进一步地提升。

这个问题没法仅仅通过使用 this 来解决。

### [[HomeObject]]
为了提供解决方法，JavaScript 为函数添加了一个特殊的内部属性：[[HomeObject]]。

**当一个函数被定义为类或者对象方法时，它的 [[HomeObject]] 属性就成为了该对象**。

然后 super 使用它来解析（resolve）父原型及其方法。

让我们看看它是怎么工作的，首先，对于普通对象：

``` javascript
let animal = {
  name: "Animal",
  eat() {         // animal.eat.[[HomeObject]] == animal
    alert(`${this.name} eats.`);
  }
};

let rabbit = {
  __proto__: animal,
  name: "Rabbit",
  eat() {         // rabbit.eat.[[HomeObject]] == rabbit
    super.eat();
  }
};

let longEar = {
  __proto__: rabbit,
  name: "Long Ear",
  eat() {         // longEar.eat.[[HomeObject]] == longEar
    super.eat();
  }
};

// 正确执行
longEar.eat();  // Long Ear eats.
```

它基于 [[HomeObject]] 运行机制按照预期执行。一个方法，例如 longEar.eat，知道其 [[HomeObject]] 并且从其原型中获取父方法。并没有使用 this。

#### 方法并不是“自由”的

正如我们之前所知道的，函数通常都是“自由”的，并没有绑定到 JavaScript 中的对象。正因如此，它们可以在对象之间复制，并用另外一个 this 调用它。

[[HomeObject]] 的存在违反了这个原则，因为方法记住了它们的对象。[[HomeObject]] 不能被更改，所以这个绑定是永久的。

在 JavaScript 语言中 [[HomeObject]] 仅被用于 super。所以，如果一个方法不使用 super，那么我们仍然可以视它为自由的并且可在对象之间复制。但是用了 super 再这样做可能就会出错。

下面是复制后错误的 super 结果的示例：

``` javascript
let animal = {
  sayHi() {
    alert(`I'm an animal`);
  }
};

// rabbit 继承自 animal
let rabbit = {
  __proto__: animal,
  sayHi() {
    super.sayHi();
  }
};

let plant = {
  sayHi() {
    alert("I'm a plant");
  }
};

// tree 继承自 plant
let tree = {
  __proto__: plant,
  sayHi: rabbit.sayHi // (*)
};

tree.sayHi();  // I'm an animal (?!?)
```
调用 tree.sayHi() 显示 “I’m an animal”。这绝对是错误的。

原因很简单：

- 在 (*) 行，tree.sayHi 方法是从 rabbit 复制而来。也许我们只是想避免重复代码？
- 它的 [[HomeObject]] 是 rabbit，因为它是在 rabbit 中创建的。没有办法修改 [[HomeObject]]。
- tree.sayHi() 内具有 super.sayHi()。它从 rabbit 中上溯，然后从 animal 中获取方法。

这是发生的情况示意图：

![super-homeobject-wrong](https://zh.javascript.info/article/class-inheritance/super-homeobject-wrong.svg)

#### 方法，不是函数属性
[[HomeObject]] 是为类和普通对象中的方法定义的。但是对于对象而言，方法必须确切指定为 method()，而不是 "method: function()"。

这个差别对我们来说可能不重要，但是对 JavaScript 来说却非常重要。

在下面的例子中，使用非方法（non-method）语法进行了比较。未设置 [[HomeObject]] 属性，并且继承无效：

``` javascript
let animal = {
  eat: function() { // 这里是故意这样写的，而不是 eat() {...
    // ...
  }
};

let rabbit = {
  __proto__: animal,
  eat: function() {
    super.eat();
  }
};

rabbit.eat();  // 错误调用 super（因为这里没有 [[HomeObject]]）
```

### 总结一下：

1. 想要扩展一个类：class Child extends Parent：
   - 这意味着 Child.prototype.__proto__ 将是 Parent.prototype，所以方法会被继承。
2. 重写一个 constructor：
   - 在使用 this 之前，我们必须在 Child 的 constructor 中将父 constructor 调用为 super()。
3. 重写一个方法：
   - 我们可以在一个 Child 方法中使用 super.method() 来调用 Parent 方法。
4. 内部：
   - 方法在内部的 [[HomeObject]] 属性中记住了它们的类/对象。这就是 super 如何解析父方法的。
   - 因此，将一个带有 super 的方法从一个对象复制到另一个对象是不安全的。
5. 补充：
   - 箭头函数没有自己的 this 或 super，所以它们能融入到就近的上下文中，像透明似的。

## 静态属性和静态方法
我们还可以为**整个类分配一个方法**。这样的方法被称为 静态的（static）。

在一个类的声明中，它们以 static 关键字开头，如下所示：

``` javascript
class User {
  static staticMethod() {
    alert(this === User);
  }
}

User.staticMethod(); // true
```

这实际上跟直接将其作为属性赋值的作用相同：

``` javascript
class User { }

User.staticMethod = function() {
  alert(this === User);
};

User.staticMethod(); // true
```
在 User.staticMethod() 调用中的 this 的值是类构造器 User 自身（“点符号前面的对象”规则）。

通常，静态方法用于实现属于整个类，但不属于该类任何特定对象的函数。

例如，我们有对象 Article，并且需要一个方法来比较它们。

通常的解决方案就是添加 Article.compare 静态方法：

``` javascript
class Article {
  constructor(title, date) {
    this.title = title;
    this.date = date;
  }

  static compare(articleA, articleB) {
    return articleA.date - articleB.date;
  }
}

// 用法
let articles = [
  new Article("HTML", new Date(2019, 1, 1)),
  new Article("CSS", new Date(2019, 0, 1)),
  new Article("JavaScript", new Date(2019, 11, 1))
];

articles.sort(Article.compare);

alert( articles[0].title ); // CSS
```
这里 Article.compare 方法代表“上面的”文章，意思是比较它们。它不是文章的方法，而是整个 class 的方法。

另一个例子是所谓的“工厂”方法。

比如说，我们需要通过多种方式来创建一篇文章：

1. 通过用给定的参数来创建（title，date 等）。
2. 使用今天的日期来创建一个空的文章。
3. ……其它方法。

第一种方法我们可以通过 constructor 来实现。对于第二种方式，我们可以创建类的一个静态方法来实现。

例如这里的 Article.createTodays()：

``` javascript
class Article {
  constructor(title, date) {
    this.title = title;
    this.date = date;
  }

  static createTodays() {
    // 记住 this = Article
    return new this("Today's digest", new Date());
  }
}

let article = Article.createTodays();

alert( article.title ); // Today's digest
```
现在，每当我们需要创建一个今天的文章时，我们就可以调用 Article.createTodays()。再说明一次，它不是一个文章的方法，而是整个 class 的方法。

静态方法也被用于与数据库相关的公共类，可以用于搜索/保存/删除数据库中的条目， 就像这样：

``` javascript
// 假定 Article 是一个用来管理文章的特殊类
// 通过 id 来移除文章的静态方法：
Article.remove({id: 12345});
```
::: tip 静态方法不适用于单个对象
静态方法可以在类上调用，而不是在单个对象上。

例如，这样的代码无法正常工作：
``` javascript
// ...
article.createTodays(); /// Error: article.createTodays is not a function
```
:::

### 静态属性

静态的属性也是可能的，它们看起来就像常规的类属性，但前面加有 static：

``` javascript
class Article {
  static publisher = "Levi Ding";
}

alert( Article.publisher ); // Levi Ding
```
这等同于直接给 Article 赋值：
``` javascript
Article.publisher = "Levi Ding";
```
### 继承静态属性和方法
静态属性和方法是可被继承的。

例如，下面这段代码中的 Animal.compare 和 Animal.planet 是可被继承的，可以通过 Rabbit.compare 和 Rabbit.planet 来访问：

``` javascript
class Animal {
  static planet = "Earth";

  constructor(name, speed) {
    this.speed = speed;
    this.name = name;
  }

  run(speed = 0) {
    this.speed += speed;
    alert(`${this.name} runs with speed ${this.speed}.`);
  }

  static compare(animalA, animalB) {
    return animalA.speed - animalB.speed;
  }

}

// 继承于 Animal
class Rabbit extends Animal {
  hide() {
    alert(`${this.name} hides!`);
  }
}

let rabbits = [
  new Rabbit("White Rabbit", 10),
  new Rabbit("Black Rabbit", 5)
];

rabbits.sort(Rabbit.compare);

rabbits[0].run(); // Black Rabbit runs with speed 5.

alert(Rabbit.planet); // Earth
```

现在我们调用 Rabbit.compare 时，继承的 Animal.compare 将会被调用。

它是如何工作的？再次，使用原型。你可能已经猜到了，extends 让 Rabbit 的 `[[Prototype]]` 指向了 Animal。

![animal-rabbit-static](https://zh.javascript.info/article/static-properties-methods/animal-rabbit-static.svg)


所以，Rabbit extends Animal 创建了两个 [[Prototype]] 引用：

- Rabbit 函数原型继承自 Animal 函数。
- Rabbit.prototype 原型继承自 Animal.prototype。

结果就是，继承对常规方法和静态方法都有效。

这里，让我们通过代码来检验一下：

``` javascript
class Animal {}
class Rabbit extends Animal {}

// 对于静态的
alert(Rabbit.__proto__ === Animal); // true

// 对于常规方法
alert(Rabbit.prototype.__proto__ === Animal.prototype); // true
```
### 总而言之
静态方法被用于实现属于整个类的功能。它与具体的类实例无关。

举个例子， 一个用于进行比较的方法 Article.compare(article1, article2) 或一个工厂（factory）方法 Article.createTodays()。

在类声明中，它们都被用关键字 static 进行了标记。

静态属性被用于当我们想要存储类级别的数据时，而不是绑定到实例。

从技术上讲，静态声明与直接给类本身赋值相同

静态属性和方法是可被继承的。

对于 class B extends A，类 B 的 prototype 指向了 `A：B.[[Prototype]] = A`。因此，如果一个字段在 B 中没有找到，会继续在 A 中查找。

## 私有的和受保护的属性和方法
面向对象编程最重要的原则之一 —— 将内部接口与外部接口分隔开来。

在开发比 “hello world” 应用程序更复杂的东西时，这是“必须”遵守的做法。

为了理解这一点，让我们脱离开发过程，把目光转向现实世界。

通常，我们使用的设备都非常复杂。但是，将内部接口与外部接口分隔开来可以让我们使用它们且没有任何问题。
### 一个现实生活中的例子

例如，一个咖啡机。从外面看很简单：一个按钮，一个显示器，几个洞……当然，结果就是 —— 很棒的咖啡！`:)`

但是在内部有非常多的细节。但我们可以在完全不了解这些内部细节的情况下使用它。

咖啡机非常可靠，不是吗？一台咖啡机我们可以使用好几年，只有在出现问题时 —— 把它送去维修。

咖啡机的可靠性和简洁性的秘诀 —— 所有细节都经过精心校并 隐藏 在内部。

如果我们从咖啡机上取下保护罩，那么使用它将变得复杂得多（要按哪里？），并且很危险（会触电）。

正如我们所看到的，在编程中，对象就像咖啡机。

但是为了隐藏内部细节，我们不会使用保护罩，而是使用语言和约定中的特殊语法。

### 内部接口和外部接口
在面向对象的编程中，属性和方法分为两组：

- 内部接口 —— 可以通过该类的其他方法访问，但不能从外部访问的方法和属性。
- 外部接口 —— 也可以从类的外部访问的方法和属性。

如果我们继续用咖啡机进行类比 —— 内部隐藏的内容：锅炉管，加热元件等 —— 是咖啡机的内部接口。

内部接口用于对象工作，它的细节相互使用。例如，锅炉管连接到加热元件。

但是从外面看，一台咖啡机被保护壳罩住了，所以没有人可以接触到其内部接口。细节信息被隐藏起来并且无法访问。我们可以通过外部接口使用它的功能。

所以，我们需要使用一个对象时只需知道它的外部接口。我们可能完全不知道它的内部是如何工作的，这太好了。

这是个概括性的介绍。

在 JavaScript 中，有两种类型的对象字段（属性和方法）：

- 公共的：可从任何地方访问。它们构成了外部接口。到目前为止，我们只使用了公共的属性和方法。
- 私有的：只能从类的内部访问。这些用于内部接口。

在许多其他编程语言中，还存在“受保护”的字段：只能从类的内部和基于其扩展的类的内部访问（例如私有的，但可以从继承的类进行访问）。它们对于内部接口也很有用。从某种意义上讲，它们比私有的属性和方法更为广泛，因为我们通常希望继承类来访问它们。

受保护的字段不是在语言级别的 JavaScript 中实现的，但实际上它们非常方便，因为它们是在 JavaScript 中模拟的类定义语法。

现在，我们将使用所有这些类型的属性在 JavaScript 中制作咖啡机。咖啡机有很多细节，我们不会对它们进行全面模拟以保持简洁（尽管我们可以）。

### 受保护的 “waterAmount”
首先，让我们做一个简单的咖啡机类：
``` javascript
class CoffeeMachine {
  waterAmount = 0; // 内部的水量

  constructor(power) {
    this.power = power;
    alert( `Created a coffee-machine, power: ${power}` );
  }

}

// 创建咖啡机
let coffeeMachine = new CoffeeMachine(100);

// 加水
coffeeMachine.waterAmount = 200;
```
现在，属性 waterAmount 和 power 是公共的。我们可以轻松地从外部将它们 get/set 成任何值。

让我们将 waterAmount 属性更改为受保护的属性，以对其进行更多控制。例如，我们不希望任何人将它的值设置为小于零的数。

**受保护的属性通常以下划线 _ 作为前缀。**

这不是在语言级别强制实施的，但是程序员之间有一个众所周知的约定，即不应该从外部访问此类型的属性和方法。

所以我们的属性将被命名为 `_waterAmount`：

``` javascript
class CoffeeMachine {
  _waterAmount = 0;

  set waterAmount(value) {
    if (value < 0) {
      value = 0;
    }
    this._waterAmount = value;
  }

  get waterAmount() {
    return this._waterAmount;
  }

  constructor(power) {
    this._power = power;
  }

}

// 创建咖啡机
let coffeeMachine = new CoffeeMachine(100);

// 加水
coffeeMachine.waterAmount = -10; // _waterAmount 将变为 0，而不是 -10
```
现在访问已受到控制，因此将水量的值设置为小于零的数变得不可能。

### 只读的 “power”

对于 power 属性，让我们将它设为只读。有时候一个属性必须只能被在创建时进行设置，之后不再被修改。

咖啡机就是这种情况：功率永远不会改变。

要做到这一点，我们只需要设置 getter，而不设置 setter：

``` javascript
class CoffeeMachine {
  // ...

  constructor(power) {
    this._power = power;
  }

  get power() {
    return this._power;
  }

}

// 创建咖啡机
let coffeeMachine = new CoffeeMachine(100);

alert(`Power is: ${coffeeMachine.power}W`); // 功率是：100W

coffeeMachine.power = 25; // Error（没有 setter）
```
::: tip getter/setter 函数
这里我们使用了 getter/setter 语法。

但大多数时候首选 getSomething/setSomething 函数，像这样：
``` javascript
class CoffeeMachine {
  _waterAmount = 0;

  setWaterAmount(value) {
    if (value < 0) value = 0;
    this._waterAmount = value;
  }

  getWaterAmount() {
    return this._waterAmount;
  }
}

new CoffeeMachine().setWaterAmount(100);
```
这看起来有点长，但函数更灵活。它们可以接受多个参数（即使我们现在还不需要）。

另一方面，get/set 语法更短，所以最终没有严格的规定，而是由你自己来决定。
::: 
::: tip 受保护的字段是可以被继承的
如果我们继承 class MegaMachine extends CoffeeMachine，那么什么都无法阻止我们从新的类中的方法访问 this._waterAmount 或 this._power。

所以受保护的字段是自然可被继承的。与我们接下来将看到的私有字段不同。
::: 

### 私有的 “#waterLimit”
这儿有一个马上就会被加到规范中的已完成的 JavaScript 提案，它为私有属性和方法提供语言级支持。

私有属性和方法应该以 # 开头。它们只在类的内部可被访问。

例如，这儿有一个私有属性 #waterLimit 和检查水量的私有方法 #fixWaterAmount：

``` javascript
class CoffeeMachine {
  #waterLimit = 200;

  #fixWaterAmount(value) {
    if (value < 0) return 0;
    if (value > this.#waterLimit) return this.#waterLimit;
  }

  setWaterAmount(value) {
    this.#waterLimit = this.#fixWaterAmount(value);
  }
}

let coffeeMachine = new CoffeeMachine();

// 不能从类的外部访问类的私有属性和方法
coffeeMachine.#fixWaterAmount(123); // Error
coffeeMachine.#waterLimit = 1000; // Error
```
在语言级别，# 是该字段为私有的特殊标志。我们无法从外部或从继承的类中访问它。

私有字段与公共字段不会发生冲突。我们可以同时拥有私有的 #waterAmount 和公共的 waterAmount 字段。

例如，让我们使 waterAmount 成为 #waterAmount 的一个访问器：

``` javascript
class CoffeeMachine {

  #waterAmount = 0;

  get waterAmount() {
    return this.#waterAmount;
  }

  set waterAmount(value) {
    if (value < 0) value = 0;
    this.#waterAmount = value;
  }
}

let machine = new CoffeeMachine();

machine.waterAmount = 100;
alert(machine.#waterAmount); // Error
```
与受保护的字段不同，私有字段由语言本身强制执行。这是好事儿。

但是如果我们继承自 CoffeeMachine，那么我们将无法直接访问 #waterAmount。我们需要依靠 #waterAmount getter/setter：

``` javascript
class MegaCoffeeMachine extends CoffeeMachine {
  method() {
    alert( this.#waterAmount ); // Error: can only access from CoffeeMachine
  }
}
```

在许多情况下，这种限制太严重了。如果我们扩展 CoffeeMachine，则可能有正当理由访问其内部。这就是为什么大多数时候都会使用受保护字段，即使它们不受语言语法的支持。

::: warning 私有字段不能通过 `this[name]` 访问
私有字段很特别。

正如我们所知道的，通常我们可以使用 `this[name]` 访问字段：
``` javascript
class User {
  ...
  sayHi() {
    let fieldName = "name";
    alert(`Hello, ${this[fieldName]}`);
  }
}
```
对于私有字段来说，这是不可能的：`this['#name']` 不起作用。这是确保私有性的语法限制。
:::

### 总而言之
就面向对象编程（OOP）而言，内部接口与外部接口的划分被称为 封装。

它具有以下优点：

#### 保护用户，使他们不会误伤自己
想象一下，有一群开发人员在使用一个咖啡机。这个咖啡机是由“最好的咖啡机”公司制造的，工作正常，但是保护罩被拿掉了。因此内部接口暴露了出来。

所有的开发人员都是文明的 —— 他们按照预期使用咖啡机。但其中的一个人，约翰，他认为自己是最聪明的人，并对咖啡机的内部做了一些调整。然而，咖啡机两天后就坏了。

这肯定不是约翰的错，而是那个取下保护罩并让约翰进行操作的人的错。

编程也一样。如果一个 class 的使用者想要改变那些本不打算被从外部更改的东西 —— 后果是不可预测的。

#### 可支持性
编程的情况比现实生活中的咖啡机要复杂得多，因为我们不只是购买一次。我们还需要不断开发和改进代码。

如果我们严格界定内部接口，那么这个 class 的开发人员可以自由地更改其内部属性和方法，甚至无需通知用户。

如果你是这样的 class 的开发者，那么你会很高兴知道可以安全地重命名私有变量，可以更改甚至删除其参数，因为没有外部代码依赖于它们。

对于用户来说，当新版本问世时，应用的内部可能被进行了全面检修，但如果外部接口相同，则仍然很容易升级。

#### 隐藏复杂性
人们喜欢使用简单的东西。至少从外部来看是这样。内部的东西则是另外一回事了。

程序员也不例外。

当实施细节被隐藏，并提供了简单且有据可查的外部接口时，总是很方便的。

为了隐藏内部接口，我们使用受保护的或私有的属性：

- 受保护的字段以 _ 开头。这是一个众所周知的约定，不是在语言级别强制执行的。程序员应该只通过它的类和从它继承的类中访问以 _ 开头的字段。
- 私有字段以 # 开头。JavaScript 确保我们只能从类的内部访问它们。

目前，各个浏览器对私有字段的支持不是很好，但可以用 polyfill 解决。
## 扩展内建类
内建的类，例如 Array，Map 等也都是可以扩展的（extendable）。

例如，这里有一个继承自原生 Array 的类 PowerArray：
``` javascript
// 给 PowerArray 新增了一个方法（可以增加更多）
class PowerArray extends Array {
  isEmpty() {
    return this.length === 0;
  }
}

let arr = new PowerArray(1, 2, 5, 10, 50);
alert(arr.isEmpty()); // false

let filteredArr = arr.filter(item => item >= 10);
alert(filteredArr); // 10, 50
alert(filteredArr.isEmpty()); // false
```

请注意一个非常有趣的事儿。内建的方法例如 filter，map 等 —— 返回的正是子类 PowerArray 的新对象。它们内部使用了对象的 constructor 属性来实现这一功能。

在上面的例子中，

``` javascript
arr.constructor === PowerArray
```

当 arr.filter() 被调用时，它的内部使用的是 arr.constructor 来创建新的结果数组，而不是使用原生的 Array。这真的很酷，因为我们可以在结果数组上继续使用 PowerArray 的方法。

甚至，我们可以定制这种行为。

我们可以给这个类添加一个特殊的静态 getter Symbol.species，它会返回 JavaScript 在内部用来在 map 和 filter 等方法中创建新实体的 constructor。

如果我们希望像 map 或 filter 这样的内建方法返回常规数组，我们可以在 Symbol.species 中返回 Array，就像这样：

``` javascript
class PowerArray extends Array {
  isEmpty() {
    return this.length === 0;
  }

  // 内建方法将使用这个作为 constructor
  static get [Symbol.species]() {
    return Array;
  }
}

let arr = new PowerArray(1, 2, 5, 10, 50);
alert(arr.isEmpty()); // false

// filter 使用 arr.constructor[Symbol.species] 作为 constructor 创建新数组
let filteredArr = arr.filter(item => item >= 10);

// filteredArr 不是 PowerArray，而是 Array
alert(filteredArr.isEmpty()); // Error: filteredArr.isEmpty is not a function
```
正如你所看到的，现在 .filter 返回 Array。所以扩展的功能不再传递，其他集合，例如 Map 和 Set 的工作方式类似。它们也使用 Symbol.species。

### 内建类没有静态方法继承

内建对象有它们自己的静态方法，例如 Object.keys，Array.isArray 等。

如我们所知道的，原生的类互相扩展。例如，Array 扩展自 Object。

通常，当一个类扩展另一个类时，静态方法和非静态方法都会被继承。这已经在 静态属性和静态方法 中详细地解释过了。

但内建类却是一个例外。它们相互间不继承静态方法。

例如，Array 和 Date 都继承自 Object，所以它们的实例都有来自 Object.prototype 的方法。但 Array.[[Prototype]] 并不指向 Object，所以它们没有例如 Array.keys()（或 Date.keys()）这些静态方法。

这里有一张 Date 和 Object 的结构关系图：

![object-date-inheritance](https://zh.javascript.info/article/extend-natives/object-date-inheritance.svg)

正如你所看到的，Date 和 Object 之间没有连结。它们是独立的，只有 Date.prototype 继承自 Object.prototype，仅此而已。

与我们所了解的通过 extends 获得的继承相比，这是内建对象之间继承的一个重要区别。

## 类检查："instanceof"
instanceof 操作符用于检查一个对象是否属于某个特定的 class。同时，它还考虑了继承。

在许多情况下，可能都需要进行此类检查。例如，它可以被用来构建一个 多态性（polymorphic） 的函数，该函数根据参数的类型对参数进行不同的处理。

### instanceof 操作符
语法：
``` javascript
obj instanceof Class
```

如果 obj 隶属于 Class 类（或 Class 类的衍生类），则返回 true。

例如：
``` javascript
class Rabbit {}
let rabbit = new Rabbit();

// rabbit 是 Rabbit class 的对象吗？
alert( rabbit instanceof Rabbit ); // true
```
它还可以与构造函数一起使用：
``` javascript
// 这里是构造函数，而不是 class
function Rabbit() {}

alert( new Rabbit() instanceof Rabbit ); // true
```
……与诸如 Array 之类的内建 class 一起使用：
``` javascript
let arr = [1, 2, 3];
alert( arr instanceof Array ); // true
alert( arr instanceof Object ); // true
```
有一点需要留意，arr 同时还隶属于 Object 类。因为从原型上来讲，Array 是继承自 Object 的。

通常，instanceof 在检查中会将原型链考虑在内。此外，我们还可以在静态方法 Symbol.hasInstance 中设置自定义逻辑。

obj instanceof Class 算法的执行过程大致如下：

1. 如果这儿有静态方法 Symbol.hasInstance，那就直接调用这个方法：

例如：

``` javascript
// 设置 instanceOf 检查
// 并假设具有 canEat 属性的都是 animal
class Animal {
  static [Symbol.hasInstance](obj) {
    if (obj.canEat) return true;
  }
}

let obj = { canEat: true };

alert(obj instanceof Animal); // true：Animal[Symbol.hasInstance](obj) 被调用
```
2. 大多数 class 没有 Symbol.hasInstance。在这种情况下，标准的逻辑是：使用 obj instanceOf Class 检查 Class.prototype 是否等于 obj 的原型链中的原型之一。

换句话说就是，一个接一个地比较：

``` javascript
obj.__proto__ === Class.prototype?
obj.__proto__.__proto__ === Class.prototype?
obj.__proto__.__proto__.__proto__ === Class.prototype?
...
// 如果任意一个的答案为 true，则返回 true
// 否则，如果我们已经检查到了原型链的尾端，则返回 false
```
在上面那个例子中，`rabbit.__proto__ === Rabbit.prototype`，所以立即就给出了结果。

而在继承的例子中，匹配将在第二步进行：

``` javascript
class Animal {}
class Rabbit extends Animal {}

let rabbit = new Rabbit();
alert(rabbit instanceof Animal); // true

// rabbit.__proto__ === Animal.prototype（无匹配）
// rabbit.__proto__.__proto__ === Animal.prototype（匹配！）
```

这里还要提到一个方法 [objA.isPrototypeOf(objB)](https://developer.mozilla.org/zh/docs/Web/JavaScript/Reference/Global_Objects/object/isPrototypeOf)，如果 objA 处在 objB 的原型链中，则返回 true。所以，可以将 obj instanceof Class 检查改为 Class.prototype.isPrototypeOf(obj)。

这很有趣，但是 Class 的 constructor 自身是不参与检查的！检查过程只和原型链以及 Class.prototype 有关。

创建对象后，如果更改 prototype 属性，可能会导致有趣的结果。

就像这样：

``` javascript
function Rabbit() {}
let rabbit = new Rabbit();

// 修改了 prototype
Rabbit.prototype = {};

// ...再也不是 rabbit 了！
alert( rabbit instanceof Rabbit ); // false
```
### 使用 Object.prototype.toString 方法来揭示类型
大家都知道，一个普通对象被转化为字符串时为 [object Object]：

``` javascript
let obj = {};

alert(obj); // [object Object]
alert(obj.toString()); // 同上
```
这是通过 toString 方法实现的。但是这儿有一个隐藏的功能，该功能可以使 toString 实际上比这更强大。我们可以将其作为 typeof 的增强版或者 instanceof 的替代方法来使用。

按照 规范 所讲，内建的 toString 方法可以被从对象中提取出来，并在任何其他值的上下文中执行。其结果取决于该值。

- 对于 number 类型，结果是 [object Number]
- 对于 boolean 类型，结果是 [object Boolean]
- 对于 null：[object Null]
- 对于 undefined：[object Undefined]
- 对于数组：[object Array]
- ……等（可自定义）

让我们演示一下：

``` javascript
// 方便起见，将 toString 方法复制到一个变量中
let objectToString = Object.prototype.toString;

// 它是什么类型的？
let arr = [];

alert( objectToString.call(arr) ); // [object Array]
```
这里我们用到了在 装饰器模式和转发，call/apply 一章中讲过的 call 方法来在上下文 this=arr 中执行函数 objectToString。

在内部，toString 的算法会检查 this，并返回相应的结果。再举几个例子：

``` javascript
let s = Object.prototype.toString;

alert( s.call(123) ); // [object Number]
alert( s.call(null) ); // [object Null]
alert( s.call(alert) ); // [object Function]
```
### Symbol.toStringTag

可以使用特殊的对象属性 Symbol.toStringTag 自定义对象的 toString 方法的行为。

例如：
``` javascript
let user = {
  [Symbol.toStringTag]: "User"
};

alert( {}.toString.call(user) ); // [object User]
```

对于大多数特定于环境的对象，都有一个这样的属性。下面是一些特定于浏览器的示例：

``` javascript
// 特定于环境的对象和类的 toStringTag：
alert( window[Symbol.toStringTag]); // Window
alert( XMLHttpRequest.prototype[Symbol.toStringTag] ); // XMLHttpRequest

alert( {}.toString.call(window) ); // [object Window]
alert( {}.toString.call(new XMLHttpRequest()) ); // [object XMLHttpRequest]
```
正如我们所看到的，输出结果恰好是 Symbol.toStringTag（如果存在），只不过被包裹进了 [object ...] 里。

这样一来，我们手头上就有了个“磕了药似的 typeof”，不仅能检查原始数据类型，而且适用于内建对象，更可贵的是还支持自定义。

所以，如果我们想要获取内建对象的类型，并希望把该信息以字符串的形式返回，而不只是检查类型的话，我们可以用 {}.toString.call 替代 instanceof。

### 所以...关于类型检查：
- typeof	原始数据类型	string
- {}.toString	原始数据类型，内建对象，包含 Symbol.toStringTag 属性的对象	string
- instanceof	对象	true/false

正如我们所看到的，从技术上讲，{}.toString 是一种“更高级的” typeof。

当我们使用类的层次结构（hierarchy），并想要对该类进行检查，同时还要考虑继承时，这种场景下 instanceof 操作符确实很出色。

## Mixin 模式
在 JavaScript 中，我们只能继承单个对象。每个对象只能有一个 [[Prototype]]。并且每个类只可以扩展另外一个类。

但是有些时候这种设定（译注：单继承）会让人感到受限制。例如，我有一个 StreetSweeper 类和一个 Bicycle 类，现在想要一个它们的混合体：StreetSweepingBicycle 类。

或者，我们有一个 User 类和一个 EventEmitter 类来实现事件生成（event generation），并且我们想将 EventEmitter 的功能添加到 User 中，以便我们的用户可以触发事件（emit event）。

有一个概念可以帮助我们，叫做 “mixin”。

根据维基百科的定义，mixin 是一个类，其方法可被其他类使用，而无需继承。

换句话说，mixin 提供了实现特定行为的方法，但是我们不单独使用它，而是使用它来将这些行为添加到其他类中。

### 一个 Mixin 实例

在 JavaScript 中构造一个 mixin 最简单的方式就是构造一个拥有实用方法的对象，以便我们可以轻松地将这些实用的方法合并到任何类的原型中。

例如，这个名为 sayHiMixin 的 mixin 用于给 User 添加一些“语言功能”：
``` javascript
// mixin
let sayHiMixin = {
  sayHi() {
    alert(`Hello ${this.name}`);
  },
  sayBye() {
    alert(`Bye ${this.name}`);
  }
};

// 用法：
class User {
  constructor(name) {
    this.name = name;
  }
}

// 拷贝方法
Object.assign(User.prototype, sayHiMixin);

// 现在 User 可以打招呼了
new User("Dude").sayHi(); // Hello Dude!
```
这里没有继承，只有一个简单的方法拷贝。因此，我们可以让 User 在继承另一个类的同时，使用 mixin 来 “mix-in”（混合）其它方法，就像这样：

``` javascript
class User extends Person {
  // ...
}

Object.assign(User.prototype, sayHiMixin);
```
Mixin 可以在自己内部使用继承。

例如，这里的 sayHiMixin 继承自 sayMixin：

``` javascript
let sayMixin = {
  say(phrase) {
    alert(phrase);
  }
};

let sayHiMixin = {
  __proto__: sayMixin, // (或者，我们可以在这儿使用 Object.setPrototypeOf 来设置原型)

  sayHi() {
    // 调用父类方法
    super.say(`Hello ${this.name}`); // (*)
  },
  sayBye() {
    super.say(`Bye ${this.name}`); // (*)
  }
};

class User {
  constructor(name) {
    this.name = name;
  }
}

// 拷贝方法
Object.assign(User.prototype, sayHiMixin);

// 现在 User 可以打招呼了
new User("Dude").sayHi(); // Hello Dude!
```
请注意，在 sayHiMixin 内部对父类方法 super.say() 的调用（在标有 (*) 的行）会在 mixin 的原型中查找方法，而不是在 class 中查找。

![mixin-inheritance](https://zh.javascript.info/article/mixins/mixin-inheritance.svg)

这是因为方法 sayHi 和 sayBye 最初是在 sayHiMixin 中创建的。因此，即使复制了它们，但是它们的 [[HomeObject]] 内部属性仍引用的是 sayHiMixin，如上图所示。

当 super 在 [[HomeObject]].[[Prototype]] 中寻找父方法时，意味着它搜索的是 sayHiMixin.[[Prototype]]，而不是 User.[[Prototype]]。

### EventMixin
现在让我们为实际运用构造一个 mixin。

例如，许多浏览器对象的一个重要功能是它们可以生成事件。事件是向任何有需要的人“广播信息”的好方法。因此，让我们构造一个 mixin，使我们能够轻松地将与事件相关的函数添加到任意 class/object 中。

- Mixin 将提供 .trigger(name, [...data]) 方法，以在发生重要的事情时“生成一个事件”。name 参数（arguments）是事件的名称，[...data] 是可选的带有事件数据的其他参数（arguments）。
- 此外还有 .on(name, handler) 方法，它为具有给定名称的事件添加了 handler 函数作为监听器（listener）。当具有给定 name 的事件触发时将调用该方法，并从 .trigger 调用中获取参数（arguments）。
- ……还有 .off(name, handler) 方法，它会删除 handler 监听器（listener）。

添加完 mixin 后，对象 user 将能够在访客登录时生成事件 "login"。另一个对象，例如 calendar 可能希望监听此类事件以便为登录的人加载日历。

或者，当一个菜单项被选中时，menu 可以生成 "select" 事件，其他对象可以分配处理程序以对该事件作出反应。诸如此类。

下面是代码：

``` javascript
let eventMixin = {
  /**
   * 订阅事件，用法：
   *  menu.on('select', function(item) { ... }
  */
  on(eventName, handler) {
    if (!this._eventHandlers) this._eventHandlers = {};
    if (!this._eventHandlers[eventName]) {
      this._eventHandlers[eventName] = [];
    }
    this._eventHandlers[eventName].push(handler);
  },

  /**
   * 取消订阅，用法：
   *  menu.off('select', handler)
   */
  off(eventName, handler) {
    let handlers = this._eventHandlers?.[eventName];
    if (!handlers) return;
    for (let i = 0; i < handlers.length; i++) {
      if (handlers[i] === handler) {
        handlers.splice(i--, 1);
      }
    }
  },

  /**
   * 生成具有给定名称和数据的事件
   *  this.trigger('select', data1, data2);
   */
  trigger(eventName, ...args) {
    if (!this._eventHandlers?.[eventName]) {
      return; // 该事件名称没有对应的事件处理程序（handler）
    }

    // 调用事件处理程序（handler）
    this._eventHandlers[eventName].forEach(handler => handler.apply(this, args));
  }
};
```

1. .on(eventName, handler) — 指定函数 handler 以在具有对应名称的事件发生时运行。从技术上讲，这儿有一个用于存储每个事件名称对应的处理程序（handler）的 _eventHandlers 属性，在这儿该属性就会将刚刚指定的这个 handler 添加到列表中。
2. .off(eventName, handler) — 从处理程序列表中删除指定的函数。
3. .trigger(eventName, ...args) — 生成事件：所有 _eventHandlers[eventName] 中的事件处理程序（handler）都被调用，并且 ...args 会被作为参数传递给它们。

用法：

``` javascript
// 创建一个 class
class Menu {
  choose(value) {
    this.trigger("select", value);
  }
}
// 添加带有事件相关方法的 mixin
Object.assign(Menu.prototype, eventMixin);

let menu = new Menu();

// 添加一个事件处理程序（handler），在被选择时被调用：
menu.on("select", value => alert(`Value selected: ${value}`));

// 触发事件 => 运行上述的事件处理程序（handler）并显示：
// 被选中的值：123
menu.choose("123");
```

现在，如果我们希望任何代码对菜单选择作出反应，我们可以使用 menu.on(...) 进行监听。

使用 eventMixin 可以轻松地将此类行为添加到我们想要的多个类中，并且不会影响继承链。



















































































