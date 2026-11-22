/* Wichtel-Trio: Anzeige und Steuerung (Logik in tr_logic.js). Karte antippen -> in die Leiste; drei gleiche verschwinden.
   Gewonnen, wenn alle Karten weg sind; verloren, wenn die Leiste voll ist. Tagesbelohnung über A.awardGame. */
(function () {
  var A = window.Advent, T = A.T, L = window.TR;
  var SPR = ["m3_star", "m3_ball", "m3_gift", "m3_bell", "tr_cane", "m3_wreath", "tr_snow", "gz_letter"];
  var NAME = ["tr_k0", "tr_k1", "tr_k2", "tr_k3", "tr_k4", "tr_k5", "tr_k6", "tr_k7"];
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var DUR = reduce ? 60 : 320;
  function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  A.openTrio = function () {
    var box = A.el("div", "tr"), S = null, level = "easy", dead = false;

    function picker() {
      S = null; box.innerHTML = "";
      box.appendChild(A.el("h2", "", A.esc(T("tr_title"))));
      var f = A.el("div", "m3fips"); f.innerHTML = '<img src="' + A.sprite("fips_wave") + '" alt=""><p class="m3say">' + A.esc(T("tr_intro")) + "</p>"; box.appendChild(f);
      box.appendChild(A.el("p", "m3pick", A.esc(T("tr_pick"))));
      var g = A.el("div", "m3modes");
      [["easy", "tr_easy", "tr_easy_d", 18], ["medium", "tr_medium", "tr_medium_d", 24]].forEach(function (m) {
        var b = A.el("button", "pzcard"); b.type = "button";
        b.innerHTML = '<span class="m3ico"><img src="' + A.sprite(SPR[m[0] === "easy" ? 0 : 1]) + '" alt=""></span><span class="cn">' + A.esc(T(m[1])) + '</span><span class="cs">' + A.esc(T(m[2], { n: m[3] })) + "</span>";
        b.addEventListener("click", function () { level = m[0]; start(); });
        g.appendChild(b);
      });
      box.appendChild(g);
    }

    function start() {
      var plan = L.make(level);
      if (!plan) { A.toast(T("tr_err")); picker(); return; }
      box.innerHTML = "";
      S = { plan: plan, bar: [], left: plan.tiles.length, busy: false, over: false, els: {} };
      box.appendChild(A.el("h2", "", A.esc(T("tr_title"))));
      var f = A.el("div", "m3fips"); f.innerHTML = '<img src="' + A.sprite("fips_wave") + '" alt=""><p class="m3say" role="status" aria-live="polite"></p>'; box.appendChild(f);
      S.say = f.querySelector(".m3say"); S.say.textContent = T("tr_intro");
      var info = A.el("p", "trleft", ""); info.setAttribute("aria-live", "polite"); box.appendChild(info); S.info = info;
      var wrap = A.el("div", "trwrap"); var field = A.el("div", "trfield"); field.style.aspectRatio = plan.W + "/" + plan.H; wrap.appendChild(field); box.appendChild(wrap);
      S.field = field; S.wrap = wrap;
      plan.tiles.forEach(function (t, i) {
        var e = A.el("button", "trt"); e.type = "button"; e.setAttribute("aria-label", T(NAME[t.k]));
        e.style.left = t.x / plan.W * 100 + "%"; e.style.top = t.y / plan.H * 100 + "%"; e.style.width = 100 / plan.W + "%"; e.style.height = 100 / plan.H + "%"; e.style.zIndex = 10 + t.l;
        e.innerHTML = '<img src="' + A.sprite(SPR[t.k]) + '" alt="" draggable="false">';
        e.addEventListener("click", function () { pick(i); });
        field.appendChild(e); S.els[t.id] = e;
      });
      var shelf = A.el("div", "trshelf"); shelf.setAttribute("aria-label", T("tr_shelf")); for (var q = 0; q < L.CAP; q++) shelf.appendChild(A.el("i", "trslot")); box.appendChild(shelf); S.shelf = shelf;
      var bar = A.el("div", "pzbar"), ag = A.el("button", "btn small alt", A.esc(T("tr_again"))); ag.type = "button"; ag.addEventListener("click", function () { if (!S.busy || S.over) start(); });
      var ot = A.el("button", "btn small alt", A.esc(T("tr_other"))); ot.type = "button"; ot.addEventListener("click", picker);
      bar.appendChild(ag); bar.appendChild(ot); box.appendChild(bar);
      refresh();
    }

    function refresh() {
      var p = S.plan;
      p.tiles.forEach(function (t, i) { var e = S.els[t.id]; if (!e) return; var free = L.isFree(p, i); e.classList.toggle("covered", !free); e.disabled = !free || S.over; });
      var slots = S.shelf.children;
      for (var q = 0; q < slots.length; q++) { slots[q].innerHTML = ""; var t = S.bar[q]; if (t) slots[q].innerHTML = '<img src="' + A.sprite(SPR[t.k]) + '" alt="' + A.esc(T(NAME[t.k])) + '">'; }
      S.info.textContent = T("tr_left", { n: S.left });
    }

    async function pick(i) {
      if (!S || S.busy || S.over) return;
      var p = S.plan, t = p.tiles[i]; if (t.taken || !L.isFree(p, i)) return;
      t.taken = true; S.els[t.id].remove(); delete S.els[t.id];
      var gone = L.addToBar(S.bar, t);
      if (gone) {
        S.busy = true; S.left -= 3; refresh();
        [].forEach.call(S.shelf.children, function (sl) { sl.classList.remove("vanish"); });
        S.say.textContent = T("tr_f_trio");
        await sleep(DUR); if (dead) return;
        S.busy = false; refresh();
        if (S.left <= 0) return end(true);
      } else {
        refresh();
        if (L.barFull(S.bar)) return end(false);
      }
    }

    function end(win) {
      S.over = true; refresh();
      var reward = "";
      if (win) {
        var got = A.awardGame(); reward = got ? T("memo_star") : T("memo_again");
        if (got) { A.toast(T("memo_star")); document.dispatchEvent(new Event("advent:stars")); document.dispatchEvent(new Event("advent:memo")); }
      }
      var ov = A.el("div", "m3end" + (win ? " win" : ""));
      ov.innerHTML = '<img src="' + A.sprite("fips_wave") + '" alt=""><h3>' + A.esc(T(win ? "tr_win" : "tr_lose")) + "</h3>" + (win ? "<p>" + A.esc(reward) + "</p>" : "");
      var bar = A.el("div", "pzbar");
      var ag = A.el("button", "btn small", A.esc(T("tr_again"))); ag.type = "button"; ag.addEventListener("click", start);
      var ot = A.el("button", "btn small alt", A.esc(T("tr_other"))); ot.type = "button"; ot.addEventListener("click", picker);
      var bk = A.el("button", "btn small alt", A.esc(T("m3_back"))); bk.type = "button"; bk.addEventListener("click", function () { A.closeModal(); });
      bar.appendChild(ag); bar.appendChild(ot); bar.appendChild(bk); ov.appendChild(bar);
      if (win && !reduce) for (var i = 0; i < 12; i++) { var c = A.el("i", "m3conf", "✦"); c.style.left = (4 + i * 8) + "%"; c.style.animationDelay = (i % 5) * 0.15 + "s"; ov.appendChild(c); }
      S.wrap.appendChild(ov); ag.focus();
    }

    A.openModal(box, T("tr_title"), function () { dead = true; });
    picker();
  };
})();
