def min_insertions_to_palindrome(s):
    n = len(s)
    
    # Step 1: 初始化 DP 表
    dp = [[0] * n for _ in range(n)]
    
    # Step 2: 填充 DP 表
    for length in range(2, n + 1):  # 子串长度从 2 到 n
        for i in range(n - length + 1):
            j = i + length - 1
            if s[i] == s[j]:
                dp[i][j] = dp[i + 1][j - 1]
            else:
                dp[i][j] = min(dp[i + 1][j], dp[i][j - 1]) + 1
    
    # Step 3: 构造回文串
    def construct_palindrome(i, j):
        if i > j:
            return ""
        if i == j:
            return s[i]
        if s[i] == s[j]:
            return s[i] + construct_palindrome(i + 1, j - 1) + s[j]
        if dp[i][j] == dp[i + 1][j] + 1:
            return s[i] + construct_palindrome(i + 1, j) + s[i]
        else:
            return s[j] + construct_palindrome(i, j - 1) + s[j]
    
    # 输出结果
    insertions = dp[0][n - 1]
    palindrome = construct_palindrome(0, n - 1)
    return palindrome, insertions

# 测试用例
s = "121"
palindrome, insertions = min_insertions_to_palindrome(s)
print("回文串:", palindrome)
print("插入的字符个数:", insertions)