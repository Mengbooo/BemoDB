---
title: 2023 级数学建模大作业
date: '2025-05-06'
tags:
- modeling
---

<!-- # 2023 级数学建模大作业

> 选题为 C：按照课堂讲授的内容，对第 9 章中所介绍的算法（最速下降法、牛顿法、
> DFP 算法、BFGS 算法、FR 算法中选取其中 3 个）编程或者调用库函数实现，
> 并给出具体算例。

## 1.案例

求函数 $f (x) = 2x_1^2+x_2^2$ 的极小点。

设初始点为 $x_0=(1, 1)$，$\epsilon = \cfrac {1}{10}$。

## 2.DFP 算法

### 2.1.原理

DFP 算法是一种拟牛顿法，用于求解无约束优化问题。其基本思想是通过迭代地构造一个近似的海森矩阵的逆矩阵（用  $\mathbf{H}_k$  表示第  k  次迭代的近似海森逆矩阵），利用这个近似矩阵来确定搜索方向，从而逐步逼近函数的极小点。该算法避免了直接计算复杂的海森矩阵及其逆矩阵，而是通过每次迭代中函数梯度的变化信息来更新近似矩阵，在一定程度上提高了计算效率。

DFP 算法基本步骤如下：

1. **初始化**：
   - 给定初始点 $\mathbf{x}_0$，设定精度要求 $\epsilon > 0$，初始的近似海森逆矩阵 $\mathbf{H}_0$ 通常设为单位矩阵 $\mathbf{I}$，迭代次数 $k = 0$。
2. **计算梯度**：计算当前点 $\mathbf{x}_k$ 处的函数梯度 $\mathbf{g}_k = \nabla f(\mathbf{x}_k)$。
3. **判断终止条件**：如果 $\|\mathbf{g}_k\| < \epsilon$，则停止迭代，当前点 $\mathbf{x}_k$ 即为近似极小点；否则继续下一步。
4. **确定搜索方向**：计算搜索方向 $\mathbf{p}_k = -\mathbf{H}_k \mathbf{g}_k$。
5. **确定步长**：通过一维搜索（如黄金分割法、二次插值法等）确定合适的步长 $\alpha_k$，使得 $f(\mathbf{x}_k + \alpha_k \mathbf{p}_k)$ 取得极小值。
6. **更新点的位置**：计算新的点 $\mathbf{x}_{k + 1} = \mathbf{x}_k + \alpha_k \mathbf{p}_k$。
7. **计算梯度变化量和位置变化量**：计算 $\mathbf{y}_k = \nabla f(\mathbf{x}_{k + 1}) - \nabla f(\mathbf{x}_k)$ 和 $\mathbf{s}_k = \mathbf{x}_{k + 1} - \mathbf{x}_k$。
8. **更新近似海森逆矩阵**：根据 DFP 公式更新近似海森逆矩阵：
   $$ \mathbf{H}\_{k + 1} = \mathbf{H}\_k + \frac{\mathbf{s}\_k \mathbf{s}\_k^T}{\mathbf{s}\_k^T \mathbf{y}\_k} - \frac{\mathbf{H}\_k \mathbf{y}\_k \mathbf{y}\_k^T \mathbf{H}\_k}{\mathbf{y}\_k^T \mathbf{H}\_k \mathbf{y}\_k} $$
9. **迭代更新**：令 $k = k + 1$，返回步骤 2 继续迭代。

### 2.2.解答

采用 Python，编程如下：

```py
import numpy as np

# 定义函数 f(x)
def f(x):
    return 2 * x[0] ** 2 + x[1] ** 2

# 定义梯度计算函数
def grad_f(x):
    return np.array([4 * x[0], 2 * x[1]])

# DFP 算法实现
def dfp_method(f, grad_f, initial_x, epsilon, max_iter=1000):
    """
    使用 DFP 算法寻找函数的极小点。

    参数:
    f (callable): 目标函数。
    grad_f (callable): 目标函数的梯度函数。
    initial_x (np.ndarray): 初始点。
    epsilon (float): 收敛阈值。
    max_iter (int): 最大迭代次数，默认为 1000。

    返回:
    np.ndarray: 近似极小点。
    list: 迭代过程中所有点的列表。
    """
    x = initial_x
    n = len(x)
    H = np.eye(n)  # 初始化逆 Hessian 矩阵为单位矩阵
    g = grad_f(x)
    history = [x]  # 用于存储迭代过程中的 x 值

    # 固定步长
    ALPHA = 0.1
    # 避免除零的小正数
    EPSILON_DIV = 1e-10

    for _ in range(max_iter):
        if np.linalg.norm(g) < epsilon:  # 检查收敛性
            break

        # 计算搜索方向
        p = -np.dot(H, g)

        # 更新 x 值
        x_new = x + ALPHA * p
        g_new = grad_f(x_new)
        s = x_new - x
        y = g_new - g

        # 计算点积
        sy = np.dot(s, y)
        if sy == 0:
            sy += EPSILON_DIV

        Hs = np.dot(H, s)
        sHs = np.dot(s, Hs)

        # DFP 更新公式
        H = H + np.outer(s, s) / sy - np.outer(Hs, Hs) / sHs

        # 为下一次迭代做准备
        x = x_new
        g = g_new
        history.append(x)

    return x, history

# 初始点
initial_x = np.array([1, 1])
# 收敛阈值
epsilon = 1 / 10

# 执行 DFP 算法
optimal_x, history = dfp_method(f, grad_f, initial_x, epsilon)

print("极小点:", optimal_x)
```

输出结果如下：

```py
极小点: [0.0014867  0.04557862]
```

使用 DFP 算法，我们找到了函数 $f (x) = 2x_1^2 + x_2^2$ 的极小点大约在 $(0.0015, 0.0456)$ 处。非常接近于函数的真实极小点 $(0, 0)$。

## 3.BFGS 算法

### 3.1.原理

BFGS 算法是一种用于无约束优化问题的迭代算法，属于拟牛顿法的一种，以下是其原理介绍：

#### 基本思想

- BFGS 算法通过构造一个正定矩阵来近似目标函数的 Hessian 矩阵的逆，从而避免了直接计算 Hessian 矩阵及其逆，降低了计算复杂度。在每一次迭代中，根据当前的迭代点和梯度信息，更新这个近似矩阵，使得算法能够逐步逼近目标函数的极小点。

#### 算法推导

- 设目标函数为$f(x)$，其梯度为$\nabla f(x)$。在第$k$次迭代时，当前点为$x_k$，梯度为$g_k = \nabla f(x_k)$。
- 我们希望找到一个搜索方向$p_k$，使得沿着这个方向移动能使目标函数值下降。类似于牛顿法，搜索方向$p_k$可以通过求解线性方程组$H_k p_k = -g_k$得到，其中$H_k$是 Hessian 矩阵的近似。
- BFGS 算法使用一个正定矩阵$B_k$来近似$H_k$，即$B_k p_k = -g_k$，从而得到搜索方向$p_k = -B_k^{-1} g_k$。
- 给定步长$\alpha_k$，则下一个迭代点为$x_{k + 1} = x_k + \alpha_k p_k$。
- 为了更新近似矩阵$B_k$，使其更好地逼近 Hessian 矩阵，根据两次迭代之间的梯度差和位置差来构建更新公式。设$s_k = x_{k + 1}-x_k$，$y_k = g_{k + 1}-g_k$，则 BFGS 算法的更新公式为：
  $$
  B_{k + 1}=B_{k}+\frac{y_{k}y_{k}^{T}}{y_{k}^{T}s_{k}}-\frac{B_{k}s_{k}s_{k}^{T}B_{k}}{s_{k}^{T}B_{k}s_{k}}
  $$
- 这个公式的第一项是上一次迭代的近似矩阵$B_k$，第二项是对$B_k$的修正，使得$B_{k + 1}$更好地逼近 Hessian 矩阵在$x_{k + 1}$处的值，第三项是为了保证$B_{k + 1}$的正定性和对称性。

合适的步长$\alpha_k$对于算法的收敛性和效率至关重要。常用的方法有精确线搜索和非精确线搜索。精确线搜索是找到使目标函数$f(x_k+\alpha p_k)$达到最小的$\alpha$值；非精确线搜索则是在一定的条件下，找到一个能使目标函数有足够下降的$\alpha$值，例如采用 Armijo 准则、Wolfe 准则等。

在一定的条件下，BFGS 算法具有全局收敛性和超线性收敛速度。一般要求目标函数$f(x)$是连续可微的，并且其 Hessian 矩阵满足一定的条件。在实际应用中，BFGS 算法通常能在较少的迭代次数内收敛到目标函数的极小点附近。

### 3.2.解答

采用 Python，编程如下：

```py
import numpy as np

# 定义目标函数
def f(x):
    return 2 * x[0] ** 2 + x[1] ** 2

# 定义目标函数的梯度
def grad_f(x):
    return np.array([4 * x[0], 2 * x[1]])

# BFGS 算法实现
def bfgs_method(f, grad_f, initial_x, epsilon, max_iter=1000):
    x = np.array(initial_x, dtype=np.float64)
    n = len(x)
    # 初始化近似海森逆矩阵为单位矩阵
    H = np.eye(n)
    g = grad_f(x)
    history = [x]

    for _ in range(max_iter):
        if np.linalg.norm(g) < epsilon:
            break

        # 计算搜索方向
        p = -np.dot(H, g)

        # 简单固定步长，实际可使用线搜索确定
        alpha = 0.1

        # 更新点的位置
        x_new = x + alpha * p
        g_new = grad_f(x_new)

        s = x_new - x
        y = g_new - g

        # 避免除以零
        sy = np.dot(s, y)
        if sy == 0:
            sy += 1e-10

        # 计算中间变量
        rho = 1 / sy
        I = np.eye(n)

        # BFGS 更新公式
        A = (I - rho * np.outer(s, y))
        B = (I - rho * np.outer(y, s))
        H = np.dot(np.dot(A, H), B) + rho * np.outer(s, s)

        x = x_new
        g = g_new
        history.append(x)

    return x, history

# 初始点
initial_x = [1, 1]
# 收敛阈值
epsilon = 1 / 10

# 执行 BFGS 算法
optimal_x, history = bfgs_method(f, grad_f, initial_x, epsilon)

print("极小点:", optimal_x)
```

输出结果为:

```py
极小点: [0.02050654 0.02558844]
```

## 4.FR算法

FR算法，即Fletcher - Reeves算法，是一种用于求解无约束优化问题的共轭梯度法。

### 4.1.原理
FR算法通过构造一系列共轭方向来逐步逼近函数的极小点。共轭方向具有特殊的性质，使得算法在这些方向上进行搜索时能够有效地收敛到最优解。

考虑无约束优化问题：$\min_{x\in R^n} f(x)$，其中$f(x)$是连续可微的函数。

#### 算法步骤
1. **初始化**：选择初始点$x_0\in R^n$，计算初始梯度$g_0=\nabla f(x_0)$，令$d_0=-g_0$，$k = 0$。
2. **迭代过程**：
    - **线搜索**：通过某种线搜索方法确定步长$\alpha_k$，使得$f(x_k+\alpha_k d_k)=\min_{\alpha\geq0} f(x_k+\alpha d_k)$。
    - **更新点**：计算$x_{k + 1}=x_k+\alpha_k d_k$。
    - **计算新梯度**：计算$g_{k + 1}=\nabla f(x_{k + 1})$。
    - **判断收敛**：如果$\vert\vert g_{k + 1}\vert\vert$小于给定的收敛阈值$\epsilon$，则停止迭代，输出$x_{k + 1}$作为近似最优解；否则，继续下一步。
    - **计算共轭方向**：计算$\beta_{k}=\frac{\vert\vert g_{k + 1}\vert\vert^2}{\vert\vert g_{k}\vert\vert^2}$，然后令$d_{k + 1}=-g_{k + 1}+\beta_{k}d_{k}$。这里的$\beta_{k}$是FR算法的关键参数，它使得搜索方向$d_{k}$与$d_{k + 1}$关于海森矩阵共轭（在精确线搜索的条件下）。
3. **重复迭代**：令$k = k + 1$，返回步骤2继续迭代，直到满足收敛条件。

#### 收敛性
在一定的条件下，FR算法具有全局收敛性。例如，当目标函数$f(x)$是二次函数且具有正定的海森矩阵时，FR算法在有限步内可以收敛到全局最优解。对于一般的非二次函数，在适当的假设下，FR算法也能够收敛到局部最优解。

FR算法具有计算量小、存储需求低等优点，适用于求解大规模无约束优化问题。但它对目标函数的性质有一定要求，并且在某些情况下可能收敛较慢。

### 4.2.解答

采用 Python，编程如下：

```py
import numpy as np
from scipy.optimize import line_search

# 定义目标函数
def f(x):
    return 2 * x[0] ** 2 + x[1] ** 2

# 定义目标函数的梯度
def grad_f(x):
    return np.array([4 * x[0], 2 * x[1]])

# FR 算法实现
def fr_method(f, grad_f, initial_x, epsilon, max_iter=1000):
    x = np.array(initial_x, dtype=np.float64)
    g = grad_f(x)
    d = -g
    history = [x]

    for _ in range(max_iter):
        if np.linalg.norm(g) < epsilon:
            break

        # 线搜索确定步长
        alpha = line_search(f, grad_f, x, d)[0]
        if alpha is None:
            print("线搜索未找到合适的步长，终止迭代。")
            break

        # 更新点的位置
        x = x + alpha * d
        g_new = grad_f(x)

        # 计算 FR 算法中的 beta
        beta = np.linalg.norm(g_new) ** 2 / np.linalg.norm(g) ** 2

        # 更新搜索方向
        d = -g_new + beta * d
        g = g_new

        history.append(x)

    return x, history

# 初始点
initial_x = [1, 1]
# 收敛阈值
epsilon = 1 / 10

# 执行 FR 算法
optimal_x, history = fr_method(f, grad_f, initial_x, epsilon)

print("极小点:", optimal_x)
```

其输出结果为：

```py
极小点: [2.77555756e-17 5.55111512e-17]
```

值已经非常接近零，从数值计算的角度来看，可以认为已经收敛到极小点了。

## 算法比较和实验总结

如果问题规模较大且对计算效率和收敛速度要求较高，BFGS 算法是更好的选择；DFP 算法在一般的无约束优化问题中也能表现出不错的性能；FR 算法由于其低存储需求的特点，在内存资源有限或处理大规模问题时具有一定优势，尽管它的收敛速度相对较慢。 -->

# 2023级数学建模大作业

::: danger A Tip
Vitepress解析器markdown-it不支持LaTeX数学公式的渲染，所以如果你想看的话可以来看看源码:

https://github.com/Mengbooo/BemoDB/tree/main/docs/posts/modeling/exp/hw.md
:::