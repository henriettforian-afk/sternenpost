/* Luni als kleiner Helfer unten links (wie Fips unten rechts). Erscheint ab 18 Sternenlicht und nur, wenn die Bilder
   assets/adv/luni_helper.png und luni_helper2.png vorhanden sind. Lässt sich getrennt von Fips ausblenden. Spricht nur nach dem Antippen. */
(function () {
  var A = window.Advent, T = A.T, NEED = 18;
  var ok = false, root = null, img = null, bubble = null, btext = null, timer = null, gen = 0, built = false, backBtn = null;

  function st() { var s = A.S.get(); if (!s.luni) s.luni = { hidden: false }; return s; }
  function hideBubble() { if (bubble) bubble.hidden = true; clearTimeout(timer); }
  function say() {
    var text = (gen++ % 4 === 0) ? T(["luni_g1", "luni_g2", "luni_g3", "luni_g4"][Math.floor(gen / 4) % 4]) : (window.HelperTalk ? window.HelperTalk.next("luni") : T("luni_g1"));
    btext.textContent = text; bubble.hidden = false; clearTimeout(timer); timer = setTimeout(hideBubble, Math.max(9000, text.length * 85));
  }
  function build() {
    if (built) return; built = true;
    root = A.el("div", "lunihelper"); root.hidden = true;
    root.innerHTML = '<div class="lunibubble" role="status" hidden><p></p><button type="button" class="link lunihide"></button></div><button type="button" class="lunibtn"><img src="' + A.sprite("luni_helper") + '" alt=""></button>';
    bubble = root.querySelector(".lunibubble"); btext = bubble.querySelector("p"); img = root.querySelector("img");
    root.querySelector(".lunibtn").addEventListener("click", function () { if (!bubble.hidden) hideBubble(); else say(); });
    root.querySelector(".lunihide").addEventListener("click", function () { st().luni.hidden = true; A.S.save(); hideBubble(); refresh(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !bubble.hidden) hideBubble(); });
    document.body.appendChild(root);
    /* Link zum Zurückholen neben dem von Fips */
    backBtn = A.el("button", "link", ""); backBtn.type = "button"; backBtn.id = "lunisback"; backBtn.hidden = true;
    backBtn.addEventListener("click", function () { st().luni.hidden = false; A.S.save(); refresh(); });
    var fb = A.$("fipsback"); if (fb && fb.parentNode) { fb.parentNode.insertBefore(backBtn, fb.nextSibling); fb.parentNode.insertBefore(document.createElement("br"), backBtn); }
    if (!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches)) {
      setInterval(function () { if (root.hidden) return; img.src = A.sprite("luni_helper2"); setTimeout(function () { img.src = A.sprite("luni_helper"); }, 1800); }, 17000);
    }
  }
  function refresh() {
    if (!ok) return; build();
    var s = st(), unlocked = s.stars >= NEED, on = unlocked && !s.luni.hidden;
    root.hidden = !on; if (!on) hideBubble();
    backBtn.hidden = !(unlocked && s.luni.hidden);
    root.querySelector(".lunibtn").setAttribute("aria-label", T("luni_aria"));
    root.querySelector(".lunihide").textContent = T("luni_hide"); backBtn.textContent = T("luni_back");
  }
  var a = new Image(), b = new Image(), got = 0;
  function loaded() { if (++got === 2) { ok = true; refresh(); } }
  a.onload = loaded; b.onload = loaded; a.src = A.sprite("luni_helper"); b.src = A.sprite("luni_helper2");
  document.addEventListener("advent:stars", refresh);
  document.addEventListener("advent:render", refresh);
  document.addEventListener("langchange", refresh);
})();