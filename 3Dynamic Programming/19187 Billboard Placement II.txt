//19187 广告牌最佳安放问题（二）
#include <iostream>
#include <algorithm>
using namespace std;

int x[1005], r[1005];
int dp[1005][1005];   // dp[i][j]: 前i个位置选j个且第i个必选的最大收益
int best[1005][1005]; // best[i][j]: 前i个位置选j个的最大收益（不一定选i）

int main() {
    ios::sync_with_stdio(false); cin.tie(0);
    int T, n, m;
    cin >> T >> n >> m;
    for (int i = 1; i <= n; i++) cin >> x[i];
    for (int i = 1; i <= n; i++) cin >> r[i];

    // dp[i][1] = r[i]
    for (int i = 1; i <= n; i++) {
        dp[i][1] = r[i];
        best[i][1] = max(best[i - 1][1], dp[i][1]);
    }

    for (int j = 2; j <= m; j++) {
        int ptr = 0; // 最大满足 x[i] - x[ptr] > 5 的位置
        for (int i = j; i <= n; i++) {
            // 移动ptr到满足距离约束的最右位置
            while (ptr + 1 < i && x[i] - x[ptr + 1] > 5)
                ptr++;
            if (ptr >= j - 1)
                dp[i][j] = best[ptr][j - 1] + r[i];
            else
                dp[i][j] = -1e9;
            best[i][j] = max(best[i - 1][j], dp[i][j]);
        }
    }

    cout << best[n][m];
    return 0;
}

/*
Description
有一条路从西向东T公里，是一段旅行的公路。
在这段公路上放置n块广告牌，广告牌的地点：x1,x2,...,xn。
如果你放一块广告牌在地点xi，就能获得ri的收益(ri>0)。
该地公路局规定：两块广告牌不能小于或等于5公里。
现在请你挑选m个广告牌的放置地点，使得你的总收益在公路局规定的限制下达到最大。
PS：本题目的数据确保一定能放置K块广告牌。

输入格式
第一行：公路长度T，广告牌的总数n，需要放置广告牌数量m。（k<=n<=1000）
第二行：广告牌安置地点向量：x1  x2  ...  xn
第三行：广告牌安置收益向量：r1  r2  ...  rn

输出格式
第一行：最大总收益。

输入样例
20 5 2
6 7 12 14 19
5 6 5 1 5

输出样例
11
解释：选择2块广告牌，这里挑选2和5号广告牌是效益最优（总效益为11）且符合公路局规定的方案。
*/
