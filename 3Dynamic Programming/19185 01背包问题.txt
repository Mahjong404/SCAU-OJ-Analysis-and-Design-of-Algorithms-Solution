//19185 01背包问题
#include <iostream>
#include <algorithm>
using namespace std;

int dp[205];

int main() {
    int M, n, w, c;
    cin >> M >> n;
    for (int i = 0; i < n; i++) {
        cin >> w >> c;
        for (int j = M; j >= w; j--)
            dp[j] = max(dp[j], dp[j - w] + c);
    }
    cout << dp[M];
    return 0;
}

/*
Description
一个旅行者有一个最多能装 M公斤的背包，现在有 n件物品，它们的重量分别是W1，W2，...,。
它们的价值分别为C1,C2,...,，求旅行者在不超过背包重量M的情况下，能获得最大总价值。
PS：01背包问题也能用于个人的时间管理，如何分配时间在不同的任务上，才能最大化提升个人价值。

输入格式
第一行：两个整数，M(背包容量，M<=200)和N(物品数量，N<=30)；
第2..N+1行：每行二个整数Wi，Ci，表示每个物品的重量和价值。

输出格式
一个数，表示最大总价值。

输入样例
10 4
2 1
3 3
4 5
7 9

输出样例
12

提示
通过的同学可以查看标程，提供了二维数组和一位数组两种写法。
*/
