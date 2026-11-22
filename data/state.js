/* Spielstand: nur lokal im Browser (localStorage), keine Konten, kein Tracking.
   Fällt Speichern aus (z. B. privater Modus), läuft alles weiter, nur ohne Merken.
   Version 2: Sternenlicht wird nur gesammelt, nie ausgegeben. Jede Belohnung gibt es genau einmal ("awards"). */
window.AdventState = (function () {
  var KEY = "sternenpost-advent-v1";
  function fresh() {
    return { v: 2, stars: 0, awards: {}, opened: {}, owned: {}, placed: {}, lastCare: "", trust: 0, tree: {}, fips: { hidden: false, welcomed: false } };
  }
  function migrate(o) {
    var f = fresh();
    for (var k in f) if (o[k] !== undefined) f[k] = o[k];
    if (o.v === 1) {
      /* alter Stand: Türchen zählen je 1 Stern, nichts geht verloren */
      f.awards = {}; f.stars = 0;
      Object.keys(f.opened || {}).forEach(function (d) { if (f.opened[d]) { f.awards["door:" + d] = true; f.stars += 1; } });
    }
    f.v = 2;
    return f;
  }
  function load() {
    try {
      var s = localStorage.getItem(KEY);
      if (s) { var o = JSON.parse(s); if (o && (o.v === 1 || o.v === 2)) return migrate(o); }
    } catch (e) {}
    return fresh();
  }
  var state = load();
  return {
    get: function () { return state; },
    save: function () { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} },
    reset: function () { state = fresh(); try { localStorage.removeItem(KEY); } catch (e) {} return state; }
  };
})();
