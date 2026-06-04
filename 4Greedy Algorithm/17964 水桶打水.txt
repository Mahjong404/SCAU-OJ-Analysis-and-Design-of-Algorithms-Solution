//17964 水桶打水
#include <iostream>
#include <algorithm>
#include <queue>
using namespace std;

int t[100005];

int main() {
    int n, r;
    cin >> n >> r;
    for (int i = 0; i < n; i++) cin >> t[i];
    sort(t, t + n);

    // 小顶堆：每个水龙头当前完成时间
    priority_queue<long long, vector<long long>, greater<long long>> pq;
    for (int i = 0; i < r; i++) pq.push(0);

    long long total = 0;
    for (int i = 0; i < n; i++) {
        long long finish = pq.top() + t[i]; pq.pop();
        total += finish;
        pq.push(finish);
    }
    cout << total;
    return 0;
}

/*
Description
有n个人（n<100000）带着大大小小的水桶容器（每人一个水桶）排队到r个（r<1000）水龙头打水，
他们装满水桶的时间分别是t1，t2，……，tn，并且时间是整数且各不相同，应如何安排他们的打水顺序
才能使他们花费的总时间和最少？

输入格式
分两行：第一行人数n和水龙头数r；第二行为t1 t2 …… tn。

输出格式
最少的所有人的总花费时间和。

输入样例
4 2
2 6 4 5

输出样例
23

提示
提示分析：
每个人整个打水的时间为：本人等待时间+本人实际充水的时间；
而本人的等待时间又为：排在本人之前所有人的充水时间之和。
本题目标是所有人打水花费的总时间和最小。那么，排在越前面的人，他的充水时间
计算次数就越多，因此充水时间越小的人排在前面可使所有人打水花费的总时间和越
小，所以用贪心法解答。
（1）将输入的充水时间按从小到大排序；
（2）将排序后的时间按顺序依次放入最早完成的水龙头的排队队列中；
（3）统计，输出合计后的完成时间和。
*/
