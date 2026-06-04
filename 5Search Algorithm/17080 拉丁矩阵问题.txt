//17080 拉丁矩阵问题
#include <iostream>
#include <cstring>
using namespace std;

int m, n, ans;
int g[6][6]; // g[i][j] = 宝石类型(1-based)
bool rowUsed[6][6], colUsed[6][6]; // [row/col][type]

void dfs(int r, int c) {
    if (r == m) { ans++; return; }
    int nr = (c == n - 1) ? r + 1 : r;
    int nc = (c == n - 1) ? 0 : c + 1;
    for (int t = 1; t <= n; t++) {
        if (!rowUsed[r][t] && !colUsed[c][t]) {
            g[r][c] = t;
            rowUsed[r][t] = colUsed[c][t] = true;
            dfs(nr, nc);
            rowUsed[r][t] = colUsed[c][t] = false;
        }
    }
}

int main() {
    cin >> m >> n;
    memset(rowUsed, 0, sizeof(rowUsed));
    memset(colUsed, 0, sizeof(colUsed));
    ans = 0;
    dfs(0, 0);
    cout << ans;
    return 0;
}

/*
Description
现有n种不同形状的宝石，每种宝石足够多。
欲将这些宝石排列成m行n列的一个矩阵，m<=n，使矩阵中每一行和每一列的宝石都没有相同形状。
试设计一个搜索算法，计算对于给定的m和n，有多少种不同的宝石排列方案。

输入格式
m和n，0<m<=n<6。m在前，空格相连。

输出格式
宝石排列方案数。

输入样例
3 3

输出样例
12

提示
这是二维（行和列两个维度）的回溯搜索问题。
*/
