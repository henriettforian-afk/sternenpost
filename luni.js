/* Minispiel: Luni versorgen. Nur Tippen, kein Ziehen nötig.
   Einmal pro Tag gibt es Sternenlicht. Wer einen Tag auslässt, verliert nichts. */
(function () {
  var A = window.Advent, T = A.T, I = A.I;
  var REWARD = 2;

  A.openLuni = function () {
    var st = A.S.get(), key = A.todayKey(), done = st.lastCare === key;
    var box = A.el("div", "luni");
    box.appendChild(A.el("h2", "", A.esc(T("luni_title"))));
    var stage = A.el("div", "lunistage");
    var img = new Image(); img.alt = ""; stage.appendChild(img);
    var hearts = A.el("div", "hearts"); hearts.setAttribute("aria-hidden", "true"); stage.appendChild(hearts);
    var msg = A.el("p", "lunimsg"); msg.setAttribute("role", "status"); msg.setAttribute("aria-live", "polite");
    var reward = A.el("p", "reward");
    var btns = A.el("div", "lunibtns");
    var main = A.el("button", "btn", ""); main.type = "button"; btns.appendChild(main);
    box.appendChild(stage); box.appendChild(msg); box.appendChild(btns); box.appendChild(reward);

    function pose(id) { img.src = A.sprite(id); }
    function heart() {
      var h = A.el("span", "heart", "♥"); h.style.left = (30 + Math.random() * 40) + "%"; hearts.appendChild(h);
      setTimeout(function () { if (h.parentNode) h.parentNode.removeChild(h); }, 1400);
    }
    function wrapPet(on, onTap) {
      var b = stage.querySelector(".petbtn");
      if (!on) { if (b) { stage.insertBefore(img, b); b.parentNode.removeChild(b); } return; }
      if (b) return;
      b = A.el("button", "petbtn"); b.type = "button"; b.setAttribute("aria-label", T("luni_pet_aria"));
      stage.insertBefore(b, img); b.appendChild(img); b.addEventListener("click", onTap);
    }
    var trust = I.luniLine(st.trust);

    function finish() {
      wrapPet(false); pose("luni_pet");
      var s = A.S.get(); s.lastCare = key; s.trust += 1; A.S.save(); A.renderLuni();
      msg.textContent = T("luni_finish");
      reward.textContent = T("luni_happy");
      main.textContent = T("btn_done"); main.disabled = false; main.onclick = A.closeModal;
      A.toast(T("luni_happy"));
    }

    if (done) {
      pose("luni_pet"); msg.textContent = trust + T("luni_done_msg");
      reward.textContent = T("luni_done_reward");
      main.textContent = T("luni_pet_simple"); main.onclick = function () { heart(); heart(); };
    } else {
      pose("luni_hide"); msg.textContent = trust + T("luni_hide");
      main.textContent = T("luni_call");
      main.onclick = function () {
        pose("luni_stand"); msg.textContent = T("luni_peek");
        main.textContent = T("luni_give");
        main.onclick = function () {
          pose("luni_eat"); msg.textContent = T("luni_eating"); main.disabled = true;
          setTimeout(function () {
            main.disabled = false; pose("luni_stand");
            var taps = 0; msg.textContent = T("luni_pet_msg", { n: 0 });
            main.textContent = T("luni_pet_btn", { n: 0 });
            function tap() {
              taps++; heart(); msg.textContent = T("luni_pet_msg", { n: taps });
              main.textContent = T("luni_pet_btn", { n: taps });
              if (taps >= 3) finish();
            }
            wrapPet(true, tap); main.onclick = tap;
          }, 1300);
        };
      };
    }
    A.openModal(box, T("luni_title"));
  };
})();
