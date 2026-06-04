# Analysis and Design of Algorithms

SCAU 算法设计与分析课程 — 个人练习代码库。81 道 C++ 算法题，全部 5 单元已完成，OJ 已提交 80/81 通过。

## 进度

| 单元 | 题目数 | 代码 | OJ |
|------|--------|------|-----|
| 第一单元 一般方法 | 7 | ✅ | ✅ 7/7 |
| 第二单元 递归和分治 | 21 | ✅ | ✅ 21/21 |
| 第三单元 动态规划 | 19 | ✅ | ✅ 19/19 |
| 第四单元 贪心算法 | 8 | ✅ | ✅ 8/8 |
| 第五单元 搜索算法 | 18 | ✅ | ✅ 18/18 |
| 课后习题 | 8 | ✅ | ✅ 8/8 |
| **合计** | **81** | **81/81** | **81/81** |

## 目录结构

```
{单元目录}/
├── {题号} {英文题目名}/
│   ├── main.cpp              ← 唯一源文件
│   └── problem.png           ← 仅题目描述为图片时
├── {题号} {中文题目名}.txt    ← 与 main.cpp 内容相同
└── ...
```

## 构建与运行

每个 `main.cpp` 是独立程序：

```bash
g++ -std=c++17 -O2 -o a.exe "{单元}/{题号} {题目}/main.cpp"
./a.exe < input.txt
```

## 代码规范

- 头文件白名单（14 种），`using namespace std;`
- 代码在上，OJ 题目描述原文以 `/* */` 块注释放在末尾
- 首行 `//{题号} {中文题目名}`
- 不写作者/日期头部，紧凑风格，中文简注
- 详细规范见 [`docs/代码规范.md`](docs/代码规范.md)

## OJ 题目来源

题目来自 SCAU 教学 OJ。

| 单元 | pid | 目录 |
|------|-----|------|
| 第一单元 一般方法 | 840 | `1General Methods/` |
| 第二单元 递归和分治 | 841 | `2Recursion and Divide and Conquer/` |
| 第三单元 动态规划 | 842 | `3Dynamic Programming/` |
| 第四单元 贪心算法 | 843 | `4Greedy Algorithm/` |
| 第五单元 搜索算法 | 844 | `5Search Algorithm/` |
| 课后习题 | 904 | `Exercises/` |

## 自动化工具

`tools/` 目录下是可复用的批量处理脚本：

| 脚本 | 用途 |
|------|------|
| `auto_submit.mjs` | 去注释 + CDP 自动提交到 OJ + 结果检测 |
| `passed_index.json` | OJ 已通过题目索引，防重复提交 |
| `fetch_problems.mjs` | 批量从 OJ 获取题目描述 |
| `create_structure.mjs` | 从描述文件生成题目文件夹/main.cpp/.txt |
| `fix_pre_and_images.mjs` | 修复 pre 块缩进 + 下载图片 |
| `download_images.mjs` | Canvas→base64→PNG 下载图片 |

## 参考文档

| 文档 | 内容 |
|------|------|
| [`docs/代码规范.md`](docs/代码规范.md) | 代码风格、头文件白名单、文件结构规范 |
| [`docs/OJ-访问指南.md`](docs/OJ-访问指南.md) | OJ URL、CDP Proxy 操作、反爬策略、自动提交 |
| [`docs/OJ提交易错点总结.md`](docs/OJ提交易错点总结.md) | OJ 提交中修复过的错误和易错点汇总 |

### 反爬注意事项

- OJ 限制并发连接，需串行访问，间隔 ≥ 4s
- 遇到 `ERR_CONNECTION_CLOSED` 关掉所有 OJ tab，等 30s 恢复
- 建议每个单元只开一次列表页，复用链接
- 自动提交间隔 ≥ 20s
