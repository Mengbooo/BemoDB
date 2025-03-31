# 对象属性配置
在本节中，我们将回到对象，并更深入地研究其属性。
## 属性标志和属性描述符
我们知道，对象可以存储属性。

到目前为止，属性对我们来说只是一个简单的“键值”对。但对象属性实际上是更灵活且更强大的东西。

在本章中，我们将学习其他配置选项，在下一章中，我们将学习如何将它们无形地转换为 getter/setter 函数。

### 属性标志
对象属性（properties），除 value 外，还有三个特殊的特性（attributes），也就是所谓的“标志”：

- writable — 如果为 true，则值可以被修改，否则它是只可读的。
- enumerable — 如果为 true，则会被在循环中列出，否则不会被列出。
- configurable — 如果为 true，则此属性可以被删除，这些特性也可以被修改，否则不可以。

我们到现在还没看到它们，是因为它们通常不会出现。当我们用“常用的方式”创建一个属性时，它们都为 true。但我们也可以随时更改它们。

首先，让我们来看看如何获得这些标志。

[Object.getOwnPropertyDescriptor](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor) 方法允许查询有关属性的 完整 信息。

语法为：

``` javascript
let descriptor = Object.getOwnPropertyDescriptor(obj, propertyName);
```
- `obj` 需要从中获取信息的对象
- `propertyName` 属性的名称

返回值是一个所谓的“属性描述符”对象：它包含值和所有的标志。

例如：
``` javascript
let user = {
  name: "John"
};

let descriptor = Object.getOwnPropertyDescriptor(user, 'name');

alert( JSON.stringify(descriptor, null, 2 ) );
/* 属性描述符：
{
  "value": "John",
  "writable": true,
  "enumerable": true,
  "configurable": true
}
*/
```

为了修改标志，我们可以使用 [Object.defineProperty](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)

语法是：

``` javascript
Object.defineProperty(obj, propertyName, descriptor)
```
- `obj，propertyName` 要应用描述符的对象及其属性
- `descriptor` 要应用的属性描述符对象

如果该属性存在，defineProperty 会更新其标志。否则，它会使用给定的值和标志创建属性；在这种情况下，如果没有提供标志，则会假定它是 false。

例如，这里创建了一个属性 name，该属性的所有标志都为 false：
``` javascript
let user = {};

Object.defineProperty(user, "name", {
  value: "John"
});

let descriptor = Object.getOwnPropertyDescriptor(user, 'name');

alert( JSON.stringify(descriptor, null, 2 ) );
/*
{
  "value": "John",
  "writable": false,
  "enumerable": false,
  "configurable": false
}
 */
```
将它与上面的“以常用方式创建的” user.name 进行比较：现在所有标志都为 false。如果这不是我们想要的，那么我们最好在 descriptor 中将它们设置为 true。

现在让我们通过示例来看看标志的影响。
### 只读

我们通过更改 writable 标志来把 user.name 设置为只读（user.name 不能被重新赋值）：

``` javascript
let user = {
  name: "John"
};

Object.defineProperty(user, "name", {
  writable: false
});

user.name = "Pete"; // Error: Cannot assign to read only property 'name'
```
现在没有人可以改变我们 user 的 name，除非它们应用自己的 defineProperty 来覆盖我们的 user 的 name。
::: tip 只在严格模式下会出现 Errors
在非严格模式下，在对不可写的属性等进行写入操作时，不会出现错误。但是操作仍然不会成功。在非严格模式下，违反标志的行为（flag-violating action）只会被默默地忽略掉。
::: 

### 不可枚举
现在让我们向 user 添加一个自定义的 toString。

通常，对象中内建的 toString 是不可枚举的，它不会显示在 for..in 中。但是如果我们添加我们自己的 toString，那么默认情况下它将显示在 for..in 中，如下所示：

``` javascript
let user = {
  name: "John",
  toString() {
    return this.name;
  }
};

// 默认情况下，我们的两个属性都会被列出：
for (let key in user) alert(key); // name, toString
```
如果我们不喜欢它，那么我们可以设置 enumerable:false。之后它就不会出现在 for..in 循环中了，就像内建的 toString 一样：
``` javascript
let user = {
  name: "John",
  toString() {
    return this.name;
  }
};

Object.defineProperty(user, "toString", {
  enumerable: false
});

// 现在我们的 toString 消失了：
for (let key in user) alert(key); // name
```

### 不可配置

不可配置标志（configurable:false）有时会预设在内建对象和属性中。

不可配置的属性不能被删除，它的特性（attribute）不能被修改。

例如，Math.PI 是只读的、不可枚举和不可配置的：

``` javascript
let descriptor = Object.getOwnPropertyDescriptor(Math, 'PI');

alert( JSON.stringify(descriptor, null, 2 ) );
/*
{
  "value": 3.141592653589793,
  "writable": false,
  "enumerable": false,
  "configurable": false
}
*/
```

因此，开发人员无法修改 Math.PI 的值或覆盖它。

``` javascript
Math.PI = 3; // Error，因为其 writable: false

// 删除 Math.PI 也不会起作用
```
我们对 Math.PI 什么也做不了。

使属性变成不可配置是一条单行道。我们无法通过 defineProperty 再把它改回来。

请注意：configurable: false 防止更改和删除属性标志，但是允许更改对象的值。

这里的 user.name 是不可配置的，但是我们仍然可以更改它，因为它是可写的：

``` javascript
let user = {
  name: "John"
};

Object.defineProperty(user, "name", {
  configurable: false
});

user.name = "Pete"; // 正常工作
delete user.name; // Error
```
现在，我们将 user.name 设置为一个“永不可改”的常量，就像内建的 Math.PI：

``` javascript
let user = {
  name: "John"
};

Object.defineProperty(user, "name", {
  writable: false,
  configurable: false
});

// 不能修改 user.name 或它的标志
// 下面的所有操作都不起作用：
user.name = "Pete";
delete user.name;
Object.defineProperty(user, "name", { value: "Pete" });
```
::: tip 唯一可行的特性更改：writable true → false
对于更改标志，有一个小例外。

对于不可配置的属性，我们可以将 writable: true 更改为 false，从而防止其值被修改（以添加另一层保护）。但无法反向行之。
::: 

### Object.defineProperties

有一个方法 [Object.defineProperties(obj, descriptors)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperties)，允许一次定义多个属性。

语法是：

``` javascript
Object.defineProperties(obj, {
  prop1: descriptor1,
  prop2: descriptor2
  // ...
});
```

例如：

``` javascript
Object.defineProperties(user, {
  name: { value: "John", writable: false },
  surname: { value: "Smith", writable: false },
  // ...
});
```
### Object.getOwnPropertyDescriptors
要一次获取所有属性描述符，我们可以使用 [Object.getOwnPropertyDescriptors(obj)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptors) 方法。

它与 Object.defineProperties 一起可以用作克隆对象的“标志感知”方式：
``` javascript
let clone = Object.defineProperties({}, Object.getOwnPropertyDescriptors(obj));
```
通常，当我们克隆一个对象时，我们使用赋值的方式来复制属性，像这样：

``` javascript
for (let key in user) {
  clone[key] = user[key]
}
```

……但是，这并不能复制标志。所以如果我们想要一个“更好”的克隆，那么 Object.defineProperties 是首选。

另一个区别是 for..in 会忽略 symbol 类型的和不可枚举的属性，但是 Object.getOwnPropertyDescriptors 返回包含 symbol 类型的和不可枚举的属性在内的 所有 属性描述符。

### 设定一个全局的密封对象

属性描述符在单个属性的级别上工作。还有一些限制访问 整个 对象的方法，具体可以参见MDN的静态方法板块。

## 属性的 getter 和 setter
有两种类型的对象属性。

第一种是 **数据属性**。我们已经知道如何使用它们了。到目前为止，我们使用过的所有属性都是数据属性。

第二种类型的属性是新东西。它是 **访问器属性**（accessor property）。它们本质上是用于获取和设置值的函数，但从外部代码来看就像常规属性。

### getter 和 setter
访问器属性由 “getter” 和 “setter” 方法表示。在对象字面量中，它们用 get 和 set 表示：

``` javascript
let obj = {
  get propName() {
    // 当读取 obj.propName 时，getter 起作用
  },

  set propName(value) {
    // 当执行 obj.propName = value 操作时，setter 起作用
  }
};
```
当读取 obj.propName 时，getter 起作用，当 obj.propName 被赋值时，setter 起作用。

例如，我们有一个具有 name 和 surname 属性的对象 user：
``` javascript
let user = {
  name: "John",
  surname: "Smith"
};
```
现在我们想添加一个 fullName 属性，该属性值应该为 "John Smith"。当然，我们不想复制粘贴已有的信息，因此我们可以使用访问器来实现：
``` javascript
let user = {
  name: "John",
  surname: "Smith",

  get fullName() {
    return `${this.name} ${this.surname}`;
  }
};

alert(user.fullName); // John Smith
```
从外表看，访问器属性看起来就像一个普通属性。这就是访问器属性的设计思想。我们不以函数的方式 调用 user.fullName，我们正常 读取 它：getter 在幕后运行。

截至目前，fullName 只有一个 getter。如果我们尝试赋值操作 user.fullName=，将会出现错误：

``` javascript
let user = {
  get fullName() {
    return `...`;
  }
};

user.fullName = "Test"; // TypeError: Cannot set property fullName of #<Object> which has only a getter
```
让我们通过为 user.fullName 添加一个 setter 来修复它：

``` javascript
let user = {
  name: "John",
  surname: "Smith",

  get fullName() {
    return `${this.name} ${this.surname}`;
  },

  set fullName(value) {
    [this.name, this.surname] = value.split(" ");
  }
};

// set fullName 将以给定值执行
user.fullName = "Alice Cooper";

alert(user.name); // Alice
alert(user.surname); // Cooper
```
现在，我们就有一个“虚拟”属性。它是可读且可写的。

### 访问器描述符
访问器属性的描述符与数据属性的不同。

对于访问器属性，没有 value 和 writable，但是有 get 和 set 函数。

所以访问器描述符可能有：

- get —— 一个没有参数的函数，在读取属性时工作，
- set —— 带有一个参数的函数，当属性被设置时调用，
- enumerable —— 与数据属性的相同，
- configurable —— 与数据属性的相同。

例如，要使用 defineProperty 创建一个 fullName 访问器，我们可以使用 get 和 set 来传递描述符：

``` javascript
let user = {
  name: "John",
  surname: "Smith"
};

Object.defineProperty(user, 'fullName', {
  get() {
    return `${this.name} ${this.surname}`;
  },

  set(value) {
    [this.name, this.surname] = value.split(" ");
  }
});

alert(user.fullName); // John Smith

for(let key in user) alert(key); // name, surname
```
**请注意，一个属性要么是访问器（具有 get/set 方法），要么是数据属性（具有 value），但不能两者都是**。

如果我们试图在同一个描述符中同时提供 get 和 value，则会出现错误：
``` javascript
// Error: Invalid property descriptor.
Object.defineProperty({}, 'prop', {
  get() {
    return 1
  },

  value: 2
});
```
### 更聪明的 getter/setter
getter/setter 可以用作“真实”属性值的包装器，以便对它们进行更多的控制。

例如，如果我们想禁止太短的 user 的 name，我们可以创建一个 setter name，并将值存储在一个单独的属性 _name 中：

``` javascript
let user = {
  get name() {
    return this._name;
  },

  set name(value) {
    if (value.length < 4) {
      alert("Name is too short, need at least 4 characters");
      return;
    }
    this._name = value;
  }
};

user.name = "Pete";
alert(user.name); // Pete

user.name = ""; // Name 太短了……
```
所以，name 被存储在 _name 属性中，并通过 getter 和 setter 进行访问。

从技术上讲，外部代码可以使用 user._name 直接访问 name。但是，这儿有一个众所周知的约定，即以下划线 "_" 开头的属性是内部属性，不应该从对象外部进行访问。

### 兼容性
访问器的一大用途是，它们允许随时通过使用 getter 和 setter 替换“正常的”数据属性，来控制和调整这些属性的行为。

想象一下，我们开始使用数据属性 name 和 age 来实现 user 对象：

``` javascript
function User(name, age) {
  this.name = name;
  this.age = age;
}

let john = new User("John", 25);

alert( john.age ); // 25
```
……但迟早，情况可能会发生变化。我们可能会决定存储 birthday，而不是 age，因为它更精确，更方便：

``` javascript
function User(name, birthday) {
  this.name = name;
  this.birthday = birthday;
}

let john = new User("John", new Date(1992, 6, 1));
```
现在应该如何处理仍使用 age 属性的旧代码呢？

我们可以尝试找到所有这些地方并修改它们，但这会花费很多时间，而且如果其他很多人都在使用该代码，那么可能很难完成所有修改。而且，user 中有 age 是一件好事，对吧？

那我们就把它保留下来吧。

为 age 添加一个 getter 来解决这个问题：
``` javascript
function User(name, birthday) {
  this.name = name;
  this.birthday = birthday;

  // 年龄是根据当前日期和生日计算得出的
  Object.defineProperty(this, "age", {
    get() {
      let todayYear = new Date().getFullYear();
      return todayYear - this.birthday.getFullYear();
    }
  });
}

let john = new User("John", new Date(1992, 6, 1));

alert( john.birthday ); // birthday 是可访问的
alert( john.age );      // ……age 也是可访问的
```
现在旧的代码也可以工作，而且我们还拥有了一个不错的附加属性。


































































































































































































































































































