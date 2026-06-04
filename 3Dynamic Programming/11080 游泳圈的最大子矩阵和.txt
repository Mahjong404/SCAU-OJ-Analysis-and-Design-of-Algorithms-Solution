//11080 游泳圈的最大子矩阵和
#include <iostream>
#include <algorithm>
using namespace std;

int a[105][105];    // 扩展矩阵 (2m-1) x (2n-1)

int main() {
    int m, n;
    cin >> m >> n;
    for (int i = 0; i < m; i++)
        for (int j = 0; j < n; j++)
            cin >> a[i][j];

    // 扩展为 (2m-1) x (2n-1)
    for (int i = 0; i < m; i++)
        for (int j = 0; j < n; j++)
            a[i][j + n] = a[i][j];
    for (int i = 0; i < m; i++)
        for (int j = 0; j < 2 * n - 1; j++)
            a[i + m][j] = a[i][j];

    int M = 2 * m - 1, N = 2 * n - 1;
    int ans = -1e9;

    // 枚举起始行
    for (int r1 = 0; r1 < m; r1++) {
        int colSum[105] = {0};
        // 枚举结束行（最多m行）
        for (int r2 = r1; r2 < r1 + m; r2++) {
            // 更新列和
            for (int c = 0; c < N; c++)
                colSum[c] += a[r2][c];

            // 在colSum上求最大子段和（子段长不超过n）
            // 环形最大子段和（长度限制n）
            for (int c1 = 0; c1 < n; c1++) {
                int cur = 0;
                for (int c2 = c1; c2 < c1 + n; c2++) {
                    cur = max(colSum[c2], cur + colSum[c2]);
                    ans = max(ans, cur);
                }
            }
        }
    }

    cout << ans;
    return 0;
}

/*
Description
二维数组首尾相连，上下也相连，像个游泳圈或轮胎，又如何求最大子矩阵和？
如游泳圈展开成3行3列的二维矩阵：
-18 10 7
1 -20 2
1 38 -2
那么最大的子矩阵和为：10+7+38-2=53
若：
2 10 7
1 -20 2
1 38 -2
那么最大的子矩阵和为：10+7+2+38-2+1=56

输入格式
游泳圈展开成平面数组，第一行是行数m和列数n，第二行至第m+1行是数组数值，每行n个数。
1<=m,n<=50

输出格式
最大的子矩阵和

输入样例
3 3
2 10 7
1 -20 2
1 38 -2

输出样例
56

提示
1）先编写一维环形（一圈的形状）长度为len的数据中的最大子段和，且子段长不超过n。
————注意要先调试通过这个程序段，要小心编写，用书上动态规划那段程序修改的话
比较麻烦且易出错，用简单算法改倒是很容易做到的。
2）将游泳圈水平方向上扩展n-1列，垂直方向上扩展m-1行，形成2m-1行2n-1列的扩展矩阵，
在扩展矩阵上求解最大不超过m*n的最大矩阵和。
*/
