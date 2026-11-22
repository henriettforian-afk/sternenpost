/* Geschenkzauber: Anzeige und Steuerung (Logik in gz_logic.js). Wischen, Pfeiltasten oder vier große Pfeiltasten.
   Ziel: Zauberpaket (Stufe 5). Tagesbelohnung über A.awardGame, Rekord im Browser gespeichert. */
(function () {
  var A = window.Advent, T = A.T, G = window.GZ;
  var SPR = ["m3_star", "m3_bell", "gz_letter", "m3_gift", "gz_magic", "gz_chest"];
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var DUR = reduce ? 30 : 140;
  function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function st() { var s = A.S.get(); if (!s.gz) s.gz = { best: 0 }; return s; }

  A.openGZ = function () {
    var box = A.el("div", "gz"), goal = (st().gz.goal === 6 ? 6 : G.GOAL), S = null, els = {}, board = null, hud = {}, bubble = null, dead = false, keyH = null;

    function name(v) { return T("gz_n" + v); }
    function pos(e, r, c) { e.style.transform = "translate(" + c * 100 + "%," + r * 100 + "%)"; }
    function mk(t, isNew) {
      var e = A.el("div", "gzt v" + t.v + (isNew ? " newt" : "")); e.setAttribute("data-id", t.id);
      e.innerHTML = '<img src="' + A.sprite(SPR[t.v - 1]) + '" alt="" draggable="false">';
      pos(e, t.r, t.c); board.appendChild(e); els[t.id] = e; return e;
    }
    function hudUp() { hud.score.textContent = S.score; hud.best.textContent = Math.max(S.score, st().gz.best); }
    function say(k) { if (bubble) bubble.textContent = T(k); }

    function start() {
      box.innerHTML = ""; els = {};
      S = { b: G.makeBoard(), score: 0, busy: false, over: false };
      box.appendChild(A.el("h2", "", A.esc(T("gz_title"))));
      var f = A.el("div", "m3fips"); f.innerHTML = '<img src="' + A.sprite("fips_wave") + '" alt=""><p class="m3say" role="status" aria-live="polite"></p>'; box.appendChild(f);
      bubble = f.querySelector(".m3say"); say("gz_intro");
      var modes = A.el("div", "pzlevels"); modes.setAttribute("role", "group"); modes.setAttribute("aria-label", T("gz_goal_pick"));
      [5, 6].forEach(function (gv) {
        var b = A.el("button", "pzlvl" + (gv === goal ? " on" : ""), A.esc(name(gv)) + "<small>" + A.esc(T(gv === 5 ? "gz_easy" : "gz_hard")) + "</small>"); b.type = "button"; b.setAttribute("aria-pressed", String(gv === goal));
        b.addEventListener("click", function () { goal = gv; st().gz.goal = gv; A.S.save(); start(); });
        modes.appendChild(b);
      });
      box.appendChild(modes);
      var h = A.el("div", "m3hud");
      h.innerHTML = '<div class="m3goal"><span class="m3lab">' + A.esc(T("m3_goal")) + '</span><span class="m3val"><img src="' + A.sprite(SPR[goal - 1]) + '" alt=""><b style="font-size:14px">' + A.esc(name(goal)) + '</b></span></div>' +
        '<div><span class="m3lab">' + A.esc(T("m3_score")) + '</span><b class="m3val sc"></b></div><div><span class="m3lab">' + A.esc(T("gz_best")) + '</span><b class="m3val bs"></b></div>';
      box.appendChild(h); hud = { score: h.querySelector(".sc"), best: h.querySelector(".bs") };
      var chain = A.el("div", "gzchain"); chain.setAttribute("aria-label", T("gz_chain"));
      for (var v = 1; v <= G.MAXV; v++) {
        var s = A.el("span", "gzlink" + (v === goal ? " goal" : "")); s.innerHTML = '<img src="' + A.sprite(SPR[v - 1]) + '" alt=""><small>' + A.esc(name(v)) + "</small>"; chain.appendChild(s);
        if (v < G.MAXV) chain.appendChild(A.el("i", "gzarr", "›"));
      }
      box.appendChild(chain);
      var wrap = A.el("div", "gzwrap"); board = A.el("div", "gzboard"); board.tabIndex = 0; board.setAttribute("aria-label", T("gz_board_aria"));
      var bg = A.el("div", "gzcells"); for (var i = 0; i < 16; i++) bg.appendChild(A.el("i", "")); board.appendChild(bg);
      wrap.appendChild(board); box.appendChild(wrap);
      for (var r = 0; r < 4; r++) for (var c = 0; c < 4; c++) if (S.b[r][c]) mk(S.b[r][c], false);
      var pad = A.el("div", "gzpad");
      [["U", "▲", "gz_up"], ["L", "◀", "gz_left"], ["D", "▼", "gz_down"], ["R", "▶", "gz_right"]].forEach(function (d) {
        var b = A.el("button", "gzdir " + d[0], d[1]); b.type = "button"; b.setAttribute("aria-label", T(d[2])); b.addEventListener("click", function () { go(d[0]); }); pad.appendChild(b);
      });
      box.appendChild(pad);
      box.appendChild(A.el("p", "gzhow", A.esc(T("gz_how"))));
      var bar = A.el("div", "pzbar"), nb = A.el("button", "btn small alt", A.esc(T("gz_new"))); nb.type = "button"; nb.addEventListener("click", function () { start(); });
      bar.appendChild(nb); box.appendChild(bar);
      S.wrap = wrap; hudUp(); bindInput();
    }

    function bindInput() {
      var down = null;
      board.addEventListener("pointerdown", function (e) { down = { x: e.clientX, y: e.clientY }; });
      board.addEventListener("pointerup", function (e) {
        if (!down) return; var dx = e.clientX - down.x, dy = e.clientY - down.y; down = null;
        if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
        go(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "R" : "L") : (dy > 0 ? "D" : "U"));
      });
      board.addEventListener("pointercancel", function () { down = null; });
    }

    async function go(dir) {
      if (!S || S.busy || S.over) return;
      var mine = S, res = G.move(S.b, dir);
      if (!res.moved) return;                       /* Zug ändert nichts: kein neues Teil, nichts passiert */
      S.busy = true; S.score += res.score; hudUp();
      var all = {}; for (var r = 0; r < 4; r++) for (var c = 0; c < 4; c++) if (S.b[r][c]) all[S.b[r][c].id] = S.b[r][c];
      Object.keys(all).forEach(function (id) { pos(els[id], all[id].r, all[id].c); });
      res.merges.forEach(function (m) { pos(els[m.gone.id], m.keep.r, m.keep.c); });
      await sleep(DUR); if (dead || S !== mine) return;
      res.merges.forEach(function (m) {
        els[m.gone.id].remove(); delete els[m.gone.id];
        var e = els[m.keep.id]; e.className = "gzt v" + m.keep.v + " bump"; e.querySelector("img").src = A.sprite(SPR[m.keep.v - 1]);
        setTimeout(function () { e.classList.remove("bump"); }, 260);
      });
      var nt = G.spawn(S.b); if (nt) mk(nt, true);
      if (G.maxLevel(S.b) >= goal) { await sleep(DUR); if (S === mine && !dead) end(true); return; }
      if (!G.canMove(S.b)) { await sleep(DUR); if (S === mine && !dead) end(false); return; }
      S.busy = false;
    }

    function end(win) {
      S.over = true; S.busy = true;
      var s = st(); if (S.score > s.gz.best) { s.gz.best = S.score; A.S.save(); } hudUp();
      var reward = "";
      if (win) {
        var got = A.awardGame(); reward = got ? T("memo_star") : T("memo_again");
        if (got) { A.toast(T("memo_star")); document.dispatchEvent(new Event("advent:stars")); document.dispatchEvent(new Event("advent:memo")); }
      }
      var ov = A.el("div", "m3end" + (win ? " win" : ""));
      ov.innerHTML = '<img src="' + A.sprite(win ? SPR[goal - 1] : "fips_wave") + '" alt=""><h3>' + A.esc(T(win ? "gz_win" : "gz_lose")) + "</h3>" + (win ? "<p>" + A.esc(reward) + "</p>" : "") + '<p class="m3fin">' + A.esc(T("m3_score")) + ": " + S.score + "</p>";
      var bar = A.el("div", "pzbar");
      var ag = A.el("button", "btn small", A.esc(T("m3_again"))); ag.type = "button"; ag.addEventListener("click", function () { start(); });
      var bk = A.el("button", "btn small alt", A.esc(T("m3_back"))); bk.type = "button"; bk.addEventListener("click", function () { A.closeModal(); });
      bar.appendChild(ag); bar.appendChild(bk); ov.appendChild(bar);
      if (win && !reduce) for (var i = 0; i < 12; i++) { var c = A.el("i", "m3conf", "✦"); c.style.left = (4 + i * 8) + "%"; c.style.animationDelay = (i % 5) * 0.15 + "s"; ov.appendChild(c); }
      S.wrap.appendChild(ov); ag.focus();
    }

    keyH = function (e) {
      var d = { ArrowLeft: "L", ArrowRight: "R", ArrowUp: "U", ArrowDown: "D" }[e.key];
      if (!d) return; e.preventDefault(); go(d);     /* verhindert, dass die Seite mit den Pfeiltasten scrollt */
    };
    document.addEventListener("keydown", keyH);
    A.openModal(box, T("gz_title"), function () { dead = true; document.removeEventListener("keydown", keyH); });
    start();
  };
})();
