/* Fips' Suchstube: Suchbild-Spiel. Ein Spiel für alle Szenen und Listen (data/hidden.js).
   Kein Zeitlimit, keine Strafe für Fehlklicks. Tagesbelohnung über A.awardGame (gemeinsam mit den anderen Minispielen). */
(function () {
  var A = window.Advent, T = A.T, I = A.I, H = window.HIDDEN;
  var lang = function () { return I.lang(); };
  var last = {};   /* Szene -> zuletzt gespielte Liste */
  var ok = {};

  function probe() { H.scenes.forEach(function (s) { var x = new Image(); x.onload = function () { ok[s.id] = true; }; x.onerror = function () { ok[s.id] = false; }; x.src = s.src; }); }
  function pickList(s) {
    var n = s.lists.length, i = Math.floor(Math.random() * n);
    if (n > 1 && last[s.id] === i) i = (i + 1) % n;
    last[s.id] = i; return s.lists[i];
  }
  /* Vorschaubild: kleiner Bildausschnitt um das Ding (zeigt, wie es aussieht, ohne zu verraten, wo es ist) */
  function thumb(s, t) {
    var fr = 0.14, frY = fr * s.w / s.h, px = Math.max(0, Math.min(100, (t.x / 100 - fr / 2) / (1 - fr) * 100)), py = Math.max(0, Math.min(100, (t.y / 100 - frY / 2) / (1 - frY) * 100));
    return "background-image:url(" + s.src + ");background-size:" + (100 / fr).toFixed(0) + "% auto;background-position:" + px.toFixed(1) + "% " + py.toFixed(1) + "%";
  }

  A.openHidden = function () {
    var box = A.el("div", "hs"), dead = false, S = null, hintT = null;
    function scenes() { return H.scenes.filter(function (s) { return ok[s.id] !== false; }); }

    function picker() {
      S = null; box.innerHTML = "";
      box.appendChild(A.el("h2", "", A.esc(T("hs_title"))));
      var f = A.el("div", "m3fips"); f.innerHTML = '<img src="' + A.sprite("fips_wave") + '" alt=""><p class="m3say">' + A.esc(T("hs_intro")) + "</p>"; box.appendChild(f);
      box.appendChild(A.el("p", "m3pick", A.esc(T("hs_pick"))));
      var g = A.el("div", "pzpick"), stars = A.S.get().stars;
      scenes().forEach(function (s) {
        var open = stars >= s.stars, name = s.title[lang()] || s.title.de, b = A.el("button", "pzcard" + (open ? "" : " locked")); b.type = "button";
        b.setAttribute("aria-label", name + (open ? "" : ", " + T("book_locked", { n: s.stars - stars })));
        b.innerHTML = '<span class="pzthumb" style="aspect-ratio:' + s.w + "/" + s.h + ";background-image:url(" + s.src + ')"></span><span class="cn">' + A.esc(name) + '</span><span class="cs">' + A.esc(open ? "" : T("book_locked", { n: s.stars - stars })) + "</span>";
        b.addEventListener("click", function () { if (!open) { A.toast(T("book_locked", { n: s.stars - A.S.get().stars })); return; } start(s); });
        g.appendChild(b);
      });
      box.appendChild(g);
    }

    function start(s) {
      var list = pickList(s);
      S = { s: s, list: list, found: list.map(function () { return false; }), over: false };
      draw();
    }
    function remaining() { return S.found.filter(function (v) { return !v; }).length; }

    function draw() {
      var s = S.s; box.innerHTML = "";
      box.appendChild(A.el("h2", "", A.esc(s.title[lang()] || s.title.de)));
      var st = A.el("p", "hsleft", ""); st.setAttribute("role", "status"); st.setAttribute("aria-live", "polite"); box.appendChild(st);
      var wrap = A.el("div", "hswrap"); wrap.style.aspectRatio = s.w + "/" + s.h;
      var im = new Image(); im.alt = ""; im.src = s.src; im.draggable = false; wrap.appendChild(im);
      var layer = A.el("div", "hslayer"); wrap.appendChild(layer); box.appendChild(wrap);
      var msg = A.el("p", "hsmsg", ""); msg.setAttribute("role", "status"); box.appendChild(msg);
      var items = A.el("ul", "hsitems"); box.appendChild(items);
      S.list.forEach(function (t, i) {
        var li = A.el("li", "hsitem"); li.innerHTML = '<span class="hsth" style="' + thumb(s, t) + '"></span><span class="hsnm">' + A.esc(t.n[lang()] || t.n.de) + "</span>"; items.appendChild(li); t.li = li;
      });
      var bar = A.el("div", "pzbar");
      var hint = A.el("button", "btn small", A.esc(T("hs_hint"))); hint.type = "button";
      var again = A.el("button", "btn small alt", A.esc(T("hs_again"))); again.type = "button";
      var other = A.el("button", "btn small alt", A.esc(T("hs_other"))); other.type = "button";
      bar.appendChild(hint); bar.appendChild(again); bar.appendChild(other); box.appendChild(bar);
      function upd() {
        var n = remaining(); st.textContent = n ? T("hs_left", { n: n }) : "";
        S.list.forEach(function (t, i) { t.li.classList.toggle("done", S.found[i]); });
        hint.disabled = !n || S.over;
      }
      upd();
      wrap.addEventListener("click", function (e) {
        if (S.over) return;
        var r = wrap.getBoundingClientRect(), x = (e.clientX - r.left) / r.width * 100, y = (e.clientY - r.top) / r.height * 100, ratio = s.h / s.w, best = -1, bd = 1e9;
        S.list.forEach(function (t, i) { if (S.found[i]) return; var dx = x - t.x, dy = (y - t.y) * ratio, dist = Math.sqrt(dx * dx + dy * dy); if (dist <= t.r && dist < bd) { bd = dist; best = i; } });
        if (best < 0) { ripple(layer, x, y); msg.textContent = T("hs_miss"); return; }
        var t = S.list[best]; S.found[best] = true; mark(layer, t); msg.textContent = T("hs_found") + " " + (t.n[lang()] || t.n.de) + "!";
        clearTimeout(hintT); [].forEach.call(layer.querySelectorAll(".hshint"), function (h) { h.remove(); });
        upd(); if (!remaining()) win(msg);
      });
      hint.addEventListener("click", function () {
        if (S.over) return; var cand = []; S.list.forEach(function (t, i) { if (!S.found[i]) cand.push(t); }); if (!cand.length) return;
        var t = cand[Math.floor(Math.random() * cand.length)];
        [].forEach.call(layer.querySelectorAll(".hshint"), function (h) { h.remove(); });
        var h = A.el("i", "hshint"); place(h, t, 1.7); layer.appendChild(h); clearTimeout(hintT); hintT = setTimeout(function () { h.remove(); }, 3200);
      });
      again.addEventListener("click", function () { start(S.s); });
      other.addEventListener("click", picker);
      S.layer = layer; S.upd = upd;
    }
    function place(el, t, k) { var w = t.r * 2 * k; el.style.left = t.x + "%"; el.style.top = t.y + "%"; el.style.width = w + "%"; el.style.aspectRatio = "1"; }
    function mark(layer, t) { var m = A.el("i", "hsfound"); place(m, t, 1); layer.appendChild(m); }
    function ripple(layer, x, y) { var m = A.el("i", "hsmiss"); m.style.left = x + "%"; m.style.top = y + "%"; layer.appendChild(m); setTimeout(function () { m.remove(); }, 700); }

    function win(msg) {
      S.over = true;
      var got = A.awardGame(), reward = got ? T("memo_star") : T("memo_again");
      if (got) { A.toast(T("memo_star")); document.dispatchEvent(new Event("advent:stars")); document.dispatchEvent(new Event("advent:memo")); }
      S.upd();
      var ov = A.el("div", "hsend"); ov.innerHTML = '<img src="' + A.sprite("fips_wave") + '" alt=""><h3>' + A.esc(T("hs_win")) + "</h3><p>" + A.esc(reward) + "</p>";
      var bar = A.el("div", "pzbar");
      var ag = A.el("button", "btn small", A.esc(T("hs_again"))); ag.type = "button"; ag.addEventListener("click", function () { start(S.s); });
      var ot = A.el("button", "btn small alt", A.esc(T("hs_other"))); ot.type = "button"; ot.addEventListener("click", picker);
      var bk = A.el("button", "btn small alt", A.esc(T("m3_back"))); bk.type = "button"; bk.addEventListener("click", function () { A.closeModal(); });
      bar.appendChild(ag); bar.appendChild(ot); bar.appendChild(bk); ov.appendChild(bar);
      box.appendChild(ov); ag.focus();
    }

    A.openModal(box, T("hs_title"), function () { dead = true; clearTimeout(hintT); });
    picker();
  };
  probe();
})();
