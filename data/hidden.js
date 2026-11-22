/* Fips' Suchstube: Suchbilder. Jede Szene hat mehrere Listen mit je 5 Dingen.
   x, y = Mitte des Dings in Prozent des Bildes (von links/oben), r = Trefferradius in Prozent der Bildbreite.
   Neue Szene: Bild nach assets/adv legen, Szene und Listen hier ergänzen (jedes Ding muss auf dem Bild wirklich sichtbar sein!). */
window.HIDDEN = {
  scenes: [
    { id: "dorf", src: "assets/puzzle.jpg", w: 1536, h: 1024, stars: 0,
      title: { de: "Das verschneite Märchendorf", en: "The snowy fairy-tale village", hu: "A havas mesefalu" },
      lists: [
        [ { n: { de: "Goldener Schlüssel", en: "Golden key", hu: "Aranykulcs" }, x: 85.6, y: 86.4, r: 5 },
          { n: { de: "Laterne", en: "Lantern", hu: "Lámpás" }, x: 14, y: 22.5, r: 5.5 },
          { n: { de: "Roter Briefkasten", en: "Red mailbox", hu: "Piros postaláda" }, x: 84.6, y: 54.7, r: 8 },
          { n: { de: "Kleines Geschenk", en: "Little gift", hu: "Kis ajándék" }, x: 37.4, y: 79, r: 3.5 },
          { n: { de: "Kirche", en: "Church", hu: "Templom" }, x: 60.5, y: 21.5, r: 5 } ],
        [ { n: { de: "Stern am Himmel", en: "Star in the sky", hu: "Csillag az égen" }, x: 67, y: 4.5, r: 3.5 },
          { n: { de: "Schlitten", en: "Sleigh", hu: "Szán" }, x: 60, y: 77, r: 7 },
          { n: { de: "Schneemann", en: "Snowman", hu: "Hóember" }, x: 14, y: 55, r: 7 },
          { n: { de: "Fuchs", en: "Fox", hu: "Róka" }, x: 30, y: 72, r: 6 },
          { n: { de: "Steinbrücke", en: "Stone bridge", hu: "Kőhíd" }, x: 52, y: 46, r: 7 } ]
      ] },
    { id: "post", src: "assets/adv/story_tagebuch1.jpg", w: 1536, h: 1024, stars: 6,
      title: { de: "Fips’ Postamt", en: "Fips’ post office", hu: "Fips postahivatala" },
      lists: [
        [ { n: { de: "Zimtschnecke", en: "Cinnamon roll", hu: "Fahéjas csiga" }, x: 14.5, y: 83, r: 5 },
          { n: { de: "Zahnrad", en: "Cogwheel", hu: "Fogaskerék" }, x: 84.5, y: 29.5, r: 4.5 },
          { n: { de: "Tintenfass", en: "Ink bottle", hu: "Tintásüveg" }, x: 64.1, y: 67, r: 3.5 },
          { n: { de: "Goldener Stern", en: "Golden star", hu: "Aranycsillag" }, x: 86.6, y: 18.5, r: 3.5 },
          { n: { de: "Brief mit rotem Siegel", en: "Letter with a red seal", hu: "Piros pecsétes levél" }, x: 28.5, y: 17, r: 4 } ],
        [ { n: { de: "Tasse mit Kakao", en: "Cup of cocoa", hu: "Bögre kakaó" }, x: 76.5, y: 66, r: 5 },
          { n: { de: "Federkiel", en: "Quill", hu: "Lúdtoll" }, x: 68, y: 56, r: 4 },
          { n: { de: "Siegelstempel", en: "Seal stamp", hu: "Pecsétnyomó" }, x: 70, y: 73, r: 4 },
          { n: { de: "Briefkorb", en: "Letter basket", hu: "Levélkosár" }, x: 7, y: 66, r: 7 },
          { n: { de: "Kerze", en: "Candle", hu: "Gyertya" }, x: 3.5, y: 40, r: 3.5 } ]
      ] },
    { id: "werkstatt", src: "assets/adv/story_maschine1.jpg", w: 1536, h: 1024, stars: 24,
      title: { de: "Tüftels Werkstatt", en: "Tüftel’s workshop", hu: "Tüftel műhelye" },
      lists: [
        [ { n: { de: "Zahnrad", en: "Cogwheel", hu: "Fogaskerék" }, x: 44, y: 70, r: 7 },
          { n: { de: "Kerze", en: "Candle", hu: "Gyertya" }, x: 3, y: 77, r: 4.5 },
          { n: { de: "Tintenfass", en: "Ink bottle", hu: "Tintásüveg" }, x: 25, y: 88, r: 5 },
          { n: { de: "Schriftrolle", en: "Scroll", hu: "Tekercs" }, x: 39.5, y: 93, r: 6 },
          { n: { de: "Laterne", en: "Lantern", hu: "Lámpás" }, x: 74, y: 10, r: 5 } ],
        [ { n: { de: "Glas", en: "Glass jar", hu: "Üvegedény" }, x: 28, y: 7, r: 4 },
          { n: { de: "Schraubenschlüssel", en: "Wrench", hu: "Csavarkulcs" }, x: 10.5, y: 60, r: 3.5 },
          { n: { de: "Schutzbrille", en: "Goggles", hu: "Védőszemüveg" }, x: 20, y: 15, r: 5 },
          { n: { de: "Stern auf dem Zifferblatt", en: "Star on the dial", hu: "Csillag a számlapon" }, x: 48.5, y: 52, r: 4 },
          { n: { de: "Dickes Buch", en: "Big book", hu: "Vastag könyv" }, x: 13, y: 83, r: 7 } ]
      ] }
  ]
};
