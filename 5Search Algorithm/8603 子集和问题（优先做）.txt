//8603 子集和问题（优先做）
#include <iostream>
using namespace std;

int n, c, a[105], x[105];
bool found;

void dfs(int i, int sum) {
    if (found) return;
    if (sum == c) {
        bool first = true;
        for (int j = 0; j < i; j++)
            if (x[j]) {
                if (!first) cout << ' ';
                cout << a[j];
                first = false;
            }
        found = true;
        return;
    }
    if (i == n) return;

    // 选
    x[i] = 1;
    dfs(i + 1, sum + a[i]);
    // 不选
    x[i] = 0;
    dfs(i + 1, sum);
}

int main() {
    cin >> n >> c;
    for (int i = 0; i < n; i++) cin >> a[i];
    found = false;
    dfs(0, 0);
    if (!found) cout << "No Solution";
    return 0;
}

/*
Description
S是一个整数集合，S={x1,x2,...,xn}，c是一个整数。这里集合元素xi（1<=i<=n）和c都是整数，可能为负。

子集和问题就是：判断是否存在S的一个子集S1，使得：
<center><img src="pic/8603_1301650483467_58403.JPG"></center>



对S集合子集树采用深度优先的顺序进行搜索，子集树从上到下每层标示着S集合中每个从左到右元素"选"或者"不选"（左1右0）。

试着用回溯算法设计解子集和问题。

<center><img src="pic/8603_1302592466415_51094.jpg"></center>

输入格式
第一行2个数：正整数n和整数c。n表示S集合的大小（n<=100），c是子集和的目标值。
接下来一行中，有n个整数，表示集合S中的元素。

输出格式
将子集和问题的解输出，当无解时，输出"No Solution"（注意No Solution的大小写，空格，无标点）。

输入样例
5 10
2 2 6 5 4

输出样例
2 2 6

提示
解空间树是"子集树"。
回溯法搜索，由于是深度优先的找，找到就退出。
参考书上的"装载问题"和书上的"0-1背包问题"来写，因为都是搜索子集树。
但此题无法有很好的剪枝优化，要求只输出"在子集树中按深度优先方向遇到的第一个解"，因此找到一个符合
条件的叶子就退出。

有个问题就是，找到第一个解就退出，怎么退出呢？
若你是用循环的迭代回溯实现，由于循环是很好退出的，要退出搜索，就break出来即可，很简单。但若是递归实
现的回溯过程，因是递归函数的逐层调用，现在要退出整个递归过程，如何一层一层退出被递归调用的函数？

解决办法就是加一个全局的标志found，found初始化为false。
当found标志为false时，就可递归深入下去，但当标志为true时，直接退出本次函数的过程。found标志需要
在找到第一个叶子时更新为true。
*/
