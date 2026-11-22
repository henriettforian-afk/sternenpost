/* Sternenzauber: reine Spiellogik (kein DOM, keine Animation). Wird von match3.js angezeigt und von Tests geprüft.
   Brett: board[r][c] = { id, k } (k = Art 0..4) oder null. */
(function () {
  var SIZE = 6, KINDS = 5, uid = 0;

  function rnd(n, rng) { return Math.floor((rng || Math.random)() * n); }
  function tile(k) { return { id: ++uid, k: k }; }
  function kAt(b, r, c) { var t = b[r] && b[r][c]; return t ? t.k : -1; }
  function empty(n) { var b = []; for (var r = 0; r < n; r++) { b.push([]); for (var c = 0; c < n; c++) b[r].push(null); } return b; }

  /* Alle Dreier-, Vierer-, Fünfer-Reihen. cells: jede Zelle nur einmal (auch an Kreuzungen); runs: jede Reihe einzeln (für die Punkte). */
  function findMatches(b) {
    var n = b.length, runs = [], seen = {}, cells = [], r, c, e, k, len, i, run;
    function addRun(list, kind) {
      runs.push({ k: kind, len: list.length, cells: list });
      list.forEach(function (p) { var key = p.r * n + p.c; if (!seen[key]) { seen[key] = true; cells.push(p); } });
    }
    for (r = 0; r < n; r++) {
      c = 0;
      while (c < n) {
        k = kAt(b, r, c); if (k < 0) { c++; continue; }
        e = c; while (e + 1 < n && kAt(b, r, e + 1) === k) e++;
        len = e - c + 1;
        if (len >= 3) { run = []; for (i = c; i <= e; i++) run.push({ r: r, c: i }); addRun(run, k); }
        c = e + 1;
      }
    }
    for (c = 0; c < n; c++) {
      r = 0;
      while (r < n) {
        k = kAt(b, r, c); if (k < 0) { r++; continue; }
        e = r; while (e + 1 < n && kAt(b, e + 1, c) === k) e++;
        len = e - r + 1;
        if (len >= 3) { run = []; for (i = r; i <= e; i++) run.push({ r: i, c: c }); addRun(run, k); }
        r = e + 1;
      }
    }
    return { cells: cells, runs: runs };
  }

  function adjacent(a, b) { return Math.abs(a.r - b.r) + Math.abs(a.c - b.c) === 1; }
  function swap(b, a, c) { var t = b[a.r][a.c]; b[a.r][a.c] = b[c.r][c.c]; b[c.r][c.c] = t; }

  /* Alle Züge, die mindestens eine Reihe ergeben */
  function allMoves(b) {
    var n = b.length, out = [], r, c, d, a, o;
    for (r = 0; r < n; r++) for (c = 0; c < n; c++) {
      a = { r: r, c: c };
      [{ r: r, c: c + 1 }, { r: r + 1, c: c }].forEach(function (o) {
        if (o.r >= n || o.c >= n) return;
        swap(b, a, o);
        var m = findMatches(b); swap(b, a, o);
        if (m.cells.length) out.push({ a: a, b: o });
      });
    }
    return out;
  }
  function hasMove(b) { return allMoves(b).length > 0; }

  function hasMatch(b) { return findMatches(b).cells.length > 0; }

  /* Zufallsbrett ohne fertige Reihen, mit mindestens einem Zug */
  function makeBoard(rng, n, kinds) {
    n = n || SIZE; kinds = kinds || KINDS;
    for (var tries = 0; tries < 200; tries++) {
      var b = empty(n), r, c;
      for (r = 0; r < n; r++) for (c = 0; c < n; c++) {
        var bad = {};
        if (c >= 2 && kAt(b, r, c - 1) === kAt(b, r, c - 2)) bad[kAt(b, r, c - 1)] = true;
        if (r >= 2 && kAt(b, r - 1, c) === kAt(b, r - 2, c)) bad[kAt(b, r - 1, c)] = true;
        var ok = []; for (var k = 0; k < kinds; k++) if (!bad[k]) ok.push(k);
        b[r][c] = tile(ok[rnd(ok.length, rng)]);
      }
      if (!hasMatch(b) && hasMove(b)) return b;
    }
    throw new Error("makeBoard failed");
  }

  function removeCells(b, cells) { cells.forEach(function (p) { b[p.r][p.c] = null; }); }

  /* Schwerkraft + neue Steine von oben. Gibt jedes Stück mit alter und neuer Zeile zurück (nur Bewegungen). */
  function applyGravity(b, rng, kinds) {
    kinds = kinds || KINDS;
    var n = b.length, moves = [], r, c, w, t;
    for (c = 0; c < n; c++) {
      w = n - 1;
      for (r = n - 1; r >= 0; r--) {
        t = b[r][c];
        if (t) { if (r !== w) { b[w][c] = t; b[r][c] = null; moves.push({ tile: t, c: c, from: r, to: w, isNew: false }); } w--; }
      }
      var missing = w + 1;
      for (r = w; r >= 0; r--) { t = tile(rnd(kinds, rng)); b[r][c] = t; moves.push({ tile: t, c: c, from: r - missing, to: r, isNew: true }); }
    }
    return moves;
  }

  /* Neu mischen: dieselben Steine, danach keine fertige Reihe, aber ein möglicher Zug */
  function shuffle(b, rng, kinds) {
    var n = b.length, list = [], r, c, i;
    for (r = 0; r < n; r++) for (c = 0; c < n; c++) if (b[r][c]) list.push(b[r][c]);
    for (var tries = 0; tries < 300; tries++) {
      for (i = list.length - 1; i > 0; i--) { var j = rnd(i + 1, rng), x = list[i]; list[i] = list[j]; list[j] = x; }
      i = 0; for (r = 0; r < n; r++) for (c = 0; c < n; c++) b[r][c] = list[i++];
      if (!hasMatch(b) && hasMove(b)) return;
    }
    /* Notlösung: neue Arten auf die vorhandenen Steine schreiben */
    var nb = makeBoard(rng, n, kinds);
    for (r = 0; r < n; r++) for (c = 0; c < n; c++) { b[r][c].k = nb[r][c].k; }
  }

  function runPoints(len) { return len >= 5 ? 80 : len === 4 ? 50 : 30; }

  /* Ein Auflösungsschritt (für Tests / Simulation): Treffer finden, Punkte, Ziel-Zählung. cascade = 1, 2, 3 … */
  function scoreStep(m, cascade) {
    var pts = 0, byKind = {};
    m.runs.forEach(function (run) { pts += runPoints(run.len); });
    pts += Math.max(0, cascade - 1) * 20;
    m.cells.forEach(function (p) { /* Zellen sind schon eindeutig */ });
    return pts;
  }
  function countByKind(b, m) {
    var out = {}; m.cells.forEach(function (p) { var k = b[p.r][p.c].k; out[k] = (out[k] || 0) + 1; }); return out;
  }

  /* Kompletter Zug ohne Animation. Gibt null zurück, wenn der Zug ungültig ist (Brett bleibt dann unverändert). */
  function playMove(b, a, c, rng, kinds) {
    if (!adjacent(a, c)) return null;
    swap(b, a, c);
    var m = findMatches(b);
    if (!m.cells.length) { swap(b, a, c); return null; }
    var res = { score: 0, kinds: {}, cascades: 0, maxRun: 0, shuffled: false }, cascade = 0;
    while (m.cells.length) {
      cascade++;
      res.score += scoreStep(m, cascade);
      var bk = countByKind(b, m); for (var k in bk) res.kinds[k] = (res.kinds[k] || 0) + bk[k];
      m.runs.forEach(function (r) { if (r.len > res.maxRun) res.maxRun = r.len; });
      removeCells(b, m.cells); applyGravity(b, rng, kinds); m = findMatches(b);
      if (cascade > 50) break; /* Schutz gegen Endlosschleifen */
    }
    res.cascades = cascade;
    if (!hasMove(b)) { shuffle(b, rng, kinds); res.shuffled = true; }
    return res;
  }

  window.M3 = {
    SIZE: SIZE, KINDS: KINDS, tile: tile, kAt: kAt, findMatches: findMatches, adjacent: adjacent, swap: swap, allMoves: allMoves,
    hasMove: hasMove, hasMatch: hasMatch, makeBoard: makeBoard, removeCells: removeCells, applyGravity: applyGravity, shuffle: shuffle,
    runPoints: runPoints, scoreStep: scoreStep, countByKind: countByKind, playMove: playMove
  };
})();
