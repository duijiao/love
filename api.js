/* Supabase 访问层：只用 REST，不需要 SDK。未配置时 enabled=false，页面自动退回本地模式。 */
(function () {
  var C = window.APP_CONFIG || {}, URL = String(C.SUPABASE_URL || "").replace(/\/+$/, ""), KEY = C.SUPABASE_ANON_KEY || "";
  var enabled = !!(URL && KEY);

  function req(path, opt, ms) {
    var ctl = new AbortController(), t = setTimeout(function () { ctl.abort(); }, ms || 4000);
    opt = opt || {};
    opt.headers = Object.assign({ apikey: KEY, Authorization: "Bearer " + KEY }, opt.headers || {});
    opt.signal = ctl.signal;
    return fetch(URL + "/rest/v1/" + path, opt).then(function (r) {
      clearTimeout(t);
      if (!r.ok) { var e = new Error("HTTP " + r.status); e.status = r.status; throw e; }
      return r;
    }, function (e) { clearTimeout(t); throw e; });
  }
  function newId() {
    var A = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789", b = new Uint8Array(8), s = "";
    (window.crypto || window.msCrypto).getRandomValues(b);
    for (var i = 0; i < b.length; i++) s += A.charAt(b[i] % A.length);
    return s;
  }
  function jsonHeaders(extra) { return Object.assign({ "Content-Type": "application/json" }, extra || {}); }

  window.API = {
    enabled: enabled,
    /* 读取模板列表 */
    templates: function () {
      return req("templates?select=*&enabled=eq.true&order=sort.asc").then(function (r) { return r.json(); });
    },
    /* 通过 get_share 函数按 id 取一条分享（不允许列出全部） */
    getShare: function (id) {
      if (!/^[A-Za-z0-9]{6,16}$/.test(id)) return Promise.reject(new Error("bad id"));
      return req("rpc/get_share", { method: "POST", headers: jsonHeaders(), body: JSON.stringify({ p_id: id }) })
        .then(function (r) { return r.json(); });
    },
    /* 保存一条分享，返回短 id */
    saveShare: function (data) {
      function once() {
        var id = newId();
        return req("shares", { method: "POST", headers: jsonHeaders({ Prefer: "return=minimal" }), body: JSON.stringify({ id: id, data: data }) }).then(function () { return id; });
      }
      return once().catch(function (e) { if (e && e.status === 409) return once(); throw e; });
    }
  };
})();
