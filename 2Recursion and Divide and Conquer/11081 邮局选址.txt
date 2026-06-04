//11081 邮局选址
#include <iostream>
#include <algorithm>
#include <cstdlib>
using namespace std;

int x[10005], y[10005];

int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++)
        cin >> x[i] >> y[i];

    // 分别求x和y的中位数
    nth_element(x, x + n / 2, x + n);
    nth_element(y, y + n / 2, y + n);
    int x0 = x[n / 2], y0 = y[n / 2];

    long long dist = 0;
    for (int i = 0; i < n; i++)
        dist += abs(x[i] - x0) + (long long)abs(y[i] - y0);

    cout << dist;
    return 0;
}

/*
Description
道路东西走向和南北走向，将街区划分为格状，x坐标表示东西向，y坐标表示南北向，街区中任意两
点(x1,y1)和(x2,y2)之间距离用|x1-x2|+|y1-y2|度量。
现有n个居民点随机分布在不同街区，已知所有居民点位置(x,y)坐标，在这片区域中选一个邮局的最
佳建设位置，使得n个居民点到邮局的距离总和最小。

输入格式
第一行居民点数n，1<=n<=10000，接下来n行是居民点的位置，每行两个坐标值x和y。

输出格式
这n个居民点到邮局的距离总和最小值。

输入样例
5
1 2
2 2
1 3
3 -2
3 3

输出样例
10

提示
邮局最佳位置(X0,Y0)，X0取所有居民点X坐标的中位数，Y0取所有居民点Y坐标的中位数。
这样可以使得邮局到所有居民点距离之和最小。
*/
