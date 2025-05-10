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
    