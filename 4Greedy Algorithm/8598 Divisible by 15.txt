//8598 整除15 问题
#include <iostream>
#include <string>
#include <algorithm>
using namespace std;

int cnt[10];

int main() {
    string s;
    cin >> s;
    for (char c : s) cnt[c - '0']++;

    // 必须含0或5才能被5整除
    if (cnt[0] == 0 && cnt[5] == 0) { cout << "impossible"; return 0; }

    int sum = 0;
    for (int i = 0; i < 10; i++) sum += i * cnt[i];
    int rem = sum % 3;

    // 删除最少最小数字使sum%3==0
    if (rem == 1) {
        // 优先删一个余1的最小数(1,4,7)
        if (cnt[1]) cnt[1]--;
        else if (cnt[4]) cnt[4]--;
        else if (cnt[7]) cnt[7]--;
        // 否则删两个余2的最小数(2,5,8)
        else {
            for (int i = 0; i < 2; i++) {
                if (cnt[2]) cnt[2]--;
                else if (cnt[5]) cnt[5]--;
                else if (cnt[8]) cnt[8]--;
            }
        }
    } else if (rem == 2) {
        if (cnt[2]) cnt[2]--;
        else if (cnt[5]) cnt[5]--;
        else if (cnt[8]) cnt[8]--;
        else {
            for (int i = 0; i < 2; i++) {
                if (cnt[1]) cnt[1]--;
                else if (cnt[4]) cnt[4]--;
                else if (cnt[7]) cnt[7]--;
            }
        }
    }

    // 检查是否还有数字且满足整除5条件
    bool has = false;
    for (int i = 1; i < 10; i++) if (cnt[i] > 0) has = true;
    if (cnt[0] > 0) has = true;
    if (!has) { cout << "impossible"; return 0; }

    // 确定个位：有0则放0，否则放5
    if (cnt[0] > 0) {
        cnt[0]--;
        for (int i = 9; i >= 0; i--)
            while (cnt[i]--) cout << i;
        cout << '0';
    } else {
        cnt[5]--;
        for (int i = 9; i >= 0; i--)
            while (cnt[i]--) cout << i;
        cout << '5';
    }

    return 0;
}

/*
Description
问题描述：
给定一个只包含数字[0...9]的字符串，求使用字符串中的某些字符，构建一个能够整除15的最大的整数。
注意，字符串中的每个字符只能使用一次。
编程任务：
求由给定字符串构建的能够整除15的最大整数。

输入格式
输入数据为一个只包含数字[0...9]字符串，字符串的长度为1~1000。

输出格式
将构建出的最大整数输出。
如果无法构建出能够整除15的整数，请输出
"impossible"

输入样例
02041

输出样例
4200

提示
从原来的字串中选择出最少最小的数删除以满足整除3和5的要求。
这个题目，首先考虑能否满足整除5的情况，这比较简单，不详述。只要能满足整除5(含有0或5)，
然后再考虑从原字串中删除最少而且最小的数使之满足整除3。这里优先考虑删最少，其次考虑删最小。
先来考虑如何删除最少最小数，能使得剩下数能被3整除。
把0~9数分为如下几类：
0，3，6，9： 这四种数不影响
2，5，8： 除3余2
1，4，7： 除3余1
有以下几种情况：
情况一：
这个数上各位数字和除3余0。不用删除操作。
情况二：
给定的数上各位数字和除3余1。那么只要删除余1的那一类数中最小的一个。
如果数串中没有余1的数，就删除余2那类中的最小的两个数。
情况三：
给定的数上各位数字和除3余2。那么只要删除余2那类最小的一个数。
如果数串中没有余2的数，就删除余1那类中的最小的两个数。
最后，剩余的数串以最大的并且以满足整除5的要求输出。
在0存在的时候，就按计数的顺序输出即可。如果在数串中没有0，则必须有个5放在个位。
*/
