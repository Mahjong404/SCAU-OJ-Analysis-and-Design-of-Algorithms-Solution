//8604 运动员最佳配对问题
#include <iostream>
#include <algorithm>
using namespace std;

int n, P[12][12], Q[12][12], best = -1;
int x[12];        // 当前女运动员排列
bool used[12];

void dfs(int i, int cur) {
    if (i > n) { best = max(best, cur); return; }
    // 上界剪枝：计算剩余最大可能
    int bound = cur;
    for (int k = i; k <= n; k++) {
        int mx = 0;
        for (int j = 1; j <= n; j++)
            if (!used[j]) mx = max(mx, P[k][j] * Q[j][k]);
        bound += mx;
    }
    if (bound <= best) return;

    for (int j = 1; j <= n; j++) {
        if (used[j]) continue;
        used[j] = true;
        x[i] = j;
        dfs(i + 1, cur + P[i][j] * Q[j][i]);
        used[j] = false;
    }
}

int main() {
    cin >> n;
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= n; j++) cin >> P[i][j];
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= n; j++) cin >> Q[i][j];
    dfs(1, 0);
    cout << best;
    return 0;
}

/*
Description
羽毛球队有男女运动员各n人。
给定2 个n×n矩阵P和Q。P[i][j]是男运动员i和女运动员j配对组成混合双打的男运动员竞赛优势；
Q[i][j]是女运动员j和男运动员i配合的女运动员竞赛优势。
由于技术配合和心理状态等各种因素影响，P[i][j]不一定等于Q[i][j]。男运动员i和女运动员j配
对组成混合双打的男女双方竞赛优势为P[i][j]*Q[i][j]。
设计一个算法，计算男女运动员最佳配对法，使各组男女双方竞赛优势的总和达到最大。
编程任务：设计一个算法，对于给定的男女运动员竞赛优势，计算男女运动员最佳配对法，使各组男
女双方竞赛优势的总和达到最大。
如下面sample的数据：
P=
10 2 3
2 3 4
3 4 5
Q=
2 2 2
3 5 3
4 5 1
最大的男女双方竞赛优势总和为：10*2 + 4*5 + 4*3 = 52
最佳搭配为：（女1，男1）（女2，男3）（女3，男2）

输入格式
输入数据第一行有1 个正整数n (1≤n≤10)。接下来的2n行，每行n个数。前n行是P，后n行是Q。

输出格式
将计算出的男女双方竞赛优势的总和的最大值输出。

输入样例
3
10 2 3
2 3 4
3 4 5
2 2 2
3 5 3
4 5 1

输出样例
52

提示
让男队员按自己编号顺序站定，女运动员和他们搭配的各种组合就是女运动员的各种排列。
（如果你让女运动员按编号顺序站定，男运动员各种排列和她们搭配，也可以！）
因此，搜索的解空间树是"排列树"。
搜索的算法可以参考书本上"批处理作业调度问题"一节或"旅行售货员问题"的解法，因为都是排列树的搜索。
套用排列树回溯搜索的框架来写。
*/
