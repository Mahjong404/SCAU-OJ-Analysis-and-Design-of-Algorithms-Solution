//17082 两个有序数序列中找第k小（优先做）
#include <iostream>
using namespace std;

int X[100005], Y[100005];

// 在X[xb..xe]和Y[yb..ye]中找第k小的数
int findKth(int xb, int xe, int yb, int ye, int k) {
    if (xb > xe) return Y[yb + k - 1];
    if (yb > ye) return X[xb + k - 1];

    int xm = xb + (xe - xb) / 2;
    int ym = yb + (ye - yb) / 2;
    int halfLen = (xm - xb + 1) + (ym - yb + 1);

    if (X[xm] < Y[ym]) {
        if (k < halfLen)
            return findKth(xb, xe, yb, ym - 1, k);           // 弃Y后半段
        else
            return findKth(xm + 1, xe, yb, ye, k - (xm - xb + 1)); // 弃X前半段
    } else {
        if (k < halfLen)
            return findKth(xb, xm - 1, yb, ye, k);           // 弃X后半段
        else
            return findKth(xb, xe, ym + 1, ye, k - (ym - yb + 1)); // 弃Y前半段
    }
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(0);

    int m, n, k;
    cin >> m >> n >> k;
    for (int i = 0; i < m; i++) cin >> X[i];
    for (int i = 0; i < n; i++) cin >> Y[i];

    cout << findKth(0, m - 1, 0, n - 1, k);
    return 0;
}

/*
Description
已知两个已经排好序（非减序）的序列X和Y，其中X的长度为m，Y长度为n，
现在请你用分治算法，找出X和Y的第k小的数，算法时间复杂度为O(max{logm, logn})。

此题请勿采用将序列X和Y合并找第k小的O(m+n)的一般方法，要充分利用X和Y已经排好序的这一特性。

输入格式
第一行有三个数，分别是长度m、长度n和k，中间空格相连（1<=m,n<=100000; 1<=k<=m+n）。
第二行m个数分别是非减序的序列X。第三行n个数分别是非减序的序列Y。

输出格式
序列X和Y的第k小的数。

输入样例
5 6 7
1 8 12 12 21
4 12 20 22 26 31

输出样例
20

提示
假设：X序列为X[xBeg...xEnd]，而Y序列为Y[yBeg...yEnd]。

将序列X和Y都均分2段，即取X序列中间位置为 xMid (xMid = xBeg+(xEnd-xBeg)/2)，也同理取序列Y中间位置为yMid。
比较X[xMid]和Y[yMid]的大小，此时记录X左段和Y左段元素个数合计为halfLen，即halfLen = xMid-xBeg+yMid-yBeg+2。

1. 当X[xMid] < Y[yMid]时，在合并的数组中，原X[xBeg...xMid]所有元素一定在Y[yMid]的左侧，
   （1） 若k < halfLen，则此时第k大的元素一定不会大于Y[yMid]这个元素，
         故以后没有必要搜索 Y[yMid...yEnd]这些元素，可弃Y后半段数据。
         此时只需递归的对X序列+Y序列的前半段，去搜索第k小的数。

   （2） 若k >= halfLen，则此时第k大的元素一定不会小于X[xMid]这个元素，
         故以后没有必要搜索 X[xBeg...xMid]这些元素，可弃X前半段数据。
         此时只需递归的对X序列的后半段+Y序列，去搜索第 k-(xMid-xBeg+1）小的数。

2. 当X[xMid] >= Y[yMid]时，在合并的数组中，原Y[yBeg...yMid]的所有元素一定在X[xMid]的左侧，
   （1） 若k < halfLen，则此时第k大的元素一定不会大于X[xMid]这个元素，
         故以后没有必要搜索 X[xMid...xEnd]这些元素，可弃X后半段数据。
         此时只需递归的对X序列的前半段+Y序列，去搜索第k小的数。

   （2） 若k >= halfLen，则此时第k大的元素一定不会小于Y[yMid]这个元素，
         故以后没有必要搜索 Y[yBeg...yMid]这些元素，可弃Y前半段数据。
         此时只需递归的对X序列+Y序列的后半段，去搜索第 k-(yMid-yBeg+1）小的数。

递归的边界，如何来写？
1) if (xBeg > xEnd) return Y[yBeg + k - 1];  //X序列为空时，直接返回Y序列的第k小元素。
2) if (yBeg > yEnd) return X[xBeg + k - 1];  //Y序列为空时，直接返回X序列的第k小元素。


效率分析：

T(m,n)表示对长度为m的有序的X序列和长度为n的有序的Y序列，搜索第k小元素的复杂度。
T(m,n)=1   m=0或n=0
T(m,n) <= max{T(m/2,n), T(m,n/2)} + O(1)

则T(m,n) = O(max{logm, logn})
*/
