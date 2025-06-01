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
    // console.log("P1:", P1);
    const P2 = strassen(addMatrices(A11, A12), B22);
    // console.log("P2:", P2);
    const P3 = strassen(addMatrices(A21, A22), B11);
    // console.log("P3:", P3);
    const P4 = strassen(A22, subtractMatrices(B21, B11));
    // console.log("P4:", P4);
    const P5 = strassen(addMatrices(A11, A22), addMatrices(B11, B22));
    // console.log("P5:", P5);
    const P6 = strassen(subtractMatrices(A12, A22), addMatrices(B21, B22));
    // console.log("P6:", P6);
    const P7 = strassen(subtractMatrices(A11, A21), addMatrices(B11, B12));
    // console.log("P7:", P7);
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