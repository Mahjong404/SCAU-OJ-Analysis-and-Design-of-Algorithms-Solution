//17090 名画陈列馆
#include <iostream>
#include <algorithm>
using namespace std;

int m, n, best;
int grid[22][22]; // 0=未覆盖, 1=已覆盖, 2=有警卫

void cover(int r, int c, int v) {
    grid[r][c] += v;
    if (r > 0) grid[r-1][c] += v;
    if (r < m-1) grid[r+1][c] += v;
    if (c > 0) grid[r][c-1] += v;
    if (c < n-1) grid[r][c+1] += v;
}

void dfs(int pos, int cnt) {
    if (cnt >= best) return;
    if (pos == m * n) {
        // 检查全覆盖
        for (int i = 0; i < m; i++)
            for (int j = 0; j < n; j++)
                if (grid[i][j] <= 0) return;
        best = cnt;
        return;
    }
    int r = pos / n, c = pos % n;
    dfs(pos + 1, cnt);      // 不放
    if (grid[r][c] <= 0) {   // 未被覆盖，必须放（或上方未覆盖则上方已无法覆盖）
        cover(r, c, 1);
        grid[r][c] += 3; // 额外标记有警卫
        dfs(pos + 1, cnt + 1);
        grid[r][c] -= 3;
        cover(r, c, -1);
    }
}

int main() {
    cin >> m >> n;
    best = m * n;
    for (int i = 0; i < m; i++)
        for (int j = 0; j < n; j++)
            grid[i][j] = 0;
    dfs(0, 0);
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
