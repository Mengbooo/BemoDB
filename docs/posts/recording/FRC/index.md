---
title: 转载#005 | 修复React中useEffect的竞态条件
date: '2025-07-10'
tags:
- recording
---

# 转载#005 | 修复React中useEffect的竞态条件

::: tip 文章信息
Origin url : https://maxrozen.com/race-conditions-fetching-data-react-with-useeffect

translated & reprinted by Bolaxious in 2025.7.10
:::

## 引言

假设你有一个在React中获取数据的组件。该组件接收一个id作为prop，使用id通过useEffect获取数据并显示它。

你可能注意到一些奇怪的现象：有时组件显示正确的数据，有时却显示无效或过时的数据。

很可能，你遇到了竞态条件问题。

当两个稍微不同的数据请求被发出，而应用程序根据哪个请求先完成而显示不同结果时，通常就会注意到竞态条件（在React中）。

在使用useEffect获取数据时，如果id变化足够快，我们可能会编写一个存在竞态条件的组件：

```javascript
import React, { useEffect, useState } from 'react';

export default function DataDisplayer(props) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`https://swapi.dev/api/people/${props.id}/`);
      const newData = await response.json();
      setData(newData);
    };

    fetchData();
  }, [props.id]);

  if (data) {
    return <div>{data.name}</div>;
  } else {
    return null;
  }
}
```

上面的代码片段可能不太明显地存在竞态条件问题，所以我创建了一个CodeSandbox来使其更加明显（我为每个请求添加了最长12秒的随机等待时间）。

通过点击"Fetch data!"按钮一次，你可以看到预期的行为：一个简单的组件，显示对单次点击的响应数据。

如果你快速多次点击"Fetch data!"按钮，情况就会变得更复杂。应用会发出多个请求，这些请求会随机完成。最后完成的请求的结果将是显示的内容。

更新后的DataDisplayer组件现在看起来像这样：

```javascript
export default function DataDisplayer(props) {
  const [data, setData] = useState(null);
  const [fetchedId, setFetchedId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setTimeout(async () => {
        const response = await fetch(
          `https://swapi.dev/api/people/${props.id}/`
        );
        const newData = await response.json();

        setFetchedId(props.id);
        setData(newData);
      }, Math.round(Math.random() * 12000));
    };

    fetchData();
  }, [props.id]);

  if (data) {
    return (
      <div>
        <p style={{ color: fetchedId === props.id ? 'green' : 'red' }}>
          Displaying Data for: {fetchedId}
        </p>
        <p>{data.name}</p>
      </div>
    );
  } else {
    return null;
  }
}
```

## 修复useEffect中的竞态条件

我们可以采取几种方法，都利用了useEffect的清理函数：

1. 如果我们可以接受发出多个请求，但只渲染最后一个结果，我们可以使用布尔标志。
2. 如果我们不需要支持Internet Explorer用户，我们可以使用AbortController。

### 使用布尔标志的useEffect清理函数

首先，我们的修复代码要点：

```javascript
useEffect(() => {
  let active = true;

  const fetchData = async () => {
    setTimeout(async () => {
      const response = await fetch(`https://swapi.dev/api/people/${props.id}/`);
      const newData = await response.json();
      if (active) {
        setFetchedId(props.id);
        setData(newData);
      }
    }, Math.round(Math.random() * 12000));
  };

  fetchData();
  return () => {
    active = false;
  };
}, [props.id]);
```

这个修复方法依赖于React Hooks API参考中经常被忽略的一句话：

"此外，如果组件多次渲染（通常是这样），在执行下一个效果之前，前一个效果会被清理。"

在上面的例子中：

- 改变props.id会导致重新渲染，
- 每次重新渲染都会触发清理函数运行，将active设置为false，
- 当active设置为false后，现在过时的请求将无法更新我们的状态

你仍然会有竞态条件，因为多个请求会同时进行，但只有最后一个请求的结果会被使用。

这个清理函数为什么能修复问题可能不太明显。我建议你查看CodeSandbox中的实际修复效果（我还添加了一个计数器来跟踪活动请求的数量，以及几个辅助函数）。

### 使用AbortController的useEffect清理函数

同样，让我们先看代码：

```javascript
useEffect(() => {
  const abortController = new AbortController();

  const fetchData = async () => {
    setTimeout(async () => {
      try {
        const response = await fetch(`https://swapi.dev/api/people/${id}/`, {
          signal: abortController.signal,
        });
        const newData = await response.json();

        setFetchedId(id);
        setData(newData);
      } catch (error) {
        if (error.name === 'AbortError') {
          // 中止fetch会抛出错误
          // 所以我们无法在之后更新状态
        }
        // 在这里处理其他请求错误
      }
    }, Math.round(Math.random() * 12000));
  };

  fetchData();
  return () => {
    abortController.abort();
  };
}, [id]);
```

与前面的例子一样，我们利用了React在执行下一个效果前运行清理函数的特性。你也可以查看CodeSandbox（这次我们不再计算请求数量，因为在任何时候只能有一个请求）。

然而，这次我们：

1. 在效果开始时初始化一个AbortController，
2. 通过options参数将AbortController.signal传递给fetch，
3. 捕获任何抛出的AbortErrors（当调用abort()时，fetch()promise会以AbortError拒绝，参见MDN参考），
4. 在清理函数中调用abort函数

使用这个例子，我们面临以下权衡：放弃对Internet Explorer的支持/使用polyfill，换取取消正在进行的HTTP请求的能力。

就个人而言，我很幸运在一家不再支持Internet Explorer的公司工作，所以我更愿意避免浪费用户带宽，使用AbortController。