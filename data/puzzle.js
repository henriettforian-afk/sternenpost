/* Sternenpuzzle: Bilder und Schwierigkeitsgrade. Ein Spiel (puzzle.js) für alle Bilder.
   Neues Bild: Datei in assets/adv/ ablegen und hier eine Zeile ergänzen. Bilder, die nicht geladen werden können, erscheinen nicht.
   w/h = Seitenverhältnis des Bildes (wird nicht verzerrt). stars = ab so viel Sternenlicht freigeschaltet (nichts wird ausgegeben). */
window.PUZZLE = {
  grids: [3, 4, 5, 6],   /* Leicht, Mittel, Schwer, Meister */
  images: [
    { id: "schluessel", src: "assets/puzzle.jpg",            w: 1536, h: 1024, stars: 0,
      title: { de: "Das Geheimnis des Sternenschlüssels", en: "The Secret of the Star Key", hu: "A csillagkulcs titka" } },
    { id: "fips",       src: "assets/adv/puzzle_fips.jpg",   w: 1536, h: 1024, stars: 30,
      title: { de: "Fips und Luni retten das Rotkehlchen", en: "Fips and Luni Save the Robin", hu: "Fips és Luni megmentik a vörösbegyet" } },
    { id: "dorf",       src: "assets/adv/postkarte.jpg",     w: 1536, h: 1024, stars: 12,
      title: { de: "Weihnachten im Sternendorf", en: "Christmas in Star Village", hu: "Karácsony a Csillagfaluban" } }
  ]
};
