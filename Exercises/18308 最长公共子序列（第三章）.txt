//18308 最长公共子序列（第三章）
#include <iostream>
#include <string>
#include <algorithm>
using namespace std;

int dp[1005][1005];

int main() {
    string a, b;
    cin >> a >> b;
    int n = a.size(), m = b.size();

    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= m; j++)
            if (a[i - 1] == b[j - 1])
                dp[i][j] = dp[i - 1][j - 1] + 1;
            else
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);

    cout << dp[n][m];
    return 0;
}

/*
Description
给定两个字符串，请输出这两个字符串的最大公共子序列

输入格式
两行，一行一个字符串（不包括空格，Tab键）,长度不超过1000

输出格式
输出最大公共子序列的长度

输入样例
abbca
aba

输出样例
3
*/
