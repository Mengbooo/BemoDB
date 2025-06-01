# 定义无穷大
INF = float('inf')

# 节点数
n = 5

# 构建邻接矩阵（节点从0到4对应1到5）
adj_matrix = [
    # 行代表起点，列代表终点
    #    1   2   3   4   5
    #    0   1   2   3   4
    [  0,  3,  8, INF, -4],  # 1
    [INF, 0, INF,  1,  7],   # 2
    [INF,  4,  0, INF, INF], # 3
    [  2, INF, -5,  0, INF], # 4
    [INF, INF, INF,  60,  0]  # 5
]

# 初始化距离矩阵和路径矩阵
dist = [[adj_matrix[i][j] for j in range(n)] for i in range(n)]
path = [[-1 if adj_matrix[i][j] == INF else j for j in range(n)] for i in range(n)]

# Floyd-Warshall 算法
def floyd_warshall():
    for k in range(n):
        for i in range(n):
            for j in range(n):
                if dist[i][k] + dist[k][j] < dist[i][j]:
                    dist[i][j] = dist[i][k] + dist[k][j]
                    path[i][j] = path[i][k]

# 非递归方式获取路径
def get_path(start, end):
    if dist[start][end] == INF:
        return []

    path_list = []
    curr = start
    while curr != end:
        path_list.append(curr + 1)
        next_node = path[curr][end]
        if next_node == -1:
            return []  # 无法找到完整路径
        curr = next_node
    path_list.append(end + 1)
    return path_list

# 主函数
if __name__ == "__main__":
    floyd_warshall()

    print("所有点对之间的最短路径结果如下：")
    for i in range(n):
        for j in range(n):
            if i != j:
                p = get_path(i, j)
                if not p:
                    print(f"从 {i+1} 到 {j+1}: 不可达")
                else:
                    print(f"从 {i+1} 到 {j+1}: 长度 = {dist[i][j]}, 路径 = {p}")