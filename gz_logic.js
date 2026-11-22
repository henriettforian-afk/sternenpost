/* Geschenkzauber: reine Spiellogik (kein DOM). 4×4-Brett, board[r][c] = { id, v, r, c } oder null. v = Stufe 1..6.
   Zwei gleiche Stufen verschmelzen zur nächsten Stufe (pro Zug jedes Stück höchstens einmal). */
(function () {
  var N = 4, uid = 0;
  function tile(v, r, c) { return { id: ++uid, v: v, r: r, c: c }; }
  function empty() { var b = []; for (var r = 0; r < N; r++) { b.push([]); for (var c = 0; c < N; c++) b[r].push(null); } return b; }
  function cellsFor(dir, i) {
    var out = [], k;
    for (k = 0; k < N; k++) {
      if (dir === "L") out.push({ r: i, c: k }); else if (dir === "R") out.push({ r: i, c: N - 1 - k });
      else if (dir === "U") out.push({ r: k, c: i }); else out.push({ r: N - 1 - k, c: i });
    }
    return out;
  }
  function pts(v) { return 10 * Math.pow(2, v - 1); }
  function emptyCells(b) { var out = []; for (var r = 0; r < N; r++) for (var c = 0; c < N; c++) if (!b[r][c]) out.push({ r: r, c: c }); return out; }
  function spawn(b, rng) {
    var e = emptyCells(b); if (!e.length) return null;
    var p = e[Math.floor((rng || Math.random)() * e.length)], t = tile(1, p.r, p.c); b[p.r][p.c] = t; return t;
  }
  function makeBoard(rng) { var b = empty(); spawn(b, rng); spawn(b, rng); return b; }

  /* Zug in Richtung "L","R","U","D". Gibt { moved, score, merges:[{keep,gone}] } zurück. Ändert das Brett nur, wenn sich etwas bewegt. */
  function move(b, dir) {
    var moved = false, score = 0, merges = [], i, k;
    for (i = 0; i < N; i++) {
      var cells = cellsFor(dir, i), tiles = [];
      cells.forEach(function (p) { if (b[p.r][p.c]) tiles.push(b[p.r][p.c]); });
      var out = [];
      tiles.forEach(function (t) {
        var last = out[out.length - 1];
        if (last && !last.m && last.t.v === t.v) { last.m = true; last.absorb = t; } else out.push({ t: t, m: false });
      });
      cells.forEach(function (p) { b[p.r][p.c] = null; });
      out.forEach(function (o, idx) {
        var p = cells[idx]; b[p.r][p.c] = o.t;
        if (o.t.r !== p.r || o.t.c !== p.c) moved = true;
        o.t.r = p.r; o.t.c = p.c;
        if (o.absorb) { moved = true; o.t.v++; score += pts(o.t.v); merges.push({ keep: o.t, gone: o.absorb }); }
      });
    }
    return { moved: moved, score: score, merges: merges };
  }
  function canMove(b) {
    for (var r = 0; r < N; r++) for (var c = 0; c < N; c++) {
      if (!b[r][c]) return true;
      if (c + 1 < N && b[r][c + 1] && b[r][c + 1].v === b[r][c].v) return true;
      if (r + 1 < N && b[r + 1][c] && b[r + 1][c].v === b[r][c].v) return true;
    }
    return false;
  }
  function maxLevel(b) { var m = 0; for (var r = 0; r < N; r++) for (var c = 0; c < N; c++) if (b[r][c] && b[r][c].v > m) m = b[r][c].v; return m; }

  window.GZ = { N: N, GOAL: 5, MAXV: 6, tile: tile, empty: empty, makeBoard: makeBoard, spawn: spawn, move: move, canMove: canMove, maxLevel: maxLevel, pts: pts, emptyCells: emptyCells };
})();
