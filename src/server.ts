
/**
 * Rezepte-API – Erster Express-Server
 *
 * Dieser Server stellt Kochrezepte über verschiedene
 * HTTP-Endpunkte bereit.
 *
 * Verwendete Technologien:
 * - Node.js
 * - Express
 * - TypeScript
 */

import express from "express"

// Erstellt eine Express-Anwendung.
const app = express()

// Ermöglicht das Lesen von JSON-Daten im Request-Body.
// Das benötigen wir später beispielsweise für POST-Anfragen.
app.use(express.json())

// Port, auf dem unser Server erreichbar sein soll.
const PORT = 3000

/**
 * Beschreibt den Aufbau eines Rezepts.
 *
 * Ein Interface definiert, welche Eigenschaften
 * ein Rezept besitzt und welche Datentypen sie haben.
 */
interface Rezept {
  id: number
  titel: string
  minuten: number
  portionen: number
  zutaten: string[]
  anleitung: string
}

/**
 * Unsere vorläufige Rezept-Datenbank.
 *
 * Die Rezepte werden zunächst in einem Array gespeichert.
 * Sie existieren nur im Code und nicht in einer echten Datenbank.
 */
const rezepte: Rezept[] = [
  {
    id: 1,
    titel: "Spaghetti Carbonara",
    minuten: 20,
    portionen: 2,
    zutaten: [
      "200 g Spaghetti",
      "100 g Guanciale",
      "2 Eier",
      "50 g Pecorino",
      "Schwarzer Pfeffer"
    ],
    anleitung:
      "Spaghetti kochen. Guanciale anbraten. Eier mit Pecorino " +
      "vermischen und mit den Nudeln und etwas Nudelwasser verrühren."
  },
  {
    id: 2,
    titel: "Linsen-Curry",
    minuten: 30,
    portionen: 4,
    zutaten: [
      "250 g rote Linsen",
      "400 ml Kokosmilch",
      "1 Zwiebel",
      "2 EL Currypulver",
      "400 g gehackte Tomaten"
    ],
    anleitung:
      "Zwiebel anbraten, Currypulver hinzugeben und kurz mitrösten. " +
      "Linsen, Kokosmilch und Tomaten hinzufügen und weich köcheln."
  },
  {
    id: 3,
    titel: "Tomaten-Mozzarella-Salat",
    minuten: 10,
    portionen: 2,
    zutaten: [
      "3 Tomaten",
      "125 g Mozzarella",
      "Frisches Basilikum",
      "Olivenöl",
      "Salz und Pfeffer"
    ],
    anleitung:
      "Tomaten und Mozzarella in Scheiben schneiden. " +
      "Mit Basilikum, Olivenöl, Salz und Pfeffer anrichten."
  },
  {
    id: 4,
    titel: "Gemüsepfanne",
    minuten: 25,
    portionen: 2,
    zutaten: [
      "1 Zucchini",
      "1 Paprika",
      "1 Karotte",
      "1 Zwiebel",
      "2 EL Olivenöl"
    ],
    anleitung:
      "Gemüse waschen und klein schneiden. " +
      "Mit Olivenöl in einer Pfanne anbraten und würzen."
  }
]

/**
 * Aufgabe 2 – Startseite
 *
 * HTTP-Methode: GET
 * Pfad: /
 *
 * res.send() schickt einen Text als Antwort zurück.
 */
app.get("/", (req, res) => {
  res.send("Willkommen bei der Rezepte-API 👋")
})

/**
 * Aufgabe 2 – Health-Check
 *
 * HTTP-Methode: GET
 * Pfad: /health
 *
 * Überprüft, ob unser Server erreichbar ist.
 * res.json() schickt ein JSON-Objekt zurück.
 */
app.get("/health", (req, res) => {
  res.json({ status: "ok" })
})

/**
 * Aufgabe 3 – Alle Rezepte ausgeben
 * Bonus – Rezepte nach Zubereitungszeit filtern
 *
 * HTTP-Methode: GET
 * Pfad: /recipes
 *
 * Optionaler Query-Parameter:
 * /recipes?maxMinuten=20
 *
 * Ohne Query-Parameter werden alle Rezepte zurückgegeben.
 */
app.get("/recipes", (req, res) => {
  // Liest den optionalen Query-Parameter aus der URL.
  const maxMinuten = req.query.maxMinuten

  // Ohne Filter wird die vollständige Liste zurückgegeben.
  if (maxMinuten === undefined) {
    return res.json(rezepte)
  }

  // Der Query-Parameter muss genau ein gültiger Zahlenwert sein.
  if (typeof maxMinuten !== "string") {
    return res.status(400).json({
      fehler: "maxMinuten muss eine gültige Zahl sein"
    })
  }

  // Wandelt den String aus der URL in eine Zahl um.
  const minuten = Number(maxMinuten)

  // Ungültige oder negative Werte werden abgelehnt.
  if (
    maxMinuten.trim() === "" ||
    !Number.isFinite(minuten) ||
    minuten < 0
  ) {
    return res.status(400).json({
      fehler: "maxMinuten muss eine gültige positive Zahl sein"
    })
  }

  /**
   * filter() erstellt ein neues Array mit allen Rezepten,
   * deren Zubereitungszeit kleiner oder gleich dem Grenzwert ist.
   */
  const gefilterteRezepte = rezepte.filter(
    (rezept) => rezept.minuten <= minuten
  )

  // Gibt die gefilterte Rezeptliste als JSON zurück.
  return res.json(gefilterteRezepte)
})

/**
 * Aufgabe 3 – Ein Rezept anhand seiner ID finden
 *
 * HTTP-Methode: GET
 * Pfad: /recipes/:id
 *
 * :id ist ein dynamischer URL-Parameter.
 * Beispiel: /recipes/2
 */
app.get("/recipes/:id", (req, res) => {
  // Liest die ID als String aus dem URL-Pfad.
  const { id } = req.params

  // Wandelt die ID in eine Zahl um.
  const rezeptId = Number(id)

  /**
   * find() durchsucht die Rezeptliste.
   * Es wird das erste Rezept mit passender ID zurückgegeben.
   *
   * Wird kein Rezept gefunden, liefert find() undefined.
   */
  const rezept = rezepte.find(
    (eintrag) => eintrag.id === rezeptId
  )

  // Falls kein Rezept existiert, antwortet der Server mit 404.
  if (!rezept) {
    return res.status(404).json({
      fehler: "Rezept nicht gefunden"
    })
  }

  // Gibt das gefundene Rezept als JSON zurück.
  return res.json(rezept)
})

/**
 * Startet den Express-Server.
 *
 * app.listen() wartet auf eingehende HTTP-Anfragen.
 * Die Callback-Funktion wird ausgeführt, sobald der Server startet.
 */
app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`)
})
