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
    return { skin: id, title: t.title, icon: t.icon, gap: 450, pets: true, layout: "auto", to: "", from: "", at: 0, envelope: false, finale: false, fx: true, msgs: t.msgs.slice() };
  }
  var DEFAULTS = mkDefaults();

  var HINT = "点窗口置顶，拖标题栏移动，点红点关闭";
  var root = document.documentElement;
  var stage = document.getElementById("stage");
  var timers = [], zTop = 10, played = false;
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var local = null, viewing = root.classList.contains("viewer");
  var state = clone(DEFAULTS);

  function lsGet(k, d) { try { return JSON.parse(localStorage.getItem(k)) || d; } catch (e) { return d; } }
  function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  var MY = "winter-my-shares-v1", SEEN = "winter-replies-seen-v1", SC = "winter-share-cache-v1";
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
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
      at: +o.at > 0 ? +o.at : 0,
      layout: ["auto", "heart", "scatter"].indexOf(o.layout) >= 0 ? o.layout : "auto",
      msgs: o.msgs.map(String).slice(0, 40)
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
  var spriteCache = {};
  function sprite(name, px, fillVar) {
    var cs = getComputedStyle(root), fill = cs.getPropertyValue(fillVar).trim() || "#fff", line = cs.getPropertyValue("--pet-line").trim() || "#2f2a3f";
    var k = name + px + fill + line; if (spriteCache[k]) return spriteCache[k];
    var rows = SPRITES[name], w = rows[0].length, h = rows.length, c = document.createElement("canvas");
    c.width = w * px; c.height = h * px;
    var g = c.getContext("2d");
    for (var y = 0; y < h; y++) for (var x = 0; x < w; x++) {
      var ch = rows[y].charAt(x); if (!ch || ch === " ") continue;
      g.fillStyle = ch === "#" ? line : fill; g.fillRect(x * px, y * px, px, px);
    }
    return (spriteCache[k] = '<img alt="" width="' + w * px + '" height="' + h * px + '" src="' + c.toDataURL() + '">');
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
  function makeWin(text, i, w, sc) {
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
    var body = document.createElement("div"); body.className = "body";
    body.textContent = text;
    el.appendChild(bar); el.appendChild(body);

    dots.firstChild.addEventListener("click", function (e) {
      e.stopPropagation();
      el.classList.add("out");
      setTimeout(function () { el.remove(); }, 220);
    });
    el.addEventListener("pointerdown", function () { bring(el); });
    bar.addEventListener("pointerdown", function (e) {
      if (e.target === dots.firstChild) return;
      var sx = e.clientX, sy = e.clientY, ox = el.offsetLeft, oy = el.offsetTop;
      bar.setPointerCapture(e.pointerId);
      bar.style.cursor = "grabbing";
      function mv(ev) {
        el._moved = true;
        el.style.left = (ox + ev.clientX - sx) + "px";
        el.style.top = (oy + ev.clientY - sy) + "px";
      }
      function up() {
        bar.style.cursor = "";
        bar.removeEventListener("pointermove", mv);
        bar.removeEventListener("pointerup", up);
        bar.removeEventListener("pointercancel", up);
      }
      bar.addEventListener("pointermove", mv);
      bar.addEventListener("pointerup", up);
      bar.addEventListener("pointercancel", up);
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
    var els = state.msgs.slice(0, measureN).map(function (t, i) {
      var e = makeWin(t, i, w, 1); e.style.visibility = "hidden"; e.style.animation = "none"; stage.appendChild(e); return e;
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

  function hasFin() { return state.finale && state.msgs.length >= 3; }
  function outlineN() { return state.msgs.length - (hasFin() ? 1 : 0); }

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
        sfxFanfare(); beat(); report("yes");
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
  function setSound(on) {
    soundOn = on; btnSound.setAttribute("aria-pressed", String(on));
    if (on && audioInit()) {
      master.gain.cancelScheduledValues(AC.currentTime); master.gain.setTargetAtTime(0.6, AC.currentTime, 0.05);
      nextBar = 0; musicSched(); clearInterval(musicTimer); musicTimer = setInterval(musicSched, 500);
    } else {
      clearInterval(musicTimer);
      if (AC) master.gain.setTargetAtTime(0, AC.currentTime, 0.08);
    }
  }
  function sfxDing(i) {
    if (!soundOn || !AC) return;
    var f = PENTA[i % PENTA.length], t = AC.currentTime;
    tone(f, t, 0.9, 0.16, "sine"); tone(f * 2, t, 0.5, 0.04, "sine");
  }
  function sfxFanfare() {
    if (!soundOn || !AC) return;
    [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach(function (f, j) { tone(f, AC.currentTime + j * 0.09, 1.4, 0.14, "triangle"); });
  }
  var btnSound = document.getElementById("btnSound");
  btnSound.addEventListener("click", function () { setSound(!soundOn); });

  /* ---- 飘落特效 + 爆发 ---- */
  function fxCfg() { var t = tplOf(state.skin); return { g: t.fx_glyphs, c: t.fx_color }; }
  var fxc = document.getElementById("fx"), fxx = fxc.getContext("2d"), fxP = [], fxRaf = 0, fxW = 0, fxH = 0;
  function fxSize() {
    var d = Math.min(2, window.devicePixelRatio || 1); fxW = window.innerWidth; fxH = window.innerHeight;
    fxc.width = fxW * d; fxc.height = fxH * d; fxx.setTransform(d, 0, 0, d, 0, 0);
  }
  var glyphCache = {};
  function glyphImg(g, sz, color) {
    sz = Math.max(8, Math.round(sz / 4) * 4);
    var k = g + sz + color; if (glyphCache[k]) return glyphCache[k];
    var d = Math.min(2, window.devicePixelRatio || 1), s = Math.ceil(sz * 1.5), c = document.createElement("canvas"), x;
    c.width = c.height = Math.round(s * d); x = c.getContext("2d"); x.scale(d, d);
    x.font = sz + "px sans-serif"; x.textAlign = "center"; x.textBaseline = "middle"; x.fillStyle = color; x.fillText(g, s / 2, s / 2);
    c.w = s; return (glyphCache[k] = c);
  }
  function fxNew(cfg, init) {
    return { x: Math.random() * fxW, y: init ? Math.random() * fxH : -30, g: cfg.g[(Math.random() * cfg.g.length) | 0],
      sz: 12 + Math.random() * 16, vy: 0.5 + Math.random() * 1.1, ph: Math.random() * 6.28, sw: 0.4 + Math.random(), a: 0.45 + Math.random() * 0.4 };
  }
  function fxBurst(x, y) {
    if (reduce) return;
    for (var i = 0; i < 28; i++) fxP.push({ b: 1, x: x, y: y, g: "♥", sz: 16 + Math.random() * 16, vx: (Math.random() - 0.5) * 10, vy: -3 - Math.random() * 7, a: 1, life: 90 });
    if (!fxRaf) fxLoop();
  }
  function fxLoop() {
    var cfg = fxCfg(), t = Date.now() / 1000;
    fxx.clearRect(0, 0, fxW, fxH); fxx.fillStyle = cfg.c; fxx.textBaseline = "middle"; fxx.textAlign = "center";
    for (var i = fxP.length - 1; i >= 0; i--) {
      var p = fxP[i];
      if (p.b) { p.x += p.vx; p.y += p.vy; p.vy += 0.17; p.vx *= 0.99; p.life--; p.a = Math.min(1, p.life / 30); if (p.life <= 0) { fxP.splice(i, 1); continue; } }
      else { p.y += p.vy; p.x += Math.sin(t * p.sw + p.ph) * 0.6; if (p.y > fxH + 30) fxP[i] = fxNew(cfg, false); }
      var im = glyphImg(p.g, p.sz, cfg.c); fxx.globalAlpha = p.a; fxx.drawImage(im, p.x - im.w / 2, p.y - im.w / 2, im.w, im.w);
    }
    fxx.globalAlpha = 1;
    fxRaf = fxP.length ? requestAnimationFrame(fxLoop) : 0;
  }
  function fxStart() {
    cancelAnimationFrame(fxRaf); fxRaf = 0; fxP = []; fxSize(); fxx.clearRect(0, 0, fxW, fxH);
    if (!state.fx || reduce) return;
    var cfg = fxCfg(), n = Math.min(36, Math.round(fxW / 16));
    for (var i = 0; i < n; i++) fxP.push(fxNew(cfg, true));
    fxLoop();
  }
  window.addEventListener("resize", fxSize);

  /* ---- 信封开场 ---- */
  var opened = false;
  function showEnvelope() {
    var old = document.querySelector(".env"); if (old) old.remove();
    stage.innerHTML = ""; fxStart();
    var o = document.createElement("div"); o.className = "env";
    o.innerHTML = '<p class="env-to"></p><div class="env-box"><div class="env-back"></div><div class="env-card">♥</div><div class="env-front"></div><div class="env-flap"></div><div class="env-seal">♥</div></div><p class="env-from"></p><button type="button" class="env-go-btn">点开看看</button>';
    o.querySelector(".env-to").textContent = state.to ? "给 " + state.to : "给你的一封信";
    o.querySelector(".env-from").textContent = state.from ? "来自 " + state.from : "";
    document.body.appendChild(o);
    var done = false, btn = o.querySelector(".env-go-btn"), lock = viewing && state.at > Date.now(), iv = 0;
    function fmt(ms) { var s = Math.ceil(ms / 1000), d = (s / 86400) | 0, h = ((s % 86400) / 3600) | 0, m = ((s % 3600) / 60) | 0; return (d ? d + "天 " : "") + (d || h ? h + "时 " : "") + m + "分 " + (s % 60) + "秒"; }
    function tick() {
      var left = state.at - Date.now();
      if (left <= 0) { lock = false; clearInterval(iv); btn.textContent = "点开看看"; } else btn.textContent = "还有 " + fmt(left) + " 才能拆开";
    }
    if (lock) { tick(); iv = setInterval(tick, 1000); }
    o.addEventListener("click", function () {
      if (done || lock) return; done = true;
      if (!soundOn) setSound(true);
      sfxDing(2);
      o.classList.add("open");
      setTimeout(function () { o.classList.add("go"); }, 1000);
      setTimeout(function () { o.remove(); opened = true; run(); }, 1600);
    });
  }

  function play() {
    played = true;
    timers.forEach(clearTimeout); timers = [];
    if ((state.envelope || (viewing && state.at > Date.now())) && !opened) { showEnvelope(); return; }
    var old = document.querySelector(".env"); if (old) old.remove();
    run();
  }
  function report(kind) {
    if (!viewing || !sid || !API.enabled) return;
    var k = "winter-rep-" + sid + kind; if (lsGet(k, 0)) return; lsSet(k, 1);
    API.reply(sid, kind).catch(function () { lsSet(k, 0); });
  }
  function run() {
    report("open");
    stage.classList.remove("beat");
    stage.innerHTML = "";
    var hintEl = document.getElementById("hint");
    hintEl.textContent = HINT; hintEl.className = "hint";
    applySkin(state.skin);
    fxStart();
    var vw = stage.clientWidth, vh = stage.clientHeight;
    if (state.pets) spawnPets(vw, vh);
    var n = state.msgs.length, fin = hasFin(), m = outlineN();
    curLayout = useHeart(m) ? heartLayout(m, vw, vh) : null;
    var baseW = Math.round(Math.min(320, vw * 0.66));
    state.msgs.forEach(function (msg, i) {
      var isFin = fin && i === n - 1;
      var delay = reduce ? 0 : 250 + i * state.gap + (isFin ? 350 : 0);
      timers.push(setTimeout(function () {
        var el;
        if (isFin) el = makeFinale(msg, i, vw, vh);
        else el = curLayout ? makeWin(msg, i, Math.round(curLayout.w), curLayout.s) : makeWin(msg, i, baseW, 1);
        stage.appendChild(el);
        if (isFin) {
          if (curLayout) placeHeart(el);
          else { el.style.left = (vw - el.offsetWidth) / 2 + "px"; el.style.top = Math.max(40, vh * 0.45 - el.offsetHeight / 2) + "px"; }
        } else if (curLayout) { el._pos = curLayout.order[i]; placeHeart(el); }
        else placeScatter(el, i, n, vw, vh);
        bring(el);
        if (isFin) sfxFanfare(); else sfxDing(i);
      }, delay));
    });
    if (curLayout && !reduce) timers.push(setTimeout(beat, 250 + (n - 1) * state.gap + 1300));
    if (state.from) timers.push(setTimeout(function () { hintEl.textContent = "—— " + state.from; hintEl.className = "hint signed"; }, reduce ? 0 : 250 + (n - 1) * state.gap + 1000));
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
    modeNote.textContent = "这里的修改保存在你自己的浏览器里；点「分享」会把当前内容存到云端，生成发给 TA 的链接。";
  }
  function closeAll() {
    var wasEdit = !sheetEdit.hidden;
    sheetEdit.hidden = true; sheetMore.hidden = true; sheetShare.hidden = true; scrim.hidden = true;
    if (wasEdit) applySkin(state.skin);
  }
  function openEdit() { closeAll(); fill(); sheetEdit.hidden = false; scrim.hidden = false; }
  function openMore() { closeAll(); renderTemplates(); sheetMore.hidden = false; scrim.hidden = false; }

  fGap.addEventListener("input", function () { gapVal.textContent = (fGap.value / 1000).toFixed(2); });
  document.getElementById("btnEdit").addEventListener("click", openEdit);
  document.getElementById("btnMore").addEventListener("click", openMore);
  document.getElementById("btnReplay").addEventListener("click", function () { opened = false; play(); });
  document.getElementById("btnClose").addEventListener("click", closeAll);
  document.getElementById("btnMoreClose").addEventListener("click", closeAll);
  scrim.addEventListener("click", closeAll);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeAll(); });

  document.getElementById("btnSave").addEventListener("click", function () {
    var lines = fMsgs.value.split("\n").map(function (s) { return s.trim(); }).filter(Boolean).slice(0, 40);
    var next = {
      skin: draftSkin,
      title: fTitle.value.trim() || DEFAULTS.title,
      icon: fIcon.value.trim(),
      gap: +fGap.value || DEFAULTS.gap,
      pets: fPets.checked,
      layout: fLayout.value, to: fTo.value.trim(), from: fFrom.value.trim(), envelope: fEnv.checked, finale: fFin.checked, fx: fFx.checked,
      msgs: lines.length ? lines : DEFAULTS.msgs.slice()
    };
    sheetEdit.hidden = true; scrim.hidden = true;
    persist(next).then(function (mode) {
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
  function showToast(msg, withUndo, ms) {
    toastText.textContent = msg; toastUndo.hidden = !withUndo; toastEl.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.hidden = true; undoState = null; }, ms || 6000);
  }
  function useTemplate(id) {
    var t = TEMPLATES[id];
    undoState = clone(state);
    var next = { skin: id, title: t.title, icon: t.icon, gap: state.gap, pets: state.pets, layout: state.layout, to: state.to, from: state.from, envelope: !!t.envelope, finale: !!t.finale, fx: state.fx, msgs: t.msgs.slice() };
    closeAll();
    persist(next).then(function () { play(); showToast("已套用「" + t.name + "」", true); });
  }
  toastUndo.addEventListener("click", function () {
    if (!undoState) return;
    var prev = undoState; undoState = null; toastEl.hidden = true;
    persist(prev).then(function () { play(); });
  });


  /* ---- 分享：内容编码进链接（#z…），二维码用 qrcode-generator ---- */
  var SHARE_BASE = ((window.APP_CONFIG && window.APP_CONFIG.SHARE_BASE) || location.href.split(/[?#]/)[0]).replace(/index\.html$/, "");
  var sTo = document.getElementById("sTo"), sFrom = document.getElementById("sFrom"), sLink = document.getElementById("sLink"),
      qrImg = document.getElementById("qrImg"), qrNote = document.getElementById("qrNote"),
      btnCopy = document.getElementById("btnCopy"), btnNative = document.getElementById("btnNative"),
      btnShare = document.getElementById("btnShare"), sEnv = document.getElementById("sEnv"), sAt = document.getElementById("sAt"), shTimer = null, shSeq = 0, shareCache = {};
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
  var qrLoading = null;
  function loadQR() {
    if (window.qrcode) return Promise.resolve();
    if (qrLoading) return qrLoading;
    var urls = ["https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js", "https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.js"];
    qrLoading = urls.reduce(function (p, u) {
      return p.then(function () {
        if (window.qrcode) return;
        return new Promise(function (res) { var s = document.createElement("script"); s.src = u; s.onload = s.onerror = res; document.head.appendChild(s); });
      });
    }, Promise.resolve()).then(function () { qrLoading = null; });
    return qrLoading;
  }
  function showShare(url) {
    sLink.value = url; qrImg.hidden = true; qrNote.textContent = "二维码生成中…";
    loadQR().then(function () {
      if (sLink.value !== url) return;
      var img = makeQR(url);
      if (img) { qrImg.src = img; qrImg.hidden = false; qrNote.textContent = "手机相机扫一扫，或长按保存这张图发给 TA"; }
      else { qrImg.hidden = true; qrNote.textContent = window.qrcode ? "文字有点多，二维码装不下，请用下面的链接（或删掉几条再试）" : "二维码暂时生成不了，先用下面的链接"; }
    });
  }
  /* 优先存到 Supabase 拿短链接；没配置或网络失败时，退回把内容编码进链接 */
  function shareUrl(o) {
    var key = h53(sig(o)), cache = lsGet(SC, {});
    if (shareCache[key]) return Promise.resolve(shareCache[key]);
    if (cache[key]) return Promise.resolve((shareCache[key] = SHARE_BASE + "?" + cache[key]));
    var p = API.enabled
      ? API.saveShare(o).then(function (id) {
          var u = SHARE_BASE + "?" + id; shareCache[key] = u;
          var ks = Object.keys(cache); if (ks.length > 40) delete cache[ks[0]];
          cache[key] = id; lsSet(SC, cache);
          var my = lsGet(MY, []); my.push({ id: id, to: o.to }); lsSet(MY, my.slice(-30));
          return u;
        })
      : Promise.reject();
    return p.catch(function () { return encodeShare(o).then(function (code) { return SHARE_BASE + "#" + code; }); });
  }
  function h53(s) {
    var a = 0xdeadbeef, b = 0x41c6ce57, i, c;
    for (i = 0; i < s.length; i++) { c = s.charCodeAt(i); a = Math.imul(a ^ c, 2654435761); b = Math.imul(b ^ c, 1597334677); }
    a = Math.imul(a ^ (a >>> 16), 2246822507) ^ Math.imul(b ^ (b >>> 13), 3266489909);
    b = Math.imul(b ^ (b >>> 16), 2246822507) ^ Math.imul(a ^ (a >>> 13), 3266489909);
    return (4294967296 * (2097151 & b) + (a >>> 0)).toString(36);
  }
  function buildShare() {
    var seq = ++shSeq, o = clone(state);
    o.to = sTo.value.trim().slice(0, 12); o.from = sFrom.value.trim().slice(0, 12); o.envelope = sEnv.checked;
    o.at = sAt.value ? (new Date(sAt.value).getTime() || 0) : 0; if (o.at && o.at <= Date.now()) o.at = 0;
    sLink.value = "生成中…";
    shareUrl(o).then(function (u) { if (seq === shSeq) showShare(u); });
  }
  function saveNames() {
    var n = clone(state); n.to = sTo.value.trim().slice(0, 12); n.from = sFrom.value.trim().slice(0, 12);
    if (sig(n) !== sig(state)) persist(n);
  }
  function openShare() {
    closeAll(); sTo.value = state.to; sFrom.value = state.from; sEnv.checked = true; sAt.value = "";
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
  sEnv.addEventListener("change", buildShare); sAt.addEventListener("change", buildShare);
  btnShare.addEventListener("click", openShare);
  btnCopy.addEventListener("click", copyLink);
  btnNative.addEventListener("click", function () {
    var who = sTo.value.trim();
    navigator.share({ title: state.title, text: who ? "给 " + who + " 的一封信" : "给你的一封信", url: sLink.value }).catch(function () {});
  });
  document.getElementById("btnShClose").addEventListener("click", function () { saveNames(); closeAll(); });

  /* ---- 启动：模板和分享内容都从 Supabase 读取，读不到就用内置/本机的 ---- */
  var qs = new URLSearchParams(location.search), rawQ = location.search.slice(1), sid = qs.get("s") || (/^[A-Za-z0-9]{6,16}$/.test(rawQ) ? rawQ : null), tid = qs.get("t"),
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
      envelope: env === null ? t.envelope : env !== "0", finale: t.finale, fx: true, msgs: t.msgs.slice() });
  }
  function refreshTemplates() {
    if (!API.enabled) return Promise.resolve();
    return API.templates().then(function (rows) {
      if (setTemplates(rows)) { DEFAULTS = mkDefaults(); try { localStorage.setItem(TKEY, JSON.stringify(rows)); } catch (e) {} }
    }).catch(function () {});
  }
  function checkReplies() {
    var mine = lsGet(MY, []); if (!API.enabled || !mine.length) return;
    API.getReplies(mine.map(function (m) { return m.id; })).then(function (rows) {
      var seen = lsGet(SEEN, {}), out = [];
      mine.forEach(function (m) {
        var rs = rows.filter(function (r) { return r.share_id === m.id; }), yes = rs.some(function (r) { return r.kind === "yes"; });
        var lvl = yes ? 2 : rs.length ? 1 : 0, who = m.to || "TA";
        if (lvl > (seen[m.id] || 0)) { out.push(yes ? who + " 点了「愿意」💗" : who + " 拆开了你的信 💌"); seen[m.id] = lvl; }
      });
      if (out.length) { lsSet(SEEN, seen); showToast(out.join("；"), false, 9000); }
    }).catch(function () {});
  }
  function init() {
    local = readLocal();
    if (sharePromise) sharePromise.then(function (d) {
      function go() { var s = norm(d); if (s) startViewer(s); else badLink(); }
      if (d && d.skin && !TEMPLATES[d.skin]) Promise.race([refreshTemplates(), new Promise(function (r) { setTimeout(r, 2500); })]).then(go);
      else { go(); refreshTemplates(); }
    }, badLink);
    else if (hm) decodeShare(hm[1]).then(function (s) { if (s) startViewer(s); else badLink(); });
    else if (tid && TEMPLATES[tid]) startViewer(fromTemplate(tid));
    else { setViewing(false); state = local || clone(DEFAULTS); boot(); setTimeout(checkReplies, 1500); }
  }
  if (viewing && tid && !TEMPLATES[tid]) Promise.race([refreshTemplates(), new Promise(function (r) { setTimeout(r, 2500); })]).then(init);
  else { init(); if (!sid) refreshTemplates(); }
})();
