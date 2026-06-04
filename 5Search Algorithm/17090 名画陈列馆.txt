//17090 名画陈列馆
#include <iostream>
#include <algorithm>
using namespace std;

int m, n, best, uncovered;
int grid[22][22];

void put(int r, int c, int v) {
    grid[r][c] += v;
    if (grid[r][c] > 0 && grid[r][c] - v <= 0) uncovered--;
    else if (grid[r][c] <= 0 && grid[r][c] - v > 0) uncovered++;
    if (r > 0) {
        grid[r-1][c] += v;
        if (grid[r-1][c] > 0 && grid[r-1][c] - v <= 0) uncovered--;
        else if (grid[r-1][c] <= 0 && grid[r-1][c] - v > 0) uncovered++;
    }
    if (r < m-1) {
        grid[r+1][c] += v;
        if (grid[r+1][c] > 0 && grid[r+1][c] - v <= 0) uncovered--;
        else if (grid[r+1][c] <= 0 && grid[r+1][c] - v > 0) uncovered++;
    }
    if (c > 0) {
        grid[r][c-1] += v;
        if (grid[r][c-1] > 0 && grid[r][c-1] - v <= 0) uncovered--;
        else if (grid[r][c-1] <= 0 && grid[r][c-1] - v > 0) uncovered++;
    }
    if (c < n-1) {
        grid[r][c+1] += v;
        if (grid[r][c+1] > 0 && grid[r][c+1] - v <= 0) uncovered--;
        else if (grid[r][c+1] <= 0 && grid[r][c+1] - v > 0) uncovered++;
    }
}

void dfs(int r, int c, int cnt) {
    if (cnt >= best) return;
    // 下界剪枝：每个警卫最多覆盖5格
    if (cnt + (uncovered + 4) / 5 >= best) return;

    while (r < m && grid[r][c] > 0) {
        c++;
        if (c == n) { r++; c = 0; }
    }

    if (r == m) { best = cnt; return; }

    // 必须覆盖(r,c)：三个选项
    put(r, c, 1);
    if (c + 1 < n) dfs(r, c + 1, cnt + 1);
    else dfs(r + 1, 0, cnt + 1);
    put(r, c, -1);

    if (c + 1 < n) {
        put(r, c + 1, 1);
        if (c + 2 < n) dfs(r, c + 2, cnt + 1);
        else dfs(r + 1, 0, cnt + 1);
        put(r, c + 1, -1);
    }

    if (r + 1 < m) {
        put(r + 1, c, 1);
        if (c + 1 < n) dfs(r, c + 1, cnt + 1);
        else dfs(r + 1, 0, cnt + 1);
        put(r + 1, c, -1);
    }
}

int main() {
    cin >> m >> n;
    best = m * n / 3 + 1;
    if (best < 1) best = 1;
    uncovered = m * n;
    for (int i = 0; i < m; i++)
        for (int j = 0; j < n; j++)
            grid[i][j] = 0;
    dfs(0, 0, 0);
    cout << best;
    return 0;
}

/*
Description
名画陈列馆是m*n个矩形陈列室组成，为防止名画被盗，需要在陈列室中设置警卫机器人哨位。每个警卫
机器人除了监视它所在的陈列室外，还可以监视它所在位置的上、下、左、右四个陈列室。
现在希望所用的警卫机器人数量最少，使得每个陈列室都处于至少一个警卫机器人的监视之下。
请求解：设置监视哨位所需的最少的警卫机器人数？

输入格式
m和n。（1<=m,n<=20）

输出格式
最少的机器人数。
比如4*4的陈列馆，则按如下设置岗哨（m行n列表示机器人的哨位，0代表无哨位，1代表有哨位），可以
使机器人数最少为4个。
0 0 1 0
1 0 0 0
0 0 0 1
0 1 0 0
注意这里只须输出最少的机器人数，对如何设置岗哨无需你输出。

输入样例
4 4

输出样例
4

提示
*/
