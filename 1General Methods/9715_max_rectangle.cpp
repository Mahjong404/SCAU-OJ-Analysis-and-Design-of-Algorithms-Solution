//
// Created by Surtr Muelsyse on 2026/4/9.
//
#include <iostream>
#include <vector>
#include <stack>
#include <algorithm>
using namespace std;

int main() {
    int n;
    cin >> n;

    // 添加哨兵，前后各加一个0
    vector<int> heights(n + 2, 0);
    for (int i = 1; i <= n; i++) {
        cin >> heights[i];
    }

    stack<int> stk;
    int maxArea = 0;

    for (int i = 0; i < n + 2; i++) {
        // 当前高度小于栈顶高度时，计算面积
        while (!stk.empty() && heights[i] < heights[stk.top()]) {
            int h = heights[stk.top()];
            stk.pop();
            // 宽度 = 右边界(i) - 左边界(新栈顶) - 1
            int width = i - stk.top() - 1;
            maxArea = max(maxArea, h * width);
        }
        stk.push(i);
    }

    cout << maxArea << endl;

    return 0;
}