# SCAU OJ 访问与题目获取指南

> 从零开始访问 SCAU 教学 OJ，获取题目描述，到完成代码文件的完整流程。
> 最后更新：2026-06-04

## URL 选择

| 场景 | URL |
|------|-----|
| **校外 VPN**（当前使用） | `https://acm-scau-edu-cn-s.vpn.scau.edu.cn/uoj8000/` |
| 校内直连 | `https://acm.scau.edu.cn/uoj8000/` |

每次新 session 需确认当前可达的域名。本指南使用 VPN 域名，校内使用时替换即可。

## 完整工作流

```
启动 CDP → 获取题目列表 → 逐题获取描述 → 处理图片题目 → 写代码 → 完整性校验 → 清理
```

## 前置条件

- **Node.js 22+**
- 用户日常浏览器（Edge/Chrome）已登录 OJ
- web-access skill CDP Proxy 可用

## 一、启动 CDP Proxy

```bash
node "C:/Users/Surtr Muelsyse/.claude/skills/web-access/scripts/check-deps.mjs"
```

成功后输出：`proxy: ready (Microsoft Edge)`

## 二、获取题目列表

```bash
# 打开指定单元的题目列表
curl -s -X POST --data-raw 'https://acm-scau-edu-cn-s.vpn.scau.edu.cn/uoj8000/common_ojTreeNode_listProblemNodes_PUBLIC.html?pid=840' http://localhost:3456/new
# → {"targetId":"ABC123"}
```

| 单元 | pid |
|------|-----|
| 第一单元 一般方法 | 840 |
| 第二单元 递归和分治 | 841 |
| 第三单元 动态规划 | 842 |
| 第四单元 贪心算法 | 843 |
| 第五单元 搜索算法 | 844 |
| 课后习题 | 904 |

**页面加载检测**：OJ 页面 JS 异步加载，用 `innerText.length > 200` 轮询直到内容就绪：

```bash
# 轮询等待加载（每次等 2s，最多 8 次）
curl -s -X POST "http://localhost:3456/eval?target=ID" -d "document.body.innerText.length"
```

## 三、提取题目链接

⚠️ 避免在 eval 中使用 `JSON.stringify`。CDP Proxy 返回 `{"value":"..."}` 会双编码 JSON。

**推荐方式——使用简单分隔符**：

```bash
# 获取所有题目 ID（管道分隔）
curl -s -X POST "http://localhost:3456/eval?target=ID" -d "Array.from(document.querySelectorAll('a')).filter(function(a){return a.href&&a.href.indexOf('problemId')>=0}).map(function(a){var u=new URL(a.href);return u.searchParams.get('problemId')}).join('|')"

# 获取所有题目链接
curl -s -X POST "http://localhost:3456/eval?target=ID" -d "Array.from(document.querySelectorAll('a')).filter(function(a){return a.href&&a.href.indexOf('problemId')>=0}).map(function(a){return a.href}).join('|')"
```

## 四、获取题目描述（保留格式）

OJ 题目内容在 `<pre>` 块中。**不要用 `innerText`**——它会丢弃代码缩进和 HTML 实体。

```bash
# 打开题目页
curl -s -X POST --data-raw '<完整URL>' http://localhost:3456/new

# 获取所有 pre 块的 innerHTML（保留缩进和特殊字符）
curl -s -X POST "http://localhost:3456/eval?target=ID" -d "var ps=document.querySelectorAll('pre');var s='';for(var i=0;i<ps.length;i++){if(i>0)s+='||||SEP||||';s+=ps[i].innerHTML}s"
```

pre 块的顺序固定：0=Description, 1=输入格式, 2=输出格式, 3=输入样例, 4=输出样例, 5=提示。

获取后需解码 HTML 实体（`&lt;` → `<`, `&gt;` → `>`, `&amp;` → `&`）。

## 五、处理图片题目

部分题目的 Description 为图片（而非文字），页面中有 `<img>` 标签。直连 `curl` 下载会因 VPN 认证失败。

### 获取图片 URL

```bash
curl -s -X POST "http://localhost:3456/eval?target=ID" -d "Array.from(document.querySelectorAll('img')).filter(function(i){return i.src&&i.src.indexOf('logo')<0&&i.src.indexOf('pic/')>=0}).map(function(i){return i.src}).join('|')"
```

### 下载图片（Canvas 方案）

```bash
# 1. 打开图片 URL
curl -s -X POST --data-raw 'https://acm.scau.edu.cn/uoj8000/pic/xxxxx.jpg' http://localhost:3456/new

# 2. Canvas 提取 base64（注意用 curl 而非 Node http，前者更可靠）
curl -s -X POST "http://localhost:3456/eval?target=ID" -d "var img=document.querySelector('img');var c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;c.getContext('2d').drawImage(img,0,0);c.toDataURL('image/png')" > /tmp/img_b64.txt

# 3. 解码保存
node -e "const fs=require('fs');const d=fs.readFileSync('/tmp/img_b64.txt','utf8');const j=JSON.parse(d);const b64=j.value.replace(/^data:image\/png;base64,/,'');fs.writeFileSync('problem.png',Buffer.from(b64,'base64'))"
```

### 图片→文字 OCR

1. **Web 搜索**（推荐）：用 `<题号> <题目名> 算法设计与分析` 搜索，CSDN 等平台常有完整转录
2. **OCR**：需 tesseract + pytesseract，安装后 `pytesseract.image_to_string(Image.open('problem.png'), 'chi_sim')`

图片保存为 `{题目文件夹}/problem.png`（多张时 `problem2.png`、`problem3.png`）。

## 六、写代码

按 `docs/代码规范.md` 创建文件：

1. 创建文件夹 `{章节}/{题号} {英文题目名}/`
2. 写入 `main.cpp`，首行 `//{题号} {中文题目名}`
3. 代码在上，OJ 描述原文以 `/* */` 块放在末尾（代码缩进、公式保留原样）
4. 复制 `main.cpp` 为 `{题号} {英文题目名}.txt`，放在章节级别
5. 编译验证：`g++ -std=c++17 -O2 -o a.exe "main.cpp路径"` — 确保零错误零警告
6. 样例验证：用 OJ 样例输入运行程序，输出必须完全匹配

## 七、描述完整性校验 ⚠️ 容易遗漏

写完代码后，**逐题将描述块与 OJ 原文对比**，重点检查：

| 检查项 | 常见遗漏 |
|--------|----------|
| 提示是否完整 | OJ 提示有"方法一/二/三"时，只复制了最后一种 |
| 样例解释句 | "结果为5，是因为……" 这类解释经常跳过 |
| 公式推导 | 自写简短描述替代了 OJ 的详细推导步骤 |
| 代码缩进 | 用 `innerText` 提取会丢失所有缩进 |
| 输入/输出格式 | 细节说明被省略（如"无标点，无大写"） |

**验证方法**：重新打开 OJ 题目页，获取 `<pre>` 块的 `innerHTML`，逐段比对描述块。

## 八、反爬策略 ⚠️ 关键

OJ 有连接数限制，频繁并发会触发 `ERR_CONNECTION_CLOSED`（服务器主动断开），需等待约 30 秒恢复。

| 规则 | 说明 |
|------|------|
| **串行访问** | 同一时刻只开 1 个 OJ tab |
| **间隔 ≥ 4s** | 每次请求之间至少等待 4 秒 |
| **列表页复用** | 同一单元的题目共用一个列表页，不要每题重开 |
| **检测恢复** | 遇到 `ERR_CONNECTION_CLOSED`，关闭所有 OJ tab，等 30s 重试 |

**批量获取最佳实践**：
1. 每单元只开一次列表页，一次拿齐所有链接
2. 题目详情页逐个串行获取（开→等加载→取数据→关→等 5s→下一题）
3. 并行跑多个单元时，各单元脚本独立（不同 pid 的列表页不同，不冲突）

## 九、清理

```bash
# 关闭所有自己创建的 tab（保留用户原有 tab）
curl -s "http://localhost:3456/close?target=<targetId>"

# 删除编译产物
rm -f a.exe
```

## 十、OJ 页面结构

OJ 是 frameset 架构，搞清楚结构能避免反复试错：

```
mainMenu.html
├── 左侧 ztree 菜单
│   └── 实验 → 算法设计与分析 → 各单元
└── 右侧 iframe (name="right")
    └── mid_righter.html
        ├── 左侧 dtree（单元 → 题目列表链接）
        └── 右侧 iframe (name="main1") — 题目列表/题目详情加载处
```

题目详情页使用 `<pre>` 块承载内容，6 个 `<pre>` 固定映射：
| 索引 | 内容 |
|------|------|
| 0 | Description |
| 1 | 输入格式 |
| 2 | 输出格式 |
| 3 | 输入样例 |
| 4 | 输出样例 |
| 5 | 提示 |

## CDP Proxy API 速查

| 操作 | 命令 |
|------|------|
| 新建 tab | `curl -s -X POST --data-raw '<URL>' http://localhost:3456/new` |
| 执行 JS | `curl -s -X POST "http://localhost:3456/eval?target=ID" -d '<JS>'` |
| 点击元素 | `curl -s -X POST "http://localhost:3456/click?target=ID" -d '<CSS选择器>'` |
| 截图 | `curl -s "http://localhost:3456/screenshot?target=ID&file=<path>"` |
| 关闭 tab | `curl -s "http://localhost:3456/close?target=ID"` |

## 现有工具脚本

| 脚本 | 用途 |
|------|------|
| `tools/fetch_problems.mjs` | 批量从 OJ 获取题目描述（串行低频率） |
| `tools/create_structure.mjs` | 从 HTML 描述文件生成题目文件夹/main.cpp/.txt |
| `tools/fix_pre_and_images.mjs` | 重新获取 pre 块 innerHTML 修复缩进 + 下载图片 |
| `tools/download_images.mjs` | 下载 OJ 题目中的图片（canvas→base64→PNG） |
| `tools/auto_submit.mjs` | 去注释 + 自动提交代码到 OJ |

## 十一、自动提交代码

`tools/auto_submit.mjs` 可自动化 OJ 提交流程：读取 `main.cpp` → 去注释 → 打开提交页 → 填入代码 → 点击提交 → 检测结果。

```bash
node tools/auto_submit.mjs <problemId> <path/to/main.cpp>
node tools/auto_submit.mjs 11075 "1General Methods/11075 Dividing Coins/main.cpp"
```

### 去注释规则

提交前自动移除以下注释，只保留纯代码：
1. 首行 `//题号 中文题目名`
2. 所有 `// ...` 行注释（保留注释前的代码）
3. 末尾 `/* ... */` 块注释

### 提交流程

1. 打开 OJ 提交页 `common_solution_edit_PUBLIC.html?problemId={id}`
2. 等待页面 JS 加载完毕
3. 将去注释后的代码 base64 编码填入 `#areaSource` textarea
4. 点击 `提交` 按钮
5. 轮询等待页面跳转到结果页（不再含 "loading" / "跳转" 文字）
6. 解析结果，输出 `PASS` / `FAIL`

### 串行提交注意事项

批量提交多个题目时必须遵守以下规则：

| 规则 | 说明 |
|------|------|
| **串行逐个提交** | 同一时刻只提交一题，不要并行 |
| **间隔 ≥ 15s** | 两次提交之间至少等待 15 秒（脚本内置 15s 冷却）。≤ 5s 必触发 "您的操作过于频繁"；8s 偶尔触发；15s 稳定 |
| **500 错误重试** | OJ 偶尔返回 `500 Internal Server Error`（nginx），等 10-15s 后重试即可，提交其实可能已成功 |
| **提交后等待跳转** | 点击提交后 OJ 显示 "loading.. 等待 3 秒, 自动跳转"，实际跳转可能需要 3-12s |

### 提交结果检测

**重要：** "最近提交列表"为全 OJ 共用，同一时刻可能有其他用户提交。必须通过**用户名 + 题目编号**双重匹配来确认结果属于自己，不能只看第一条。

脚本优先使用正则匹配 `提交编号 用户名 ... 题目编号 评判结果` 来精确识别，匹配不到时回退到关键词检测。

| 评判结果 | 含义 | 处理 |
|----------|------|------|
| `通过` | ✅ 全部测试用例通过 | 继续下一题 |
| `错误 [出错提示]` | ❌ 有可查看的错误详情 | 打开 `common_solution_viewTip_PUBLIC.html?solutionId={id}` 查看具体测试用例差异 |
| `错误`（无提示） | ❌ 答案错误、运行错误等 | 自行分析代码逻辑或输出格式 |
| `操作过于频繁` | ⚠️ 频率限制 | 等 N 秒再操作 |
| `500 Internal Server Error` | ⚠️ OJ 服务器错误 | 等 10-15s 重试；可能已提交成功，先查提交列表 |

### 错误诊断流程

当遇到 `错误 [出错提示]` 时：

1. 记录提交编号 `solutionId`
2. 打开 `https://acm-scau-edu-cn-s.vpn.scau.edu.cn/uoj8000/common_solution_viewTip_PUBLIC.html?solutionId={id}`
3. 页面显示每个测试用例的输入、期望输出、实际输出和正确率
4. 根据差异分析错误原因（输出顺序、格式、逻辑等）

常见错误类型：
- **输出顺序错误**：如排列/组合的生成顺序与课本算法不一致。检查是否需要排序或保持原序
- **输出格式错误**：多余/缺少空格、换行，或要求 `\n` 但用了 `endl`
- **逻辑错误**：边界条件、递推公式、剪枝条件有误
- **编译错误**：头文件缺失、语法错误（GCC/G++/VC 不同编译器行为差异）

## 故障排查

| 问题 | 解决 |
|------|------|
| `proxy: not running` | 重跑 check-deps.mjs |
| `browser: not found` | 确保浏览器已打开且启用调试端口 |
| `ERR_CONNECTION_CLOSED` | 触发了反爬，关闭所有 OJ tab，等 30s+ 重试 |
| access token 过期 | 重新从题目列表页提取链接 |
| 页面 "loading.." | JS 未执行完，轮询等待 `innerText.length > 200` |
| eval 返回的数据无法 JSON.parse | 别用 JSON.stringify，改用 `join('|')` 分隔 |
| 描述中代码无缩进 | 用了 innerText。改用 pre 块 innerHTML + HTML 实体解码 |
| 图片下载失败 | 直连 curl 不行，必须通过 CDP 浏览器 Canvas 方案 |
| `500 Internal Server Error` | OJ 服务器临时过载，等 10-15s 重试；可先查提交列表确认是否已提交成功 |
| `操作过于频繁` | 提交间隔 < 8s 触发频率限制，等待提示秒数。建议间隔 ≥ 15s |
| `错误 [出错提示]` | 点击链接查看 `common_solution_viewTip_PUBLIC.html?solutionId={id}` 获取具体测试用例差异 |
| 结果页空白/无输出 | 页面跳转被 VPN/代理拦截，稍等或刷新重试 |
