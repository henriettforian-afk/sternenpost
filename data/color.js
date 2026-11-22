/* Sternenmalerei: Ausmalbilder. img = Strichzeichnung (PNG, schwarze Linien auf Weiß) -> Farbeimer per Flächenerkennung (color.js).
   svg = einfache Ersatzzeichnung, wird nur benutzt, wenn das PNG fehlt. Früher: einfache Ausmalbilder als SVG. Jede Fläche mit class="r" lässt sich ausmalen (Farbeimer).
   Neues Bild: einen Eintrag in drawings ergänzen (viewBox 0 0 400 400). stars = ab so viel Sternenlicht freigeschaltet (nichts wird ausgegeben).
   Ausmalbilder geben kein Sternenlicht. */
(function () {
  function star(cx, cy, R, r) { var p = []; for (var i = 0; i < 10; i++) { var a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r : R; p.push((cx + rr * Math.cos(a)).toFixed(1) + "," + (cy + rr * Math.sin(a)).toFixed(1)); } return p.join(" "); }
  function circ(x, y, r) { return '<circle class="r" cx="' + x + '" cy="' + y + '" r="' + r + '"/>'; }
  function rect(x, y, w, h, rx) { return '<rect class="r" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '"' + (rx ? ' rx="' + rx + '"' : "") + "/>"; }
  function poly(pts) { return '<polygon class="r" points="' + pts + '"/>'; }
  function path(d) { return '<path class="r" d="' + d + '"/>'; }
  function ell(x, y, rx, ry, rot) { return '<ellipse class="r" cx="' + x + '" cy="' + y + '" rx="' + rx + '" ry="' + ry + '"' + (rot ? ' transform="rotate(' + rot + " " + x + " " + y + ')"' : "") + "/>"; }
  function line(d) { return '<path class="ln" d="' + d + '"/>'; }
  function st(x, y, R) { return poly(star(x, y, R, R * 0.42)); }
  function env(x, y) { return rect(x, y, 50, 34, 3) + poly(x + "," + y + " " + (x + 25) + "," + (y + 19) + " " + (x + 50) + "," + y); }
  function gift(x, y, w, h) { return rect(x, y, w, h, 3) + rect(x + w / 2 - 5, y, 10, h) + circ(x + w / 2, y - 6, 8); }

  var tree = "" +
    rect(178, 300, 44, 50) +
    poly("200,150 85,310 315,310") + poly("200,95 105,225 295,225") + poly("200,48 125,145 275,145") +
    st(200, 38, 26) +
    circ(185, 105, 12) + circ(225, 122, 12) + circ(160, 190, 13) + circ(208, 172, 13) + circ(250, 200, 13) +
    circ(135, 272, 15) + circ(190, 252, 15) + circ(248, 268, 15) + circ(280, 296, 15) + circ(108, 298, 13) +
    gift(40, 330, 56, 40) + gift(300, 326, 60, 44) + gift(110, 348, 40, 22) +
    st(60, 70, 14) + st(340, 90, 12) + st(330, 180, 10) + st(70, 190, 10);

  var luni = "" +
    path("M0 335 Q100 305 200 335 T400 325 L400 400 L0 400Z") +
    rect(340, 285, 14, 40) + poly("347,215 315,270 379,270") + poly("347,185 322,235 372,235") +
    ell(325, 215, 14, 20, 30) +
    rect(150, 270, 18, 66) + rect(185, 270, 18, 66) + rect(250, 270, 18, 66) + rect(285, 270, 18, 66) +
    rect(149, 334, 20, 10, 3) + rect(184, 334, 20, 10, 3) + rect(249, 334, 20, 10, 3) + rect(284, 334, 20, 10, 3) +
    ell(225, 235, 105, 55) +
    poly("90,140 130,140 180,215 130,245") +
    poly("232,183 266,186 264,288 232,290") +
    path("M100 152 L152 170 L152 186 L100 168Z") + circ(140, 190, 11) +
    circ(100, 110, 38) +
    poly("115,78 128,32 138,37 125,82") + poly("128,52 152,44 154,53 130,62") +
    poly("85,78 72,32 62,37 75,82") + poly("74,50 50,42 48,51 72,60") +
    ell(128, 88, 11, 24, 25) + ell(68, 88, 11, 24, -25) +
    ell(78, 127, 20, 15) + circ(63, 123, 7) + circ(98, 101, 6) +
    st(22, 60, 12) + st(300, 70, 11) + st(220, 40, 14) + st(350, 140, 9) + st(40, 190, 9);

  var fips = "" +
    path("M0 345 Q120 320 220 345 T400 335 L400 400 L0 400Z") +
    rect(322, 258, 18, 100) +
    path("M288 258 L288 215 Q288 188 331 188 Q374 188 374 215 L374 258Z") + rect(305, 220, 52, 9, 3) + st(331, 243, 11) +
    ell(112, 258, 13, 32, 10) + ell(228, 258, 13, 32, -10) +
    rect(132, 338, 26, 32, 5) + rect(178, 338, 26, 32, 5) +
    poly("128,228 212,228 226,342 114,342") +
    rect(140, 262, 62, 46, 4) + st(171, 285, 12) +
    ell(126, 172, 13, 9, -30) + ell(214, 172, 13, 9, 30) +
    circ(170, 175, 45) +
    poly("122,152 218,152 188,68") + circ(188, 62, 11) + rect(118, 146, 104, 18, 8) +
    circ(154, 175, 5) + circ(186, 175, 5) + circ(142, 192, 8) + circ(198, 192, 8) + line("M156 196 Q170 210 184 196") +
    env(50, 70) + env(290, 60) + env(250, 125) + env(30, 150) +
    st(80, 260, 12) + st(370, 150, 9) + st(240, 30, 12) + st(100, 30, 9);

  var werkstatt = "" +
    rect(0, 340, 400, 60) +
    rect(262, 38, 104, 104, 4) + st(314, 90, 30) +
    rect(30, 112, 172, 10) + rect(40, 80, 40, 30, 3) + rect(90, 80, 40, 30, 3) + circ(52, 112, 6) + circ(72, 112, 6) + circ(102, 112, 6) + circ(122, 112, 6) +
    circ(170, 94, 17) + circ(158, 76, 7) + circ(182, 76, 7) +
    rect(190, 258, 200, 20, 3) + rect(200, 278, 16, 66) + rect(364, 278, 16, 66) +
    gift(215, 214, 54, 44) + gift(300, 226, 44, 32) +
    gift(280, 325, 80, 18) +
    poly("72,252 168,252 190,350 50,350") +
    rect(58, 312, 124, 14, 3) + rect(108, 309, 24, 20, 3) +
    ell(62, 285, 14, 30, 8) + ell(178, 285, 14, 30, -8) +
    rect(72, 345, 38, 22, 6) + rect(130, 345, 38, 22, 6) +
    circ(120, 200, 34) +
    path("M86 205 Q86 275 120 296 Q154 275 154 205 Q120 228 86 205Z") +
    ell(120, 214, 24, 8) + circ(120, 204, 7) + circ(107, 192, 4) + circ(133, 192, 4) +
    poly("84,172 156,172 140,98") + circ(140, 92, 11) + rect(80, 166, 80, 16, 8) +
    st(30, 40, 11) + st(220, 40, 10);

  window.COLOR = {
    palette: ["#d6342c", "#f08a2c", "#f6cf3a", "#79b948", "#2f8a52", "#46b5d1", "#3a6fc4", "#8a5cc4", "#e98bb6", "#a0643a", "#3b2418", "#ffffff"],
    drawings: [
      { id: "baum",      stars: 24, img: "assets/adv/kifesto_baum.png", merge: [[[30, 60], [1070, 60]]],   /* linke und rechte Hintergrundfläche (die Spitze berührt den Rand) zu einer machen */ svg: tree,      title: { de: "Der Weihnachtsbaum", en: "The Christmas tree", hu: "A karácsonyfa" } },
      { id: "luni",      stars: 42, img: "assets/adv/kifesto_luni.png", svg: luni,      title: { de: "Luni, das kleine Rentier", en: "Luni, the little reindeer", hu: "Luni, a kis rénszarvas" } },
      { id: "fips",      stars: 42, img: "assets/adv/kifesto_fips.png", svg: fips,      title: { de: "Fips und die Weihnachtsbriefe", en: "Fips and the Christmas letters", hu: "Fips és a karácsonyi levelek" } },
      { id: "werkstatt", stars: 42, img: "assets/adv/kifesto_werkstatt.png", patches: [{ e: [491, 274, 25, 27] }, { e: [541, 282, 25, 27] }],   /* nachgezeichnete Augenränder (im Bild sind die Augen nicht geschlossen), Koordinaten wie im 1100-px-Bild */ svg: werkstatt, title: { de: "Nikolaus’ Werkstatt", en: "Nikolaus’ workshop", hu: "A Mikulás műhelye" } }
    ]
  };
})();
