/* Sprüche für die Helfer: wechselt zwischen Wissenswertem/Tipps (data/helper_talk.js) in der gewählten Sprache. */
(function () {
  var A = window.Advent, T = A.T, I = A.I, queues = {};
  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  window.HelperTalk = {
    next: function (who) {
      var list = (window.HELPER_TALK || {})[who] || []; if (!list.length) return "";
      if (!queues[who] || !queues[who].length) queues[who] = shuffle(list.map(function (_, i) { return i; }));
      var e = list[queues[who].pop()];
      return T({ fact: "talk_fact", tip: "talk_tip", value: "talk_value", world: "talk_world" }[e.kind] || "talk_fact") + " " + (e[I.lang()] || e.de);
    }
  };
})();