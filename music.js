/* Weihnachtsmusik (leise, nur auf Knopfdruck): Liederliste in audio/music. Kleiner ♪-Knopf oben; er öffnet ein Fenster mit Titel, Zurück/Pause/Weiter,
   Lautstärke und allen Liedern. Die Musik startet nie von selbst. Während die Hauptnachricht im Wichtelfunk läuft, wird sie leiser.
   Neues Lied: Datei nach audio/music legen und unten in TRACKS eintragen. */
(function () {
  var TRACKS = [
    { f: "audio/music/01_lullaby.mp3",        t: { de: "Schneedorf-Wiegenlied",        en: "Snow Village Lullaby",         hu: "Hófalu altatódala" } },
    { f: "audio/music/02_radio.mp3",          t: { de: "Schneedorf-Radio",             en: "Snowy Village Radio",          hu: "A havas falu rádiója" }, radio: true },
    { f: "audio/music/03_light_in_snow.mp3",  t: { de: "Ein Licht im Schnee",          en: "A Light in the Snow",          hu: "Fény a hóban" } },
    { f: "audio/music/04_wish_snowflake.mp3", t: { de: "Wish on a Snowflake",          en: "Wish on a Snowflake",          hu: "Kívánj egy hópehelyre" } },
    { f: "audio/music/05_magic_is_here.mp3",  t: { de: "Weihnachtszauber",             en: "Christmas and the Magic's Here", hu: "Itt a karácsony varázsa" } },
    { f: "audio/music/06_jingle_swing.mp3",   t: { de: "Jingle Bells (Swing)",         en: "Jingle Bells (Swing)",         hu: "Jingle Bells (swing)" } },
    { f: "audio/music/07_lights_tree.mp3",    t: { de: "Lichter am Baum",              en: "Lights on the Tree",           hu: "Fények a fán" } },
    { f: "audio/music/08_baubles_boogie.mp3", t: { de: "Kugeln und Boogie",            en: "Baubles and Boogie",           hu: "Gömbök és boogie" } },
    { f: "audio/music/09_on_its_way.mp3",     t: { de: "Weihnachten ist unterwegs",    en: "Christmas Is on Its Way",      hu: "Úton a karácsony" } }
  ];
  var VKEY = "sternenpost-music-vol", DUCK = 0.35;
  var crumbs = document.querySelector(".crumbs"); if (!crumbs) return;
  var list = [], pending = TRACKS.length, a = null, idx = 0, playing = false, vol = 0.3, ducked = false, wrap, btn, panel, nowEl, playBtn, volEl, listEl, fadeT = null, open = false;
  try { var sv = parseFloat(localStorage.getItem(VKEY)); if (sv >= 0 && sv <= 1) vol = sv; } catch (e) {}
  function I() { return window.I18N; }
  function T(k) { return I() ? I().t(k) : k; }
  function L() { return I() ? I().lang() : "de"; }
  function name(t) { return t.t[L()] || t.t.de; }
  TRACKS.forEach(function (t) {
    var p = new Audio(), fin = false; function end(v) { if (fin) return; fin = true; if (v) list.push(t); if (--pending === 0 && list.length) build(); }
    p.preload = "metadata"; p.addEventListener("loadedmetadata", function () { end(p.duration > 0); }); p.addEventListener("error", function () { end(false); });
    setTimeout(function () { end(false); }, 8000); p.src = t.f;
  });
  function targetVol() { return playing ? vol * (ducked ? DUCK : 1) : 0; }
  function fade() {
    clearInterval(fadeT); fadeT = setInterval(function () {
      if (!a) return; var tg = targetVol(), d = tg - a.volume;
      if (Math.abs(d) < 0.015) { a.volume = tg; clearInterval(fadeT); if (!playing) a.pause(); return; }
      a.volume = Math.max(0, Math.min(1, a.volume + d * 0.25));
    }, 60);
  }
  function setTrack(i, autoplay) {
    idx = (i + list.length) % list.length; if (!a) { a = new Audio(); a.volume = 0; a.addEventListener("ended", function () { setTrack(idx + 1, true); }); }
    a.src = list[idx].f; refresh();
    if (autoplay) { playing = true; a.play().then(fade).catch(function () { playing = false; refresh(); }); }
  }
  function toggle() {
    if (!a || !a.src) { setTrack(startIndex(), true); return; }
    if (playing) { playing = false; fade(); } else { playing = true; a.play().then(fade).catch(function () { playing = false; refresh(); }); }
    refresh();
  }
  function startIndex() { if (/wichtelfunk/i.test(location.pathname)) { for (var i = 0; i < list.length; i++) if (list[i].radio) return i; } return 0; }
  function refresh() {
    if (!btn) return;
    btn.classList.toggle("on", playing); btn.setAttribute("aria-label", T("mus_open")); btn.setAttribute("aria-expanded", String(open));
    nowEl.textContent = a && a.src ? name(list[idx]) : "—";
    playBtn.textContent = playing ? "❚❚" : "▶"; playBtn.setAttribute("aria-label", T(playing ? "mus_pause" : "mus_play"));
    panel.querySelector(".mushead").textContent = T("mus_title");
    panel.querySelector(".musprev").setAttribute("aria-label", T("mus_prev")); panel.querySelector(".musnext").setAttribute("aria-label", T("mus_next"));
    volEl.setAttribute("aria-label", T("mus_vol"));
    [].forEach.call(listEl.children, function (li, i) { var b = li.firstChild; b.textContent = name(list[i]); li.classList.toggle("cur", !!a && a.src && i === idx); b.setAttribute("aria-current", String(!!a && !!a.src && i === idx)); });
  }
  function build() {
    wrap = document.createElement("span"); wrap.className = "musicwrap";
    btn = document.createElement("button"); btn.type = "button"; btn.className = "musicbtn"; btn.innerHTML = '<span aria-hidden="true">♪</span>';
    panel = document.createElement("div"); panel.className = "musicpanel"; panel.hidden = true; panel.setAttribute("role", "group");
    panel.innerHTML = '<div class="mushead"></div><div class="musnow" aria-live="polite"></div><div class="muscontrols"><button type="button" class="musprev">⏮</button><button type="button" class="musplay">▶</button><button type="button" class="musnext">⏭</button></div>' +
      '<input class="musvol" type="range" min="0" max="100" step="5"><ol class="muslist"></ol>';
    wrap.appendChild(btn); wrap.appendChild(panel); crumbs.appendChild(wrap);
    nowEl = panel.querySelector(".musnow"); playBtn = panel.querySelector(".musplay"); volEl = panel.querySelector(".musvol"); listEl = panel.querySelector(".muslist");
    volEl.value = Math.round(vol * 100);
    list.forEach(function (t, i) { var li = document.createElement("li"), b = document.createElement("button"); b.type = "button"; b.addEventListener("click", function () { setTrack(i, true); }); li.appendChild(b); listEl.appendChild(li); });
    /* Fenster mittig im Bildschirm (auf Handys), sonst rechts am Knopf; nie über den Rand hinaus */
    function place() {
      if (!open) return;
      var vw = document.documentElement.clientWidth, w = Math.min(270, vw * 0.86), wr = wrap.getBoundingClientRect();
      panel.style.width = w + "px";
      if (vw <= 600) { panel.style.right = "auto"; panel.style.left = Math.round((vw - w) / 2 - wr.left) + "px"; }
      else { panel.style.left = ""; panel.style.right = "0"; }
    }
    window.addEventListener("resize", place);
    btn.addEventListener("click", function () { open = !open; panel.hidden = !open; place(); refresh(); });
    playBtn.addEventListener("click", toggle);
    panel.querySelector(".musprev").addEventListener("click", function () { setTrack(a && a.src ? idx - 1 : startIndex(), true); });
    panel.querySelector(".musnext").addEventListener("click", function () { setTrack(a && a.src ? idx + 1 : startIndex(), true); });
    volEl.addEventListener("input", function () { vol = volEl.value / 100; try { localStorage.setItem(VKEY, String(vol)); } catch (e) {} if (a && playing) a.volume = targetVol(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && open) { open = false; panel.hidden = true; refresh(); btn.focus(); } });
    document.addEventListener("click", function (e) { if (open && !wrap.contains(e.target)) { open = false; panel.hidden = true; refresh(); } });
    document.addEventListener("langchange", refresh);
    var main = document.getElementById("audio");
    if (main) { ["play", "playing"].forEach(function (ev) { main.addEventListener(ev, function () { ducked = true; if (playing) fade(); }); }); ["pause", "ended"].forEach(function (ev) { main.addEventListener(ev, function () { ducked = false; if (playing) fade(); }); }); }
    refresh();
  }
})();