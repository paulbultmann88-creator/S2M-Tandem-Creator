#!/usr/bin/env python3
"""
Generiert alle deutschen Audio-Dateien für Einhorn Schach
mit Microsoft Edge TTS (de-DE-KatjaNeural).
Wird in GitHub Actions ausgeführt – keine lokale Ausführung nötig.
"""

import asyncio
import os
import re
import sys
import unicodedata
import edge_tts

VOICE = "de-DE-KatjaNeural"
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "../public/audio")


def text_to_slug(text: str) -> str:
    """Erzeugt einen deterministischen Dateinamen aus einem Text."""
    for src, dst in [("ä","ae"),("ö","oe"),("ü","ue"),("ß","ss"),
                     ("Ä","ae"),("Ö","oe"),("Ü","ue")]:
        text = text.replace(src, dst)
    text = text.lower()
    text = unicodedata.normalize("NFD", text)
    text = text.encode("ascii", "ignore").decode("ascii")
    text = re.sub(r"[^a-z0-9]", "-", text)
    text = re.sub(r"-+", "-", text)
    text = text.strip("-")
    return text[:60]


# ── Alle Phrasen der App ────────────────────────────────────────────────────
PHRASES = [
    # Splash / Begrüßung
    "Hallo! Ich bin Stella, dein Einhorn! Lass uns zusammen Schach lernen!",
    "Tippe auf mich, um zu starten!",

    # Hauptmenü
    "Was möchtest du tun?",
    "Lerne, wie die Figuren ziehen!",
    "Löse ein lustiges Rätsel!",
    "Spiel gegen mich!",
    "Was möchtest du lernen?",

    # König
    "Das ist der König! Er ist die wichtigste Figur!",
    "Der König kann ein Feld in jede Richtung gehen.",
    "Beschütze deinen König immer gut!",
    "Wenn der König gefangen ist, verlierst du das Spiel.",

    # Dame
    "Das ist die Dame! Sie ist die stärkste Figur!",
    "Die Dame kann so weit sie will gehen. In alle Richtungen!",
    "Die Dame ist sehr wertvoll. Pass gut auf sie auf!",
    "Sie kann wie ein Turm und wie ein Läufer ziehen.",

    # Turm
    "Das ist der Turm!",
    "Der Turm läuft gerade. Vorwärts, rückwärts oder zur Seite.",
    "Zwei Türme zusammen sind sehr stark!",
    "Der Turm kann nicht schräg gehen.",

    # Läufer
    "Das ist der Läufer!",
    "Der Läufer läuft immer schräg. So weit er will!",
    "Der Läufer bleibt immer auf seiner Farbe!",
    "Ein Läufer ist auf hellen, einer auf dunklen Feldern.",

    # Springer
    "Das ist der Springer! Er ist ganz besonders!",
    "Der Springer springt wie ein L. Zwei Felder vor, dann eins zur Seite.",
    "Der Springer kann über andere Figuren drüber springen!",
    "Kein anderer kann das. Der Springer ist einzigartig!",

    # Bauer
    "Das ist ein Bauer!",
    "Der Bauer läuft immer geradeaus. Aber er schlägt schräg.",
    "Wenn ein Bauer ans Ende kommt, wird er zur Dame!",
    "Am Anfang darf der Bauer zwei Felder weit gehen.",

    # Strategie
    "Die Mitte ist wichtig!",
    "Stelle deine Figuren in die Mitte des Bretts. Da sind sie am stärksten!",
    "Von der Mitte aus kannst du überall hinspringen!",
    "Bring deine Figuren raus!",
    "Am Anfang: Bewege alle deine Figuren. Erst dann angreifen!",
    "Eine Figur, die noch nicht bewegt wurde, kann nicht helfen.",
    "Schütze deinen König!",
    "Verstecke deinen König hinter den Bauern. Da ist er sicher!",
    "Ein König in der Mitte ist in Gefahr!",
    "Schau, ob du schlagen kannst!",
    "Schau immer: Kann ich eine Figur schlagen? Aber pass auf dich selbst auf!",
    "Schlage keine Figur, wenn du danach selbst geschlagen wirst.",
    "Rette deine Figuren!",
    "Wenn eine deiner Figuren angegriffen wird, rette sie schnell!",
    "Jede Figur ist wertvoll!",

    # Feedback
    "Super! Das war ein toller Zug!",
    "Wunderbar! Du bist so klug!",
    "Genau richtig! Bravo!",
    "Fantastisch! Du spielst ganz toll!",
    "Richtig! Weiter so!",
    "Hmm, das geht leider nicht. Versuch es nochmal!",
    "Fast! Schau nochmal genau hin.",
    "Das war nicht ganz richtig. Du schaffst das!",
    "Noch einmal! Ich glaube an dich!",
    "Schau mal auf das leuchtende Feld!",
    "Das leuchtende Feld zeigt dir den richtigen Zug!",
    "Achtung! Dein König ist in Gefahr! Rette ihn!",
    "Schach! Der König des Gegners ist in Gefahr!",
    "Schachmatt! Du hast gewonnen! Das war fantastisch!",
    "Oh nein, Schachmatt. Aber nicht aufgeben! Nächstes Mal schaffst du es!",
    "Unentschieden! Ihr seid gleich stark!",
    "Diese Figur kann da nicht hingehen.",
    "Das ist nicht deine Figur!",
    "Tippe zuerst auf eine deiner Figuren!",

    # KI (Stella)
    "Hmm, ich überlege kurz...",
    "Jetzt bin ich dran!",
    "Achtung! Ich greife deine Figur an!",
    "Oh, das war ein guter Zug!",
    "Fertig! Du bist dran!",

    # Spielen
    "Ich bin Stella. Du spielst Weiß! Du fängst an!",
    "Neues Spiel! Du fängst an!",

    # Puzzle
    "Kannst du dieses Rätsel lösen?",
    "Richtig! Du hast das Rätsel gelöst! Toll gemacht!",
    "Möchtest du das nächste Rätsel?",
    "Du hast alle Rätsel gelöst! Du bist ein Schach-Champion!",

    # Puzzle-Inhalte
    "Die Dame kann den gegnerischen Turm schlagen! Tippe auf die Dame, dann auf den Turm!",
    "Die gegnerische Dame steht ganz alleine da! Dein Turm kann sie schlagen!",
    "Du kannst den König mit einem einzigen Zug fangen! Kannst du ihn finden?",
    "Oh nein! Der gegnerische Turm greift deinen Läufer an. Beweg ihn schnell weg!",
    "Dein König ist in Schach! Beweg ihn schnell in Sicherheit!",
    "Dein Springer kann mit einem Zug zwei Figuren gleichzeitig angreifen! Das nennt man Gabel!",
    "Dein Bauer kann ans Ende laufen und zur Dame werden! Beweg ihn ans Ende!",
    "Kannst du mit deiner Dame Schach geben?",

    # Puzzle-Hinweise
    "Die Dame und der Turm stehen auf derselben Linie. Die Dame kann zum Turm laufen!",
    "Dein Turm und die Dame stehen auf derselben Linie!",
    "Bewege die Dame auf das Feld neben dem König. Dann kann er nicht mehr entkommen!",
    "Bewege den Läufer weg vom Turm! Er kann schräg laufen!",
    "Bewege den König weg von der Linie des Turms!",
    "Wenn der Springer auf f6 steht, greift er den König und den Turm gleichzeitig an!",
    "Der Bauer steht fast am Ende. Ein Feld noch!",
    "Die Dame kann sehr weit gehen! Schau, wo der König steht!",

    # Puzzle-Konzepte
    "Super! Wenn eine Figur nicht verteidigt ist, kannst du sie schlagen!",
    "Die Dame ist die stärkste Figur! Wenn du sie schlagen kannst, tu es!",
    "Schachmatt! Der König kann nirgendwo mehr hingehen. Du hast gewonnen!",
    "Gut gemacht! Wenn eine Figur angegriffen wird, rette sie!",
    "Der König muss immer aus dem Schach raus! Gut gemacht!",
    "Eine Gabel! Du greifst zwei Figuren auf einmal an. Das ist eine tolle Taktik!",
    "Wenn ein Bauer die letzte Reihe erreicht, wird er zur Dame! Das ist eine Umwandlung!",
    "Schach! Wenn du den König bedrohst, muss der Gegner reagieren!",

    # Puzzle-Erfolge
    "Toll! Du hast den Turm geschlagen!",
    "Toll! Die Dame ist weg. Das war ein riesiger Gewinn!",
    "Schachmatt! Fantastisch! Du hast gewonnen!",
    "Dein Läufer ist gerettet!",
    "Dein König ist in Sicherheit!",
    "Gabel! Du greifst König und Turm gleichzeitig an!",
    "Dein Bauer ist zur Dame geworden! Wunderbar!",
    "Schach! Du hast den König bedroht!",

    # Allgemein
    "Zurück zum Menü.",
]


async def generate_one(text: str, filepath: str) -> None:
    communicate = edge_tts.Communicate(text, VOICE, rate="-5%")
    await communicate.save(filepath)
    print(f"  ✓ {os.path.basename(filepath)}")


async def main() -> None:
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    existing = set(os.listdir(OUTPUT_DIR))

    tasks = []
    skipped = 0
    for phrase in PHRASES:
        slug = text_to_slug(phrase)
        filename = f"{slug}.mp3"
        filepath = os.path.join(OUTPUT_DIR, filename)
        if filename in existing:
            skipped += 1
            continue
        tasks.append(generate_one(phrase, filepath))

    print(f"Generiere {len(tasks)} Dateien ({skipped} bereits vorhanden)...")

    # In Batches à 5 mit kurzer Pause – schont den Rate-Limiter
    for i in range(0, len(tasks), 5):
        batch = tasks[i:i + 5]
        await asyncio.gather(*batch)
        if i + 5 < len(tasks):
            await asyncio.sleep(0.3)

    print(f"\nFertig! {len(tasks)} MP3-Dateien in {OUTPUT_DIR}")


if __name__ == "__main__":
    asyncio.run(main())
