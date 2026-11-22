/* Sternenmalerei: Farbe wählen, Fläche antippen. Rückgängig, Neu beginnen, als Bild speichern. Kein Sternenlicht. */
(function () {
  var A = window.Advent, T = A.T, I = A.I, C = window.COLOR;
  var lang = function () { return I.lang(); };
  var NAMES = ["col_red", "col_orange", "col_yellow", "col_lgreen", "col_green", "col_cyan", "col_blue", "col_purple", "col_pink", "col_brown", "col_black", "col_white"];
  var NS = "http://www.w3.org/2000/svg";
  function imgSrc(d) { return (window.COLOR_IMG && window.COLOR_IMG[d.id]) || d.img; }   /* eingebettete Daten zuerst (funktionieren auch ohne Server) */

  function svgOf(d) { return '<svg xmlns="' + NS + '" viewBox="0 0 400 400" class="cdraw">' + d.svg + "</svg>"; }
  function prep(svg) {
    [].forEach.call(svg.querySelectorAll(".r"), function (e) { e.setAttribute("fill", "#ffffff"); e.setAttribute("stroke", "#3b2418"); e.setAttribute("stroke-width", "3"); e.setAttribute("stroke-linejoin", "round"); });
    [].forEach.call(svg.querySelectorAll(".ln"), function (e) { e.setAttribute("fill", "none"); e.setAttribute("stroke", "#3b2418"); e.setAttribute("stroke-width", "3"); e.setAttribute("stroke-linecap", "round"); });
  }
  function exportPng(svg, name) {
    var c = svg.cloneNode(true); c.setAttribute("width", "1200"); c.setAttribute("height", "1200");
    var bg = document.createElementNS(NS, "rect"); bg.setAttribute("width", "400"); bg.setAttribute("height", "400"); bg.setAttribute("fill", "#fffdf4");
    c.insertBefore(bg, c.firstChild);
    var url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(new XMLSerializer().serializeToString(c));
    var im = new Image();
    im.onload = function () {
      var cv = document.createElement("canvas"); cv.width = cv.height = 1200; cv.getContext("2d").drawImage(im, 0, 0, 1200, 1200);
      cv.toBlob(function (b) {
        if (!b) { A.toast(T("col_save_err")); return; }
        var a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = "sternenmalerei-" + name + ".png";
        document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
        A.toast(T("col_saved"));
      }, "image/png");
    };
    im.onerror = function () { A.toast(T("col_save_err")); };
    im.src = url;
  }

  A.openColor = function () {
    var box = A.el("div", "color"), color = C.palette[0], undo = [];
    function picker() {
      box.innerHTML = "";
      box.appendChild(A.el("h2", "", A.esc(T("col_title"))));
      box.appendChild(A.el("p", "pzintro", A.esc(T("col_pick"))));
      var g = A.el("div", "pzpick"), stars = A.S.get().stars;
      C.drawings.forEach(function (d) {
        var open = stars >= d.stars, name = d.title[lang()] || d.title.de;
        var b = A.el("button", "pzcard" + (open ? "" : " locked")); b.type = "button";
        b.setAttribute("aria-label", name + (open ? "" : ", " + T("book_locked", { n: d.stars - stars })));
        b.innerHTML = '<span class="cthumb">' + (d.img ? '<img src="' + imgSrc(d) + '" alt="">' : svgOf(d)) + '</span><span class="cn">' + A.esc(name) + '</span><span class="cs">' + A.esc(open ? "" : T("book_locked", { n: d.stars - stars })) + "</span>";
        if (b.querySelector("svg")) prep(b.querySelector("svg"));
        b.addEventListener("click", function () { if (!open) { A.toast(T("book_locked", { n: d.stars - A.S.get().stars })); return; } paint(d); });
        g.appendChild(b);
      });
      box.appendChild(g);
    }
    function paint(d) {
      if (!d.img) { paintSvg(d); return; }
      var probe = new Image(); probe.onload = function () { if (box) paintRaster(d, probe); }; probe.onerror = function () { if (box) paintSvg(d); }; probe.src = imgSrc(d);
    }
    function toolbar(d, getSvgOrNull, doUndo, doReset, doSave, onColor) {
      var pal = A.el("div", "cpal"); pal.setAttribute("role", "group"); pal.setAttribute("aria-label", T("col_palette"));
      C.palette.forEach(function (c, i) {
        var b = A.el("button", "csw" + (c === color ? " on" : "")); b.type = "button"; b.style.background = c;
        b.setAttribute("aria-label", T(NAMES[i])); b.setAttribute("aria-pressed", String(c === color));
        b.addEventListener("click", function () { color = c; [].forEach.call(pal.children, function (x) { x.classList.remove("on"); x.setAttribute("aria-pressed", "false"); }); b.classList.add("on"); b.setAttribute("aria-pressed", "true"); });
        pal.appendChild(b);
      });
      box.appendChild(pal);
      var bar = A.el("div", "pzbar");
      var ub = A.el("button", "btn small", A.esc("↶ " + T("col_undo"))); ub.type = "button"; ub.disabled = true; ub.addEventListener("click", doUndo);
      var rs = A.el("button", "btn small alt", A.esc(T("col_reset"))); rs.type = "button"; rs.addEventListener("click", doReset);
      var sv = A.el("button", "btn small", A.esc(T("col_save"))); sv.type = "button"; sv.addEventListener("click", doSave);
      var ot = A.el("button", "btn small alt", A.esc(T("pz_other"))); ot.type = "button"; ot.addEventListener("click", picker);
      bar.appendChild(ub); bar.appendChild(rs); bar.appendChild(sv); bar.appendChild(ot); box.appendChild(bar);
      return ub;
    }

    /* ---------- Strichzeichnung (PNG): Flächen einmal erkennen, dann per Tipp füllen ---------- */
    function paintRaster(d, im) {
      box.innerHTML = "";
      box.appendChild(A.el("h2", "", A.esc(d.title[lang()] || d.title.de)));
      box.appendChild(A.el("p", "pzintro", A.esc(T("col_hint"))));
      var sc = Math.min(1, 1100 / Math.max(im.naturalWidth, im.naturalHeight)), W = Math.round(im.naturalWidth * sc), H = Math.round(im.naturalHeight * sc);
      var wrap = A.el("div", "cwrap craster"); wrap.style.aspectRatio = W + "/" + H; if (H > W) wrap.style.maxWidth = "min(100%, 420px)";
      var fill = document.createElement("canvas"); fill.width = W; fill.height = H; fill.className = "cfill";
      var line = new Image(); line.alt = ""; line.src = imgSrc(d); line.className = "cline"; line.draggable = false;
      wrap.appendChild(fill); wrap.appendChild(line);
      var patches = (d.patches || []).map(function (p) { return p.e.map(function (v) { return v * sc; }); });
      if (patches.length) {
        var ps = document.createElementNS(NS, "svg"); ps.setAttribute("viewBox", "0 0 " + W + " " + H); ps.setAttribute("class", "cline cpatch");
        patches.forEach(function (e) { var el = document.createElementNS(NS, "ellipse"); el.setAttribute("cx", e[0]); el.setAttribute("cy", e[1]); el.setAttribute("rx", e[2]); el.setAttribute("ry", e[3]); el.setAttribute("fill", "none"); el.setAttribute("stroke", "#000"); el.setAttribute("stroke-width", "5"); ps.appendChild(el); });
        wrap.appendChild(ps);
      }
      box.appendChild(wrap);

      /* Erkennung: dunkle Pixel = Linie; Linie verdicken (schließt winzige Lücken); zusammenhängende helle Flächen nummerieren */
      var tmp = document.createElement("canvas"); tmp.width = W; tmp.height = H; var tx = tmp.getContext("2d", { willReadFrequently: true });
      tx.fillStyle = "#fff"; tx.fillRect(0, 0, W, H); tx.drawImage(im, 0, 0, W, H);
      tx.strokeStyle = "#000"; tx.lineWidth = 5; patches.forEach(function (e) { tx.beginPath(); tx.ellipse(e[0], e[1], e[2], e[3], 0, 0, 6.2832); tx.stroke(); });
      var px = tx.getImageData(0, 0, W, H).data, N = W * H, isLine = new Uint8Array(N), blocked = new Uint8Array(N), i, x, y;
      for (i = 0; i < N; i++) isLine[i] = (px[i * 4] * 0.3 + px[i * 4 + 1] * 0.59 + px[i * 4 + 2] * 0.11) < 150 ? 1 : 0;
      /* Linie 2 px verdicken (zwei Durchgänge): schließt auch schmale Lücken, z. B. beim Glanzpunkt im Auge */
      blocked.set(isLine);
      for (var dil = 0; dil < 2; dil++) {
        var src = blocked.slice();
        for (y = 0; y < H; y++) for (x = 0; x < W; x++) {
          i = y * W + x; if (src[i]) continue;
          if ((x > 0 && src[i - 1]) || (x < W - 1 && src[i + 1]) || (y > 0 && src[i - W]) || (y < H - 1 && src[i + W])) blocked[i] = 1;
        }
      }
      /* unterer Bildrand als schmale Grenze: Linien, die knapp über dem Rand enden (z. B. Schnee unten), schließen so ihre Fläche */
      for (y = H - 7; y < H; y++) for (x = 0; x < W; x++) blocked[y * W + x] = 1;
      var lab = new Int32Array(N), n = 0, stack = new Int32Array(N);
      for (i = 0; i < N; i++) {
        if (blocked[i] || lab[i]) continue;
        n++; var sp = 0; stack[sp++] = i; lab[i] = n;
        while (sp) {
          var p = stack[--sp], py = (p / W) | 0, pxx = p - py * W;
          if (pxx > 0 && !blocked[p - 1] && !lab[p - 1]) { lab[p - 1] = n; stack[sp++] = p - 1; }
          if (pxx < W - 1 && !blocked[p + 1] && !lab[p + 1]) { lab[p + 1] = n; stack[sp++] = p + 1; }
          if (py > 0 && !blocked[p - W] && !lab[p - W]) { lab[p - W] = n; stack[sp++] = p - W; }
          if (py < H - 1 && !blocked[p + W] && !lab[p + W]) { lab[p + W] = n; stack[sp++] = p + W; }
        }
      }
      /* die verdickten Randpixel (keine echte Linie) der Nachbarfläche zuschlagen, damit kein weißer Saum bleibt */
      for (var pass = 0; pass < 9; pass++) {
        var add = [];
        for (y = 0; y < H; y++) for (x = 0; x < W; x++) {
          i = y * W + x; if (lab[i] || isLine[i]) continue;
          var l = 0; if (x > 0 && lab[i - 1]) l = lab[i - 1]; else if (x < W - 1 && lab[i + 1]) l = lab[i + 1]; else if (y > 0 && lab[i - W]) l = lab[i - W]; else if (y < H - 1 && lab[i + W]) l = lab[i + W];
          if (l) add.push(i, l);
        }
        for (i = 0; i < add.length; i += 2) lab[add[i]] = add[i + 1];
      }
      (d.merge || []).forEach(function (pr) {
        var a = lab[Math.round(pr[0][1] * sc) * W + Math.round(pr[0][0] * sc)], b = lab[Math.round(pr[1][1] * sc) * W + Math.round(pr[1][0] * sc)];
        if (a && b && a !== b) for (var q = 0; q < N; q++) if (lab[q] === b) lab[q] = a;
      });
      var cnt = new Int32Array(n + 2); for (i = 0; i < N; i++) cnt[lab[i]]++;
      var start = new Int32Array(n + 2); for (i = 1; i <= n + 1; i++) start[i] = start[i - 1] + cnt[i - 1];
      var order = new Int32Array(N), fillp = start.slice(); for (i = 0; i < N; i++) order[fillp[lab[i]]++] = i;
      var colors = new Array(n + 1), cx = fill.getContext("2d"), img = cx.createImageData(W, H), data = img.data;
      for (i = 0; i < data.length; i += 4) { data[i] = data[i + 1] = data[i + 2] = 255; data[i + 3] = 255; }
      function rgb(c) { return [parseInt(c.substr(1, 2), 16), parseInt(c.substr(3, 2), 16), parseInt(c.substr(5, 2), 16)]; }
      function paintLabel(l, c) {
        var v = c ? rgb(c) : [255, 255, 255];
        for (var k = start[l]; k < start[l + 1]; k++) { var q = order[k] * 4; data[q] = v[0]; data[q + 1] = v[1]; data[q + 2] = v[2]; }
        cx.putImageData(img, 0, 0);
      }
      cx.putImageData(img, 0, 0);
      var undo = [], ub;
      function labelAt(ex, ey) {
        var r = fill.getBoundingClientRect(), ix = Math.floor((ex - r.left) / r.width * W), iy = Math.floor((ey - r.top) / r.height * H);
        if (ix < 0 || iy < 0 || ix >= W || iy >= H) return 0;
        var l = lab[iy * W + ix]; if (l) return l;
        for (var rad = 1; rad <= 4 && !l; rad++) for (var dy = -rad; dy <= rad && !l; dy++) for (var dx = -rad; dx <= rad && !l; dx++) {
          var nx = ix + dx, ny = iy + dy; if (nx >= 0 && ny >= 0 && nx < W && ny < H) l = lab[ny * W + nx];
        }
        return l;
      }
      wrap.addEventListener("click", function (e) {
        var l = labelAt(e.clientX, e.clientY); if (!l) return;
        var prev = colors[l] || null; if (prev === color) return;
        undo.push([l, prev]); colors[l] = color; paintLabel(l, color); ub.disabled = false;
      });
      ub = toolbar(d, null,
        function () { var u2 = undo.pop(); if (u2) { colors[u2[0]] = u2[1]; paintLabel(u2[0], u2[1]); } ub.disabled = !undo.length; },
        function () { for (var l = 1; l <= n; l++) if (colors[l]) { colors[l] = null; for (var k = start[l]; k < start[l + 1]; k++) { var q = order[k] * 4; data[q] = data[q + 1] = data[q + 2] = 255; } } cx.putImageData(img, 0, 0); undo = []; ub.disabled = true; },
        function () {
          var ex = document.createElement("canvas"); ex.width = W; ex.height = H; var ec = ex.getContext("2d");
          ec.drawImage(fill, 0, 0); ec.globalCompositeOperation = "multiply"; ec.drawImage(im, 0, 0, W, H);
          ec.strokeStyle = "#000"; ec.lineWidth = 5; patches.forEach(function (e) { ec.beginPath(); ec.ellipse(e[0], e[1], e[2], e[3], 0, 0, 6.2832); ec.stroke(); });
          ex.toBlob(function (b) {
            if (!b) { A.toast(T("col_save_err")); return; }
            var a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = "sternenmalerei-" + d.id + ".png";
            document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500); A.toast(T("col_saved"));
          }, "image/png");
        });
    }

    function paintSvg(d) {
      undo = []; box.innerHTML = "";
      box.appendChild(A.el("h2", "", A.esc(d.title[lang()] || d.title.de)));
      box.appendChild(A.el("p", "pzintro", A.esc(T("col_hint"))));
      var wrap = A.el("div", "cwrap"); wrap.innerHTML = svgOf(d); var svg = wrap.firstChild; prep(svg); box.appendChild(wrap);
      var ub;
      svg.addEventListener("click", function (e) {
        var r = e.target.closest && e.target.closest(".r"); if (!r) return;
        var prev = r.getAttribute("fill"); if (prev === color) return;
        undo.push([r, prev]); r.setAttribute("fill", color); ub.disabled = false;
      });
      var pal = A.el("div", "cpal"); pal.setAttribute("role", "group"); pal.setAttribute("aria-label", T("col_palette"));
      C.palette.forEach(function (c, i) {
        var b = A.el("button", "csw" + (c === color ? " on" : "")); b.type = "button"; b.style.background = c;
        b.setAttribute("aria-label", T(NAMES[i])); b.setAttribute("aria-pressed", String(c === color));
        b.addEventListener("click", function () { color = c; [].forEach.call(pal.children, function (x) { x.classList.remove("on"); x.setAttribute("aria-pressed", "false"); }); b.classList.add("on"); b.setAttribute("aria-pressed", "true"); });
        pal.appendChild(b);
      });
      box.appendChild(pal);
      var bar = A.el("div", "pzbar");
      ub = A.el("button", "btn small", A.esc("↶ " + T("col_undo"))); ub.type = "button"; ub.disabled = true;
      ub.addEventListener("click", function () { var u = undo.pop(); if (u) u[0].setAttribute("fill", u[1]); ub.disabled = !undo.length; });
      var rs = A.el("button", "btn small alt", A.esc(T("col_reset"))); rs.type = "button";
      rs.addEventListener("click", function () { [].forEach.call(svg.querySelectorAll(".r"), function (e) { e.setAttribute("fill", "#ffffff"); }); undo = []; ub.disabled = true; });
      var sv = A.el("button", "btn small", A.esc(T("col_save"))); sv.type = "button"; sv.addEventListener("click", function () { exportPng(svg, d.id); });
      var ot = A.el("button", "btn small alt", A.esc(T("pz_other"))); ot.type = "button"; ot.addEventListener("click", picker);
      bar.appendChild(ub); bar.appendChild(rs); bar.appendChild(sv); bar.appendChild(ot); box.appendChild(bar);
    }
    A.openModal(box, T("col_title"), function () { box = null; });
    picker();
  };
})();
