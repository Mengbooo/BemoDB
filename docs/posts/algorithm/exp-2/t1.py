def schedule(a, t, e, x):
    n = len(a[0])
    f1 = [0] * n 
    f2 = [0] * n 

    l1 = [0] * n
    l2 = [0] * n 
    final_l = 0 

    f1[0] = e[0] + a[0][0]
    f2[0] = e[1] + a[1][0]

    l1[0] = 1
    l2[0] = 2

    for j in range(1, n):
        if f1[j - 1] + a[0][j] <= f2[j - 1] + t[1][j - 1] + a[0][j]:
            f1[j] = f1[j - 1] + a[0][j]
            l1[j] = 1
        else:
            f1[j] = f2[j - 1] + t[1][j - 1] + a[0][j]
            l1[j] = 2

        if f2[j - 1] + a[1][j] <= f1[j - 1] + t[0][j - 1] + a[1][j]:
            f2[j] = f2[j - 1] + a[1][j]
            l2[j] = 2
        else:
            f2[j] = f1[j - 1] + t[0][j - 1] + a[1][j]
            l2[j] = 1

    if f1[n - 1] + x[0] <= f2[n - 1] + x[1]:
        min_time = f1[n - 1] + x[0]
        final_l = 1
    else:
        min_time = f2[n - 1] + x[1]
        final_l = 2

    path = [0] * n
    current_line = final_l
    path[n - 1] = current_line

    for j in range(n - 1, 0, -1):
        if current_line == 1:
            current_line = l1[j]
        else:
            current_line = l2[j]
        path[j - 1] = current_line

    return min_time, [p - 1 for p in path]


a = [[7, 9, 3, 4, 80],
     [8, 5, 6, 4, 5]]

t = [[2, 3, 1, 3],
     [2, 1, 2, 2]]

e = [2, 4]
x = [3, 6]

min_total_time, schedule_path = schedule(a, t, e, x)

print(f"min total time: {min_total_time}")
print("schedule path:")
work_schedule = []
for i, line_number in enumerate(schedule_path):
    work_schedule.append(f"work station S_{line_number+1},{i+1}")
print(" -> ".join(work_schedule))