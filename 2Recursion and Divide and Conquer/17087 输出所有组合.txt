//17087 输出所有组合
#include <iostream>
#include <algorithm>
#include <string>
using namespace std;

string s;
int n, cnt;
char chosen[12];

// 从start位置开始，选m个字符
void comb(int start, int m, int pos) {
    if (m == 0) {
        cnt++;
        chosen[pos] = '\0';
        cout << cnt << ' ' << chosen << '\n';
        return;
    }
    for (int i = start; i <= n - m; i++) {
        chosen[pos] = s[i];
        comb(i + 1, m - 1, pos + 1);
    }
}

int main() {
    cin >> n >> s;
    sort(s.begin(), s.end());

    // 按长度递增输出
    for (int len = 1; len <= n; len++)
        comb(0, len, 0);

    return 0;
}

/*
Description
题目：输入一个字符串，输出该字符串中字符的所有组合。举个例子，如果输入abc，它的组合有a、b、c、ab、ac、bc、abc。
采用递归的方法来实现所有组合的输出。

输入格式
输入一个串长n和字符串，n<10。
字符串不含重复元素。

输出格式
输出该字符串中字符的所有组合，并在每个组合前标示序号。
注意：为了输出的组合有序而便于OJ系统评判，约定无论输入的初始字符串是什么顺序的，最后输出都按元素升序进行挑选的组合。
先输出长度为1，而后长度为2，……。长度相等时，字母小的排在前面输出。

输入样例
3 bac

输出样例
1 a
2 b
3 c
4 ab
5 ac
6 bc
7 abc

提示
书本上P13有用递归的思路求字符串的排列。同样，本题也可以用递归的思路来求字符串的组合。
假设我们想在长度为n的字符串中求m个字符的组合。
1. 先将字符串进行排序，使得字符串排序成递增的序列。
2. 我们从头扫描字符串的第一个字符。针对第一个字符，我们有两种选择：
（1）第一个选择是：把这个字符放到组合中去，接下来我们需要在剩下的n-1个字符中选取m-1个字符；
（2）第二个选择是：不把这个字符放到组合中去，接下来我们需要在剩下的n-1个字符中选择m个字符。
这两种选择都可用递归实现，思考一下，怎么写这个递归程序。
*/
