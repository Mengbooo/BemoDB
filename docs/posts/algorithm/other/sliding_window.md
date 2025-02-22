# Marscode T41 滑动窗口算法
> 滑动窗口是一种常用的算法技巧，特别适用于在数组或字符串中寻找满足特定条件的子数组或子串.
## 问题概述
小F得到了一个特殊的字符串，这个字符串只包含字符A、S、D、F，其长度总是4的倍数。他的任务是通过尽可能少的替换，使得A、S、D、F这四个字符在字符串中出现的频次相等。求出实现这一条件的最小子串长度。

## 测试样例

`输入：input = "ADDF"
输出：1`


`输入：input = "ASAFASAFADDD"
输出：3`


`输入：input = "SSDDFFFFAAAS"
输出：1`

## 代码
```javascript
function solution(input) {
  let countA = 0, countS = 0, countD = 0, countF = 0;
  for (let char of input) {
    if (char === 'A') countA++;
    else if (char === 'S') countS++;
    else if (char === 'D') countD++;
    else if (char === 'F') countF++;
  }
  const targetCount = input.length / 4;
  const excessA = Math.max(0, countA - targetCount);
  const excessS = Math.max(0, countS - targetCount);
  const excessD = Math.max(0, countD - targetCount);
  const excessF = Math.max(0, countF - targetCount);
  if (countA === targetCount && countS === targetCount && countD === targetCount && countF === targetCount) {
    return 0;
  }
  // 滑动窗口的左右边界
  let left = 0, right = 0;
  let minLength = input.length; // 初始化最小长度为整个字符串的长度

  // 滑动窗口内的字符计数
  let windowCountA = 0, windowCountS = 0, windowCountD = 0, windowCountF = 0;

  // 扩展右边界
  while (right < input.length) {
    // 更新窗口内的字符计数
    if (input[right] === 'A') windowCountA++;
    else if (input[right] === 'S') windowCountS++;
    else if (input[right] === 'D') windowCountD++;
    else if (input[right] === 'F') windowCountF++;

    // 尝试收缩左边界
    while (windowCountA >= excessA && windowCountS >= excessS && windowCountD >= excessD && windowCountF >= excessF) {
      // 更新最小长度
      minLength = Math.min(minLength, right - left + 1);

      // 更新窗口内的字符计数
      if (input[left] === 'A') windowCountA--;
      else if (input[left] === 'S') windowCountS--;
      else if (input[left] === 'D') windowCountD--;
      else if (input[left] === 'F') windowCountF--;

      // 移动左边界
      left++;
    }

    // 移动右边界
    right++;
  }

  return minLength;
}

function main() {
  // You can add more test cases here
  console.log(solution("ADDF") === 1);
  console.log(solution("ASAFASAFADDD") === 3);
}

main();
```
## 思路
### 理解问题：
题目要求我们通过尽可能少的替换操作，使得字符串中字符A、S、D、F的出现频次相等。
字符串的长度总是4的倍数，因此每个字符的目标频次是`input.length / 4`。
### 计算每个字符的频次：

遍历字符串，统计每个字符A、S、D、F的出现次数。
### 计算每个字符的“多余”数量：

对于每个字符，计算其超出目标频次的数量（即excess）。如果某个字符的频次已经达到目标频次，则其excess为0。
### 使用滑动窗口寻找最小子串：

- 使用滑动窗口（双指针）技术来寻找一个最小的子串，使得该子串中包含足够多的“多余”字符，以便通过替换操作使得整个字符串的频次达到平衡。
- 初始化左右指针left和right，并维护一个窗口内的字符计数。
- 扩展右指针right，直到窗口内的字符计数满足所有字符的excess要求。
- 一旦满足条件，尝试收缩左指针left，以找到最小的满足条件的子串。
- 更新最小子串的长度，并继续移动右指针，直到遍历完整个字符串。
### 返回结果：

最终返回找到的最小子串的长度，即为所需的最少替换操作次数。