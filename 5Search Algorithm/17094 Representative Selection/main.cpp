//17094 代表选择（优先做）
#include <iostream>
#include <algorithm>
#include <cstring>
using namespace std;

int n, m, g[105][105];
int bestX[105], bestY[105], bestMax, bestMin;

// ===== 最大独立集 =====
int isX[105], curX[105];
void dfsInd(int i, int cnt) {
    if (i > n) {
        if (cnt > bestMax) {
            bestMax = cnt;
            for (int k = 1; k <= n; k++) bestX[k] = curX[k];
        }
        return;
    }
    // 剪枝：即使全选也无法更好
    if (cnt + (n - i + 1) <= bestMax) return;

    // 选i（需不与已选的冲突）
    bool ok = true;
    for (int k = 1; k < i && ok; k++)
        if (curX[k] && g[i][k]) ok = false;
    if (ok) {
        curX[i] = 1;
        dfsInd(i + 1, cnt + 1);
    }
    // 不选i
    curX[i] = 0;
    dfsInd(i + 1, cnt);
}

// ===== 最小支配集 =====
int curY[105];
void dfsDom(int i, int cnt) {
    if (i > n) {
        // 检查是否每个点都被支配
        bool ok = true;
        for (int k = 1; k <= n && ok; k++) {
            if (curY[k]) continue; // 自己在支配集中
            bool covered = false;
            for (int j = 1; j <= n; j++)
                if (curY[j] && g[k][j]) { covered = true; break; }
            if (!covered) ok = false;
        }
        if (ok && cnt < bestMin) {
            bestMin = cnt;
            for (int k = 1; k <= n; k++) bestY[k] = curY[k];
        }
        return;
    }
    // 剪枝
    if (cnt >= bestMin) return;

    // 选i
    curY[i] = 1;
    dfsDom(i + 1, cnt + 1);
    // 不选i
    curY[i] = 0;
    dfsDom(i + 1, cnt);
}

int main() {
    cin >> n >> m;
    memset(g, 0, sizeof(g));
    for (int i = 0; i < m; i++) {
        int u, v; cin >> u >> v;
        g[u][v] = g[v][u] = 1;
    }

    // 最大独立集
    bestMax = 0; memset(curX, 0, sizeof(curX));
    dfsInd(1, 0);
    cout << bestMax << '\n';
    for (int i = 1; i <= n; i++) cout << bestX[i] << (i < n ? ' ' : '\n');

    // 最小支配集
    bestMin = n + 1;
    dfsDom(1, 0);
    cout << bestMin << '\n';
    for (int i = 1; i <= n; i++) cout << bestY[i] << (i < n ? ' ' : '\n');

    return 0;
}

/*
Description
社区共n个人，编号1, 2, ..., n。 但这n个人中，有的人之间是亲友关系。现在，
（1）要从这n个人中选取尽可能多的代表作为"选举候选人"，为了体现民主，选上的任何两个
代表不能是直接亲友关系。
（2）要从这n个人中选取尽可能少的代表作为"信息传递员"，为了节约人力，希望这些信息传
递员能将上级传达的信息直接传递到其亲友处（一步传递到位，不考虑信息多步转发）。

现请你来组"最大的选举候选人队伍"，使得这个队伍人数最大，但队伍中任何两个代表不能是
直接的亲友关系。
另外你也来组"最小的信息传递员队伍"，使得这个队伍人数最少，但队伍中成员能够将亲友关
系覆盖到所有社区的n个人。

其实，第一个问题是无向图的最大独立集问题，第二个问题是无向图的最小支配集的问题，这两
个问题都是NP完全问题。

输入格式
输入整个社区人数n，和有亲友关系的关系数m。（n,m < 100）
接下来m行，每行两个整数，代表有亲友关系的两人u和v。  （1<= u,v <=n）

输出格式
第一行先输出能组建的"最大候选人队伍"的人数。
第二行是一个向量：xi （1<= i <=n）， xi=1表示居民i在候选人队伍中，
否则xi=0表示居民i不在候选人队伍中。
第三行再输出能组建的"最小传递员队伍"的人数。
第四行是一个向量：yi （1<= i <=n）， yi=1表示居民i在传递员队伍中，
否则yi=0表示居民i不在传递员队伍中。

注：若同是最大的候选队伍有多个向量解，输出"居民编号小的优先选上"的这组解。同理，
若同是最小的传递员队伍有多个向量解，输出"居民编号小的优先选上"的这组解。

输入样例
7 10
1 2
1 4
2 4
2 3
2 5
2 6
3 5
3 6
4 5
5 6

输出样例
3
1 0 1 0 0 0 1
2
0 1 0 0 0 0 1

提示
最后这几题：
17094 代表选择（最大独立集和最小支配集的问题）
17095 最小权顶点覆盖问题
17096 无向图最大割问题
其实是很接近的，都可以采用相似的子集树深度优先搜索找到最优解，所不同的是找到符合叶结点的
判断根据题意不同而不同。

结果向量：
（x1, x2, ..., xn）    xi=1表示居民i在候选人队伍中，否则xi=0表示居民i不在候选人队伍中。
从x1=1开始深度搜索，到达叶结点时，也就已试探某一向量（x1, x2, ..., xn），判断此时任何
两个是否有边相连，并记录下符合独立集条件的向量分量为1的个数，搜索完即可返回符合独立集
条件的最大人数。

（y1, y2, ..., yn）    yi=1表示居民i在传递员队伍中，否则yi=0表示居民i不在传递员队伍中。
从y1=1开始深度搜索，到达叶结点时，也就已试探某一向量（y1, y2, ..., yn），判断此时任何
一个点要么选入支配集，要么和某个已选入的支配集相连。并记录下符合支配集条件的向量分量
为1的个数，搜索完即可返回符合支配集条件的最少人数。
*/
