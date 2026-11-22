/* Sternenbuch: Belohnungen, die sich mit der Zahl der gesammelten Sternenlichter öffnen (nichts wird ausgegeben).
   Inhalte stehen in data/book.js. */
(function () {
  var A = window.Advent, T = A.T, I = A.I, R = window.BOOK.rewards;
  var btn = A.$("btnBook");
  var audioEl = null, box = null, cur = null;

  function lang() { return I.lang(); }
  function title(r) { return r.title[lang()] || r.title.de; }
  function st() { var s = A.S.get(); if (!s.book) s.book = { notified: {}, seen: {} }; return s; }
  function open(r) { return A.S.get().stars >= r.stars; }
  function stopAudio() { if (audioEl) { audioEl.pause(); audioEl = null; } }
  function typeName(r) { return T({ story: "book_story", audio: "book_audio", card: "book_card", certificate: "book_cert", helper: "book_helper" }[r.type]); }

  function refreshDot() {
    var s = st(), news = R.some(function (r) { return open(r) && !s.book.seen[r.id]; });
    btn.classList.toggle("has-news", news);
  }
  function notify() {
    var s = st(), fresh = [];
    R.forEach(function (r) { if (open(r) && !s.book.notified[r.id]) { s.book.notified[r.id] = true; fresh.push(r); } });
    if (fresh.length) { A.S.save(); A.toast(T("book_new_toast")); }
    refreshDot();
  }

  /* ---------- Liste ---------- */
  function showList() {
    cur = null; stopAudio();
    box.innerHTML = "";
    box.appendChild(A.el("h2", "", A.esc(T("book_title"))));
    box.appendChild(A.el("p", "bookstars", "✦ " + A.S.get().stars + " " + A.esc(T("light_unit"))));
    var grid = A.el("div", "booklist"), s = st();
    R.forEach(function (r) {
      var o = open(r), isNew = o && !s.book.seen[r.id];
      var b = A.el("button", "bookitem" + (o ? " open" : " locked") + (isNew ? " new" : "")); b.type = "button";
      b.setAttribute("aria-label", title(r) + ", " + (o ? typeName(r) : T("book_locked", { n: r.stars - s.stars })));
      b.innerHTML = '<span class="bstar">★ ' + r.stars + '</span><span class="btitle">' + A.esc(o ? title(r) : "? ? ?") + '</span><span class="btype">' + A.esc(o ? typeName(r) : T("book_locked", { n: Math.max(0, r.stars - s.stars) })) + "</span>";
      b.addEventListener("click", function () {
        if (!o) { A.toast(T("book_locked", { n: r.stars - A.S.get().stars })); return; }
        s.book.seen[r.id] = true; A.S.save(); refreshDot(); view(r);
      });
      grid.appendChild(b);
    });
    box.appendChild(grid);
  }

  /* ---------- Einzelansichten ---------- */
  function backBtn() { var b = A.el("button", "btn small", A.esc("← " + T("book_back"))); b.type = "button"; b.addEventListener("click", showList); return b; }
  function head(r) { var h = A.el("div", "bookhead"); h.appendChild(A.el("h2", "", A.esc(title(r)))); return h; }
  /* Große Ansicht: Illustration antippen, zum Schließen irgendwo tippen, ✕ oder Esc */
  function zoom(src, alt) {
    var ov = A.el("div", "zoomov"); ov.setAttribute("role", "dialog"); ov.setAttribute("aria-modal", "true"); ov.setAttribute("aria-label", alt);
    var im = new Image(); im.alt = ""; im.src = src; ov.appendChild(im);
    var cb = A.el("button", "zoomx", "✕"); cb.type = "button"; cb.setAttribute("aria-label", T("book_zoom_close")); ov.appendChild(cb);
    var prevFocus = document.activeElement;
    function close() { document.removeEventListener("keydown", key, true); ov.remove(); if (prevFocus && prevFocus.focus) prevFocus.focus(); }
    function key(e) { if (e.key === "Escape") { e.stopPropagation(); e.preventDefault(); close(); } else if (e.key === "Tab") { e.preventDefault(); cb.focus(); } }
    ov.addEventListener("click", close); document.addEventListener("keydown", key, true);
    document.body.appendChild(ov); cb.focus();
  }
  /* kleine animierte Szene (falls es für die Geschichte noch kein eigenes Bild gibt): Schnee fällt, Vogel pickt und hüpft, Luni und Fips schauen zu */
  function animScene(kind) {
    var w = A.el("div", "animscene");
    if (kind === "robin") {
      w.innerHTML = '<img class="as-snow" src="assets/adv/deco_snow.png" alt="">' +
        '<img class="as-luni" src="assets/adv/luni_stand.png" alt=""><img class="as-fips" src="assets/adv/fips_think.png" alt="">' +
        '<img class="as-house" src="assets/adv/birdhouse.png" alt=""><img class="as-robin" src="assets/adv/robin.png" alt="">';
    }
    var flakes = A.el("div", "as-flakes");
    for (var i = 0; i < 26; i++) {
      var f = A.el("i", ""); f.style.left = (Math.random() * 100).toFixed(1) + "%"; var sz = 3 + Math.random() * 4;
      f.style.width = f.style.height = sz.toFixed(1) + "px"; f.style.animationDuration = (6 + Math.random() * 6).toFixed(1) + "s"; f.style.animationDelay = (-Math.random() * 10).toFixed(1) + "s"; flakes.appendChild(f);
    }
    w.appendChild(flakes); return w;
  }
  function art(r) {
    var w = A.el("div", "bookart"), im = new Image(); im.alt = "";
    if (r.type === "story") { /* eigene Illustration: assets/adv/story_<id>.jpg (auch .webp oder .gif, auch animiert); sonst animierte Szene oder die kleine Figur */
      var base = "assets/adv/story_" + r.id, exts = [".jpg", ".webp", ".gif"], n = 0, zb = A.el("button", "zoombtn"); zb.type = "button";
      var cur = base + exts[0];
      zb.setAttribute("aria-label", T("book_zoom", { t: title(r) }));
      zb.addEventListener("click", function () { zoom(cur, title(r)); });
      w.classList.add("sceneart");
      im.onerror = function () {
        n++; if (n < exts.length) { cur = base + exts[n]; im.src = cur; return; }
        im.onerror = null; w.classList.remove("sceneart"); w.innerHTML = "";
        if (r.scene) { w.classList.add("animart"); w.appendChild(animScene(r.scene)); return; }
        var f = new Image(); f.alt = ""; f.src = A.sprite(r.art); w.appendChild(f);
      };
      im.src = cur; zb.appendChild(im); zb.appendChild(A.el("span", "zoomhint", "⤢")); w.appendChild(zb); return w;
    }
    im.src = A.sprite(r.art); w.appendChild(im); return w;
  }
  /* ---------- Geschichte als Bilderbuch mit Seiten ---------- */
  var PAGE_CHARS = 640;
  function paras(r) { var L = lang(), tx = window.BOOK_TX && window.BOOK_TX[L]; return (L !== "de" && tx && tx[r.id]) || r.paragraphs; }
  function paginate(ps) {
    var pages = [], cur = [], n = 0;
    ps.forEach(function (p) {
      if (cur.length && n + p.length > PAGE_CHARS) { pages.push(cur); cur = []; n = 0; }
      cur.push(p); n += p.length;
    });
    if (cur.length) pages.push(cur);
    return pages;
  }
  var pageNo = 0;
  function storyView(r) {
    var pages = paginate(paras(r)), total = pages.length, diary = r.id === "tagebuch1" || r.id === "paket";
    if (pageNo >= total) pageNo = 0;
    var book = A.el("div", "storybook" + (diary ? " diary" : ""));
    var page = A.el("div", "spage"), ctrl = A.el("div", "spctrl");
    var prev = A.el("button", "btn small", "← " + A.esc(T("book_prev"))), next = A.el("button", "btn small", A.esc(T("book_next")) + " →");
    prev.type = next.type = "button";
    var ind = A.el("span", "spind"); ind.setAttribute("aria-live", "polite");
    var dots = A.el("div", "spdots"); dots.setAttribute("aria-hidden", "true");
    function draw(dir) {
      page.innerHTML = "";
      page.className = "spage" + (dir ? " turn" + dir : "");
      if (pageNo === 0) {
        var rb = A.el("div", "ribbon", A.esc(title(r))); page.appendChild(rb);
        page.appendChild(art(r));
        page.appendChild(A.el("div", "sdiv", "✦ ✦ ✦"));
      }
      pages[pageNo].forEach(function (p, i) {
        var pe = A.el("p", pageNo === 0 && i === 0 && !diary ? "dropcap" : "", A.esc(p)); page.appendChild(pe);
      });
      if (pageNo === total - 1) page.appendChild(A.el("div", "send", "✦ " + A.esc(T("book_end")) + " ✦"));
      ind.textContent = T("book_page", { n: pageNo + 1, m: total });
      prev.disabled = pageNo === 0; next.disabled = pageNo === total - 1;
      dots.innerHTML = ""; for (var k = 0; k < total; k++) dots.appendChild(A.el("i", k === pageNo ? "on" : ""));
    }
    function go(n) {
      if (n < 0 || n >= total || n === pageNo) return;
      var dir = n > pageNo ? "n" : "p"; pageNo = n; draw(dir); box.scrollTop = 0;
      var mc = box.closest(".mcard"); if (mc) mc.scrollTop = 0;
    }
    prev.addEventListener("click", function () { go(pageNo - 1); });
    next.addEventListener("click", function () { go(pageNo + 1); });
    book.addEventListener("keydown", function (e) { if (e.key === "ArrowRight") go(pageNo + 1); else if (e.key === "ArrowLeft") go(pageNo - 1); });
    book.tabIndex = 0;
    book.setAttribute("lang", lang());
    ctrl.appendChild(prev); ctrl.appendChild(ind); ctrl.appendChild(next);
    book.appendChild(page); book.appendChild(ctrl); book.appendChild(dots);
    box.appendChild(book); draw("");
  }
  function view(r) {
    if (!cur || cur.id !== r.id) pageNo = 0; cur = r;
    stopAudio(); box.innerHTML = ""; box.appendChild(head(r));
    if (r.type === "story") {
      storyView(r);
    } else if (r.type === "audio") {
      box.appendChild(art(r));
      var row = A.el("div", "audiorow"), pb = A.el("button", "btn", A.esc(T("audio_play"))); pb.type = "button";
      var msg = A.el("p", "audiomsg"); msg.setAttribute("role", "status");
      pb.addEventListener("click", function () {
        msg.textContent = "";
        if (audioEl && !audioEl.paused) { audioEl.pause(); pb.textContent = T("audio_resume"); return; }
        if (!audioEl) {
          audioEl = new Audio(r.audio[lang()] || r.audio.de);
          audioEl.addEventListener("ended", function () { pb.textContent = T("audio_again"); audioEl = null; });
          audioEl.addEventListener("error", function () { msg.textContent = T("audio_err_load"); pb.textContent = T("audio_play"); audioEl = null; });
        }
        var p = audioEl.play(); pb.textContent = T("audio_pause");
        if (p && p.catch) p.catch(function () { msg.textContent = T("audio_err_play"); pb.textContent = T("audio_play"); audioEl = null; });
      });
      row.appendChild(pb); row.appendChild(msg); box.appendChild(row);
      var tx = A.el("div", "booktext"); tx.appendChild(A.el("p", "", A.esc(r.text[lang()] || r.text.de))); box.appendChild(tx);
    } else if (r.type === "card") {
      var fig = A.el("figure", "postcard"), im = new Image(); im.alt = ""; im.src = "assets/adv/postkarte.jpg"; fig.appendChild(im);
      var cap = A.el("figcaption", "", A.esc(r.text[lang()] || r.text.de).replace(/\n/g, "<br>")); fig.appendChild(cap); box.appendChild(fig);
    } else if (r.type === "certificate") {
      var c = r.cert[lang()] || r.cert.de, cert = A.el("div", "cert");
      cert.innerHTML = '<img class="certseal" src="' + A.sprite("wf_seal") + '" alt=""><h3>' + A.esc(c.head) + '</h3><p class="csub">' + A.esc(c.sub) + "</p><p>" + A.esc(c.body) + '</p><p class="cfoot">' + A.esc(c.foot) + "</p>";
      box.appendChild(cert);
      var pr = A.el("button", "btn small noprint", A.esc(T("book_print"))); pr.type = "button"; pr.addEventListener("click", function () { window.print(); });
      box.appendChild(pr);
    } else if (r.type === "helper") {
      box.appendChild(art(r));
      box.appendChild(A.el("p", "booktext", A.esc(T("fips_welcome"))));
      var hb = A.el("button", "btn small", ""); hb.type = "button";
      function lab() { hb.textContent = st().fips.hidden ? T("fips_back") : T("book_fips_shown"); }
      lab();
      hb.addEventListener("click", function () { var s = st(); s.fips.hidden = !s.fips.hidden; A.S.save(); document.dispatchEvent(new Event("advent:stars")); lab(); });
      box.appendChild(hb);
    }
    var nav = A.el("div", "booknav"); nav.appendChild(backBtn()); box.appendChild(nav);
  }

  A.openBook = function () {
    box = A.el("div", "book");
    A.openModal(box, T("book_title"), function () { stopAudio(); box = null; });
    showList();
  };
  btn.addEventListener("click", function () { A.openBook(); });
  document.addEventListener("advent:stars", notify);
  document.addEventListener("advent:render", function () { refreshDot(); });
  document.addEventListener("langchange", function () { refreshDot(); if (box && cur) view(cur); else if (box) showList(); });
  refreshDot(); notify();
})();
