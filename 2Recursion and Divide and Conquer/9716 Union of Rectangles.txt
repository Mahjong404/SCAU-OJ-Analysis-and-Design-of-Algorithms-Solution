//9716 矩形的并
#include <iostream>
#include <algorithm>
#include <iomanip>
using namespace std;

struct Rect { double x1, y1, x2, y2; };
Rect r[105];
double xs[205], ys[205];
int xn, yn;

int main() {
    int n;
    cin >> n;

    xn = yn = 0;
    for (int i = 0; i < n; i++) {
        cin >> r[i].x1 >> r[i].y1 >> r[i].x2 >> r[i].y2;
        xs[xn++] = r[i].x1; xs[xn++] = r[i].x2;
        ys[yn++] = r[i].y1; ys[yn++] = r[i].y2;
    }

    // 坐标压缩：排序去重
    sort(xs, xs + xn);
    sort(ys, ys + yn);
    xn = unique(xs, xs + xn) - xs;
    yn = unique(ys, ys + yn) - ys;

    double area = 0.0;
    // 遍历每个压缩后的小矩形
    for (int i = 0; i < xn - 1; i++)
        for (int j = 0; j < yn - 1; j++) {
            // 检查小矩形中心是否被覆盖
            double cx = (xs[i] + xs[i + 1]) / 2;
            double cy = (ys[j] + ys[j + 1]) / 2;
            for (int k = 0; k < n; k++)
                if (cx > r[k].x1 && cx < r[k].x2 &&
                    cy > r[k].y1 && cy < r[k].y2) {
                    area += (xs[i + 1] - xs[i]) * (ys[j + 1] - ys[j]);
                    break;
                }
        }

    cout << fixed << setprecision(2) << area;
    return 0;
}

/*
Description
在 X-Y 坐标平面上，给定多个矩形，它们的边分别与坐标轴平行。请计算它们的并的面积。

输入格式
输入第一行为一个整数 n，1<=n<=100，表示矩形的数量。
接下来有 n 行，每行包括四个数：x1,y1,x2,y2 (0<=x1<x2<=100000;0<=y1<y2<=100000)，
用空格分开，不一定为整数。
(x1,y1)表示一个长方形的左下顶点坐标，(x2,y2)表示右上顶点坐标。

输出格式
n个矩形的并的面积，保留两位小数。

输入样例
2
0 0 2 2
1 1 3 3

输出样例
7.00

提示
多个矩形面积重叠难以直接求解或用上递归的思路。只能从矩形重叠的情况入手，进行局部相加。
这里提供如下几种思路:
1）将所有矩形的左右边界都投影到X轴上，形成各个区间。
2）从左向右计算每个区间，将落在该区间内的条带状的矩形进行面积统计。这一步需要计算在区间内矩形的
高度即上下边界，然后下边界减上边界，还要考虑到区间内多个矩形上下分离，而非连续情况的处理。
3）最后将每个区间计算的面积再相加。
或者考虑对覆盖区域做标记来想：
1）将所有矩形的X坐标，进行汇总并排序；所有矩形的Y坐标，也进行汇总并排序。
2）对排序后的x[i]~x[i+1],y[j]~y[j+1]的小矩形，判断这个小矩形是否有被输入的矩形
覆盖，有则做标记为1，没有则标记为0。
3）对排序后的x[i]~x[i+1],y[j]~y[j+1]的所有小矩形，将做了标记的小矩形面积相加即
为问题所求。
至于有些同学是想列举各种重叠的情况来扣除重叠面积，鼓励尝试一下，看是否能考虑周全所
有重叠的情况。
*/
