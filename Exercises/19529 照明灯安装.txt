//19529 照明灯安装
#include <iostream>
#include <algorithm>
using namespace std;

int x[100005];

int main() {
    ios::sync_with_stdio(false); cin.tie(0);
    int n, k;
    cin >> n >> k;
    for (int i = 0; i < n; i++) cin >> x[i];

    int lo = 1, hi = x[n - 1] - x[0], ans = 0;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        int cnt = 1, last = x[0];
        for (int i = 1; i < n; i++)
            if (x[i] - last >= mid) { cnt++; last = x[i]; }
        if (cnt >= k) { ans = mid; lo = mid + 1; }
        else hi = mid - 1;
    }
    cout << ans;
    return 0;
}

/*
Description
2023滴滴笔试题 0915
你负责在一条笔直的道路上安装一些照明灯。但是道路上并不是任意位置都适合安装照明灯，具体地，假设将道路看作一条起点坐标为0，终点坐标为M的线段，
那么只有在x1,x2,...,xn这n个坐标可以安装照明灯，且每个坐标上最多只能安装一个照明灯。
现在你要在道路上安装k个照明灯，为了使照明灯能够尽量覆盖道路，
你需要使距离最近的两个照明灯尽量远。请问这个最近距离最大可以是多少?

输入格式
第一行是两个整数n、k，分别表示可以安装照明灯的位置数和需要安装的照明灯数量。
2<=k<=n<=100000
接下来一行n个整数x1,x2,...,xn表示可以安装照明灯的坐标。保证x1<x2<...<xn。
1<xi<1000000

输出格式
一个整数，表示最大最近距离。

输入样例
5 3
1 3 4 7 9

输出样例
3
*/
