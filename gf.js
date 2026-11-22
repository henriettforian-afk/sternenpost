/* Geschenkefänger: Geschenke fallen in drei Spuren, ein Korb fängt sie. Spur antippen, Pfeiltasten oder zwei große Pfeile.
   Ziel: 10 Geschenke in 45 Sekunden. Verpasste Geschenke verschwinden ohne Strafe. Tagesbelohnung: A.awardGame. */
(function () {
  var A = window.Advent, T = A.T;
  var TIME = 45, LANES = 3, FALL_H = 18, BASKET_TOP = 82, BASKET_BOTTOM = 97;
  /* Geschwindigkeitsstufen: speed = Fall in % der Feldhöhe pro Sekunde, gap = [Mindestabstand, Zufall] in Sekunden zwischen neuen Geschenken */
  var LEVELS = [{ k: "gf_s1", speed: 30, gap: [1.4, 0.6], goal: 10, max: 3, lane: 1.0, coal: 0.15, cspeed: 1.0 }, { k: "gf_s2", speed: 42, gap: [1.1, 0.5], goal: 12, max: 4, lane: 0.8, coal: 0.22, cspeed: 1.2 }, { k: "gf_s3", speed: 72, gap: [0.8, 0.4], goal: 18, max: 5, lane: 0.55, coal: 0.38, cspeed: 1.45 }];
  /* bad = Kohle: Punkteabzug und ein Geschenk weniger (nie unter 0) */
  var TYPES = [{ spr: "gf_red", pts: 10, w: 0.34 }, { spr: "gf_green", pts: 10, w: 0.34 }, { spr: "gz_magic", pts: 20, w: 0.12 }, { spr: "gf_coal", pts: -20, w: 0.20, bad: true }];
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* lv.coal = Anteil Kohle, lv.cspeed = Kohle fällt so viel schneller als die Geschenke */
  function pickType(lv) {
    if (Math.random() < lv.coal) return TYPES[3];
    var r = Math.random() * 0.8, s = 0; for (var i = 0; i < 3; i++) { s += TYPES[i].w; if (r < s) return TYPES[i]; } return TYPES[0];
  }

  A.openGeschenkefaenger = function () {
    var box = A.el("div", "gf"), S = null, timer = null, keyH = null, lvl = Math.max(0, Math.min(2, ((A.S.get().gf || {}).level | 0)));
    function LV() { return LEVELS[lvl]; }

    function stop() { clearInterval(timer); timer = null; }
    function intro() {
      stop(); S = null; box.innerHTML = "";
      box.appendChild(A.el("h2", "", A.esc(T("gf_title"))));
      var f = A.el("div", "m3fips"); f.innerHTML = '<img src="' + A.sprite("fips_wave") + '" alt=""><p class="m3say">' + A.esc(T("gf_intro")) + "</p>"; box.appendChild(f);
      box.appendChild(A.el("p", "m3pick", A.esc(T("gf_task", { n: LV().goal }))));
      var lv = A.el("div", "pzlevels"); lv.setAttribute("role", "group"); lv.setAttribute("aria-label", T("gf_speed"));
      LEVELS.forEach(function (L, i) {
        var b = A.el("button", "pzlvl" + (i === lvl ? " on" : ""), A.esc(T(L.k))); b.type = "button"; b.setAttribute("aria-pressed", String(i === lvl));
        b.addEventListener("click", function () { lvl = i; var s = A.S.get(); if (!s.gf) s.gf = {}; s.gf.level = i; A.S.save(); intro(); });
        lv.appendChild(b);
      });
      box.appendChild(lv);
      var lg = A.el("div", "pflegend");
      TYPES.forEach(function (t) { var s = A.el("span", "pfleg"); s.innerHTML = '<img src="' + A.sprite(t.spr) + '" alt=""><small>' + (t.bad ? A.esc(T("gf_coal_legend")) : t.pts + " " + A.esc(T("m3_score"))) + "</small>"; if (t.bad) s.classList.add("bad"); lg.appendChild(s); });
      box.appendChild(lg);
      var go = A.el("button", "btn", A.esc(T("pf_go"))); go.type = "button"; go.addEventListener("click", start);
      box.appendChild(A.el("div", "pzbar")).appendChild(go);
    }

    function start() {
      stop(); box.innerHTML = "";
      S = { lane: 1, got: 0, score: 0, time: TIME, t: 0, next: 0.5, gifts: [], over: false, last: performance.now(), lastLaneT: [-9, -9, -9] };
      box.appendChild(A.el("h2", "", A.esc(T("gf_title"))));
      var h = A.el("div", "m3hud");
      h.innerHTML = '<div><span class="m3lab">' + A.esc(T("gf_gifts")) + '</span><b class="m3val g1"></b></div><div><span class="m3lab">' + A.esc(T("pf_time")) + '</span><b class="m3val g2"></b></div><div><span class="m3lab">' + A.esc(T("m3_score")) + '</span><b class="m3val g3"></b></div>';
      box.appendChild(h); S.h = { got: h.querySelector(".g1"), time: h.querySelector(".g2"), score: h.querySelector(".g3") };
      var wrap = A.el("div", "gfwrap"), field = A.el("div", "gffield"); field.tabIndex = 0; field.setAttribute("aria-label", T("gf_field_aria"));
      for (var i = 1; i < LANES; i++) { var d = A.el("i", "gfdiv"); d.style.left = (100 / LANES * i) + "%"; field.appendChild(d); }
      var basket = A.el("img", "gfbasket"); basket.alt = ""; basket.src = A.sprite("gf_basket"); basket.draggable = false; field.appendChild(basket);
      wrap.appendChild(field); box.appendChild(wrap); S.msg = A.el("p", "pfmsg", ""); S.msg.setAttribute("role", "status"); box.appendChild(S.msg); S.field = field; S.basket = basket; S.wrap = wrap;
      field.addEventListener("pointerdown", function (e) { var r = field.getBoundingClientRect(); setLane(Math.floor((e.clientX - r.left) / r.width * LANES)); });
      var pad = A.el("div", "gfpad");
      var bl = A.el("button", "gzdir", "◀"); bl.type = "button"; bl.setAttribute("aria-label", T("gz_left")); bl.addEventListener("click", function () { setLane(S.lane - 1); });
      var br = A.el("button", "gzdir", "▶"); br.type = "button"; br.setAttribute("aria-label", T("gz_right")); br.addEventListener("click", function () { setLane(S.lane + 1); });
      pad.appendChild(bl); pad.appendChild(br); box.appendChild(pad);
      box.appendChild(A.el("p", "gzhow", A.esc(T("gf_task", { n: LV().goal }))));
      var bar = A.el("div", "pzbar"), ag = A.el("button", "btn small alt", A.esc(T("pf_again"))); ag.type = "button"; ag.addEventListener("click", start); bar.appendChild(ag); box.appendChild(bar);
      setLane(1); hud(); S.last = performance.now(); timer = setInterval(tick, 40);
    }
    function setLane(l) { if (!S || S.over) return; S.lane = Math.max(0, Math.min(LANES - 1, l)); S.basket.style.left = (100 / LANES * S.lane + 100 / LANES * 0.5 - 15.5) + "%"; }
    function hud() { S.h.got.textContent = S.got + " / " + LV().goal; S.h.time.textContent = Math.max(0, Math.ceil(S.time)); S.h.score.textContent = S.score; }
    function place(g) { g.el.style.left = (100 / LANES * g.lane + 100 / LANES * 0.5 - 12) + "%"; g.el.style.top = g.y + "%"; }

    function tick() {
      if (!S || S.over) return;
      var now = performance.now(), dt = Math.min(0.2, (now - S.last) / 1000); S.last = now; S.t += dt; S.time -= dt;
      if (S.t >= S.next && S.gifts.length < LV().max) {
        var lanes = [0, 1, 2].filter(function (l) { return S.t - S.lastLaneT[l] > LV().lane; });
        if (lanes.length) {
          var lane = lanes[Math.floor(Math.random() * lanes.length)], ty = pickType(LV()), el = A.el("img", "gfgift"); el.alt = ""; el.src = A.sprite(ty.spr); el.draggable = false;
          S.field.insertBefore(el, S.basket);
          var g = { lane: lane, y: -FALL_H, ty: ty, el: el }; S.gifts.push(g); place(g); S.lastLaneT[lane] = S.t; S.next = S.t + LV().gap[0] + Math.random() * LV().gap[1];
        }
      }
      for (var i = S.gifts.length - 1; i >= 0; i--) {
        var g2 = S.gifts[i]; g2.y += LV().speed * (g2.ty.bad ? LV().cspeed : 1) * dt; var bottom = g2.y + FALL_H;
        if (bottom >= BASKET_TOP && bottom <= BASKET_BOTTOM && g2.lane === S.lane) { catchIt(g2); S.gifts.splice(i, 1); continue; }
        if (g2.y > 102) { g2.el.remove(); S.gifts.splice(i, 1); continue; }
        place(g2);
      }
      hud();
      if (S.got >= LV().goal) return end(true);
      if (S.time <= 0) end(false);
    }

    function catchIt(g) {
      g.el.remove();
      var sp = A.el("i", "gfspark", g.ty.bad ? "✖" : "✦"); sp.style.left = (100 / LANES * S.lane + 100 / LANES * 0.5) + "%";
      if (g.ty.bad) {
        sp.classList.add("bad"); S.score = Math.max(0, S.score + g.ty.pts); S.got = Math.max(0, S.got - 1); S.msg.textContent = T("gf_coal_msg");
        S.basket.classList.remove("shake"); void S.basket.offsetWidth; S.basket.classList.add("shake");
      } else {
        S.got++; S.score += g.ty.pts; S.msg.textContent = "";
        S.basket.classList.remove("bounce"); void S.basket.offsetWidth; S.basket.classList.add("bounce");
      }
      hud(); S.field.appendChild(sp); setTimeout(function () { sp.remove(); }, 450);
    }
    function end(win) {
      if (S.over) return; S.over = true; stop();
      var reward = "";
      if (win) {
        var got = A.awardGame(); reward = got ? T("memo_star") : T("memo_again");
        if (got) { A.toast(T("memo_star")); document.dispatchEvent(new Event("advent:stars")); document.dispatchEvent(new Event("advent:memo")); }
      }
      var ov = A.el("div", "m3end" + (win ? " win" : ""));
      ov.innerHTML = '<img src="' + A.sprite("fips_wave") + '" alt=""><h3>' + A.esc(T(win ? "gf_win" : "gf_lose")) + "</h3>" + (win ? "<p>" + A.esc(reward) + "</p>" : "") + '<p class="m3fin">' + A.esc(T("m3_score")) + ": " + S.score + "</p>";
      var bar = A.el("div", "pzbar");
      var ag = A.el("button", "btn small", A.esc(T("pf_again"))); ag.type = "button"; ag.addEventListener("click", start);
      var bk = A.el("button", "btn small alt", A.esc(T("m3_back"))); bk.type = "button"; bk.addEventListener("click", function () { A.closeModal(); });
      bar.appendChild(ag); bar.appendChild(bk); ov.appendChild(bar);
      if (win && !reduce) for (var i = 0; i < 12; i++) { var c = A.el("i", "m3conf", "✦"); c.style.left = (4 + i * 8) + "%"; c.style.animationDelay = (i % 5) * 0.15 + "s"; ov.appendChild(c); }
      S.wrap.appendChild(ov); ag.focus();
    }

    keyH = function (e) {
      if (!S || S.over) return;
      if (e.key === "ArrowLeft") { e.preventDefault(); setLane(S.lane - 1); } else if (e.key === "ArrowRight") { e.preventDefault(); setLane(S.lane + 1); }
    };
    document.addEventListener("keydown", keyH);
    A.openModal(box, T("gf_title"), function () { stop(); document.removeEventListener("keydown", keyH); });
    intro();
  };
})();
