//19182 石子合并（基础版）
#include <iostream>
#include <algorithm>
using namespace std;

int a[305], sum[305];
int dp[305][305]; // dp[i][j]: 合并a[i..j]的最小代价

int main() {
    int n;
    cin >> n;
    for (int i = 1; i <= n; i++) {
        cin >> a[i];
        sum[i] = sum[i - 1] + a[i];
    }

    // 区间DP: 按长度递增
    for (int len = 2; len <= n; len++)
        for (int i = 1; i + len - 1 <= n; i++) {
            int j = i + len - 1;
            dp[i][j] = 1e9;
            for (int k = i; k < j; k++)
                dp[i][j] = min(dp[i][j],
                    dp[i][k] + dp[k + 1][j] + sum[j] - sum[i - 1]);
        }

    cout << dp[1][n];
    return 0;
}

/*
Description
设有 N(N≤300) 堆石子排成一排，其编号为1,2,3,⋯,N。每堆石子有一定的质量 mi(mi≤1000)。
现在要将这N堆石子合并成为一堆。每次只能合并相邻的两堆，合并的代价为这两堆石子的质量之和，合并后与这两堆石子相邻的石子将和新堆相邻。
合并时由于选择的顺序不同，合并的总代价也不相同。试找出一种合理的方法，使总的代价最小，并输出最小代价。

输入格式
第一行，一个整数 N。
第二行，N 个整数 mi。

输出格式
输出仅一个整数，也就是最小代价。（题目确保答案在int范围）

输入样例
4
2 5 3 1

输出样例
22

提示
区间动态规划。题解可参考  11078  不能移动的石子合并（优先做）
*/
