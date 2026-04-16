/**
 * Deutsches Sprach-Skript für Einhorn Schach
 * Alle Texte sind für 5-Jährige optimiert:
 * - Max. ~8 Wörter pro Satz
 * - Einfache Sprache
 * - Motivierend und warm
 */

export const SCRIPT = {
  // ── Begrüßung ──────────────────────────────────────────────────────────
  welcome: 'Hallo! Ich bin Stella, dein Einhorn! Lass uns zusammen Schach lernen!',
  tapToStart: 'Tippe auf mich, um zu starten!',

  // ── Hauptmenü ──────────────────────────────────────────────────────────
  mainMenu: 'Was möchtest du tun?',
  menuLearn: 'Lerne, wie die Figuren ziehen!',
  menuPuzzle: 'Löse ein lustiges Rätsel!',
  menuPlay: 'Spiel gegen mich!',

  // ── Figuren-Lektionen ──────────────────────────────────────────────────
  pieces: {
    king: {
      name: 'Der König',
      intro: 'Das ist der König! Er ist die wichtigste Figur!',
      move: 'Der König kann ein Feld in jede Richtung gehen.',
      tip: 'Beschütze deinen König immer gut!',
      extra: 'Wenn der König gefangen ist, verlierst du das Spiel.',
    },
    queen: {
      name: 'Die Dame',
      intro: 'Das ist die Dame! Sie ist die stärkste Figur!',
      move: 'Die Dame kann so weit sie will gehen. In alle Richtungen!',
      tip: 'Die Dame ist sehr wertvoll. Pass gut auf sie auf!',
      extra: 'Sie kann wie ein Turm und wie ein Läufer ziehen.',
    },
    rook: {
      name: 'Der Turm',
      intro: 'Das ist der Turm!',
      move: 'Der Turm läuft gerade. Vorwärts, rückwärts oder zur Seite.',
      tip: 'Zwei Türme zusammen sind sehr stark!',
      extra: 'Der Turm kann nicht schräg gehen.',
    },
    bishop: {
      name: 'Der Läufer',
      intro: 'Das ist der Läufer!',
      move: 'Der Läufer läuft immer schräg. So weit er will!',
      tip: 'Der Läufer bleibt immer auf seiner Farbe!',
      extra: 'Ein Läufer ist auf hellen, einer auf dunklen Feldern.',
    },
    knight: {
      name: 'Der Springer',
      intro: 'Das ist der Springer! Er ist ganz besonders!',
      move: 'Der Springer springt wie ein L. Zwei Felder vor, dann eins zur Seite.',
      tip: 'Der Springer kann über andere Figuren drüber springen!',
      extra: 'Kein anderer kann das. Der Springer ist einzigartig!',
    },
    pawn: {
      name: 'Der Bauer',
      intro: 'Das ist ein Bauer!',
      move: 'Der Bauer läuft immer geradeaus. Aber er schlägt schräg.',
      tip: 'Wenn ein Bauer ans Ende kommt, wird er zur Dame!',
      extra: 'Am Anfang darf der Bauer zwei Felder weit gehen.',
    },
  },

  // ── Strategie-Lektionen ────────────────────────────────────────────────
  strategy: {
    center: {
      title: 'Die Mitte ist wichtig!',
      explain: 'Stelle deine Figuren in die Mitte des Bretts. Da sind sie am stärksten!',
      tip: 'Von der Mitte aus kannst du überall hinspringen!',
    },
    develop: {
      title: 'Bring deine Figuren raus!',
      explain: 'Am Anfang: Bewege alle deine Figuren. Erst dann angreifen!',
      tip: 'Eine Figur, die noch nicht bewegt wurde, kann nicht helfen.',
    },
    protectKing: {
      title: 'Schütze deinen König!',
      explain: 'Verstecke deinen König hinter den Bauern. Da ist er sicher!',
      tip: 'Ein König in der Mitte ist in Gefahr!',
    },
    capture: {
      title: 'Schau, ob du schlagen kannst!',
      explain: 'Schau immer: Kann ich eine Figur schlagen? Aber pass auf dich selbst auf!',
      tip: 'Schlage keine Figur, wenn du danach selbst geschlagen wirst.',
    },
    savePieces: {
      title: 'Rette deine Figuren!',
      explain: 'Wenn eine deiner Figuren angegriffen wird, rette sie schnell!',
      tip: 'Jede Figur ist wertvoll!',
    },
  },

  // ── Feedback ───────────────────────────────────────────────────────────
  feedback: {
    correct: [
      'Super! Das war ein toller Zug!',
      'Wunderbar! Du bist so klug!',
      'Genau richtig! Bravo!',
      'Fantastisch! Du spielst ganz toll!',
      'Richtig! Weiter so!',
    ],
    wrong: [
      'Hmm, das geht leider nicht. Versuch es nochmal!',
      'Fast! Schau nochmal genau hin.',
      'Das war nicht ganz richtig. Du schaffst das!',
      'Noch einmal! Ich glaube an dich!',
    ],
    hint: 'Schau mal auf das leuchtende Feld!',
    hintUsed: 'Das leuchtende Feld zeigt dir den richtigen Zug!',
    check: 'Achtung! Dein König ist in Gefahr! Rette ihn!',
    checkByPlayer: 'Schach! Der König des Gegners ist in Gefahr!',
    checkmateWin: 'Schachmatt! Du hast gewonnen! Das war fantastisch!',
    checkmateLose: 'Oh nein, Schachmatt. Aber nicht aufgeben! Nächstes Mal schaffst du es!',
    draw: 'Unentschieden! Ihr seid gleich stark!',
    invalidMove: 'Diese Figur kann da nicht hingehen.',
    notYourPiece: 'Das ist nicht deine Figur!',
    noPieceSelected: 'Tippe zuerst auf eine deiner Figuren!',
  },

  // ── KI-Kommentare (Stella spielt gegen das Kind) ───────────────────────
  ai: {
    thinking: 'Hmm, ich überlege kurz...',
    myTurn: 'Jetzt bin ich dran!',
    iAttack: 'Achtung! Ich greife deine Figur an!',
    goodMove: 'Oh, das war ein guter Zug!',
    iMadeMove: 'Fertig! Du bist dran!',
  },

  // ── Puzzle ─────────────────────────────────────────────────────────────
  puzzle: {
    intro: 'Kannst du dieses Rätsel lösen?',
    solved: 'Richtig! Du hast das Rätsel gelöst! Toll gemacht!',
    nextPuzzle: 'Möchtest du das nächste Rätsel?',
    allSolved: 'Du hast alle Rätsel gelöst! Du bist ein Schach-Champion!',
  },

  // ── Allgemein ──────────────────────────────────────────────────────────
  back: 'Zurück zum Menü.',
  loading: 'Einen Moment...',
}
