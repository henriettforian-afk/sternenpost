/* Sternenpuzzle: Bild in n×n Felder, zwei Felder antippen = tauschen. Kein Ziehen nötig.
   Pro Berliner Tag gibt es für das erste gelöste Puzzle ODER Memo einmal 2 Sternenlicht (A.awardGame). */
(function () {
  var A = window.Advent, T = A.T, I = A.I, P = window.PUZZLE;
  var lang = function () { return I.lang(); };
  var ok = {};   /* id -> true, wenn Bild ladbar */

  function st() { var s = A.S.get(); if (!s.puzzle) s.puzzle = { done: {} }; return s; }
  function shuffle(n) {
    var a = []; for (var i = 0; i < n * n; i++) a.push(i);
    do { for (var k = a.length - 1; k > 0; k--) { var j = Math.floor(Math.random() * (k + 1)), t = a[k]; a[k] = a[j]; a[j] = t; } }
    while (solved(a));
    return a;
  }
  function solved(a) { return a.every(function (v, i) { return v === i; }); }

  /* Bilder: die Puzzle-Bilder plus die Illustrationen der Sternenbuch-Geschichten (gleiche Freischaltung wie die Geschichte) */
  function imgs() {
    var out = P.images.slice();
    if (window.BOOK) window.BOOK.rewards.forEach(function (r) {
      if (r.type === "story") out.push({ id: "s_" + r.id, src: "assets/adv/story_" + r.id + ".jpg", w: 1536, h: 1024, stars: r.stars, title: r.title });
    });
    return out;
  }
  function probe() {
    imgs().forEach(function (im) { var x = new Image(); x.onload = function () { ok[im.id] = true; }; x.onerror = function () { ok[im.id] = false; }; x.src = im.src; });
  }

  A.openPuzzle = function () {
    var box = A.el("div", "puzzle"), img = null, n = (P.grids.indexOf(st().puzzle.grid) >= 0 ? st().puzzle.grid : P.grids[0]), order = [], sel = -1, done = false, preview = false;
    function show() { return imgs().filter(function (im) { return ok[im.id] !== false; }); }

    function picker() {
      box.innerHTML = "";
      box.appendChild(A.el("h2", "", A.esc(T("pz_title"))));
      box.appendChild(A.el("p", "pzintro", A.esc(T("pz_pick"))));
      if (P.grids.length > 1) {
        var lv = A.el("div", "pzlevels"); lv.setAttribute("role", "group"); lv.setAttribute("aria-label", T("pz_level"));
        P.grids.forEach(function (g) {
          var b = A.el("button", "pzlvl" + (g === n ? " on" : ""), A.esc(T("pz_d" + g)) + "<small>" + g + "×" + g + "</small>"); b.type = "button"; b.setAttribute("aria-pressed", String(g === n));
          b.addEventListener("click", function () { n = g; st().puzzle.grid = g; A.S.save(); picker(); });
          lv.appendChild(b);
        });
        box.appendChild(lv);
      }
      var g = A.el("div", "pzpick"), stars = A.S.get().stars;
      show().forEach(function (im) {
        var open = stars >= im.stars, b = A.el("button", "pzcard" + (open ? "" : " locked") + (st().puzzle.done[im.id] ? " solved" : "")); b.type = "button";
        var name = im.title[lang()] || im.title.de;
        b.setAttribute("aria-label", name + (open ? "" : ", " + T("book_locked", { n: im.stars - stars })));
        b.innerHTML = '<span class="pzthumb" style="aspect-ratio:' + im.w + "/" + im.h + ';background-image:url(' + im.src + ')"></span><span class="cn">' + A.esc(name) + '</span><span class="cs">' +
          A.esc(open ? (st().puzzle.done[im.id] ? "✦ " + T("pz_solved") : "") : T("book_locked", { n: im.stars - stars })) + "</span>";
        b.addEventListener("click", function () { if (!open) { A.toast(T("book_locked", { n: im.stars - A.S.get().stars })); return; } play(im); });
        g.appendChild(b);
      });
      box.appendChild(g);
    }

    function play(im) { img = im; order = shuffle(n); sel = -1; done = false; preview = false; draw(); }

    function draw() {
      box.innerHTML = "";
      box.appendChild(A.el("h2", "", A.esc(img.title[lang()] || img.title.de)));
      var hint = A.el("p", "pzintro", A.esc(done ? "" : T("pz_hint"))); hint.setAttribute("role", "status"); hint.setAttribute("aria-live", "polite"); box.appendChild(hint);
      var board = A.el("div", "pzboard"); board.style.aspectRatio = img.w + "/" + img.h; board.style.gridTemplateColumns = "repeat(" + n + ",1fr)";
      if (preview) { board.classList.add("preview"); board.style.backgroundImage = "url(" + img.src + ")"; }
      else order.forEach(function (piece, pos) {
        var b = A.el("button", "pzpiece" + (sel === pos ? " sel" : "") + (piece === pos ? " right" : "")); b.type = "button";
        var c = piece % n, r = Math.floor(piece / n);
        b.style.backgroundImage = "url(" + img.src + ")"; b.style.backgroundSize = n * 100 + "% " + n * 100 + "%";
        b.style.backgroundPosition = (n > 1 ? c / (n - 1) * 100 : 0) + "% " + (n > 1 ? r / (n - 1) * 100 : 0) + "%";
        b.setAttribute("aria-label", T("pz_piece", { i: pos + 1, n: n * n }));
        b.disabled = done;
        b.addEventListener("click", function () { tap(pos); });
        board.appendChild(b);
      });
      box.appendChild(board);
      var msg = A.el("p", "pzmsg", ""); msg.setAttribute("role", "status"); box.appendChild(msg);
      var bar = A.el("div", "pzbar");
      var again = A.el("button", "btn small", A.esc(T("pz_again"))); again.type = "button"; again.addEventListener("click", function () { play(img); });
      var pv = A.el("button", "btn small alt", A.esc(T(preview ? "pz_hidepv" : "pz_preview"))); pv.type = "button"; pv.disabled = done;
      pv.addEventListener("click", function () { preview = !preview; sel = -1; draw(); });
      var other = A.el("button", "btn small alt", A.esc(T("pz_other"))); other.type = "button"; other.addEventListener("click", picker);
      bar.appendChild(again); bar.appendChild(pv);
      if (show().length > 1) bar.appendChild(other);
      box.appendChild(bar);
      if (done) { box.classList.add("finished"); msg.innerHTML = A.esc(T("pz_win")) + "<br>" + A.esc(reward); } else box.classList.remove("finished");
    }
    var reward = "";

    function tap(pos) {
      if (done) return;
      if (sel < 0) { sel = pos; draw(); return; }
      if (sel === pos) { sel = -1; draw(); return; }
      var t = order[sel]; order[sel] = order[pos]; order[pos] = t; sel = -1;
      if (solved(order)) finish(); else draw();
    }
    function finish() {
      done = true; st().puzzle.done[img.id] = true; A.S.save();
      var got = A.awardGame();
      reward = got ? T("memo_star") : T("memo_again");
      if (got) { A.toast(T("memo_star")); document.dispatchEvent(new Event("advent:stars")); document.dispatchEvent(new Event("advent:memo")); }
      draw();
    }

    A.openModal(box, T("pz_title"), function () { box = null; });
    var list = show();
    if (list.length > 1) picker(); else play(list[0]);
    document.addEventListener("langchange", function h() { if (!box || !box.isConnected) { document.removeEventListener("langchange", h); return; } if (img && order.length) draw(); else picker(); });
  };
  probe();
})();
