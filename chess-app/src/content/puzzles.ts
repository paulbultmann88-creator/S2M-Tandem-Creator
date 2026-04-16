export interface Puzzle {
  id: number
  title: string
  intro: string       // Stella erklärt die Aufgabe (gesprochen)
  fen: string         // Startposition
  playerColor: 'w' | 'b'
  solutions: string[] // Akzeptierte Züge im Format "e2e4" (from+to)
  hint: string        // Hinweis wenn Kind nicht weiterkommt (gesprochen)
  concept: string     // Lern-Konzept (gesprochen nach Lösung)
  successMessage: string
}

export const PUZZLES: Puzzle[] = [
  {
    id: 1,
    title: 'Schlag den Turm!',
    intro: 'Die Dame kann den gegnerischen Turm schlagen! Tippe auf die Dame, dann auf den Turm!',
    // Weiss: Dame d1, König e1 | Schwarz: Turm d4, König e8
    fen: '4k3/8/8/8/3r4/8/8/3QK3 w - - 0 1',
    playerColor: 'w',
    solutions: ['d1d4'],
    hint: 'Die Dame und der Turm stehen auf derselben Linie. Die Dame kann zum Turm laufen!',
    concept: 'Super! Wenn eine Figur nicht verteidigt ist, kannst du sie schlagen!',
    successMessage: 'Toll! Du hast den Turm geschlagen!',
  },
  {
    id: 2,
    title: 'Schachmatt!',
    intro: 'Du kannst den König mit einem einzigen Zug fangen! Kannst du ihn finden?',
    // Weiss: Dame g7, König f6 | Schwarz: König h8
    fen: '7k/6Q1/5K2/8/8/8/8/8 w - - 0 1',
    playerColor: 'w',
    solutions: ['g7g8'],
    hint: 'Bewege die Dame auf das Feld neben dem König. Dann kann er nicht mehr entkommen!',
    concept: 'Schachmatt! Der König kann nirgendwo mehr hingehen. Du hast gewonnen!',
    successMessage: 'Schachmatt! Fantastisch! Du hast gewonnen!',
  },
  {
    id: 3,
    title: 'Rette den Läufer!',
    intro: 'Oh nein! Der gegnerische Turm greift deinen Läufer an. Beweg ihn schnell weg!',
    // Weiss: Läufer d2, König e1 | Schwarz: Turm a2, König e8
    fen: '4k3/8/8/8/8/8/r2B4/4K3 w - - 0 1',
    playerColor: 'w',
    solutions: ['d2c1', 'd2c3', 'd2b4', 'd2a5', 'd2e3', 'd2f4', 'd2g5', 'd2h6'],
    hint: 'Bewege den Läufer weg vom Turm! Er kann schräg laufen!',
    concept: 'Gut gemacht! Wenn eine Figur angegriffen wird, rette sie!',
    successMessage: 'Dein Läufer ist gerettet!',
  },
  {
    id: 4,
    title: 'Schlag die Dame!',
    intro: 'Die gegnerische Dame steht ganz alleine da! Dein Turm kann sie schlagen!',
    // Weiss: Turm d1, König e1 | Schwarz: Dame d6, König e8
    fen: '4k3/8/3q4/8/8/8/8/3RK3 w - - 0 1',
    playerColor: 'w',
    solutions: ['d1d6'],
    hint: 'Dein Turm und die Dame stehen auf derselben Linie!',
    concept: 'Die Dame ist die stärkste Figur! Wenn du sie schlagen kannst, tu es!',
    successMessage: 'Toll! Die Dame ist weg. Das war ein riesiger Gewinn!',
  },
  {
    id: 5,
    title: 'König in Gefahr!',
    intro: 'Dein König ist in Schach! Beweg ihn schnell in Sicherheit!',
    // Weiss: König e1 | Schwarz: Turm e3, König e8
    fen: '4k3/8/8/8/8/4r3/8/4K3 w - - 0 1',
    playerColor: 'w',
    solutions: ['e1d1', 'e1d2', 'e1f1', 'e1f2'],
    hint: 'Bewege den König weg von der Linie des Turms!',
    concept: 'Der König muss immer aus dem Schach raus! Gut gemacht!',
    successMessage: 'Dein König ist in Sicherheit!',
  },
  {
    id: 6,
    title: 'Gabel mit dem Springer!',
    intro: 'Dein Springer kann mit einem Zug zwei Figuren gleichzeitig angreifen! Das nennt man Gabel!',
    // Weiss: Springer e4, König e1 | Schwarz: Turm d7, König e8
    fen: '4k3/3r4/8/8/4N3/8/8/4K3 w - - 0 1',
    playerColor: 'w',
    solutions: ['e4f6'],
    hint: 'Wenn der Springer auf f6 steht, greift er den König und den Turm gleichzeitig an!',
    concept: 'Eine Gabel! Du greifst zwei Figuren auf einmal an. Das ist eine tolle Taktik!',
    successMessage: 'Gabel! Du greifst König und Turm gleichzeitig an!',
  },
  {
    id: 7,
    title: 'Bauern-Dame!',
    intro: 'Dein Bauer kann ans Ende laufen und zur Dame werden! Beweg ihn ans Ende!',
    // Weiss: Bauer e7, König e1 | Schwarz: König a8
    fen: 'k7/4P3/8/8/8/8/8/4K3 w - - 0 1',
    playerColor: 'w',
    solutions: ['e7e8q', 'e7e8r', 'e7e8'],
    hint: 'Der Bauer steht fast am Ende. Ein Feld noch!',
    concept: 'Wenn ein Bauer die letzte Reihe erreicht, wird er zur Dame! Das ist eine Umwandlung!',
    successMessage: 'Dein Bauer ist zur Dame geworden! Wunderbar!',
  },
  {
    id: 8,
    title: 'Zurück ins Schach!',
    intro: 'Kannst du mit deiner Dame Schach geben?',
    // Weiss: Dame a1, König g1 | Schwarz: König e8, Bauer e7
    fen: '4k3/4p3/8/8/8/8/8/Q5K1 w - - 0 1',
    playerColor: 'w',
    solutions: ['a1a8', 'a1e1'],
    hint: 'Die Dame kann sehr weit gehen! Schau, wo der König steht!',
    concept: 'Schach! Wenn du den König bedrohst, muss der Gegner reagieren!',
    successMessage: 'Schach! Du hast den König bedroht!',
  },
]
