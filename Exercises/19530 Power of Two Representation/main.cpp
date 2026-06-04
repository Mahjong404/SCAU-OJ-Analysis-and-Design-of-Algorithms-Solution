//19530 2的幂次方表示
#include <iostream>
#include <string>
using namespace std;

// 返回k作为指数的表示（即2(k)中的k部分）
// k=0 → 2(0), k=1 → 2, k>1 → 2(rep(k))
string powRep(int k) {
    if (k == 0) return "2(0)";
    if (k == 1) return "2";
    // 递归分解k
    string inner;
    bool first = true;
    for (int j = 15; j >= 0; j--) {
        if (k & (1 << j)) {
            if (!first) inner += "+";
            inner += powRep(j);
            first = false;
        }
    }
    return "2(" + inner + ")";
}

int main() {
    int n; cin >> n;
    string ans;
    bool first = true;
    for (int k = 15; k >= 0; k--) {
        if (n & (1 << k)) {
            if (!first) ans += "+";
            ans += powRep(k);
            first = false;
        }
    }
    cout << ans;
    return 0;
}

/*
Description
任何一个正整数都可以用2的幂次方表示。例如：
137 = 2^7 + 2^3 + 2^0
同时约定次方用括号来表示，即a^b可表示为a(b)。
由此可知，137可表示为：
2(7)+2(3)+2(0)
进一步：7 = 2^2 + 2^1 + 2^0（2^1用2表示）
3 = 2^1 + 2^0
所以最后137可表示为：
2(2(2)+2+2(0))+2(2+2(0))+2(0)
又如：1315 = 2^10 + 2^8 + 2^5 + 2^1 + 2^0
所以1315最后可表示为：
2(2(2+2(0))+2)+2(2(2+2(0)))+2(2(2)+2(0))+2+2(0)

输入格式
一个正整数n（n<=20000）。

输出格式
一行，符合约定的n的0，2表示（在表示中不能有空格）。

输入样例
137

输出样例
2(2(2)+2+2(0))+2(2+2(0))+2(0)
*/
