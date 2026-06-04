//17098 广告牌最佳安放问题
#include <iostream>
#include <algorithm>
using namespace std;

int x[100005], r[100005], dp[100005];

int main() {
    ios::sync_with_stdio(false); cin.tie(0);
    int M, n;
    cin >> M >> n;
    for (int i = 1; i <= n; i++) cin >> x[i];
    for (int i = 1; i <= n; i++) cin >> r[i];

    // dp[i]: 考虑前i个广告牌位置的最大收益
    dp[0] = 0;
    int best = 0;
    for (int i = 1; i <= n; i++) {
        // 找最右边满足距离>5的位置j
        int j = i - 1;
        while (j >= 1 && x[i] - x[j] <= 5) j--;
        dp[i] = max(dp[i - 1], (j >= 1 ? dp[j] : 0) + r[i]);
        best = max(best, dp[i]);
    }
    cout << best;
    return 0;
}

/*
Description
有一条路从西向东M公里，是一段旅行的公路。
在这段公路上放置n块广告牌，广告牌的地点：x1,x2,...,xn。
如果你放一块广告牌在地点xi，就能获得ri的收益(ri>0)。
该地公路局规定：两块广告牌不能小于或等于5公里。
现在请你挑选并安排这些广告牌放置地点，使得你的总收益在公路局规定的限制下达到最大。

输入格式
第一行：公路长度M，广告牌的总数n，中间空格。（M<100000， n<M）
第二行：广告牌安置地点向量：x1  x2  ...  xn
第三行：广告牌安置收益向量：r1  r2  ...  rn

输出格式
第一行：最大总收益。

输入样例
20 4
6 7 12 14
5 6 5 1

输出样例
10
解释：这里指挑选1和3号广告牌是效益最优（总效益为10）且符合公路局规定的方案。

提示
定义符号：
广告牌安置地点向量：x1  x2  ...  xn
广告牌安置收益向量：r1  r2  ...  rn
假设d[i]表示：从西向东到第i个广告牌地点xi处，可选择放置广告牌的最大效益值。
（1）i=1时，d[1]=r1；
（2）i>1时，d[i]=max｛d[i-1]，d[j]+ri | for all possible j, 1<=j<=i && si-sj>5 ｝
d[n]就是原问题所求的符合公路局规定的最大广告效益和。
*/
