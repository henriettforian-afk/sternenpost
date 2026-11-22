/* Sternenzauber: Anzeige und Steuerung des Match-3-Spiels (Logik steht in match3_logic.js).
   Nur ein Zug gleichzeitig: während Animationen (busy) werden Eingaben ignoriert. */
(function () {
  var A = window.Advent, T = A.T, M = window.M3;
  var SPR = ["m3_star", "m3_ball", "m3_bell", "m3_wreath", "m3_gift"];
  var NAMEKEY = ["m3_i_star", "m3_i_ball", "m3_i_bell", "m3_i_wreath", "m3_i_gift"];
  var MODES = {
    star: { kind: 0, goal: 14, moves: 15, g: "m3_g_star", n: "m3_n_star" },
    gift: { kind: 4, goal: 13, moves: 15, g: "m3_g_gift", n: "m3_n_gift" },
    bell: { kind: 2, goal: 13, moves: 15, g: "m3_g_bell", n: "m3_n_bell" }
  };
  var ORDER = ["star", "gift", "bell"];
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var D = reduce ? { swap: 60, pop: 60, fall: 80 } : { swap: 220, pop: 280, fall: 340 };
  function sleep(ms) { return new Promise(function (res) { setTimeout(res, ms); }); }

  A.openMatch3 = function () {
    var box = A.el("div", "m3"), dead = false, S = null, els = {}, boardEl = null, hud = {}, bubble = null, msgTimer = null;

    function say(key) { if (!bubble) return; bubble.textContent = T(key); clearTimeout(msgTimer); }

    /* ---------- Startbildschirm ---------- */
    function picker() {
      S = null; box.innerHTML = "";
      box.appendChild(A.el("h2", "", A.esc(T("m3_title"))));
      box.appendChild(A.el("p", "m3sub", A.esc(T("m3_sub"))));
      var f = A.el("div", "m3fips"); f.innerHTML = '<img src="' + A.sprite("fips_wave") + '" alt=""><p class="m3say">' + A.esc(T("m3_intro")) + "</p>"; box.appendChild(f);
      box.appendChild(A.el("p", "m3pick", A.esc(T("m3_pick"))));
      var g = A.el("div", "m3modes");
      ORDER.forEach(function (id) {
        var m = MODES[id], b = A.el("button", "pzcard"); b.type = "button";
        b.innerHTML = '<span class="m3ico"><img src="' + A.sprite(SPR[m.kind]) + '" alt=""></span><span class="cn">' + A.esc(T(m.n)) + '</span><span class="cs">' + A.esc(T(m.g, { n: m.goal })) + "</span>";
        b.addEventListener("click", function () { start(id); });
        g.appendChild(b);
      });
      box.appendChild(g);
      var r = A.el("button", "btn small alt", A.esc(T("m3_random"))); r.type = "button";
      r.addEventListener("click", function () { start(ORDER[Math.floor(Math.random() * ORDER.length)]); });
      box.appendChild(A.el("div", "pzbar")).appendChild(r);
    }

    /* ---------- Spiel ---------- */
    function pos(el, r, c) { el.style.transform = "translate(" + c * 100 + "%," + r * 100 + "%)"; }
    function find(id) { for (var r = 0; r < S.n; r++) for (var c = 0; c < S.n; c++) if (S.b[r][c] && S.b[r][c].id === id) return { r: r, c: c }; return null; }
    function mkTile(t, r, c) {
      var e = A.el("div", "m3t"); e.setAttribute("role", "button"); e.tabIndex = 0; e.setAttribute("data-id", t.id); e.setAttribute("data-k", t.k);
      e.innerHTML = '<img src="' + A.sprite(SPR[t.k]) + '" alt="" draggable="false">';
      e.setAttribute("aria-label", T(NAMEKEY[t.k]));
      pos(e, r, c); boardEl.appendChild(e); els[t.id] = e; return e;
    }
    function syncAll() { for (var r = 0; r < S.n; r++) for (var c = 0; c < S.n; c++) { var t = S.b[r][c]; if (t) pos(els[t.id], r, c); } }
    function hudUpdate() {
      hud.got.textContent = Math.min(S.got, S.m.goal) + " / " + S.m.goal; hud.moves.textContent = S.moves; hud.score.textContent = S.score;
    }
    function unsel() { if (S.sel) { var t = S.b[S.sel.r][S.sel.c]; if (t && els[t.id]) els[t.id].classList.remove("sel"); S.sel = null; } }

    function start(id) {
      var m = MODES[id];
      box.innerHTML = ""; els = {};
      S = { id: id, m: m, n: M.SIZE, b: M.makeBoard(), moves: m.moves, got: 0, score: 0, busy: false, sel: null, over: false };
      box.appendChild(A.el("h2", "", A.esc(T("m3_title"))));
      var f = A.el("div", "m3fips"); f.innerHTML = '<img src="' + A.sprite("fips_wave") + '" alt=""><p class="m3say" role="status" aria-live="polite"></p>'; box.appendChild(f);
      bubble = f.querySelector(".m3say");
      var h = A.el("div", "m3hud");
      h.innerHTML = '<div class="m3goal"><span class="m3lab">' + A.esc(T("m3_goal")) + '</span><span class="m3val"><img src="' + A.sprite(SPR[m.kind]) + '" alt=""><b class="gv"></b></span></div>' +
        '<div><span class="m3lab">' + A.esc(T("m3_moves")) + '</span><b class="m3val mv"></b></div><div><span class="m3lab">' + A.esc(T("m3_score")) + '</span><b class="m3val sc"></b></div>';
      box.appendChild(h);
      hud = { got: h.querySelector(".gv"), moves: h.querySelector(".mv"), score: h.querySelector(".sc") };
      box.appendChild(A.el("p", "m3task", A.esc(T(m.g, { n: m.goal }))));
      var wrap = A.el("div", "m3wrap"); boardEl = A.el("div", "m3board"); wrap.appendChild(boardEl); box.appendChild(wrap);
      for (var r = 0; r < S.n; r++) for (var c = 0; c < S.n; c++) mkTile(S.b[r][c], r, c);
      bindInput(); hudUpdate(); say("m3_f_start");
      var bar = A.el("div", "pzbar");
      var ag = A.el("button", "btn small alt", A.esc(T("m3_again"))); ag.type = "button"; ag.addEventListener("click", function () { if (!S.busy || S.over) start(id); });
      var ot = A.el("button", "btn small alt", A.esc(T("m3_other"))); ot.type = "button"; ot.addEventListener("click", function () { if (!S.busy || S.over) picker(); });
      bar.appendChild(ag); bar.appendChild(ot); box.appendChild(bar);
      S.wrap = wrap;
    }

    /* ---------- Eingabe: Tippen (zwei Felder) oder Wischen ---------- */
    function bindInput() {
      var down = null;
      boardEl.addEventListener("pointerdown", function (e) {
        var t = e.target.closest(".m3t"); if (!t) return;
        down = { id: +t.getAttribute("data-id"), x: e.clientX, y: e.clientY };
      });
      boardEl.addEventListener("pointerup", function (e) {
        if (!down) return; var d = down; down = null;
        var cell = boardEl.clientWidth / S.n, dx = e.clientX - d.x, dy = e.clientY - d.y;
        if (Math.max(Math.abs(dx), Math.abs(dy)) > cell * 0.35) {
          var p = find(d.id); if (!p) return;
          var o = Math.abs(dx) > Math.abs(dy) ? { r: p.r, c: p.c + (dx > 0 ? 1 : -1) } : { r: p.r + (dy > 0 ? 1 : -1), c: p.c };
          unsel(); trySwap(p, o);
        } else { var q = find(d.id); if (q) tap(q); }
      });
      boardEl.addEventListener("pointercancel", function () { down = null; });
      boardEl.addEventListener("keydown", function (e) {
        var t = e.target.closest(".m3t"); if (!t) return; var p = find(+t.getAttribute("data-id")); if (!p) return;
        var dir = { ArrowLeft: [0, -1], ArrowRight: [0, 1], ArrowUp: [-1, 0], ArrowDown: [1, 0] }[e.key];
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); tap(p); }
        else if (dir) { e.preventDefault(); unsel(); trySwap(p, { r: p.r + dir[0], c: p.c + dir[1] }); }
      });
    }
    function tap(p) {
      if (S.busy || S.over) return;
      if (!S.sel) { S.sel = p; els[S.b[p.r][p.c].id].classList.add("sel"); return; }
      if (S.sel.r === p.r && S.sel.c === p.c) { unsel(); return; }
      if (M.adjacent(S.sel, p)) { var a = S.sel; unsel(); trySwap(a, p); return; }
      unsel(); S.sel = p; els[S.b[p.r][p.c].id].classList.add("sel");
    }
    function inside(p) { return p.r >= 0 && p.c >= 0 && p.r < S.n && p.c < S.n; }

    /* ---------- Ein Zug mit Animationen ---------- */
    async function trySwap(a, b) {
      if (S.busy || S.over || !inside(a) || !inside(b) || !M.adjacent(a, b)) return;
      S.busy = true;
      var ta = S.b[a.r][a.c], tb = S.b[b.r][b.c];
      M.swap(S.b, a, b); pos(els[ta.id], b.r, b.c); pos(els[tb.id], a.r, a.c);
      await sleep(D.swap); if (dead) return;
      var m = M.findMatches(S.b);
      if (!m.cells.length) {                       /* ungültig: zurücktauschen, kein Zug verbraucht */
        M.swap(S.b, a, b); pos(els[ta.id], a.r, a.c); pos(els[tb.id], b.r, b.c);
        els[ta.id].classList.add("nope"); els[tb.id].classList.add("nope");
        await sleep(D.swap); if (dead) return;
        els[ta.id].classList.remove("nope"); els[tb.id].classList.remove("nope");
        S.busy = false; return;
      }
      S.moves--; hudUpdate();
      var cascade = 0;
      while (m.cells.length && cascade < 50) {
        cascade++;
        var bk = M.countByKind(S.b, m);
        S.got += bk[S.m.kind] || 0; S.score += M.scoreStep(m, cascade); hudUpdate();
        var big = m.runs.some(function (r) { return r.len >= 4; });
        if (cascade >= 2) say("m3_f_chain"); else if (big) say("m3_f_four");
        m.cells.forEach(function (p) { var e = els[S.b[p.r][p.c].id]; e.classList.add("pop"); });
        await sleep(D.pop); if (dead) return;
        m.cells.forEach(function (p) { var t = S.b[p.r][p.c]; els[t.id].remove(); delete els[t.id]; });
        M.removeCells(S.b, m.cells);
        var mv = M.applyGravity(S.b);
        mv.forEach(function (x) {
          var e;
          if (x.isNew) { e = mkTile(x.tile, x.from, x.c); e.style.transition = "none"; pos(e, x.from, x.c); void e.offsetWidth; e.style.transition = ""; }
          else e = els[x.tile.id];
          pos(e, x.to, x.c);
        });
        await sleep(D.fall); if (dead) return;
        m = M.findMatches(S.b);
      }
      if (!M.hasMove(S.b)) { say("m3_f_shuffle"); M.shuffle(S.b); syncAll(); await sleep(D.fall); if (dead) return; }
      if (S.got >= S.m.goal) return end(true);
      if (S.moves <= 0) return end(false);
      S.busy = false;
    }

    /* ---------- Ende ---------- */
    function end(win) {
      S.over = true; S.busy = true;
      var ov = A.el("div", "m3end" + (win ? " win" : "")), reward = "";
      if (win) {
        var got = A.awardGame();
        reward = got ? T("memo_star") : T("memo_again");
        if (got) { A.toast(T("memo_star")); document.dispatchEvent(new Event("advent:stars")); document.dispatchEvent(new Event("advent:memo")); }
        say("m3_f_win");
      }
      ov.innerHTML = '<img src="' + A.sprite("fips_wave") + '" alt=""><h3>' + A.esc(T(win ? "m3_win" : "m3_lose")) + "</h3>" +
        (win ? "<p>" + A.esc(reward) + "</p>" : "") + '<p class="m3fin">' + A.esc(T("m3_score")) + ": " + S.score + "</p>";
      var bar = A.el("div", "pzbar");
      var ag = A.el("button", "btn small", A.esc(T("m3_again"))); ag.type = "button"; ag.addEventListener("click", function () { start(S.id); });
      var ot = A.el("button", "btn small alt", A.esc(T("m3_other"))); ot.type = "button"; ot.addEventListener("click", picker);
      var bk = A.el("button", "btn small alt", A.esc(T("m3_back"))); bk.type = "button"; bk.addEventListener("click", function () { A.closeModal(); });
      bar.appendChild(ag); bar.appendChild(ot); bar.appendChild(bk); ov.appendChild(bar);
      if (win && !reduce) for (var i = 0; i < 12; i++) { var s = A.el("i", "m3conf", "✦"); s.style.left = (4 + i * 8) + "%"; s.style.animationDelay = (i % 5) * 0.15 + "s"; ov.appendChild(s); }
      S.wrap.appendChild(ov);
      var fb = ov.querySelector(".btn"); if (fb) fb.focus();
    }

    A.openModal(box, T("m3_title"), function () { dead = true; });
    picker();
  };
})();
