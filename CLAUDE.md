# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

算法设计与分析课程的个人练习代码库。73 道 C++ 算法题（5 单元）+ 8 道课后习题，共计 81 题。

## 构建与运行

每个 `main.cpp` 是独立程序：

```bash
g++ -std=c++17 -O2 -o a.exe "{单元}/{题号} {题目}/main.cpp"
./a.exe < input.txt
```

## 代码结构

```
{单元目录}/
├── {题号} {英文题目名}/
│   ├── main.cpp              ← 唯一源文件
│   └── problem.png           ← 仅题目描述为图片时
├── {题号} {英文题目名}.txt    ← 与 main.cpp 内容相同，章节级别
└── ...
```

- **首行**: `main.cpp` 和 `.txt` 首行必须为 `//{题号} {中文题目名}`
- **main.cpp**: 代码在上，OJ 题目描述原文以 `/* */` 块注释放在末尾
- 头文件白名单 14 种，`using namespace std;`
- 不写作者/日期头部，紧凑风格，中文简注
- 详细规范见 `docs/代码规范.md`

## 完成状态

| 单元 | 题目数 | 代码 | OJ 提交 |
|------|--------|------|---------|
| 第一单元 一般方法 | 7 | ✅ | ✅ 7/7 |
| 第二单元 递归和分治 | 21 | ✅ | ✅ 21/21 |
| 第三单元 动态规划 | 19 | ✅ | ✅ 19/19 |
| 第四单元 贪心算法 | 8 | ✅ | ✅ 8/8 |
| 第五单元 搜索算法 | 18 | ✅ | ⬜ 0/18 |
| 课后习题 | 8 | ⬜ | ⬜ 0/8 |
| **合计** | **81** | **73 / 81** | **55 / 81** |

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

获取新题目时参考 `docs/OJ-访问指南.md`。

## 自动化工具

`tools/` 目录下是可复用的批量处理脚本：

| 脚本 | 用途 |
|------|------|
| `fetch_problems.mjs` | 批量从 OJ 获取题目描述（串行低频，含反爬保护） |
| `create_structure.mjs` | 从描述文件生成题目文件夹/main.cpp/.txt |
| `fix_pre_and_images.mjs` | 修复代码缩进（pre 块 innerHTML）+ 下载图片 |
| `download_images.mjs` | 下载 OJ 题目图片（canvas→base64→PNG） |
| `auto_submit.mjs` | 去注释 + CDP 自动提交代码到 OJ + 检测结果 |
| `passed_index.json` | OJ 已通过题目索引，防止重复提交 |

## 参考文档

| 文档 | 内容 |
|------|------|
| `docs/代码规范.md` | 代码风格、头文件白名单、文件结构规范 |
| `docs/OJ-访问指南.md` | OJ URL、CDP Proxy 操作、反爬策略、自动提交流程 |
| `docs/OJ提交易错点总结.md` | OJ 提交中修复过的错误和易错点汇总 |

### 反爬注意事项

- OJ 限制并发连接，需串行访问，间隔 ≥ 4s
- 遇到 `ERR_CONNECTION_CLOSED` 关掉所有 OJ tab，等 30s 恢复
- 建议每个单元只开一次列表页，复用链接
