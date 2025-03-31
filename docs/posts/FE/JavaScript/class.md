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








































































































































































































































































































