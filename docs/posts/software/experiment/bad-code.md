---
title: 消除坏味道
date: '2025-04-05'
tags:
- software
---

# 消除坏味道

## **代码重构**

### **1 文件归类**

采用原生前端三件套写 Web 应用的时候一般要将 HTML、CSS、JavaScript 分别归为一个文件夹，对于图片、视频等资源也需要进行归类。

源代码将所有文件均放到同一文件夹下，导致代码文件夹显得非常臃肿。

新建文件夹 HTML、CSS、JS、img，将文件归类即可。

### **2 命名部分**

HTML 和 CSS 的 class 类名通常采用 kebab-case 命名法，JavaScript 有小驼峰（camelCase）和大驼峰（PascalCase）之分。变量和函数名一般用小驼峰，构造函数和类名用大驼峰。

对于文件命名，HTML 和 CSS 一般也采用 kebab-case 命名法，对于 JavaScript 文件，一般类文件采用大驼峰命名法，其他文件采用小驼峰命名法。

另外，对于入口文件，我们一般命名为：`index.html / styles.css / index.js`

#### **2.1 对于文件名：**

源代码命名举例如：

```
Atodo.html;
cbody.css;
dtodo.js;
TODO1.jpg;
```

可以更改为：

```
index.html;
styles.css;
index.js;
bg.jpg;
```

#### **2.2 对于文件内变量命名：**

源代码命名示例：

```
<div class="bodysearch">
  <i class="tubiao1" id="checkbutton"
    ><ion-icon name="checkmark-circle-sharp"></ion-icon
  ></i>
  <input type="text" placeholder="What Needs To Be Done?" id="search" />
</div>
```

```
.pchange {
  text-decoration: line-through;
}
```

```
var deletebtn = newPage.querySelector(".deletebtn");
```

分别更改为：

```
<div class="search-box">
  <i class="icon-1" id="checkButton"
    ><ion-icon name="checkmark-circle-sharp"></ion-icon
  ></i>
  <input type="text" placeholder="What Needs To Be Done?" id="search" />
</div>
```

```
/* 注意这里需要将对应类名进行更换 */
.para-change {
  text-decoration: line-through;
}
```

```
// 此外，尽量不要采用简写
var deleteButton = newPage.querySelector(".deletebtn");
```

### **3 过长函数**

JavaScript 中过长的函数也就意味着没有封装、代码紧耦合，导致逻辑复杂、可读性差、变量难以管理。脚本的编码原则之一就是函数各司其职。

这里节选出之前写的脚本中的一段过长函数来进行修改：

```
// 监听搜索栏按键事件
input.addEventListener("keydown", function (event) {
  if (event.keyCode === 13 && input.value.trim() !== "") {
    var inputValue = input.value;
    localStorage.setItem("todo_" + num, inputValue);
    var newPage = document.createElement("div");
    newPage.classList.add("page");
    newPage.innerHTML =
      '<input type="checkbox" class="checkbox"><p class="p">' +
      inputValue +
      '</p><i class="deletebtn"><ion-icon name="close-circle-outline"></ion-icon></i>';

    bodyPage.appendChild(newPage);

    input.value = "";

    // 更新计数器
    num++;
    updateNumCounter();

    // 取消footer部分的隐藏
    if (num != 0) {
      footer.style.display = "flex";
    }

    // 监听checkbox状态变化
    var checkbox = newPage.querySelector(".checkbox");
    checkbox.addEventListener("change", function (event) {
      var page = event.target.parentNode;
      if (checkbox.checked) {
        page.classList.add("changed");
        num--;
      } else {
        page.classList.remove("changed");
        num++;
      }
      updateNumCounter();
    });

    // 监听删除按钮点击事件
    var deletebtn = newPage.querySelector(".deletebtn");
    deletebtn.addEventListener("click", function (event) {
      var page = event.target.parentNode.parentNode;
      page.remove();
      var index = Array.prototype.indexOf.call(bodyPage.children, page);
      localStorage.removeItem("todo_" + index);

      if (!checkbox.checked) {
        num--;
      }
      updateNumCounter();
    });
  }
});
```

修改后：

```
function addNum(num) {
  num += 1;
}

function updateNumCounter() {
  let numCounter = document.getElementById("numCounter");
  numCounter.innerHTML = "<p>" + num + " items left</p>";
}

function footerController(num) {
  if (num === 0) {
    footer.style.display = "none";
  } else {
    footer.style.display = "flex";
  }
}

function checkboxWatcher(num) {
  let checkbox = newPage.querySelector(".checkbox");

  checkbox.addEventListener("change", function (event) {
    let page = event.target.parentNode;
    if (checkbox.checked) {
      page.classList.add("changed");
      num--;
    } else {
      page.classList.remove("changed");
      num++;
    }

    updateNumCounter();
  });
}

function deleteButtonWatcher(num) {
  let deletebtn = newPage.querySelector(".deletebtn");
  let checkbox = newPage.querySelector(".checkbox");

  deletebtn.addEventListener("click", function (event) {
    var page = event.target.parentNode.parentNode;
    page.remove();
    var index = Array.prototype.indexOf.call(bodyPage.children, page);
    localStorage.removeItem("todo_" + index);

    if (!checkbox.checked) {
      num--;
    }

    updateNumCounter();
  });
}

function inputContentSetter() {
  var inputValue = input.value;
  var newPage = document.createElement("div");

  localStorage.setItem("todo_" + num, inputValue);
  newPage.classList.add("page");
  newPage.innerHTML =
    '<input type="checkbox" class="checkbox"><p class="p">' +
    inputValue +
    '</p><i class="deletebtn"><ion-icon name="close-circle-outline"></ion-icon></i>';

  bodyPage.appendChild(newPage);

  input.value = "";
}

let shouldProcess = (event) =>
  event.key === "Enter" && input.value.trim() !== "";
```

上面我们将源代码函数分别封装，接下来组合为：

```
input.addEventListener("keydown", function (event) {
  if (shouldProcess(event)) {
    inputContentSetter();
    addNum(num);
    updateNumCounter();
    footerController(num);
    checkboxWatcher(num);
    deleteButtonWatcher(num);
  } else {
    return;
  }
});
```

这里其实可以进行更细粒度的封装，不过之前的代码实在太臃肿，很多基础函数都不具备，我们暂且将代码优化为上面这样。

### **4 重复代码**

重复代码容易在 CSS 里出现，例如源代码中控制 body 样式的文件中：

```
.b1 {
  background-color: rgb(127, 127, 127);
  border-radius: 10px;
  border-color: rgb(10, 236, 210);
  font-size: 15px;
}
.b2 {
  background-color: rgb(127, 127, 127);
  border-radius: 10px;
  border-color: rgb(10, 236, 210);
  font-size: 15px;
}
.b3 {
  background-color: rgb(127, 127, 127);
  border-radius: 10px;
  border-color: rgb(10, 236, 210);
  font-size: 15px;
}
.b4 {
  background-color: rgb(127, 127, 127);
  border-radius: 10px;
  border-color: rgb(10, 236, 210);
  font-size: 15px;
}

.b1 p {
  font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif;
}
.b2 p {
  font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif;
}
.b3 p {
  font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif;
}
.b4 p {
  font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif;
}
```

我们有两种修改方法：

- 修改 HTML 类名
- 合并 CSS 代码

这里我们采用后面一种方法进行修改：

```
.b1,
.b2,
.b3,
.b4 {
  background-color: rgb(127, 127, 127);
  border-radius: 10px;
  border-color: rgb(10, 236, 210);
  font-size: 15px;
}

.b1 p,
.b2 p,
.b3 p,
.b4 p {
  font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif;
}
```

除此之外，设置字体时其实不需要设置这么多，因为全都是自带字体，没有自己注册的字体，只需要考虑浏览器对不同的字体兼容性就行。

### **5 脚本分装**

在源代码中我把所有 JavaScript 代码都写在同一个 js 文件中，这其实是很不好的。

我们采用了 localStorage 来实现待办事项的本地存储，同时，浏览器加载 JavaScript 脚本是根据 HTML 解析顺序进行，故而可以把渲染待办事项的脚本和其它脚本分开。

### **6 修改注释**

所有 JavaScript 代码都写在同一个 js 文件中带来的另外一个问题是注释繁杂，同时有很多无意义的代码分割线如：

```
// ***************************************************************************************************************************

// ***************************************************************************************************************************
```

其次，还存在有过长的注释如：

```
// 从字符串key的第5个字符开始截取到末尾，并将截取的部分转换为整数
// parseInt(key.substring(5)) 将键名中的数字部分提取出来，并转换为整数类型，赋值给 index 变量。这个数字部分代表了待办事项的索引
```

解决方案：

- 删掉代码分隔符
- 采用 @param 来注释变量，缩短注释长度

### **7 JavaScript特性处理**

由于JavaScript的Var关键字特性，它会导致变量的作用域提升，我们应该去采用最新的let和const来声明变量。

### **8 状态管理**

前面提到了JavaScript的Var关键字特性会导致变量的作用域提升，故而在这个脚本中有很多全局变量，这可以通过let和const来进行解决。

而对于需要在多个函数中使用的全局变量（如num，代表待办事项的数量），我们可以在最外层定义一个对象global来存储这些状态变量：

```
const global = {
    num : 0,
    ...
}
```

除此之外也可以通过引入外部状态管理库来实现这一目标。

### **9 垃圾处理**

代码文件夹有太多未使用到的资源，可以把这些图片给删掉，也可以写.gitignore禁止上传这些资源到Github
