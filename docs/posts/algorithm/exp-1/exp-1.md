# 250508 实验一 分治法

::: tip 
##### 一、 实验目的 
1、理解“分治法”算法设计思想及其实现步骤
2、掌握分治算法效率递归分析方法
3、掌握主方式求解递归式方法
##### 二、 实验条件 
硬件：计算机
软件：计算机程序语言开发平台，如C、C++、Java、Matlab。
学生：至少掌握一门计算机程序设计语言，如C、C++、Java、
Matlab，Python。
##### 三、 实验内容及要求 
1、利用计算机程序设计语言，实现 “Strassen’s 矩阵乘法算法”，
自主生成两个16×16 的矩阵，检验算法的正确性并输出算法结果。
2、利用计算机程序设计语言，实现 “最近点对分治算法”，在随
机生成的二维空间点集上，与蛮力法比较来检验算法的正确性，输
出算法结果。
3、请用分治策略设计一个算法，绘制以下图形。图中内部最小的等
边三角形的边长为 1。
:::

## T1

利用计算机程序设计语言，实现 “Strassen’s 矩阵乘法算法”，自主生成两个16×16 的矩阵，检验算法的正确性并输出算法结果。

算法如下:

```js
function splitMatrix(matrix) {
    const n = matrix.length;
    const halfN = n / 2;
    const A11 = [], A12 = [], A21 = [], A22 = [];
    for (let i = 0; i < halfN; i++) {
        A11[i] = matrix[i].slice(0, halfN);
        A12[i] = matrix[i].slice(halfN);
    }
    for (let i = halfN; i < n; i++) {
        A21[i - halfN] = matrix[i].slice(0, halfN);
        A22[i - halfN] = matrix[i].slice(halfN);
    }
    return [A11, A12, A21, A22];
}

function addMatrices(A, B) {
    const n = A.length;
    const result = [];
    for (let i = 0; i < n; i++) {
        result[i] = [];
        for (let j = 0; j < n; j++) {
            result[i][j] = A[i][j] + B[i][j];
        }
    }
    return result;
}

function subtractMatrices(A, B) {
    const n = A.length;
    const result = [];
    for (let i = 0; i < n; i++) {
        result[i] = [];
        for (let j = 0; j < n; j++) {
            result[i][j] = A[i][j] - B[i][j];
        }
    }
    return result;
}

function strassen(A, B) {
    const n = A.length;
    if (n === 1) {
        return [[A[0][0] * B[0][0]]];
    }
    const [A11, A12, A21, A22] = splitMatrix(A);
    const [B11, B12, B21, B22] = splitMatrix(B);
    const P1 = strassen(A11, subtractMatrices(B12, B22));
    const P2 = strassen(addMatrices(A11, A12), B22);
    const P3 = strassen(addMatrices(A21, A22), B11);
    const P4 = strassen(A22, subtractMatrices(B21, B11));
    const P5 = strassen(addMatrices(A11, A22), addMatrices(B11, B22));
    const P6 = strassen(subtractMatrices(A12, A22), addMatrices(B21, B22));
    const P7 = strassen(subtractMatrices(A11, A21), addMatrices(B11, B12));
    const C11 = addMatrices(subtractMatrices(addMatrices(P5, P4), P2), P6);
    const C12 = addMatrices(P1, P2);
    const C21 = addMatrices(P3, P4);
    const C22 = subtractMatrices(subtractMatrices(addMatrices(P5, P1), P3), P7);
    const result = [];
    for (let i = 0; i < n; i++) {
        result[i] = [];
        for (let j = 0; j < n; j++) {
            if (i < n / 2) {
                if (j < n / 2) {
                    result[i][j] = C11[i][j];
                } else {
                    result[i][j] = C12[i][j - n / 2];
                }
            } else {
                if (j < n / 2) {
                    result[i][j] = C21[i - n / 2][j];
                } else {
                    result[i][j] = C22[i - n / 2][j - n / 2];
                }
            }
        }
    }
    return result;
}

function generateRandomMatrix(size) {
    const matrix = [];
    for (let i = 0; i < size; i++) {
        matrix[i] = [];
        for (let j = 0; j < size; j++) {
            matrix[i][j] = Math.floor(Math.random() * 10);
        }
    }
    return matrix;
}

function multiplyMatrices(A, B) {
    const n = A.length;
    const result = [];
    for (let i = 0; i < n; i++) {
        result[i] = [];
        for (let j = 0; j < n; j++) {
            let sum = 0;
            for (let k = 0; k < n; k++) {
                sum += A[i][k] * B[k][j];
            }
            result[i][j] = sum;
        }
    }
    return result;
}

function isEqual(A, B) {
    const n = A.length;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (A[i][j]!== B[i][j]) {
                return false;
            }
        }
    }
    return true;
}

// 生成两个 16x16 的矩阵
const A = generateRandomMatrix(16);
const B = generateRandomMatrix(16);

// 使用 Strassen 算法计算矩阵乘法
const resultStrassen = strassen(A, B);

// 使用传统方法计算矩阵乘法来验证结果
const resultTraditional = multiplyMatrices(A, B);

// 检验结果是否一致
const isCorrect = isEqual(resultStrassen, resultTraditional);

console.log("Strassen 算法计算结果:");
console.log(resultStrassen);
console.log("传统方法计算结果:");
console.log(resultTraditional);
console.log("算法结果是否正确:", isCorrect);
```

输出为:

```js
Strassen 算法计算结果:
[
  [
    281, 244, 264, 200,
    245, 197, 143, 200,
    206, 147, 174, 264,
    247, 209, 241, 227
  ],
  [
    472, 393, 364, 298,
    375, 333, 286, 363,
    333, 281, 297, 397,
    321, 305, 367, 363
  ],
  [
    467, 383, 386, 269,
    431, 338, 268, 371,
    318, 186, 297, 434,
    410, 338, 425, 343
  ],
  [
    449, 359, 339, 231,
    323, 337, 243, 290,
    322, 220, 235, 336,
    341, 276, 319, 295
  ],
  [
    493, 382, 425, 357,
    353, 390, 347, 360,
    356, 295, 310, 411,
    421, 367, 349, 397
  ],
  [
    515, 397, 444, 274,
    407, 411, 339, 378,
    352, 278, 297, 449,
    383, 323, 381, 368
  ],
  [
    355, 315, 294, 220,
    325, 286, 230, 304,
    263, 197, 285, 307,
    303, 325, 340, 369
  ],
  [
    355, 287, 306, 247,
    313, 305, 211, 279,
    244, 203, 268, 345,
    355, 230, 310, 282
  ],
  [
    401, 296, 360, 339,
    329, 244, 257, 298,
    283, 202, 233, 376,
    318, 293, 334, 294
  ],
  [
    468, 366, 395, 315,
    398, 380, 340, 447,
    325, 304, 318, 486,
    404, 358, 383, 376
  ],
  [
    451, 392, 357, 288,
    359, 308, 267, 328,
    287, 228, 284, 387,
    313, 276, 359, 336
  ],
  [
    322, 190, 236, 228,
    218, 214, 209, 247,
    188, 202, 166, 313,
    236, 230, 177, 214
  ],
  [
    448, 346, 369, 254,
    357, 312, 316, 338,
    300, 201, 269, 411,
    340, 361, 371, 353
  ],
  [
    369, 303, 300, 241,
    311, 286, 233, 327,
    205, 238, 260, 363,
    264, 190, 321, 323
  ],
  [
    458, 339, 329, 332,
    298, 370, 286, 338,
    305, 270, 295, 404,
    418, 303, 285, 332
  ],
  [
    385, 359, 367, 230,
    373, 333, 303, 422,
    345, 294, 322, 344,
    331, 319, 369, 388
  ]
]
传统方法计算结果:
[
  [
    281, 244, 264, 200,
    245, 197, 143, 200,
    206, 147, 174, 264,
    247, 209, 241, 227
  ],
  [
    472, 393, 364, 298,
    375, 333, 286, 363,
    333, 281, 297, 397,
    321, 305, 367, 363
  ],
  [
    467, 383, 386, 269,
    431, 338, 268, 371,
    318, 186, 297, 434,
    410, 338, 425, 343
  ],
  [
    449, 359, 339, 231,
    323, 337, 243, 290,
    322, 220, 235, 336,
    341, 276, 319, 295
  ],
  [
    493, 382, 425, 357,
    353, 390, 347, 360,
    356, 295, 310, 411,
    421, 367, 349, 397
  ],
  [
    515, 397, 444, 274,
    407, 411, 339, 378,
    352, 278, 297, 449,
    383, 323, 381, 368
  ],
  [
    355, 315, 294, 220,
    325, 286, 230, 304,
    263, 197, 285, 307,
    303, 325, 340, 369
  ],
  [
    355, 287, 306, 247,
    313, 305, 211, 279,
    244, 203, 268, 345,
    355, 230, 310, 282
  ],
  [
    401, 296, 360, 339,
    329, 244, 257, 298,
    283, 202, 233, 376,
    318, 293, 334, 294
  ],
  [
    468, 366, 395, 315,
    398, 380, 340, 447,
    325, 304, 318, 486,
    404, 358, 383, 376
  ],
  [
    451, 392, 357, 288,
    359, 308, 267, 328,
    287, 228, 284, 387,
    313, 276, 359, 336
  ],
  [
    322, 190, 236, 228,
    218, 214, 209, 247,
    188, 202, 166, 313,
    236, 230, 177, 214
  ],
  [
    448, 346, 369, 254,
    357, 312, 316, 338,
    300, 201, 269, 411,
    340, 361, 371, 353
  ],
  [
    369, 303, 300, 241,
    311, 286, 233, 327,
    205, 238, 260, 363,
    264, 190, 321, 323
  ],
  [
    458, 339, 329, 332,
    298, 370, 286, 338,
    305, 270, 295, 404,
    418, 303, 285, 332
  ],
  [
    385, 359, 367, 230,
    373, 333, 303, 422,
    345, 294, 322, 344,
    331, 319, 369, 388
  ]
]
算法结果是否正确: true
```

## T2

利用计算机程序设计语言，实现 “最近点对分治算法”，在随
机生成的二维空间点集上，与蛮力法比较来检验算法的正确性，输
出算法结果。

算法如下:

```js
// 计算两点之间的欧几里得距离
function distance(p1, p2) {
    return Math.sqrt((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2);
}

// 蛮力法求最近点对距离
function bruteForce(points) {
    let minDist = Infinity;
    for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
            const dist = distance(points[i], points[j]);
            if (dist < minDist) {
                minDist = dist;
            }
        }
    }
    return minDist;
}

// 按 x 坐标排序
function compareX(a, b) {
    return a[0] - b[0];
}

// 按 y 坐标排序
function compareY(a, b) {
    return a[1] - b[1];
}

// 分治算法求最近点对距离
function closestUtil(points, n) {
    if (n <= 3) {
        return bruteForce(points);
    }
    const mid = Math.floor(n / 2);
    const midPoint = points[mid];
    const dl = closestUtil(points.slice(0, mid), mid);
    const dr = closestUtil(points.slice(mid), n - mid);
    const d = Math.min(dl, dr);
    const strip = [];
    for (let i = 0; i < n; i++) {
        if (Math.abs(points[i][0] - midPoint[0]) < d) {
            strip.push(points[i]);
        }
    }
    strip.sort(compareY);
    for (let i = 0; i < strip.length; i++) {
        for (let j = i + 1; j < strip.length && (strip[j][1] - strip[i][1]) < d; j++) {
            const dist = distance(strip[i], strip[j]);
            if (dist < d) {
                d = dist;
            }
        }
    }
    return d;
}

function closest(points) {
    points.sort(compareX);
    return closestUtil(points, points.length);
}

// 随机生成二维空间点集
function generateRandomPoints(numPoints) {
    const points = [];
    for (let i = 0; i < numPoints; i++) {
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        points.push([x, y]);
    }
    return points;
}

// 生成随机点集
const numPoints = 10;
const points = generateRandomPoints(numPoints);

// 使用分治算法计算最近点对距离
const resultDivideConquer = closest(points);

// 使用蛮力法计算最近点对距离
const resultBruteForce = bruteForce(points);

// 检验结果是否一致
const isCorrect = Math.abs(resultDivideConquer - resultBruteForce) < 1e-9;

console.log("随机生成的二维空间点集:");
console.log(points);
console.log("分治算法计算的最近点对距离:");
console.log(resultDivideConquer);
console.log("蛮力法计算的最近点对距离:");
console.log(resultBruteForce);
console.log("算法结果是否正确:", isCorrect);
```

输出结果为:

```js
随机生成的二维空间点集:
[
  [ 9.662777846407833, 5.890489277390887 ],
  [ 11.842921251234273, 42.04567392921512 ],
  [ 19.53540639604048, 94.67075087519201 ],
  [ 34.423845284196396, 34.56349449258771 ],
  [ 46.01500035463677, 93.02130864472761 ],
  [ 55.14330330502011, 74.60908199111272 ],
  [ 55.910476900337926, 10.028233027458944 ],
  [ 57.27823400105467, 69.38549485449647 ],
  [ 62.53960580802544, 90.49206627138415 ],
  [ 62.58379107018719, 74.61572851061837 ]
]
分治算法计算的最近点对距离:
5.6430303606035395
蛮力法计算的最近点对距离:
5.6430303606035395
算法结果是否正确: true
```

## T3
请用分治策略设计一个算法，绘制以下图形。图中内部最小的等
边三角形的边长为 1

使用 JavaScript 和 HTML 实现绘制比较麻烦，这里转用 Python 的 turtle 库来实现：

```python
import turtle

def draw_triangle(t, side_length):
    """绘制等边三角形"""
    for _ in range(3):
        t.forward(side_length)
        t.left(120)


def divide_triangle(t, side_length, depth):
    """分治绘制三角形"""
    if depth == 0:
        draw_triangle(t, side_length)
    else:
        half_side = side_length / 2
        # 绘制左下角三角形
        divide_triangle(t, half_side, depth - 1)
        t.forward(half_side)
        # 绘制右下角三角形
        divide_triangle(t, half_side, depth - 1)
        t.backward(half_side)
        t.left(60)
        t.forward(half_side)
        t.right(60)
        # 绘制顶部三角形
        divide_triangle(t, half_side, depth - 1)
        t.left(60)
        t.backward(half_side)
        t.right(60)

# 设置画布和画笔
screen = turtle.Screen()
t = turtle.Turtle()
t.speed(0)

# 初始边长
initial_side_length = 256
# 最大递归深度
max_depth = 5

# 移动画笔到起始位置
t.penup()
t.goto(-initial_side_length / 2, -initial_side_length * (3**0.5) / 6)
t.pendown()

# 开始绘制
divide_triangle(t, initial_side_length, max_depth)

# 完成绘制
screen.mainloop()
```

运行即可见到 窗口内三角形的绘制过程.
























































