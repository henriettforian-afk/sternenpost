/* Wichtelspiele: Liste aller Minispiele für die Auswahl (hub.js). open = Name der Funktion in Advent. Neues Spiel: hier einen Eintrag ergänzen. */
window.GAMES = [
  { id: "memo",   open: "openMemo",   img: "assets/wf_seal.png",        title: { de: "Wichtel-Memo", en: "Elf Memo", hu: "Manó-memória" },
    desc: { de: "Finde alle Paare!", en: "Find all the pairs!", hu: "Találd meg az összes párt!" } },
  { id: "puzzle", open: "openPuzzle", img: "assets/puzzle.jpg",         title: { de: "Sternenpuzzle", en: "Star Puzzle", hu: "Csillagkirakó" },
    desc: { de: "Setze das Bild wieder zusammen.", en: "Put the picture back together.", hu: "Rakd ki újra a képet." } },
  { id: "hidden", open: "openHidden", img: "assets/adv/story_tagebuch1.jpg", title: { de: "Fips’ Suchstube", en: "Fips’ Search Room", hu: "Fips keresőszobája" },
    desc: { de: "Hilf Fips, verlorene Dinge zu finden.", en: "Help Fips find lost things.", hu: "Segíts Fipsnek megkeresni az elveszett dolgokat." } },
  { id: "gz",     open: "openGZ",     img: "assets/adv/gz_magic.png",   title: { de: "Geschenkzauber", en: "Gift Magic", hu: "Ajándékvarázs" },
    desc: { de: "Verbinde gleiche Dinge zu einem Zauberpaket.", en: "Combine matching things into a magic package.", hu: "Egyesítsd az egyformákat varázscsomaggá." } },
  { id: "trio",   open: "openTrio",   img: "assets/adv/tr_cane.png",    title: { de: "Wichtel-Trio", en: "Elf Trio", hu: "Manóhármas" },
    desc: { de: "Sammle immer drei gleiche Dinge.", en: "Always collect three matching things.", hu: "Mindig három egyformát gyűjts össze." } },
  { id: "pf",     open: "openPostfenster", img: "assets/adv/po_star.png", title: { de: "Wichtel-Postfenster", en: "Elf Post Windows", hu: "Manó-postaablakok" },
    desc: { de: "Fange die Sternenbriefe aus den Fenstern.", en: "Catch the star letters from the windows.", hu: "Kapd el az ablakokból felbukkanó csillagos leveleket." } },
  { id: "gf",     open: "openGeschenkefaenger", img: "assets/adv/gf_red.png", title: { de: "Geschenkefänger", en: "Gift Catcher", hu: "Ajándékfogó" },
    desc: { de: "Fange die fallenden Geschenke auf.", en: "Catch the falling gifts.", hu: "Kapd el a hulló ajándékokat." } },
  { id: "match3", open: "openMatch3", img: "assets/adv/m3_star.png",    title: { de: "Sternenzauber", en: "Star Magic", hu: "Csillagvarázslat" },
    desc: { de: "Tausche und verbinde drei gleiche Zeichen.", en: "Swap and match three of a kind.", hu: "Cserélj, és párosíts három egyformát." } },
  { id: "color",  open: "openColor",  img: "assets/adv/m3_ball.png",    noStar: true, title: { de: "Sternenmalerei", en: "Star Painting", hu: "Csillagfestő" },
    desc: { de: "Male schöne Bilder an. (Ohne Sternenlicht, nur zum Spaß.)", en: "Color in lovely pictures. (No starlight, just for fun.)", hu: "Színezz szép képeket. (Csillagfény nélkül, csak szórakozásból.)" } }
];