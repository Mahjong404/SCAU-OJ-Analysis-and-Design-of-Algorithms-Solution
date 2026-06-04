//18931 分形（第二章）
#include <iostream>
#include <cstring>
using namespace std;

char g[730][730];

int pow3(int k) {
    int r = 1;
    while (k--) r *= 3;
    return r;
}

// 在(x,y)处绘制n级分形（左上角坐标）
void draw(int x, int y, int n) {
    if (n == 1) { g[x][y] = 'X'; return; }
    int s = pow3(n - 2);
    draw(x, y, n - 1);                      // 左上
    draw(x, y + 2 * s, n - 1);              // 右上
    draw(x + s, y + s, n - 1);              // 正中
    draw(x + 2 * s, y, n - 1);              // 左下
    draw(x + 2 * s, y + 2 * s, n - 1);      // 右下
}

int main() {
    int n; cin >> n;
    int size = pow3(n - 1);
    memset(g, ' ', sizeof(g));
    draw(0, 0, n);
    for (int i = 0; i < size; i++) {
        for (int j = 0; j < size; j++) cout << g[i][j];
        cout << '\n';
    }
    return 0;
}

/*
Description
分形，具有以非整数维形式充填空间的形态特征。
通常被定义为"一个粗糙或零碎的几何形状，可以分成数个部分，且每一部分都（至少近似地）是整体缩小后的形状"，即具有自相似的性质。
现在，定义"盒子分形"如下：

一级盒子分形：
   X
二级盒子分形：
   X X
    X
   X X
如果用B(n - 1)代表第n-1级盒子分形，那么第n级盒子分形即为：
  B(n - 1)        B(n - 1)
          B(n - 1)
  B(n - 1)        B(n - 1)
你的任务是绘制一个n级的盒子分形。

输入格式
输入一个不大于6的正整数n，代表要输出的盒子分形的等级。

输出格式
使用"X"符号输出对应等级的盒子分形。

输入样例
4

输出样例
X X   X X         X X   X X
 X     X           X     X
X X   X X         X X   X X
   X X               X X
    X                 X
   X X               X X
X X   X X         X X   X X
 X     X           X     X
X X   X X         X X   X X
         X X   X X
          X     X
         X X   X X
            X X
             X
            X X
         X X   X X
          X     X
         X X   X X
X X   X X         X X   X X
 X     X           X     X
X X   X X         X X   X X
   X X               X X
    X                 X
   X X               X X
X X   X X         X X   X X
 X     X           X     X
X X   X X         X X   X X

提示
分形图可以用递归算法实现，规模为n的图形可以由规模为n-1的图形通过某种方式得到。
感兴趣的同学可以去看看类似题目 洛谷 P1498 南蛮图腾。
*/
