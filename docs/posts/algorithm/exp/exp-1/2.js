// 计算两点之间的欧几里得距离
function distance(p1, p2) {
    const dx = p1[0] - p2[0];
    const dy = p1[1] - p2[1];
    const squaredSum = dx ** 2 + dy ** 2;
    const dist = Math.sqrt(squaredSum);
    console.log(`欧几里得距离: ${dist}`);
    return dist;
}

// 蛮力法求最近点对距离
function bruteForce(points) {
    let minDist = Infinity;
    console.log("开始使用蛮力法计算最近点对距离:");
    for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
            const dist = distance(points[i], points[j]);
            if (dist < minDist) {
                minDist = dist;
                console.log(`找到更小的距离: ${minDist}，由点 ${points[i]} 和点 ${points[j]} 产生`);
            }
        }
    }
    console.log(`蛮力法计算得到的最近点对距离: ${minDist}`);
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
        console.log(`点集数量小于等于 3，使用蛮力法计算: ${points}`);
        return bruteForce(points);
    }
    const mid = Math.floor(n / 2);
    const midPoint = points[mid];
    console.log(`将点集分为左右两部分，中间点索引: ${mid}，中间点: ${midPoint}`);
    const leftPoints = points.slice(0, mid);
    const rightPoints = points.slice(mid);
    console.log(`左半部分点集: ${leftPoints}`);
    console.log(`右半部分点集: ${rightPoints}`);
    const dl = closestUtil(leftPoints, mid);
    console.log(`左半部分计算得到的最近点对距离: ${dl}`);
    const dr = closestUtil(rightPoints, n - mid);
    console.log(`右半部分计算得到的最近点对距离: ${dr}`);
    let d = Math.min(dl, dr);
    console.log(`左右两部分最近点对距离中的最小值: ${d}`);
    const strip = [];
    console.log("筛选出距离中间点 x 坐标小于 d 的点:");
    for (let i = 0; i < n; i++) {
        if (Math.abs(points[i][0] - midPoint[0]) < d) {
            strip.push(points[i]);
            console.log(`点 ${points[i]} 满足条件，加入 strip`);
        }
    }
    strip.sort(compareY);
    console.log(`strip 中的点按 y 坐标排序后: ${strip}`);
    console.log("在 strip 中检查可能更小的距离:");
    for (let i = 0; i < strip.length; i++) {
        for (let j = i + 1; j < strip.length && (strip[j][1] - strip[i][1]) < d; j++) {
            const dist = distance(strip[i], strip[j]);
            if (dist < d) {
                d = dist;
                console.log(`在 strip 中找到更小的距离: ${d}，由点 ${strip[i]} 和点 ${strip[j]} 产生`);
            }
        }
    }
    console.log(`本次分治计算得到的最近点对距离: ${d}`);
    return d;
}

function closest(points) {
    points.sort(compareX);
    console.log(`点集按 x 坐标排序后: ${points}`);
    return closestUtil(points, points.length);
}

// 随机生成二维空间点集
function generateRandomPoints(numPoints) {
    const points = [];
    console.log(`开始生成 ${numPoints} 个随机二维点:`);
    for (let i = 0; i < numPoints; i++) {
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        points.push([x, y]);
        console.log(`生成点 ${i + 1}: (${x}, ${y})`);
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
    