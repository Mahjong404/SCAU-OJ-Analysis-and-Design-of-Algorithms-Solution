//10304 平面域着色
#include <iostream>
using namespace std;

int main() {
    int n, k;
    cin >> n >> k;

    // 不可着色情况
    if (n == 1 && k < 1) { cout << 0; return 0; }
    if (n >= 3 && n % 2 == 1 && k < 3) { cout << 0; return 0; }
    if (n % 2 == 0 && k < 2) { cout << 0; return 0; }

    long long a1 = k;
    long long a2 = k * (k - 1);
    long long a3 = k * (k - 1) * (k - 2);
    if (n == 1) { cout << a1; return 0; }
    if (n == 2) { cout << a2; return 0; }
    if (n == 3) { cout << a3; return 0; }

    // 递推 a_n = (k-2)*a_{n-1} + (k-1)*a_{n-2}
    long long prev2 = a2, prev1 = a3, cur;
    for (int i = 4; i <= n; i++) {
        cur = (k - 2) * prev1 + (k - 1) * prev2;
        prev2 = prev1;
        prev1 = cur;
    }
    cout << cur;

    return 0;
}

/*
Description
平面上有一点P，它是n个域D1、D2、……，Dn的共同交点，
现取k种颜色对这n个域进行着色，要求相邻两个域着的颜色不同，求着色方案数。
这里，2<=n<=10，1<=k<=9。

输入格式
输入：输入两个值：n和k。n为域的个数，k为颜色数

输出格式
输出：对n个域着色的方案数

如输入3 3
输出6

输入样例
4 3

输出样例
18

提示
当对如图的n个扇形域着色时，当n>=4时，都分为如下两种情况考虑：
1）D1和Dn-1同色
2）D1和Dn-1不同色

当n>=4时，设an表示n个域用k种色的着色方案数（若可以着色的话）：
（1）若D1与Dn-1颜色相同,则Dn有k-1种选择
（2）若D1与Dn-1颜色不同,则Dn有k-2种选择
当n>=4时则有： an=(k-2)*an-1+(k-1)*an-2
特别地有： a1=k, a2=k*(k-1), a3=k*(k-1)*(k-2)

为何此处的递推公式要求n>=4呢？因为只有n>=4时，
D1和Dn-1才不相邻，上面的递推才有效。

这题还得注意着色数为0的情况，即不能按要求着色。
当n=1时，只要k>=1，都可着色。
当n为 >=3的奇数，k须>=3，当1<=k<3(即k=1或2)，不能着色。
当n为偶数时，只要k>=2，都可着色，若k=1，不能着色。
*/
