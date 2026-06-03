# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

算法设计与分析课程的个人练习代码库。包含各种算法题目的 C++ 解法，按章节/主题分目录组织。

## 构建与运行

没有构建系统。每个 `main.cpp` 是独立程序：

```bash
# 编译
g++ -std=c++17 -O2 -o a.exe "1General Methods/9715 Max Rectangle Area/main.cpp"

# 运行（从标准输入读取，向标准输出写入）
./a.exe < input.txt
```

## 代码结构

- **章节目录**: 如 `1General Methods/`
- **题目文件夹**: `{题号} {英文题目名}/`，内仅含 `main.cpp`
- **题目 .txt**: `{题号} {英文题目名}.txt`，放在**章节级别**与文件夹并列，内容与 `main.cpp` 一致
- **首行**: `main.cpp` 和 `.txt` 首行必须为 `//{题号} {中文题目名}`，不写作者/日期头部
- **main.cpp**: 代码在上，OJ 题目描述原文以 `/* */` 块注释放在末尾
- 详细规范见 `docs/代码规范.md`

## 新题工作流

1. 按 `docs/OJ-访问指南.md` 从 OJ 获取题目描述原文
2. 若描述为图片：下载保存为 `problem.png`，通过 OCR 或 Web 搜索转文字
3. 写代码 → 编译验证（零错误零警告） → 样例测试
4. **逐题对比 OJ 原文校验描述块完整性**（提示是否完整、样例解释是否遗漏、公式是否被简化）
5. 同步 `.txt`，清理编译产物和 OJ tab

## 第一单元 一般方法 ✅（7/7）

| 题号 | 文件夹 | 算法/技术 |
|------|--------|-----------|
| 9715 | `9715 Max Rectangle Area/` | 单调栈 |
| 10345 | `10345 Prefix Average/` | 前缀和 O(n) |
| 11075 | `11075 Dividing Coins/` | 通项 k·5⁵−4 |
| 11076 | `11076 Decimal to Fraction/` | GCD + 循环小数转分数 |
| 17963 | `17963 Perfect Number/` | 欧几里得-欧拉公式 |
| 17086 | `17086 Lexicographic Permutation/` | next_permutation |
| 8593 | `8593 Max Coverage/` | 双指针 O(n) |

## 代码风格

- 头文件白名单见 `docs/代码规范.md`
- `using namespace std;` 紧跟 include
- 代码在上，`/* */` 描述块在末尾；不写作者/日期头部注释
- 紧凑风格，中文简注关键步骤
- 简洁变量命名，竞赛风格

## OJ 题目来源

题目来自 SCAU 教学 OJ。

- **校外 VPN 访问**：`https://acm-scau-edu-cn-s.vpn.scau.edu.cn/uoj8000/`
- **校内直连**：`https://acm.scau.edu.cn/uoj8000/`

获取新题目时，参考 `docs/OJ-访问指南.md`——详细记录了通过浏览器 CDP 自动化访问 OJ、获取题目列表和题目描述的完整流程（无需账密，利用用户浏览器已有登录态）。

OJ 题目按单元组织：

| 单元 | pid | 目录 |
|------|-----|------|
| 第一单元 一般方法 | 840 | `1General Methods/` |
| 第二单元 递归和分治 | 841 | `2Recursion and Divide and Conquer/` |
| 第三单元 动态规划 | 842 | `3Dynamic Programming/` |
| 第四单元 贪心算法 | 843 | `4Greedy Algorithm/` |
| 第五单元 搜索算法 | 844 | `5Search Algorithm/` |
| 课后习题 | 904 | `Exercises/` |

题目列表 URL：`common_ojTreeNode_listProblemNodes_PUBLIC.html?pid={pid}`
题目详情 URL：`common_problem_view_PUBLIC.html?problemId={id}&access={token}&fixedLanguage=MDsxOzI7Mw==`
（access token 从列表页链接中提取，与会话绑定）

## 自动化工具

`tools/` 目录下是可复用的批量处理脚本：

| 脚本 | 用途 |
|------|------|
| `fetch_problems.mjs` | 批量从 OJ 获取题目描述（串行低频，含反爬保护） |
| `create_structure.mjs` | 从描述文件生成题目文件夹/main.cpp/.txt |
| `fix_pre_and_images.mjs` | 重新获取 pre 块修复代码缩进 + 下载图片 |
| `download_images.mjs` | 下载 OJ 题目图片（canvas→base64→PNG） |

### 反爬注意事项

- OJ 限制并发连接，需串行访问，间隔 ≥ 4s
- 遇到 `ERR_CONNECTION_CLOSED` 关掉所有 OJ tab，等 30s 恢复
- 建议每个单元只开一次列表页，复用链接
