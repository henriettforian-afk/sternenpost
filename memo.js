/* Wichtel-Memo: 12 Karten, 6 Paare. Pro Berliner Kalendertag gibt es einmal 2 Sternenlicht.
   Mehr als zwei Karten gleichzeitig sind nicht möglich; Nicht-Paare drehen sich nach 900 ms zurück. */
(function () {
  var A = window.Advent, T = A.T;
  var PAIRS = [
    { id: "fips", img: "fips_wave",  name: "memo_fips" },
    { id: "luni", img: "luni_stand", name: "memo_luni" },
    { id: "nik",  img: "wf_fips",    name: "memo_nik" },
    { id: "star", img: "topper",     name: "memo_star_c" },
    { id: "gift", img: "gift2",      name: "memo_gift" },
    { id: "lamp", img: "lantern",    name: "memo_lamp" }
  ];
  var DELAY = 900, STARS = 2;

  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  A.openMemo = function () {
    var box = A.el("div", "memo");
    box.appendChild(A.el("h2", "", A.esc(T("memo_title"))));
    box.appendChild(A.el("p", "memointro", A.esc(T("memo_intro"))));
    var grid = A.el("div", "memogrid");
    var status = A.el("p", "memostatus"); status.setAttribute("role", "status"); status.setAttribute("aria-live", "polite");
    var reward = A.el("p", "reward");
    var again = A.el("button", "btn small", A.esc(T("memo_new"))); again.type = "button";
    box.appendChild(grid); box.appendChild(status); box.appendChild(reward); box.appendChild(again);

    var cards, first, lock, found, closed = false;

    function label(c, i) { return c.open || c.done ? T(c.p.name) : T("memo_card", { i: i + 1 }); }
    function paint(c, i) {
      var b = c.btn;
      b.className = "memocard" + (c.open ? " open" : "") + (c.done ? " done" : "");
      b.setAttribute("aria-label", label(c, i)); b.setAttribute("aria-pressed", String(c.open || c.done));
    }

    function start() {
      first = null; lock = false; found = 0; reward.textContent = ""; box.classList.remove("finished");
      var deck = shuffle(PAIRS.concat(PAIRS).map(function (p) { return { p: p, open: false, done: false }; }));
      cards = deck; grid.innerHTML = "";
      deck.forEach(function (c, i) {
        var b = A.el("button", "memocard"); b.type = "button"; c.btn = b;
        b.innerHTML = '<span class="mface back"><img src="' + A.sprite("wf_seal") + '" alt=""></span><span class="mface front"><img src="' + A.sprite(c.p.img) + '" alt=""></span>';
        b.addEventListener("click", function () { flip(c, i); });
        grid.appendChild(b); paint(c, i);
      });
      status.textContent = T("memo_pairs", { n: 0 });
    }

    function flip(c, i) {
      if (lock || c.open || c.done) return;
      c.open = true; paint(c, i);
      if (!first) { first = { c: c, i: i }; return; }
      var a = first; first = null;
      if (a.c.p.id === c.p.id) {
        a.c.done = c.done = true; a.c.open = c.open = false; paint(a.c, a.i); paint(c, i);
        found++; status.textContent = T("memo_pairs", { n: found });
        if (found === PAIRS.length) finish();
      } else {
        lock = true;
        setTimeout(function () {
          if (closed) return;
          a.c.open = c.open = false; paint(a.c, a.i); paint(c, i); lock = false;
        }, DELAY);
      }
    }

    function finish() {
      box.classList.add("finished");
      status.textContent = T("memo_done");
      var got = A.awardGame();
      reward.textContent = got ? T("memo_star") : T("memo_again");
      if (got) { A.toast(T("memo_star")); document.dispatchEvent(new Event("advent:stars")); document.dispatchEvent(new Event("advent:memo")); }
    }

    again.addEventListener("click", start);
    start();
    A.openModal(box, T("memo_title"), function () { closed = true; });
  };
})();
