//17092 推箱子的最短路线
#include <iostream>
#include <string>
#include <queue>
#include <cstring>
using namespace std;

int n, m;
char g[105][105];
int vis[105][105][105][105]; // [br][bc][pr][pc]
int dr[] = {-1, 1, 0, 0};
int dc[] = {0, 0, -1, 1};

struct State { int br, bc, pr, pc, push; };

int main() {
    cin >> n >> m;
    int br, bc, er, ec, pr, pc;
    for (int i = 0; i < n; i++) {
        cin >> g[i];
        for (int j = 0; j < m; j++) {
            if (g[i][j] == 'S') br = i, bc = j;
            if (g[i][j] == 'E') er = i, ec = j;
            if (g[i][j] == 'M') pr = i, pc = j;
        }
    }

    memset(vis, -1, sizeof(vis));
    queue<State> q;
    q.push({br, bc, pr, pc, 0});
    vis[br][bc][pr][pc] = 0;

    int ans = -1;
    while (!q.empty()) {
        auto [br, bc, pr, pc, push] = q.front(); q.pop();
        if (br == er && bc == ec) { ans = push; break; }

        for (int d = 0; d < 4; d++) {
            int npr = pr + dr[d], npc = pc + dc[d];
            if (npr < 0 || npr >= n || npc < 0 || npc >= m) continue;
            if (g[npr][npc] == 'X') continue;

            if (npr == br && npc == bc) {
                // 推箱子
                int nbr = br + dr[d], nbc = bc + dc[d];
                if (nbr < 0 || nbr >= n || nbc < 0 || nbc >= m) continue;
                if (g[nbr][nbc] == 'X') continue;
                if (vis[nbr][nbc][npr][npc] == -1) {
                    vis[nbr][nbc][npr][npc] = push + 1;
                    q.push({nbr, nbc, npr, npc, push + 1});
                }
            } else {
                // 人移动
                if (vis[br][bc][npr][npc] == -1) {
                    vis[br][bc][npr][npc] = push;
                    q.push({br, bc, npr, npc, push});
                }
            }
        }
    }

    if (ans == -1) cout << "no solution";
    else cout << ans;
    return 0;
}

/*
Description
仓库阵列n*m个矩形格子，有的格子堆满障碍物，无法通过，有的格子是空闲的，可以通过。现在仓
库管理员要将某个箱子推到指定的格子上去，管理员和箱子都可以在空闲格子上移动，但管理员需要
站在与箱子相对的空闲格子上才可以做一次推动（玩过"推箱子游戏"都懂的）。

现在假设，箱子非常非常重，仓库管理员每推一步箱子都不堪重负，所以他希望尽可能减少箱子移动
的步数而将箱子推到终点位置上去。

现在已知：仓库大小、整个仓库的堆放情况、某箱子的起始位置及其终点位置、还有仓库管理员的初
始位置。
请输出：管理员至少要推动箱子多少步才能到达箱子的终点位置。

输入格式
输入：仓库大小、整个仓库的堆放情况、某箱子的起始位置及其终点位置、还有仓库管理员的初始位置。

第一行： n和m。表示n*m的仓库格子阵列（n,m<=100）。
接下来n行，每行m个字符，代表如上提到的所有信息。
这里用"X"表示障碍格子；
用"_"（下划线）表示空闲格子；
用"S"表示箱子的初始位置；
用"E"表示箱子的目标位置；
用"M"表示仓库管理员的初始位置；

输出格式
输出：管理员至少要推动箱子多少步才能到达箱子的终点位置。注意这里是最少的推动步数，而不是管理
员自身的移动步数。

如果仓库管理员无法完成这一任务，则输出"no solution"（无大写，无标点）。

如下图sample数据，箱子从S位置直到E位置，被仓库管理员推着，最短路径中间须经过的格子坐标为：
（6，7）    S
（6，8）   1 step
（6，9）   2 steps
（6，10）  3 steps
（6，11）  4 steps
（6，10）  5 steps
（5，10）  6 steps
（4，10）   E (7 steps)

输入样例
10 12
XXXXXXXXXXXX
X_______XXXX
X_XXXX__XXXX
X_XXXX__XEXX
X_XXXX__X_XX
X_____S_____
XXXXXXX_X_X_
XXXXXXM_X___
XXXXXXXXXXXX
XXXXXXXXXXXX

输出样例
7

提示
提示陆续写上来，不着急，先自行思考和讨论……
*/
