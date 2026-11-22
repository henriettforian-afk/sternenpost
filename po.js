/* Wichtel-Postfenster: sechs Postfenster, aus denen Briefe auftauchen. Die besonderen Briefe (goldener Sternenbrief, Brief mit rotem Siegel)
   antippen; gewöhnliche Briefe und Kugeln sind keine Ziele (kein Punktabzug). Leichte Stufe: 8 Treffer in 45 Sekunden. Tagesbelohnung: A.awardGame. */
(function () {
  var A = window.Advent, T = A.T;
  var ITEMS = [
    { spr: "po_star", target: true, name: "pf_i0" }, { spr: "po_seal", target: true, name: "pf_i1" },
    { spr: "po_plain", target: false, name: "pf_i2" }, { spr: "m3_ball", target: false, name: "pf_i3" }
  ];
  var GOAL = 8, TIME = 45, WINDOWS = 6, SHOW = 1.5, MAX_ACTIVE = 2, P_TARGET = 0.65;
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  A.openPostfenster = function () {
    var box = A.el("div", "pf"), dead = false, S = null, timer = null;

    function intro() {
      stop(); box.innerHTML = "";
      box.appendChild(A.el("h2", "", A.esc(T("pf_title"))));
      var f = A.el("div", "m3fips"); f.innerHTML = '<img src="' + A.sprite("fips_wave") + '" alt=""><p class="m3say">' + A.esc(T("pf_intro")) + "</p>"; box.appendChild(f);
      box.appendChild(A.el("p", "m3pick", A.esc(T("pf_task", { n: GOAL }))));
      var legend = A.el("div", "pflegend");
      ITEMS.forEach(function (it) { var s = A.el("span", "pfleg" + (it.target ? " yes" : "")); s.innerHTML = '<img src="' + A.sprite(it.spr) + '" alt=""><small>' + A.esc(T(it.name)) + "</small>"; legend.appendChild(s); });
      box.appendChild(legend);
      var go = A.el("button", "btn", A.esc(T("pf_go"))); go.type = "button"; go.addEventListener("click", start);
      box.appendChild(A.el("div", "pzbar")).appendChild(go);
    }
    function stop() { clearInterval(timer); timer = null; }

    function start() {
      stop(); box.innerHTML = "";
      S = { hits: 0, time: TIME, active: {}, next: 0.6, over: false, t: 0 };
      box.appendChild(A.el("h2", "", A.esc(T("pf_title"))));
      var h = A.el("div", "m3hud"); h.style.gridTemplateColumns = "repeat(2, 1fr)";
      h.innerHTML = '<div><span class="m3lab">' + A.esc(T("pf_hits")) + '</span><b class="m3val hh"></b></div><div><span class="m3lab">' + A.esc(T("pf_time")) + '</span><b class="m3val tt"></b></div>';
      box.appendChild(h); S.hh = h.querySelector(".hh"); S.tt = h.querySelector(".tt");
      box.appendChild(A.el("p", "m3task", A.esc(T("pf_task", { n: GOAL }))));
      var wall = A.el("div", "pfwall"); S.wins = [];
      for (var i = 0; i < WINDOWS; i++) (function (i) {
        var b = A.el("button", "pw"); b.type = "button"; b.setAttribute("aria-label", T("pf_win_aria", { i: i + 1 }));
        b.innerHTML = '<span class="pwstar">✦</span><span class="pwin"><img class="pwitem" alt="" draggable="false"></span><span class="pdl"></span><span class="pdr"></span>';
        b.addEventListener("click", function () { tap(i); });
        wall.appendChild(b); S.wins.push(b);
      })(i);
      box.appendChild(wall);
      S.msg = A.el("p", "pfmsg", ""); S.msg.setAttribute("role", "status"); box.appendChild(S.msg);
      S.wrap = wall;
      var bar = A.el("div", "pzbar"), ag = A.el("button", "btn small alt", A.esc(T("pf_again"))); ag.type = "button"; ag.addEventListener("click", start);
      bar.appendChild(ag); box.appendChild(bar);
      hud(); S.last = performance.now(); timer = setInterval(tick, 100);
    }
    function hud() { S.hh.textContent = S.hits + " / " + GOAL; S.tt.textContent = Math.max(0, Math.ceil(S.time)); }

    function open(i, it) {
      var b = S.wins[i], img = b.querySelector(".pwitem"); img.src = A.sprite(it.spr); b.setAttribute("aria-label", T("pf_win_aria", { i: i + 1 }) + ": " + T(it.name));
      b.classList.remove("hit", "wrong"); b.classList.add("open");
    }
    function close(i) { var b = S.wins[i]; b.classList.remove("open"); b.setAttribute("aria-label", T("pf_win_aria", { i: i + 1 })); delete S.active[i]; }

    function tick() {
      if (!S || S.over) return;
      var now = performance.now(), dt = Math.min(0.5, (now - S.last) / 1000); S.last = now;
      S.time -= dt; S.t += dt;
      Object.keys(S.active).forEach(function (k) { var a = S.active[k]; if (S.t >= a.until) close(+k); });
      if (S.t >= S.next && Object.keys(S.active).length < MAX_ACTIVE) {
        var free = []; for (var i = 0; i < WINDOWS; i++) if (!S.active[i] && !S.wins[i].classList.contains("closing")) free.push(i);
        if (free.length) {
          var w = free[Math.floor(Math.random() * free.length)], pool = ITEMS.filter(function (x) { return x.target === (Math.random() < P_TARGET); }), it = pool[Math.floor(Math.random() * pool.length)];
          S.active[w] = { it: it, until: S.t + SHOW, done: false }; open(w, it);
          S.next = S.t + 0.8 + Math.random() * 0.4;
        }
      }
      hud();
      if (S.time <= 0) end(false);
    }

    function tap(i) {
      if (!S || S.over) return; var a = S.active[i]; if (!a || a.done) return;
      a.done = true; var b = S.wins[i];
      if (a.it.target) { S.hits++; b.classList.add("hit"); S.msg.textContent = T("pf_good"); hud(); setTimeout(function () { if (S && S.active[i] === a) close(i); }, reduce ? 50 : 260); if (S.hits >= GOAL) end(true); }
      else { b.classList.add("wrong"); S.msg.textContent = T("pf_nope"); setTimeout(function () { if (S && S.active[i] === a) close(i); }, reduce ? 50 : 360); }
    }

    function end(win) {
      if (S.over) return; S.over = true; stop();
      var reward = "";
      if (win) {
        var got = A.awardGame(); reward = got ? T("memo_star") : T("memo_again");
        if (got) { A.toast(T("memo_star")); document.dispatchEvent(new Event("advent:stars")); document.dispatchEvent(new Event("advent:memo")); }
      }
      var ov = A.el("div", "m3end" + (win ? " win" : ""));
      ov.innerHTML = '<img src="' + A.sprite("fips_wave") + '" alt=""><h3>' + A.esc(T(win ? "pf_win" : "pf_lose")) + "</h3>" + (win ? "<p>" + A.esc(reward) + "</p>" : "") + '<p class="m3fin">' + A.esc(T("pf_hits")) + ": " + S.hits + " / " + GOAL + "</p>";
      var bar = A.el("div", "pzbar");
      var ag = A.el("button", "btn small", A.esc(T("pf_again"))); ag.type = "button"; ag.addEventListener("click", start);
      var bk = A.el("button", "btn small alt", A.esc(T("m3_back"))); bk.type = "button"; bk.addEventListener("click", function () { A.closeModal(); });
      bar.appendChild(ag); bar.appendChild(bk); ov.appendChild(bar);
      if (win && !reduce) for (var i = 0; i < 12; i++) { var c = A.el("i", "m3conf", "✦"); c.style.left = (4 + i * 8) + "%"; c.style.animationDelay = (i % 5) * 0.15 + "s"; ov.appendChild(c); }
      S.wrap.style.position = "relative"; S.wrap.appendChild(ov); ag.focus();
    }

    A.openModal(box, T("pf_title"), function () { dead = true; stop(); });
    intro();
  };
})();
