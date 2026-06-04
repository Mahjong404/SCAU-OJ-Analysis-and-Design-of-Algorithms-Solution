//17081 宝石排列问题
#include <iostream>
#include <cstring>
using namespace std;

int n, ans;
bool rowShape[6][6], colShape[6][6];
bool rowColor[6][6], colColor[6][6];
bool gemUsed[6][6]; // gemUsed[s][c]: 形状s颜色c的宝石是否已用

void dfs(int r, int c) {
    if (r == n) { ans++; return; }
    int nr = (c == n - 1) ? r + 1 : r;
    int nc = (c == n - 1) ? 0 : c + 1;
    for (int s = 0; s < n; s++)
        if (!rowShape[r][s] && !colShape[c][s])
            for (int cl = 0; cl < n; cl++)
                if (!rowColor[r][cl] && !colColor[c][cl] && !gemUsed[s][cl]) {
                    rowShape[r][s] = colShape[c][s] = true;
                    rowColor[r][cl] = colColor[c][cl] = true;
                    gemUsed[s][cl] = true;
                    dfs(nr, nc);
                    rowShape[r][s] = colShape[c][s] = false;
                    rowColor[r][cl] = colColor[c][cl] = false;
                    gemUsed[s][cl] = false;
                }
}

int main() {
    cin >> n;
    memset(rowShape, 0, sizeof(rowShape));
    memset(colShape, 0, sizeof(colShape));
    memset(rowColor, 0, sizeof(rowColor));
    memset(colColor, 0, sizeof(colColor));
    ans = 0;
    dfs(0, 0);
    cout << ans;
    return 0;
}

/*
Description
问题描述：现有n种不同形状的宝石，每种n颗，共n*n颗。
同一种形状的n颗宝石分别具有n种不同的颜色c1, c2, ...,cn中的一种颜色。
欲将这n*n颗宝石排列成n行n列的一个方阵，使方阵中每一行和每一列的宝石都有n种不同形状和n种不同颜色。
试设计一个算法，计算出对于给定的n，有多少种不同的宝石排列方案数。

输入格式
每组测试数据为1个正整数n，0<n<6。

输出格式
输出宝石排列方案数。

输入样例
2

输出样例
0
*/
