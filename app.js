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
    return { skin: id, title: t.title, icon: t.icon, gap: 450, pets: true, layout: "auto", to: "", from: "", envelope: false, finale: false, fx: true, msgs: t.msgs.slice(), media: [], autoVoice: true, photoStyle: "window", bgm: null, puzzle: false, cats: true, fireworks: true, accept: "", cat: { name: "", fur: "theme", pat: "none", eye: "dark", bow: "none" }, wand: true, boxgame: true, fish: true, randGame: false, catVoice: true, knock: true, selfie: true, selfiePhoto: null, cake: true, wish: true, wishStar: true, angler: false, snow: false, yarn: false, paw: false, balloon: false, entryRand: false };
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
  function normCat(c) {
    c = c && typeof c === "object" ? c : {};
    function pick(v, list) { return list.indexOf(v) >= 0 ? v : list[0]; }
    return { name: typeof c.name === "string" ? c.name.slice(0, 8) : "", fur: pick(c.fur, ["theme", "cream", "orange", "gray", "black", "white"]),
      pat: pick(c.pat, ["none", "spots", "tabby", "socks"]), eye: pick(c.eye, ["dark", "green", "blue", "gold"]), bow: pick(c.bow, ["none", "red", "blue", "yellow", "pink"]) };
  }
  function normBgm(b) {
    if (!b || typeof b !== "object") return null;
    var base = (API && API.mediaBase) || "";
    var id = typeof b.id === "string" && /^[A-Za-z0-9]{6,24}$/.test(b.id) ? b.id : randId(10);
    var url = typeof b.url === "string" && base && b.url.indexOf(base) === 0 && /^[A-Za-z0-9._:\/-]+$/.test(b.url) ? b.url : "";
    return { id: id, url: url, name: typeof b.name === "string" ? b.name.slice(0, 40) : "", dur: Math.max(0, Math.min(1800, +b.dur || 0)) };
  }
  function normPhoto(b) {
    if (!b || typeof b !== "object") return null;
    var base = (API && API.mediaBase) || "";
    var id = typeof b.id === "string" && /^[A-Za-z0-9]{6,24}$/.test(b.id) ? b.id : randId(10);
    var url = typeof b.url === "string" && base && b.url.indexOf(base) === 0 && /^[A-Za-z0-9._:\/-]+$/.test(b.url) ? b.url : "";
    return { id: id, url: url };
  }
  function extraMedia(o) { var r = []; if (o.bgm) r.push(o.bgm); if (o.selfiePhoto) r.push(o.selfiePhoto); return r; }
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
      puzzle: !!o.puzzle,
      cats: o.cats !== false,
      fireworks: o.fireworks !== false,
      accept: typeof o.accept === "string" ? o.accept.slice(0, 200) : "",
      cat: normCat(o.cat),
      wand: o.wand !== false,
      boxgame: o.boxgame !== false,
      fish: o.fish !== false,
      randGame: !!o.randGame,
      catVoice: o.catVoice !== false,
      knock: o.knock !== false,
      selfie: o.selfie !== false,
      selfiePhoto: normPhoto(o.selfiePhoto),
      cake: o.cake !== false,
      wish: o.wish !== false,
      wishStar: o.wishStar !== false,
      angler: !!o.angler,
      snow: !!o.snow,
      yarn: !!o.yarn,
      paw: !!o.paw,
      balloon: !!o.balloon,
      entryRand: !!o.entryRand
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
    carton: ["##############", "#oooooooooooo#", "#oooo####oooo#", "##############", "#oooooooooooo#", "#oooooooooooo#", "#oooooooooooo#", "#oooooooooooo#", "#oooooooooooo#", "##############"],
    letter: ["#######", "##ooo##", "#o#o#o#", "#ooooo#", "#######"],
    box: ["  #####  ", "#########", "#ooo#ooo#", "#########", "#ooo#ooo#", "#ooo#ooo#", "#ooo#ooo#", "#########"],
    heart: [" ## ## ", "#ooooo#", "#ooooo#", " #ooo# ", "  #o#  ", "   #   "],
    fish: ["  #####      #", " #ooooo#    ##", "#o#oooooo#####", "#oooooooooo###", " #oooooo#o  ##", "  ######    # "],
    star: ["   #   ", "   #   ", " ##o## ", "#ooooo#", " ##o## ", "   #   ", "   #   "]
  };
  /* 倒挂的鱼：把横放的鱼逆时针转 90°，头朝下、尾巴在上 */
  SPRITES.fishv = (function (r) { var H = r.length, W = r[0].length, out = []; for (var y = 0; y < W; y++) { var row = ""; for (var x = 0; x < H; x++) row += r[x].charAt(W - 1 - y) || " "; out.push(row); } return out; })(SPRITES.fish);
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
    ttl.textContent = state.cats && state.cat.name ? state.cat.name + " · 第" + (i + 1) + "封" : (state.icon ? state.icon + " " : "") + state.title;
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
  /* ---- 你们的小猫：毛色 / 花纹 / 眼睛 / 领结，还有表情和心情 ---- */
  var FUR = { cream: "#f6e3c1", orange: "#f2a65a", gray: "#b8bcc8", black: "#4a4756", white: "#fbf7ef" };
  var PATC = { cream: "#d9a867", orange: "#c9742e", gray: "#8a8fa0", black: "#6b6778", white: "#d8d2c4" };
  var EYEC = { dark: "#2b2530", green: "#2fa36b", blue: "#3f86e0", gold: "#e0a526" };
  var BOWC = { red: "#e5484d", blue: "#4a8fe0", yellow: "#f2c230", pink: "#ff8fb1" };
  function catCfg(slot, c) {
    c = c || state.cat; var th = c.fur === "theme";
    return { fur: th ? "var(--pet-" + (slot || "a") + ")" : FUR[c.fur], patc: th ? "var(--pet-c)" : PATC[c.fur], eye: EYEC[c.eye],
      bow: c.bow === "none" ? null : BOWC[c.bow], socks: c.fur === "white" ? "#ffd1dc" : "#ffffff", pat: c.pat };
  }
  function catSvg(px, cf, mood, glow) {
    var g = SPRITES.cat.map(function (r) { return r.split(""); });
    function set(list, ch) { list.forEach(function (p) { g[p[0]][p[1]] = ch; }); }
    if (cf.pat === "spots") set([[3, 2], [3, 9], [8, 3], [9, 8], [8, 9]], "p");
    else if (cf.pat === "tabby") set([[3, 5], [3, 7], [7, 3], [7, 9], [9, 3], [9, 9], [8, 5], [8, 7]], "p");
    else if (cf.pat === "socks") set([[10, 2], [10, 5], [10, 6], [10, 7], [10, 10]], "w");
    if (cf.bow) set([[7, 5], [7, 6], [7, 7]], "b");
    set([[4, 3], [4, 8]], "o");
    if (mood === "sleep") set([[4, 2], [4, 3], [4, 4], [4, 7], [4, 8], [4, 9]], "#");
    else if (mood === "happy") set([[4, 2], [3, 3], [4, 4], [4, 7], [3, 8], [4, 9]], "#");
    else if (mood === "up") set([[3, 3], [3, 8]], "e");
    else if (mood === "back") set([[6, 6]], "o");
    else { set([[4, 3], [4, 8]], "e"); if (mood === "wide") set([[6, 5], [6, 7]], "#"); }
    var col = { "#": "var(--pet-line)", o: cf.fur, p: cf.patc, e: glow || cf.eye, b: cf.bow, w: cf.socks }, s = "";
    for (var y = 0; y < g.length; y++) for (var x = 0; x < g[y].length; x++) { var f = col[g[y][x]]; if (f) s += '<rect x="' + x + '" y="' + y + '" width="1" height="1" fill="' + f + '"/>'; }
    return '<svg width="' + 14 * px + '" height="' + 12 * px + '" viewBox="0 0 14 12" aria-hidden="true">' + s + "</svg>";
  }
  var TAIL = ["  ##", " #o#", " #o#", "#o# ", "#o# ", "### "];
  function tailSvg(px, fur) {
    var s = "";
    TAIL.forEach(function (r, y) { for (var x = 0; x < 4; x++) { var c = r.charAt(x); if (c !== " ") s += '<rect x="' + x + '" y="' + y + '" width="1" height="1" fill="' + (c === "#" ? "var(--pet-line)" : fur) + '"/>'; } });
    return '<svg width="' + 4 * px + '" height="' + 6 * px + '" viewBox="0 0 4 6" aria-hidden="true">' + s + "</svg>";
  }
  function catBox(px, cf, mood, glow) {
    var b = document.createElement("div"); b.className = "cbox"; b.style.cssText = "position:relative;width:" + 14 * px + "px;height:" + 12 * px + "px";
    var body = document.createElement("div"); body.className = "cbody";
    var tail = document.createElement("div"); tail.className = "ctail"; tail.style.left = 12 * px + "px"; tail.style.top = 5 * px + "px"; tail.innerHTML = tailSvg(px, cf.fur);
    b.appendChild(body); b.appendChild(tail);
    b.setMood = function (m, gl) { body.innerHTML = catSvg(px, cf, m, gl); };
    b.setMood(mood, glow);
    return b;
  }
  /* 屏幕角落的那只小猫：会犯困、会炸毛、会生气、会高兴 */
  var res = null, lastAct = Date.now();
  function resSay(t, ms) {
    if (!res) return; clearTimeout(res.bt); res.bub.textContent = t; res.bub.classList.add("show");
    if (ms) res.bt = setTimeout(function () { res.bub.classList.remove("show"); }, ms);
  }
  function resSet(m) { if (!res) return; res.mood = m; res.box.setMood(m); res.el.className = "rescat " + m; }
  function catMood(kind) {
    if (!res) return;
    if (kind === "sulk") { res.lock = true; resSet("back"); resSay("哼……", 0); sfxMeow("hm"); }
    else if (kind === "happy") { res.lock = true; resSet("happy"); resSay("喵～💗", 0); sfxMeow("happy"); }
  }
  function resWake() {
    if (!res || res.lock || res.mood !== "sleep") return;
    res.wokeAt = Date.now(); sfxMeow("ask"); resSet("open"); res.el.classList.add("hop"); resSay("喵？", 1200); setTimeout(function () { if (res) res.el.classList.remove("hop"); }, 450);
  }
  function spawnResident(vw, vh) {
    res = null;
    var u = Math.max(4, Math.min(7, Math.round(vw / 70)));
    var el = document.createElement("div"); el.className = "rescat open";
    el.style.left = "12px"; el.style.top = Math.max(60, vh - 12 * u - 56) + "px";
    var box = catBox(u, catCfg("a"), "open"), bub = document.createElement("div"); bub.className = "cbub";
    el.appendChild(box); el.appendChild(bub); stage.appendChild(el);
    res = { el: el, box: box, bub: bub, mood: "open", lock: false, bt: 0 };
    el.addEventListener("pointerdown", function (e) {
      e.stopPropagation(); lastAct = Date.now();
      if (res.lock || Date.now() - (res.wokeAt || 0) < 300) return;
      if (res.mood === "sleep") { resWake(); return; }
      resSet("wide"); el.classList.add("fluff"); resSay("喵!", 900); sfxMeow("short");
      setTimeout(function () { if (res && !res.lock) { resSet("open"); } }, 700);
    });
  }
  ["pointerdown", "pointermove", "keydown"].forEach(function (ev) { document.addEventListener(ev, function () { lastAct = Date.now(); resWake(); }, true); });
  setInterval(function () {
    if (res && !res.lock && res.mood === "open" && Date.now() - lastAct > 8000) { resSet("sleep"); resSay("z z z", 0); sfxMeow("snore"); }
  }, 1000);

  /* ---- 小猫配音：用合成器捏出来的“喵” ---- */
  /* 声带（锯齿波 + 轻微颤音）经过三个并联的“共振峰”，共振峰从 mee → aa → oow 滑动，就是“喵”的口型变化 */
  var VOW = { mee: [420, 2400, 3300], aa: [900, 1600, 2800], oow: [520, 1000, 2600], nas: [330, 1100, 2500], ee: [520, 2200, 3100] };
  function meowVoice(pts, dur, vol, vowels, k, delay) {
    var t = AC.currentTime + (delay || 0), o = AC.createOscillator(), lfo = AC.createOscillator(), lg = AC.createGain(), out = AC.createGain();
    o.type = "sawtooth";
    pts.forEach(function (p, i) { var fr = p[1] * k; if (i) o.frequency.linearRampToValueAtTime(fr, t + p[0]); else o.frequency.setValueAtTime(fr, t); });
    lfo.frequency.value = 6; lg.gain.value = 14 * k; lfo.connect(lg); lg.connect(o.frequency);
    [1, 0.7, 0.35].forEach(function (gain, n) {
      var f = AC.createBiquadFilter(), g = AC.createGain(), v = vowels;
      f.type = "bandpass"; f.Q.value = 7 + n * 2; g.gain.value = gain * 2.2;
      f.frequency.setValueAtTime(VOW[v[0]][n], t);
      for (var i = 1; i < v.length; i++) f.frequency.linearRampToValueAtTime(VOW[v[i]][n], t + dur * i / (v.length - 1));
      o.connect(f); f.connect(g); g.connect(out);
    });
    out.gain.setValueAtTime(0.0001, t); out.gain.linearRampToValueAtTime(vol, t + 0.05); out.gain.setValueAtTime(vol, t + dur * 0.55); out.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    out.connect(master); o.start(t); lfo.start(t); o.stop(t + dur + 0.05); lfo.stop(t + dur + 0.05);
  }
  var meowBuf = [], meowLoad = false, meowN = 0;
  function loadMeows() {
    var M = window.MEOWS; if (meowLoad || !AC || !M) return; meowLoad = true;
    M.clips.forEach(function (uri, i) {
      try {
        var bin = atob(uri.split(",")[1]), u8 = new Uint8Array(bin.length);
        for (var k = 0; k < bin.length; k++) u8[k] = bin.charCodeAt(k);
        AC.decodeAudioData(u8.buffer, function (b) { meowBuf[i] = b; }, function () {});
      } catch (e) {}
    });
  }
  function anyClip(i) { var n = window.MEOWS.clips.length; for (var k = 0; k < n; k++) { var j = (i + k) % n; if (meowBuf[j]) return j; } return -1; }
  function playClip(i, rate, vol, delay, maxDur) {
    var b = meowBuf[i]; if (!b) return;
    var t = AC.currentTime + (delay || 0), s = AC.createBufferSource(), g = AC.createGain(), len = Math.min(b.duration, maxDur || b.duration) / rate;
    s.buffer = b; s.playbackRate.value = rate;
    g.gain.setValueAtTime(vol, t); g.gain.setValueAtTime(vol, t + Math.max(0, len - 0.09)); g.gain.linearRampToValueAtTime(0.0001, t + len);
    s.connect(g); g.connect(master); s.start(t); s.stop(t + len + 0.03);
  }
  function sfxMeow(kind, semi) {
    if (!soundOn || !AC || !state.catVoice) return;
    var M = window.MEOWS;
    if (M) { /* 真猫录音：不同窗口轮流用不同的一声，再按 semi 微调音高 */
      if (!meowBuf.some(Boolean)) return;
      var r0 = Math.pow(2, (semi || 0) * 0.35 / 12);
      if (kind === "short") playClip(anyClip(meowN++), 1.3 * r0, 0.9, 0, 0.36);
      else if (kind === "ask") playClip(anyClip(M.ask), 1, 0.85);
      else if (kind === "hm") playClip(anyClip(M.low), 0.72, 0.65, 0, 0.55);
      else if (kind === "happy") { playClip(anyClip(meowN++), 1.15 * r0, 0.85, 0, 0.45); playClip(anyClip(meowN++), 1.25 * r0, 0.85, 0.3, 0.45); }
      else if (kind !== "snore") playClip(anyClip(meowN++), r0, 0.9);
      return;
    }
    var k = Math.pow(2, (semi || 0) / 12);
    if (kind === "short") meowVoice([[0, 600], [0.06, 880], [0.2, 640]], 0.22, 0.5, ["ee", "aa", "aa"], k);
    else if (kind === "ask") meowVoice([[0, 430], [0.18, 560], [0.36, 820]], 0.4, 0.45, ["mee", "aa"], k);
    else if (kind === "hm") meowVoice([[0, 330], [0.3, 260]], 0.36, 0.35, ["nas", "nas"], k);
    else if (kind === "happy") { meowVoice([[0, 560], [0.1, 860], [0.24, 700]], 0.28, 0.45, ["mee", "aa", "oow"], k); meowVoice([[0, 620], [0.1, 940], [0.26, 760]], 0.3, 0.45, ["mee", "aa", "oow"], k, 0.26); }
    else if (kind !== "snore") meowVoice([[0, 470], [0.14, 760], [0.3, 840], [0.58, 520]], 0.62, 0.5, ["mee", "aa", "oow"], k);
  }

  /* ---- 逗猫棒：压轴前的小游戏，手指变成逗猫棒，逗到小猫 4 次它才叼来礼物盒 ---- */
  var wandAbort = null;
  function wandGame(done) {
    var vw = window.innerWidth, vh = window.innerHeight, u = Math.max(5, Math.min(8, Math.round(vw / 60))), N = 4;
    var ov = document.createElement("div"); ov.className = "wandgame";
    ov.innerHTML = '<div class="wg-hint">用手指逗逗它 🐾</div><div class="wg-hearts"></div><div class="wg-stick"></div><div class="wg-tip"></div><div class="wg-cat"><div class="wg-jump"><div class="wg-flip"></div></div><div class="cbub"></div></div><button type="button" class="wg-skip">跳过</button>';
    var q = function (s) { return ov.querySelector(s); }, hint = q(".wg-hint"), hearts = q(".wg-hearts"), stick = q(".wg-stick"), tip = q(".wg-tip"), cat = q(".wg-cat"), flip = q(".wg-flip"), bub = q(".cbub");
    sfxMeow("ask");
    var box = catBox(u, catCfg("a"), "open"); flip.appendChild(box);
    tip.innerHTML = sprite("heart", 6, "--pet-a");
    var wx = vw / 2, wy = vh * 0.38, cx = vw * 0.2, cy = vh * 0.72, catches = 0, cool = 0, ended = false, raf = 0, last = performance.now(), t0 = last, dir = 1;
    function paint() { hearts.textContent = "♥".repeat(catches) + "♡".repeat(N - catches); }
    paint();
    if (res) res.el.style.visibility = "hidden";
    document.body.appendChild(ov);
    function move(e) { wx = e.clientX; wy = e.clientY; }
    ov.addEventListener("pointermove", move); ov.addEventListener("pointerdown", move);
    function finish(mode) {
      if (ended) return; ended = true; cancelAnimationFrame(raf); wandAbort = null;
      hint.textContent = mode === "win" ? "抓到啦～" : mode === "skip" ? "好吧，直接开盒～" : "它玩累了……";
      box.setMood("happy"); tip.classList.add("hide");
      if (mode === "win") { bub.textContent = "喵～💗"; bub.classList.add("show"); sfxMeow("happy"); }
      setTimeout(function () { ov.classList.add("off"); setTimeout(function () { ov.remove(); if (res) res.el.style.visibility = ""; done(); }, 420); }, mode === "win" ? 900 : 500);
    }
    wandAbort = function () { if (ended) return; ended = true; cancelAnimationFrame(raf); wandAbort = null; ov.remove(); if (res) res.el.style.visibility = ""; };
    q(".wg-skip").addEventListener("click", function (e) { e.stopPropagation(); finish("skip"); });
    function frame(now) {
      raf = requestAnimationFrame(frame);
      var dt = Math.min(0.05, (now - last) / 1000); last = now;
      var dx = wx - cx, dy = wy - cy, dist = Math.hypot(dx, dy), step = Math.min((150 + catches * 70) * dt, dist);
      if (dist > 4) { cx += dx / dist * step; cy += dy / dist * step; }
      if (Math.abs(dx) > 6) dir = dx < 0 ? -1 : 1;
      flip.style.transform = dir < 0 ? "scaleX(-1)" : "";
      cat.classList.toggle("moving", dist > 12);
      cat.style.transform = "translate(" + (cx - 7 * u) + "px," + (cy - 6 * u) + "px)";
      stick.style.transform = "translate(" + wx + "px," + wy + "px) rotate(-28deg)";
      tip.style.transform = "translate(" + (wx - 21) + "px," + (wy - 18) + "px)";
      if (dist < u * 6 && now > cool && !ended) {
        catches++; cool = now + 1000; paint();
        box.setMood("wide"); cat.classList.add("pounce"); bub.textContent = "喵!"; bub.classList.add("show"); tip.classList.add("hide");
        hint.textContent = catches < N ? "再逗一下！" : ""; sfxMeow("short", catches * 2);
        setTimeout(function () { if (ended) return; box.setMood("open"); cat.classList.remove("pounce"); bub.classList.remove("show"); tip.classList.remove("hide"); }, 600);
        if (catches >= N) finish("win");
      }
      if (now - t0 > 25000) finish("tired");
    }
    raf = requestAnimationFrame(frame);
  }

  /* ---- 猜纸箱：小猫钻进其中一个纸箱，三个纸箱来回换位，猜对了它才送礼物盒 ---- */
  var BOX_LINES = ["这里只有灰尘……", "里面是一根逗猫棒", "空的！连猫毛都没有", "只有一团空气"];
  function boxGame(done) {
    var vw = window.innerWidth, vh = window.innerHeight, u = Math.max(5, Math.min(8, Math.round(vw / 60))), bw = 14 * u, bh = 10 * u, by = vh * 0.55;
    var ov = document.createElement("div"); ov.className = "wandgame boxgame";
    ov.innerHTML = '<div class="wg-hint">小猫藏进了其中一个纸箱……</div><button type="button" class="wg-skip">跳过</button>';
    var hint = ov.querySelector(".wg-hint"), tms = [], ended = false, canPick = false, lines = BOX_LINES.slice(), wrong = 0;
    var slotX = [0.2, 0.5, 0.8].map(function (r) { return r * vw - bw / 2; });
    var order = [0, 1, 2].map(function (i) {
      var b = document.createElement("div"); b.className = "carton";
      b.style.cssText = "left:" + slotX[i] + "px;top:" + by + "px;width:" + bw + "px;height:" + bh + "px";
      b.innerHTML = sprite("carton", u, "--carton"); ov.appendChild(b); return b;
    });
    var boxes = order.slice();
    var catEl = document.createElement("div"); catEl.className = "bg-cat"; var cb = catBox(u, catCfg("a"), "open"), bub = document.createElement("div"); bub.className = "cbub";
    catEl.appendChild(cb); catEl.appendChild(bub);
    catEl.style.left = (vw / 2 - 7 * u) + "px"; catEl.style.top = Math.max(90, by - 12 * u - 90) + "px"; ov.appendChild(catEl);
    if (res) res.el.style.visibility = "hidden";
    document.body.appendChild(ov);
    var target = Math.floor(Math.random() * 3), catBoxEl = boxes[target];
    function later(fn, ms) { tms.push(setTimeout(function () { if (!ended) fn(); }, ms)); }
    function finish(mode) {
      if (ended) return; ended = true; tms.forEach(clearTimeout); wandAbort = null;
      ov.classList.add("off");
      setTimeout(function () { ov.remove(); if (res) res.el.style.visibility = ""; done(); }, 420);
    }
    wandAbort = function () { if (ended) return; ended = true; tms.forEach(clearTimeout); wandAbort = null; ov.remove(); if (res) res.el.style.visibility = ""; };
    ov.querySelector(".wg-skip").addEventListener("click", function () { finish("skip"); });
    /* 1) 小猫跳进纸箱 */
    sfxMeow("ask");
    later(function () { catEl.style.transition = "left .6s ease-in-out, top .6s ease-in, opacity .2s"; catEl.style.left = (slotX[target] + bw / 2 - 7 * u) + "px"; catEl.style.top = (by + bh / 2 - 6 * u) + "px"; }, 700);
    later(function () { catEl.style.opacity = "0"; catBoxEl.classList.add("wiggle"); sfxMeow("short"); }, 1350);
    /* 2) 纸箱来回换位 */
    later(function () { hint.textContent = "盯紧它！"; }, 1900);
    var swaps = 6;
    for (var s = 0; s < swaps; s++) (function (s) {
      later(function () {
        var i = Math.floor(Math.random() * 3), j = (i + 1 + Math.floor(Math.random() * 2)) % 3, a = order[i], b = order[j];
        order[i] = b; order[j] = a;
        b.style.left = slotX[i] + "px"; a.style.left = slotX[j] + "px"; a.style.top = (by - 28) + "px"; b.style.top = (by + 14) + "px";
        tms.push(setTimeout(function () { a.style.top = by + "px"; b.style.top = by + "px"; }, 230));
      }, 2300 + s * 560);
    })(s);
    /* 3) 开始猜 */
    later(function () {
      hint.textContent = "猜猜小猫在哪个纸箱里？"; canPick = true;
      boxes.forEach(function (b) { b.classList.add("pick"); });
    }, 2300 + swaps * 560 + 300);
    boxes.forEach(function (b) {
      b.addEventListener("click", function () {
        if (!canPick || b._open) return; b._open = true; b.classList.remove("pick");
        if (b === catBoxEl) { /* 猜对：小猫探出头 */
          canPick = false; boxes.forEach(function (x) { x.classList.remove("pick"); });
          catEl.style.transition = "top .3s ease-out, opacity .15s"; catEl.style.opacity = "1"; catEl.style.zIndex = 3;
          catEl.style.left = (parseFloat(b.style.left) + bw / 2 - 7 * u) + "px"; catEl.style.top = (by - 8 * u) + "px";
          cb.setMood("happy"); bub.textContent = "喵～💗"; bub.classList.add("show"); hint.textContent = "找到啦！"; sfxMeow("happy");
          b.classList.add("wiggle"); later(function () { finish("win"); }, 1300);
        } else { /* 猜错：箱子里只有搞笑的东西 */
          wrong++; b.classList.add("empty"); hint.textContent = "不是这个，再猜猜！"; sfxMeow("ask", -3);
          var t = document.createElement("div"); t.className = "cbub show"; t.textContent = lines.splice(Math.floor(Math.random() * lines.length), 1)[0] || "空的"; b.appendChild(t);
        }
      });
    });
  }

  /* ---- 晒鱼干 + 喂猫：先把鱼干挂到绳子上晒，晒好后一条条拿给小猫，吃饱了才送礼物盒 ---- */
  function fishGame(done) {
    var vw = window.innerWidth, vh = window.innerHeight, u = Math.max(4, Math.min(6, Math.round(vw / 70))), N = 4;
    var fw = SPRITES.fish[0].length * u, fh = SPRITES.fish.length * u;   /* 横放的鱼 */
    var vwid = SPRITES.fishv[0].length * u, vhei = SPRITES.fishv.length * u; /* 倒挂的鱼 */
    var ropeY = Math.round(vh * 0.26), x0 = Math.max(26, vw * 0.1), x1 = vw - x0;
    var slots = []; for (var i = 0; i < N; i++) slots.push(x0 + (x1 - x0) * (i + 0.5) / N);
    var ov = document.createElement("div"); ov.className = "wandgame fishgame";
    ov.innerHTML = '<div class="wg-hint"></div><div class="wg-hearts"></div><div class="fg-sun"></div><div class="fg-rope"></div><div class="fg-post l"></div><div class="fg-post r"></div><div class="fg-basket"></div><button type="button" class="wg-skip">跳过</button>';
    var q = function (s) { return ov.querySelector(s); }, hint = q(".wg-hint"), hearts = q(".wg-hearts"), sun = q(".fg-sun"), basket = q(".fg-basket");
    var rope = q(".fg-rope"); rope.style.cssText = "left:" + (x0 - 14) + "px;width:" + (x1 - x0 + 28) + "px;top:" + ropeY + "px";
    q(".fg-post.l").style.cssText = "left:" + (x0 - 18) + "px;top:" + (ropeY - 8) + "px;height:" + (vh * 0.5) + "px";
    q(".fg-post.r").style.cssText = "left:" + (x1 + 12) + "px;top:" + (ropeY - 8) + "px;height:" + (vh * 0.5) + "px";
    var bw = fw * 2 + 36, bh = fh * 2 + 34, bx = vw / 2 - bw / 2, by = vh * 0.62;
    basket.style.cssText = "left:" + bx + "px;top:" + by + "px;width:" + bw + "px;height:" + bh + "px";
    var tms = [], ended = false, phase = "hang", hung = 0, fed = 0, idleT = 0, drag = null;
    function later(fn, ms) { var t = setTimeout(function () { if (!ended) fn(); }, ms); tms.push(t); return t; }
    function paint() { hearts.textContent = phase === "hang" ? "🐟 " + hung + " / " + N : "♥".repeat(fed) + "♡".repeat(N - fed); }
    function say(t) { hint.textContent = t; }
    /* 鱼：fresh（刚捞的，银蓝）和 dried（晒好的，金黄）叠在一起，晒的时候淡入 */
    var fish = [];
    for (var k = 0; k < N; k++) (function (k) {
      var el = document.createElement("div"); el.className = "fg-fish basket";
      el.innerHTML = '<div class="ff-in"><div class="ff-fresh">' + sprite("fish", u, "--fish") + '</div><div class="ff-dry">' + sprite("fish", u, "--fishd") + "</div></div>";
      var col = k % 2, row = Math.floor(k / 2);
      var f = { el: el, k: k, state: "basket", bx: bx + 12 + col * (fw + 12), by: by + 10 + row * (fh + 8) - 4 };
      el.style.left = f.bx + "px"; el.style.top = f.by + "px"; el.style.width = fw + "px"; el.style.height = fh + "px";
      ov.appendChild(el); fish.push(f);
      el.addEventListener("pointerdown", function (e) { onDown(e, f); });
    })(k);
    var catEl = null, cb = null, bub = null, cx = vw / 2, cy = vh * 0.74, cu = Math.max(5, Math.min(8, Math.round(vw / 60)));
    if (res) res.el.style.visibility = "hidden";
    document.body.appendChild(ov);
    say("先把鱼干挂上绳子晒太阳 ☀️\n点一条鱼就行"); paint(); sfxMeow("ask");
    function resetIdle() { clearTimeout(idleT); idleT = setTimeout(function () { if (ended) return; auto(); }, 7000); tms.push(idleT); }
    function auto() { /* 一段时间没动手，就替他做一步 */
      var f; if (phase === "hang") { f = fish.filter(function (x) { return x.state === "basket"; })[0]; if (f) hang(f); }
      else if (phase === "feed") { f = fish.filter(function (x) { return x.state === "hung"; })[0]; if (f) feedFly(f); }
    }
    function hangPos(f) { var s = slots[hung]; return { x: s - vwid / 2, y: ropeY + 4 }; }
    function hang(f) {
      if (phase !== "hang" || f.state !== "basket") return; f.state = "fly";
      var p = hangPos(f); f.hx = p.x; f.hy = p.y; hung++; paint();
      var el = f.el; el.classList.remove("basket"); el.classList.add("hanging");
      el.querySelector(".ff-fresh").innerHTML = sprite("fishv", u, "--fish"); el.querySelector(".ff-dry").innerHTML = sprite("fishv", u, "--fishd");
      el.style.width = vwid + "px"; el.style.height = vhei + "px";
      el.style.left = p.x + "px"; el.style.top = p.y + "px";
      sfxMeow("short", hung * 2);
      later(function () { f.state = "hung"; el.classList.add("swing"); sfxDing(hung); }, 520);
      if (hung >= N) later(startDry, 900); else { say("再挂一条（" + hung + " / " + N + "）"); resetIdle(); }
    }
    function startDry() {
      phase = "dry"; clearTimeout(idleT); paint(); say("晒太阳中…… ☀️");
      basket.classList.add("out"); sun.classList.add("shine"); ov.classList.add("sunny");
      fish.forEach(function (f, i) { later(function () { f.el.classList.add("dried"); sfxDing(i + 2); }, 1200 + i * 450); });
      later(startFeed, 1200 + N * 450 + 900);
    }
    function startFeed() {
      phase = "feed"; fed = 0; paint(); say("晒好啦！把鱼干喂给小猫 🐱\n拖过去，或点一下");
      sun.classList.remove("shine"); sun.classList.add("set");
      catEl = document.createElement("div"); catEl.className = "fg-cat";
      cb = catBox(cu, catCfg("a"), "open"); bub = document.createElement("div"); bub.className = "cbub";
      catEl.appendChild(cb); catEl.appendChild(bub);
      catEl.style.left = (-14 * cu - 10) + "px"; catEl.style.top = (cy - 6 * cu) + "px"; ov.appendChild(catEl);
      void catEl.offsetWidth; catEl.style.transition = "left .9s ease-out"; catEl.style.left = (cx - 7 * cu) + "px";
      later(function () { bub.textContent = "喵～好饿 🥺"; bub.classList.add("show"); sfxMeow("ask"); }, 950);
      resetIdle();
    }
    function catPos() { return { x: cx, y: cy }; }
    function feedFly(f) {
      if (phase !== "feed" || f.state !== "hung") return; f.state = "fly"; var el = f.el;
      el.classList.remove("swing"); el.classList.add("flying"); el.style.left = (cx - vwid / 2) + "px"; el.style.top = (cy - vhei / 2) + "px";
      later(function () { eat(f); }, 480);
    }
    function eat(f) {
      f.state = "eaten"; f.el.classList.add("gone"); later(function () { f.el.remove(); }, 250);
      fed++; paint(); clearTimeout(idleT);
      cb.setMood("wide"); bub.textContent = ["嗷呜！", "好吃～", "咔嚓咔嚓", "再来！"][Math.min(fed, N) - 1] || "嗷呜！"; bub.classList.add("show");
      catEl.classList.add("chomp"); catEl.style.setProperty("--fat", 1 + fed * 0.07); sfxMeow("short", fed * 2);
      later(function () { catEl.classList.remove("chomp"); if (fed < N) { cb.setMood("open"); bub.classList.remove("show"); } }, 600);
      if (fed >= N) later(full, 800); else { say("还饿！再喂一条（" + fed + " / " + N + "）"); resetIdle(); }
    }
    function full() {
      phase = "full"; cb.setMood("happy"); bub.textContent = "吃饱啦～💗"; bub.classList.add("show"); say("吃得圆滚滚，满意了～"); sfxMeow("happy");
      later(function () { finish(); }, 1500);
    }
    function finish() {
      if (ended) return; ended = true; tms.forEach(clearTimeout); wandAbort = null;
      ov.classList.add("off"); setTimeout(function () { ov.remove(); if (res) res.el.style.visibility = ""; done(); }, 420);
    }
    wandAbort = function () { if (ended) return; ended = true; tms.forEach(clearTimeout); wandAbort = null; ov.remove(); if (res) res.el.style.visibility = ""; };
    q(".wg-skip").addEventListener("click", function (e) { e.stopPropagation(); say("好吧，直接开盒～"); if (cb) cb.setMood("happy"); setTimeout(finish, 300); });
    /* 交互：挂鱼阶段点一下；喂猫阶段可拖也可点 */
    function onDown(e, f) {
      if (ended) return; e.preventDefault(); resetIdle();
      if (phase === "hang" && f.state === "basket") { hang(f); return; }
      if (phase !== "feed" || f.state !== "hung") return;
      var r = f.el.getBoundingClientRect();
      drag = { f: f, ox: e.clientX - r.left, oy: e.clientY - r.top, sx: e.clientX, sy: e.clientY, moved: false, id: e.pointerId };
      f.el.classList.remove("swing"); f.el.classList.add("dragging");
      try { f.el.setPointerCapture(e.pointerId); } catch (_) {}
    }
    ov.addEventListener("pointermove", function (e) {
      if (!drag || e.pointerId !== drag.id) return;
      if (Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy) > 8) drag.moved = true;
      if (drag.moved) { drag.f.el.style.left = (e.clientX - drag.ox) + "px"; drag.f.el.style.top = (e.clientY - drag.oy) + "px"; }
    });
    function up(e) {
      if (!drag || e.pointerId !== drag.id) return; var d = drag, f = d.f; drag = null; f.el.classList.remove("dragging");
      if (!d.moved) { feedFly(f); return; }
      var r = f.el.getBoundingClientRect(), mx = r.left + r.width / 2, my = r.top + r.height / 2;
      if (Math.hypot(mx - cx, my - cy) < cu * 9) { f.state = "fly"; f.el.style.left = (cx - vwid / 2) + "px"; f.el.style.top = (cy - vhei / 2) + "px"; f.el.classList.add("flying"); later(function () { eat(f); }, 200); }
      else { f.el.classList.add("flying"); f.el.style.left = f.hx + "px"; f.el.style.top = f.hy + "px"; later(function () { f.el.classList.remove("flying"); f.el.classList.add("swing"); }, 480); resetIdle(); }
    }
    ov.addEventListener("pointerup", up); ov.addEventListener("pointercancel", up);
    resetIdle();
  }

  /* ---- 小猫送信：每个窗口由小猫叼着信送来，压轴是一个会抖的礼物盒 ---- */
  function catOn() { return state.cats && !reduce && !!document.documentElement.animate; }
  function catDeliver(cx, cy, kind, done, idx) {
    var vw = stage.clientWidth, vh = stage.clientHeight, u = Math.max(4, Math.min(7, Math.round(vw / 70)));
    var cw = 14 * u, ch = 12 * u, dir = Math.random() < 0.5 ? 1 : -1;
    var x0 = dir > 0 ? -cw - 12 : vw + 12, x1 = cx - cw / 2, x2 = dir > 0 ? vw + 12 : -cw - 12;
    var cat = document.createElement("div"); cat.className = "mailcat"; cat.style.top = Math.max(4, Math.min(vh - ch - 4, cy - ch / 2)) + "px";
    var flip = document.createElement("div"); if (dir < 0) flip.style.transform = "scaleX(-1)";
    var bob = document.createElement("div"); bob.className = "mc-bob";
    bob.appendChild(catBox(u, catCfg("abc".charAt(Math.floor(Math.random() * 3))), "open"));
    var item = document.createElement("div"); item.className = "mc-item";
    if (kind === "box") { item.innerHTML = sprite("box", u, "--pet-a"); item.style.left = (cw - 9 * u) / 2 + "px"; item.style.top = (-8 * u) + "px"; }
    else { item.innerHTML = sprite("letter", u, "--pet-b"); item.style.right = (-5 * u) + "px"; item.style.bottom = (1.5 * u) + "px"; }
    bob.appendChild(item); flip.appendChild(bob); cat.appendChild(flip); stage.appendChild(cat);
    function walk(a, b, ms, ease) { return cat.animate([{ transform: "translateX(" + a + "px)" }, { transform: "translateX(" + b + "px)" }], { duration: ms, easing: ease, fill: "forwards" }); }
    var a1 = walk(x0, x1, Math.max(500, Math.min(1200, Math.abs(x1 - x0) / 0.55)), "ease-out");
    a1.onfinish = function () {
      item.style.display = "none";
      sfxMeow(kind === "box" ? "happy" : "meow", [0, 2, 4, 7, 9][(idx || 0) % 5]);
      var a2 = walk(x1, x2, Math.max(600, Math.min(1300, Math.abs(x2 - x1) / 0.5)), "ease-in");
      a2.onfinish = function () { cat.remove(); };
      if (kind === "box") {
        var g = document.createElement("div"); g.className = "gift"; g.innerHTML = sprite("box", u + 1, "--pet-a");
        g.style.left = (cx - 4.5 * (u + 1)) + "px"; g.style.top = (cy - 4 * (u + 1)) + "px"; stage.appendChild(g);
        setTimeout(function () { g.remove(); done(); }, 800);
      } else done();
    };
  }

  /* ---- 小猫钓鱼 / 小猫雪球：两种由小猫“演”出来的出场方式（共用一点小工具） ---- */
  function rmEl(e) { if (e && e.parentNode) e.remove(); }
  function ease3(t) { return 1 - Math.pow(1 - t, 3); }
  function noiseHit(t, dur, f, q, g, type, pw) {
    var n = Math.floor(AC.sampleRate * dur), buf = AC.createBuffer(1, n, AC.sampleRate), d = buf.getChannelData(0), i;
    for (i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, pw || 2);
    var s = AC.createBufferSource(), fl = AC.createBiquadFilter(), gn = AC.createGain();
    s.buffer = buf; fl.type = type || "bandpass"; fl.frequency.value = f; fl.Q.value = q || 0.7; gn.gain.value = g;
    s.connect(fl); fl.connect(gn); gn.connect(master); s.start(t);
  }
  /* 小场景的时间线：me.go(时长, 每帧回调(0..1), 结束回调)；每帧最后调用 me.paint() */
  function sceneLoop(me) {
    me.tw = [];
    me.go = function (ms, fn, next) { me.tw.push({ t0: performance.now(), ms: Math.max(1, ms), fn: fn, next: next }); };
    function loop(now) {
      if (me.dead) return;
      me.raf = requestAnimationFrame(loop);
      var cur = me.tw, cbs = []; me.tw = [];
      cur.forEach(function (w) { var t = Math.max(0, Math.min(1, (now - w.t0) / w.ms)); w.fn(t); if (t < 1) me.tw.push(w); else if (w.next) cbs.push(w.next); });
      cbs.forEach(function (c) { if (!me.dead) c(); });
      if (me.paint) me.paint();
    }
    me.raf = requestAnimationFrame(loop);
  }

  /* ---- 小猫钓鱼：小猫坐在右上角的钓鱼台上，鱼线甩到窗口该在的地方，窗口被一竿吊起，“啪嗒”落下，溅起水花 ---- */
  var fq = null;
  function sfxSplash(v) {
    if (!soundOn || !AC) return;
    var t = AC.currentTime;
    noiseHit(t, 0.24, 1500, 0.7, 0.2 * v, "bandpass", 2);
    tone(520, t, 0.07, 0.05 * v, "sine"); tone(820, t + 0.05, 0.09, 0.04 * v, "sine");
  }
  /* 啪嗒：先是窗口拍在水面上的“啪”，再跟一小滴“嗒” */
  function sfxPata(v) {
    if (!soundOn || !AC) return;
    var t = AC.currentTime;
    noiseHit(t, 0.2, 800, 0.8, 0.32 * v, "bandpass", 2.2); tone(200, t, 0.1, 0.12 * v, "sine");
    noiseHit(t + 0.1, 0.1, 2400, 0.9, 0.12 * v, "bandpass", 2); tone(460, t + 0.1, 0.06, 0.05 * v, "sine"); tone(330, t + 0.16, 0.08, 0.04 * v, "sine");
  }
  function sfxTug() { if (!soundOn || !AC) return; var t = AC.currentTime; tone(210, t, 0.12, 0.07, "triangle"); tone(160, t + 0.07, 0.12, 0.05, "triangle"); }
  function sfxReel() { if (!soundOn || !AC) return; var t = AC.currentTime; for (var i = 0; i < 4; i++) tone(1500 + i * 60, t + i * 0.05, 0.03, 0.025, "square"); }
  function fishAbort() {
    var me = fq; if (!me) return; fq = null; me.dead = true; me.waiters = [];
    cancelAnimationFrame(me.raf); me.tms.forEach(clearTimeout);
    me.els.forEach(rmEl);
  }
  function fishAdd(it) { if (fq && !fq.dead) { fq.q.push(it); fq.pump(); } else if (it.quick) it.quick(); }
  function fishStart(vw, vh, total, tok) {
    fishAbort();
    var u = Math.max(4, Math.min(7, Math.round(vw / 70))), cw = 14 * u, ch = 12 * u, deckW = Math.round(22 * u);
    var me = fq = { q: [], busy: false, ready: false, finished: false, leaving: false, dead: false, waiters: [], total: total, done: 0, tw: [], raf: 0, tms: [], els: [], pump: null };
    var topY = 46, pLeft = vw - deckW, pTop = topY + ch - Math.round(0.8 * u); /* 钓鱼台贴着右边，小猫坐在上面 */
    var sx = pLeft + Math.round(2 * u), sy = topY;
    var bx = sx + 2.5 * u, by = sy + 5 * u, tipX = bx - 11 * u, tipY = by - 8 * u;
    var S = { hx: tipX, hy: tipY, hv: false, bend: 0, sag: 20 };
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "fishfx"); svg.setAttribute("width", vw); svg.setAttribute("height", vh); svg.setAttribute("aria-hidden", "true");
    svg.innerHTML = '<path class="fz-rod" d="" stroke-width="' + (u * 0.7) + '"/><path class="fz-line" d=""/><g class="fz-hook" style="display:none"><rect x="' + (-0.8 * u) + '" y="' + (-1.2 * u) + '" width="' + (1.6 * u) + '" height="' + (1.2 * u) + '" fill="#e5484d"/><rect x="' + (-0.8 * u) + '" y="0" width="' + (1.6 * u) + '" height="' + (1.2 * u) + '" fill="#ffffff"/></g>';
    var rod = svg.querySelector(".fz-rod"), line = svg.querySelector(".fz-line"), hook = svg.querySelector(".fz-hook");
    var pier = mk("div", "fishpier", '<i class="fp-deck"></i><i class="fp-leg a"></i><i class="fp-leg b"></i><i class="fp-bar"></i><i class="fp-bucket"></i>');
    pier.style.cssText = "left:" + pLeft + "px;top:" + pTop + "px;width:" + deckW + "px;--u:" + u + "px";
    var cat = mk("div", "fishcat"), sit = mk("div", "mc-bob"), cbx = catBox(u, catCfg("c"), "up"), bub = mk("div", "cbub"), bt = 0;
    cat.style.cssText = "left:" + sx + "px;top:" + sy + "px";
    sit.appendChild(cbx); cat.appendChild(sit); cat.appendChild(bub);
    stage.appendChild(pier); stage.appendChild(svg); stage.appendChild(cat); me.els.push(pier, svg, cat);
    function say(t, ms) { bub.textContent = t; bub.classList.add("show"); clearTimeout(bt); bt = setTimeout(function () { bub.classList.remove("show"); }, ms || 900); me.tms.push(bt); }
    me.paint = function () {
      var dx = S.hx - tipX, dy = S.hy - tipY, dl = Math.sqrt(dx * dx + dy * dy) || 1, ux = dx / dl, uy = dy / dl;
      var ex = tipX + ux * S.bend * 0.55, ey = tipY + uy * S.bend * 0.55;
      rod.setAttribute("d", "M" + bx + "," + by + " Q" + (bx + (tipX - bx) * 0.6 + ux * S.bend * 0.35) + "," + (by + (tipY - by) * 0.6 + uy * S.bend * 0.35) + " " + ex + "," + ey);
      if (S.hv) {
        line.setAttribute("d", "M" + ex + "," + ey + " Q" + ((ex + S.hx) / 2) + "," + ((ey + S.hy) / 2 + S.sag) + " " + S.hx + "," + S.hy);
        hook.style.display = ""; hook.setAttribute("transform", "translate(" + S.hx + "," + S.hy + ")");
      } else { line.setAttribute("d", ""); hook.style.display = "none"; }
    };
    sceneLoop(me);
    var go = me.go;
    function splash(x, y, k) { /* 水波 + 溅起的水珠 */
      var r = mk("div", "fish-rip"); r.style.cssText = "left:" + x + "px;top:" + y + "px;--k:" + k; stage.appendChild(r); me.els.push(r);
      me.tms.push(setTimeout(function () { rmEl(r); }, 900));
      if (k < 0.5) return;
      var n = Math.round(6 + 6 * k), i, d, a, sp;
      for (i = 0; i < n; i++) {
        d = mk("i", "fish-drop"); a = -Math.PI * (0.1 + 0.8 * Math.random()); sp = (30 + Math.random() * 50) * k;
        d.style.cssText = "left:" + x + "px;top:" + y + "px;--dx:" + (Math.cos(a) * sp).toFixed(1) + "px;--dy:" + (Math.sin(a) * sp).toFixed(1) + "px";
        stage.appendChild(d); me.els.push(d);
        (function (d) { me.tms.push(setTimeout(function () { rmEl(d); }, 800)); })(d);
      }
    }
    function sideDrops(cx, y, spread, n) { /* “啪嗒”落地时，沿着窗口底边甩出去的水珠 */
      for (var i = 0; i < n; i++) {
        var d = mk("i", "fish-drop"), side = Math.random() < 0.5 ? -1 : 1;
        d.style.cssText = "left:" + (cx + (Math.random() - 0.5) * spread) + "px;top:" + y + "px;--dx:" + (side * (8 + Math.random() * 36)).toFixed(1) + "px;--dy:" + (-(34 + Math.random() * 46)).toFixed(1) + "px";
        stage.appendChild(d); me.els.push(d);
        (function (d) { me.tms.push(setTimeout(function () { rmEl(d); }, 800)); })(d);
      }
    }
    function one(it, next) {
      var sp = me.q.length > 4 ? 0.72 : 1, el = it.el, w = it.w, h = it.h, tx = it.cx, ty = it.cy;
      var px = tx, py = ty + h / 2 - 8, topF = ty - h / 2; /* 水潭在窗口底边，窗口从水里被吊起来 */
      var ay = Math.min(topF, Math.max(14, topF - 80)), ax = tx + (tipX - tx) * 0.1;
      var heavy = Math.max(0.7, Math.min(2.4, w / 200)), tugs = 1 + (heavy > 1.35 ? 1 : 0) + (heavy > 2 ? 1 : 0);
      var dist = Math.sqrt((px - tipX) * (px - tipX) + (py - tipY) * (py - tipY)), arc = Math.min(140, 30 + dist * 0.22), semi = [0, 2, 4, 7, 9][(it.idx || 0) % 5];
      var pool = null, z0 = el.style.zIndex, pend = 2;
      function both() { if (--pend <= 0) next(); }
      function cast() {
        S.hv = true; S.hx = tipX; S.hy = tipY; S.bend = 0; S.sag = 24; cbx.setMood("up"); sfxReel();
        go(500 * sp, function (t) {
          var e = 1 - Math.pow(1 - t, 3);
          S.hx = tipX + (px - tipX) * e; S.hy = tipY + (py - tipY) * e - Math.sin(Math.PI * e) * arc; S.sag = 24 * (1 - e) + 6; S.bend = -6 * Math.sin(Math.PI * t);
        }, wait);
      }
      function wait() { /* 浮漂落水，水面荡开一个小水潭 */
        var pw = Math.max(120, Math.min(340, w + 40)), ph = Math.max(36, Math.round(pw * 0.26));
        pool = mk("div", "fish-pool"); pool.style.cssText = "left:" + px + "px;top:" + py + "px;width:" + pw + "px;height:" + ph + "px";
        stage.appendChild(pool); me.els.push(pool);
        splash(px, py, 0.7); sfxSplash(0.6); say(["嘿——", "上钩吧～", "来啦来啦"][(it.idx || 0) % 3], 800);
        go(280 * sp, function (t) { S.hy = py + Math.sin(t * 12.57) * 4 * (1 - t); S.sag = 6; S.bend = 0; }, function () { tug(0); });
      }
      function tug(k) { /* 越大的窗口越沉，要多拽几下 */
        if (k >= tugs) { pull(); return; }
        cbx.setMood("wide"); sfxTug(); if (k === 0 && heavy > 1.35) say("好沉……", 900);
        go(230 * sp, function (t) { var s = Math.sin(Math.PI * t); S.bend = (12 + 10 * heavy) * s; S.hy = py + s * (8 + 4 * heavy); S.sag = 2; }, function () { splash(px, py, 0.35); tug(k + 1); });
      }
      function pose(x, y, r, sc, op, att) { /* 窗口挂在鱼钩下面：x,y 是窗口顶边中点 */
        el.style.transform = "translate(" + (x - tx).toFixed(1) + "px," + (y - topF).toFixed(1) + "px) rotate(" + r.toFixed(2) + "deg) scale(" + sc.toFixed(3) + ")";
        el.style.opacity = op;
        if (att) { S.hx = x; S.hy = y - 5; S.sag = 2; }
      }
      function pull() { /* 嘿咻——窗口破水而出，被吊到半空 */
        cbx.setMood("happy"); say(heavy > 1.35 ? "嘿咻——！" : "钓到啦！", 900);
        if (pool) pool.style.zIndex = 3;
        el.style.zIndex = 4996; el.style.pointerEvents = "none"; el.style.transformOrigin = "50% 0";
        pose(px, py, 0, 0.22, 0, true); it.show();
        splash(px, py, 1.1); sfxSplash(1); sfxMeow("happy", semi);
        go(340 * sp, function (t) {
          var e = ease3(t);
          pose(px + (ax - px) * e, py + (ay - py) * e, -8 * Math.sin(Math.PI * t), 0.22 + 0.78 * ease3(Math.min(1, t * 1.3)), Math.min(1, t * 6), true);
          S.bend = 26 * Math.sin(Math.PI * Math.min(1, t * 1.2));
        }, sway);
      }
      function sway() { /* 悬在空中晃两下 */
        go(170 * sp, function (t) {
          var k = Math.sin(t * 6.2832 * 1.4) * (1 - t);
          pose(ax + 7 * k, ay, 8 * k, 1, 1, true); S.bend = 12 * (1 - t);
        }, drop);
      }
      function drop() { /* 鱼钩一松，窗口“啪嗒”掉回水潭上，鱼钩飞回竿尖 */
        var x0 = ax, y0 = ay;
        go(230 * sp, function (t) { var e = t * t; pose(x0 + (tx - x0) * e, y0 + (topF - y0) * e, 0, 1, 1, false); }, land);
        retract();
      }
      function land() {
        el.style.transform = ""; el.style.opacity = ""; el.style.zIndex = z0; el.style.pointerEvents = "";
        el.style.transformOrigin = "50% 100%";
        try { var a = el.animate([{ transform: "scale(1.06,.88)" }, { transform: "scale(.98,1.03)", offset: 0.5 }, { transform: "none" }], { duration: 340, easing: "ease-out" }); a.onfinish = a.oncancel = function () { el.style.transformOrigin = ""; }; } catch (e) { el.style.transformOrigin = ""; }
        sfxPata(1); splash(tx, ty + h / 2 - 6, 1.5); sideDrops(tx, ty + h / 2 - 4, w * 0.95, 8 + Math.round(4 * heavy));
        if (pool) { var pl = pool; me.tms.push(setTimeout(function () { pl.classList.add("gone"); me.tms.push(setTimeout(function () { rmEl(pl); }, 700)); }, 1300)); }
        if (it.land) it.land();
        both();
      }
      function retract() { /* 收线，鱼钩飞回竿尖 */
        var x0 = S.hx, y0 = S.hy; cbx.setMood("open");
        go(340 * sp, function (t) { var e = t * t; S.hx = x0 + (tipX - x0) * e; S.hy = y0 + (tipY - y0) * e - Math.sin(Math.PI * e) * 30; S.sag = 6 + 30 * e; S.bend = 0; }, function () { S.hv = false; cbx.setMood("up"); both(); });
      }
      cast();
    }
    function leave() {
      if (me.leaving || me.dead) return; me.leaving = true;
      rod.style.opacity = 0; S.hv = false; cbx.setMood("happy"); sfxMeow("meow", 5); say("钓完啦～", 900);
      me.tms.push(setTimeout(function () {
        if (me.dead) return; sit.className = "mc-bob";
        var d = vw - sx + 24, kf = [{ transform: "translateX(0)" }, { transform: "translateX(" + d + "px)" }];
        pier.animate(kf, { duration: 700, easing: "ease-in", delay: 120, fill: "forwards" });
        var a = cat.animate(kf, { duration: 700, easing: "ease-in", fill: "forwards" });
        a.onfinish = function () {
          if (me.dead) return; rmEl(cat); rmEl(svg); rmEl(pier); me.finished = true; cancelAnimationFrame(me.raf);
          me.waiters.splice(0).forEach(function (f) { f(); });
        };
      }, 1000));
    }
    function pump() {
      if (me.dead || me.busy || !me.ready) return;
      var it = me.q.shift();
      if (!it) { if (me.done >= me.total) leave(); return; }
      me.busy = true;
      one(it, function () { me.busy = false; me.done++; pump(); });
    }
    me.pump = pump;
    /* 钓鱼台从右边滑进来，小猫跑上去坐好，竿子才亮出来 */
    var d0 = vw - sx + 24, kf0 = [{ transform: "translateX(" + d0 + "px)" }, { transform: "translateX(0)" }];
    pier.animate(kf0, { duration: 380, easing: "ease-out", fill: "both" });
    var a0 = cat.animate(kf0, { duration: 650, easing: "ease-out", delay: 220, fill: "both" });
    a0.onfinish = function () { if (me.dead) return; sit.className = ""; rod.style.opacity = 1; me.ready = true; pump(); };
  }

  /* ---- 小猫雪球：团雪球扔向屏幕，“啪”地炸开，窗口从雪渍里弹出来，屏幕上留下一块雪痕 ---- */
  var sq = null;
  function sfxPat() { if (!soundOn || !AC) return; var t = AC.currentTime; noiseHit(t, 0.07, 700, 0.6, 0.12, "lowpass", 2); tone(240, t, 0.05, 0.04, "sine"); }
  function sfxWhoosh() { if (!soundOn || !AC) return; noiseHit(AC.currentTime, 0.3, 1800, 0.5, 0.08, "bandpass", 0.8); }
  function sfxSplat(v) {
    if (!soundOn || !AC) return;
    var t = AC.currentTime;
    noiseHit(t, 0.22, 1200, 0.6, 0.32 * v, "bandpass", 2.4); noiseHit(t, 0.14, 420, 0.7, 0.3 * v, "lowpass", 2); tone(150, t, 0.12, 0.12 * v, "sine");
  }
  function snowAbort() {
    var me = sq; if (!me) return; sq = null; me.dead = true; me.waiters = [];
    cancelAnimationFrame(me.raf); me.tms.forEach(clearTimeout);
    me.els.forEach(rmEl);
  }
  function snowAdd(it) { if (sq && !sq.dead) { sq.q.push(it); sq.pump(); } else if (it.quick) it.quick(); }
  var SNOWB = ["  ####  ", " #wwww# ", "#wwwwww#", "#wwwwws#", "#wwwwss#", "#wwwsss#", " #ssss# ", "  ####  "];
  function snowBall(D) {
    var col = { "#": "#8fb4dc", w: "#ffffff", s: "#d4e4f6" }, s = "";
    SNOWB.forEach(function (r, y) { for (var x = 0; x < 8; x++) { var f = col[r.charAt(x)]; if (f) s += '<rect x="' + x + '" y="' + y + '" width="1" height="1" fill="' + f + '"/>'; } });
    return '<svg width="' + D + '" height="' + D + '" viewBox="0 0 8 8" aria-hidden="true">' + s + "</svg>";
  }
  /* 雪痕：一块不规则的像素雪渍 + 飞溅的雪点 + 慢慢淌下来的雪水，留在屏幕上不消失 */
  function splatEl(rx, ry) {
    var p = 6, mx = 44, W = Math.ceil((rx * 2 + mx * 2) / p) * p, H0 = Math.ceil((ry * 2 + mx * 2) / p) * p, H = H0 + 70, cx = W / 2, cy = H0 / 2, i;
    var ph = [Math.random() * 6.28, Math.random() * 6.28, Math.random() * 6.28], am = [0.13, 0.09, 0.06 + Math.random() * 0.04];
    function R(th) { return 1 + am[0] * Math.sin(3 * th + ph[0]) + am[1] * Math.sin(5 * th + ph[1]) + am[2] * Math.sin(8 * th + ph[2]); }
    function inside(x, y, pad) { var dx = x - cx, dy = y - cy, a = rx + pad, b = ry + pad; return Math.sqrt(dx * dx / (a * a) + dy * dy / (b * b)) <= R(Math.atan2(dy, dx)); }
    function mask(pad) {
      var d = "", y, x, run;
      for (y = 0; y < H0; y += p) {
        run = -1;
        for (x = 0; x <= W; x += p) {
          var on = x < W && inside(x + p / 2, y + p / 2, pad);
          if (on && run < 0) run = x;
          else if (!on && run >= 0) { d += "M" + run + " " + y + "h" + (x - run) + "v" + p + "h" + (run - x) + "z"; run = -1; }
        }
      }
      return d;
    }
    var fb = "", fw = "", drips = "";
    for (i = 0; i < 11; i++) { /* 飞溅出去的雪点 */
      var a = Math.random() * 6.2832, rr = 1.12 + Math.random() * 0.4, s = p * (1 + Math.floor(Math.random() * 2)),
        x = Math.round((cx + Math.cos(a) * (rx + 6) * rr - s / 2) / p) * p, y = Math.round((cy + Math.sin(a) * (ry + 6) * rr - s / 2) / p) * p;
      if (x < 2 || y < 2 || x + s > W - 2 || y + s > H0 - 2 || inside(x + s / 2, y + s / 2, 4)) continue;
      fb += "M" + (x - 2) + " " + (y - 2) + "h" + (s + 4) + "v" + (s + 4) + "h" + (-s - 4) + "z"; fw += "M" + x + " " + y + "h" + s + "v" + s + "h" + (-s) + "z";
    }
    for (i = 0; i < 3; i++) { /* 淌下来的雪水 */
      var dx = Math.round((cx + (Math.random() - 0.5) * rx * 1.3) / p) * p, yb = cy, L;
      while (yb < H0 && inside(dx + p / 2, yb, 0)) yb += 2;
      yb -= 4; L = Math.min(14 + Math.random() * 30, H - yb - 4);
      if (L < 12) continue;
      drips += '<g class="sd" style="animation-delay:' + (0.5 + Math.random() * 2.2).toFixed(2) + "s;animation-duration:" + (5 + Math.random() * 4).toFixed(1) + 's"><rect x="' + (dx - 2) + '" y="' + yb + '" width="' + (p + 4) + '" height="' + (L + 4) + '" fill="#a9c8ea"/><rect x="' + dx + '" y="' + (yb - 2) + '" width="' + p + '" height="' + (L + 2) + '" fill="#fff"/></g>';
    }
    var el = mk("div", "snow-splat", '<svg width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + " " + H + '" aria-hidden="true"><path d="' + mask(p * 0.7) + fb + '" fill="#a9c8ea"/><path d="' + mask(0) + fw + '" fill="#fff"/>' + drips + "</svg>");
    el.style.transformOrigin = "50% " + cy + "px";
    return { el: el, W: W, H0: H0 };
  }
  function snowCap(el) { /* 窗口顶上顶着一层雪，过一会儿化掉 */
    if (el.classList.contains("photo")) return;
    var c = mk("i", "snow-cap", '<svg viewBox="0 0 100 12" preserveAspectRatio="none" width="100%" height="100%" aria-hidden="true"><path d="M0 0H100V5Q97 5 96 8T92 6Q88 4 86 9T80 5Q75 3 73 10T66 5Q60 4 58 8T52 5Q45 3 43 11T36 5Q30 4 28 8T22 5Q15 3 13 9T7 5Q3 4 2 7T0 5Z" fill="#fff"/></svg>');
    el.appendChild(c);
    setTimeout(function () {
      try { var a = c.animate([{ opacity: 1, transform: "none" }, { opacity: 0, transform: "translateY(35%) scaleY(.3)" }], { duration: 1500, easing: "ease-in", fill: "forwards" }); a.onfinish = function () { rmEl(c); }; } catch (e) { rmEl(c); }
    }, 1500);
  }
  function snowStart(vw, vh, total, tok) {
    snowAbort();
    var u = Math.max(4, Math.min(7, Math.round(vw / 70))), cw = 14 * u, ch = 12 * u, D = 4 * u;
    var me = sq = { q: [], busy: false, ready: false, finished: false, leaving: false, dead: false, waiters: [], total: total, done: 0, tw: [], raf: 0, tms: [], els: [], pump: null };
    var sx = Math.round(vw * 0.62 - cw / 2), sy = Math.round(vh - ch - 56);
    var HX = sx + 7 * u, HY = sy + 8 * u, LX = sx + 8 * u, LY = sy - 1.5 * u; /* 抱在胸前 / 举过头顶 */
    var C = { y: 0, r: 0 }, B = { x: HX, y: HY, s: 1, r: 0, on: false };
    var cat = mk("div", "snowcat"), sit = mk("div", "mc-bob"), cbx = catBox(u, catCfg("b"), "up"), bub = mk("div", "cbub"), bt = 0;
    cat.style.cssText = "left:" + sx + "px;top:" + sy + "px";
    sit.style.transformOrigin = "50% 100%";
    sit.appendChild(cbx); cat.appendChild(sit); cat.appendChild(bub);
    var ball = mk("div", "snowball", snowBall(D)); ball.style.display = "none";
    stage.appendChild(cat); stage.appendChild(ball); me.els.push(cat, ball);
    function say(t, ms) { bub.textContent = t; bub.classList.add("show"); clearTimeout(bt); bt = setTimeout(function () { bub.classList.remove("show"); }, ms || 900); me.tms.push(bt); }
    me.paint = function () {
      if (!sit.className) sit.style.transform = "translateY(" + C.y.toFixed(1) + "px) rotate(" + C.r.toFixed(1) + "deg)";
      if (B.on) ball.style.transform = "translate(" + (B.x - D / 2).toFixed(1) + "px," + (B.y - D / 2).toFixed(1) + "px) rotate(" + B.r.toFixed(0) + "deg) scale(" + B.s.toFixed(3) + ")";
    };
    sceneLoop(me);
    var go = me.go;
    function shake(a) { try { stage.animate([{ translate: "0 0" }, { translate: "0 " + a + "px" }, { translate: "0 " + (-a * 0.6) + "px" }, { translate: a * 0.4 + "px 0" }, { translate: "0 0" }], { duration: 240, easing: "ease-out" }); } catch (er) {} }
    function burst(x, y, size) { /* 白闪 + 四散的雪块 */
      var f = mk("div", "snow-flash"); f.style.cssText = "left:" + x + "px;top:" + y + "px;width:" + size * 2.4 + "px;height:" + size * 2.4 + "px"; stage.appendChild(f); me.els.push(f);
      try { var fa = f.animate([{ transform: "translate(-50%,-50%) scale(.3)", opacity: 0.95 }, { transform: "translate(-50%,-50%) scale(1.1)", opacity: 0 }], { duration: 300, easing: "ease-out" }); fa.onfinish = function () { rmEl(f); }; } catch (e) { rmEl(f); }
      var n = 16, i;
      for (i = 0; i < n; i++) {
        var c = mk("i", "snow-chunk"), s = 5 + Math.floor(Math.random() * 3) * 3, a = (i / n) * 6.2832 + Math.random() * 0.5, d = size * (0.55 + Math.random() * 0.8);
        c.style.cssText = "left:" + x + "px;top:" + y + "px;width:" + s + "px;height:" + s + "px"; stage.appendChild(c); me.els.push(c);
        try {
          var ca = c.animate([{ transform: "translate(-50%,-50%) rotate(0)", opacity: 1 }, { transform: "translate(calc(-50% + " + (Math.cos(a) * d).toFixed(1) + "px),calc(-50% + " + (Math.sin(a) * d * 0.8 + 24 + Math.random() * 30).toFixed(1) + "px)) rotate(" + ((Math.random() - 0.5) * 360).toFixed(0) + "deg)", opacity: 0 }], { duration: 480 + Math.random() * 360, easing: "cubic-bezier(.2,.7,.4,1)" });
          ca.onfinish = (function (c) { return function () { rmEl(c); }; })(c);
        } catch (e) { rmEl(c); }
      }
    }
    function one(it, next) {
      var sp = me.q.length > 4 ? 0.72 : 1, el = it.el, w = it.w, h = it.h, tx = it.cx, ty = it.cy, semi = [0, 2, 4, 7, 9][(it.idx || 0) % 5];
      var Sf = Math.max(2.2, Math.min(7, Math.max(56, Math.min(120, Math.min(w, h) * 0.55)) / D)); /* 砸到“屏幕”上时雪球已经大了好几倍 */
      function pack() { /* 团雪球：拍三下，越拍越圆 */
        cbx.setMood("open"); B.on = true; B.x = HX; B.y = HY; B.r = 0; B.s = 0.3; ball.style.display = "";
        if ((it.idx || 0) === 0) say("团个雪球～", 900);
        var beats = 0;
        go(420 * sp, function (t) {
          var k = Math.floor(t * 3); if (k > beats) { beats = k; sfxPat(); }
          C.y = Math.abs(Math.sin(t * 3 * Math.PI)) * u * 0.9; C.r = 0;
          B.s = 0.3 + 0.7 * ease3(t); B.y = HY + C.y * 0.8;
        }, wind);
      }
      function wind() { /* 举过头顶，身子往后仰 */
        cbx.setMood("wide");
        go(180 * sp, function (t) {
          var e = ease3(t); B.x = HX + (LX - HX) * e; B.y = HY + (LY - HY) * e - Math.sin(Math.PI * e) * u; B.s = 1 + 0.12 * e; C.r = -9 * e; C.y = u * 0.6 * e;
        }, fly);
      }
      function fly() { /* 朝屏幕扔出去：一路变大，像朝你飞来 */
        sfxWhoosh(); cbx.setMood("happy");
        var x0 = B.x, y0 = B.y, cxp = (x0 + tx) / 2 + (tx - x0) * 0.1, cyp = Math.min(y0, ty) - 40 - Math.abs(ty - y0) * 0.25;
        go(400 * sp, function (t) {
          var e = Math.pow(t, 1.3), a = (1 - e) * (1 - e), b = 2 * (1 - e) * e, c = e * e;
          B.x = a * x0 + b * cxp + c * tx; B.y = a * y0 + b * cyp + c * ty; B.s = 1.12 + (Sf - 1.12) * Math.pow(t, 1.6); B.r = t * 480;
          C.r = t < 0.2 ? -9 + 21 * (t / 0.2) : 12 * (1 - (t - 0.2) / 0.8); C.y = -u * 1.2 * Math.sin(Math.PI * Math.min(1, t * 2));
        }, impact);
      }
      function impact() { /* 啪！雪球炸开，窗口从雪渍里弹出来 */
        B.on = false; ball.style.display = "none"; C.r = 0; C.y = 0; cbx.setMood("up");
        var rx = Math.min(190, w * 0.56 + 8), ry = Math.min(150, h * 0.56 + 14), sp2 = splatEl(rx, ry);
        sp2.el.style.left = (tx - sp2.W / 2) + "px"; sp2.el.style.top = (ty - sp2.H0 / 2) + "px"; stage.appendChild(sp2.el); /* 雪痕不记进 els：会一直留在屏幕上 */
        burst(tx, ty, Math.max(rx, ry) * 0.9); sfxSplat(1); shake(2 + Math.min(3, w / 120)); sfxMeow("happy", semi);
        if ((it.idx || 0) % 3 === 0) say("啪！", 700);
        it.show();
        try { el.animate([{ opacity: 0, transform: "scale(.4) translateY(16px)" }, { opacity: 1, transform: "scale(1.08) translateY(-3px)", offset: 0.6 }, { opacity: 1, transform: "none" }], { duration: 440, easing: "cubic-bezier(.2,.9,.3,1)", fill: "backwards" }); } catch (e) {}
        snowCap(el);
        me.tms.push(setTimeout(function () { if (!me.dead && it.land) it.land(); }, 150));
        me.tms.push(setTimeout(next, 170 * sp));
      }
      pack();
    }
    function leave() {
      if (me.leaving || me.dead) return; me.leaving = true;
      cbx.setMood("happy"); sfxMeow("meow", 5); say("扔完啦～", 900);
      me.tms.push(setTimeout(function () {
        if (me.dead) return; sit.className = "mc-bob"; sit.style.transform = "";
        var a = cat.animate([{ transform: "translateX(0)" }, { transform: "translateX(" + (-(sx + cw + 24)) + "px)" }], { duration: 700, easing: "ease-in", fill: "forwards" });
        a.onfinish = function () {
          if (me.dead) return; rmEl(cat); rmEl(ball); me.finished = true; cancelAnimationFrame(me.raf);
          me.waiters.splice(0).forEach(function (f) { f(); });
        };
      }, 900));
    }
    function pump() {
      if (me.dead || me.busy || !me.ready) return;
      var it = me.q.shift();
      if (!it) { if (me.done >= me.total) leave(); return; }
      me.busy = true;
      one(it, function () { me.busy = false; me.done++; pump(); });
    }
    me.pump = pump;
    /* 小猫从左边跑进来，站好 */
    var a0 = cat.animate([{ transform: "translateX(" + (-(sx + cw + 24)) + "px)" }, { transform: "translateX(0)" }], { duration: 700, easing: "ease-out", fill: "both" });
    a0.onfinish = function () { if (me.dead) return; sit.className = ""; me.ready = true; pump(); };
  }


  /* ---- 小猫线球：小猫一爪子拍出线球，线球拖着毛线滚到窗口该在的位置，猛地一拽，窗口从线球下面弹出来 ---- */
  var yq = null;
  function sfxBat() { if (!soundOn || !AC) return; var t = AC.currentTime; noiseHit(t, 0.08, 1400, 0.8, 0.1, "bandpass", 2); tone(520, t, 0.05, 0.05, "triangle"); }
  function sfxYank(v) { if (!soundOn || !AC) return; var t = AC.currentTime; tone(300, t, 0.06, 0.1 * v, "triangle"); tone(760, t + 0.04, 0.1, 0.08 * v, "sine"); noiseHit(t, 0.1, 2400, 0.8, 0.1 * v, "bandpass", 2); }
  function yarnAbort() {
    var me = yq; if (!me) return; yq = null; me.dead = true; me.waiters = [];
    cancelAnimationFrame(me.raf); me.tms.forEach(clearTimeout); me.els.forEach(rmEl);
  }
  function yarnAdd(it) { if (yq && !yq.dead) { yq.q.push(it); yq.pump(); } else if (it.quick) it.quick(); }
  var YARNB = ["  ####  ", " #oolo# ", "#ooloooo", "#lloooo#", "#oooollo", "#oolooo#", " #oooo# ", "  ####  "];
  function yarnBall(D) {
    var col = { "#": "#b0405a", o: "#ff8fb1", l: "#ffd0df" }, s = "";
    YARNB.forEach(function (r, y) { for (var x = 0; x < 8; x++) { var f = col[r.charAt(x)]; if (f) s += '<rect x="' + x + '" y="' + y + '" width="1" height="1" fill="' + f + '"/>'; } });
    return '<svg width="' + D + '" height="' + D + '" viewBox="0 0 8 8" aria-hidden="true">' + s + "</svg>";
  }
  function yarnStart(vw, vh, total, tok) {
    yarnAbort();
    var u = Math.max(4, Math.min(7, Math.round(vw / 70))), cw = 14 * u, ch = 12 * u, D = 4 * u;
    var me = yq = { q: [], busy: false, ready: false, finished: false, leaving: false, dead: false, waiters: [], total: total, done: 0, tw: [], raf: 0, tms: [], els: [], pump: null };
    var sx = Math.round(vw * 0.62 - cw / 2), sy = Math.round(vh - ch - 56);
    var AX = sx + 4 * u, AY = sy + 9 * u, HX = sx + 1 * u, HY = sy + 10.5 * u; /* 线头在小猫爪边，线球放在脚边 */
    var C = { y: 0, r: 0 }, B = { x: HX, y: HY, s: 1, r: 0, on: false }, T = { on: false, sag: 0 };
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "yarnfx"); svg.setAttribute("width", vw); svg.setAttribute("height", vh); svg.setAttribute("aria-hidden", "true");
    svg.innerHTML = '<path d=""/>';
    var thread = svg.firstChild;
    var cat = mk("div", "snowcat"), sit = mk("div", "mc-bob"), cbx = catBox(u, catCfg("a"), "up"), bub = mk("div", "cbub"), bt = 0;
    cat.style.cssText = "left:" + sx + "px;top:" + sy + "px";
    sit.style.transformOrigin = "50% 100%";
    sit.appendChild(cbx); cat.appendChild(sit); cat.appendChild(bub);
    var ball = mk("div", "snowball", yarnBall(D)); ball.style.display = "none";
    stage.appendChild(svg); stage.appendChild(cat); stage.appendChild(ball); me.els.push(svg, cat, ball);
    function say(t, ms) { bub.textContent = t; bub.classList.add("show"); clearTimeout(bt); bt = setTimeout(function () { bub.classList.remove("show"); }, ms || 900); me.tms.push(bt); }
    me.paint = function () {
      if (!sit.className) sit.style.transform = "translateY(" + C.y.toFixed(1) + "px) rotate(" + C.r.toFixed(1) + "deg)";
      if (B.on) ball.style.transform = "translate(" + (B.x - D / 2).toFixed(1) + "px," + (B.y - D / 2).toFixed(1) + "px) rotate(" + B.r.toFixed(0) + "deg) scale(" + B.s.toFixed(3) + ")";
      thread.setAttribute("d", T.on ? "M" + AX + "," + AY + " Q" + ((AX + B.x) / 2) + "," + ((AY + B.y) / 2 + T.sag) + " " + B.x + "," + B.y : "");
    };
    sceneLoop(me);
    var go = me.go;
    function fuzz(x, y, n) { /* 拽出来时飞散的毛线头 */
      for (var i = 0; i < n; i++) {
        var c = mk("i", "snow-chunk yarn-bit"), a = Math.random() * 6.2832, d = 30 + Math.random() * 50;
        c.style.cssText = "left:" + x + "px;top:" + y + "px;width:5px;height:5px"; stage.appendChild(c); me.els.push(c);
        try { var ca = c.animate([{ transform: "translate(-50%,-50%)", opacity: 1 }, { transform: "translate(calc(-50% + " + (Math.cos(a) * d).toFixed(1) + "px),calc(-50% + " + (Math.sin(a) * d * 0.7 + 20).toFixed(1) + "px)) rotate(" + ((Math.random() - 0.5) * 300).toFixed(0) + "deg)", opacity: 0 }], { duration: 500 + Math.random() * 300, easing: "ease-out" }); ca.onfinish = (function (c) { return function () { rmEl(c); }; })(c); } catch (e) { rmEl(c); }
      }
    }
    function one(it, next) {
      var sp = me.q.length > 4 ? 0.72 : 1, el = it.el, w = it.w, tx = it.cx, ty = it.cy, semi = [0, 2, 4, 7, 9][(it.idx || 0) % 5];
      var heavy = Math.max(0.7, Math.min(2.4, w / 200)), tugs = 1 + (heavy > 1.8 ? 1 : 0);
      function bat() { /* 一爪子把线球拍出去 */
        cbx.setMood("wide"); B.on = true; B.x = HX; B.y = HY; B.r = 0; B.s = 1; T.on = true; T.sag = 8; ball.style.display = "";
        if ((it.idx || 0) === 0) say("看我的线球～", 900);
        go(160 * sp, function (t) { C.r = -6 * Math.sin(Math.PI * t) - 4 * t; C.y = 0; }, roll); sfxBat();
      }
      function roll() { /* 线球拖着毛线滚过去，一路蹦两下 */
        cbx.setMood("happy");
        var x0 = B.x, y0 = B.y;
        go(520 * sp, function (t) {
          var e = ease3(t);
          B.x = x0 + (tx - x0) * e; B.y = y0 + (ty - y0) * e - Math.abs(Math.sin(t * 6.2832 * 1.5)) * 26 * (1 - t); B.r = (tx >= x0 ? 1 : -1) * t * 900;
          T.sag = 40 * (1 - e) + 14; C.r = 6 * (1 - t); C.y = 0;
        }, tug);
      }
      function tug(k) { /* 线绷紧，小猫往后一仰，线球在窗口位置抖 */
        k = k || 0;
        if (k >= tugs) { yank(); return; }
        cbx.setMood("wide"); sfxTug();
        go(210 * sp, function (t) { var s = Math.sin(Math.PI * t); T.sag = 14 * (1 - s); C.r = 8 * s; C.y = u * 0.4 * s; B.x = tx + Math.sin(t * 37) * 3 * s; B.y = ty; }, function () { tug(k + 1); });
      }
      function yank() { /* 猛地一拽：窗口从线球底下弹出来，线球被拽回小猫脚边 */
        cbx.setMood("happy"); say(heavy > 1.35 ? "嘿咻——！" : "拽出来啦！", 800);
        it.show(); sfxYank(1); fuzz(tx, ty, 10); sfxMeow("happy", semi);
        try { el.animate([{ opacity: 0, transform: "scale(.2) rotate(-12deg)" }, { opacity: 1, transform: "scale(1.1) rotate(3deg)", offset: 0.6 }, { opacity: 1, transform: "none" }], { duration: 420, easing: "cubic-bezier(.2,.9,.3,1)", fill: "backwards" }); } catch (e) {}
        me.tms.push(setTimeout(function () { if (!me.dead && it.land) it.land(); }, 150));
        var x0 = B.x, y0 = B.y;
        go(420 * sp, function (t) {
          var e = t * t; B.x = x0 + (HX - x0) * e; B.y = y0 + (HY - y0) * e - Math.sin(Math.PI * e) * 50; B.r += 24; T.sag = 10 + 30 * e; C.r = 8 * (1 - t); C.y = 0;
        }, function () { B.on = false; T.on = false; ball.style.display = "none"; cbx.setMood("up"); next(); });
      }
      bat();
    }
    function leave() {
      if (me.leaving || me.dead) return; me.leaving = true;
      cbx.setMood("happy"); sfxMeow("meow", 5); say("玩够啦～", 900);
      me.tms.push(setTimeout(function () {
        if (me.dead) return; sit.className = "mc-bob"; sit.style.transform = "";
        var a = cat.animate([{ transform: "translateX(0)" }, { transform: "translateX(" + (vw - sx + 24) + "px)" }], { duration: 700, easing: "ease-in", fill: "forwards" });
        a.onfinish = function () { if (me.dead) return; rmEl(cat); rmEl(ball); rmEl(svg); me.finished = true; cancelAnimationFrame(me.raf); me.waiters.splice(0).forEach(function (f) { f(); }); };
      }, 900));
    }
    function pump() {
      if (me.dead || me.busy || !me.ready) return;
      var it = me.q.shift();
      if (!it) { if (me.done >= me.total) leave(); return; }
      me.busy = true;
      one(it, function () { me.busy = false; me.done++; pump(); });
    }
    me.pump = pump;
    var a0 = cat.animate([{ transform: "translateX(" + (vw - sx + 24) + "px)" }, { transform: "translateX(0)" }], { duration: 700, easing: "ease-out", fill: "both" });
    a0.onfinish = function () { if (me.dead) return; sit.className = ""; me.ready = true; pump(); };
  }


  /* ---- 猫爪拍窗 / 气球带上来：不需要小猫排队的两种出场（窗口之间可以同时进行） ---- */
  var pq = null;
  function pqAbort() { var me = pq; if (!me) return; pq = null; me.dead = true; me.waiters = []; me.tms.forEach(clearTimeout); me.els.forEach(rmEl); }
  function pqStart(total) { pqAbort(); return (pq = { dead: false, finished: false, waiters: [], total: total, done: 0, tms: [], els: [] }); }
  function pqAdd(it, fn) {
    var me = pq; if (!me || me.dead) { if (it.quick) it.quick(); return; }
    fn(me, function () { if (me.dead) return; if (++me.done >= me.total) me.tms.push(setTimeout(function () { if (me.dead) return; me.finished = true; me.waiters.splice(0).forEach(function (f) { f(); }); }, 350)); });
  }
  function pqTimer(me, f, ms) { me.tms.push(setTimeout(function () { if (!me.dead) f(); }, ms)); }
  /* 肉垫：像素风猫爪，fur 毛色，bean 肉垫色；stamp 时只画一种颜色 */
  function pawSvg(cell, fur, bean, stamp) {
    var N = 20, g = [], x, y, out = "";
    function disc(cx, cy, rx, ry, v) { for (y = 0; y < N; y++) for (x = 0; x < N; x++) { var dx = (x + 0.5 - cx) / rx, dy = (y + 0.5 - cy) / ry; if (dx * dx + dy * dy <= 1) g[y][x] = v; } }
    for (y = 0; y < N; y++) { g[y] = []; for (x = 0; x < N; x++) g[y][x] = 0; }
    disc(3.6, 6.2, 2.7, 3.2, 1); disc(7.8, 3.4, 2.8, 3.4, 1); disc(12.2, 3.4, 2.8, 3.4, 1); disc(16.4, 6.2, 2.7, 3.2, 1); disc(10, 13.4, 7, 6, 1);
    if (!stamp) { disc(10, 14, 4.4, 3.4, 2); disc(3.6, 6.4, 1.2, 1.4, 2); disc(7.8, 3.6, 1.3, 1.6, 2); disc(12.2, 3.6, 1.3, 1.6, 2); disc(16.4, 6.4, 1.2, 1.4, 2); }
    for (y = 0; y < N; y++) for (x = 0; x < N; x++) {
      var v = g[y][x], f = null;
      if (v === 2) f = bean; else if (v === 1) f = stamp ? fur : fur;
      else if (!stamp && ((g[y - 1] && g[y - 1][x]) || (g[y + 1] && g[y + 1][x]) || g[y][x - 1] || g[y][x + 1])) f = "var(--pet-line)";
      if (f) out += '<rect x="' + x + '" y="' + y + '" width="1" height="1" fill="' + f + '"/>';
    }
    return '<svg width="' + N * cell + '" height="' + N * cell + '" viewBox="0 0 ' + N + " " + N + '" aria-hidden="true" style="display:block;shape-rendering:crispEdges">' + out + "</svg>";
  }
  function shakeStage(a) { try { stage.animate([{ translate: "0 0" }, { translate: "0 " + a + "px" }, { translate: "0 " + (-a * 0.6) + "px" }, { translate: a * 0.4 + "px 0" }, { translate: "0 0" }], { duration: 260, easing: "ease-out" }); } catch (er) {} }

  function pawEnter(act, vw, vh) { /* 巨大的猫爪从屏幕外伸进来，“啪”地按在窗口该在的位置，抬起后窗口留在原地 */
    pqAdd(act, function (me, done) {
      var el = act.el, tx = act.cx, ty = act.cy, w = act.w, pw = Math.max(96, Math.min(170, w * 0.5)), cell = pw / 20, cf = catCfg("a");
      var paw = mk("div", "bigpaw", pawSvg(cell, cf.fur, "#ff9fb5", false)), sh = mk("div", "pawshadow"), side = (act.idx % 2 ? 1 : -1);
      paw.style.cssText = "left:" + tx + "px;top:" + ty + "px"; sh.style.cssText = "left:" + tx + "px;top:" + ty + "px;width:" + pw * 1.1 + "px;height:" + pw * 1.1 + "px";
      stage.appendChild(sh); stage.appendChild(paw); me.els.push(paw, sh);
      var r0 = side * 14, from = "translate(-50%,-50%) translate(" + side * 40 + "px," + -(ty + pw) + "px) scale(1.7) rotate(" + r0 + "deg)";
      try { sh.animate([{ transform: "translate(-50%,-50%) scale(.3)", opacity: 0 }, { transform: "translate(-50%,-50%) scale(1)", opacity: 0.32 }], { duration: 340, easing: "ease-in", fill: "forwards" }); } catch (e) {}
      var a = paw.animate([{ transform: from }, { transform: "translate(-50%,-50%) scale(1) rotate(0deg)" }], { duration: 340, easing: "cubic-bezier(.5,0,.9,.6)", fill: "forwards" });
      a.onfinish = function () {
        if (me.dead) return;
        /* 啪！ */
        sfxThud(1.1, 0.9); sfxMeow("short", [0, 2, 4, 7, 9][act.idx % 5]); shakeStage(3 + Math.min(3, w / 120));
        var st = mk("div", "pawstamp", pawSvg(Math.max(3, pw / 30), "#d98aa0", "", true)); /* 肉垫印留在窗口后面 */
        st.style.cssText = "left:" + tx + "px;top:" + ty + "px;--r:" + (side * 12) + "deg"; stage.appendChild(st);
        for (var i = 0; i < 8; i++) {
          var d = mk("i", "kdust"), sz = 9 + Math.random() * 8, sd = i % 2 ? 1 : -1;
          d.style.cssText = "left:" + (tx + sd * pw * (0.3 + Math.random() * 0.3)) + "px;top:" + (ty + pw * 0.35) + "px;width:" + sz + "px;height:" + sz + "px"; stage.appendChild(d); me.els.push(d);
          try { var da = d.animate([{ transform: "translate(-50%,-50%) scale(.4)", opacity: 0.7 }, { transform: "translate(calc(-50% + " + sd * (14 + Math.random() * 30) + "px),calc(-50% - " + (6 + Math.random() * 16) + "px)) scale(1.5)", opacity: 0 }], { duration: 500, easing: "ease-out" }); da.onfinish = (function (d) { return function () { rmEl(d); }; })(d); } catch (e) { rmEl(d); }
        }
        act.show();
        try { el.animate([{ opacity: 0, transform: "scale(.6,.5)" }, { opacity: 1, transform: "scale(1.06,.94)", offset: 0.45 }, { opacity: 1, transform: "none" }], { duration: 360, easing: "ease-out", fill: "backwards" }); } catch (e) {}
        pqTimer(me, function () { act.land(); }, 120);
        pqTimer(me, function () { /* 爪子抬起，缩回屏幕外 */
          sh.style.opacity = 0; sh.style.transition = "opacity .3s";
          var b = paw.animate([{ transform: "translate(-50%,-50%) scale(1) rotate(0deg)", opacity: 1 }, { transform: "translate(-50%,-50%) translate(" + -side * 30 + "px," + -(ty + pw) + "px) scale(1.5) rotate(" + -r0 + "deg)", opacity: 1 }], { duration: 380, easing: "ease-in", fill: "forwards" });
          b.onfinish = function () { rmEl(paw); rmEl(sh); };
          done();
        }, 160);
      };
    });
  }

  function balloonEnter(act, vw, vh) { /* 窗口挂在一串气球下面从屏幕下方飘上来，到位后气球“啵”地破掉 */
    pqAdd(act, function (me, done) {
      var el = act.el, tx = act.cx, ty = act.cy, h = act.h, topF = ty - h / 2, z0 = el.style.zIndex;
      var COLS = ["#ff7a9c", "#ffc24a", "#6cc3ff", "#8ee39a", "#c49bff"], n = 3, bs = [], i, svg = "";
      for (i = 0; i < n; i++) { var bx = (i - 1) * 30 + (Math.random() - 0.5) * 8, by = -78 - (i === 1 ? 20 : 0) - Math.random() * 10; bs.push({ x: bx, y: by, c: COLS[(act.idx + i * 2) % COLS.length] }); }
      bs.forEach(function (b) {
        svg += '<path d="M' + b.x + "," + (b.y + 22) + " Q" + (b.x * 0.4) + "," + (b.y * 0.4) + ' 0,0" fill="none" stroke="#9aa3b5" stroke-width="1.4"/><ellipse cx="' + b.x + '" cy="' + b.y + '" rx="15" ry="19" fill="' + b.c + '" stroke="rgba(0,0,0,.25)" stroke-width="1.5"/><ellipse cx="' + (b.x - 5) + '" cy="' + (b.y - 7) + '" rx="3.5" ry="6" fill="rgba(255,255,255,.55)"/><path d="M' + b.x + "," + (b.y + 19) + " l-3,5 h6z\" fill=\"" + b.c + '"/>';
      });
      var g = mk("div", "balloons", '<svg width="2" height="2" style="overflow:visible" aria-hidden="true">' + svg + "</svg>");
      g.style.cssText = "left:" + tx + "px;top:" + topF + "px"; stage.appendChild(g); me.els.push(g);
      var Y0 = vh - topF + 40 + 90, dur = Math.max(1100, Math.min(1700, 800 + Y0 * 0.55)), sw = 16 + Math.random() * 8, sg = act.idx % 2 ? 1 : -1;
      var kf = [{ transform: "translate(" + -sg * 10 + "px," + Y0 + "px)" }, { transform: "translate(" + sg * sw + "px," + Y0 * 0.55 + "px)", offset: 0.35 }, { transform: "translate(" + -sg * sw * 0.6 + "px," + Y0 * 0.18 + "px)", offset: 0.72 }, { transform: "translate(0,0)" }];
      var opt = { duration: dur, easing: "cubic-bezier(.3,.1,.3,1)", fill: "both" };
      el.style.zIndex = 4996; el.style.pointerEvents = "none"; act.show();
      try { g.animate(kf, opt); } catch (e) {}
      var a; try { a = el.animate(kf, opt); } catch (e) { a = null; }
      sfxReel();
      function pop() {
        if (me.dead) return;
        try { if (a) a.cancel(); } catch (e) {}
        el.style.zIndex = z0; el.style.pointerEvents = "";
        if (soundOn && AC) { var t = AC.currentTime; noiseHit(t, 0.08, 3000, 0.8, 0.22, "bandpass", 2); noiseHit(t + 0.05, 0.08, 2600, 0.8, 0.16, "bandpass", 2); noiseHit(t + 0.1, 0.08, 3400, 0.8, 0.14, "bandpass", 2); }
        bs.forEach(function (b) {
          for (var k = 0; k < 7; k++) {
            var c = mk("i", "snow-chunk"), ang = Math.random() * 6.2832, d = 26 + Math.random() * 40;
            c.style.cssText = "left:" + (tx + b.x) + "px;top:" + (topF + b.y) + "px;width:6px;height:6px;background:" + b.c + ";border-color:rgba(0,0,0,.2)"; stage.appendChild(c); me.els.push(c);
            try { var ca = c.animate([{ transform: "translate(-50%,-50%)", opacity: 1 }, { transform: "translate(calc(-50% + " + (Math.cos(ang) * d).toFixed(1) + "px),calc(-50% + " + (Math.sin(ang) * d + 30).toFixed(1) + "px)) rotate(" + ((Math.random() - 0.5) * 400).toFixed(0) + "deg)", opacity: 0 }], { duration: 600 + Math.random() * 300, easing: "ease-out" }); ca.onfinish = (function (c) { return function () { rmEl(c); }; })(c); } catch (e) { rmEl(c); }
          }
        });
        rmEl(g);
        el.style.transformOrigin = "50% 100%";
        try { var b2 = el.animate([{ transform: "translateY(-10px)" }, { transform: "translateY(2px) scale(1.03,.96)", offset: 0.5 }, { transform: "none" }], { duration: 380, easing: "ease-out" }); b2.onfinish = b2.oncancel = function () { el.style.transformOrigin = ""; }; } catch (e) { el.style.transformOrigin = ""; }
        sfxMeow("happy", [0, 2, 4, 7, 9][act.idx % 5]); act.land(); done();
      }
      pqTimer(me, pop, dur);
    });
  }

  /* ---- 小猫打翻东西：小猫跳上桌子，把窗口一个个推下去，窗口带着重量摔在地上 ---- */
  var kn = null;
  /* 出场方式：carry 叼信 / knock 打翻 / angler 钓鱼 / snow 雪球；开了“出场方式随机”就每次播放随机换一种 */
  var entryMode = "carry", lastEntry = "";
  function pickEntry() {
    var m;
    if (state.entryRand) { var pool = ["carry", "knock", "angler", "snow", "yarn", "paw", "balloon"].filter(function (x) { return x !== lastEntry; }); m = pool[Math.floor(Math.random() * pool.length)]; }
    else m = state.knock ? "knock" : state.angler ? "angler" : state.snow ? "snow" : state.yarn ? "yarn" : state.paw ? "paw" : state.balloon ? "balloon" : "carry";
    return (lastEntry = m);
  }
  /* 闷响：一记下坠的低频正弦 + 一小撮低通噪声；窗口越大越沉 */
  function sfxThud(m, v) {
    if (!soundOn || !AC) return;
    var t = AC.currentTime, vol = Math.min(0.55, (0.14 + m * 0.12) * v);
    var o = AC.createOscillator(), g = AC.createGain();
    o.type = "sine"; o.frequency.setValueAtTime(150 - m * 22, t); o.frequency.exponentialRampToValueAtTime(38, t + 0.2);
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
    o.connect(g); g.connect(master); o.start(t); o.stop(t + 0.32);
    var n = Math.floor(AC.sampleRate * 0.14), buf = AC.createBuffer(1, n, AC.sampleRate), d = buf.getChannelData(0);
    for (var i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 3);
    var s = AC.createBufferSource(), f = AC.createBiquadFilter(), g2 = AC.createGain();
    s.buffer = buf; f.type = "lowpass"; f.frequency.value = 500 + m * 100; g2.gain.value = vol * 0.9;
    s.connect(f); f.connect(g2); g2.connect(master); s.start(t);
  }
  function sfxCrack() {
    if (!soundOn || !AC) return;
    var t = AC.currentTime; tone(2600, t, 0.05, 0.05, "square"); tone(1700, t + 0.04, 0.07, 0.04, "square"); tone(3400, t + 0.09, 0.04, 0.03, "square");
  }
  function knockHalt() { if (kn && !kn.finished) { kn.cleanup(); kn.abort(); } }
  function knockRerun() {
    if (!catOn() || entryMode !== "knock" || (kn && !kn.finished) || !stage.querySelector(".win.knocked:not(.fin)")) return;
    knockStart(stage.clientWidth, stage.clientHeight, 0, runTok, { loop: true });
  }
  /* 推窗口的队列全部落地、小猫离开之后再继续后面的（压轴、拼图、署名） */
  function knockWhenDone(cb) { if (kn && !kn.finished) kn.waiters.push(cb); else if (fq && !fq.finished && !fq.dead) fq.waiters.push(cb); else if (sq && !sq.finished && !sq.dead) sq.waiters.push(cb); else if (yq && !yq.finished && !yq.dead) yq.waiters.push(cb); else if (pq && !pq.finished && !pq.dead) pq.waiters.push(cb); else cb(); }
  function knockAdd(it) { if (kn) { kn.q.push(it); kn.pump(); } }
  function knockStart(vw, vh, total, tok, opt) {
    opt = opt || {};
    var u = Math.max(4, Math.min(7, Math.round(vw / 70))), cw = 14 * u, ch = 12 * u;
    var surfY = ch + 34, slab = Math.round(u * 2.4), legH = Math.round(u * 9), G = 2600, S0 = 0.42;
    var me = kn = { q: [], busy: false, ready: false, finished: false, dead: false, leaving: false, waiters: [], total: total, done: 0, flying: 0, loop: !!opt.loop, round: 0 };
    function alive() { return kn === me && !me.dead && tok === runTok; }
    /* 被打断（点了「愿意」）：把空中的窗口原地放回去，收走桌子和小猫 */
    me.cleanup = function () {
      cat.remove(); table.remove();
      Array.prototype.forEach.call(stage.querySelectorAll(".win"), function (o) {
        if (!o._air) return;
        o._air = false; o.style.transform = ""; o.style.pointerEvents = ""; o.style.animation = ""; o.style.visibility = ""; o.classList.add("knocked");
      });
      Array.prototype.forEach.call(stage.querySelectorAll(".kshadow,.kdust,.kshard"), function (n) { n.remove(); });
    };
    function collect() {
      return Array.prototype.map.call(stage.querySelectorAll(".win.knocked:not(.fin)"), function (el, i) {
        return { el: el, w: el.offsetWidth, h: el.offsetHeight, tx: el.offsetLeft, ty: el.offsetTop, idx: i, pull: true, land: function () {} };
      }).filter(function (it) { return !it.el._air; });
    }
    function topFin() { var f = stage.querySelector(".win.fin"); if (f) bring(f); } /* 压轴始终在最上面，「愿意」才点得到 */
    me.abort = function () { me.dead = true; me.finished = true; me.waiters = []; };

    var table = document.createElement("div"); table.className = "ktable";
    table.style.cssText = "top:" + surfY + "px;--sl:" + slab + "px;--lh:" + legH + "px;--lw:" + Math.round(u * 2.4) + "px;--ty:" + (surfY + slab + legH + 20) + "px";
    table.innerHTML = '<div class="ktop"></div><i class="kleg l"></i><i class="kleg r"></i>';
    stage.appendChild(table);
    var cat = document.createElement("div"); cat.className = "kcat"; cat.style.top = (surfY - ch + 2) + "px";
    var flip = document.createElement("div"), hop = document.createElement("div"), bub = document.createElement("div");
    hop.style.transformOrigin = "50% 100%"; bub.className = "cbub";
    var box = catBox(u, catCfg("b"), "open"); hop.appendChild(box); flip.appendChild(hop); cat.appendChild(flip); cat.appendChild(bub);
    var cx = -cw - 40, bt = 0;
    function setX(x) { cx = x; cat.style.transform = "translateX(" + x + "px)"; }
    function face(d) { flip.style.transform = d < 0 ? "scaleX(-1)" : ""; }
    function say(t, ms) { clearTimeout(bt); bub.textContent = t; bub.classList.add("show"); bt = setTimeout(function () { bub.classList.remove("show"); }, ms || 800); }
    setX(cx); stage.appendChild(cat);

    function tween(ms, fn, cb) {
      var t0 = 0;
      (function f(ts) {
        if (!alive()) return;
        if (!t0) t0 = ts;
        var p = Math.min(1, (ts - t0) / ms); fn(p);
        if (p < 1) requestAnimationFrame(f); else if (cb) cb();
      })(performance.now());
    }
    function walk(x, cb) {
      var d = x - cx; if (Math.abs(d) < 3) { cb(); return; }
      face(d); hop.className = "mc-bob";
      var a = cat.animate([{ transform: "translateX(" + cx + "px)" }, { transform: "translateX(" + x + "px)" }], { duration: Math.max(120, Math.abs(d) / 0.55), easing: "ease-in-out", fill: "forwards" });
      a.onfinish = function () { if (!alive()) return; setX(x); a.cancel(); hop.className = ""; cb(); };
    }
    /* 从屏幕外一跃，落在桌面上 */
    function leap(x0, x1, y0, y1, cb) {
      var mid = (x0 + x1) / 2, a = cat.animate([
        { transform: "translate(" + x0 + "px," + y0 + "px)", offset: 0, easing: "ease-out" },
        { transform: "translate(" + mid + "px," + (-5 * u) + "px)", offset: 0.5, easing: "ease-in" },
        { transform: "translate(" + x1 + "px," + y1 + "px)", offset: 1 }], { duration: 720, fill: "forwards" });
      a.onfinish = function () { if (!alive()) return; if (y1 === 0) { setX(x1); a.cancel(); } cb(); };
    }

    function swat() { hop.animate([{ transform: "translateX(0)" }, { transform: "translateX(" + 1.6 * u + "px) scale(1.05)" }, { transform: "translateX(0)" }], { duration: 220, easing: "ease-out" }); }
    function shake(a) {
      try { stage.animate([{ translate: "0 0" }, { translate: "0 " + a + "px" }, { translate: "0 " + (-a * 0.6) + "px" }, { translate: a * 0.4 + "px 0" }, { translate: "0 0" }], { duration: 260, easing: "ease-out" }); } catch (er) {}
    }

    /* ---- 桌上的摆件：小猫先把它们一个个拍下去，摔成像素碎片 ---- */
    var PAL = { o: "#4a3a4f", c: "#8b5a3c", w: "#fff8ee", p: "#ff9fb5", g: "#4fae6b", b: "#d9794a", s: "#6b4a33" };
    var PROPS = [
      { rows: ["oooooo..", "occcco..", "owwwwooo", "owppwo.o", "owwwwooo", "owwwwo..", ".oooo..."], bits: ["#fff8ee", "#ff9fb5", "#8b5a3c", "#4a3a4f"] },
      { rows: ["..g.g..", ".ggggg.", "gg.g.gg", ".ggggg.", "..ggg..", ".ooooo.", ".obbbo.", ".obbbo.", "..obo..", "..ooo.."], bits: ["#4fae6b", "#d9794a", "#6b4a33", "#6b4a33"] }
    ];
    var props = [];
    (function () {
      if (opt.loop) return;
      var order = Math.random() < 0.5 ? [0, 1] : [1, 0], xs = [vw * (0.26 + Math.random() * 0.1), vw * (0.58 + Math.random() * 0.14)];
      order.forEach(function (pi, k) {
        var P = PROPS[pi], rows = P.rows, svg = "";
        rows.forEach(function (r, y) { for (var x = 0; x < r.length; x++) { var c = PAL[r.charAt(x)]; if (c) svg += '<rect x="' + x + '" y="' + y + '" width="1" height="1" fill="' + c + '"/>'; } });
        var el = document.createElement("div"); el.className = "kprop"; var pw = rows[0].length * u, ph = rows.length * u;
        el.style.cssText = "left:" + xs[k] + "px;top:" + (-ph) + "px";
        el.innerHTML = '<svg width="' + pw + '" height="' + ph + '" viewBox="0 0 ' + rows[0].length + ' ' + rows.length + '" aria-hidden="true">' + svg + "</svg>";
        table.appendChild(el); props.push({ el: el, x: xs[k], w: pw, h: ph, bits: P.bits });
      });
    })();
    function shatter(x, y, bits) {
      for (var k = 0; k < 14; k++) {
        var d = document.createElement("i"); d.className = "kshard"; var sz = Math.round(u * (0.7 + Math.random() * 0.8));
        d.style.cssText = "left:" + x + "px;top:" + y + "px;width:" + sz + "px;height:" + sz + "px;background:" + bits[k % bits.length]; stage.appendChild(d);
        var dx = (Math.random() - 0.5) * 150, up = 30 + Math.random() * 70;
        (function (d) { d.animate([{ transform: "translate(0,0) rotate(0)", opacity: 1 }, { transform: "translate(" + dx * 0.6 + "px," + -up + "px) rotate(" + dx + "deg)", opacity: 1, offset: 0.35 }, { transform: "translate(" + dx + "px," + (Math.random() * 14) + "px) rotate(" + dx * 2 + "deg)", opacity: 0 }], { duration: 900 + Math.random() * 500, easing: "ease-out" }).onfinish = function () { d.remove(); }; })(d);
      }
    }
    function runProps(cb) {
      var floorY = Math.max(surfY + 120, vh - 100), D = floorY - surfY;
      (function nextProp(k) {
        if (!alive()) return;
        if (k >= props.length) { cb(); return; }
        var P = props[k], dir = cx < P.x ? 1 : -1, catX = dir > 0 ? P.x - cw + 2 * u : P.x + P.w - 2 * u;
        catX = Math.max(2, Math.min(vw - cw - 2, catX));
        walk(catX, function () {
          if (!alive()) return;
          face(dir); say(k ? "再来一个～" : "嘿嘿", 700); sfxMeow("short", k * 4); swat(); box.setMood("wide");
          setTimeout(function () {
            if (!alive()) return; box.setMood("open");
            var ms = Math.sqrt(2 * D / G) * 1000, x0 = P.x + P.w / 2;
            tween(ms, function (p) {
              var q = p * p; P.el.style.transform = "translate(" + dir * 50 * p + "px," + D * q + "px) rotate(" + dir * 300 * p + "deg) scale(" + (1 + 0.5 * p) + ")";
            }, function () {
              P.el.remove(); sfxThud(0.5, 0.9); shake(2.5); shatter(x0 + dir * 50, floorY, P.bits);
              setTimeout(function () { nextProp(k + 1); }, 450);
            });
          }, 110);
        });
      })(0);
    }

    /* ---- 一个窗口：弹到桌上 → 小猫走过去 → 推（重的要先使劲）→ 摔下去 ---- */
    function push(it, next) {
      var el = it.el, w = it.w, h = it.h, cxT = it.tx + w / 2, cyT = it.ty + h / 2, ws = w * S0, hs = h * S0;
      var m = Math.max(0.6, Math.min(2.3, w * h / (320 * 130))); /* “重量”：窗口越大越重 */
      var sx = Math.max(ws / 2 + 6, Math.min(vw - ws / 2 - 6, cxT));
      var dir = cx < sx ? 1 : -1;
      function spot(d) { return d > 0 ? sx - ws / 2 - cw + 2 * u : sx + ws / 2 - 2 * u; }
      var catX = spot(dir); if (catX < 2 || catX > vw - cw - 2) { dir = -dir; catX = spot(dir); }
      catX = Math.max(2, Math.min(vw - cw - 2, catX));
      var x0 = sx - cxT, y0 = Math.min(surfY - hs / 2 - cyT, -50), slide = dir * (16 + m * 8);
      function pose(dx, dy, sc, r, qx, qy) {
        el.style.transform = "translate(" + dx.toFixed(1) + "px," + (dy + h * sc * (1 - qy) / 2).toFixed(1) + "px) rotate(" + r.toFixed(2) + "deg) scale(" + (sc * qx).toFixed(3) + "," + (sc * qy).toFixed(3) + ")";
      }
      el._air = true; el.style.visibility = ""; el.style.pointerEvents = "none"; bring(el); topFin();
      var pend = 2;
      function ready() { if (--pend) return; face(dir); nudge(0); }
      if (it.pull) { /* 小猫把摔在地上的窗口叼回桌上 */
        pose(0, 0, 1, 0, 1, 1); sfxMeow("short");
        tween(380, function (p) { var q = 1 - Math.pow(1 - p, 3); pose(x0 * q, y0 * q - 70 * Math.sin(p * Math.PI), 1 + (S0 - 1) * q, 0, 1, 1); }, ready);
      } else {
        pose(x0, y0, 0.01, 0, 1, 1);
        tween(240, function (p) { var b = 1.70158, q = p - 1, e = 1 + (b + 1) * q * q * q + b * q * q; pose(x0, y0, S0 * e, 0, 1, 1); }, ready);
      }
      walk(catX, ready);

      var nudges = m > 1.3 ? 1 : 0;
      function nudge(k) {
        if (!alive()) return;
        if (k >= nudges) { shove(); return; }
        say("嘿咻…", 700); sfxMeow("hm"); swat();
        tween(340, function (p) { var a = Math.sin(p * Math.PI); pose(x0 + dir * 5 * a, y0, S0, dir * 2 * a, 1, 1); }, function () { setTimeout(function () { nudge(k + 1); }, 140); });
      }
      function shove() {
        if (!alive()) return;
        sfxMeow("short", [0, 2, 4, 7, 9][(it.idx || 0) % 5]); swat(); box.setMood("wide");
        setTimeout(function () { if (alive()) box.setMood("open"); }, 650);
        setTimeout(function () {
          tween(240, function (p) { pose(x0 + slide * p * p, y0, S0, dir * (4 + m * 2) * p, 1, 1); }, fall);
        }, 90);
      }

      function fall() {
        if (!alive()) return;
        me.flying++; next();
        var dx0 = x0 + slide, dyS = y0, tf = Math.sqrt(2 * -dyS / G), r0 = dir * (4 + m * 2), spin = dir * (10 + m * 4);
        var e = Math.max(0.12, 0.34 - m * 0.09), vy = 0, dy = dyS, t = 0, last = 0, imp = 0, tLast = 0, sqA = 0;
        var sh = document.createElement("i"); sh.className = "kshadow";
        sh.style.cssText = "left:" + (it.tx + w * 0.05) + "px;top:" + (it.ty + h - 9) + "px;width:" + w * 0.9 + "px;height:18px;opacity:0";
        stage.appendChild(sh);
        function puff(x, side, sz) {
          var d = document.createElement("i"); d.className = "kdust";
          d.style.cssText = "left:" + x + "px;top:" + (it.ty + h - 6) + "px;width:" + sz + "px;height:" + sz + "px"; stage.appendChild(d);
          var a = d.animate([{ transform: "translate(-50%,-50%) scale(.4)", opacity: 0.75 },
            { transform: "translate(calc(-50% + " + side * (18 + Math.random() * 34) + "px),calc(-50% - " + (6 + Math.random() * 16) + "px)) scale(1.5)", opacity: 0 }], { duration: 450 + Math.random() * 250, easing: "ease-out" });
          a.onfinish = function () { d.remove(); };
        }
        function impact(vi, first) {
          sfxThud(m, Math.min(1, vi / 1900) * (first ? 1 : 0.55));
          if (!first) return;
          shake(1.5 + m * Math.min(1, vi / 1700) * 3.5); chain(vi);
          var n = 3 + Math.round(m * 2);
          for (var k = 0; k < n; k++) { var side = k % 2 ? 1 : -1; puff(cxT + side * w * (0.2 + Math.random() * 0.28), side, 9 + Math.random() * 7 * m); }
          if (m > 1.2) resWake();
        }
        /* 连锁反应：已经落地的邻居被震得跳一下、歪一歪；被重窗口压在下面的会裂开 */
        function chain(vi) {
          var wins = stage.querySelectorAll(".win.knocked"), pw = Math.min(1, vi / 1700);
          Array.prototype.forEach.call(wins, function (o) {
            if (o === el || o._air) return;
            var ow = o.offsetWidth, oh = o.offsetHeight, dxo = o.offsetLeft + ow / 2 - cxT, dyo = o.offsetTop + oh / 2 - cyT;
            var R = (w + ow) / 2 * 1.1 + 40, k = (1 - Math.hypot(dxo, dyo) / R) * m * pw;
            if (k < 0.08) return;
            var sg = dxo < 0 ? -1 : 1;
            try { o.animate([{ transform: "none" }, { transform: "translate(" + sg * k * 7 + "px," + -k * 9 + "px) rotate(" + sg * k * 2.2 + "deg)", offset: 0.3 }, { transform: "translate(" + -sg * k * 2 + "px," + k * 2 + "px) rotate(" + -sg * k * 0.8 + "deg)", offset: 0.65 }, { transform: "none" }], { duration: 420, easing: "ease-out" }); } catch (er) {}
            var ovx = (w + ow) / 2 - Math.abs(dxo), ovy = (h + oh) / 2 - Math.abs(dyo);
            if (m >= 1 && !o._crack && ovx > 0 && ovy > 0 && ovx * ovy > 0.2 * Math.min(w * h, ow * oh)) crack(o, dxo > 0, dyo > 0);
          });
        }
        function crack(o, left, top) {
          o._crack = true;
          var c = document.createElement("div"); c.className = "kcrack"; c.setAttribute("aria-hidden", "true");
          c.style.cssText = (left ? "left" : "right") + ":0;" + (top ? "top" : "bottom") + ":0;transform:scale(" + (left ? 1 : -1) + "," + (top ? 1 : -1) + ")";
          c.innerHTML = '<svg viewBox="0 0 40 40" width="100%" height="100%"><path d="M0 0 L14 9 L11 20 L26 28 L24 40 M14 9 L31 6 L40 11 M11 20 L3 33" fill="none" stroke="rgba(255,255,255,.8)" stroke-width="3.2" stroke-linejoin="round"/><path d="M0 0 L14 9 L11 20 L26 28 L24 40 M14 9 L31 6 L40 11 M11 20 L3 33" fill="none" stroke="rgba(60,45,75,.6)" stroke-width="1.4" stroke-linejoin="round"/></svg>';
          o.appendChild(c); sfxCrack();
        }
        function finish() {
          el.style.transform = ""; el.style.pointerEvents = ""; el.classList.add("knocked"); el.style.animation = "";
          sh.style.opacity = "0"; setTimeout(function () { sh.remove(); }, 350);
          el._air = false; me.flying--; it.land(); check();
        }
        function frame(ts) {
          if (!alive() || !el.isConnected) { sh.remove(); return; }
          var dt = last ? Math.min(0.034, (ts - last) / 1000) : 0.016; last = ts; t += dt;
          if (!(imp && dy === 0 && vy === 0)) {
            vy += G * dt; dy += vy * dt;
            if (dy >= 0 && vy > 0) {
              var vi = vy; dy = 0; imp++; tLast = t; sqA = Math.min(0.17, vi / 11000);
              impact(vi, imp === 1);
              vy = vi * e > 140 && imp < 4 ? -vi * e : 0;
            }
          }
          if (imp && dy === 0 && vy === 0 && t - tLast > 0.55) { finish(); return; }
          var fr = imp ? 1 : Math.max(0, Math.min(1, (dy - dyS) / -dyS)), p = Math.min(1, t / tf), tau = t - tLast;
          var dxn = imp ? 0 : dx0 * (1 - p), sc = S0 + (1 - S0) * fr;
          var r = imp ? dir * (1.5 + m * 1.2) * Math.exp(-tau * 5) * Math.sin(tau * 22) : r0 * (1 - fr) + spin * Math.sin(fr * Math.PI);
          var qy = imp ? 1 - sqA * Math.exp(-tau * 9) * (0.5 + 0.5 * Math.cos(tau * 26)) : 1;
          pose(dxn, dy, sc, r, 1 + (1 - qy) * 0.7, qy);
          var k = Math.min(1, -dy / -dyS); sh.style.opacity = (0.3 * (1 - 0.85 * k) * Math.min(1, 0.2 + fr * 1.2)).toFixed(3); sh.style.transform = "scale(" + (1 - 0.45 * k).toFixed(3) + ")";
          requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
      }
    }

    me.pump = function () {
      if (me.busy || !me.ready || !me.q.length || !alive()) return;
      me.busy = true;
      push(me.q.shift(), function () { me.busy = false; if (!alive()) return; me.done++; if (me.q.length) me.pump(); else check(); });
    };
    function check() {
      if (!alive() || me.busy || me.leaving || me.done < me.total || me.flying > 0) return;
      if (me.loop && me.round < 4) nextRound(); else leave();
    }
    /* 对方还在“再想想”：小猫把窗口一个个叼回桌上，再推一遍 */
    function nextRound() {
      me.round++; me.leaving = true; say("再想想？重来～", 900); sfxMeow("ask");
      setTimeout(function () {
        if (!alive()) return;
        var items = collect(); me.leaving = false;
        if (!items.length) { me.loop = false; leave(); return; }
        me.done = 0; me.total = items.length; me.q = items; me.pump();
      }, 900);
    }
    function leave() {
      me.leaving = true; box.setMood("happy"); sfxMeow("happy"); say("喵～", 900);
      setTimeout(function () {
        if (!alive()) return;
        var toLeft = cx < vw / 2, x1 = toLeft ? -cw - 40 : vw + 40, mid = (cx + x1) / 2;
        face(toLeft ? -1 : 1);
        cat.animate([{ transform: "translate(" + cx + "px,0)", offset: 0, easing: "ease-out" }, { transform: "translate(" + mid + "px," + (-3 * u) + "px)", offset: 0.4, easing: "ease-in" }, { transform: "translate(" + x1 + "px," + 9 * u + "px)", offset: 1 }], { duration: 650, fill: "forwards" });
        setTimeout(function () { if (alive()) table.classList.add("out"); }, 400);
        setTimeout(function () {
          if (!alive()) return;
          cat.remove(); table.remove(); me.finished = true;
          var ws = me.waiters; me.waiters = []; ws.forEach(function (fn) { fn(); });
        }, 1050);
      }, 700);
    }

    /* 开场：桌子从上面落下来，小猫从屏幕外一跃跳上桌子 */
    setTimeout(function () {
      if (!alive()) return;
      var fromLeft = Math.random() < 0.5, x1 = fromLeft ? 14 : vw - cw - 14;
      face(fromLeft ? 1 : -1); sfxMeow("short");
      leap(fromLeft ? -cw - 40 : vw + 40, x1, 8 * u, 0, function () {
        sfxThud(0.5, 0.4); hop.animate([{ transform: "scale(1.12,.86)" }, { transform: "none" }], { duration: 240, easing: "ease-out" });
        runProps(function () {
          if (opt.loop) { me.q = collect(); me.total = me.q.length; if (!me.q.length) { me.loop = false; me.ready = true; leave(); return; } }
          me.ready = true; me.pump();
        });
      });
    }, 450);
  }

  /* ---- 分享页签名：小猫举着写了落款的小牌子，走到屏幕中间坐好 ---- */
  function catSign() {
    if (!catOn() || !state.from || stage.querySelector(".signcat")) return;
    var tok = runTok, vw = stage.clientWidth, vh = stage.clientHeight, u = Math.max(4, Math.min(7, Math.round(vw / 70))), cw = 14 * u, ch = 12 * u;
    var wrap = document.createElement("div"); wrap.className = "signcat"; wrap.style.top = Math.max(80, vh - ch - 74) + "px"; wrap.style.setProperty("--st", Math.round(u * 1.8) + "px");
    var flip = document.createElement("div"), box = catBox(u, catCfg("c"), "open"); flip.appendChild(box);
    var bub = document.createElement("div"); bub.className = "cbub";
    var sign = document.createElement("div"); sign.className = "ssign";
    var sb = document.createElement("div"); sb.className = "sb";
    sb.innerHTML = (state.to ? '<small></small>' : "") + "<b></b>";
    if (state.to) sb.querySelector("small").textContent = "给 " + state.to;
    sb.querySelector("b").textContent = "—— " + state.from; sign.appendChild(sb);
    wrap.appendChild(flip); wrap.appendChild(sign); wrap.appendChild(bub);
    var fromLeft = Math.random() < 0.5, x0 = fromLeft ? -cw - 40 : vw + 40, x1 = (vw - cw) / 2;
    flip.style.transform = fromLeft ? "" : "scaleX(-1)"; sign.style.display = "none";
    wrap.style.transform = "translateX(" + x0 + "px)"; stage.appendChild(wrap);
    flip.className = "mc-bob"; sfxMeow("meow", 4);
    var a = wrap.animate([{ transform: "translateX(" + x0 + "px)" }, { transform: "translateX(" + x1 + "px)" }], { duration: Math.max(700, Math.abs(x1 - x0) / 0.4), easing: "ease-out", fill: "forwards" });
    a.onfinish = function () {
      if (tok !== runTok) return;
      wrap.style.transform = "translateX(" + x1 + "px)"; a.cancel();
      flip.className = ""; flip.style.transform = ""; box.setMood("happy"); sign.style.display = ""; sfxMeow("happy");
      bub.textContent = "喵～"; bub.classList.add("show"); setTimeout(function () { bub.classList.remove("show"); }, 1600);
      setTimeout(function () { if (tok === runTok) box.setMood("open"); }, 5000);
    };
  }

  /* ---- 拍立得合影 + 爱心蛋糕：点「愿意」之后、烟花之前 ---- */
  var partyAbort = null, micCtx = null;
  function mk(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function micUnlock() { /* 必须在点击「愿意」的那一下里创建，iOS 才允许之后用麦克风 */
    if (micCtx) return; var A = window.AudioContext || window.webkitAudioContext; if (!A) return;
    try { micCtx = new A(); if (micCtx.state === "suspended") micCtx.resume(); } catch (e) { micCtx = null; }
  }
  function micClose() { if (micCtx) { try { micCtx.close(); } catch (e) {} micCtx = null; } }
  function partyShell(cls, hintText) {
    var ov = mk("div", "party " + cls, '<div class="wg-hint"></div><button type="button" class="wg-skip">跳过</button>');
    ov.querySelector(".wg-hint").textContent = hintText;
    document.body.appendChild(ov); if (res) res.el.style.visibility = "hidden";
    return ov;
  }
  function partyClose(ov, done) {
    partyAbort = null; ov.classList.add("off");
    setTimeout(function () { ov.remove(); if (res) res.el.style.visibility = ""; done(); }, 420);
  }
  function svgImg(svg) { /* 把带 CSS 变量的像素 SVG 变成能画进 canvas 的图片 */
    return new Promise(function (ok) {
      var cs = getComputedStyle(root);
      var s = svg.replace(/var\((--[\w-]+)\)/g, function (m, n) { return (cs.getPropertyValue(n) || "").trim() || "#888"; })
        .replace("<svg ", '<svg xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges" ');
      var im = new Image(); im.onload = function () { ok(im); }; im.onerror = function () { ok(null); };
      im.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(s);
    });
  }
  function pinkHeart(px) { return sprite("heart", px, "--pet-a").replace(/var\(--pet-a\)/g, "#ff7fa6"); }
  function sfxShutter() {
    if (!soundOn || !AC) return; var t = AC.currentTime; tone(2200, t, 0.03, 0.07, "square"); tone(1100, t + 0.05, 0.06, 0.06, "square");
  }
  function sfxPuff() {
    if (!soundOn || !AC) return; var t = AC.currentTime, n = Math.floor(AC.sampleRate * 0.35), buf = AC.createBuffer(1, n, AC.sampleRate), d = buf.getChannelData(0);
    for (var i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 2) * 0.5;
    var s = AC.createBufferSource(), f = AC.createBiquadFilter(), g = AC.createGain(); s.buffer = buf; f.type = "bandpass"; f.frequency.value = 900; g.gain.value = 0.35;
    s.connect(f); f.connect(g); g.connect(master); s.start(t);
  }

  /* 画出那张合影：白边 + 小猫 + 手写字，存成 PNG */
  /* 读入真实合照（本机 blob 或云端地址）；失败返回 null，退回画小猫合影 */
  function loadRealPhoto() {
    var m = state.selfiePhoto, src = m && mediaSrc(m);
    if (!src) return Promise.resolve(null);
    return new Promise(function (ok) {
      var im = new Image(), t = setTimeout(function () { ok(null); }, 8000);
      if (src.indexOf("blob:") !== 0) im.crossOrigin = "anonymous"; /* 云端图画进 canvas 才不会污染，保存才不报错 */
      im.onload = function () { clearTimeout(t); ok(im.naturalWidth ? im : null); };
      im.onerror = function () { clearTimeout(t); ok(null); };
      im.src = src;
    });
  }
  function polaroidCanvas(real) {
    var S = 2, W = 720, pad = 36, pw = W - pad * 2, ph = 600, u = pw / 24;
    if (real) ph = Math.round(Math.max(pw / 1.5, Math.min(pw / 0.85, pw * real.naturalHeight / real.naturalWidth))); /* 照片比例：横 3:2 到竖 0.85 之间，超出的裁掉 */
    var H = pad + ph + 170, title = real ? "我们的合照" : "你们的小猫合影";
    var cv = document.createElement("canvas"); cv.width = W * S; cv.height = H * S;
    var x = cv.getContext("2d"); x.scale(S, S); x.imageSmoothingEnabled = false;
    var cs = getComputedStyle(root);
    function cvar(n, fb) { return (cs.getPropertyValue(n) || "").trim() || fb; }
    var fontP = document.fonts && document.fonts.load
      ? Promise.race([document.fonts.load('40px "Ma Shan Zheng"', "你们的小猫合影我们的合照"), new Promise(function (r) { setTimeout(r, 1200); })]).catch(function () {}) : Promise.resolve();
    return Promise.all([svgImg(catSvg(Math.round(u * S), catCfg("a"), "happy")), svgImg(pinkHeart(Math.round(u * 0.8 * S))), fontP]).then(function (r) {
      var catIm = r[0], hIm = r[1], gy = pad + ph * 0.86;
      x.fillStyle = "#fffdf8"; x.fillRect(0, 0, W, H);
      if (real) {
        x.save(); x.beginPath(); x.rect(pad, pad, pw, ph); x.clip(); x.imageSmoothingEnabled = true; x.imageSmoothingQuality = "high";
        var k = Math.max(pw / real.naturalWidth, ph / real.naturalHeight), dw = real.naturalWidth * k, dh = real.naturalHeight * k;
        x.drawImage(real, pad + (pw - dw) / 2, pad + (ph - dh) / 2, dw, dh); x.restore();
        x.strokeStyle = "rgba(0,0,0,.08)"; x.lineWidth = 2; x.strokeRect(pad, pad, pw, ph);
        return finishCaption();
      }
      x.save(); x.beginPath(); x.rect(pad, pad, pw, ph); x.clip();
      var g = x.createLinearGradient(pad, pad, pad + pw * 0.45, pad + ph);
      try { g.addColorStop(0, cvar("--bg-a", "#f7f3fb")); g.addColorStop(0.55, cvar("--bg-b", "#fbeef6")); g.addColorStop(1, cvar("--bg-c", "#eef4fb")); } catch (e) { g = "#f7f3fb"; }
      x.fillStyle = g; x.fillRect(pad, pad, pw, ph);
      x.fillStyle = "rgba(255,255,255,.42)"; x.fillRect(pad, gy, pw, ph); x.fillStyle = "rgba(0,0,0,.07)"; x.fillRect(pad, gy, pw, 2);
      x.textAlign = "center"; x.textBaseline = "middle";
      [[.18, .1, "✦", 30, "#ffd36b"], [.82, .08, "✦", 24, "#ffffff"], [.5, .12, "♥", 26, "#ff9fb8"], [.3, .3, "✦", 20, "#ffffff"], [.72, .34, "♥", 22, "#ffb3c7"], [.12, .55, "♥", 20, "#ffb3c7"], [.9, .6, "✦", 26, "#ffd36b"]].forEach(function (s) {
        x.font = s[3] + "px sans-serif"; x.fillStyle = s[4]; x.fillText(s[2], pad + pw * s[0], pad + ph * s[1]);
      });
      if (hIm) { var hw = hIm.width / S; x.drawImage(hIm, pad + pw * 0.07, pad + ph * 0.05, hw, hIm.height / S); x.drawImage(hIm, pad + pw * 0.93 - hw, pad + ph * 0.1, hw, hIm.height / S); }
      x.fillStyle = "rgba(40,30,60,.18)"; x.beginPath(); x.ellipse(pad + pw / 2, gy + 4, 7 * u, 1.2 * u, 0, 0, 6.2832); x.fill();
      if (catIm) x.drawImage(catIm, pad + (pw - 14 * u) / 2, gy - 12 * u, catIm.width / S, catIm.height / S);
      x.restore();
      x.strokeStyle = "rgba(0,0,0,.08)"; x.lineWidth = 2; x.strokeRect(pad, pad, pw, ph);
      return finishCaption();
      function finishCaption() {
      var FF = '"Ma Shan Zheng","ZCOOL KuaiLe","Kaiti SC",STKaiti,KaiTi,cursive', d = new Date(), pz = function (n) { return (n < 10 ? "0" : "") + n; };
      var names = state.to && state.from ? state.from + " ♥ " + state.to : (state.from || state.to);
      var sub = [names, state.cat && state.cat.name, d.getFullYear() + "." + pz(d.getMonth() + 1) + "." + pz(d.getDate())].filter(Boolean).join(" · ");
      x.textAlign = "center"; x.textBaseline = "alphabetic"; x.fillStyle = "#3b3550"; x.font = "64px " + FF; x.fillText(title, W / 2, pad + ph + 80);
      var fs = 28; x.font = fs + "px " + FF; while (x.measureText(sub).width > pw - 20 && fs > 16) { fs -= 2; x.font = fs + "px " + FF; }
      x.fillStyle = "#8a7a8f"; x.fillText(sub, W / 2, pad + ph + 130);
      return cv;
      }
    });
  }

  /* ---- 拍立得合影：小猫和相框一起出现，倒数三秒，咔嚓 ---- */
  function selfieGame(done) {
    var vw = window.innerWidth, vh = window.innerHeight, ended = false, finished = false, tms = [], shotCv = null, realP = loadRealPhoto(), isReal = false;
    var fw = Math.max(200, Math.round(Math.min(320, vw * 0.78, (vh - 200) / 1.12))), P = fw * 0.9, PH = fw * 0.833, u = P / 24, gy = PH * 0.86;
    var ov = partyShell("selfie", "小猫要和你们合影啦 📸");
    var hint = ov.querySelector(".wg-hint"), skip = ov.querySelector(".wg-skip");
    var frame = mk("div", "sf-frame", '<div class="sf-photo"><div class="sf-ground"></div><div class="sf-count"></div></div><div class="sf-cap"></div>');
    frame.style.setProperty("--fw", fw + "px");
    var photo = frame.querySelector(".sf-photo"), count = frame.querySelector(".sf-count");
    frame.querySelector(".sf-ground").style.top = gy + "px";
    var hw = 7 * u * 0.8;
    var hl = mk("div", "sf-heart", pinkHeart(u * 0.8)), hr = mk("div", "sf-heart", pinkHeart(u * 0.8));
    hl.style.cssText = "left:" + P * 0.07 + "px;top:" + PH * 0.05 + "px"; hr.style.cssText = "left:" + (P * 0.93 - hw) + "px;top:" + PH * 0.1 + "px";
    var catW = mk("div", "sf-cat"), bob = mk("div", "mc-bob"), box = catBox(u, catCfg("a"), "open");
    bob.appendChild(box); catW.appendChild(bob);
    catW.style.cssText = "left:" + (P - 14 * u) / 2 + "px;top:" + (gy - 12 * u) + "px;transform:translateX(" + (-P) + "px)";
    photo.appendChild(hl); photo.appendChild(hr); photo.appendChild(catW);
    var btns = mk("div", "sf-btns", '<button type="button" class="sf-b save">保存图片</button><button type="button" class="sf-b go">继续 ▶</button>'); btns.style.visibility = "hidden";
    var tip = mk("p", "sf-tip", "手机上也可以长按照片保存"); tip.style.visibility = "hidden";
    ov.appendChild(frame); ov.appendChild(btns); ov.appendChild(tip);
    function after(ms, fn) { tms.push(setTimeout(function () { if (!ended) fn(); }, ms)); }
    function finish() {
      if (finished) return; finished = true; ended = true; tms.forEach(clearTimeout); partyClose(ov, done);
    }
    partyAbort = function () { if (finished) return; finished = true; ended = true; tms.forEach(clearTimeout); partyAbort = null; ov.remove(); if (res) res.el.style.visibility = ""; };
    skip.addEventListener("click", function (e) { e.stopPropagation(); finish(); });
    btns.querySelector(".go").addEventListener("click", finish);
    btns.querySelector(".save").addEventListener("click", function () {
      if (!shotCv) return;
      shotCv.toBlob(function (b) {
        if (!b) { showToast("保存失败了，试试长按照片", false); return; }
        var f = null; try { f = new File([b], "kitty-photo.png", { type: "image/png" }); } catch (e) {}
        var touch = window.matchMedia && matchMedia("(pointer: coarse)").matches;
        if (touch && f && navigator.canShare && navigator.share && navigator.canShare({ files: [f] })) { navigator.share({ files: [f], title: isReal ? "我们的合照" : "你们的小猫合影" }).catch(function () {}); return; }
        var a = document.createElement("a"), link = URL.createObjectURL(b); a.href = link; a.download = "kitty-photo.png"; document.body.appendChild(a); a.click(); a.remove();
        setTimeout(function () { URL.revokeObjectURL(link); }, 4000); showToast("已保存图片", false);
      }, "image/png");
    });
    var a0 = frame.animate([{ transform: "translateY(" + -vh + "px) rotate(-9deg)" }, { transform: "translateY(0) rotate(-1.5deg)" }], { duration: 750, easing: "cubic-bezier(.25,1.25,.45,1)", fill: "forwards" });
    a0.onfinish = function () { if (ended) return; frame.style.transform = "rotate(-1.5deg)"; a0.cancel(); };
    function tick(n) { count.textContent = n; count.classList.remove("pop"); void count.offsetWidth; count.classList.add("pop"); }
    after(800, function () {
      sfxMeow("ask");
      var a = catW.animate([{ transform: "translateX(" + (-P) + "px)" }, { transform: "translateX(0)" }], { duration: 750, easing: "ease-out", fill: "forwards" });
      a.onfinish = function () { if (ended) return; catW.style.transform = ""; a.cancel(); bob.className = ""; };
    });
    after(1750, function () { hint.textContent = "看这边～笑一个"; tick(3); });
    after(2450, function () { tick(2); });
    after(3150, function () { tick(1); box.setMood("wide"); });
    after(3850, function () {
      count.textContent = ""; skip.style.display = "none"; sfxShutter(); sfxMeow("happy"); box.setMood("happy"); hint.textContent = "咔嚓！";
      var fl = mk("div", "sf-flash"); ov.appendChild(fl); setTimeout(function () { fl.remove(); }, 600);
      var t0 = Date.now();
      realP.then(function (real) { isReal = !!real; return polaroidCanvas(real); }).then(function (cv) {
        if (ended) return; shotCv = cv; var url = cv.toDataURL("image/png");
        after(Math.max(500, 1100 - (Date.now() - t0)), function () {
          frame.style.height = frame.offsetHeight + "px"; frame.classList.add("done"); frame.innerHTML = "";
          var img = new Image(); img.alt = isReal ? "我们的合照" : "你们的小猫合影"; img.className = "sf-img"; img.src = url; frame.appendChild(img);
          hint.textContent = isReal ? "拍好啦：我们的合照 💗" : "拍好啦：你们的小猫合影 💗"; btns.style.visibility = ""; tip.style.visibility = "";
        });
      }).catch(function () { hint.textContent = "照片没洗出来……"; after(1200, finish); });
    });
  }

  /* ---- 爱心蛋糕：小猫把蛋糕推下桌，蜡烛亮起，吹一口气（麦克风）或点一下才放烟花 ---- */
  function cakeSvg(px) {
    var R = [], L = "var(--pet-line)", oy = 3;
    function r(x, y, w, h, f) { R.push('<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + f + '"/>'); }
    r(2, oy + 3, 11, 5, L); r(0, oy + 7, 15, 5, L);
    r(3, oy + 4, 9, 4, "#f6d8a8"); r(1, oy + 8, 13, 3, "#ffb3c7");
    r(3, oy + 4, 9, 1, "#fffaf4"); [4, 7, 10].forEach(function (x) { r(x, oy + 5, 1, 1, "#fffaf4"); });
    r(1, oy + 8, 13, 1, "#fffaf4"); [2, 5, 9, 12].forEach(function (x) { r(x, oy + 9, 1, 1, "#fffaf4"); });
    r(3, oy + 10, 1, 1, "#ffd36b"); r(7, oy + 10, 1, 1, "#ffffff"); r(11, oy + 10, 1, 1, "#9be7ff"); r(9, oy + 10, 1, 1, "#e5484d");
    r(0, oy + 11, 15, 1, "#e6e0ee"); r(1, oy + 12, 13, 1, "#b9b2c6");
    [[5, "#7ec8ff"], [7, "#ffd36b"], [9, "#ff9fc0"]].forEach(function (c) { r(c[0], oy, 1, 3, c[1]); r(c[0], oy, 1, 1, L); });
    return '<svg width="' + 15 * px + '" height="' + 16 * px + '" viewBox="0 0 15 16" aria-hidden="true">' + R.join("") + "</svg>";
  }
  /* 听“吹气”：音量持续超过环境音一阵就算吹了；没有麦克风 / 没授权就走 onFail，改成点一下 */
  function listenBlow(cb) {
    var stopped = false, stream = null, raf = 0;
    function stop() { if (stopped) return; stopped = true; cancelAnimationFrame(raf); try { stream && stream.getTracks().forEach(function (t) { t.stop(); }); } catch (e) {} micClose(); }
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !(window.AudioContext || window.webkitAudioContext)) { setTimeout(function () { if (!stopped) cb.fail(); }, 0); return stop; }
    navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } }).then(function (s) {
      if (stopped) { s.getTracks().forEach(function (t) { t.stop(); }); return; }
      stream = s; micUnlock(); if (!micCtx) { stop(); cb.fail(); return; } if (micCtx.resume) micCtx.resume();
      var src = micCtx.createMediaStreamSource(s), an = micCtx.createAnalyser(); an.fftSize = 1024; src.connect(an);
      var buf = new Uint8Array(an.fftSize), t0 = performance.now(), last = t0, floor = -1, above = 0; cb.ready();
      (function loop(now) {
        if (stopped) return; raf = requestAnimationFrame(loop);
        an.getByteTimeDomainData(buf); var sum = 0; for (var i = 0; i < buf.length; i++) { var v = (buf[i] - 128) / 128; sum += v * v; }
        var rms = Math.sqrt(sum / buf.length), dt = now - last; last = now;
        if (floor < 0 || rms < floor) floor = rms; else floor += (rms - floor) * 0.002; /* 环境底噪：往下立刻跟，往上慢慢跟，说话 / 吹气不会把它抬高 */
        if (now - t0 < 400) return;
        var b = floor, thr = Math.max(0.07, b * 3.2);
        cb.level(Math.max(0, Math.min(1, (rms - b) / (thr - b + 1e-4))));
        above = rms > thr ? above + dt : Math.max(0, above - dt * 2);
        if (above >= 250) { stop(); cb.blow(); }
      })(performance.now());
    }, function () { if (!stopped) { stop(); cb.fail(); } });
    return stop;
  }
  function cakeGame(done) {
    var vw = window.innerWidth, vh = window.innerHeight, ended = false, finished = false, blown = false, lit = false, tms = [], stopMic = null, wishing = false, wished = false, endWish = function () {};
    var u = Math.max(5, Math.min(8, Math.round(vw / 60))), cu = Math.max(5, Math.min(9, Math.round(vw / 48)));
    var catWd = 14 * u, catH = 12 * u, cakeW = 15 * cu, cakeH = 16 * cu;
    var plankY = Math.round(vh * 0.32), edgeX = Math.round(vw * 0.72), groundY = Math.round(vh * 0.8);
    var left0 = edgeX - cakeW - cu * 3, left1 = edgeX - cu * 7, dx1 = left1 - left0, catX0 = Math.max(4, left0 - catWd + u * 2);
    var fx = dx1 + cu * 2 + 3, fLeft = left0 + fx, dy = groundY - plankY, catGX = Math.max(4, fLeft - catWd - u);
    var ov = partyShell("cake", "桌子上有一个蛋糕……");
    var hint = ov.querySelector(".wg-hint"), skip = ov.querySelector(".wg-skip");
    var plank = mk("div", "ck-plank"); plank.style.cssText = "top:" + plankY + "px;width:" + edgeX + "px";
    var shadow = mk("div", "ck-shadow"); shadow.style.cssText = "left:" + (fLeft - cu) + "px;top:" + (groundY - 5) + "px;width:" + (cakeW + 2 * cu) + "px";
    var cake = mk("div", "ck-cake"); cake.style.cssText = "left:" + left0 + "px;top:" + (plankY - cakeH) + "px;width:" + cakeW + "px;height:" + cakeH + "px;transform-origin:" + cu * 7 + "px 100%";
    var inner = mk("div", "ck-in", cakeSvg(cu)), flames = [];
    [5.5, 7.5, 9.5].forEach(function (cx) {
      var f = mk("div", "ck-flame", "<i></i>"); f.style.cssText = "left:" + (cx - 0.65) * cu + "px;top:" + 0.7 * cu + "px;width:" + 1.3 * cu + "px;height:" + 2.2 * cu + "px"; inner.appendChild(f); flames.push(f);
    });
    cake.appendChild(inner);
    var cat = mk("div", "ck-cat"), flip = mk("div", "mc-bob"), cb = catBox(u, catCfg("a"), "open"), bub = mk("div", "cbub");
    flip.appendChild(cb); cat.appendChild(flip); cat.appendChild(bub);
    cat.style.cssText = "left:0;top:" + (plankY - catH) + "px;transform:translateX(" + (-catWd - 24) + "px)";
    ov.appendChild(plank); ov.appendChild(shadow); ov.appendChild(cake); ov.appendChild(cat);
    function after(ms, fn) { tms.push(setTimeout(function () { if (!ended) fn(); }, ms)); }
    function tr(x, y, r) { return "translate(" + x + "px," + y + "px)" + (r ? " rotate(" + r + "deg)" : ""); }
    function go(elm, frames, opt, next) {
      var a = elm.animate(frames, opt);
      a.onfinish = function () { if (ended) return; elm.style.transform = frames[frames.length - 1].transform; a.cancel(); if (next) next(); };
    }
    function say(t, ms) { bub.textContent = t; bub.classList.add("show"); setTimeout(function () { bub.classList.remove("show"); }, ms || 900); }
    function finish() {
      if (finished) return; finished = true; ended = true; tms.forEach(clearTimeout); if (stopMic) stopMic(); micClose(); partyClose(ov, done);
    }
    partyAbort = function () { if (finished) return; finished = true; ended = true; tms.forEach(clearTimeout); if (stopMic) stopMic(); micClose(); partyAbort = null; ov.remove(); if (res) res.el.style.visibility = ""; };
    skip.addEventListener("click", function (e) { e.stopPropagation(); if (wishing) { endWish(false); return; } finish(); });

    function smoke(f) {
      var s = mk("div", "ck-smoke"); s.style.cssText = "left:" + (parseFloat(f.style.left) + 0.2 * cu) + "px;top:" + 0.3 * cu + "px;width:" + cu + "px;height:" + cu + "px"; inner.appendChild(s);
      s.animate([{ transform: "translateY(0) scale(.6)", opacity: 0.8 }, { transform: "translateY(" + -3.5 * cu + "px) scale(1.8)", opacity: 0 }], { duration: 1100, easing: "ease-out" }).onfinish = function () { s.remove(); };
    }
    function blowOut() {
      if (blown || ended) return; blown = true; if (stopMic) stopMic(); micClose();
      hint.textContent = "呼——"; sfxPuff(); cb.setMood("happy"); sfxMeow("happy"); say("喵～💗", 1600);
      flames.forEach(function (f, i) { after(i * 140, function () { f.style.transform = ""; f.classList.remove("on"); smoke(f); }); });
      after(900, function () { hint.textContent = "愿望一定会实现 ✨"; sfxDing(4); sfxDing(2); });
      after(2000, finish);
    }
    function askBlow() {
      lit = true; skip.textContent = "直接放烟花";
      hint.textContent = wished ? "愿望收好啦～点一下屏幕，或对着手机吹一口气，把蜡烛吹灭" : "闭上眼睛许个愿，然后点一下屏幕，或对着手机吹一口气";
      ov.classList.add("ask"); ov.addEventListener("click", function (e) { if (e.target !== skip) blowOut(); });
      after(1600, function () {
        if (blown) return; hint.textContent = "吹气需要开麦克风；不想开就直接点一下屏幕";
        stopMic = listenBlow({
          ready: function () { if (!blown) hint.textContent = "对着手机吹一口气 💨（也可以点一下屏幕）"; },
          level: function (l) { flames.forEach(function (f, i) { f.style.transform = "skewX(" + (-l * (16 + i * 3)) + "deg) scaleY(" + (1 - l * 0.3) + ")"; }); },
          blow: blowOut,
          fail: function () { if (!blown) hint.textContent = "点一下屏幕，把蜡烛吹灭 🕯️"; }
        });
      });
    }
    /* ---- 哈气许愿：屏幕蒙上水汽，用手指在雾上写下愿望；写完雾气把愿望收走，才轮到吹蜡烛 ---- */
    function paintFog(x, W, H, d) {
      var gr = x.createLinearGradient(0, 0, 0, H), i, r, cx, cy, rg;
      gr.addColorStop(0, "rgba(228,238,250,.62)"); gr.addColorStop(1, "rgba(196,212,234,.5)");
      x.fillStyle = gr; x.fillRect(0, 0, W, H);
      for (i = 0; i < 60; i++) { /* 一团一团的雾 */
        r = (40 + Math.random() * 120) * d; cx = Math.random() * W; cy = Math.random() * H;
        rg = x.createRadialGradient(cx, cy, 0, cx, cy, r); rg.addColorStop(0, "rgba(255,255,255,.16)"); rg.addColorStop(1, "rgba(255,255,255,0)");
        x.fillStyle = rg; x.fillRect(cx - r, cy - r, 2 * r, 2 * r);
      }
      for (i = 0; i < 240; i++) { /* 细小的水珠 */
        cx = Math.random() * W; cy = Math.random() * H; r = (0.8 + Math.random() * 2.2) * d;
        x.fillStyle = "rgba(255,255,255," + (0.14 + Math.random() * 0.24) + ")"; x.beginPath(); x.arc(cx, cy, r, 0, 6.2832); x.fill();
        x.fillStyle = "rgba(110,140,185,.2)"; x.beginPath(); x.arc(cx + r * 0.3, cy + r * 0.4, r * 0.55, 0, 6.2832); x.fill();
      }
    }
    function wishPhase() {
      var cv0 = document.createElement("canvas");
      if (!state.wish || !cv0.getContext || !cv0.getContext("2d")) { askBlow(); return; }
      wishing = true; ov.classList.add("wishing"); skip.textContent = "跳过许愿"; hint.textContent = "对着屏幕哈一口气……"; sfxPuff();
      var dpr = Math.min(2, window.devicePixelRatio || 1), W = Math.round(vw * dpr), H = Math.round(vh * dpr);
      var cv = mk("canvas", "ck-fog"); cv.width = W; cv.height = H; var g = cv.getContext("2d");
      var fogCv = document.createElement("canvas"); fogCv.width = W; fogCv.height = H; paintFog(fogCv.getContext("2d"), W, H, dpr);
      g.drawImage(fogCv, 0, 0); cv.style.opacity = "0"; ov.appendChild(cv);
      var btns = mk("div", "ck-wbtns", '<button type="button" class="sf-b ck-wre">重写</button><button type="button" class="sf-b save ck-wok" disabled>许好了 ✨</button>');
      btns.style.visibility = "hidden"; ov.appendChild(btns);
      var re = btns.querySelector(".ck-wre"), ok = btns.querySelector(".ck-wok");
      var ready = false, sealing = false, drawing = false, started = false, lx = 0, ly = 0, ink = 0, drips = [], raf = 0, bw = Math.max(13, Math.min(26, vw * 0.045)) * dpr;
      requestAnimationFrame(function () { requestAnimationFrame(function () { cv.style.opacity = "1"; }); });
      after(1700, function () { ready = true; btns.style.visibility = ""; hint.textContent = "屏幕起雾了，用手指在雾上写下你的愿望 ✍️"; });

      endWish = function (sealed) {
        if (!wishing) return; wishing = false; sealing = false; wished = !!sealed; drips = [];
        if (raf) cancelAnimationFrame(raf); raf = 0; cv.remove(); btns.remove(); ov.classList.remove("wishing"); endWish = function () {};
        if (!ended) askBlow();
      };
      function pt(e) { var r = cv.getBoundingClientRect(); return [(e.clientX - r.left) * W / r.width, (e.clientY - r.top) * H / r.height]; }
      var wishPts = [], wsId = 0;
      function recWish(px, py) { /* 记下笔迹采样点（相对屏幕的比例），之后在烟花里变成星星 */
        var cx = px / dpr, cy = py / dpr, lp = wishPts[wishPts.length - 1];
        if (lp && lp.s === wsId && Math.abs(lp.x * vw - cx) + Math.abs(lp.y * vh - cy) < Math.max(9, bw / dpr * 0.7)) return;
        if (wishPts.length < 700) wishPts.push({ x: cx / vw, y: cy / vh, s: wsId });
      }
      function wipe(x0, y0, x1, y1) { /* 手指划过的地方，雾被擦开 */
        recWish(x1, y1);
        g.globalCompositeOperation = "destination-out"; g.lineCap = "round"; g.lineJoin = "round"; g.strokeStyle = "#000"; g.lineWidth = bw;
        g.shadowColor = "#000"; g.shadowBlur = bw * 0.45; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1 + 0.01, y1); g.stroke(); g.shadowBlur = 0;
        g.globalCompositeOperation = "source-over";
      }
      function dripLoop() { /* 擦开的地方偶尔会淌下一道水痕 */
        raf = 0; if (ended || !wishing) return;
        g.globalCompositeOperation = "destination-out"; g.fillStyle = "#000";
        drips = drips.filter(function (d) {
          g.beginPath(); g.arc(d.x, d.y, 1.7 * dpr, 0, 6.2832); g.fill(); d.y += d.v; d.len -= d.v; return d.len > 0 && d.y < H;
        });
        g.globalCompositeOperation = "source-over";
        if (drips.length) raf = requestAnimationFrame(dripLoop);
      }
      cv.addEventListener("pointerdown", function (e) {
        if (!ready || sealing) return; e.preventDefault(); drawing = true; try { cv.setPointerCapture(e.pointerId); } catch (x) {}
        var p = pt(e); lx = p[0]; ly = p[1]; wsId++; wipe(lx, ly, lx, ly);
        if (!started) { started = true; hint.textContent = "写下你的心愿……写完点「许好了」"; }
      });
      cv.addEventListener("pointermove", function (e) {
        if (!drawing || sealing) return; e.preventDefault(); var p = pt(e); wipe(lx, ly, p[0], p[1]);
        ink += Math.sqrt((p[0] - lx) * (p[0] - lx) + (p[1] - ly) * (p[1] - ly)) / dpr; lx = p[0]; ly = p[1];
        if (ink > 160) ok.disabled = false;
        if (ink > 90 && drips.length < 9 && Math.random() < 0.02) { drips.push({ x: lx, y: ly + bw * 0.4, v: (0.9 + Math.random() * 0.9) * dpr, len: (50 + Math.random() * 90) * dpr }); if (!raf) raf = requestAnimationFrame(dripLoop); }
      });
      function up() { drawing = false; }
      cv.addEventListener("pointerup", up); cv.addEventListener("pointercancel", up);
      re.addEventListener("click", function (e) {
        e.stopPropagation(); if (sealing) return; drips = []; g.globalCompositeOperation = "source-over"; g.drawImage(fogCv, 0, 0); ink = 0; wishPts = []; ok.disabled = true; sfxPuff(); hint.textContent = "雾又蒙上了，重新写吧";
      });
      ok.addEventListener("click", function (e) {
        e.stopPropagation(); if (sealing || ok.disabled) return; sealing = true; drawing = false; drips = []; wishStars = wishPts.slice(); btns.style.visibility = "hidden"; skip.style.visibility = "hidden";
        hint.textContent = "雾气把愿望悄悄收走了 ✨"; sfxDing(4); sfxDing(2); cb.setMood("happy"); say("喵～", 1200);
        var t0 = Date.now();
        (function condense() {
          if (ended || !wishing) return;
          g.globalCompositeOperation = "source-over"; g.globalAlpha = 0.05; g.drawImage(fogCv, 0, 0); g.globalAlpha = 1;
          if (Date.now() - t0 < 2200) { raf = requestAnimationFrame(condense); return; }
          raf = 0; cv.style.transition = "opacity 1.1s ease-in"; cv.style.opacity = "0";
          after(1200, function () { skip.style.visibility = ""; endWish(true); });
        })();
      });
    }
    function lightUp() {
      ov.classList.add("lit"); hint.textContent = "蜡烛亮起来了 🕯️"; cb.setMood("up", "#ffd36b");
      flames.forEach(function (f, i) { after(i * 380, function () { f.classList.add("on"); if (soundOn && AC) tone(880 + i * 220, AC.currentTime, 0.1, 0.05, "triangle"); }); });
      after(1500, wishPhase);
    }
    function impact() {
      sfxThud(3, 1); shadow.classList.add("on");
      ov.animate([{ transform: "translateY(0)" }, { transform: "translateY(7px)" }, { transform: "translateY(-5px)" }, { transform: "translateY(2px)" }, { transform: "translateY(0)" }], { duration: 320 });
      inner.animate([{ transform: "scale(1.28,.76)" }, { transform: "scale(.93,1.08)" }, { transform: "scale(1,1)" }], { duration: 400 });
      for (var i = 0; i < 7; i++) (function (i) {
        var d = mk("div", "ck-dust"), s = cu * (0.6 + Math.random() * 0.8), dir = i % 2 ? 1 : -1;
        d.style.cssText = "left:" + (fLeft + cakeW / 2 + dir * cakeW * 0.3) + "px;top:" + (groundY - s) + "px;width:" + s + "px;height:" + s + "px"; ov.appendChild(d);
        d.animate([{ transform: "translate(0,0) scale(.6)", opacity: 0.7 }, { transform: "translate(" + dir * (cakeW * 0.4 + Math.random() * cakeW * 0.4) + "px," + -cu * (1 + Math.random() * 2) + "px) scale(1.6)", opacity: 0 }], { duration: 700 + Math.random() * 300, easing: "ease-out" }).onfinish = function () { d.remove(); };
      })(i);
    }
    function jumpDown() {
      cb.setMood("open"); sfxMeow("short"); var xf = catX0 + dx1;
      go(cat, [{ transform: tr(xf, 0), easing: "ease-out" }, { transform: tr((xf + catGX) / 2, -u * 5), offset: 0.4, easing: "ease-in" }, { transform: tr(catGX, dy) }], { duration: 650 }, function () { sfxThud(1, 0.6); after(300, lightUp); });
    }
    function fall() {
      var T = dx1 + 4, H = Math.round(cakeH * 0.22);
      hint.textContent = "啊，掉下去了！"; cb.setMood("wide");
      go(cake, [
        { transform: tr(T, 0, 24), easing: "cubic-bezier(.5,0,.9,.55)" },
        { transform: tr(fx, dy, -6), offset: 0.7, easing: "ease-out" },
        { transform: tr(fx, dy - H, 3), offset: 0.82, easing: "ease-in" },
        { transform: tr(fx, dy, 0), offset: 0.92, easing: "ease-out" },
        { transform: tr(fx, dy - Math.round(H * 0.3), 0), offset: 0.96, easing: "ease-in" },
        { transform: tr(fx, dy, 0) }
      ], { duration: 1300 }, function () { say("咦？", 700); after(500, jumpDown); });
      after(910, impact);
    }
    function push() {
      hint.textContent = "小猫伸出了爪子……"; cb.setMood("wide"); say("嘿咻…", 900); sfxMeow("short", 2); flip.className = "mc-bob";
      after(550, function () {
        go(cat, [{ transform: tr(catX0, 0) }, { transform: tr(catX0 + dx1, 0) }], { duration: 900, easing: "ease-in-out" });
        go(cake, [{ transform: tr(0, 0) }, { transform: tr(dx1, 0) }], { duration: 900, easing: "ease-in-out" }, function () {
          flip.className = ""; go(cake, [{ transform: tr(dx1, 0, 0) }, { transform: tr(dx1 + 4, 0, 24) }], { duration: 300, easing: "ease-in" }, fall);
        });
      });
    }
    after(500, function () {
      go(cat, [{ transform: tr(-catWd - 24, 0) }, { transform: tr(catX0, 0) }], { duration: 1000, easing: "ease-out" }, function () { flip.className = ""; cb.setMood("open"); say("喵？", 700); after(900, push); });
    });
  }

  /* 点「愿意」之后：先合影，再推蛋糕；都结束了才放烟花 */
  function partyRun(done) {
    var steps = [];
    if (catOn() && state.selfie) steps.push(selfieGame);
    if (catOn() && state.cake) { steps.push(cakeGame); micUnlock(); }
    if (!steps.length) { done(); return; }
    var tok = runTok;
    setTimeout(function () { (function next(k) { if (tok !== runTok) return; if (k >= steps.length) { done(); return; } steps[k](function () { next(k + 1); }); })(0); }, 700);
  }

  /* ---- 压轴烟花：窗口炸成烟花，再聚成那句话和一颗心 ---- */
  var fwOn = false, wishStars = null; /* wishStars：许愿时写在雾上的笔迹，只放在内存里，烟花用完就丢 */
  function sfxBoom() {
    if (!soundOn || !AC) return;
    var t = AC.currentTime; tone(90, t, 0.4, 0.12, "sine"); tone(1800 + Math.random() * 900, t, 0.1, 0.03, "square");
  }
  function fwTargets(text, vw, vh) {
    var c = document.createElement("canvas"); c.width = vw; c.height = vh; var g = c.getContext("2d");
    var ch = Array.from(text), mc = Math.max(6, Math.min(12, Math.floor((vw - 40) / 40))), lines = Math.ceil(ch.length / mc), per = Math.ceil(ch.length / lines);
    var fs = Math.min(64, (vw - 40) / per * 0.95, vh * 0.1);
    g.fillStyle = "#fff"; g.textAlign = "center"; g.textBaseline = "middle"; g.font = "bold " + fs + 'px "ZCOOL KuaiLe","Noto Sans SC","PingFang SC",sans-serif';
    for (var l = 0; l < lines; l++) g.fillText(ch.slice(l * per, (l + 1) * per).join(""), vw / 2, vh * 0.62 + (l - (lines - 1) / 2) * fs * 1.3);
    var data = g.getImageData(0, 0, vw, vh).data, step = Math.max(3, Math.round(fs / 12)), pts = [];
    for (;;) {
      pts = [];
      for (var y = 0; y < vh; y += step) for (var x = 0; x < vw; x += step) if (data[(y * vw + x) * 4 + 3] > 128) pts.push({ x: x, y: y, c: "#fff3d6" });
      if (pts.length <= 1600) break; step++;
    }
    var R = Math.min(vw * 0.32, vh * 0.2), cx = vw / 2, cy = vh * 0.27;
    [1, 0.62].forEach(function (k, ring) {
      for (var i = 0; i < 130; i++) {
        var t = i / 130 * 6.2832;
        pts.push({ x: cx + 16 * Math.pow(Math.sin(t), 3) * R / 16 * k, y: cy - (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * R / 16 * k, c: ring ? "#ffd1dc" : "#ff6f91" });
      }
    });
    return pts;
  }
  function showMemoryWall(photos, onDone) {
    if (!photos || !photos.length) { if (onDone) onDone(); return; }
    var wall = document.createElement("section"); wall.className = "memory-wall";
    wall.setAttribute("aria-label", "回忆照片墙");
    wall.innerHTML = '<div class="mw-head"><span class="mw-kicker">OUR LITTLE MEMORIES</span><h2>把我们的回忆，挂起来 ♡</h2><p>每一张照片，都是想珍藏的瞬间</p></div><div class="mw-scene"><div class="mw-rope"></div><div class="mw-cat"></div><div class="mw-track" role="region" aria-label="左右滑动浏览照片" tabindex="0"></div></div><button class="mw-done" type="button">收藏好啦 ♥</button><div class="mw-tip">← 左右滑动，看看我们的回忆 →</div>';
    document.body.appendChild(wall);
    var track = wall.querySelector(".mw-track"), catHost = wall.querySelector(".mw-cat");
    try { var cat = catBox(Math.max(4, Math.min(6, Math.round(window.innerWidth / 90))), catCfg("c"), "happy", "#ffd36b"); catHost.appendChild(cat); } catch (e) { catHost.textContent = "🐱"; }
    photos.forEach(function (photo, i) {
      var card = document.createElement("figure"); card.className = "mw-photo"; card.style.setProperty("--tilt", (((i % 5) - 2) * 1.8) + "deg");
      var clip = document.createElement("span"); clip.className = "mw-clip"; clip.setAttribute("aria-hidden", "true");
      var img = document.createElement("img"); img.src = photo.src; img.alt = photo.caption || "回忆照片"; img.loading = "eager"; img.draggable = false;
      var cap = document.createElement("figcaption"); cap.textContent = photo.caption || "♡";
      card.appendChild(clip); card.appendChild(img); card.appendChild(cap); track.appendChild(card);
    });
    /* 触屏原生横向滚动；鼠标按住拖动，避免影响照片点击 */
    var down = false, startX = 0, startScroll = 0, moved = false;
    track.addEventListener("pointerdown", function (e) { if (e.pointerType === "mouse") { down = true; moved = false; startX = e.clientX; startScroll = track.scrollLeft; track.classList.add("dragging"); track.setPointerCapture(e.pointerId); } });
    track.addEventListener("pointermove", function (e) { if (!down) return; var dx = e.clientX - startX; if (Math.abs(dx) > 3) moved = true; track.scrollLeft = startScroll - dx; });
    function stopDrag() { down = false; track.classList.remove("dragging"); }
    track.addEventListener("pointerup", stopDrag); track.addEventListener("pointercancel", stopDrag); track.addEventListener("lostpointercapture", stopDrag);
    wall.querySelector(".mw-done").addEventListener("click", function () {
      wall.classList.add("mw-leave"); setTimeout(function () { wall.remove(); if (onDone) onDone(); }, 650);
    });
    requestAnimationFrame(function () { wall.classList.add("mw-show"); });
  }

  /* ---- 愿望变星星：许愿时写在雾上的笔迹，在烟花里飞上夜空，连成一小片星座，再散成满天星 ---- */
  var glowCv = null;
  function glowSprite() {
    if (glowCv) return glowCv;
    var c = document.createElement("canvas"); c.width = c.height = 48;
    var g = c.getContext("2d"), r = g.createRadialGradient(24, 24, 0, 24, 24, 24);
    r.addColorStop(0, "rgba(255,243,214,1)"); r.addColorStop(0.25, "rgba(255,226,160,.55)"); r.addColorStop(1, "rgba(255,226,160,0)");
    g.fillStyle = r; g.fillRect(0, 0, 48, 48); return (glowCv = c);
  }
  function prepWish(vw, vh) {
    var raw = wishStars; wishStars = null; /* 用一次就丢，不保存、不上传 */
    if (!state.wishStar || !raw || !raw.length) return null;
    var pts = raw, i;
    if (raw.length > 120) { var k = raw.length / 120; pts = []; for (i = 0; i < 120; i++) pts.push(raw[Math.floor(i * k)]); }
    var minX = 1e9, maxX = -1e9, minY = 1e9, maxY = -1e9;
    pts.forEach(function (p) { var x = p.x * vw, y = p.y * vh; minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y); });
    var bw = Math.max(1, maxX - minX), bh = Math.max(1, maxY - minY), W = Math.min(vw * 0.6, 380), H = Math.min(vh * 0.13, 110);
    var sc = Math.min(0.9, W / bw, H / bh), mx = (minX + maxX) / 2, my = (minY + maxY) / 2, cyC = vh * 0.15;
    var hx = vw / 2, hy = vh * 0.27, hr = Math.min(vw * 0.32, vh * 0.2) * 1.2; /* 心形出现的位置，散开的星星避开它 */
    var stars = pts.map(function (p, i) {
      var x = p.x * vw, y = p.y * vh, rx, ry, tries = 0;
      do { rx = 14 + Math.random() * (vw - 28); ry = 12 + Math.random() * vh * 0.5; tries++; } while (tries < 10 && Math.abs(rx - hx) < hr && Math.abs(ry - hy) < hr);
      return { sx: x, sy: y, cx: vw / 2 + (x - mx) * sc, cy: cyC + (y - my) * sc, rx: rx, ry: ry, s: p.s, d1: i / pts.length * 500, d2: Math.random() * 500, size: 1.5 + Math.random() * 1.3, ph: Math.random() * 6.28, px: x, py: y };
    });
    return { stars: stars, capY: cyC + (maxY - minY) * sc / 2 + 26 };
  }
  function fireworks(text, onEnd) {
    if (fwOn) return; fwOn = true;
    /* 烟花开始前先记下所有图片窗口；窗口随后会炸成粒子并移除 */
    var memoryPhotos = Array.prototype.slice.call(stage.querySelectorAll(".win .mimg")).map(function (img) {
      var fig = img.closest(".body, .win"), cap = fig && fig.querySelector(".cap, .pcap");
      return { src: img.currentSrc || img.src, caption: cap ? cap.textContent.trim() : (img.alt || "") };
    }).filter(function (p) { return !!p.src; });
    var vw = window.innerWidth, vh = window.innerHeight, dpr = Math.min(window.devicePixelRatio || 1, 2);
    var sky = document.createElement("div"); sky.className = "fw-sky";
    var cv = document.createElement("canvas"); cv.className = "fw-cv"; cv.width = vw * dpr; cv.height = vh * dpr;
    var wish = prepWish(vw, vh), wcv = null, wg = null, wcap = null, glow = null;
    document.body.appendChild(sky);
    if (wish) { /* 愿望星星单独一层画布，不被烟花的拖尾擦掉 */
      wcv = document.createElement("canvas"); wcv.className = "fw-cv"; wcv.width = vw * dpr; wcv.height = vh * dpr; document.body.appendChild(wcv);
      wg = wcv.getContext("2d"); wg.setTransform(dpr, 0, 0, dpr, 0, 0); glow = glowSprite();
      wcap = document.createElement("div"); wcap.className = "fw-wishcap"; wcap.textContent = "你许下的愿望，飞上了夜空 ✨"; wcap.style.top = Math.round(wish.capY) + "px"; document.body.appendChild(wcap);
    }
    document.body.appendChild(cv);
    var x = cv.getContext("2d"); x.setTransform(dpr, 0, 0, dpr, 0, 0);
    requestAnimationFrame(function () { sky.classList.add("on"); });
    var fc = null, fcBox = null, lastHop = 0, scared = false, looking = false;
    if (state.cats) {
      var fu = Math.max(5, Math.min(9, Math.round(vw / 55)));
      fc = document.createElement("div"); fc.className = "firecat"; fc.style.marginLeft = (-7 * fu) + "px";
      fcBox = catBox(fu, catCfg("a"), "up", "#ffd36b"); fc.appendChild(fcBox); document.body.appendChild(fc);
      if (res) res.el.style.visibility = "hidden";
    }
    function fcJump() { if (!fc) return; fc.classList.remove("jump"); void fc.offsetWidth; fc.classList.add("jump"); }
    function fcReact(col, big) {
      if (!fcBox || gathering) return;
      if (big && !scared) { /* 第一发礼花：吓一跳，回头看你一眼，再抬头 */
        scared = looking = true; fcBox.setMood("wide"); fcJump(); sfxMeow("short", 3);
        setTimeout(function () { if (fcBox && !gathering) fcBox.setMood("open"); }, 450);
        setTimeout(function () { looking = false; if (fcBox && !gathering) fcBox.setMood("up", col); }, 1500);
        return;
      }
      if (!looking) fcBox.setMood("up", col); /* 烟花的光映进眼睛 */
      var now = performance.now(); if (big && now - lastHop > 700) { lastHop = now; fcJump(); }
    }
    var pal = [fxCfg().c, "#ffd36b", "#ffffff", "#ff8fb1", "#ffb3c7", "#9be7ff"], P = [], rockets = [], tms = [], raf = 0, ended = false, gathering = false, T0 = performance.now();
    function pick() { return pal[(Math.random() * pal.length) | 0]; }
    function burst(bx, by, n, sp) {
      var c1 = pick(), c2 = pick(); fcReact(c1, sp > 4);
      for (var i = 0; i < n; i++) { var a = Math.random() * 6.2832, s = sp * (0.35 + Math.random() * 0.65); P.push({ x: bx, y: by, vx: Math.cos(a) * s, vy: Math.sin(a) * s, c: Math.random() < 0.5 ? c1 : c2, sz: 2 + Math.random() * 2, a: 1, age: 0, life: 90 + Math.random() * 40 }); }
      sfxBoom();
    }
    if (wish) { tms.push(setTimeout(function () { if (wcap) wcap.classList.add("on"); }, 1100)); tms.push(setTimeout(function () { if (wcap) wcap.classList.remove("on"); }, 3300)); }
    /* 1) 窗口先炸开 */
    var r0 = stage.getBoundingClientRect();
    Array.prototype.slice.call(stage.querySelectorAll(".win:not(.fin)")).forEach(function (w, i) {
      var r = w.getBoundingClientRect();
      tms.push(setTimeout(function () { burst(r.left + r.width / 2, r.top + r.height / 2, 22, 3.2); w.classList.add("out"); setTimeout(function () { w.remove(); }, 220); }, i * 90));
    });
    /* 2) 再放几发礼花 */
    for (var k = 0; k < 6; k++) (function (k) {
      tms.push(setTimeout(function () { rockets.push({ x: vw * (0.15 + Math.random() * 0.7), y: vh + 10, vy: -(9 + Math.random() * 3) * Math.max(0.7, vh / 700), ty: vh * (0.15 + Math.random() * 0.3) }); }, 700 + k * 380));
    })(k);
    /* 3) 聚成字和心 */
    tms.push(setTimeout(function () {
      var T = fwTargets(text, vw, vh).sort(function () { return Math.random() - 0.5; }), now = performance.now(), live = P.filter(function (p) { return !p.g; });
      while (live.length < T.length) { var s = live[(Math.random() * live.length) | 0] || { x: vw / 2, y: vh / 2 }; var q = { x: s.x, y: s.y, vx: 0, vy: 0, c: pick(), sz: 2, a: 1, age: 0, life: 99 }; P.push(q); live.push(q); }
      live.forEach(function (p, i) { var t = T[i % T.length]; p.g = now + Math.random() * 300; p.sx = p.x; p.sy = p.y; p.tx = t.x + (i >= T.length ? Math.random() * 6 - 3 : 0); p.ty = t.y + (i >= T.length ? Math.random() * 6 - 3 : 0); p.c = t.c; p.sz = 2.4; p.a = 1; });
      gathering = true; sfxFanfare(); if (fcBox) { fcBox.setMood("happy"); sfxMeow("happy"); }
    }, 3600));
    tms.push(setTimeout(end, 9600));
    sky.addEventListener("click", end);
    function end() {
      if (ended) return; ended = true; tms.forEach(clearTimeout);
      sky.classList.remove("on"); cv.classList.add("off"); if (wcv) wcv.classList.add("off"); if (wcap) wcap.classList.remove("on");
      setTimeout(function () { cancelAnimationFrame(raf); sky.remove(); cv.remove(); if (wcv) wcv.remove(); if (wcap) wcap.remove(); if (fc) fc.remove(); if (res) res.el.style.visibility = ""; fwOn = false; showMemoryWall(memoryPhotos, onEnd); }, 900);
    }
    function drawWish(now) {
      if (!wg) return;
      var el = now - T0, A = wish.stars, i, s, a, f, gg, x0, y0, sz;
      function ease(t) { t = Math.max(0, Math.min(1, t)); return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
      wg.clearRect(0, 0, vw, vh); wg.globalCompositeOperation = "lighter";
      var la = Math.max(0, Math.min(1, (el - 2300) / 600)) * (1 - Math.max(0, Math.min(1, (el - 3500) / 600))); /* 星座连线只在中间出现一会儿 */
      for (i = 0; i < A.length; i++) {
        s = A[i]; f = ease((el - 700 - s.d1) / 1500); gg = ease((el - 3500 - s.d2) / 1700);
        x0 = s.sx + (s.cx - s.sx) * f; y0 = s.sy + (s.cy - s.sy) * f - Math.sin(Math.PI * f) * 22;
        s.px = x0 + (s.rx - x0) * gg; s.py = y0 + (s.ry - y0) * gg;
        a = Math.min(1, el / 600) * (0.7 + 0.3 * Math.sin(now / 260 + s.ph)); sz = s.size + (1 - f) * 1.4;
        wg.globalAlpha = a * 0.6; wg.drawImage(glow, s.px - sz * 4, s.py - sz * 4, sz * 8, sz * 8);
        wg.globalAlpha = a; wg.fillStyle = "#fff3d6"; wg.fillRect(s.px - sz / 2, s.py - sz / 2, sz, sz);
        if (gg > 0.95 && Math.sin(now / 260 + s.ph) > 0.85) { wg.fillRect(s.px - sz * 1.8, s.py - 0.5, sz * 3.6, 1); wg.fillRect(s.px - 0.5, s.py - sz * 1.8, 1, sz * 3.6); }
      }
      if (la > 0.01) {
        wg.globalAlpha = 0.4 * la; wg.strokeStyle = "#fff3d6"; wg.lineWidth = 1; wg.beginPath();
        for (i = 1; i < A.length; i++) if (A[i].s === A[i - 1].s) { wg.moveTo(A[i - 1].px, A[i - 1].py); wg.lineTo(A[i].px, A[i].py); }
        wg.stroke();
      }
      wg.globalAlpha = 1;
    }
    function frame() {
      raf = requestAnimationFrame(frame);
      var now = performance.now(); drawWish(now);
      x.globalCompositeOperation = "destination-out"; x.fillStyle = "rgba(0,0,0,0.22)"; x.fillRect(0, 0, vw, vh);
      x.globalCompositeOperation = "lighter";
      rockets = rockets.filter(function (r) {
        r.y += r.vy; r.vy *= 0.985; x.globalAlpha = 1; x.fillStyle = "#fff"; x.fillRect(r.x - 1.5, r.y, 3, 10);
        if (r.y <= r.ty) { burst(r.x, r.y, 70, 5); return false; } return true;
      });
      for (var i = P.length - 1; i >= 0; i--) {
        var p = P[i], px, py;
        if (p.g) {
          var t = Math.max(0, Math.min(1, (now - p.g) / 1400)), e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
          px = p.sx + (p.tx - p.sx) * e; py = p.sy + (p.ty - p.sy) * e; p.a = t < 1 ? 1 : 0.65 + 0.35 * Math.sin(now / 220 + i);
        } else {
          p.vx *= 0.985; p.vy = p.vy * 0.985 + 0.045; p.x += p.vx; p.y += p.vy; p.age++; px = p.x; py = p.y;
          p.a = Math.max(0, 1 - Math.max(0, p.age - p.life * 0.6) / (p.life * 0.4));
          if (!gathering && p.age > p.life) { P.splice(i, 1); continue; }
        }
        x.globalAlpha = p.a; x.fillStyle = p.c; x.fillRect(px - p.sz / 2, py - p.sz / 2, p.sz, p.sz);
      }
      x.globalAlpha = 1;
    }
    frame();
  }

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
      var accepted = false;
      function accept() {
        if (accepted) return; accepted = true;
        body.textContent = state.accept || "我就知道你会答应 💗"; catMood("happy"); knockHalt();
        partyRun(function () { /* 合影、蛋糕都结束了，才放烟花 */
          if (state.fireworks && !reduce) { fireworks(text, catSign); return; }
          var r = el.getBoundingClientRect(); fxBurst(r.left + r.width / 2, r.top + r.height / 2);
          sfxFanfare(); beat(); setTimeout(catSign, 1800);
        });
      }
      function dodge(e) {
        if (giveUp) return;
        e.preventDefault(); e.stopPropagation();
        tries++;
        if (tries === 2) catMood("sulk");
        if (tries === 3) knockRerun();
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
      AC = new C(); master = AC.createGain(); master.connect(AC.destination); loadMeows();
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
    o.querySelector(".env-from").textContent = (state.from ? "来自 " + state.from : "") + (state.cats && state.cat.name ? (state.from ? " · " : "") + state.cat.name + " 叼来的信" : "");
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
    if (partyAbort) partyAbort();
    fishAbort(); snowAbort(); yarnAbort(); pqAbort();
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
    var myTok = runTok;
    if (wandAbort) wandAbort();
    if (kn) { kn.abort(); kn = null; }
    fishAbort(); snowAbort(); yarnAbort(); pqAbort(); wishStars = null;
    var vw = stage.clientWidth, vh = stage.clientHeight;
    if (state.pets) spawnPets(vw, vh);
    res = null; if (state.cats) spawnResident(vw, vh);
    var seq = curSeq = buildSeq(), n = seq.length, fin = hasFin(), m = outlineN();
    heartMode = useHeart(m);
    curLayout = heartMode ? heartLayout(m, vw, vh) : null;
    var baseW = Math.round(Math.min(320, vw * 0.66));
    puz = null;
    if (state.puzzle && fin) setupPuzzle(seq, n, vw);
    var knockN = fin ? n - 1 : n, catRun = catOn() && knockN > 0, mode = pickEntry(); entryMode = mode;
    var knockOn = catRun && mode === "knock", fishOn = catRun && mode === "angler", snowOn = catRun && mode === "snow", yarnOn = catRun && mode === "yarn", pawOn = catRun && mode === "paw", balOn = catRun && mode === "balloon";
    if (knockOn) knockStart(vw, vh, knockN, myTok);
    if (fishOn) fishStart(vw, vh, knockN, myTok);
    if (snowOn) snowStart(vw, vh, knockN, myTok);
    if (yarnOn) yarnStart(vw, vh, knockN, myTok);
    if (pawOn || balOn) pqStart(knockN);
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
        var reveal = function () {
          if (myTok !== runTok) return;
          el.style.visibility = ""; el.style.animation = "";
          if (isFin) { bring(el); sfxFanfare(); if (!askFin && !puz) setTimeout(catSign, 1500); } else sfxDing(i); /* 压轴出现时再置顶，免得被后落地的窗口盖住 */
          if (puz && puz.cover[i] != null) addShard(puz.cover[i], el, vw, vh);
          if (it.m && it.m.kind === "voice" && state.autoVoice && el._autoplay) el._autoplay();
        };
        if (catOn()) { /* 先藏起来，等小猫把信送到再弹出 */
          el.style.visibility = "hidden"; el.style.animation = "none";
          if (knockOn && !isFin) { /* 小猫跳上桌子把它推下去，摔在原本的位置 */
            knockAdd({ el: el, w: el.offsetWidth, h: el.offsetHeight, tx: el.offsetLeft, ty: el.offsetTop, idx: i, land: function () {
              if (myTok !== runTok) return;
              if (puz && puz.cover[i] != null) { zTop++; bring(el); addShard(puz.cover[i], el, vw, vh); }
              if (it.m && it.m.kind === "voice" && state.autoVoice && el._autoplay) el._autoplay();
            } });
            return;
          }
          if ((fishOn || snowOn || yarnOn || pawOn || balOn) && !isFin) { /* 钓鱼 / 雪球：窗口的入场动画由小猫的场景自己驱动 */
            el.classList.add("entered");
            var act = {
              el: el, cx: el.offsetLeft + el.offsetWidth / 2, cy: el.offsetTop + el.offsetHeight / 2, w: el.offsetWidth, h: el.offsetHeight, idx: i,
              show: function () { if (myTok === runTok) el.style.visibility = ""; },
              land: function () {
                if (myTok !== runTok) return;
                sfxDing(i);
                if (puz && puz.cover[i] != null) addShard(puz.cover[i], el, vw, vh);
                if (it.m && it.m.kind === "voice" && state.autoVoice && el._autoplay) el._autoplay();
              },
              quick: function () { act.show(); act.land(); }
            };
            if (pawOn) pawEnter(act, vw, vh); else if (balOn) balloonEnter(act, vw, vh); else (fishOn ? fishAdd : snowOn ? snowAdd : yarnAdd)(act);
            return;
          }
          var go = function () { catDeliver(el.offsetLeft + el.offsetWidth / 2, el.offsetTop + el.offsetHeight / 2, isFin ? "box" : "letter", reveal, i); };
          var pre = []; if (isFin && state.wand) pre.push(wandGame); if (isFin && state.boxgame) pre.push(boxGame); if (isFin && state.fish) pre.push(fishGame);
          if (pre.length > 1 && state.randGame) pre = [pre[Math.floor(Math.random() * pre.length)]]; /* 随机只玩一个 */
          knockWhenDone(function () {
            if (myTok !== runTok) return;
            (function next(k) { if (k >= pre.length) { if (myTok === runTok) go(); return; } pre[k](function () { if (myTok === runTok) next(k + 1); }); })(0);
          });
        } else reveal();
      }, delay));
    });
    var lead = catOn() ? 1500 : 0;
    if (curLayout && !reduce) timers.push(setTimeout(function () { knockWhenDone(beat); }, 250 + (n - 1) * state.gap + 1300 + lead));
    var tEnd = reduce ? 0 : 250 + (n - 1) * state.gap + lead;
    var askFin = fin && tplOf(state.skin).finale_kind === "ask";
    var signFn = function () { if (state.from) { hintEl.textContent = "—— " + state.from; hintEl.className = "hint signed"; } else { hintEl.textContent = HINT; hintEl.className = "hint"; } if (!askFin && (!fin || puz)) catSign(); };
    if (puz) {
      puz.onDone = signFn;
      var wd = function (fn) { return function () { knockWhenDone(function () { if (myTok === runTok) fn(); }); }; };
      puz.loose.forEach(function (k, j) { timers.push(setTimeout(wd(function () { addShard(k, null, vw, vh); }), tEnd + 350 + j * 250)); });
      timers.push(setTimeout(wd(ensurePeek), tEnd + 700));
      timers.push(setTimeout(wd(function () { hintEl.textContent = "照片后面好像藏着什么……把碎片拖到一起，拼成那句话"; }), tEnd + 900));
    } else if (state.from) timers.push(setTimeout(function () { knockWhenDone(function () { if (myTok === runTok) signFn(); }); }, tEnd + (reduce ? 0 : 1000)));
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
  var draftMedia = [], rec = null, prev = null, draftBgm = null, draftSelfie = null;
  var fCats = document.getElementById("fCats"), fFw = document.getElementById("fFw"), fAccept = document.getElementById("fAccept"), fPuzzle = document.getElementById("fPuzzle"), fPhoto = document.getElementById("fPhoto"), btnAddBgm = document.getElementById("btnAddBgm"), btnBgmPrev = document.getElementById("btnBgmPrev"),
      btnBgmDel = document.getElementById("btnBgmDel"), fBgm = document.getElementById("fBgm"), bgmNote = document.getElementById("bgmNote");
  document.getElementById("fPuzzle").addEventListener("change", function () { if (this.checked) document.getElementById("fFin").checked = true; });
  document.getElementById("fFin").addEventListener("change", function () { if (!this.checked) document.getElementById("fPuzzle").checked = false; });
  function readCat() {
    var g = function (id) { return document.getElementById(id).value; };
    return normCat({ name: g("fCatName").trim(), fur: g("fCatFur"), pat: g("fCatPat"), eye: g("fCatEye"), bow: g("fCatBow") });
  }
  function renderCatPrev() {
    var c = readCat(), box = document.getElementById("catPrev"); box.innerHTML = "";
    box.appendChild(catBox(6, catCfg("a", c), "open"));
  }
  function fillCat() {
    var c = state.cat;
    document.getElementById("fCatName").value = c.name; document.getElementById("fCatFur").value = c.fur; document.getElementById("fCatPat").value = c.pat;
    document.getElementById("fCatEye").value = c.eye; document.getElementById("fCatBow").value = c.bow; renderCatPrev();
  }
  ["fCatName", "fCatFur", "fCatPat", "fCatEye", "fCatBow"].forEach(function (id) { var e = document.getElementById(id); e.addEventListener("input", renderCatPrev); e.addEventListener("change", renderCatPrev); });
  /* 合照：只用一张，压缩后和别的图片一样先存本机，分享时才上传 */
  var btnAddSelfie = document.getElementById("btnAddSelfie"), btnSelfieDel = document.getElementById("btnSelfieDel"), fSelfiePhoto = document.getElementById("fSelfiePhoto"), selfiePrev = document.getElementById("selfiePrev"), selfieNote = document.getElementById("selfieNote");
  function dropDraftSelfie() { if (draftSelfie && (!state.selfiePhoto || state.selfiePhoto.id !== draftSelfie.id)) dropBlob(draftSelfie.id); }
  function renderSelfie() {
    var src = draftSelfie && mediaSrc(draftSelfie);
    selfiePrev.innerHTML = "";
    if (src) { var im = document.createElement("img"); im.src = src; im.alt = "合照预览"; im.className = "mthumb selfie-th"; selfiePrev.appendChild(im); }
    selfiePrev.hidden = !src; btnSelfieDel.hidden = !src;
    btnAddSelfie.textContent = src ? "换一张合照" : "上传真实合照";
    selfieNote.textContent = src
      ? "倒数拍完后，相框里会洗出这张照片（不再画小猫）。图片会压缩并去掉拍摄位置，点「分享」时才上传到云端。"
      : "可选。不上传就还是画一张「你们的小猫合影」；上传后，拍完照显示的就是你们的真实合照。";
  }
  btnAddSelfie.addEventListener("click", function () { fSelfiePhoto.click(); });
  fSelfiePhoto.addEventListener("change", function () {
    var f = fSelfiePhoto.files && fSelfiePhoto.files[0]; fSelfiePhoto.value = ""; if (!f) return;
    compressImage(f).then(function (r) {
      dropDraftSelfie();
      var id = randId(10); setBlob(id, r.blob); draftSelfie = { id: id, url: "" }; renderSelfie();
    }, function () { showToast("这张图片读不出来，换 jpg / png / webp 试试", false); });
  });
  btnSelfieDel.addEventListener("click", function () { dropDraftSelfie(); draftSelfie = null; renderSelfie(); });
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
    dropDraftSelfie(); draftSelfie = null;
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
    fillCat(); document.getElementById("fWand").checked = state.wand; document.getElementById("fBox").checked = state.boxgame; document.getElementById("fFish").checked = state.fish; document.getElementById("fRand").checked = state.randGame; document.getElementById("fCatVoice").checked = state.catVoice; document.getElementById("fKnock").checked = state.knock; document.getElementById("fSelfie").checked = state.selfie; document.getElementById("fCake").checked = state.cake; document.getElementById("fWish").checked = state.wish; document.getElementById("fWishStar").checked = state.wishStar; document.getElementById("fAngler").checked = state.angler; document.getElementById("fSnow").checked = state.snow; document.getElementById("fYarn").checked = state.yarn; document.getElementById("fPaw").checked = state.paw; document.getElementById("fBalloon").checked = state.balloon; document.getElementById("fEntryRand").checked = state.entryRand; syncEntryUi(); fCats.checked = state.cats; fFw.checked = state.fireworks; fAccept.value = state.accept || ""; fPuzzle.checked = state.puzzle; fPhoto.value = state.photoStyle; draftBgm = state.bgm ? clone(state.bgm) : null; renderBgm(); draftSelfie = state.selfiePhoto ? clone(state.selfiePhoto) : null; renderSelfie();
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
      photoStyle: fPhoto.value, puzzle: fPuzzle.checked, cats: fCats.checked, fireworks: fFw.checked, accept: fAccept.value.trim().slice(0, 200), cat: readCat(), wand: document.getElementById("fWand").checked, boxgame: document.getElementById("fBox").checked, fish: document.getElementById("fFish").checked, randGame: document.getElementById("fRand").checked, catVoice: document.getElementById("fCatVoice").checked, knock: document.getElementById("fKnock").checked, selfie: document.getElementById("fSelfie").checked, cake: document.getElementById("fCake").checked, wish: document.getElementById("fWish").checked, wishStar: document.getElementById("fWishStar").checked, angler: document.getElementById("fAngler").checked, snow: document.getElementById("fSnow").checked, yarn: document.getElementById("fYarn").checked, paw: document.getElementById("fPaw").checked, balloon: document.getElementById("fBalloon").checked, entryRand: document.getElementById("fEntryRand").checked,
      selfiePhoto: draftSelfie && mediaSrc(draftSelfie) ? normPhoto(draftSelfie) : null,
      bgm: draftBgm && mediaSrc(draftBgm) ? normBgm(draftBgm) : null
    };
    var oldMedia = state.media.concat(extraMedia(state));
    stopPreview(); unlockVoices();
    sheetEdit.hidden = true; scrim.hidden = true; draftMedia = []; draftBgm = null; draftSelfie = null;
    commitMedia(next.media.concat(extraMedia(next)), oldMedia).then(function () { return persist(next); }).then(function (mode) {
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
    var next = { skin: id, title: t.title, icon: t.icon, gap: state.gap, pets: state.pets, layout: state.layout, to: state.to, from: state.from, envelope: !!t.envelope, finale: !!t.finale, fx: state.fx, msgs: t.msgs.slice(), media: clone(state.media), autoVoice: state.autoVoice, photoStyle: state.photoStyle, puzzle: state.puzzle, cats: state.cats, fireworks: state.fireworks, accept: state.accept, cat: clone(state.cat), wand: state.wand, boxgame: state.boxgame, fish: state.fish, randGame: state.randGame, catVoice: state.catVoice, knock: state.knock, selfie: state.selfie, cake: state.cake, wish: state.wish, wishStar: state.wishStar, angler: state.angler, snow: state.snow, yarn: state.yarn, paw: state.paw, balloon: state.balloon, entryRand: state.entryRand, selfiePhoto: state.selfiePhoto ? clone(state.selfiePhoto) : null, bgm: state.bgm ? clone(state.bgm) : null };
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
    if (state.selfiePhoto && state.selfiePhoto.id === id) state.selfiePhoto.url = url;
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
    var items = o.media || [], hasB = !!o.bgm, hasP = !!o.selfiePhoto;
    if (!items.length && !hasB && !hasP) return Promise.resolve({ o: o, dropped: 0 });
    if (!API.enabled) { o.media = []; o.bgm = null; o.selfiePhoto = null; return Promise.resolve({ o: o, dropped: items.length + (hasB ? 1 : 0) + (hasP ? 1 : 0) }); }
    var jobs = items.map(function (m) {
      return uploadItem(m).then(function (url) { return { id: m.id, kind: m.kind, url: url, cap: m.cap, at: m.at, dur: m.dur }; }, function () { return null; });
    });
    var bj = hasB ? uploadItem(o.bgm).then(function (url) { return { id: o.bgm.id, url: url, name: o.bgm.name, dur: o.bgm.dur }; }, function () { return null; }) : Promise.resolve(null);
    var pj = hasP ? uploadItem(o.selfiePhoto).then(function (url) { return { id: o.selfiePhoto.id, url: url }; }, function () { return null; }) : Promise.resolve(null);
    return Promise.all([Promise.all(jobs), bj, pj]).then(function (r) {
      var ok = r[0].filter(Boolean), dropped = items.length - ok.length;
      o.media = ok;
      if (hasB) { if (r[1]) o.bgm = r[1]; else { o.bgm = null; dropped++; } }
      if (hasP) { if (r[2]) o.selfiePhoto = r[2]; else { o.selfiePhoto = null; dropped++; } }
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
    sLink.value = o.media.length || o.bgm || o.selfiePhoto ? "正在上传图片、语音和歌曲…" : "生成中…";
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
  /* 三种“小猫演出来的出场方式”三选一；开了“出场方式随机”时，这三项不再起作用 */
  var ENTRY_IDS = ["fKnock", "fAngler", "fSnow", "fYarn", "fPaw", "fBalloon"];
  function syncEntryUi() {
    var rnd = document.getElementById("fEntryRand").checked;
    ENTRY_IDS.forEach(function (id) { var c = document.getElementById(id); c.disabled = rnd; c.parentNode.style.opacity = rnd ? 0.45 : ""; });
  }
  (function () {
    ENTRY_IDS.forEach(function (id) {
      document.getElementById(id).addEventListener("change", function (e) {
        if (!e.target.checked) return;
        ENTRY_IDS.forEach(function (o) { if (o !== id) document.getElementById(o).checked = false; });
      });
    });
    document.getElementById("fEntryRand").addEventListener("change", syncEntryUi);
  })();
  function init() {
    local = readLocal();
    if (sharePromise) sharePromise.then(function (d) { var s = norm(d); if (s) startViewer(s); else badLink(); }, badLink);
    else if (hm) decodeShare(hm[1]).then(function (s) { if (s) startViewer(s); else badLink(); });
    else if (tid && TEMPLATES[tid]) startViewer(fromTemplate(tid));
    else { setViewing(false); state = local || clone(DEFAULTS); loadBlobs(state.media.concat(extraMedia(state))).then(boot); }
  }
  document.addEventListener("pointerdown", function () { if (viewing && !soundOn && !userMuted && state.bgm && mediaSrc(state.bgm)) setSound(true); }, true);
  if (viewing) Promise.race([refreshTemplates(), new Promise(function (r) { setTimeout(r, 3000); })]).then(init);
  else { init(); refreshTemplates(); }
})();
