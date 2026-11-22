/* Wichtel-Trio: reine Spiellogik (kein DOM). Lapkák: { id, k (Art 0..7), x, y (links/oben in Einheiten, 1 Einheit = Kartenbreite), l (Ebene) }.
   Eine Karte ist frei, wenn keine nicht genommene Karte einer höheren Ebene sie überdeckt. Die Leiste fasst 7 Karten; drei gleiche verschwinden. */
(function () {
  var KINDS = 8, CAP = 7, uid = 0;
  function rnd(n, rng) { return Math.floor((rng || Math.random)() * n); }
  function shuffle(a, rng) { for (var i = a.length - 1; i > 0; i--) { var j = rnd(i + 1, rng), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function tile(k, x, y, l) { return { id: ++uid, k: k, x: x, y: y, l: l }; }

  /* ---- Pläne ---- */
  /* Leicht: 18 Karten, 6 Arten zu je 3, alle frei, auf einem 5×4-Raster (18 von 20 Plätzen) mit kleinem Versatz */
  function makeEasy(rng) {
    var kinds = shuffle([0, 1, 2, 3, 4, 5, 6, 7], rng).slice(0, 6), list = [];
    kinds.forEach(function (k) { list.push(k, k, k); });
    shuffle(list, rng);
    var slots = []; for (var j = 0; j < 4; j++) for (var i = 0; i < 5; i++) slots.push([i, j]);
    shuffle(slots, rng); slots = slots.slice(0, 18);
    var tiles = list.map(function (k, n) {
      var s = slots[n]; return tile(k, 0.15 + s[0] * 1.3 + (((rng || Math.random)() - 0.5) * 0.18), 0.15 + s[1] * 1.3 + (((rng || Math.random)() - 0.5) * 0.18), 0);
    });
    return { tiles: tiles, W: 6.5, H: 5.2 };
  }
  /* Mittel: 24 Karten (8 Arten zu je 3) in zwei Ebenen: 4×4 unten, 8 von 9 Plätzen oben, halb versetzt */
  function layoutMedium(rng, cfg) {
    var pos = [], i, j, sp = 1.35; cfg = cfg || {};
    for (j = 0; j < 4; j++) for (i = 0; i < 4; i++) pos.push({ x: 0.3 + i * sp, y: 0.3 + j * sp, l: 0 });
    var top = []; for (j = 0; j < 3; j++) for (i = 0; i < 3; i++) top.push({ x: 0.3 + (i + 0.5) * sp, y: 0.3 + (j + 0.5) * sp, l: 1 });
    var keep = (cfg && cfg.top) || 8; while (top.length > keep) top.splice(rnd(top.length, rng), 1);
    return { pos: pos.concat(top), W: 5.65, H: 5.65 };
  }
  function overlapArea(a, b) { var dx = Math.min(a.x, b.x) + 1 - Math.max(a.x, b.x), dy = Math.min(a.y, b.y) + 1 - Math.max(a.y, b.y); return dx > 0 && dy > 0 ? dx * dy : 0; }
  function coverMap(tiles) {
    return tiles.map(function (t) { var c = []; tiles.forEach(function (o, j) { if (o !== t && o.l > t.l && overlapArea(t, o) > 0.04) c.push(j); }); return c; });
  }
  function isFree(plan, i) { var t = plan.tiles[i]; if (t.taken) return false; return plan.cover[i].every(function (j) { return plan.tiles[j].taken; }); }

  /* Lösbarkeit: Zustand = Menge der genommenen Karten; die Leiste ergibt sich daraus (pro Art: genommen mod 3). Tiefensuche mit Merkliste. */
  function solvable(plan, limit) {
    var n = plan.tiles.length, cover = plan.cover, kinds = plan.tiles.map(function (t) { return t.k; }), seen = new Set(), steps = 0, LIM = limit || 400000;
    var cnt = new Array(KINDS).fill(0);
    function barSize() { var s = 0; for (var k = 0; k < KINDS; k++) s += cnt[k] % 3; return s; }
    function dfs(mask, left) {
      if (!left) return true;
      if (seen.has(mask)) return false;
      if (++steps > LIM) return false;
      var cand = [];
      for (var i = 0; i < n; i++) {
        if (mask & (1 << i)) continue;
        var ok = true; for (var c = 0; c < cover[i].length; c++) if (!(mask & (1 << cover[i][c]))) { ok = false; break; }
        if (ok) cand.push(i);
      }
      cand.sort(function (a, b) { return (cnt[kinds[b]] % 3) - (cnt[kinds[a]] % 3); });
      for (var q = 0; q < cand.length; q++) {
        var t = cand[q], k = kinds[t]; cnt[k]++;
        var fits = barSize() <= CAP;
        if (fits && dfs(mask | (1 << t), left - 1)) { cnt[k]--; return true; }
        cnt[k]--;
      }
      seen.add(mask); return false;
    }
    var r = dfs(0, n); return r;
  }
  var MED = { top: 8, counts: [3, 3, 3, 3, 6, 6] };   /* Karten pro Art (6 Arten, summiert 24); per Simulation gewählt: ein einfacher Spieler schafft ~50 %, ein kluger ~99 % */
  function makeMedium(rng, cfg) {
    cfg = cfg || MED;
    for (var tries = 0; tries < 40; tries++) {
      var lay = layoutMedium(rng, cfg), list = cfg.counts.reduce(function (a, c, k) { for (var q = 0; q < c; q++) a.push(k); return a; }, []); shuffle(list, rng);
      var tiles = lay.pos.map(function (p, i) { return tile(list[i], p.x, p.y, p.l); });
      var plan = { tiles: tiles, W: lay.W, H: lay.H, cover: coverMap(tiles) };
      if (solvable(plan)) return plan;
    }
    return null;
  }
  function make(level, rng) {
    if (level === "easy") { var p = makeEasy(rng); p.cover = p.tiles.map(function () { return []; }); return p; }
    return makeMedium(rng);
  }

  /* ---- Leiste ---- */
  /* Karte in die Leiste: neben gleiche Art einfügen, sonst hinten. Gibt die verschwindenden Karten zurück (wenn drei gleiche). */
  function addToBar(bar, t) {
    var idx = -1; for (var i = 0; i < bar.length; i++) if (bar[i].k === t.k) idx = i;
    if (idx >= 0) bar.splice(idx + 1, 0, t); else bar.push(t);
    var same = bar.filter(function (b) { return b.k === t.k; });
    if (same.length >= 3) { same = same.slice(0, 3); same.forEach(function (s) { bar.splice(bar.indexOf(s), 1); }); return same; }
    return null;
  }
  function barFull(bar) { return bar.length >= CAP; }

  window.TR = { KINDS: KINDS, CAP: CAP, make: make, makeEasy: makeEasy, makeMedium: makeMedium, coverMap: coverMap, isFree: isFree, solvable: solvable, addToBar: addToBar, barFull: barFull, tile: tile };
})();
