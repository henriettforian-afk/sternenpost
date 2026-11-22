/* Die 24 Geschichten des Adventsdorfes.
   Jeder Eintrag ist reine Daten: neue Texte, Sprecher oder Töne können hier geändert werden,
   ohne dass der Rest der Seite angefasst werden muss.
   - speaker: Name der Figur-Pose (siehe SPRITES in app.js)
   - paragraphs: kurze Absätze (Deutsch)
   - light: Sternenlicht für das erste Öffnen
   - audio: optional, Datei im Hauptordner (startet nur auf Knopfdruck)
   - special: optionale Markierung (z. B. Nikolaustag)
*/
window.ADVENT = {
  names: { fips: "Fips", luni: "Luni", tuftel: "Meister Tüftel" },

  residents: [
    { id: "fips", name: "Fips", role: "Postwichtel", sprite: "fips_wave",
      traits: [ [1, "Fips ist der Postwichtel im Schneedorf."], [4, "Er hat es immer eilig."], [4, "Er verliert oft seine Briefe."],
                [9, "Manchmal findet er den Weg nicht."], [19, "Er schreibt sich Listen auf, die er dann verliert."], [23, "Er hat ein riesengroßes Herz."] ] },
    { id: "luni", name: "Luni", role: "junges Rentier", sprite: "luni_stand",
      traits: [ [2, "Luni ist ein junges Rentier."], [2, "Sie ist neugierig, aber ein bisschen schüchtern."], [8, "Sie liebt das Klingeln ihrer Glöckchen."],
                [11, "Sie übt für den großen Schlittenflug."], [18, "Sie wird jeden Tag mutiger."] ] },
    { id: "tuftel", name: "Meister Tüftel", role: "Erfinder", sprite: "tuf_show",
      traits: [ [3, "Meister Tüftel ist ein alter, kluger Wichtel."], [3, "Er erfindet gern seltsame Dinge."], [10, "Er hat die Sternenlaterne gebaut."],
                [13, "Er hat auch das Wichtelfunk-Radio gebaut."], [22, "Er glaubt immer an Luni."] ] }
  ],

  days: [
    { day: 1, title: "Willkommen im Schneedorf", speaker: "fips_wave", light: 3,
      paragraphs: [
        "Hallo! Ich bin Fips, der Postwichtel im Schneedorf. Schön, dass du da bist! Ab heute darfst du jeden Tag ein neues Türchen öffnen.",
        "Hinter jedem Türchen wartet eine kleine Geschichte. Und wenn du Lust auf ein Spiel hast oder den Weihnachtsbaum schmücken möchtest, findest du beides gleich oben. Viel Freude!" ] },
    { day: 2, title: "Luni hinter dem Heu", speaker: "luni_hide", light: 3,
      paragraphs: [
        "Im Stall am Dorfrand wohnt Luni, ein junges Rentier. Sie ist neugierig, aber auch ein bisschen schüchtern.",
        "Wenn jemand kommt, versteckt sie sich hinter dem Heuballen und schaut nur mit einem Auge heraus. Besuche sie doch heute! Mit etwas Heu fasst sie bestimmt Mut." ] },
    { day: 3, title: "Meister Tüftel und der Glitzerknopf", speaker: "tuf_work", light: 3,
      paragraphs: [
        "Am Rand des Dorfes steht die Werkstatt von Meister Tüftel. Er ist schon sehr alt und bastelt immer an seltsamen Erfindungen.",
        "Heute baut er einen Knopf, der den Schnee zum Glitzern bringt. Er drückt ihn – und nichts passiert. „Hm“, brummt er und lächelt, „morgen klappt es bestimmt.“" ] },
    { day: 4, title: "Eine Spur aus Briefen", speaker: "fips_run", light: 3,
      paragraphs: [
        "Fips rennt durchs Dorf. Plötzlich fällt ein Brief aus seiner Tasche, dann noch einer und noch einer. Er merkt es nicht einmal!",
        "Eine ganze Spur aus Umschlägen liegt hinter ihm im Schnee. Zum Glück sammelt Luni sie leise ein und legt sie auf Fips’ Briefkasten." ] },
    { day: 5, title: "Morgen kommt der Nikolaus!", speaker: "luni_stand", light: 3,
      paragraphs: [
        "Im ganzen Dorf wird geputzt und gesungen. Morgen kommt der Nikolaus! Luni bürstet ihr Fell, bis es glänzt.",
        "„Und wenn ich etwas falsch mache?“, fragt sie leise. Meister Tüftel lächelt: „Du musst nur du selbst sein, kleine Luni.“" ] },
    { day: 6, title: "Nikolaustag im Schneedorf", speaker: "wf_fips", light: 5, special: "nikolaus",
      paragraphs: [
        "Heute ist der 6. Dezember: Der Nikolaus ist da! Er trägt einen großen Sack und hat ein warmes Lächeln. Fips ist so aufgeregt, dass er seine Mütze verkehrt herum aufsetzt.",
        "Der Nikolaus lobt alle im Dorf: Luni für ihren Mut, Fips für seinen Eifer und Meister Tüftel für seine Ideen. „Jeder von euch ist wichtig“, sagt er.",
        "Dann legt er für jeden eine kleine Überraschung in den Stiefel. Und für dich schenkt er heute fünf Sternenlichter. Frohen Nikolaustag!" ] },
    { day: 7, title: "Der Knopf glitzert!", speaker: "tuf_show", light: 3,
      paragraphs: [
        "Meister Tüftel drückt seinen Glitzerknopf noch einmal. Und tatsächlich: Für einen kurzen Augenblick funkelt der Schnee vor der Werkstatt wie tausend kleine Sterne.",
        "„Es hat geklappt!“, ruft er. Dann ist es schon wieder vorbei. „Nun ja … fast.“ Er schreibt sich alles ganz genau auf." ] },
    { day: 8, title: "Lunis Glöckchen", speaker: "luni_stand", light: 3,
      paragraphs: [
        "Heute probiert Luni zum ersten Mal ihr Geschirr mit den kleinen Glöckchen an. Kling, kling! Sie erschrickt und hüpft zur Seite.",
        "Dann hört sie noch einmal genau hin. „Das klingt ja schön!“, flüstert sie. Von nun an klingelt sie bei jedem Schritt ein bisschen mit Absicht." ] },
    { day: 9, title: "Fips verläuft sich", speaker: "fips_think", light: 3,
      paragraphs: [
        "Fips soll ein Paket zum Bäcker bringen. Doch wo wohnt der Bäcker noch mal? Dreimal läuft er im Kreis um denselben Tannenbaum.",
        "Am Ende zeigt ihm ein kleiner Spatz den Weg. „Ich brauche eine Karte“, seufzt Fips. „Aber wo habe ich meine Karte?“" ] },
    { day: 10, title: "Die Sternenlaterne", speaker: "tuf_show", light: 3,
      paragraphs: [
        "Meister Tüftel hat etwas Wunderbares gebaut: die Sternenlaterne. Sie leuchtet immer dann, wenn jemand im Dorf etwas Freundliches tut.",
        "Das Licht nennt er Sternenlicht. Auch du sammelst Sternenlicht, wenn du Türchen öffnest und dich um Luni kümmerst. Damit kannst du das Dorf schmücken!" ] },
    { day: 11, title: "Der kleine Probeschlitten", speaker: "luni_stand", light: 3,
      paragraphs: [
        "Heute übt Luni mit einem ganz leeren Schlitten. Er ist leicht wie eine Feder, und trotzdem wackelt sie bei jedem Schritt.",
        "„Langsam“, sagt Meister Tüftel. „Wir haben noch viele Tage Zeit.“ Luni atmet tief ein und geht noch einen Schritt. Und noch einen." ] },
    { day: 12, title: "Die verschwundene Karte", speaker: "fips_run", light: 3,
      paragraphs: [
        "Fips hat endlich eine Karte vom Dorf gezeichnet. Stolz zeigt er sie allen. Eine Stunde später ist sie weg.",
        "Wer findet sie? Natürlich Luni! Sie hat die Karte im Heu gerochen. Fips umarmt sie so fest, dass ihre Glöckchen klingeln." ] },
    { day: 13, title: "So entstand das Wichtelfunk", speaker: "tuf_work", light: 3,
      paragraphs: [
        "Wusstest du, dass Meister Tüftel das Wichtelfunk-Radio gebaut hat? Vor vielen Jahren wollte er einfach nur Musik hören.",
        "Dann merkte er: Aus dem Radio kann man auch Nachrichten schicken! Seitdem sagt Fips seine geheimen Botschaften hinein – wenn er nicht gerade seine Briefe sucht." ] },
    { day: 14, title: "Ein Geschenk im Schlitten", speaker: "luni_pet", light: 3,
      paragraphs: [
        "Heute darf Luni ein einziges kleines Geschenk im Schlitten ziehen. Es ist für Fips, aber das weiß er nicht.",
        "Sie geht ganz vorsichtig, Schritt für Schritt. Als sie ankommt, strahlt Luni. Das Geschenk ist heil, und sie ist ein kleines Stück größer geworden." ] },
    { day: 15, title: "Schneesturm in der Werkstatt", speaker: "tuf_think", light: 3,
      paragraphs: [
        "Draußen heult der Wind, und der Schnee fliegt waagerecht. Alle flüchten in Meister Tüftels Werkstatt.",
        "Dort ist es warm und es duftet nach Zimt. Luni liegt neben dem Ofen, Fips erzählt Geschichten, und Meister Tüftel schraubt leise an einer Spieluhr. So gemütlich war es lange nicht." ] },
    { day: 16, title: "Fips bringt Plätzchen", speaker: "fips_wave", light: 3,
      paragraphs: [
        "Fips hat Plätzchen für das ganze Dorf gebacken. Er bringt jedem eine Tüte: dem Bäcker, Meister Tüftel, Luni und sogar dem Spatz.",
        "Nur seine eigene Tüte vergisst er. Zum Glück teilen alle ein Plätzchen mit ihm. Und es schmeckt ihm noch besser als sonst." ] },
    { day: 17, title: "Glitzer im Fell", speaker: "tuf_show", light: 3,
      paragraphs: [
        "Meister Tüftel probiert seinen Glitzerknopf an Luni aus. Fffft! Ein Hauch von Sternenstaub legt sich auf ihr Fell.",
        "Luni schaut an sich herunter. „Ich funkle!“, ruft sie und dreht sich im Kreis. Jetzt will sie gar nicht mehr aufhören." ] },
    { day: 18, title: "Über die kleine Brücke", speaker: "luni_stand", light: 3,
      paragraphs: [
        "Vor der Steinbrücke bleibt Luni stehen. Das Eis darunter knackt, und der Schlitten hinter ihr rutscht ein wenig.",
        "Doch dann hört sie Fips rufen: „Du schaffst das!“ Sie geht los, Schritt für Schritt, und plötzlich ist sie auf der anderen Seite. Alle jubeln." ] },
    { day: 19, title: "Fips’ Liste", speaker: "fips_think", light: 3,
      paragraphs: [
        "Damit er nichts vergisst, schreibt Fips eine lange Liste: Briefe, Pakete, Plätzchen, Glöckchen. Dann legt er sie irgendwohin.",
        "Nach einer Weile fragt er: „Habt ihr meine Liste gesehen?“ Luni schnuppert kurz und zeigt mit der Nase auf seine Mütze. Da steckt sie." ] },
    { day: 20, title: "Der Schlitten glänzt", speaker: "tuf_work", light: 3,
      paragraphs: [
        "Meister Tüftel poliert den großen Schlitten, bis man sich darin spiegeln kann. Jede Kufe, jede Schraube, jeder Stern.",
        "Fips zählt die Briefe in den Säcken. Eins, zwei, drei, vier … und noch einmal von vorn. Nur noch wenige Tage, dann geht es los!" ] },
    { day: 21, title: "Die Wunschbriefe kommen", speaker: "fips_run", light: 3,
      paragraphs: [
        "Heute kommen so viele Briefe an wie noch nie! Fips stapelt sie bis unter die Decke. Manche sind bunt bemalt, manche riechen nach Plätzchen.",
        "Im ganzen Dorf liest man leise mit. Alle wünschen sich etwas Schönes, und die meisten wünschen sich auch etwas für andere. Das macht Meister Tüftel ganz warm ums Herz." ] },
    { day: 22, title: "Die Sorge vor der Nacht", speaker: "luni_pet", light: 3,
      paragraphs: [
        "Luni ist still. „Was ist, wenn es draußen ganz dunkel ist?“, fragt sie. „Wenn ich etwas nicht sehe?“",
        "Meister Tüftel hängt ihr eine kleine Sternenlaterne ans Geschirr. „Das Licht kommt von den Menschen, die an dich denken“, sagt er. „Damit findest du immer deinen Weg.“" ] },
    { day: 23, title: "Der wichtigste Brief", speaker: "fips_think", light: 3,
      paragraphs: [
        "Fips ist ganz blass: Der allerwichtigste Brief ist weg! Er sucht in der Post, im Stall, in der Werkstatt, sogar im Schneemann.",
        "Luni kichert. Dann zeigt sie auf seine Mütze. Fips nimmt sie ab, und da liegt der Brief. „Ich habe wirklich das beste Dorf der Welt“, sagt er." ] },
    { day: 24, title: "Heiligabend im Schneedorf", speaker: "wf_fips", light: 6, special: "heiligabend",
      paragraphs: [
        "Es ist so weit! Der große Schlitten steht bereit. Luni trägt ihre Glöckchen und die kleine Sternenlaterne. Sie ist ein bisschen aufgeregt, aber sie hat keine Angst mehr.",
        "Fips winkt, Meister Tüftel drückt seinen Glitzerknopf, und diesmal funkelt der ganze Schnee. Das Dorf strahlt in allen Farben, auch dank all deinem Sternenlicht.",
        "Frohe Weihnachten, liebe Freundin, lieber Freund! Wir freuen uns schon, dich im nächsten Jahr wiederzusehen." ] }
  ],

  /* Luni-Zeilen, je nach Vertrauen (Zahl der Tage, an denen du dich um sie gekümmert hast) */
  luniLines: [
    { min: 0, text: "Luni schaut dich vorsichtig an. Sie kennt dich noch nicht gut." },
    { min: 3, text: "Luni kommt dir schon entgegen und schnuppert an deiner Hand." },
    { min: 6, text: "Luni klingelt fröhlich mit ihren Glöckchen, wenn sie dich sieht." },
    { min: 10, text: "Luni stupst dich mit der Nase an. Sie vertraut dir ganz und gar." }
  ]
};


/* Bilder pro Tag (optional): Datei im Ordner assets/adv/.
   Fehlt die Datei, wird automatisch die Figur des Sprechers (speaker) gezeigt. */
window.ADVENT.images = {
  3: "tueftel_glitzer.png", 7: "tueftel_glitzer.png", 17: "tueftel_glitzer.png",
  4: "fips_briefe.png", 21: "fips_briefe.png",
  5: "luni_tueftel.png",
  9: "fips_karte.png", 12: "fips_karte.png", 19: "fips_karte.png",
  10: "tueftel_laterne.png",
  11: "luni_schlitten.png", 14: "luni_schlitten.png",
  13: "tueftel_radio.png",
  15: "ofen.png",
  16: "plaetzchen.png",
  18: "luni_bruecke.png",
  22: "luni_laterne.png",
  23: "fips_muetze.png",
  24: "szenteste.png"
};
