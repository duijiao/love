/* Supabase 访问层：只用 REST，不需要 SDK。未配置时 enabled=false，页面自动退回本地模式。 */
(function () {
  var C = window.APP_CONFIG || {}, URL = String(C.SUPABASE_URL || "").replace(/\/+$/, ""), KEY = C.SUPABASE_ANON_KEY || "";
  var enabled = !!(URL && KEY);

  function call(full, opt, ms) {
    var ctl = new AbortController(), t = setTimeout(function () { ctl.abort(); }, ms || 4000);
    opt = opt || {};
    opt.headers = Object.assign({ apikey: KEY, Authorization: "Bearer " + KEY }, opt.headers || {});
    opt.signal = ctl.signal;
    return fetch(full, opt).then(function (r) {
      clearTimeout(t);
      if (!r.ok) { var e = new Error("HTTP " + r.status); e.status = r.status; throw e; }
      return r;
    }, function (e) { clearTimeout(t); throw e; });
  }
  function req(path, opt, ms) { return call(URL + "/rest/v1/" + path, opt, ms); }
  function randId(n) {
    var A = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789", b = new Uint8Array(n), s = "";
    (window.crypto || window.msCrypto).getRandomValues(b);
    for (var i = 0; i < b.length; i++) s += A.charAt(b[i] % A.length);
    return s;
  }
  function newId() { return randId(8); }
  function jsonHeaders(extra) { return Object.assign({ "Content-Type": "application/json" }, extra || {}); }

  /* 允许上传的图片/音频类型（要和 schema-2.sql 里的 allowed_mime_types 保持一致） */
  var MIME = {
    "image/jpeg": { ext: "jpg", send: "image/jpeg" },
    "image/png": { ext: "png", send: "image/png" },
    "image/webp": { ext: "webp", send: "image/webp" },
    "audio/webm": { ext: "webm", send: "audio/webm" },
    "audio/ogg": { ext: "ogg", send: "audio/ogg" },
    "audio/mp4": { ext: "m4a", send: "audio/mp4" },
    "audio/x-m4a": { ext: "m4a", send: "audio/x-m4a" },
    "audio/aac": { ext: "aac", send: "audio/aac" },
    "audio/mpeg": { ext: "mp3", send: "audio/mpeg" },
    "audio/mp3": { ext: "mp3", send: "audio/mpeg" },
    "audio/wav": { ext: "wav", send: "audio/wav" },
    "audio/x-wav": { ext: "wav", send: "audio/wav" },
    "audio/wave": { ext: "wav", send: "audio/wav" }
  };
  function mimeInfo(type) { return MIME[String(type || "").split(";")[0].trim().toLowerCase()] || null; }

  window.API = {
    enabled: enabled,
    /* 图片和语音在云端的公开地址前缀；没配置云端时为空字符串 */
    mediaBase: enabled ? URL + "/storage/v1/object/public/media/" : "",
    mimeInfo: mimeInfo,
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
    },
    /* 上传一张图片或一段语音到 Storage 的 media 桶，返回公开地址 */
    uploadMedia: function (blob) {
      var info = mimeInfo(blob && blob.type);
      if (!enabled || !info) return Promise.reject(new Error("unsupported"));
      var name = randId(16) + "." + info.ext;
      return call(URL + "/storage/v1/object/media/" + name, { method: "POST", headers: { "Content-Type": info.send }, body: blob }, 90000)
        .then(function () { return URL + "/storage/v1/object/public/media/" + name; });
    }
  };
})();
