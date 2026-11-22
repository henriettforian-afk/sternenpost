/* Schmuck am Kasten „Die Dorfbewohner“: die gemalte kleine Lichterkette (lights_l.png) folgt einem Bogen: sie beginnt oben am Rand,
   hängt durch und läuft rechts am Kastenrand aus (bleibt INNERHALB des Kastens). Dazu ein Stern am Anfang und eine Glocke in der rechten oberen Ecke.
   Die Kette wird dafür in schmale Streifen geschnitten, die dem Bogen folgen. Nur Dekoration.
   Form ändern: Zahlen in PATH (x in % der Kastenbreite, y in % von H). Größe der Lämpchen: HS (Höhe der Kette in px). */
(function () {
  var card = document.querySelector(".residents"); if (!card) return;
  var SHOW_LIGHTS = false;   /* false = nur die Glocke bleibt; true = Lichterkette mit Stern wieder anzeigen */
  var H = 140, HS = 24, SW = 5, SPR_W = 420, SPR_H = 43, CORD_Y = 3;
  var PATH = { x0: 41, y0: 3, c1x: 53, c1y: 56, c2x: 79, c2y: 68, x1: 98.5, y1: 40 };
  var box = document.createElement("div"); box.className = "resdeco"; box.setAttribute("aria-hidden", "true"); card.appendChild(box);

  var X0 = PATH.x0;   /* Startpunkt in %: wird auf schmalen Bildschirmen nach rechts geschoben, damit die Kette nie die Überschrift berührt */
  function bez(t, W) {
    var a = Math.pow(1 - t, 3), b = 3 * Math.pow(1 - t, 2) * t, c = 3 * (1 - t) * t * t, d = t * t * t;
    return [(a * X0 + b * PATH.c1x + c * PATH.c2x + d * PATH.x1) / 100 * W, (a * PATH.y0 + b * PATH.c1y + c * PATH.c2y + d * PATH.y1) / 100 * H];
  }
  function build() {
    var W = card.clientWidth; if (!W) return; box.innerHTML = "";
    var hd = card.querySelector("h2, h3"); X0 = PATH.x0;
    if (hd) { var hr = hd.getBoundingClientRect(), cr = card.getBoundingClientRect(), tr = document.createRange(); tr.selectNodeContents(hd); var textRight = tr.getBoundingClientRect().right - cr.left; X0 = Math.min(78, Math.max(PATH.x0, (textRight + 30) / W * 100)); }
    var N = 240, pts = [], len = [0], i;
    for (i = 0; i <= N; i++) pts.push(bez(i / N, W));
    for (i = 1; i <= N; i++) len.push(len[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    var total = len[N], sprW = SPR_W * HS / SPR_H, n = Math.ceil(total / SW), wrap = document.createElement("div"); wrap.className = "rpaint";
    for (var k = 0; k < n; k++) {
      var s = k * SW, j = 0; while (j < N && len[j] < s) j++;
      var p = pts[j], q = pts[Math.min(N, j + 2)], ang = Math.atan2(q[1] - p[1], q[0] - p[0]) * 180 / Math.PI;
      var seg = document.createElement("i"); seg.className = "rseg";
      seg.style.width = (SW + 4) + "px"; seg.style.height = HS + "px"; seg.style.backgroundSize = "auto " + HS + "px";
      seg.style.backgroundPosition = (-((k * SW) % Math.floor(sprW - SW))) + "px 0";
      seg.style.transformOrigin = "0 " + (CORD_Y * HS / SPR_H) + "px";
      seg.style.transform = "translate(" + p[0].toFixed(1) + "px," + (p[1] - CORD_Y * HS / SPR_H).toFixed(1) + "px) rotate(" + ang.toFixed(1) + "deg)";
      wrap.appendChild(seg);
    }
    if (SHOW_LIGHTS) {   /* Lichterkette + Stern; mit SHOW_LIGHTS = true oben wieder einschalten */
      box.appendChild(wrap);
      var st = document.createElement("img"); st.className = "resstar"; st.alt = ""; st.src = "assets/adv/m3_star.png"; st.style.left = (X0 / 100 * W - 15) + "px"; box.appendChild(st);
    }
    var bl = document.createElement("img"); bl.className = "resbell"; bl.alt = ""; bl.src = "assets/adv/m3_bell.png"; box.appendChild(bl);
  }
  build(); var rt; window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(build, 120); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(build);

  /* Magyal in der linken oberen Ecke des Dorfbilds */
  var scene = document.getElementById("scene");
  if (scene) { var h = document.createElement("img"); h.className = "schol"; h.alt = ""; h.setAttribute("aria-hidden", "true"); h.src = "assets/adv/holly_clean.png"; scene.appendChild(h); }
})();