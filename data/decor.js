/* Dekorationen des Adventsdorfes.
   Positionen sind Prozent der Szene (x/y = Mittelpunkt, w = Breite).
   kind "orn"  = Schmuck, passt auf jeden Schmuck-Platz (Bäume).
   kind "fixed" = hat genau einen eigenen Platz (slot). */
window.DECOR = {
  items: [
    { id: "bauble1", name: "Rote Kugel",        cost: 2, kind: "orn", w: 6.4 },
    { id: "bauble2", name: "Goldene Kugel",     cost: 2, kind: "orn", w: 6.4 },
    { id: "bauble3", name: "Grüne Kugel",       cost: 2, kind: "orn", w: 6.4 },
    { id: "bauble4", name: "Stechpalmen-Kugel", cost: 2, kind: "orn", w: 6.4 },
    { id: "bauble5", name: "Herzchen-Kugel",    cost: 2, kind: "orn", w: 6.4 },
    { id: "bow",     name: "Rote Schleife",     cost: 3, kind: "orn", w: 8.5 },
    { id: "cane",    name: "Zuckerstange",      cost: 3, kind: "orn", w: 6 },
    { id: "woodstar",name: "Holzstern",         cost: 3, kind: "orn", w: 7.5 },
    { id: "holly",   name: "Stechpalme",        cost: 2, kind: "orn", w: 8 },
    { id: "topper",  name: "Goldener Stern",    cost: 8, kind: "fixed", slot: { x: 97.4, y: 56.8, w: 8 } },
    { id: "lights_s",name: "Lichterkette",      cost: 4, kind: "fixed", slot: { x: 95.0, y: 33.0, w: 10.5 } },
    { id: "lights_l",name: "Lange Lichterkette",cost: 6, kind: "fixed", slot: { x: 69.5, y: 22.8, w: 42 } },
    { id: "garland", name: "Tannengirlande",    cost: 5, kind: "fixed", slot: { x: 49.5, y: 26.6, w: 60 } },
    { id: "wreath",  name: "Kranz",             cost: 5, kind: "fixed", slot: { x: 12.5, y: 21.5, w: 16 } },
    { id: "bunting", name: "Wimpelkette",       cost: 5, kind: "fixed", slot: { x: 49.5, y: 78.6, w: 62 } },
    { id: "lantern", name: "Laterne",           cost: 6, kind: "fixed", slot: { x: 74.5, y: 85.6, w: 7.5 } },
    { id: "gift1",   name: "Geschenk mit Sternen", cost: 3, kind: "fixed", slot: { x: 12, y: 89, w: 11 } },
    { id: "gift2",   name: "Grünes Geschenk",   cost: 3, kind: "fixed", slot: { x: 22.5, y: 91, w: 10 } },
    { id: "gift3",   name: "Rotes Geschenk",    cost: 3, kind: "fixed", slot: { x: 31, y: 88, w: 9 } },
    { id: "snowman", name: "Schneemann",        cost: 6, kind: "fixed", slot: { x: 87.5, y: 90, w: 15 } }
  ],
  /* Plätze für Schmuck (Bäume) */
  ornSlots: [
    { id: "o1",  x: 95.5, y: 62.5 }, { id: "o2",  x: 92.5, y: 67.5 }, { id: "o3",  x: 96.5, y: 70.5 },
    { id: "o4",  x: 88.5, y: 72.5 }, { id: "o5",  x: 94.0, y: 74.5 }, { id: "o6",  x: 85.0, y: 77.5 },
    { id: "o7",  x: 3.5,  y: 59.5 }, { id: "o8",  x: 8.0,  y: 65.0 }, { id: "o9",  x: 4.0,  y: 71.5 }, { id: "o10", x: 12.0, y: 76.0 },
    { id: "o11", x: 96.0, y: 23.5 }, { id: "o12", x: 97.5, y: 29.0 }, { id: "o13", x: 92.0, y: 37.5 }
  ]
};
