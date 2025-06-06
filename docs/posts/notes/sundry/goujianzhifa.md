---
title: '构建之法'
date: '2025-01-18'
tags:
- notes
---

# 构建之法

在我大一刚开学那会，学院因为搞了一次“旧书圆新梦”的活动，我去209一下拿了10来本书。其中就有一本书是《软件工程》，黑皮书版本，不过说来惭愧，因为里面的内容对于刚刚学会int main的我实在是难以下咽，所以就给它放到书架最里边积灰了，直到现在也还没拿出来。或许，”旧书圆新梦“的书可能都是传过了好几个人，经过了好几年又回到了209。**

不过，在新学期的这个活动后，在我整理被大一同学肆虐后的209时，发现了这本《构建之法-现代软件工程》没被小登拿走（很多黑皮书都被拿走了），简单的翻了一番感觉这正方形的书翻着还挺舒服，于是就拿回宿舍开始看了。

作为讲现代软件工程的一本书，它更强调“人”在开发中起到的作用，而非拘泥于代码的规范或者是项目的流程。处理好开发过程中人与人的合作协商的方法往往能带来更大的收益。

对于个人而言，规范一套个人开发的技术栈和流程是必要的：而在这套流程里，这本书更建议我们去做好单元测试/效能分析。对于本科生来讲，很多时候都处于个人开发或者是小团队开发的环境中，而大部分同学，包括我，似乎常常忽视代码的测试和效能，而总是在修改bug或者改给AI的prompt上花大量的功夫。”能跑就不要改“在一些特定环境下确实有其道理，不过在学习开发的过程中，更应当去注重代码的review，项目的迭代和单元测试，效能分析。PSP这一套方法似乎就比较适合我们在学习的时候进行一个对照。

这本书挺有意思的一个章节是”两人合作“，这个场景似乎比较少见，不过也有，例如一个前端一个后端——更有意思的是这章提出了1+1的模式，二人结对开发——一个”驾驶员“+一个”领航员“，前者负责XP开发流程，后者则进行审阅和监督。不过这种方式似乎还挺少见：感觉会出现大打出手的情况。

::: details Update 25/2/7
之前对这个概念理解不太深刻：这种结对编程的情况还蛮多的，我和Cursor也算一种结对编程吧
:::

团队中，更强调MSF模型，不过这种模型需要基于严格的规范来执行。

后面几章，则更倾向于谈论软件本身对用户的影响，以及谈论了一些程序员应当意识到的PM相关知识。作为一个系统工程，软件工程实在是非常复杂，不过它还是具有一定规范或者说是经验存在的，真正合适的且高效率的构建之法往往需要结合经验和实际来设计，而在其中的主体往往需要回到”人“的本身。