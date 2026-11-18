/* 部署前把下面两项换成你自己的 Supabase 项目信息（Project Settings → API）。
   anon / publishable key 本来就是公开的，靠数据库的 RLS 策略保护数据；
   千万不要把 service_role key 放进来。 */
window.APP_CONFIG = {
  SUPABASE_URL: "https://pbrcehqmintijjjvolat.supabase.co",       // 例如 https://abcdefgh.supabase.co
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBicmNlaHFtaW50aWpqanZvbGF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUwMTM1NzIsImV4cCI6MjExMDU4OTU3Mn0.rINejDXPl92zNyt2uOr1W8pvSM2NhgUZhGVBlkANDhs",  // anon 或 publishable key
  SHARE_BASE: ""          // 可选：固定分享域名，例如 https://你的用户名.github.io/winter-popup/
};
