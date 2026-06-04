//11089 多机最佳调度（优先做）
#include <iostream>
#include <algorithm>
using namespace std;

int t[105], len[55], best = 1e9;
int n, m;

// 贪心：LPT
int greedy() {
    int machine[55] = {0};
    sort(t, t + n, greater<int>());
    for (int i = 0; i < n; i++) {
        int mi = 0;
        for (int j = 1; j < m; j++)
            if (machine[j] < machine[mi]) mi = j;
        machine[mi] += t[i];
    }
    return *max_element(machine, machine + m);
}

// 回溯搜索
void dfs(int dep) {
    if (dep == n) {
        int cur = *max_element(len, len + m);
        best = min(best, cur);
        return;
    }
    for (int i = 0; i < m; i++) {
        len[i] += t[dep];
        if (len[i] < best) dfs(dep + 1);
        len[i] -= t[dep];
        if (len[i] == 0) break; // 对称剪枝
    }
}

int main() {
    cin >> n >> m;
    for (int i = 0; i < n; i++) cin >> t[i];

    cout << greedy() << '\n';

    sort(t, t + n, greater<int>());
    best = greedy(); // 贪心解作为初始上界
    fill(len, len + m, 0);
    dfs(0);
    cout << best;

    return 0;
}

/*
Description
假设有n个任务（n<=100），m台机器（m<=50），任务可以由任何一个机器完成，但不可以拆分任务或执行过程中中途停下，
第i个任务完成需要的时间为ti，

请设计两种算法（一种采用贪心算法，另一种采用回溯算法），找出完成这n个任务的最佳调度，使得最早时间完成全部任务。

这里采用两种算法来求解：
1）贪心算法可以得到近似的最早完成时间，算法思想在书上4.7节。
2）回溯算法搜索m叉树（除叶节点外每个节点m个儿子），寻找最早的完成时间。

输入格式
输入两行，第一行为n和m，中间空格相连（其中n表示任务的数量，m表示机器的数量），（n<=100, m<=50）。
第二行的n个数是任务i的处理时间ti。

输出格式
输出两行，第一行为采用贪心算法算出的最早完成时间，第二行为采用回溯算法搜索出的最早完成时间。

输入样例
7 3
2 14 4 16 6 5 3

另一个输入示例：
14 3
10 10 10 10 10 7 7 7 7 7 5 5 5 5

输出样例
17
17

另一个输出示例：
37
35

提示
第（1）个贪心算法按书上思想去实现：总将更长的作业分给最早空闲的机器。

第（2）个就是在m叉树上深度优先搜寻最优解的过程。
//t数组为初始的任务处理时间；
//len2是个数组：m个元素对应m台机的空闲时间，即第二种回溯算法在搜索过程中已探察过任务且针对某台机的完成时间和；
//x数组用来保存探察过的任务编号。
void backtrack (int dep)
{
    if (dep == n) //叶子，或者if (dep>n)，看首次调用backtrack参数是0还是1
    {
        ……       //这个省略号，要你自己来扩展了，要找到最好的叶子（即最早完成时间的一组最优调度）
        return;
    }

    for(int i = 0; i < m; i++)
    {
        len2[i] += t[dep];   //len2数组和t数组如上说明
        x[dep] = i+1;

        if(len2[i] < best)
            backtrack(dep+1);

        len2[i] -= t[dep];
    }
}
*/
