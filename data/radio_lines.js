/* Zufällige Funksprüche für das Wichtelfunk-Radio (von Fips und vom Nikolaus). Kurze, freundliche Sätze.
   who: "fips" oder "nik". audio (optional): Dateiname einer Sprachaufnahme je Sprache, z. B. { de: "funk_01_de.mp3" } – ohne audio erscheint nur der Text.
   Neue Sprüche einfach ergänzen. */
window.RADIO_LINES = [
  { who: "fips", de: "Psst! Hier ist Fips. Hat jemand meine Mütze gesehen? … Ach, sie sitzt auf meinem Kopf.",
    en: "Psst! Fips here. Has anyone seen my cap? … Oh, it is on my head.",
    hu: "Psszt! Itt Fips. Látta valaki a sapkámat? … Ja, a fejemen van." },
  { who: "fips", de: "Ich habe heute zweimal denselben Brief ausgetragen. Der Briefkasten war ziemlich überrascht.",
    en: "I delivered the same letter twice today. The mailbox was quite surprised.",
    hu: "Ma kétszer vittem ki ugyanazt a levelet. A postaláda eléggé meglepődött." },
  { who: "fips", de: "Luni hat mir verraten, dass sie heimlich Schlittenziehen übt. Aber pssst, das habe ich nicht gesagt!",
    en: "Luni told me she is secretly practicing pulling the sleigh. But psst, I did not say that!",
    hu: "Luni elárulta, hogy titokban szánhúzást gyakorol. De psszt, ezt én nem mondtam!" },
  { who: "fips", de: "Meister Tüftel baut gerade etwas Neues. Es blinkt, es brummt und es riecht ein bisschen nach Zimtschnecke.",
    en: "Master Tüftel is building something new. It blinks, it hums and it smells a little like a cinnamon roll.",
    hu: "Tüftel mester éppen valami újat épít. Villog, zúg, és egy kicsit fahéjas csigaillata van." },
  { who: "fips", de: "Falls du eine Idee brauchst: Ein selbst gemaltes Bild ist ein wunderbares Geschenk.",
    en: "If you need an idea: a picture you painted yourself is a wonderful gift.",
    hu: "Ha ötletre van szükséged: egy saját festett kép csodálatos ajándék." },
  { who: "nik", de: "Ho, ho, ho! Hier spricht der Nikolaus. Hast du heute schon jemandem eine Freude gemacht?",
    en: "Ho, ho, ho! This is Nikolaus speaking. Have you made anyone happy today?",
    hu: "Ho, ho, ho! Itt a Mikulás beszél. Szereztél ma már valakinek örömet?" },
  { who: "nik", de: "Hier ist der Nikolaus. Stell am Abend vor dem 6. Dezember deinen Stiefel vors Fenster oder vor die Tür. Wer weiß, was ich hineinlege?",
    en: "This is Nikolaus. On the evening before 6 December, put your boot outside the window or the door. Who knows what I will put inside?",
    hu: "Itt a Mikulás. December 6. előtti este tedd ki a csizmádat az ablakba vagy az ajtó elé. Ki tudja, mit teszek bele?" },
  { who: "nik", de: "Ho, ho! Ich habe deinen Wunschzettel gelesen. Er war sehr schön geschrieben.",
    en: "Ho, ho! I read your wish list. It was written very nicely.",
    hu: "Ho, ho! Elolvastam a kívánságlistádat. Nagyon szépen volt megírva." },
  { who: "nik", de: "Das schönste Geschenk ist oft gemeinsame Zeit. Aber ein kleiner Lebkuchen schadet auch nicht.",
    en: "The loveliest gift is often time together. But a little gingerbread does not hurt either.",
    hu: "A legszebb ajándék gyakran a közös idő. De egy kis mézeskalács sem árt." },
  { who: "nik", de: "Teilen macht Freude: Wer etwas abgibt, hat danach oft mehr Freunde.",
    en: "Sharing is joyful: whoever shares often ends up with more friends.",
    hu: "A megosztás örömet szerez: aki ad másoknak, annak gyakran több barátja lesz." },
  { who: "nik", de: "Denkt an die Vögel im Winter. Sonnenblumenkerne mögen sie sehr, Brot lieber nicht.",
    en: "Think of the birds in winter. They like sunflower seeds very much, but better no bread.",
    hu: "Gondoljatok télen a madarakra. A napraforgómagot nagyon szeretik, kenyeret inkább ne adjatok." },
  { who: "nik", de: "Frohe Adventszeit, ihr Lieben! Zieht euch warm an: Mütze, Schal und Handschuhe halten gemütlich.",
    en: "Happy Advent, dear ones! Dress warmly: a hat, a scarf and gloves keep you cozy.",
    hu: "Boldog adventet, kedveseim! Öltözzetek melegen: a sapka, a sál és a kesztyű kényelmesen melegen tart." },
  { who: "tuf", de: "Hier spricht Meister Tüftel. Mein Wichtelfunk funktioniert wieder, es knistert nur ein bisschen. Das gehört dazu!",
    en: "This is Master Tüftel speaking. My Elf Radio works again, it just crackles a little. That is part of the charm!",
    hu: "Itt Tüftel mester beszél. A Manórádióm újra működik, csak egy kicsit recseg. Ez hozzátartozik!" },
  { who: "tuf", de: "Ich suche meine Brille … Ach, sie sitzt auf meiner Stirn. Ich glaube, das habe ich von Fips gelernt.",
    en: "I am looking for my glasses … Oh, they are on my forehead. I think I learned that from Fips.",
    hu: "A szemüvegemet keresem … Ja, a homlokomon van. Azt hiszem, ezt Fipstől tanultam." },
  { who: "tuf", de: "Ein guter Erfinder macht Fehler und lernt daraus. Fehler sind nur Versuche, die noch nicht fertig sind.",
    en: "A good inventor makes mistakes and learns from them. Mistakes are just experiments that are not finished yet.",
    hu: "A jó feltaláló hibázik, és tanul belőle. A hibák csak olyan kísérletek, amelyek még nem készültek el." },
  { who: "tuf", de: "Wenn du einmal nicht weiterkommst: Mach eine Pause, iss einen Lebkuchen und versuche es später noch einmal.",
    en: "If you ever get stuck: take a break, eat a gingerbread and try again later.",
    hu: "Ha egyszer elakadsz: tarts szünetet, egyél meg egy mézeskalácsot, és próbáld meg később újra." },
  { who: "tuf", de: "Die Glocke an Lunis Geschirr hat einen besonders schönen Klang. Ich habe lange daran gefeilt.",
    en: "The bell on Luni's harness has an especially lovely sound. I worked on it for a long time.",
    hu: "A Luni hámján lévő csengőnek különösen szép hangja van. Sokáig csiszoltam." },
  { who: "tuf", de: "Wusstest du? Zwei gleiche Dinge zusammenzubringen kann etwas ganz Neues ergeben. Das nennt man Erfindergeist.",
    en: "Did you know? Bringing two matching things together can create something completely new. That is called an inventor's spirit.",
    hu: "Tudtad? Ha két egyforma dolgot összehozol, valami egészen új keletkezhet. Ezt hívják feltalálói szellemnek." }
];


/* Sprachaufnahmen: audio/radio/<wer>_<nr>_<sprache>.mp3 (Nummer = Reihenfolge der Sprüche je Sprecher). Wo keine Aufnahme existiert, erscheint nur der Text. */
(function () {
  var have = { fips: [1, 2, 3, 4, 5], nik: [1, 2, 3, 4, 5, 6, 7], tuf: [1, 2, 3, 4, 5, 6] }, cnt = {};
  window.RADIO_LINES.forEach(function (e) {
    cnt[e.who] = (cnt[e.who] || 0) + 1; var n = cnt[e.who];
    if ((have[e.who] || []).indexOf(n) >= 0) {
      var b = "audio/radio/" + e.who + "_" + n + "_"; e.audio = { de: b + "de.mp3", en: b + "en.mp3", hu: b + "hu.mp3" };
    }
  });
})();
