//11086 排序问题再探讨
#include <iostream>
#include <cstdlib>
using namespace std;

const int SIZE = 10001;
int a[SIZE], tmp[SIZE];

// ========== 1. 递归插入排序 ==========
void Insert(int q) {
    int key = a[q], i = q - 1;
    while (i >= 0 && a[i] > key) { a[i + 1] = a[i]; i--; }
    a[i + 1] = key;
}

void RecurInsertionSort(int q) {
    if (q > 0) {
        RecurInsertionSort(q - 1);
        Insert(q);
    }
}

// ========== 2. 自然合并排序 ==========
void merge(int l, int m, int r) {
    int i = l, j = m + 1, k = l;
    while (i <= m && j <= r)
        tmp[k++] = (a[i] <= a[j]) ? a[i++] : a[j++];
    while (i <= m) tmp[k++] = a[i++];
    while (j <= r) tmp[k++] = a[j++];
    for (i = l; i <= r; i++) a[i] = tmp[i];
}

void NaturalMergeSort(int n) {
    int runs[SIZE]; // 每个run的起始位置
    int cnt, left, mid, right;

    while (true) {
        cnt = 0;
        runs[cnt++] = 0;
        // 扫描找出所有自然有序段
        for (int i = 1; i < n; i++)
            if (a[i] < a[i - 1])
                runs[cnt++] = i;
        runs[cnt] = n;

        if (cnt == 1) break; // 只有一段，已全部有序

        // 两两合并相邻段
        int i = 0;
        while (i < cnt) {
            left = runs[i];
            mid = runs[i + 1] - 1;
            right = runs[i + 2] - 1;
            if (i + 2 > cnt) {
                // 最后单独一段，无需合并
                break;
            }
            merge(left, mid, right);
            i += 2;
        }
    }
}

// ========== 3. 快速排序（中位数作轴值）==========
int Partition(int x, int p, int q) {
    // 以a[x]为基准划分a[p..q]
    swap(a[p], a[x]);  // 将基准放到段首
    int pivot = a[p];
    int i = p, j = q;
    while (i < j) {
        while (i < j && a[j] >= pivot) j--;
        a[i] = a[j];
        while (i < j && a[i] <= pivot) i++;
        a[j] = a[i];
    }
    a[i] = pivot;
    return i;
}

int RandomizedSelect(int p, int q, int k) {
    if (p >= q) return p;
    int pivot = p + rand() % (q - p + 1);
    int i = Partition(pivot, p, q);
    int len = i - p + 1;
    if (k == len) return i;
    if (k < len) return RandomizedSelect(p, i - 1, k);
    return RandomizedSelect(i + 1, q, k - len);
}

int median(int p, int q) {
    return RandomizedSelect(p, q, (q - p) / 2 + 1);
}

void QuickSort(int p, int q) {
    if (p >= q) return;
    int x = median(p, q);
    int i = Partition(x, p, q);
    QuickSort(p, i - 1);
    QuickSort(i + 1, q);
}

// ========== 主函数 ==========
int main() {
    int n;
    cin >> n;

    // 递归插入排序
    for (int i = 0; i < n; i++) cin >> a[i];
    RecurInsertionSort(n - 1);
    cout << "Insert sort: ";
    for (int i = 0; i < n; i++) cout << a[i] << ' ';
    cout << '\n';

    // 自然合并排序
    for (int i = 0; i < n; i++) cin >> a[i];
    NaturalMergeSort(n);
    cout << "Natural merge sort: ";
    for (int i = 0; i < n; i++) cout << a[i] << ' ';
    cout << '\n';

    // 快速排序
    for (int i = 0; i < n; i++) cin >> a[i];
    QuickSort(0, n - 1);
    cout << "Quick sort: ";
    for (int i = 0; i < n; i++) cout << a[i] << ' ';
    cout << '\n';

    return 0;
}

/*
Description
此题以程序填空的形式进行，请将下列程序框架复制到本机，并按下面要求填充完整后再用g++编译器提交，
在不改变程序框架情况下，可以自由添加所需的函数和变量，或修改合适的函数参数。
1，请改写一个"递归"的插入排序，排序a[0…n-1]，先递归的排序a[0…n-2]，然后再将a[n-1]插入到已排序
的a[0…n-2]中去。
2，自然合并排序，书上2.7节最后介绍的算法，请实现它。
3，快速排序，选择"中位数"作为轴值然后进行左右段分区，请实现它。


#include <iostream>
#include "stdlib.h"
using namespace std;

const int SIZE = 10001;
int a[SIZE];

void RecurInsertionSort(int p, int q)  //对a[p…q]的递归插入排序，参数可根据自己需要修改。
{
        ……
}

void NaturalMergeSort(int n)  //对n个元素的自然合并排序，参数可根据自己需要修改。
{
        ……
}

//以a[x]为基准元素划分a[p…q]，返回左右分区调整后的基准下标. 书上2.8节有，稍稍修改。
int Partition(int x, int p, int q)  //参数和返回值可根据自己需要修改。
{
        ……
}

int RandomizedSelect(int p, int q, int k)  //用任意选轴值的快速选择算法，返回a[p...q]的第k小元素的下标。
{
        ……
}

int median(int p, int q)  //挑出a[p…q]的中位数,并返回中位数下标，参数和返回值可根据自己需要修改。
{
    return RandomizedSelect(p, q, p+q/2);
}

void QuickSort(int p,int q)   //参数可根据自己需要修改。
{
    if(p>=q)return;
    int x = median(p, q);
    int i = Partition(x,p,q);
    QuickSort(p,i-1);  //递归
    QuickSort(i+1,q);
}

int main()
{
    int i,n;
    cin >> n;

    //递归插入排序
    for(i=0;i<n;i++) {
         cin >> a[i];
    }
    RecurInsertionSort(0,n-1);
    cout << "Insert sort: ";
    for(i=0;i<n;i++) {
         cout << a[i] << ' ';
    }

    //自然合并排序
    for(i=0;i<n;i++) {
         cin >> a[i];
    }
    NaturalMergeSort(n);
    cout << "\nNatural merge sort: ";
    for(i=0;i<n;i++) {
         cout << a[i] << ' ';
    }

    //快速排序
    for(i=0;i<n;i++) {
         cin >> a[i];
    }
    QuickSort(0, n-1);
    cout << "\nQuick sort: ";
    for(i=0;i<n;i++) {
         cout << a[i] << ' ';
    }

    return 0;
}

输入格式
第一行：n，表示n个元素待排序。n不超过10000个。
第二行：n个数的序列，用来做递归的插入排序；
第三行：n个数的序列，用来做自然合并排序；
第四行：n个数的序列，用来做快速排序。

注意：第二、三、四行之间无联系，可能相同也可能不相同。

输出格式
三行，分别为三种排序算法排序后输出。
注意前面有"Insert sort:"或"Natural merge sort:"或"Quick sort:"等输出前缀，格式以
上文程序为准。

输入样例
9
3 5 2 1 7 8 1 5 9
8 5 2 1 7 3 1 5 9
5 9 2 1 7 8 1 3 5

输出样例
Insert sort: 1 1 2 3 5 5 7 8 9
Natural merge sort: 1 1 2 3 5 5 7 8 9
Quick sort: 1 1 2 3 5 5 7 8 9

提示
1，递归的插入排序不难写哈。
//递归插入，跟递归求阶乘的思想一样，前n个排好序的数组，是建立在前n-1个排好序的数组基础上插入出来的
void RecurInsertionSort(int p, int q)
{
     if(q-p+1 > 1)
     {
         RecurInsertionSort(p, q-1);
         Insert(p,q);
     }
     else
         return;
}

2，自然合并排序
参照书上的思想.

3.选择问题：选中位数。用随机选轴值的"快速选择算法"获得，
随机选轴值可以获得比较好的性能，倒是无须用"中间的中间"选轴值那么麻烦。
*/
