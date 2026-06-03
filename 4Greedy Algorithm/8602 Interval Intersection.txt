//8602 区间相交问题（优先做）
#include <iostream>
#include <algorithm>
using namespace std;

struct Seg { int l, r; };
Seg s[55];

int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        cin >> s[i].l >> s[i].r;
        if (s[i].l > s[i].r) swap(s[i].l, s[i].r);
    }
    sort(s, s + n, [](Seg& a, Seg& b) { return a.r < b.r; });

    int kept = 1, last = s[0].r;
    for (int i = 1; i < n; i++)
        if (s[i].l >= last) { kept++; last = s[i].r; }

    cout << n - kept;
    return 0;
}

/*
Description
给定x轴上n个闭区间，去掉尽可能少的闭区间，使剩下的闭区间都不相交。
注意：这里，若区间与另一区间之间仅有端点是相同的，不算做区间相交。
例如，[1，2]和[2，3]算是不相交区间。

输入格式
第一行一个正整数n(n<=50)，表示闭区间数。
接下来n行中，每行2个整数，表示闭区间的2个整数端点。

输出格式
输出去掉的最少的闭区间数。

输入样例
3
10 20
10 15
12 15

输出样例
2

提示
这个问题基本等同于书本的活动安排问题。
*/
