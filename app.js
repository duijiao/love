(function () {
  var KEY = "winter-popups-v1", TKEY = "winter-templates-v1", API = window.API;

  /* ---- 模板：以 Supabase 的 templates 表为准；读不到时用这份内置备份 ---- */
  var FALLBACK = [{"id": "winter", "name": "冬日", "blurb": "围巾、热水和雪", "icon": "❄️", "title": "冬日快乐", "hues": [295, 145, 100, 340, 235, 65], "bg": [305, 340, 240], "accent": 290, "msgs": ["冬天拍了拍你说：“又见面啦”", "天冷了，多穿衣服 🧣", "你是最棒的", "记得多喝水噢~", "浪漫的不是雪，而是有你的冬天", "天冷记得加衣 ⛄", "按时吃饭 记得开心", "冬日快乐"], "fx_glyphs": ["❄", "❅", "❆"], "fx_color": "#9bb8e8", "layout": "scatter", "envelope": false, "finale": false, "finale_kind": "plain", "sort": 10}, {"id": "birthday", "name": "生日", "blurb": "蛋糕、愿望和蜡烛", "icon": "🎂", "title": "生日快乐", "hues": [10, 85, 200, 330, 50, 280], "bg": [350, 80, 300], "accent": 350, "msgs": ["今天你最大，想要什么都行 🎂", "愿望说出来，我帮你实现一半", "又长大一岁，还是那么可爱", "今天不许 emo，只许开心", "蛋糕要多吃一块 🍰", "愿你被世界温柔以待", "吹蜡烛前别忘了许愿 🕯️", "生日快乐！"], "fx_glyphs": ["🎈", "✨", "🎉"], "fx_color": "#f08aa0", "layout": "scatter", "envelope": false, "finale": false, "finale_kind": "plain", "sort": 20}, {"id": "love", "name": "表白", "blurb": "悄悄话，一句一个窗口", "icon": "💌", "title": "给你的消息", "hues": [10, 350, 330, 20, 0, 340], "bg": [355, 10, 340], "accent": 5, "msgs": ["今天也在想你", "你笑起来真好看", "遇见你是我最幸运的事 💗", "想和你一起看遍四季", "不管多晚，我都在", "喜欢你，没有理由", "愿意和我在一起吗？"], "fx_glyphs": ["♥", "💗", "💖", "♥"], "fx_color": "#ff7a93", "layout": "heart", "envelope": true, "finale": true, "finale_kind": "ask", "sort": 30}, {"id": "exam", "name": "考试加油", "blurb": "给考前的人打打气", "icon": "📚", "title": "考试加油", "hues": [230, 160, 100, 200, 130, 250], "bg": [220, 170, 250], "accent": 245, "msgs": ["你已经准备得很好了", "深呼吸，一题一题来", "先做会的，再攻难的 ✏️", "别紧张，你比自己想的更强", "考完请你吃好吃的", "相信自己，稳稳的", "加油，等你的好消息 🍀"], "fx_glyphs": ["✏️", "⭐", "🍀"], "fx_color": "#7a9be8", "layout": "scatter", "envelope": false, "finale": false, "finale_kind": "plain", "sort": 40}, {"id": "newyear", "name": "新年", "blurb": "红包、饺子和好运", "icon": "🧧", "title": "新年快乐", "hues": [25, 85, 45, 15, 75, 5], "bg": [40, 20, 85], "accent": 25, "msgs": ["新年快乐，红包拿来 🧧", "新的一年，万事顺意", "愿你岁岁平安，年年有余", "少熬夜，多睡觉，多赚钱", "今年的目标：好好吃饭 🥟", "祝你心想事成", "新年快乐！"], "fx_glyphs": ["🧧", "✨", "🎊"], "fx_color": "#e8573f", "layout": "scatter", "envelope": false, "finale": false, "finale_kind": "plain", "sort": 50}];
  var TEMPLATES = {}, SKIN_ORDER = [];
  function validRow(r) {
    return r && typeof r.id === "string" && typeof r.name === "string" && Array.isArray(r.hues) && r.hues.length >= 6 &&
      Array.isArray(r.bg) && r.bg.length >= 3 && Array.isArray(r.msgs) && r.msgs.length;
  }
  function setTemplates(rows) {
    var map = {}, order = [];
    (Array.isArray(rows) ? rows : []).forEach(function (r) {
      if (!validRow(r) || map[r.id]) return;
      map[r.id] = {
        name: r.name, blurb: r.blurb || "", icon: r.icon || "", title: r.title || r.name,
        hues: r.hues.map(Number), bg: r.bg.map(Number), accent: +r.accent || 0, msgs: r.msgs.map(String),
        fx_glyphs: Array.isArray(r.fx_glyphs) && r.fx_glyphs.length ? r.fx_glyphs.map(String) : ["❄"],
        fx_color: r.fx_color || "#9bb8e8", layout: r.layout === "heart" ? "heart" : "scatter",
        envelope: !!r.envelope, finale: !!r.finale, finale_kind: r.finale_kind === "ask" ? "ask" : "plain"
      };
      order.push(r.id);
    });
    if (!order.length) return false;
    TEMPLATES = map; SKIN_ORDER = order; return true;
  }
  (function () {
    var ok = false;
    try { var c = localStorage.getItem(TKEY); if (c) ok = setTemplates(JSON.parse(c)); } catch (e) {}
    if (!ok) setTemplates(FALLBACK);
  })();
  function defSkin() { return TEMPLATES.winter ? "winter" : SKIN_ORDER[0]; }
  function tplOf(id) { return TEMPLATES[id] || TEMPLATES[defSkin()]; }
  function mkDefaults() {
    var id = defSkin(), t = TEMPLATES[id];
    return { skin: id, title: t.title, icon: t.icon, gap: 450, pets: true, layout: "auto", to: "", from: "", envelope: false, finale: false, fx: true, msgs: t.msgs.slice(), media: [], autoVoice: true, photoStyle: "window", bgm: null, puzzle: false };
  }
  var DEFAULTS = mkDefaults();

  var HINT = "点窗口置顶，拖标题栏移动，点红点关闭";
  var root = document.documentElement;
  var stage = document.getElementById("stage");
  var timers = [], zTop = 10, played = false;
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var local = null, viewing = root.classList.contains("viewer");
  var state = clone(DEFAULTS);

  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  /* ---- 图片 / 语音：本机的文件放 IndexedDB，分享时才上传到 Storage，分享数据里只存公开地址 ---- */
  var MEDIA_MAX = 8, blobs = {}, objUrl = {}, dims = {}, bad = {}, voices = {};
  function randId(n) {
    var A = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789", b = new Uint8Array(n), s = "";
    (window.crypto || window.msCrypto).getRandomValues(b);
    for (var i = 0; i < n; i++) s += A.charAt(b[i] % A.length);
    return s;
  }
  function normMedia(list) {
    if (!Array.isArray(list)) return [];
    var base = (API && API.mediaBase) || "", out = [], seen = {};
    list.forEach(function (m) {
      if (out.length >= MEDIA_MAX || !m || (m.kind !== "image" && m.kind !== "voice")) return;
      var id = typeof m.id === "string" && /^[A-Za-z0-9]{6,24}$/.test(m.id) ? m.id : randId(10);
      if (seen[id]) return; seen[id] = 1;
      /* 只认自己 Storage 里的地址，别人伪造的分享不能引用外站图片 */
      var url = typeof m.url === "string" && base && m.url.indexOf(base) === 0 && /^[A-Za-z0-9._:\/-]+$/.test(m.url) ? m.url : "";
      out.push({ id: id, kind: m.kind, url: url, cap: typeof m.cap === "string" ? m.cap.slice(0, 40) : "",
        at: Math.max(0, Math.min(40, parseInt(m.at, 10) || 0)), dur: Math.max(0, Math.min(120, +m.dur || 0)) });
    });
    return out;
  }
  function normBgm(b) {
    if (!b || typeof b !== "object") return null;
    var base = (API && API.mediaBase) || "";
    var id = typeof b.id === "string" && /^[A-Za-z0-9]{6,24}$/.test(b.id) ? b.id : randId(10);
    var url = typeof b.url === "string" && base && b.url.indexOf(base) === 0 && /^[A-Za-z0-9._:\/-]+$/.test(b.url) ? b.url : "";
    return { id: id, url: url, name: typeof b.name === "string" ? b.name.slice(0, 40) : "", dur: Math.max(0, Math.min(1800, +b.dur || 0)) };
  }
  function mediaSrc(m) { return objUrl[m.id] || m.url || ""; }
  function fmtDur(s) { s = Math.round(s || 0); return s > 0 ? Math.floor(s / 60) + ":" + ("0" + (s % 60)).slice(-2) : ""; }
  function setBlob(id, b) {
    if (objUrl[id]) URL.revokeObjectURL(objUrl[id]);
    blobs[id] = b; objUrl[id] = URL.createObjectURL(b); delete bad[id]; delete voices[id];
  }
  function dropBlob(id) {
    if (objUrl[id]) URL.revokeObjectURL(objUrl[id]);
    delete blobs[id]; delete objUrl[id]; delete dims[id]; delete bad[id]; delete voices[id];
  }
  var idbP = null;
  function idb() {
    if (!idbP) idbP = new Promise(function (res, rej) {
      try {
        var r = indexedDB.open("winter-media", 1);
        r.onupgradeneeded = function () { r.result.createObjectStore("b"); };
        r.onsuccess = function () { res(r.result); };
        r.onerror = function () { rej(r.error); };
      } catch (e) { rej(e); }
    });
    return idbP;
  }
  function idbDo(mode, fn) {
    return idb().then(function (db) {
      return new Promise(function (res, rej) {
        var tx = db.transaction("b", mode), q = fn(tx.objectStore("b"));
        tx.oncomplete = function () { res(q && q.result); };
        tx.onerror = tx.onabort = function () { rej(tx.error); };
      });
    });
  }
  function idbPut(id, b) { return idbDo("readwrite", function (s) { return s.put(b, id); }).catch(function () {}); }
  function idbGet(id) { return idbDo("readonly", function (s) { return s.get(id); }).catch(function () { return null; }); }
  function idbDel(id) { return idbDo("readwrite", function (s) { return s.delete(id); }).catch(function () {}); }
  function loadBlobs(list) {
    return Promise.all((list || []).map(function (m) {
      if (objUrl[m.id]) return null;
      return idbGet(m.id).then(function (b) { if (b) setBlob(m.id, b); });
    }));
  }

  function norm(o) {
    if (!o || !Array.isArray(o.msgs) || !o.msgs.length) return null;
    return {
      skin: TEMPLATES[o.skin] ? o.skin : defSkin(),
      title: typeof o.title === "string" && o.title ? o.title : DEFAULTS.title,
      icon: typeof o.icon === "string" ? o.icon : "",
      gap: Math.max(100, Math.min(1500, +o.gap || DEFAULTS.gap)),
      pets: o.pets !== false,
      to: typeof o.to === "string" ? o.to.slice(0, 12) : "",
      from: typeof o.from === "string" ? o.from.slice(0, 12) : "",
      envelope: o.envelope === undefined ? !!tplOf(o.skin).envelope : !!o.envelope,
      finale: o.finale === undefined ? !!tplOf(o.skin).finale : !!o.finale,
      fx: o.fx !== false,
      layout: ["auto", "heart", "scatter"].indexOf(o.layout) >= 0 ? o.layout : "auto",
      msgs: o.msgs.map(String).slice(0, 40),
      media: normMedia(o.media),
      autoVoice: o.autoVoice !== false,
      photoStyle: ["window", "polaroid", "film", "mix"].indexOf(o.photoStyle) >= 0 ? o.photoStyle : "window",
      bgm: normBgm(o.bgm),
      puzzle: !!o.puzzle
    };
  }
  function sig(s) { return JSON.stringify(s); }
  function readLocal() { try { var r = localStorage.getItem(KEY); return r ? norm(JSON.parse(r)) : null; } catch (e) { return null; } }
  function writeLocal(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }
  function clearLocal() { try { localStorage.removeItem(KEY); } catch (e) {} }

  /* ---- 配色 ---- */
  function applySkin(id) {
    var t = tplOf(id);
    for (var i = 0; i < 6; i++) root.style.setProperty("--h" + (i + 1), t.hues[i]);
    for (var j = 0; j < 3; j++) root.style.setProperty("--hb" + (j + 1), t.bg[j]);
    root.style.setProperty("--ha", t.accent);
  }
  function swatch(id) {
    var h = TEMPLATES[id].hues, s = '<span class="sw" aria-hidden="true">';
    for (var i = 0; i < 4; i++) s += '<i style="background: oklch(.82 .1 ' + h[i] + ')"></i>';
    return s + "</span>";
  }

  /* ---- 像素装饰 ---- */
  var SPRITES = {
    cat: ["  #         #  ", " ##         ## ", " #o#######o#  ", " #ooooooooo#  ", " #o#oooo#oo#  ", " #ooooooooo#  ", "  #ooo#ooo#   ", "  #ooooooo#   ", " #ooooooooo#  ", " #ooooooooo#  ", " #o##ooo##o#  ", " ### ### ###  "].map(function (r) { return r.slice(0, 14); }),
    heart: [" ## ## ", "#ooooo#", "#ooooo#", " #ooo# ", "  #o#  ", "   #   "],
    star: ["   #   ", "   #   ", " ##o## ", "#ooooo#", " ##o## ", "   #   ", "   #   "]
  };
  function sprite(name, px, fillVar) {
    var rows = SPRITES[name], w = rows[0].length, h = rows.length, s = "";
    for (var y = 0; y < h; y++) for (var x = 0; x < w; x++) {
      var c = rows[y].charAt(x);
      if (c === "#") s += '<rect x="' + x + '" y="' + y + '" width="1" height="1" fill="var(--pet-line)"/>';
      else if (c === "o") s += '<rect x="' + x + '" y="' + y + '" width="1" height="1" fill="var(' + fillVar + ')"/>';
    }
    return '<svg width="' + w * px + '" height="' + h * px + '" viewBox="0 0 ' + w + " " + h + '" aria-hidden="true">' + s + "</svg>";
  }
  function addPet(name, px, fillVar, left, top, delay) {
    var d = document.createElement("div");
    d.className = "pet";
    d.style.left = left + "px"; d.style.top = top + "px"; d.style.animationDelay = delay + "ms";
    d.innerHTML = sprite(name, px, fillVar);
    stage.appendChild(d);
  }
  function spawnPets(vw, vh) {
    var u = Math.max(4, Math.min(7, Math.round(vw / 70)));
    addPet("cat", u, "--pet-a", vw * 0.02, vh * 0.12, 100);
    addPet("cat", u, "--pet-b", vw * 0.74, vh * 0.30, 600);
    addPet("cat", u, "--pet-c", vw * 0.34, vh * 0.78, 1100);
    addPet("heart", u - 1, "--pet-a", vw * 0.60, vh * 0.12, 1500);
    addPet("star", u - 1, "--pet-b", vw * 0.15, vh * 0.66, 1800);
    addPet("heart", u - 1, "--pet-c", vw * 0.82, vh * 0.72, 2100);
  }

  /* ---- 弹窗 ---- */
  var curLayout = null, rzTimer = null;
  function bring(el) { el.style.zIndex = ++zTop; }
  /* ---- 语音窗口里的播放器（同一时间只播一条，播放时把背景音乐压低） ---- */
  var nowPlaying = null;
  function duck(on) {
    if (AC && master && soundOn) master.gain.setTargetAtTime(on ? 0.12 : 0.6, AC.currentTime, 0.12);
    if (bgmEl && soundOn) { var t = on ? 0.12 : 0.6; bgmEl.volume = t; if (bgmEl.volume !== t) { if (on) bgmEl.pause(); else bgmPlay(); } } /* iOS 不能调音量：改成暂停/继续 */
  }
  function getAudio(m) {
    var a = voices[m.id];
    if (!a) { a = new Audio(); a.preload = "auto"; a.src = mediaSrc(m); voices[m.id] = a; }
    return a;
  }
  function stopVoices() {
    Object.keys(voices).forEach(function (k) { try { voices[k].pause(); voices[k].currentTime = 0; } catch (e) {} });
    nowPlaying = null; duck(false);
  }
  /* 在一次点击里“预热”所有语音，之后弹窗弹出时才允许自动播放（iOS Safari 需要这一步） */
  function unlockVoices() {
    Object.keys(voices).forEach(function (k) {
      var a = voices[k]; if (!a.paused) return;
      a._silent = true; a.muted = true;
      var done = function () { a.muted = false; a._silent = false; };
      var p; try { p = a.play(); } catch (e) { done(); return; }
      if (p && p.then) p.then(function () { a.pause(); a.currentTime = 0; done(); }, done); else { a.pause(); done(); }
    });
  }
  function buildVoice(m, el) {
    var box = document.createElement("div"); box.className = "voice";
    var btn = document.createElement("button"); btn.type = "button"; btn.className = "vplay"; btn.setAttribute("aria-label", "播放语音"); btn.textContent = "▶";
    var bars = document.createElement("div"); bars.className = "vbars"; bars.setAttribute("aria-hidden", "true");
    var N = 20, bi = [], k;
    for (k = 0; k < N; k++) {
      var b = document.createElement("i");
      b.style.setProperty("--bh", (0.3 + 0.7 * Math.abs(Math.sin(k * 1.7 + m.id.charCodeAt(k % m.id.length)))).toFixed(2));
      b.style.setProperty("--d", String(k * 45));
      bars.appendChild(b); bi.push(b);
    }
    var dur = document.createElement("span"); dur.className = "vdur"; dur.textContent = fmtDur(m.dur);
    box.appendChild(btn); box.appendChild(bars); box.appendChild(dur);
    var raf = 0;
    function paint(p) { var on = Math.round(p * N); for (var j = 0; j < N; j++) bi[j].classList.toggle("on", j < on); }
    function tick() {
      var a = voices[m.id]; if (!a) return;
      var d = m.dur || (isFinite(a.duration) ? a.duration : 0);
      paint(d ? Math.min(1, a.currentTime / d) : 0);
    }
    function setPlaying(on) {
      box.classList.toggle("playing", on);
      btn.textContent = on ? "❚❚" : "▶"; btn.setAttribute("aria-label", on ? "暂停" : "播放语音");
      cancelAnimationFrame(raf);
      if (on) (function loop() { tick(); raf = requestAnimationFrame(loop); })();
    }
    /* 事件在第一次播放时才绑定，这样量尺寸用的临时窗口不会抢走它 */
    function bind(a) {
      a.onplay = function () { if (a._silent) return; btn.classList.remove("nudge"); setPlaying(true); duck(true); };
      a.onpause = function () { if (a._silent) return; setPlaying(false); if (nowPlaying === a) { nowPlaying = null; duck(false); } };
      a.onended = function () { if (a._silent) return; a.currentTime = 0; paint(0); };
      a.onerror = function () { setPlaying(false); btn.textContent = "!"; btn.setAttribute("aria-label", "这段语音打不开"); };
    }
    function start() {
      var a = getAudio(m); bind(a);
      if (nowPlaying && nowPlaying !== a) nowPlaying.pause();
      nowPlaying = a;
      return Promise.resolve(a.play());
    }
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var a = getAudio(m);
      if (!a.paused) { a.pause(); return; }
      start().catch(function () {});
    });
    el._autoplay = function () {
      if (nowPlaying) return;
      start().catch(function () {
        nowPlaying = null; btn.classList.add("nudge");
        var h = document.getElementById("hint");
        if (h && h.className === "hint") h.textContent = "点语音窗口里的播放键，听听 TA 说了什么";
      });
    };
    el._stop = function () { var a = voices[m.id]; if (a && !a.paused) a.pause(); };
    return box;
  }
  function openLightbox(src, cap) {
    var o = document.createElement("div"); o.className = "lb"; o.setAttribute("role", "dialog"); o.setAttribute("aria-label", "查看大图");
    var im = new Image(); im.src = src; im.alt = cap || "";
    o.appendChild(im);
    function close() { o.remove(); document.removeEventListener("keydown", esc, true); }
    function esc(e) { if (e.key === "Escape") { e.stopPropagation(); close(); } }
    o.addEventListener("click", close); document.addEventListener("keydown", esc, true);
    document.body.appendChild(o);
  }
  /* 窗口出现之前先把图片尺寸量好，布局时高度才是确定的 */
  function preloadMedia() {
    return Promise.all(state.media.filter(function (m) { return mediaSrc(m); }).map(function (m) {
      if (m.kind === "voice") { getAudio(m); return null; }
      delete bad[m.id];
      if (dims[m.id]) return null;
      return new Promise(function (res) {
        var im = new Image(), t = setTimeout(res, 5000);
        im.onload = function () { clearTimeout(t); dims[m.id] = im.naturalWidth / Math.max(1, im.naturalHeight); res(); };
        im.onerror = function () { clearTimeout(t); bad[m.id] = true; res(); };
        im.src = mediaSrc(m);
      });
    }));
  }
  function usableMedia() { return state.media.filter(function (m) { return mediaSrc(m) && !bad[m.id]; }); }
  /* 把文字窗口和图片/语音窗口按 at（排在第几条文字之后）排成一条播放序列；压轴窗口始终是最后一条文字 */
  function buildSeq() {
    var n = state.msgs.length, lim = hasFin() ? n - 1 : n, by = {}, seq = [], pk = 0;
    photoK = {};
    usableMedia().forEach(function (m) { var a = Math.min(m.at, lim); (by[a] = by[a] || []).push(m); });
    for (var i = 0; i < n; i++) {
      (by[i] || []).forEach(function (m) { if (m.kind === "image") photoK[m.id] = pk++; seq.push({ m: m }); });
      seq.push({ text: state.msgs[i] });
    }
    (by[n] || []).forEach(function (m) { if (m.kind === "image") photoK[m.id] = pk++; seq.push({ m: m }); });
    return seq;
  }
  var curSeq = [], heartMode = false, photoK = {};
  function hash(s) { var h = 0; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; }
  function photoStyleOf(m) {
    var p = state.photoStyle;
    return p === "polaroid" || p === "film" ? p : p === "mix" ? ((photoK[m.id] || 0) % 2 ? "film" : "polaroid") : null;
  }
  function makeItem(it, i, w, sc) { return it.m ? makeWin("", i, w, sc, it.m) : makeWin(it.text, i, w, sc); }

  function makeWin(text, i, w, sc, media) {
    var el = document.createElement("div");
    el.className = "win";
    el.dataset.c = String((i % 6) + 1);
    el.style.width = w + "px";
    el.style.setProperty("--s", sc);
    var bar = document.createElement("div"); bar.className = "bar";
    var dots = document.createElement("div"); dots.className = "dots";
    dots.innerHTML = "<i></i><i></i><i></i>";
    var ttl = document.createElement("span"); ttl.className = "ttl";
    ttl.textContent = (state.icon ? state.icon + " " : "") + state.title;
    bar.appendChild(dots); bar.appendChild(ttl);
    var ps = media && media.kind === "image" ? photoStyleOf(media) : null;
    var body = document.createElement("div"); body.className = "body";
    if (media) {
      body.className = "body media";
      if (media.kind === "image") {
        var fig = document.createElement("figure"); fig.className = "mfig";
        var img = document.createElement("img"); img.className = "mimg"; img.alt = media.cap || "图片"; img.draggable = false;
        /* 爱心排布里窗口挨得近，图片裁成偏扁的比例，免得太高盖住别的窗口 */
        img.style.aspectRatio = Math.max(heartMode ? 1.25 : 0.75, Math.min(1.8, dims[media.id] || 1.33)).toFixed(3);
        img.src = mediaSrc(media);
        img.addEventListener("click", function () { if (!el._dj) openLightbox(mediaSrc(media), media.cap); });
        fig.appendChild(img); body.appendChild(fig);
      } else body.appendChild(buildVoice(media, el));
      if (media.cap) { var cp = document.createElement("p"); cp.className = "cap"; cp.textContent = media.cap; body.appendChild(cp); }
    } else body.textContent = text;
    var closeBtn = dots.firstChild, handle = bar;
    if (ps) {
      /* 拍立得 / 胶片：没有标题栏，整张照片都能拖；手写字在白边或底片上 */
      el.className = "win photo " + ps;
      el.style.setProperty("--rot", (((hash(media.id) % 13) - 6) * 0.8).toFixed(1) + "deg");
      var pf = body.querySelector(".mfig"), pi = pf.querySelector("img"), pc = body.querySelector(".cap") || document.createElement("p");
      pi.style.aspectRatio = (ps === "film" ? 1.5 : heartMode ? 1.15 : 1).toFixed(3);
      pc.className = "pcap"; pc.textContent = media.cap || "";
      if (ps === "film") { var fn = document.createElement("div"); fn.className = "fno"; fn.setAttribute("aria-hidden", "true"); fn.innerHTML = "<span>▸ " + ((photoK[media.id] || 0) + 1) + "A</span><span>KODAK 400</span>"; el.appendChild(fn); }
      closeBtn = document.createElement("button"); closeBtn.type = "button"; closeBtn.className = "pclose"; closeBtn.textContent = "×"; closeBtn.setAttribute("aria-label", "关闭");
      el.appendChild(pf); el.appendChild(pc); el.appendChild(closeBtn);
      el.addEventListener("click", function (e) { if (e.target === el && !el._dj) openLightbox(mediaSrc(media), media.cap); });
      handle = el;
    } else { el.appendChild(bar); el.appendChild(body); }

    closeBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      if (el._stop) el._stop();
      el.classList.add("out");
      setTimeout(function () { el.remove(); }, 220);
    });
    el.addEventListener("pointerdown", function () { bring(el); });
    handle.addEventListener("pointerdown", function (e) {
      if (e.target === closeBtn) return;
      var sx = e.clientX, sy = e.clientY, ox = el.offsetLeft, oy = el.offsetTop;
      handle.setPointerCapture(e.pointerId);
      handle.style.cursor = "grabbing";
      function mv(ev) {
        el._moved = true; if (Math.abs(ev.clientX - sx) + Math.abs(ev.clientY - sy) > 4) el._dj = true;
        el.style.left = (ox + ev.clientX - sx) + "px";
        el.style.top = (oy + ev.clientY - sy) + "px";
      }
      function up() {
        setTimeout(function () { el._dj = false; }, 60);
        handle.style.cursor = "";
        handle.removeEventListener("pointermove", mv);
        handle.removeEventListener("pointerup", up);
        handle.removeEventListener("pointercancel", up);
      }
      handle.addEventListener("pointermove", mv);
      handle.addEventListener("pointerup", up);
      handle.addEventListener("pointercancel", up);
    });
    return el;
  }

  /* 散落排布（原来的效果） */
  function placeScatter(el, i, n, vw, vh) {
    var w = el.offsetWidth, top = 56, range = Math.max(120, vh - 56 - 190);
    var t = n > 1 ? i / (n - 1) : 0.4;
    var y = top + t * range + (Math.random() * 40 - 20);
    var side = (i % 2 === 0) ? Math.random() * 0.35 : 0.65 + Math.random() * 0.35;
    el.style.left = Math.max(8, Math.min(vw - w - 8, (vw - w) * side)) + "px";
    el.style.top = Math.max(40, y) + "px";
  }

  /* 爱心排布：窗口中心沿心形曲线等距分布，从底部尖角开始，左右同时向上长，最后一句落在顶部凹口 */
  var HEART = (function () {
    var P = [], N = 720, mn = 1e9, mx = -1e9;
    for (var k = 0; k <= N; k++) {
      var t = Math.PI + k / N * 2 * Math.PI, st = Math.sin(t);
      var x = 16 * st * st * st, y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
      P.push([x, y]); mn = Math.min(mn, y); mx = Math.max(mx, y);
    }
    return { P: P, minY: mn, maxY: mx };
  })();
  function heartOrder(n) {
    var o = [0], lo = 1, hi = n - 1, left = true;
    while (lo <= hi) { o.push(left ? lo++ : hi--); left = !left; }
    return o;
  }
  function measureH(w) {
    var els = curSeq.slice(0, measureN).map(function (it, i) {
      var e = makeItem(it, i, w, 1); e.style.visibility = "hidden"; e.style.animation = "none"; stage.appendChild(e); return e;
    });
    var sum = 0;
    els.forEach(function (e) { sum += e.offsetHeight; e.remove(); });
    return sum / els.length;
  }
  var measureN = 0;
  function heartLayout(n, vw, vh) {
    measureN = n;
    var base = Math.min(320, vw * 0.66), h1 = measureH(Math.round(base));
    var X0 = 8, X1 = vw - 8, Y0 = 24, Y1 = vh - 72, floor = n > 20 ? 0.5 : 0.6;
    var P = HEART.P, hs = HEART.maxY - HEART.minY, best = null;
    for (var s = 1; s >= floor - 0.001; s -= 0.04) {
      var w = base * s, aw = X1 - X0 - w, ah = Y1 - Y0 - h1 * s;
      if (aw < 40 || ah < 40) continue;
      var kx0 = aw / 32, ky0 = ah / hs;
      var kx = Math.min(kx0, ky0 * 1.3), ky = Math.min(ky0, kx0 * 1.3);
      var cum = [0];
      for (var i = 1; i < P.length; i++) cum.push(cum[i - 1] + Math.hypot((P[i][0] - P[i - 1][0]) * kx, (P[i][1] - P[i - 1][1]) * ky));
      best = { s: s, w: w, kx: kx, ky: ky, cum: cum };
      if (cum[cum.length - 1] / n >= w * 0.62) break;
    }
    if (!best) return null;
    var cum2 = best.cum, per = cum2[cum2.length - 1], cx = (X0 + X1) / 2, cy = (Y0 + Y1) / 2, ym = (HEART.maxY + HEART.minY) / 2;
    best.pts = []; best.order = heartOrder(n); best.cx = cx; best.cy = cy; best.fw = Math.min(base, best.w * 1.35); best.fs = best.fw / base;
    var j = 1;
    for (var k = 0; k < n; k++) {
      var d = k * per / n;
      while (j < cum2.length - 1 && cum2[j] < d) j++;
      var a = cum2[j - 1], b = cum2[j], f = b > a ? (d - a) / (b - a) : 0;
      var px = P[j - 1][0] + (P[j][0] - P[j - 1][0]) * f, py = P[j - 1][1] + (P[j][1] - P[j - 1][1]) * f;
      best.pts.push({ x: cx + px * best.kx, y: cy - (py - ym) * best.ky });
    }
    return best;
  }
  function placeHeart(el) {
    var p = el._fin ? { x: curLayout.cx, y: curLayout.cy } : curLayout.pts[el._pos];
    el.style.left = (p.x - el.offsetWidth / 2) + "px";
    el.style.top = (p.y - el.offsetHeight / 2) + "px";
  }
  function useHeart(n) { return n >= 4 && (state.layout === "heart" || (state.layout !== "scatter" && tplOf(state.skin).layout === "heart")); }
  function beat() { stage.classList.remove("beat"); void stage.offsetWidth; stage.classList.add("beat"); }
  stage.addEventListener("animationend", function (e) { if (e.target === stage) stage.classList.remove("beat"); });

  /* 旋转手机/改窗口大小时，没被拖动过的窗口重新排成爱心 */
  window.addEventListener("resize", function () {
    clearTimeout(rzTimer);
    rzTimer = setTimeout(function () {
      if (!curLayout) return;
      var lay = heartLayout(outlineN(), stage.clientWidth, stage.clientHeight);
      if (!lay) return;
      curLayout = lay;
      Array.prototype.forEach.call(stage.querySelectorAll(".win"), function (el) {
        if (el._moved || (el._pos == null && !el._fin)) return;
        var fw = el._fin; el.style.width = Math.round(fw ? lay.fw : lay.w) + "px"; el.style.setProperty("--s", fw ? lay.fs : lay.s);
        placeHeart(el);
      });
    }, 200);
  });

  function hasFin() { return (state.finale || state.puzzle) && state.msgs.length >= 3; }
  function outlineN() { return curSeq.length - (hasFin() ? 1 : 0); }

  /* ---- 压轴窗口 ---- */
  function makeFinale(text, i, vw, vh) {
    var base = Math.min(320, vw * 0.66), fw = curLayout ? curLayout.fw : base, fs = fw / base;
    var el = makeWin(text, i, Math.round(fw), fs);
    el.classList.add("fin"); el._fin = true;
    if (tplOf(state.skin).finale_kind === "ask") {
      var body = el.querySelector(".body"), acts = document.createElement("div"); acts.className = "acts";
      var yes = document.createElement("button"), no = document.createElement("button"), tries = 0, giveUp = false;
      yes.type = no.type = "button"; yes.className = "yes"; no.className = "no";
      yes.textContent = "愿意 💗"; no.textContent = "再想想";
      acts.appendChild(yes); acts.appendChild(no); body.appendChild(acts);
      function accept() {
        body.textContent = "我就知道你会答应 💗";
        var r = el.getBoundingClientRect(); fxBurst(r.left + r.width / 2, r.top + r.height / 2);
        sfxFanfare(); beat();
      }
      function dodge(e) {
        if (giveUp) return;
        e.preventDefault(); e.stopPropagation();
        tries++;
        var minX = -no.offsetLeft, maxX = acts.clientWidth - no.offsetLeft - no.offsetWidth;
        no.style.transform = "translate(" + (minX + Math.random() * (maxX - minX)) + "px," + ((Math.random() - 0.5) * no.offsetHeight) + "px)";
        if (tries >= 6) { giveUp = true; no.textContent = "好吧，愿意"; no.style.transform = ""; }
      }
      no.addEventListener("pointerenter", dodge); no.addEventListener("pointerdown", dodge);
      no.addEventListener("click", function () { if (giveUp) accept(); });
      yes.addEventListener("click", accept);
    }
    return el;
  }

  /* ---- 音乐与音效（WebAudio 合成，无需外部文件） ---- */
  var AC = null, master = null, soundOn = false, musicTimer = null, nextBar = 0, barIdx = 0;
  var CHORDS = [[261.63, 329.63, 392], [196, 246.94, 293.66], [220, 261.63, 329.63], [174.61, 220, 261.63]];
  var PENTA = [523.25, 587.33, 659.25, 783.99, 880, 1046.5];
  function audioInit() {
    if (!AC) {
      var C = window.AudioContext || window.webkitAudioContext; if (!C) return false;
      AC = new C(); master = AC.createGain(); master.connect(AC.destination);
    }
    if (AC.state === "suspended") AC.resume();
    return true;
  }
  function tone(f, t, d, v, type) {
    var o = AC.createOscillator(), g = AC.createGain();
    o.type = type || "sine"; o.frequency.value = f;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    o.connect(g); g.connect(master); o.start(t); o.stop(t + d + 0.05);
  }
  function musicSched() {
    var now = AC.currentTime; if (nextBar < now + 0.1) nextBar = now + 0.1;
    while (nextBar < now + 1.5) {
      var ch = CHORDS[barIdx++ % 4], pat = [0, 1, 2, 1, 2, 1, 2, 1];
      tone(ch[0] / 2, nextBar, 2.4, 0.07, "sine");
      pat.forEach(function (k, j) { tone(ch[k] * (j % 4 === 2 ? 2 : 1), nextBar + j * 0.32, 0.9, 0.05, "triangle"); });
      nextBar += 2.56;
    }
  }
  /* 自带歌曲：有就用 <audio> 循环播放，没有就用上面合成的八音盒 */
  var bgmEl = null, bgmKey = "", userMuted = false;
  function bgmPlay() { if (!bgmEl) return; bgmEl.volume = 0.6; var p; try { p = bgmEl.play(); } catch (e) { return; } if (p && p.catch) p.catch(function () {}); }
  function syncBgm() {
    var src = state.bgm && mediaSrc(state.bgm) || "";
    root.classList.toggle("has-bgm", !!src);
    if (src === bgmKey) return;
    if (bgmEl) { try { bgmEl.pause(); } catch (e) {} bgmEl = null; }
    bgmKey = src;
    if (src) {
      var a = new Audio(); a.loop = true; a.preload = "auto"; a.src = src; bgmEl = a;
      a.onerror = function () { if (bgmEl === a) { bgmEl = null; bgmKey = ""; if (soundOn) setSound(true); } };
    }
    if (soundOn) setSound(true);
  }
  function setSound(on) {
    soundOn = on; btnSound.setAttribute("aria-pressed", String(on));
    syncBgm();
    clearInterval(musicTimer);
    if (on) {
      var ok = audioInit();
      if (ok) { master.gain.cancelScheduledValues(AC.currentTime); master.gain.setTargetAtTime(0.6, AC.currentTime, 0.05); }
      if (bgmEl) bgmPlay();
      else if (ok) { nextBar = 0; musicSched(); musicTimer = setInterval(musicSched, 500); }
    } else {
      if (bgmEl) bgmEl.pause();
      if (AC) master.gain.setTargetAtTime(0, AC.currentTime, 0.08);
    }
  }
  function sfxDing(i) {
    if (!soundOn || !AC || bgmEl) return; /* 放自己的歌时不叠“叮”声 */
    var f = PENTA[i % PENTA.length], t = AC.currentTime;
    tone(f, t, 0.9, 0.16, "sine"); tone(f * 2, t, 0.5, 0.04, "sine");
  }
  function sfxFanfare() {
    if (!soundOn || !AC) return;
    [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach(function (f, j) { tone(f, AC.currentTime + j * 0.09, 1.4, 0.14, "triangle"); });
  }
  var btnSound = document.getElementById("btnSound");
  btnSound.addEventListener("click", function () { userMuted = soundOn; setSound(!soundOn); });

  /* ---- 飘落特效 + 爆发 ---- */
  function fxCfg() { var t = tplOf(state.skin); return { g: t.fx_glyphs, c: t.fx_color }; }
  var fxc = document.getElementById("fx"), fxx = fxc.getContext("2d"), fxP = [], fxRaf = 0, fxW = 0, fxH = 0;
  function fxSize() {
    var d = window.devicePixelRatio || 1; fxW = window.innerWidth; fxH = window.innerHeight;
    fxc.width = fxW * d; fxc.height = fxH * d; fxx.setTransform(d, 0, 0, d, 0, 0);
  }
  function fxNew(cfg, init) {
    return { x: Math.random() * fxW, y: init ? Math.random() * fxH : -30, g: cfg.g[(Math.random() * cfg.g.length) | 0],
      sz: 12 + Math.random() * 16, vy: 0.5 + Math.random() * 1.1, ph: Math.random() * 6.28, sw: 0.4 + Math.random(), a: 0.45 + Math.random() * 0.4 };
  }
  function fxBurst(x, y) {
    if (reduce) return;
    for (var i = 0; i < 36; i++) fxP.push({ b: 1, x: x, y: y, g: "♥", sz: 16 + Math.random() * 16, vx: (Math.random() - 0.5) * 10, vy: -3 - Math.random() * 7, a: 1, life: 90 });
    if (!fxRaf) fxLoop();
  }
  function fxLoop() {
    var cfg = fxCfg(), t = Date.now() / 1000;
    fxx.clearRect(0, 0, fxW, fxH); fxx.fillStyle = cfg.c; fxx.textBaseline = "middle"; fxx.textAlign = "center";
    for (var i = fxP.length - 1; i >= 0; i--) {
      var p = fxP[i];
      if (p.b) { p.x += p.vx; p.y += p.vy; p.vy += 0.17; p.vx *= 0.99; p.life--; p.a = Math.min(1, p.life / 30); if (p.life <= 0) { fxP.splice(i, 1); continue; } }
      else { p.y += p.vy; p.x += Math.sin(t * p.sw + p.ph) * 0.6; if (p.y > fxH + 30) fxP[i] = fxNew(cfg, false); }
      fxx.globalAlpha = p.a; fxx.font = p.sz + "px sans-serif"; fxx.fillText(p.g, p.x, p.y);
    }
    fxx.globalAlpha = 1;
    fxRaf = fxP.length ? requestAnimationFrame(fxLoop) : 0;
  }
  function fxStart() {
    cancelAnimationFrame(fxRaf); fxRaf = 0; fxP = []; fxSize(); fxx.clearRect(0, 0, fxW, fxH);
    if (!state.fx || reduce) return;
    var cfg = fxCfg(), n = Math.min(60, Math.round(fxW / 14));
    for (var i = 0; i < n; i++) fxP.push(fxNew(cfg, true));
    fxLoop();
  }
  window.addEventListener("resize", fxSize);

  /* ---- 信封开场 ---- */
  var opened = false;
  function showEnvelope() {
    var old = document.querySelector(".env"); if (old) old.remove();
    stage.innerHTML = ""; fxStart(); preloadMedia();
    var o = document.createElement("div"); o.className = "env";
    o.innerHTML = '<p class="env-to"></p><div class="env-box"><div class="env-back"></div><div class="env-card">♥</div><div class="env-front"></div><div class="env-flap"></div><div class="env-seal">♥</div></div><p class="env-from"></p><button type="button" class="env-go-btn">点开看看</button>';
    o.querySelector(".env-to").textContent = state.to ? "给 " + state.to : "给你的一封信";
    o.querySelector(".env-from").textContent = state.from ? "来自 " + state.from : "";
    document.body.appendChild(o);
    var done = false;
    o.addEventListener("click", function () {
      if (done) return; done = true;
      if (!soundOn) setSound(true);
      unlockVoices();
      sfxDing(2);
      o.classList.add("open");
      setTimeout(function () { o.classList.add("go"); }, 1000);
      setTimeout(function () { o.remove(); opened = true; run(); }, 1600);
    });
  }

  function play() {
    played = true;
    timers.forEach(clearTimeout); timers = [];
    if (state.envelope && !opened) { showEnvelope(); return; }
    var old = document.querySelector(".env"); if (old) old.remove();
    run();
  }
  /* ---- 拼图告白：压轴那句话拆成碎片，藏在照片后面，拖到一起拼完整才出现压轴窗口 ---- */
  var puz = null, PU = /[，。！？、；,.!? ]/;
  function splitText(t, K) {
    var ch = Array.from(t), len = ch.length, cuts = [0], k, p, c, best, bd;
    for (k = 1; k < K; k++) {
      c = Math.round(len * k / K); best = c; bd = 99;
      for (p = c - 2; p <= c + 2; p++) if (p > cuts[k - 1] && p < len && PU.test(ch[p - 1]) && Math.abs(p - c) < bd) { best = p; bd = Math.abs(p - c); }
      cuts.push(Math.min(Math.max(best, cuts[k - 1] + 1), len - (K - k)));
    }
    cuts.push(len);
    return cuts.slice(0, -1).map(function (s, i) { return ch.slice(s, cuts[i + 1]).join(""); });
  }
  function setupPuzzle(seq, n, vw) {
    puz = null;
    var text = seq[n - 1].text, photos = [];
    seq.forEach(function (it, i) { if (it.m && it.m.kind === "image") photos.push(i); });
    var len = Array.from(text).length, K = Math.min(Math.max(3, Math.min(5, photos.length)), Math.floor(len / 2));
    var fs = Math.min(19, (vw - 24 - K * 22) / len);
    if (K < 2 || fs < 12) return;
    var ord = []; for (var k = 0; k < K; k++) ord.push(k);
    ord.sort(function () { return Math.random() - 0.5; });
    puz = { K: K, text: text, idx: n - 1, fs: fs, parts: splitText(text, K), els: [], grp: ord.map(function (_, k) { return k; }), cover: {}, loose: [], done: false, onDone: null };
    ord.forEach(function (piece, j) { if (j < photos.length) puz.cover[photos[j]] = piece; else puz.loose.push(piece); });
  }
  function makeShard(k) {
    var el = document.createElement("div");
    el.className = "shard" + (k > 0 ? " nl" : "") + (k < puz.K - 1 ? " nr" : "");
    el.dataset.c = String((k % 6) + 1);
    el.style.setProperty("--fs", puz.fs.toFixed(1) + "px");
    el.style.setProperty("--rot", ((Math.random() - 0.5) * 8).toFixed(1) + "deg");
    var t = document.createElement("span"); t.textContent = puz.parts[k]; el.appendChild(t);
    puz.els[k] = el;
    el.addEventListener("pointerdown", function (e) {
      if (puz.done) return;
      var g = puz.grp[k], st = [];
      puz.els.forEach(function (x, j) { if (x && puz.grp[j] === g) { st.push([x, x.offsetLeft, x.offsetTop]); x.style.zIndex = ++zTop; x.classList.remove("peek"); } });
      var sx = e.clientX, sy = e.clientY;
      el.setPointerCapture(e.pointerId);
      function mv(ev) { st.forEach(function (a) { a[0]._moved = true; a[0].style.left = (a[1] + ev.clientX - sx) + "px"; a[0].style.top = (a[2] + ev.clientY - sy) + "px"; }); }
      function up() { el.removeEventListener("pointermove", mv); el.removeEventListener("pointerup", up); el.removeEventListener("pointercancel", up); trySnap(); }
      el.addEventListener("pointermove", mv); el.addEventListener("pointerup", up); el.addEventListener("pointercancel", up);
    });
    return el;
  }
  function addShard(k, cov, vw, vh) {
    if (!puz) return;
    var el = makeShard(k); stage.appendChild(el);
    if (cov) { el._cov = cov; el.style.zIndex = Math.max(1, (+cov.style.zIndex || 11) - 1); }
    var w = el.offsetWidth, h = el.offsetHeight, left, top;
    if (cov) { /* 藏在照片后面，只露出下边（放不下就露出上边）一条缝 */
      left = cov.offsetLeft + (cov.offsetWidth - w) / 2; top = cov.offsetTop + cov.offsetHeight - 20;
      if (top + h > vh - 8) top = cov.offsetTop - h + 20;
    } else { left = 8 + Math.random() * Math.max(1, vw - w - 16); top = 70 + Math.random() * Math.max(1, vh - 200 - h); }
    el.style.left = Math.max(4, Math.min(vw - w - 4, left)) + "px";
    el.style.top = Math.max(4, Math.min(vh - h - 4, top)) + "px";
  }
  function ensurePeek() {
    if (!puz || puz.done || !document.elementFromPoint) return;
    var r = stage.getBoundingClientRect(), vw = stage.clientWidth, vh = stage.clientHeight, P = 20;
    puz.els.forEach(function (sh) {
      if (!sh || !sh._cov || sh._moved) return;
      var c = sh._cov, w = sh.offsetWidth, h = sh.offsetHeight, cl = c.offsetLeft, ct = c.offsetTop, cw = c.offsetWidth, ch = c.offsetHeight;
      var cands = [[cl + (cw - w) / 2, ct + ch - P, 0, 1], [cl + (cw - w) / 2, ct - h + P, 0, -1], [cl + cw - P, ct + (ch - h) / 2, 1, 0], [cl - w + P, ct + (ch - h) / 2, -1, 0]];
      var first = null, ok = false;
      for (var k = 0; k < cands.length && !ok; k++) {
        var x = Math.max(2, Math.min(vw - w - 2, cands[k][0])), y = Math.max(2, Math.min(vh - h - 2, cands[k][1]));
        if (!first) first = [x, y];
        sh.style.left = x + "px"; sh.style.top = y + "px";
        var px = x + w / 2 + cands[k][2] * (w / 2 - 6), py = y + h / 2 + cands[k][3] * (h / 2 - 6);
        var t = document.elementFromPoint(r.left + px, r.top + py);
        ok = !!t && (t === sh || sh.contains(t));
      }
      if (!ok && first) { sh.style.left = first[0] + "px"; sh.style.top = first[1] + "px"; }
      sh.classList.add("peek");
    });
  }
  function trySnap() {
    for (var i = 0; i < puz.K - 1; i++) {
      var A = puz.els[i], B = puz.els[i + 1];
      if (!A || !B || puz.grp[i] === puz.grp[i + 1]) continue;
      var dx = B.offsetLeft - (A.offsetLeft + A.offsetWidth), dy = B.offsetTop - A.offsetTop;
      if (Math.abs(dx) < 30 && Math.abs(dy) < A.offsetHeight * 0.8) {
        var ga = puz.grp[i], gb = puz.grp[i + 1];
        puz.els.forEach(function (x, j) { if (x && puz.grp[j] === gb) { x.style.left = (x.offsetLeft - dx) + "px"; x.style.top = (x.offsetTop - dy) + "px"; } });
        puz.grp = puz.grp.map(function (g) { return g === gb ? ga : g; });
        puz.els.forEach(function (x, j) { if (x && puz.grp[j] === ga) x.style.setProperty("--rot", "0deg"); });
        sfxDing(i + 2);
      }
    }
    if (puz.els.filter(Boolean).length === puz.K && puz.grp.every(function (g) { return g === puz.grp[0]; })) puzzleDone();
  }
  function puzzleDone() {
    puz.done = true;
    var vw = stage.clientWidth, vh = stage.clientHeight, x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    puz.els.forEach(function (x) { x.classList.remove("peek"); x.classList.add("done"); x0 = Math.min(x0, x.offsetLeft); y0 = Math.min(y0, x.offsetTop); x1 = Math.max(x1, x.offsetLeft + x.offsetWidth); y1 = Math.max(y1, x.offsetTop + x.offsetHeight); });
    var cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, r = stage.getBoundingClientRect();
    fxBurst(r.left + cx, r.top + cy); sfxFanfare(); beat();
    timers.push(setTimeout(function () {
      puz.els.forEach(function (x) { x.remove(); });
      var el = makeFinale(puz.text, puz.idx, vw, vh); stage.appendChild(el);
      el.style.left = Math.max(8, Math.min(vw - el.offsetWidth - 8, cx - el.offsetWidth / 2)) + "px";
      el.style.top = Math.max(8, Math.min(vh - el.offsetHeight - 8, cy - el.offsetHeight / 2)) + "px";
      bring(el); sfxFanfare();
      if (puz.onDone) puz.onDone();
    }, reduce ? 0 : 1100));
  }

  var runTok = 0;
  function run() {
    syncBgm();
    var tok = ++runTok;
    stopVoices();
    stage.classList.remove("beat");
    stage.innerHTML = "";
    var hintEl = document.getElementById("hint");
    hintEl.textContent = HINT; hintEl.className = "hint";
    applySkin(state.skin);
    fxStart();
    preloadMedia().then(function () { if (tok === runTok) startRun(hintEl); });
  }
  function startRun(hintEl) {
    var vw = stage.clientWidth, vh = stage.clientHeight;
    if (state.pets) spawnPets(vw, vh);
    var seq = curSeq = buildSeq(), n = seq.length, fin = hasFin(), m = outlineN();
    heartMode = useHeart(m);
    curLayout = heartMode ? heartLayout(m, vw, vh) : null;
    var baseW = Math.round(Math.min(320, vw * 0.66));
    puz = null;
    if (state.puzzle && fin) setupPuzzle(seq, n, vw);
    seq.forEach(function (it, i) {
      var isFin = fin && i === n - 1;
      var delay = reduce ? 0 : 250 + i * state.gap + (isFin ? 350 : 0);
      timers.push(setTimeout(function () {
        if (isFin && puz) return;
        var el;
        if (isFin) el = makeFinale(it.text, i, vw, vh);
        else el = curLayout ? makeItem(it, i, Math.round(curLayout.w), curLayout.s) : makeItem(it, i, baseW, 1);
        stage.appendChild(el);
        if (isFin) {
          if (curLayout) placeHeart(el);
          else { el.style.left = (vw - el.offsetWidth) / 2 + "px"; el.style.top = Math.max(40, vh * 0.45 - el.offsetHeight / 2) + "px"; }
        } else if (curLayout) { el._pos = curLayout.order[i]; placeHeart(el); }
        else placeScatter(el, i, n, vw, vh);
        if (puz && puz.cover[i] != null) zTop++;
        bring(el);
        if (isFin) sfxFanfare(); else sfxDing(i);
        if (puz && puz.cover[i] != null) addShard(puz.cover[i], el, vw, vh);
        if (it.m && it.m.kind === "voice" && state.autoVoice && el._autoplay) el._autoplay();
      }, delay));
    });
    if (curLayout && !reduce) timers.push(setTimeout(beat, 250 + (n - 1) * state.gap + 1300));
    var tEnd = reduce ? 0 : 250 + (n - 1) * state.gap;
    var signFn = function () { if (state.from) { hintEl.textContent = "—— " + state.from; hintEl.className = "hint signed"; } else { hintEl.textContent = HINT; hintEl.className = "hint"; } };
    if (puz) {
      puz.onDone = signFn;
      puz.loose.forEach(function (k, j) { timers.push(setTimeout(function () { addShard(k, null, vw, vh); }, tEnd + 350 + j * 250)); });
      timers.push(setTimeout(ensurePeek, tEnd + 700));
      timers.push(setTimeout(function () { hintEl.textContent = "照片后面好像藏着什么……把碎片拖到一起，拼成那句话"; }, tEnd + 900));
    } else if (state.from) timers.push(setTimeout(signFn, tEnd + (reduce ? 0 : 1000)));
  }

  /* ---- 保存：编辑者写入共享存储，其他人只存本机 ---- */
  function persist(next) {
    state = next; writeLocal(state); local = clone(state);
    return Promise.resolve("local");
  }

  /* ---- 抽屉 ---- */
  var scrim = document.getElementById("scrim");
  var sheetEdit = document.getElementById("sheetEdit"), sheetMore = document.getElementById("sheetMore");
  var fTitle = document.getElementById("fTitle"), fIcon = document.getElementById("fIcon"),
      fMsgs = document.getElementById("fMsgs"), fGap = document.getElementById("fGap"),
      fPets = document.getElementById("fPets"), fLayout = document.getElementById("fLayout"), fTo = document.getElementById("fTo"), fEnv = document.getElementById("fEnv"), fFin = document.getElementById("fFin"), fFx = document.getElementById("fFx"), gapVal = document.getElementById("gapVal"),
      modeNote = document.getElementById("modeNote"),
      skinChips = document.getElementById("skinChips"), tgrid = document.getElementById("tgrid");
  var draftSkin = state.skin;
  var fFrom = document.getElementById("fFrom"), sheetShare = document.getElementById("sheetShare");

  /* ---- 编辑面板：图片和语音列表 ---- */
  var draftMedia = [], rec = null, prev = null, draftBgm = null;
  var fPuzzle = document.getElementById("fPuzzle"), fPhoto = document.getElementById("fPhoto"), btnAddBgm = document.getElementById("btnAddBgm"), btnBgmPrev = document.getElementById("btnBgmPrev"),
      btnBgmDel = document.getElementById("btnBgmDel"), fBgm = document.getElementById("fBgm"), bgmNote = document.getElementById("bgmNote");
  document.getElementById("fPuzzle").addEventListener("change", function () { if (this.checked) document.getElementById("fFin").checked = true; });
  document.getElementById("fFin").addEventListener("change", function () { if (!this.checked) document.getElementById("fPuzzle").checked = false; });
  var BGM_MAX = 6 * 1024 * 1024;
  function renderBgm() {
    stopPreview();
    btnBgmPrev.hidden = btnBgmDel.hidden = !draftBgm;
    bgmNote.textContent = draftBgm
      ? "已选《" + (draftBgm.name || "未命名") + "》" + (draftBgm.dur ? " " + fmtDur(draftBgm.dur) : "") + "，保存后替换内置音乐。"
      : "现在用的是内置的八音盒音乐。支持 mp3 / m4a / wav / ogg，6MB 以内；请只用你有权使用的音乐，分享后拿到链接的人都能听到。";
  }
  function addBgmFile(f) {
    var ext = (/\.([A-Za-z0-9]+)$/.exec(f.name) || [])[1] || "";
    var type = f.type || { mp3: "audio/mpeg", m4a: "audio/mp4", aac: "audio/aac", wav: "audio/wav", ogg: "audio/ogg" }[ext.toLowerCase()] || "";
    var info = API.mimeInfo(type);
    if (!info || type.indexOf("audio/") !== 0) { showToast("这种音频格式暂时不支持，请用 mp3 / m4a / wav / ogg", false); return; }
    if (f.size > BGM_MAX) { showToast("歌曲超过 6MB，请剪短或压缩后再上传", false); return; }
    var blob = new Blob([f], { type: info.send });
    audioDuration(blob).then(function (dur) {
      if (draftBgm && (!state.bgm || state.bgm.id !== draftBgm.id)) dropBlob(draftBgm.id);
      var id = randId(10); setBlob(id, blob);
      draftBgm = { id: id, url: "", name: f.name.replace(/\.[^.]+$/, "").slice(0, 40), dur: dur || 0 };
      renderBgm();
    });
  }
  btnAddBgm.addEventListener("click", function () { fBgm.click(); });
  fBgm.addEventListener("change", function () { var f = fBgm.files && fBgm.files[0]; fBgm.value = ""; if (f) addBgmFile(f); });
  btnBgmPrev.addEventListener("click", function () { if (draftBgm) togglePreview(draftBgm, btnBgmPrev); });
  btnBgmDel.addEventListener("click", function () {
    if (draftBgm && (!state.bgm || state.bgm.id !== draftBgm.id)) dropBlob(draftBgm.id);
    draftBgm = null; renderBgm();
  });
  var mediaList = document.getElementById("mediaList"), fAutoVoice = document.getElementById("fAutoVoice"),
      btnAddImg = document.getElementById("btnAddImg"), btnRec = document.getElementById("btnRec"), btnAddAud = document.getElementById("btnAddAud"),
      fImg = document.getElementById("fImg"), fAud = document.getElementById("fAud");
  function textCount() { return fMsgs.value.split("\n").filter(function (s) { return s.trim(); }).length; }
  function stopPreview() { if (!prev) return; try { prev.a.pause(); } catch (e) {} prev.btn.textContent = "▶"; prev = null; }
  function togglePreview(m, btn) {
    if (prev && prev.id === m.id) { stopPreview(); return; }
    stopPreview();
    var a = new Audio(mediaSrc(m)); prev = { id: m.id, a: a, btn: btn }; btn.textContent = "■";
    a.onended = stopPreview; a.onerror = stopPreview;
    Promise.resolve(a.play()).catch(stopPreview);
  }
  function renderMediaList() {
    stopPreview();
    var L = textCount(), full = draftMedia.length >= MEDIA_MAX;
    btnAddImg.disabled = btnAddAud.disabled = full; btnRec.disabled = full && !rec;
    mediaList.innerHTML = "";
    draftMedia.forEach(function (m, idx) {
      var src = mediaSrc(m), row = document.createElement("div"); row.className = "mrow";
      var th;
      if (m.kind === "image" && src) { th = document.createElement("img"); th.src = src; th.alt = ""; th.className = "mthumb"; }
      else { th = document.createElement("div"); th.className = "mthumb"; th.textContent = !src ? "文件丢失" : "语音" + (m.dur ? "\n" + fmtDur(m.dur) : ""); th.style.whiteSpace = "pre-line"; }
      var info = document.createElement("div"); info.className = "minfo";
      var cap = document.createElement("input"); cap.type = "text"; cap.maxLength = 40; cap.value = m.cap; cap.placeholder = "配一句话（可不写）";
      cap.id = "mcap" + idx; cap.setAttribute("aria-label", "第 " + (idx + 1) + " 个附件的说明");
      cap.addEventListener("input", function () { m.cap = cap.value.slice(0, 40); });
      var at = document.createElement("select"); at.id = "mat" + idx; at.setAttribute("aria-label", "第 " + (idx + 1) + " 个附件出现的位置");
      for (var k = 0; k <= L; k++) {
        var op = document.createElement("option"); op.value = String(k);
        op.textContent = k === 0 ? "最先弹出" : k === L ? "最后弹出" : "第 " + k + " 条文字之后";
        at.appendChild(op);
      }
      at.value = String(Math.min(m.at, L));
      at.addEventListener("change", function () { m.at = +at.value; });
      info.appendChild(cap); info.appendChild(at);
      var act = document.createElement("div"); act.className = "mact";
      if (m.kind === "voice" && src) {
        var pb = document.createElement("button"); pb.type = "button"; pb.className = "ibtn"; pb.textContent = "▶"; pb.setAttribute("aria-label", "试听");
        pb.addEventListener("click", function () { togglePreview(m, pb); });
        act.appendChild(pb);
      }
      var del = document.createElement("button"); del.type = "button"; del.className = "ibtn"; del.textContent = "删除"; del.setAttribute("aria-label", "删除这个附件");
      del.addEventListener("click", function () { draftMedia.splice(draftMedia.indexOf(m), 1); renderMediaList(); });
      act.appendChild(del);
      row.appendChild(th); row.appendChild(info); row.appendChild(act);
      mediaList.appendChild(row);
    });
  }
  function addMedia(kind, blob, dur, ratio) {
    if (draftMedia.length >= MEDIA_MAX) { showToast("最多添加 " + MEDIA_MAX + " 个", false); return; }
    var id = randId(10); setBlob(id, blob);
    if (ratio) dims[id] = ratio;
    draftMedia.push({ id: id, kind: kind, url: "", cap: "", at: textCount(), dur: dur || 0 });
    renderMediaList();
  }
  function viaImg(file) {
    return new Promise(function (res, rej) {
      var u = URL.createObjectURL(file), im = new Image();
      im.onload = function () { URL.revokeObjectURL(u); res(im); };
      im.onerror = function () { URL.revokeObjectURL(u); rej(new Error("decode")); };
      im.src = u;
    });
  }
  /* 压到最长边 1024px 的 JPEG：体积小，也顺便去掉了照片里的位置等信息 */
  function compressImage(file) {
    var load = window.createImageBitmap ? createImageBitmap(file).catch(function () { return viaImg(file); }) : viaImg(file);
    return load.then(function (src) {
      var w = src.naturalWidth || src.width, h = src.naturalHeight || src.height, k = Math.min(1, 1024 / Math.max(w, h));
      var cw = Math.max(1, Math.round(w * k)), ch = Math.max(1, Math.round(h * k));
      var c = document.createElement("canvas"); c.width = cw; c.height = ch;
      var g = c.getContext("2d"); g.fillStyle = "#fff"; g.fillRect(0, 0, cw, ch); g.drawImage(src, 0, 0, cw, ch);
      if (src.close) src.close();
      return new Promise(function (res, rej) {
        c.toBlob(function (b) {
          if (!b) return rej(new Error("encode"));
          if (b.size > 450000) c.toBlob(function (b2) { res({ blob: b2 || b, ratio: cw / ch }); }, "image/jpeg", 0.65);
          else res({ blob: b, ratio: cw / ch });
        }, "image/jpeg", 0.82);
      });
    });
  }
  function audioDuration(blob) {
    return new Promise(function (res) {
      var a = new Audio(), u = URL.createObjectURL(blob), t = setTimeout(done, 3000);
      function done() { clearTimeout(t); URL.revokeObjectURL(u); res(isFinite(a.duration) ? a.duration : 0); }
      a.preload = "metadata"; a.onloadedmetadata = done; a.onerror = done; a.src = u;
    });
  }
  function addImages(files) {
    var list = Array.prototype.slice.call(files), failed = 0;
    return list.reduce(function (p, f) {
      return p.then(function () {
        return compressImage(f).then(function (r) { addMedia("image", r.blob, 0, r.ratio); }, function () { failed++; });
      });
    }, Promise.resolve()).then(function () {
      if (failed) showToast(failed + " 张图片读不出来，换 jpg / png / webp 试试", false);
    });
  }
  function addAudioFile(f) {
    var ext = (/\.([A-Za-z0-9]+)$/.exec(f.name) || [])[1] || "";
    var type = f.type || { mp3: "audio/mpeg", m4a: "audio/mp4", aac: "audio/aac", wav: "audio/wav", ogg: "audio/ogg", webm: "audio/webm" }[ext.toLowerCase()] || "";
    var info = API.mimeInfo(type);
    if (!info || type.indexOf("audio/") !== 0) { showToast("这种音频格式暂时不支持，请用 mp3 / m4a / wav / ogg", false); return; }
    if (f.size > 2.5 * 1024 * 1024) { showToast("音频超过 2.5MB，请剪短一点再上传", false); return; }
    var blob = new Blob([f], { type: info.send });
    audioDuration(blob).then(function (d) { addMedia("voice", blob, d); });
  }
  function recLabel() { btnRec.textContent = rec ? "停止录音 " + fmtDur(Math.max(1, (Date.now() - rec.t0) / 1000)) : "录一段语音"; btnRec.classList.toggle("rec", !!rec); }
  function stopRecording(discard) { if (rec) { rec.discard = !!discard; try { rec.mr.stop(); } catch (e) {} } }
  function startRecording() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !window.MediaRecorder) { showToast("这个浏览器不能录音，请改用「上传音频」", false); return; }
    navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
      var mt = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg;codecs=opus"].filter(function (t) { return MediaRecorder.isTypeSupported(t); })[0];
      var mr = new MediaRecorder(stream, mt ? { mimeType: mt } : undefined), chunks = [];
      var r = rec = { mr: mr, t0: Date.now(), discard: false };
      mr.ondataavailable = function (e) { if (e.data && e.data.size) chunks.push(e.data); };
      mr.onstop = function () {
        stream.getTracks().forEach(function (t) { t.stop(); });
        clearInterval(r.tick); clearTimeout(r.cap);
        var dur = (Date.now() - r.t0) / 1000; rec = null; recLabel(); renderMediaList();
        if (r.discard) return;
        if (dur < 0.6) { showToast("录音太短了，再试一次", false); return; }
        var info = API.mimeInfo(mr.mimeType || mt || "audio/webm");
        addMedia("voice", new Blob(chunks, { type: info ? info.send : "audio/webm" }), dur);
      };
      mr.start(); recLabel(); renderMediaList();
      r.tick = setInterval(recLabel, 250);
      r.cap = setTimeout(function () { stopRecording(false); }, 30000);
    }).catch(function () { showToast("没有拿到麦克风权限。在浏览器地址栏左边的设置里允许一下，或者改用「上传音频」", false); });
  }
  btnRec.addEventListener("click", function () { if (rec) stopRecording(false); else startRecording(); });
  btnAddImg.addEventListener("click", function () { fImg.click(); });
  btnAddAud.addEventListener("click", function () { fAud.click(); });
  fImg.addEventListener("change", function () { var fs = fImg.files; if (fs && fs.length) addImages(fs).then(function () { fImg.value = ""; }); });
  fAud.addEventListener("change", function () { var f = fAud.files && fAud.files[0]; if (f) addAudioFile(f); fAud.value = ""; });
  var mlTimer = null;
  fMsgs.addEventListener("input", function () { clearTimeout(mlTimer); mlTimer = setTimeout(renderMediaList, 250); });
  /* 取消编辑时，丢掉这次新加、还没保存的文件 */
  function discardDraftMedia() {
    stopRecording(true); stopPreview();
    draftMedia.forEach(function (m) { if (!state.media.some(function (s) { return s.id === m.id; })) dropBlob(m.id); });
    if (draftBgm && (!state.bgm || state.bgm.id !== draftBgm.id)) dropBlob(draftBgm.id);
    draftBgm = null; draftMedia = [];
  }
  /* 保存时：新文件写进 IndexedDB，被删掉的清出去 */
  function commitMedia(next, old) {
    var keep = {}, jobs = [];
    next.forEach(function (m) { keep[m.id] = 1; if (blobs[m.id]) jobs.push(idbPut(m.id, blobs[m.id])); });
    old.forEach(function (m) { if (!keep[m.id]) { jobs.push(idbDel(m.id)); dropBlob(m.id); } });
    return Promise.all(jobs);
  }

  function renderSkinChips() {
    skinChips.innerHTML = "";
    SKIN_ORDER.forEach(function (id) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "chip";
      b.setAttribute("aria-pressed", String(id === draftSkin));
      b.innerHTML = swatch(id) + "<span></span>";
      b.lastChild.textContent = TEMPLATES[id].name;
      b.addEventListener("click", function () { draftSkin = id; applySkin(id); renderSkinChips(); });
      skinChips.appendChild(b);
    });
  }
  function renderTemplates() {
    tgrid.innerHTML = "";
    SKIN_ORDER.forEach(function (id) {
      var t = TEMPLATES[id], b = document.createElement("button");
      b.type = "button"; b.className = "tcard";
      b.setAttribute("aria-pressed", String(id === state.skin));
      b.innerHTML = swatch(id) + "<b></b><span class='d'></span>";
      b.childNodes[1].textContent = t.icon + " " + t.name;
      b.childNodes[2].textContent = t.msgs.length + " 条 · " + t.blurb;
      b.addEventListener("click", function () { useTemplate(id); });
      tgrid.appendChild(b);
    });
  }
  function fill() {
    fTitle.value = state.title; fIcon.value = state.icon; fMsgs.value = state.msgs.join("\n");
    fLayout.value = state.layout; fTo.value = state.to; fFrom.value = state.from; fEnv.checked = state.envelope; fFin.checked = state.finale; fFx.checked = state.fx; fGap.value = state.gap; fPets.checked = state.pets; gapVal.textContent = (state.gap / 1000).toFixed(2);
    draftSkin = state.skin; renderSkinChips();
    draftMedia = clone(state.media); fAutoVoice.checked = state.autoVoice; renderMediaList(); recLabel();
    fPuzzle.checked = state.puzzle; fPhoto.value = state.photoStyle; draftBgm = state.bgm ? clone(state.bgm) : null; renderBgm();
    modeNote.textContent = "这里的修改保存在你自己的浏览器里；点「分享」会把当前内容存到云端，生成发给 TA 的链接。";
  }
  function closeAll() {
    var wasEdit = !sheetEdit.hidden;
    sheetEdit.hidden = true; sheetMore.hidden = true; sheetShare.hidden = true; scrim.hidden = true;
    if (wasEdit) { applySkin(state.skin); discardDraftMedia(); }
  }
  function openEdit() { closeAll(); fill(); sheetEdit.hidden = false; scrim.hidden = false; }
  function openMore() { closeAll(); renderTemplates(); sheetMore.hidden = false; scrim.hidden = false; }

  fGap.addEventListener("input", function () { gapVal.textContent = (fGap.value / 1000).toFixed(2); });
  document.getElementById("btnEdit").addEventListener("click", openEdit);
  document.getElementById("btnMore").addEventListener("click", openMore);
  document.getElementById("btnReplay").addEventListener("click", function () { opened = false; unlockVoices(); play(); });
  document.getElementById("btnClose").addEventListener("click", closeAll);
  document.getElementById("btnMoreClose").addEventListener("click", closeAll);
  scrim.addEventListener("click", closeAll);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeAll(); });

  document.getElementById("btnSave").addEventListener("click", function () {
    if (rec) { showToast("录音还没停，先点「停止录音」再保存", false); return; }
    var lines = fMsgs.value.split("\n").map(function (s) { return s.trim(); }).filter(Boolean).slice(0, 40);
    var next = {
      skin: draftSkin,
      title: fTitle.value.trim() || DEFAULTS.title,
      icon: fIcon.value.trim(),
      gap: +fGap.value || DEFAULTS.gap,
      pets: fPets.checked,
      layout: fLayout.value, to: fTo.value.trim(), from: fFrom.value.trim(), envelope: fEnv.checked, finale: fFin.checked, fx: fFx.checked,
      msgs: lines.length ? lines : DEFAULTS.msgs.slice(),
      media: normMedia(draftMedia.filter(function (m) { return mediaSrc(m); })), autoVoice: fAutoVoice.checked,
      photoStyle: fPhoto.value, puzzle: fPuzzle.checked,
      bgm: draftBgm && mediaSrc(draftBgm) ? normBgm(draftBgm) : null
    };
    var oldMedia = state.media.concat(state.bgm ? [state.bgm] : []);
    stopPreview(); unlockVoices();
    sheetEdit.hidden = true; scrim.hidden = true; draftMedia = []; draftBgm = null;
    commitMedia(next.media.concat(next.bgm ? [next.bgm] : []), oldMedia).then(function () { return persist(next); }).then(function (mode) {
      play();
      showToast(mode === "shared" ? "已保存，所有人都会看到" : "已保存在这台设备上", false);
    });
  });
  document.getElementById("btnReset").addEventListener("click", function () {
    var t = TEMPLATES[draftSkin];
    fTitle.value = t.title; fIcon.value = t.icon; fMsgs.value = t.msgs.join("\n");
  });

  /* ---- 模板与撤销 ---- */
  var toastEl = document.getElementById("toast"), toastText = document.getElementById("toastText"),
      toastUndo = document.getElementById("toastUndo"), toastTimer = null, undoState = null;
  function showToast(msg, withUndo) {
    toastText.textContent = msg; toastUndo.hidden = !withUndo; toastEl.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.hidden = true; undoState = null; }, 6000);
  }
  function useTemplate(id) {
    var t = TEMPLATES[id];
    undoState = clone(state);
    var next = { skin: id, title: t.title, icon: t.icon, gap: state.gap, pets: state.pets, layout: state.layout, to: state.to, from: state.from, envelope: !!t.envelope, finale: !!t.finale, fx: state.fx, msgs: t.msgs.slice(), media: clone(state.media), autoVoice: state.autoVoice, photoStyle: state.photoStyle, puzzle: state.puzzle, bgm: state.bgm ? clone(state.bgm) : null };
    closeAll();
    persist(next).then(function () { play(); showToast("已套用「" + t.name + "」", true); });
  }
  toastUndo.addEventListener("click", function () {
    if (!undoState) return;
    var prev = undoState; undoState = null; toastEl.hidden = true;
    persist(prev).then(function () { play(); });
  });


  /* ---- 分享：内容编码进链接（#z…），二维码用 qrcode-generator ---- */
  var SHARE_BASE = (window.APP_CONFIG && window.APP_CONFIG.SHARE_BASE) || location.href.split(/[?#]/)[0];
  var sTo = document.getElementById("sTo"), sFrom = document.getElementById("sFrom"), sLink = document.getElementById("sLink"),
      qrImg = document.getElementById("qrImg"), qrNote = document.getElementById("qrNote"),
      btnCopy = document.getElementById("btnCopy"), btnNative = document.getElementById("btnNative"),
      btnShare = document.getElementById("btnShare"), sEnv = document.getElementById("sEnv"), shTimer = null, shSeq = 0, shareCache = {};
  function b64u(bytes) {
    var s = ""; for (var i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
    return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  function unb64u(t) {
    t = t.replace(/-/g, "+").replace(/_/g, "/"); while (t.length % 4) t += "=";
    var s = atob(t), a = new Uint8Array(s.length); for (var i = 0; i < s.length; i++) a[i] = s.charCodeAt(i);
    return a;
  }
  function pipeBytes(bytes, Ctor) {
    var cs = new Ctor("deflate-raw"), w = cs.writable.getWriter();
    w.write(bytes); w.close();
    return new Response(cs.readable).arrayBuffer().then(function (b) { return new Uint8Array(b); });
  }
  function encodeShare(obj) {
    var bytes = new TextEncoder().encode(JSON.stringify(obj));
    function plain() { return "p" + b64u(bytes); }
    if (!window.CompressionStream) return Promise.resolve(plain());
    return pipeBytes(bytes, window.CompressionStream).then(function (z) { var c = "z" + b64u(z), p = plain(); return c.length < p.length ? c : p; }).catch(plain);
  }
  function decodeShare(t) {
    try {
      var bytes = unb64u(t.slice(1));
      var p = t.charAt(0) === "z" ? (window.DecompressionStream ? pipeBytes2(bytes) : Promise.reject()) : Promise.resolve(bytes);
      return p.then(function (b) { return norm(JSON.parse(new TextDecoder().decode(b))); }).catch(function () { return null; });
    } catch (e) { return Promise.resolve(null); }
  }
  function pipeBytes2(bytes) {
    var ds = new DecompressionStream("deflate-raw"), w = ds.writable.getWriter();
    w.write(bytes); w.close();
    return new Response(ds.readable).arrayBuffer().then(function (b) { return new Uint8Array(b); });
  }
  function makeQR(text) {
    if (!window.qrcode) return null;
    var q = null, lv = ["M", "L"];
    for (var i = 0; i < lv.length && !q; i++) {
      try { var t = window.qrcode(0, lv[i]); t.addData(text); t.make(); q = t; } catch (e) { q = null; }
    }
    if (!q) return null;
    var n = q.getModuleCount(), px = Math.max(3, Math.ceil(300 / (n + 8))), size = (n + 8) * px;
    var c = document.createElement("canvas"); c.width = c.height = size;
    var g = c.getContext("2d"); g.fillStyle = "#fff"; g.fillRect(0, 0, size, size); g.fillStyle = "#000";
    for (var r = 0; r < n; r++) for (var k = 0; k < n; k++) if (q.isDark(r, k)) g.fillRect((k + 4) * px, (r + 4) * px, px, px);
    return c.toDataURL("image/png");
  }
  function showShare(url, dropped) {
    sLink.value = url;
    var img = makeQR(url), note;
    if (img) { qrImg.src = img; qrImg.hidden = false; note = "手机相机扫一扫，或长按保存这张图发给 TA"; }
    else { qrImg.hidden = true; note = window.qrcode ? "文字有点多，二维码装不下，请用下面的链接（或删掉几条再试）" : "二维码暂时生成不了，先用下面的链接"; }
    if (dropped) note += API.enabled
      ? "\n有 " + dropped + " 个图片或语音没能上传（网络不稳，或还没运行 schema-2.sql / schema-3.sql），链接里没有它们。"
      : "\n还没连上云端存储，图片和语音没有放进链接。";
    qrNote.textContent = note; qrNote.style.whiteSpace = "pre-line";
  }
  /* 图片和语音先上传到 Storage（只传一次，地址记在本机），分享数据里只放地址 */
  var uploading = {};
  function rememberUrl(id, url) {
    state.media.forEach(function (m) { if (m.id === id) m.url = url; });
    if (state.bgm && state.bgm.id === id) state.bgm.url = url;
    writeLocal(state); local = clone(state);
  }
  function uploadItem(m) {
    if (m.url) return Promise.resolve(m.url);
    if (uploading[m.id]) return uploading[m.id];
    var b = blobs[m.id];
    if (!b) return Promise.reject(new Error("no file"));
    var p = API.uploadMedia(b).then(function (url) { delete uploading[m.id]; rememberUrl(m.id, url); return url; }, function (e) { delete uploading[m.id]; throw e; });
    uploading[m.id] = p;
    return p;
  }
  function withUploads(o) {
    var items = o.media || [], hasB = !!o.bgm;
    if (!items.length && !hasB) return Promise.resolve({ o: o, dropped: 0 });
    if (!API.enabled) { o.media = []; o.bgm = null; return Promise.resolve({ o: o, dropped: items.length + (hasB ? 1 : 0) }); }
    var jobs = items.map(function (m) {
      return uploadItem(m).then(function (url) { return { id: m.id, kind: m.kind, url: url, cap: m.cap, at: m.at, dur: m.dur }; }, function () { return null; });
    });
    var bj = hasB ? uploadItem(o.bgm).then(function (url) { return { id: o.bgm.id, url: url, name: o.bgm.name, dur: o.bgm.dur }; }, function () { return null; }) : Promise.resolve(null);
    return Promise.all([Promise.all(jobs), bj]).then(function (r) {
      var ok = r[0].filter(Boolean), dropped = items.length - ok.length;
      o.media = ok;
      if (hasB) { if (r[1]) o.bgm = r[1]; else { o.bgm = null; dropped++; } }
      return { o: o, dropped: dropped };
    });
  }
  /* 优先存到 Supabase 拿短链接；没配置或网络失败时，退回把内容编码进链接 */
  function shareUrl(o) {
    var key = sig(o);
    if (shareCache[key]) return Promise.resolve({ url: shareCache[key], dropped: 0 });
    return withUploads(clone(o)).then(function (r) {
      var p = API.enabled
        ? API.saveShare(r.o).then(function (id) { var u = SHARE_BASE + "?s=" + id; if (!r.dropped) shareCache[key] = u; return u; })
        : Promise.reject();
      return p.catch(function () { return encodeShare(r.o).then(function (code) { return SHARE_BASE + "#" + code; }); })
        .then(function (u) { return { url: u, dropped: r.dropped }; });
    });
  }
  function buildShare() {
    var seq = ++shSeq, o = clone(state);
    o.to = sTo.value.trim().slice(0, 12); o.from = sFrom.value.trim().slice(0, 12); o.envelope = sEnv.checked;
    sLink.value = o.media.length || o.bgm ? "正在上传图片、语音和歌曲…" : "生成中…";
    shareUrl(o).then(function (r) { if (seq === shSeq) showShare(r.url, r.dropped); });
  }
  function saveNames() {
    var n = clone(state); n.to = sTo.value.trim().slice(0, 12); n.from = sFrom.value.trim().slice(0, 12);
    if (sig(n) !== sig(state)) persist(n);
  }
  function openShare() {
    closeAll(); sTo.value = state.to; sFrom.value = state.from; sEnv.checked = true;
    btnNative.hidden = !navigator.share;
    sheetShare.hidden = false; scrim.hidden = false; buildShare();
  }
  function copyLink() {
    var v = sLink.value;
    function fb() {
      sLink.focus(); sLink.select();
      try { showToast(document.execCommand("copy") ? "链接已复制" : "请长按链接手动复制", false); } catch (e) { showToast("请长按链接手动复制", false); }
    }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(v).then(function () { showToast("链接已复制", false); }, fb);
    else fb();
  }
  function setViewing(v) { viewing = v; root.classList.toggle("viewer", v); }
  [sTo, sFrom].forEach(function (el) {
    el.addEventListener("input", function () { clearTimeout(shTimer); shTimer = setTimeout(buildShare, 700); });
    el.addEventListener("change", saveNames);
  });
  sEnv.addEventListener("change", buildShare);
  btnShare.addEventListener("click", openShare);
  btnCopy.addEventListener("click", copyLink);
  btnNative.addEventListener("click", function () {
    var who = sTo.value.trim();
    navigator.share({ title: state.title, text: who ? "给 " + who + " 的一封信" : "给你的一封信", url: sLink.value }).catch(function () {});
  });
  document.getElementById("btnShClose").addEventListener("click", function () { saveNames(); closeAll(); });

  /* ---- 启动：模板和分享内容都从 Supabase 读取，读不到就用内置/本机的 ---- */
  var qs = new URLSearchParams(location.search), sid = qs.get("s"), tid = qs.get("t"),
      hm = /^#([zp][A-Za-z0-9_-]{8,})$/.exec(location.hash || "");
  var sharePromise = sid ? (API.enabled ? API.getShare(sid) : Promise.reject()) : null;
  if (sharePromise) sharePromise.catch(function () {});

  function boot() { applySkin(state.skin); play(); }
  function startViewer(s) { state = s; setViewing(true); boot(); }
  function badLink() {
    state = clone(DEFAULTS); setViewing(true); boot();
    document.getElementById("hint").textContent = "这个链接打不开了，先看看默认的";
  }
  function fromTemplate(id) {
    var t = TEMPLATES[id], env = qs.get("env");
    return norm({ skin: id, title: t.title, icon: t.icon, gap: 450, pets: true, layout: "auto", to: qs.get("to") || "", from: qs.get("from") || "",
      envelope: env === null ? t.envelope : env !== "0", finale: t.finale, fx: true, msgs: t.msgs.slice(), media: [], autoVoice: true });
  }
  function refreshTemplates() {
    if (!API.enabled) return Promise.resolve();
    return API.templates().then(function (rows) {
      if (setTemplates(rows)) { DEFAULTS = mkDefaults(); try { localStorage.setItem(TKEY, JSON.stringify(rows)); } catch (e) {} }
    }).catch(function () {});
  }
  function init() {
    local = readLocal();
    if (sharePromise) sharePromise.then(function (d) { var s = norm(d); if (s) startViewer(s); else badLink(); }, badLink);
    else if (hm) decodeShare(hm[1]).then(function (s) { if (s) startViewer(s); else badLink(); });
    else if (tid && TEMPLATES[tid]) startViewer(fromTemplate(tid));
    else { setViewing(false); state = local || clone(DEFAULTS); loadBlobs(state.media.concat(state.bgm ? [state.bgm] : [])).then(boot); }
  }
  document.addEventListener("pointerdown", function () { if (viewing && !soundOn && !userMuted && state.bgm && mediaSrc(state.bgm)) setSound(true); }, true);
  if (viewing) Promise.race([refreshTemplates(), new Promise(function (r) { setTimeout(r, 3000); })]).then(init);
  else { init(); refreshTemplates(); }
})();
