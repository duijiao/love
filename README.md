# 冬日弹窗

纯静态页面 + Supabase，可直接放 GitHub Pages。

## 部署
0. 想要回执功能：再运行一次 `schema-2.sql`（可选）。
1. **Supabase**：新建项目 → SQL Editor 运行 `supabase/schema.sql`。
2. 把 Project URL 和 anon key 填进 `config.js`（不要用 service_role key）。
3. **GitHub**：新建仓库，上传全部文件 → Settings → Pages → 选 main 分支根目录。

## 链接格式
- `…/?xxxxxx`：分享链接（6 位短码，内容存在 Supabase），直接进入模板，没有任何按钮；旧的 `?s=xxxxxxxx` 仍可用
- `…/?t=love&to=小明&from=小红`：直接打开某个模板（可选 `&env=0` 跳过信封）
- 不带参数：创作页（修改 / 更多 / 分享 / 音乐 / 重播）

## 已搬到服务器的内容
- 模板（配色、文案、飘落特效、信封/爱心/压轴设置）：`templates` 表，在 Table Editor 改行即生效
- 分享内容：`shares` 表，只能新增，只能按 id 读取
- 未配置 Supabase 或网络失败时，自动使用内置模板，分享退回长链接

## 想让链接更短
链接 = 域名 + 路径 + `?` + 6 位码。码已经压到 6 位，剩下的长度取决于域名和路径：
- 把仓库命名为 `你的用户名.github.io`，链接就没有路径；
- 或绑定自己的短域名，在 `config.js` 的 `SHARE_BASE` 里填 `https://xx.cn/`。

## 新功能
- 定时开启：分享面板里选一个时间，没到点 TA 只会看到信封倒计时（前端校验，防君子不防小人）。
- 回执：TA 拆开信、点「愿意」后，你下次打开创作页会收到提示（需运行 schema-2.sql）。
- 同样内容重复点分享，会复用上一次的短码，不再重复写数据库。
