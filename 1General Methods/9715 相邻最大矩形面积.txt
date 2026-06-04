//9715 相邻最大矩形面积
#include <iostream>
#include <vector>
#include <stack>
#include <algorithm>
using namespace std;

int main() {
    int n;
    cin >> n;

    // 前后各加一个哨兵0
    vector<int> h(n + 2, 0);
    for (int i = 1; i <= n; i++) cin >> h[i];

    stack<int> stk;
    int maxArea = 0;

    for (int i = 0; i < n + 2; i++) {
        // 当前高度小于栈顶高度时，弹出栈顶并计算面积
        while (!stk.empty() && h[i] < h[stk.top()]) {
            int height = h[stk.top()];
            stk.pop();
            int width = i - stk.top() - 1;  // 左右边界之间的宽度
            maxArea = max(maxArea, height * width);
        }
        stk.push(i);
    }

    cout << maxArea;
    return 0;
}

/*
Description
在X轴上水平放置着 N 个条形图，这 N 个条形图就组成了一个柱状图，每个条形图都是一个矩形，每个
矩形都有相同的宽度，均为1单位长度，但是它们的高度并不相同。

你的任务就是计算柱状图中以X轴为底边的最大矩形的面积。

输入格式
输入数据的第一行是一个整数 N(1≤ N ≤100000)，表示柱状图包含 N 个矩形。
紧接着 N 个整数h1,...,hn(0≤ hi ≤20000, 1≤ i≤ N)，表示柱状图中按从左到右顺序给出的矩形
的高度。矩形的宽度为1。

输出格式
输出一个整数S，表示以X轴为底边的最大矩形的面积。

输入样例
7
2 1 4 5 1 3 3

输出样例
8

提示
这个问题，用简单的方法分析，寻找相邻几个矩形竖条最矮个构成的大矩形。O(n^2)的算法是比较容易实现的。
提示：用单调栈可以做到O(n)。
*/
