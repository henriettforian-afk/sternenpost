/* Wichtelspiele: Auswahlfenster mit allen Minispielen (Liste in data/games.js). Öffnet das gewählte Spiel in einem neuen Fenster. */
(function () {
  var A = window.Advent, T = A.T, I = A.I;
  A.openHub = function () {
    var box = A.el("div", "hub"), lang = I.lang();
    box.appendChild(A.el("h2", "", A.esc(T("hub_title"))));
    box.appendChild(A.el("p", "hubsub", A.esc(T("hub_sub"))));
    box.appendChild(A.el("p", "hubinfo", A.esc(T("hub_info"))));
    var grid = A.el("div", "hubgrid");
    window.GAMES.forEach(function (g) {
      if (!A[g.open]) return;   /* nur Spiele zeigen, die wirklich vorhanden sind */
      var card = A.el("article", "hubcard"), name = g.title[lang] || g.title.de, desc = g.desc[lang] || g.desc.de;
      card.innerHTML = '<span class="hubimg"><img src="assets/adv/hub_' + g.id + '.png" alt=""></span><h3>' + A.esc(name) + "</h3><p>" + A.esc(desc) + "</p>";
      /* eigenes Symbol assets/adv/hub_<id>.png, falls vorhanden; sonst das bisherige Bild (ganz sichtbar, nicht beschnitten) */
      (function (im, fallback) { im.onerror = function () { im.onerror = null; im.src = fallback; im.parentNode.classList.add("fallback"); }; })(card.querySelector("img"), g.img);
      var b = A.el("button", "btn small", A.esc(T("hub_play"))); b.type = "button"; b.setAttribute("aria-label", T("hub_play") + ": " + name);
      b.addEventListener("click", function () { A.closeModal(); setTimeout(function () { A[g.open](); }, 30); });
      card.appendChild(b); grid.appendChild(card);
    });
    box.appendChild(grid);
    A.openModal(box, T("hub_title"), function () {});
  };
})();