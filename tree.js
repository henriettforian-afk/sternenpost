/* Weihnachtsbaum: Schmuck auswählen, Platz am Baum antippen. Kein Ziehen nötig.
   Schmuck kann umgehängt, getauscht oder abgenommen werden (er bleibt in der Sammlung). Wird automatisch gespeichert. */
(function () {
  var A = window.Advent, T = A.T, I = A.I, TR = window.TREE;
  var box, sel = null;

  function st() { var s = A.S.get(); if (!s.tree) s.tree = {}; return s; }
  function name(o) { return I.decorName({ id: o.sprite, name: o.name }); }
  function owned(o) { return !!st().opened[o.day]; }
  function slotOf(id) { var t = st().tree; for (var k in t) if (t[k] === id) return k; return null; }
  function isTop(id) { return id === "t24"; }
  function fits(id, i) { return isTop(id) === (i === 0); }  /* Baumspitze nur ganz oben, alles andere nicht */
  function byId(id) { for (var i = 0; i < TR.ornaments.length; i++) if (TR.ornaments[i].id === id) return TR.ornaments[i]; return null; }

  function render() {
    if (!box) return;
    var s = st(), stage = box.querySelector(".treestage"), tray = box.querySelector(".treetray"), hint = box.querySelector(".treehint"), rm = box.querySelector(".treeremove");
    var h = "";
    TR.slots.forEach(function (p, i) {
      var id = s.tree[i], o = id && byId(id);
      if (o) {
        h += '<button type="button" class="tor' + (sel === o.id ? " sel" : "") + '" data-slot="' + i + '" data-sprite="' + o.sprite + '" style="left:' + p[0] + "%;top:" + p[1] + "%;width:" + o.w + '%" aria-label="' + A.esc(name(o)) + '"><img src="' + A.sprite(o.sprite) + '" alt=""></button>';
      } else if (sel && fits(sel, i)) {
        h += '<button type="button" class="tslot" data-slot="' + i + '" style="left:' + p[0] + "%;top:" + p[1] + '%" aria-label="' + A.esc(T("slot_aria", { i: i + 1, name: name(byId(sel)) })) + '"></button>';
      }
    });
    box.querySelector(".tlayer").innerHTML = h;

    var c = "";
    TR.ornaments.forEach(function (o) {
      var ok = owned(o), at = slotOf(o.id), cls = "card" + (ok ? " owned" : " poor") + (sel === o.id ? " sel" : "");
      var sub = !ok ? T("tree_door", { d: o.day }) : sel === o.id ? T("card_selected") : at !== null ? T("tree_hanging") : T("card_pick");
      c += '<button type="button" class="' + cls + '" data-id="' + o.id + '" aria-pressed="' + (sel === o.id) + '"><img src="' + A.sprite(o.sprite) + '" alt=""><span class="cn">' + A.esc(name(o)) + '</span><span class="cs">' + A.esc(sub) + "</span></button>";
    });
    tray.innerHTML = c;
    var o2 = sel && byId(sel);
    hint.textContent = o2 ? T("tree_hint_place", { name: name(o2) }) : (TR.ornaments.some(owned) ? T("tree_hint_pick") : T("tree_empty"));
    rm.hidden = !(o2 && slotOf(o2.id) !== null);
    rm.textContent = T("card_take");
  }

  function put(id, i) {
    if (!fits(id, i)) { A.toast(T(isTop(id) ? "tree_top_only" : "tree_not_top")); return; }
    var s = st(), from = slotOf(id), other = s.tree[i];
    if (from !== null) delete s.tree[from];
    s.tree[i] = id;
    if (other && other !== id && from !== null && fits(other, from)) s.tree[from] = other; /* Tausch */
    A.S.save(); sel = null; render(); A.toast(T("toast_placed"));
  }

  /* Lichterkette: Bögen aus Glühbirnchen, die abwechselnd leuchten (reine Dekoration) */
  function leds() {
    var L = TR.leds, k = 0, defs = "", h = "";
    L.colors.forEach(function (c, i) { defs += '<radialGradient id="ledg' + i + '"><stop offset="0" stop-color="#fffbe8"/><stop offset=".35" stop-color="' + c + '"/><stop offset="1" stop-color="' + c + '" stop-opacity="0"/></radialGradient>'; });
    L.swags.forEach(function (s, si) {
      h += '<path class="cord" d="M' + s.a[0] + " " + s.a[1] + " Q" + s.c[0] + " " + s.c[1] + " " + s.b[0] + " " + s.b[1] + '" fill="none"/>';
      for (var i = 0; i <= s.n; i++) {
        var t = i / s.n, x = (1 - t) * (1 - t) * s.a[0] + 2 * (1 - t) * t * s.c[0] + t * t * s.b[0], y = (1 - t) * (1 - t) * s.a[1] + 2 * (1 - t) * t * s.c[1] + t * t * s.b[1];
        x += Math.sin(k * 2.7) * 3; y += 8 + Math.cos(k * 1.9) * 2; /* leicht unregelmäßig, wie von Hand gemalt */
        var ci = k % L.colors.length;
        h += '<g class="led" style="animation-delay:' + ((k % 5) * 0.45).toFixed(2) + 's"><circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="26" fill="url(#ledg' + ci + ')" opacity=".85"/><circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="11" fill="url(#ledg' + ci + ')"/></g>'; k++;
      }
    });
    return '<svg class="tleds" viewBox="0 0 760 998" aria-hidden="true" focusable="false"><defs>' + defs + "</defs>" + h + "</svg>";
  }
  A.openTree = function () {
    box = A.el("div", "tree");
    box.innerHTML = '<h2>' + A.esc(T("tree_title")) + '</h2><p class="treehint" role="status" aria-live="polite"></p>' +
      '<div class="treestage" style="aspect-ratio:760/998"><img src="' + TR.img + '" alt="">' + leds() + '<div class="tlayer"></div></div>' +
      '<div class="treebar"><button type="button" class="btn small treeremove" hidden></button></div><div class="treetray"></div>';
    sel = null; document.body.classList.add("tree-open");
    A.openModal(box, T("tree_title"), function () { document.body.classList.remove("tree-open"); box = null; sel = null; });
    box.querySelector(".tlayer").addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      var i = +b.getAttribute("data-slot"), s = st(), id = s.tree[i];
      if (b.classList.contains("tslot")) { if (sel) put(sel, i); return; }
      if (sel && sel !== id) { put(sel, i); return; }     /* auf besetzten Platz: tauschen */
      sel = sel === id ? null : id; render();
    });
    box.querySelector(".treetray").addEventListener("click", function (e) {
      var b = e.target.closest(".card"); if (!b) return;
      var o = byId(b.getAttribute("data-id"));
      if (!owned(o)) { A.toast(T("tree_door_toast", { d: o.day })); return; }
      sel = sel === o.id ? null : o.id; render();
    });
    box.querySelector(".treeremove").addEventListener("click", function () {
      var k = sel && slotOf(sel); if (k === null || k === undefined) return;
      delete st().tree[k]; A.S.save(); sel = null; render(); A.toast(T("tree_removed"));
    });
    render();
  };
  document.addEventListener("langchange", function () { if (box) render(); });
  document.addEventListener("advent:render", function () { if (box) render(); });
})();
