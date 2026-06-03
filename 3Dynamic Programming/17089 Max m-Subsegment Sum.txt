//17089 最大m子段和
#include <iostream>
#include <algorithm>
#include <cstring>
using namespace std;

int a[10005];
int b[10005]; // b[i]: 前i个元素选j-1段的最大和（上一轮）
int c[10005]; // c[i]: 以第i个元素结尾的j段最大和

int main() {
    ios::sync_with_stdio(false); cin.tie(0);
    int n, m;
    cin >> n >> m;
    for (int i = 1; i <= n; i++) cin >> a[i];

    memset(b, 0, sizeof(b));
    memset(c, 0, sizeof(c));

    int ans = 0;
    for (int j = 1; j <= m; j++) {
        c[j - 1] = 0;
        int maxEnd = -1e9;
        for (int i = j; i <= n; i++) {
            // c[i] = max(连续到前一个元素, 从b[i-1]新开一段) + a[i]
            c[i] = max(c[i - 1], b[i - 1]) + a[i];
            // 更新b[i-1]为考虑了当前段的最优值，供下一轮(j+1)使用
            b[i - 1] = maxEnd;
            maxEnd = max(maxEnd, c[i]);
        }
        b[n] = maxEnd;
        ans = max(ans, maxEnd);
    }

    cout << max(ans, 0);
    return 0;
}

/*
Description
"最大m子段和"问题：给定由n个整数（可能为负）组成的序列a1、a2、a3、...、an，以及一个正整数m，
要求确定序列的m个不相交子段，使这m个子段的总和最大！
m是子段的个数。当m个子段的每个子段和都是负值时，定义m子段和为0。

输入格式
第一行：n和m；   （n,m<10000）
第二行：n个元素序列，中间都是空格相连。
比如：
6 3
2 3 -7 6 4 -5

输出格式
输出最大m子段和。
比如：
15
这15可由这三个段之和来的：（2 3） -7 （6） （4） -5

输入样例
6 3
2 3 -7 6 4 -5

输出样例
15

提示
这个题，书上有完整的递归公式分析和源代码P58-59，按照书上的思想就可以完美通过了。
注意一下：书上P58的代码完全准确，但P59的优化代码，引入了c[]数组，但未对c数组全部初始化，
只初始化了c[1]，后面的循环中可能会用到未初始化的某个c元素，从而导致结果不正确。因此用
下面代码替换了书上的c[1]=0;这条语句。
for(int i=0; i<=n; i++) c[i]=0;
*/
