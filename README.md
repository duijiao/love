# 冬日弹窗

纯静态页面 + Supabase，可直接放 GitHub Pages。

## 部署
1. **Supabase**：新建项目 → SQL Editor 运行 `supabase/schema.sql`。
2. 把 Project URL 和 anon key 填进 `config.js`（不要用 service_role key）。
3. **GitHub**：新建仓库，上传全部文件 → Settings → Pages → 选 main 分支根目录。

## 链接格式
- `…/?s=xxxxxxxx`：分享链接，内容存在 Supabase，直接进入模板，没有任何按钮
- `…/?t=love&to=小明&from=小红`：直接打开某个模板（可选 `&env=0` 跳过信封）
- 不带参数：创作页（修改 / 更多 / 分享 / 音乐 / 重播）

## 已搬到服务器的内容
- 模板（配色、文案、飘落特效、信封/爱心/压轴设置）：`templates` 表，在 Table Editor 改行即生效
- 分享内容：`shares` 表，只能新增，只能按 id 读取
- 未配置 Supabase 或网络失败时，自动使用内置模板，分享退回长链接
