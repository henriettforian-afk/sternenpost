/* Fips, der kleine Helfer: erscheint ab 18 Sternenlicht unten rechts.
   Er spricht nur, wenn man ihn antippt (nur die Begrüßung kommt einmal von selbst).
   Er lässt sich ausblenden; die Einstellung wird gespeichert. */
(function () {
  var A = window.Advent, T = A.T;
  var NEED = 18;
  var root = A.$("fipshelper"), btn = A.$("fipsbtn"), img = A.$("fipsimg"), bubble = A.$("fipsbubble"), btext = A.$("fipstext"), bhide = A.$("fipshide"), back = A.$("fipsback");
  var pending = null, timer = null, generic = 0;
  /* Eigene Bilder für Fips als Helfer (assets/adv/fips_helper.png und fips_helper2.png) werden automatisch benutzt.
     Ohne sie: die bisherigen Bilder, gespiegelt, damit Fips zum Spieler (nach links) schaut. */
  var POSE_A = "fips_wave", POSE_B = "fips_think";
  (function () {
    var a = new Image(), b = new Image(), got = 0;
    function ok() { if (++got === 2) { POSE_A = "fips_helper"; POSE_B = "fips_helper2"; img.classList.remove("flip"); img.src = A.sprite(POSE_A); } }
    a.onload = ok; b.onload = ok; a.src = A.sprite("fips_helper"); b.src = A.sprite("fips_helper2");
    img.classList.add("flip");
  })();

  function st() { var s = A.S.get(); if (!s.fips) s.fips = { hidden: false, welcomed: false }; return s; }
  function unlockedNow() { return st().stars >= NEED; }
  function say(text, ms) {
    btext.textContent = text; bubble.hidden = false; root.classList.remove("has-news");
    clearTimeout(timer); timer = setTimeout(hideBubble, ms || Math.max(9000, String(text).length * 85));
  }
  function hideBubble() { bubble.hidden = true; clearTimeout(timer); }

  function refresh() {
    var s = st(), on = unlockedNow();
    root.hidden = !on || s.fips.hidden;
    back.hidden = !(on && s.fips.hidden);
    if (on && !s.fips.welcomed && !s.fips.hidden) { s.fips.welcomed = true; A.S.save(); say(T("fips_welcome"), 12000); }
    /* Weihnachtswunsch: unabhängig vom Antippen, kommt genau einmal von selbst, wenn die 24. Tür offen ist */
    if (on && !s.fips.hidden && s.fips.welcomed && !s.fips.dec24Said && A.unlocked() >= 24 && A.nowDate().getDate() >= 24) { s.fips.dec24Said = true; A.S.save(); say(T("fips_dec24"), 12000); }
    btn.setAttribute("aria-label", T("fips_aria"));
    bhide.textContent = T("fips_hide"); back.textContent = T("fips_back");
    document.dispatchEvent(new Event("advent:helpers"));   /* Luni richtet sich nach Fips */
  }

  function message() {
    if (pending === "memo") { pending = null; return T("fips_memo"); }
    var unl = A.unlocked(), s = A.S.get();
    for (var d = 1; d <= unl; d++) if (!s.opened[d]) return T("fips_newday");
    if (document.body.classList.contains("tree-open")) return T("fips_tree");
    var n = generic++, g = ["fips_g1", "fips_g2", "fips_g3"];
    return (n % 3 === 0 || !window.HelperTalk) ? T(g[Math.floor(n / 3) % g.length]) : window.HelperTalk.next("fips");
  }

  btn.addEventListener("click", function () { if (!bubble.hidden) { hideBubble(); return; } say(message()); });
  bhide.addEventListener("click", function () { var s = st(); s.fips.hidden = true; A.S.save(); hideBubble(); refresh(); });
  back.addEventListener("click", function () { var s = st(); s.fips.hidden = false; A.S.save(); refresh(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !bubble.hidden) hideBubble(); });
  document.addEventListener("advent:stars", refresh);
  document.addEventListener("advent:render", refresh);
  document.addEventListener("advent:memo", function () { pending = "memo"; if (!root.hidden) root.classList.add("has-news"); });

  /* kleines Winken ab und zu (nur ohne reduzierte Bewegung) */
  if (!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches)) {
    setInterval(function () {
      if (root.hidden) return;
      img.src = A.sprite(POSE_B); setTimeout(function () { img.src = A.sprite(POSE_A); }, 1800);
    }, 14000);
  }
  refresh();
})();
