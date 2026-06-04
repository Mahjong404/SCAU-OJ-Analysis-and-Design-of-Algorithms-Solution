//17085 工作分配问题（优先做）
#include <iostream>
#include <algorithm>
using namespace std;

int n, C[12][12], best = 1e9;
int x[12], bestX[12];
bool used[12];

void dfs(int i, int cur) {
    if (cur >= best) return; // 剪枝
    if (i > n) {
        best = cur;
        for (int k = 1; k <= n; k++) bestX[k] = x[k];
        return;
    }
    for (int j = 1; j <= n; j++) {
        if (used[j]) continue;
        used[j] = true;
        x[i] = j;
        dfs(i + 1, cur + C[i][j]);
        used[j] = false;
    }
}

int main() {
    cin >> n;
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= n; j++)
            cin >> C[i][j];
    dfs(1, 0);
    cout << best << '\n';
    for (int i = 1; i <= n; i++)
        cout << bestX[i] << (i < n ? ' ' : '\n');
    return 0;
}

/*
Description
有n件工作分配给n个人，将工作i分配给第j个人需要支付劳务费用Cij。请为每人分配一个工作，并使得总劳务费用达到最小。

输入格式
第一行一个正整数n（1<=n<=11），表示n个工作数，接下来n行，每行代表第i个工作支付给n个不同的人的劳务费用。

输出格式
两行。
第一行为最小的总劳务费用。
第二行有n个数，表示工作分配方案。
如下面sample用例的测试数据：
第二行是2 1 3，表示第1个工作分配给第2个人，第2个工作分配给第1个人，第3个工作分配给第3个人。 2+2+5=9
当同时有多种分配方案都能使得总劳务费用相同且都最小，按递归序输出第一种方案即可（注意递归序并非字典序）。

输入样例
3
10 2 3
2 3 4
3 4 5

输出样例
9
2 1 3

提示
n个人，任何一种站队排列，都构成搜索的情况。因此，搜索的解空间树是"排列树"。
搜索的算法可以参考书本上"批处理作业调度问题"或"旅行售货员问题"的解法，因为都是排列树的搜索。
套用排列树的回溯算法搜索框架来实现。
*/
