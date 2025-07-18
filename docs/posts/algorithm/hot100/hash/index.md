---
title: 算法#001 | HOT100 哈希表
date: '2025-07-10'
tags:
- algorithm
- hot100
- hash
---

# 算法#001 | HOT100 哈希表

哈希表（Hash Table），又称散列表，是计算机科学中一种极其重要的数据结构。它通过一种“映射”关系，将“键（Key）”直接转换到内存中的一个位置，从而实现高效的数据查找。在算法题，尤其是对时间复杂度有较高要求的场景中，哈希表是当之无愧的“神器”。

本文将首先介绍哈希表的基本原理，然后通过 LeetCode Hot 100 中的三道经典题目，展示如何利用哈希表巧妙地解决问题。

## 什么是哈希表？

想象一下去图书馆找书，如果没有索引系统，你可能需要从第一个书架找到最后一个。但如果有一个索引卡片系统，你可以通过书名首字母（比如 'H'）直接定位到存放 'H' 开头书名的区域，大大缩短查找时间。

哈希表就类似这个索引系统。它的核心思想是：

1.  **哈希函数（Hash Function）**：这是一个特殊的函数，可以将任意类型的键（如数字、字符串）转换成一个固定大小的整数，这个整数被称为“哈希值”或“哈希码”。
2.  **数组（Array）**：哈希表内部通常使用一个数组来存储数据。哈希值被用来计算数据在数组中的索引位置。
3.  **键-值对（Key-Value Pair）**：哈希表存储的是键和值之间的映射关系。

理想情况下，不同的键通过哈希函数计算后得到不同的索引，这样我们就可以用 **O(1)** 的时间复杂度完成插入、删除和查找操作。

### 哈希冲突

然而，现实中哈希函数可能会将两个不同的键映射到同一个索引位置，这种情况被称为“哈希冲突”。解决哈希冲突的常见方法有两种：

1.  **链地址法（Chaining）**：在冲突的索引位置，用一个链表或其他数据结构来存储所有映射到此处的键值对。大多数现代编程语言（如 Java、Python）都采用这种方式。
2.  **开放地址法（Open Addressing）**：当发生冲突时，去探测下一个可用的空位来存储数据。

正是因为哈希表这种“以空间换时间”的设计，它在处理查找、计数、去重等问题时表现得极为出色。

## LeetCode 实战

接下来，我们通过三道经典题目来感受哈希表的威力。

### 1. 两数之和 (LeetCode #1)

> **问题描述**：给定一个整数数组 `nums` 和一个整数目标值 `target`，请你在该数组中找出 **和为目标值** 的那 **两个** 整数，并返回它们的数组下标。

#### 方法一：暴力枚举

最直观的思路是使用两层循环，枚举数组中所有可能的数字组合，判断它们的和是否等于 `target`。

```javascript
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    for (let i = 0; i < nums.length; i++) {
        for (let j = i + 1; j < nums.length; j++) {
            if (nums[i] + nums[j] === target) {
                return [i, j];
            }
        }
    }
};
```

-   **时间复杂度**：O(N²)，其中 N 是数组的长度。需要两层循环来检查所有组合。
-   **空间复杂度**：O(1)，只使用了常数级别的额外空间。

#### 方法二：哈希表优化

暴力法的问题在于，对于每个数字 `nums[i]`，我们都需要遍历剩下的数组来寻找 `target - nums[i]`。这个“寻找”的过程非常耗时。

我们可以用哈希表来优化这个“寻找”过程。哈希表可以在 O(1) 的时间内判断一个元素是否存在。

**思路**：
遍历数组，对于每个元素 `num`，我们计算出需要的另一个数字 `complement = target - num`。然后在哈希表中查找 `complement` 是否存在。

-   如果存在，说明我们找到了答案，直接返回两个数的下标。
-   如果不存在，就把当前数字 `num` 和它的下标存入哈希表，供后续的数字进行匹配。

```javascript
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    const map = new Map(); // Key: number, Value: index
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
};
```

-   **时间复杂度**：O(N)。我们只需要遍历数组一次。哈希表的插入和查找操作平均时间复杂度都是 O(1)。
-   **空间复杂度**：O(N)。在最坏的情况下，我们需要将数组中的所有元素都存入哈希表中。

### 2. 字母异位词分组 (LeetCode #49)

> **问题描述**：给你一个字符串数组 `strs`，请你将 **字母异位词** 组合在一起。可以按任意顺序返回结果列表。字母异位词指由相同字母构成的、排列顺序不同的字符串。

**示例**：
输入: `strs = ["eat", "tea", "tan", "ate", "nat", "bat"]`
输出: `[["bat"], ["nat","tan"], ["ate","eat","tea"]]`

#### 方法一：排序作为 Key

字母异位词有一个重要的特征：将它们各自的字母排序后，会得到完全相同的字符串。例如，`"eat"`, `"tea"`, `"ate"` 排序后都是 `"aet"`。

这个共同的特征可以作为哈希表的 Key。

**思路**：
我们遍历每个字符串，将其排序后的结果作为 Key，原始字符串作为 Value 存入哈希表中。哈希表的 Value 是一个列表，用来存储所有符合该 Key 的原始字符串。

```javascript
/**
 * @param {string[]} strs
 * @return {string[][]}
 */
var groupAnagrams = function(strs) {
    const map = new Map();
    for (const str of strs) {
        const sortedStr = str.split('').sort().join('');
        if (map.has(sortedStr)) {
            map.get(sortedStr).push(str);
        } else {
            map.set(sortedStr, [str]);
        }
    }
    return Array.from(map.values());
};
```

-   **时间复杂度**：O(N * K log K)，其中 N 是字符串数组的长度，K 是字符串的最大长度。对每个字符串进行排序的时间复杂度是 O(K log K)。
-   **空间复杂度**：O(N * K)，需要存储所有字符串。

#### 方法二：字符计数作为 Key

排序虽然可行，但不是最高效的。另一种生成唯一 Key 的方法是统计每个字符串中字符出现的次数。因为字母异位词的字符构成是完全相同的，所以它们的字符计数也必然相同。

**思路**：
我们可以创建一个长度为 26 的数组（对应 'a' 到 'z'）来统计每个字符的数量。然后将这个数组转换成一个唯一的字符串作为哈希表的 Key。

```javascript
/**
 * @param {string[]} strs
 * @return {string[][]}
 */
var groupAnagrams = function(strs) {
    const map = new Map();
    for (const str of strs) {
        const counts = new Array(26).fill(0);
        for (const char of str) {
            counts[char.charCodeAt(0) - 'a'.charCodeAt(0)]++;
        }
        // 将计数数组转换为唯一的 key，例如 "1a1b0c..."
        const key = counts.join(','); 
        if (map.has(key)) {
            map.get(key).push(str);
        } else {
            map.set(key, [str]);
        }
    }
    return Array.from(map.values());
};
```

-   **时间复杂度**：O(N * K)。我们遍历每个字符串一次，并对每个字符串中的字符进行计数。
-   **空间复杂度**：O(N * K)。

对比两种方法，字符计数法避免了排序操作，因此在理论上更优。

### 3. 最长连续序列 (LeetCode #128)

> **问题描述**：给定一个未排序的整数数组 `nums`，找出数字连续的最长序列（不要求序列元素在原数组中连续）的长度。请你设计并实现时间复杂度为 O(n) 的算法。

**示例**：
输入: `nums = [100, 4, 200, 1, 3, 2]`
输出: `4`
解释: 最长数字连续序列是 `[1, 2, 3, 4]`。它的长度为 4。

#### 方法一：排序

最容易想到的方法是先对数组进行排序。排序后，我们只需要遍历一次数组就可以找出最长的连续序列。

```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var longestConsecutive = function(nums) {
    if (nums.length === 0) return 0;

    nums.sort((a, b) => a - b);

    let maxLength = 1;
    let currentLength = 1;

    for (let i = 1; i < nums.length; i++) {
        // 跳过重复的数字
        if (nums[i] === nums[i - 1]) {
            continue;
        }
        
        if (nums[i] === nums[i - 1] + 1) {
            currentLength++;
        } else {
            maxLength = Math.max(maxLength, currentLength);
            currentLength = 1; // 重置
        }
    }
    // 最后再比较一次，防止最长序列在数组末尾
    return Math.max(maxLength, currentLength);
};
```

-   **时间复杂度**：O(N log N)，瓶颈在于排序。
-   **空间复杂度**：O(log N) 或 O(N)，取决于排序算法内部使用的空间。

#### 方法二：哈希集合（Set）

题目要求 O(N) 的时间复杂度，排序显然不满足。我们需要一种更高效的方法。哈希集合（Set）是这里的关键。

**思路**：
1.  首先，将所有数字存入一个哈希集合中，这样可以 O(1) 地判断一个数字是否存在，并且自动处理了重复数字。
2.  然后，再次遍历原始数组中的每个数字 `num`。
3.  对于每个 `num`，我们检查它是否是一个连续序列的起点。判断的依据是 `num - 1` 是否存在于哈希集合中。如果不存在，那么 `num` 就是一个潜在的起点。
4.  如果 `num` 是起点，我们就从 `num` 开始不断地检查 `num + 1`, `num + 2`, ... 是否存在于集合中，直到找到序列的终点，并记录下这个序列的长度。
5.  在整个过程中，维护一个最大长度即可。

```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var longestConsecutive = function(nums) {
    const numSet = new Set(nums);
    let maxLength = 0;

    for (const num of numSet) {
        // 关键优化：只对序列的起点进行计算
        // 如果 num-1 存在，说明 num 不是起点，直接跳过
        if (!numSet.has(num - 1)) {
            let currentNum = num;
            let currentLength = 1;

            while (numSet.has(currentNum + 1)) {
                currentNum++;
                currentLength++;
            }
            
            maxLength = Math.max(maxLength, currentLength);
        }
    }

    return maxLength;
};
```

-   **时间复杂度**：O(N)。虽然代码看起来有两层循环，但内层 `while` 循环只会对每个连续序列的起点执行一次。每个数字最多被访问两次（一次是外层循环，一次是内层 `while` 循环），所以总的时间复杂度是线性的。
-   **空间复杂度**：O(N)，用于存储哈希集合。

## 总结

哈希表通过其高效的查找能力，为许多算法问题提供了“降维打击”的思路。它的核心思想是**用空间换时间**，将查找、匹配、计数等操作的时间复杂度从 O(N) 或更高降低到接近 O(1)。

在解题时，当你发现需要反复检查某个元素是否存在，或者需要根据某个特征对元素进行分组时，就应该立刻想到哈希表（或哈希集合）。掌握哈希表，是迈向算法高手的关键一步。
