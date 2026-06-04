//18931 分形（第二章）
#include <iostream>
using namespace std;

int main() {
    // TODO

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
