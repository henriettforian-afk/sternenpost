/* Der große Weihnachtsbaum: 12 Schmuckstücke, eines pro geradem Türchen (2, 4, …, 24).
   Der Schmuck wird beim ersten Öffnen des Türchens freigeschaltet und kostet kein Sternenlicht.
   slots: Plätze am Baum in Prozent der Bildbreite/-höhe (x, y). w: Breite des Schmucks in Prozent der Baumbreite. */
window.TREE = {
  img: "assets/adv/tree.png",
  slots: [[51, 6.9], [44, 19], [60, 22], [35, 33], [53, 36], [68, 36], [26, 50], [44, 53], [62, 52], [77, 56], [31, 68], [66, 70]],
  ornaments: [
    { id: "t02", day: 2,  sprite: "bauble1",  name: "Rote Kugel",       w: 10 },
    { id: "t04", day: 4,  sprite: "bauble2",  name: "Goldene Kugel",    w: 10 },
    { id: "t06", day: 6,  sprite: "m3_bell",  name: "Goldene Glocke",   w: 9 },
    { id: "t08", day: 8,  sprite: "cane",     name: "Zuckerstange",     w: 7.5 },
    { id: "t10", day: 10, sprite: "bauble3",  name: "Grüne Kugel",      w: 10 },
    { id: "t12", day: 12, sprite: "bow",      name: "Rote Schleife",    w: 12 },
    { id: "t14", day: 14, sprite: "bauble4",  name: "Cremefarbene Kugel", w: 10 },
    { id: "t16", day: 16, sprite: "woodstar", name: "Holzstern",        w: 11 },
    { id: "t18", day: 18, sprite: "lantern",  name: "Mini-Laterne",     w: 8 },
    { id: "t20", day: 20, sprite: "holly",    name: "Stechpalmenzweig", w: 12 },
    { id: "t22", day: 22, sprite: "gift3",    name: "Mini-Geschenk",    w: 11 },
    { id: "t24", day: 24, sprite: "topper",   name: "Goldene Baumspitze", w: 15 }
  ]
};
/* Lichterkette am Baum: Bögen in Bild-Pixeln (Bild 760x998). Leuchtet immer, kostet nichts. */
window.TREE.leds = {
  colors: ["#ffd45a", "#ff5a4a", "#6fd0ff", "#7ee08a"],
  swags: [
    { a: [292, 236], c: [395, 304], b: [498, 236], n: 6 },
    { a: [188, 394], c: [380, 482], b: [572, 394], n: 8 },
    { a: [100, 556], c: [380, 664], b: [660, 556], n: 11 },
    { a: [96, 690], c: [380, 790], b: [664, 690], n: 12 }
  ]
};
window.TREE.byDay = {};
window.TREE.ornaments.forEach(function (o) { window.TREE.byDay[o.day] = o; });
