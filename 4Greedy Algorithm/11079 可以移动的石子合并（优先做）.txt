//11079 可以移动的石子合并（优先做）
#include <iostream>
#include <algorithm>
#include <queue>
using namespace std;

int stone[205];

int main() {
    int n, k;
    cin >> n >> k;
    for (int i = 1; i <= n; i++) cin >> stone[i];

    // ===== 最大得分: 每次合并2堆最大的（Huffman树，与k无关）=====
    priority_queue<int> maxQ;
    for (int i = 1; i <= n; i++) maxQ.push(stone[i]);
    int maxScore = 0;
    while (maxQ.size() > 1) {
        int a = maxQ.top(); maxQ.pop();
        int b = maxQ.top(); maxQ.pop();
        maxScore += a + b;
        maxQ.push(a + b);
    }

    // ===== 最小得分: k路Huffman树 =====
    // 补虚拟0堆使 n % (k-1) == 1
    int m = n;
    while (m % (k - 1) != 1) m++;

    priority_queue<int, vector<int>, greater<int>> minQ;
    for (int i = 1; i <= n; i++) minQ.push(stone[i]);
    for (int i = n + 1; i <= m; i++) minQ.push(0);

    int minScore = 0;
    while (minQ.size() > 1) {
        int sum = 0;
        for (int i = 0; i < k; i++) {
            sum += minQ.top(); minQ.pop();
        }
        minScore += sum;
        minQ.push(sum);
    }

    cout << minScore << ' ' << maxScore;
    return 0;
}

/*
Description
有n堆石子形成一行(a1,a2,…,an，ai为第i堆石子个数)，现要将石子合并成一堆，规定每次可
选择至少2堆最多k堆移出然后合并，每次合并的分值为新堆的石子数。

若干次合并后，石子最后肯定被合并为一堆，得分为每次合并的分值之和。

现在求解将这n堆石子合并成一堆的最低得分和最高得分。

输入格式
两行。第一行n和k。
第二行a1 a2 … an，每个ai(1<=i<=n)表示第i堆石子的个数，n<=200，2<=k<=n。

输出格式
仅一行，为石子合并的最低得分和最高得分，中间空格相连。

输入样例
7 3
45 13 12 16 9 5 22

输出样例
199 593

提示
此题贪心算法求解.
给这题标记标签"dp"方法是同学所为,并非老师标注.动规不是不可以,但有更好更快的贪心解法的.

如7堆石头，每次可选择最少2堆最多3堆合并，可以如下这样合并：
第1次合并：45+22=67
第2次合并：67+16=83
第3次合并：83+13=96
第4次合并：96+12=108
第5次合并：108+9=117
第6次合并：117+5=122
合并的总分值：67+83+96+108+117+122=593，593已是最大分值。

也可以这样合并：
第1次合并：5+9+12=26
第2次合并：13+16+22=51
第3次合并：45+51+26=122
合并的总分值：26+51+122=199，199已是最小分值。

因此此题贪心的方法如下：

（1）保证每次选两堆最多的，合并直至只剩一堆为止，能获得最大得分；
这个和huffman树构造是相同的，不再详述！

（2）保证每次选k堆最少的，合并直至只剩一堆为止，能获得最小得分。
这个是多元huffman树的构造。要注意的是：在合并之前，若n%(k-1)!=1，说明合并到最后一轮时，
剩下不是k堆（而是比k堆少），这样算的并不是最小得分，而必须在合并之前添加若干个为0的虚拟
堆，目的为凑成的堆数保证每次都能有k堆合并（包括最后一次）最后合并为1堆。

因此，在合并前作如下处理：

//假设石头每堆个数放于stone[1]~stone[n],且stone[n]之后最多k-1个数组单元为可写;
while (n % (k - 1) != 1)
{
        n++;
        stone[n]=0;
}
*/
