/* Adventsdorf: Szene, Türchen, Geschichten, Dorfbewohner.
   Alle Texte kommen über I18N (Deutsch, Englisch, Ungarisch).
   Die Minispiele (luni.js, deko.js) hängen sich über window.Advent ein. */
(function () {
  var D = window.ADVENT, X = window.DECOR, S = window.AdventState, I = window.I18N, T = I.t;
  var qs = new URLSearchParams(location.search);
  var testDate = qs.get("datum");

  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function berlinNow() {
    try {
      var o = {}; new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Berlin", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date()).forEach(function (x) { o[x.type] = x.value; });
      return new Date(o.year + "-" + o.month + "-" + o.day + "T12:00:00");
    } catch (e) { return new Date(); }
  }
  function now() { return (testDate && /^\d{4}-\d{2}-\d{2}$/.test(testDate)) ? new Date(testDate + "T12:00:00") : berlinNow(); }
  function todayKey() { var d = now(); return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function unlocked() { var d = now(); return d.getMonth() < 11 ? 0 : Math.min(d.getDate(), 24); }
  function sprite(id) { return (id.indexOf("wf_") === 0 ? "assets/" : "assets/adv/") + id + ".png"; }
  function $(id) { return document.getElementById(id); }
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html !== undefined) e.innerHTML = html; return e; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  var toastTimer;
  function toast(msg) {
    var t = $("toast"); t.textContent = msg; t.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.classList.remove("show"); }, 3200);
  }

  /* ---------- Dialog ---------- */
  var lastFocus = null, onCloseCb = null;
  var modal = $("modal"), mbody = $("mbody"), mclose = $("mclose");
  function openModal(node, label, onClose) {
    lastFocus = document.activeElement; onCloseCb = onClose || null;
    mbody.innerHTML = ""; mbody.appendChild(node);
    modal.setAttribute("aria-label", label || T("dialog")); modal.hidden = false; document.body.classList.add("modal-open");
    mclose.focus();
  }
  function closeModal() {
    if (modal.hidden) return;
    modal.hidden = true; document.body.classList.remove("modal-open"); mbody.innerHTML = "";
    if (onCloseCb) { try { onCloseCb(); } catch (e) {} onCloseCb = null; }
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  mclose.addEventListener("click", closeModal);
  modal.addEventListener("click", function (e) { if (e.target === modal) closeModal(); });
  document.addEventListener("keydown", function (e) {
    if (modal.hidden) return;
    if (e.key === "Escape") { closeModal(); return; }
    if (e.key === "Tab") {
      var f = modal.querySelectorAll("button:not([disabled]), [href], audio[controls]");
      if (!f.length) return; var a = f[0], z = f[f.length - 1];
      if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
      else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
    }
  });

  /* ---------- Sternenlicht ---------- */
  function renderLight() { $("lightnum").textContent = S.get().stars; }
  /* Jede Belohnung gibt es genau einmal (key). Sterne werden nie ausgegeben. */
  function award(key, n) { var st = S.get(); if (st.awards[key]) return 0; st.awards[key] = true; st.stars += n; S.save(); renderLight(); return n; }
  /* Memo und Puzzle teilen sich eine Tagesbelohnung: nur das erste gelöste Spiel des Tages gibt 2 Sternenlicht (alter Schlüssel memo: wird mitgezählt) */
  function awardGame() { var k = todayKey(); if (S.get().awards["memo:" + k]) return 0; return award("game:" + k, 2); }
  var UNLOCK_FACTOR = 3; /* Dorfschmuck: ab (Preis x 3) Sternenlicht freigeschaltet, nichts wird abgezogen */
  function unlockAt(it) { return it.cost * UNLOCK_FACTOR; }
  function itemUnlocked(it) { var st = S.get(); return !!st.owned[it.id] || st.stars >= unlockAt(it); }


  /* ---------- Türchen ---------- */
  function doorState(day) {
    var st = S.get(), unl = unlocked();
    if (st.opened[day]) return "open";
    if (day <= unl) return "avail";
    return "locked";
  }
  function renderDoors() {
    var wrap = $("doors"), unl = unlocked(), html = "";
    for (var d = 1; d <= 24; d++) {
      var s = doorState(d), story = I.story(d);
      var label = T("door_n", { d: d }) + (s === "open" ? T("door_open", { title: story.title }) : s === "avail" ? T("door_avail") : T("door_locked", { d: d }));
      html += '<button type="button" class="door ' + s + (story.base.special ? " special" : "") + (d === unl && s === "avail" ? " today" : "") + '" data-day="' + d + '" aria-label="' + esc(label) + '"' + (s === "locked" ? ' aria-disabled="true"' : "") + '><span class="num">' + d + '</span></button>';
    }
    wrap.innerHTML = html;
  }
  $("doors").addEventListener("click", function (e) {
    var b = e.target.closest(".door"); if (!b) return;
    var day = +b.getAttribute("data-day");
    if (day > unlocked()) { toast(T("locked_msg", { d: day })); return; }
    openStory(day);
  });

  /* ---------- Geschichte ---------- */
  var storyAudio = null;
  function stopAudio() { if (storyAudio) { storyAudio.pause(); storyAudio = null; } }
  function openStory(day) {
    var story = I.story(day), base = story.base, st = S.get(), first = !st.opened[day];
    if (first) { st.opened[day] = true; award("door:" + day, 1); S.save(); renderLight(); renderDoors(); renderResidents(); document.dispatchEvent(new Event("advent:stars")); }
    var box = el("div", "story" + (base.special ? " special" : ""));
    var left = el("div", "portrait" + (base.speaker.indexOf("tuf_") === 0 ? " bust" : "")); var img = new Image(); img.alt = ""; var art = D.images && D.images[day];
    if (art) { img.onerror = function () { img.onerror = null; img.src = sprite(base.speaker); }; img.src = "assets/adv/" + art; } else img.src = sprite(base.speaker);
    left.appendChild(el("p", "daytag sidetag", esc(T("door_n", { d: day })))); left.appendChild(img); box.appendChild(left);
    var right = el("div", "text");
    right.appendChild(el("p", "daytag maintag", esc(T("door_n", { d: day }))));
    right.appendChild(el("h2", "", esc(story.title)));
    story.paragraphs.forEach(function (p) { right.appendChild(el("p", "", esc(p))); });
    if (base.audio) {
      var row = el("div", "audiorow"); var btn = el("button", "btn small", esc(T("audio_play"))); btn.type = "button";
      var msg = el("p", "audiomsg"); msg.setAttribute("role", "status");
      var src = (I.lang() === "en" && base.audioEn) ? base.audioEn : (I.lang() === "hu" && base.audioHu) ? base.audioHu : base.audio, germanAudio = (src === base.audio) && I.lang() !== "de";
      if (germanAudio) msg.textContent = T("audio_note");
      btn.addEventListener("click", function () {
        msg.textContent = germanAudio ? T("audio_note") : "";
        if (storyAudio && !storyAudio.paused) { storyAudio.pause(); btn.textContent = T("audio_resume"); return; }
        if (!storyAudio) {
          storyAudio = new Audio(src);
          storyAudio.addEventListener("ended", function () { btn.textContent = T("audio_again"); storyAudio = null; });
          storyAudio.addEventListener("error", function () { msg.textContent = T("audio_err_load"); btn.textContent = T("audio_play"); storyAudio = null; });
        }
        var p = storyAudio.play(); btn.textContent = T("audio_pause");
        if (p && p.catch) p.catch(function () { msg.textContent = T("audio_err_play"); btn.textContent = T("audio_play"); storyAudio = null; });
      });
      row.appendChild(btn); row.appendChild(msg); right.appendChild(row);
    }
    right.appendChild(el("p", "reward", esc(first ? T("story_reward", { n: 1 }) : T("story_again"))));
    var orn = window.TREE && window.TREE.byDay[day];
    if (orn) right.appendChild(el("p", "reward", esc(T("tree_got", { name: I.decorName({ id: orn.sprite, name: orn.name }) }))));
    box.appendChild(right);
    openModal(box, T("door_n", { d: day }) + ": " + story.title, stopAudio);
    if (first) toast(T("toast_light", { n: 1 }));
  }

  /* ---------- Dekoration in der Szene ---------- */
  function findItem(id) { for (var i = 0; i < X.items.length; i++) if (X.items[i].id === id) return X.items[i]; return null; }
  function slotPos(slotId, item) {
    if (item.kind === "fixed") return item.slot;
    for (var i = 0; i < X.ornSlots.length; i++) if (X.ornSlots[i].id === slotId) return { x: X.ornSlots[i].x, y: X.ornSlots[i].y, w: item.w };
    return null;
  }
  function renderDecor() {
    /* Dorfschmuck erscheint automatisch mit den gesammelten Sternenlichtern (ab Preis x 3) */
    var layer = $("decor"), html = "", orn = 0;
    X.items.forEach(function (it) {
      if (!itemUnlocked(it)) return;
      var p;
      if (it.kind === "fixed") p = it.slot;
      else { var sl = X.ornSlots[orn++]; if (!sl) return; p = { x: sl.x, y: sl.y, w: it.w }; }
      html += '<div class="dec" data-slot="' + it.id + '" style="left:' + p.x + '%;top:' + p.y + '%;width:' + p.w + '%"><img src="' + sprite(it.id) + '" alt=""></div>';
    });
    layer.innerHTML = html;
  }
  function renderLuni() {
    var st = S.get(), cared = st.lastCare === todayKey();
    $("lunihot").innerHTML = '<img src="' + sprite(cared ? "luni_pet" : "luni_stand") + '" alt="">';
    $("lunihot").setAttribute("aria-label", cared ? T("luni_done_aria") : T("luni_visit_aria"));
  }

  /* ---------- Dorfbewohner ---------- */
  function renderResidents() {
    var st = S.get(), html = "";
    D.residents.forEach(function (r) {
      var tr = I.resident(r), shown = [];
      r.traits.forEach(function (t, i) { if (st.opened[t[0]]) shown.push(tr.traits[i]); });
      if (!shown.length) {
        html += '<article class="res locked"><div class="rsp"><img src="' + sprite(r.sprite) + '" alt=""></div><div class="rtx"><h3>? ? ?</h3><p class="rrole">' + esc(T("res_unknown_role")) + '</p><p class="rnote">' + esc(T("res_unknown_note")) + '</p></div></article>';
        return;
      }
      html += '<article class="res"><div class="rsp"><img src="' + sprite(r.sprite) + '" alt=""></div><div class="rtx"><h3>' + esc(tr.name) + '</h3><p class="rrole">' + esc(tr.role) + '</p><ul>' +
        shown.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></div></article>";
    });
    $("reslist").innerHTML = html;
  }

  function renderHint() {
    var unl = unlocked(), h = $("datehint");
    if (unl === 0) h.textContent = T("hint_before");
    else if (unl >= 24 && now().getDate() >= 24) h.textContent = T("hint_all");
    else h.textContent = T("hint_today", { n: unl });
    if (testDate) { var tb = $("testbanner"); tb.hidden = false; tb.textContent = T("test_date", { d: testDate }); }
  }

  $("btnReset").addEventListener("click", function () {
    if (window.confirm(T("reset_confirm"))) { S.reset(); Advent.renderAll(); toast(T("reset_done")); }
  });
  function renderTest() {
    var sel = $("testdate"), cur = testDate && /^2026-12-(\d\d)$/.test(testDate) ? String(parseInt(testDate.slice(8), 10)) : "";
    var h = '<option value="">' + esc(T("test_today")) + "</option>";
    for (var d = 1; d <= 24; d++) h += '<option value="' + d + '"' + (String(d) === cur ? " selected" : "") + ">" + esc(T("test_day", { d: d })) + "</option>";
    sel.innerHTML = h;
  }
  $("testdate").addEventListener("change", function () {
    var v = this.value, u = new URL(location.href);
    if (v) u.searchParams.set("datum", "2026-12-" + pad(+v)); else u.searchParams.delete("datum");
    location.href = u.toString();
  });
  $("btnReset2").addEventListener("click", function () { $("btnReset").click(); });
  function devFlag() { try { return localStorage.getItem("sternenpost-dev") === "1"; } catch (e) { return false; } }
  var DEV = qs.get("dev") === "1" || !!testDate || devFlag();
  /* Versteckter Zugang für den Entwickler: Überschrift 5 Mal schnell antippen schaltet das Testmenü an/aus */
  (function () {
    var taps = 0, t0 = 0, h = document.querySelector("h1");
    if (!h) return;
    h.addEventListener("click", function () {
      var n = Date.now(); if (n - t0 > 3000) taps = 0; t0 = n; taps++;
      if (taps >= 5) { taps = 0; var on = !devFlag(); try { localStorage.setItem("sternenpost-dev", on ? "1" : "0"); } catch (e) {}
        $("testpanel").hidden = !on && !(qs.get("dev") === "1" || testDate); if (on) $("testpanel").open = true; toast(T("test_title") + (on ? " ✓" : " –")); }
    });
  })();
  $("testpanel").hidden = !DEV; if (testDate) $("testpanel").open = true;
  $("btnStars").addEventListener("click", function () { var st = S.get(); st.stars += 10; S.save(); renderLight(); document.dispatchEvent(new Event("advent:stars")); toast("+10 (Test)"); });
  $("btnHidden").addEventListener("click", function () { Advent.openHidden && Advent.openHidden(); });
  $("btnGZ").addEventListener("click", function () { Advent.openGZ && Advent.openGZ(); });
  $("btnTr").addEventListener("click", function () { Advent.openTrio && Advent.openTrio(); });
  $("btnPf").addEventListener("click", function () { Advent.openPostfenster && Advent.openPostfenster(); });
  $("btnGf").addEventListener("click", function () { Advent.openGeschenkefaenger && Advent.openGeschenkefaenger(); });
  $("btnHub").addEventListener("click", function () { Advent.openHub && Advent.openHub(); });
  $("btnMatch").addEventListener("click", function () { Advent.openMatch3 && Advent.openMatch3(); });
  $("btnColor").addEventListener("click", function () { Advent.openColor && Advent.openColor(); });
  $("btnPuzzle").addEventListener("click", function () { Advent.openPuzzle && Advent.openPuzzle(); });
  $("btnMemo").addEventListener("click", function () { Advent.openMemo && Advent.openMemo(); });
  $("btnAllDeco").addEventListener("click", function () {
    var st = S.get(); for (var d = 1; d <= 24; d++) { if (!st.opened[d]) { st.opened[d] = true; award("door:" + d, 1); } }
    S.save(); Advent.renderAll(); document.dispatchEvent(new Event("advent:stars")); toast(T("test_opened"));
  });
  $("btnLuni").addEventListener("click", function () { Advent.openLuni && Advent.openLuni(); });
  $("lunihot").addEventListener("click", function () { Advent.openLuni && Advent.openLuni(); });
  $("btnTree").addEventListener("click", function () { Advent.openTree && Advent.openTree(); });

  var Advent = window.Advent = {
    D: D, X: X, S: S, I: I, T: T, el: el, esc: esc, $: $, sprite: sprite, toast: toast, openModal: openModal, closeModal: closeModal,
    todayKey: todayKey, unlocked: unlocked, nowDate: now, award: award, awardGame: awardGame, unlockAt: unlockAt, itemUnlocked: itemUnlocked, findItem: findItem,
    renderDecor: renderDecor, renderLuni: renderLuni, renderLight: renderLight,
    renderAll: function () { renderLight(); renderDoors(); renderDecor(); renderLuni(); renderResidents(); renderHint(); renderTest(); document.dispatchEvent(new Event("advent:render")); }
  };
  document.addEventListener("langchange", function () { closeModal(); Advent.renderAll(); });
  Advent.renderAll();
})();
