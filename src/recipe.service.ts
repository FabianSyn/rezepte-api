
/**
 * Recipe Service
 *
 * Diese Datei enthält alle Rezeptdaten und die eigentliche Logik.
 *
 * Der Service ist dafür verantwortlich:
 * - Alle Rezepte zurückzugeben
 * - Einzelne Rezepte zu suchen
 * - Neue Rezepte zu erstellen
 * - Vorhandene Rezepte zu löschen
 * - Ungültige Eingaben zu erkennen
 *
 * Fehler werden durch eigene Fehlerklassen ausgelöst.
 * Die globale Error-Middleware verarbeitet sie später.
 */

import {
  RecipeNotFoundError,
  ValidationError
} from "./errors"

/**
 * Beschreibt den Aufbau eines Rezepts.
 *
 * id, titel, minuten und portionen sind verpflichtend.
 * zutaten und anleitung sind optional (?).
 */
export type Rezept = {
  id: number
  titel: string
  minuten: number
  portionen: number
  zutaten?: string[]
  anleitung?: string
}

/**
 * Unsere vorläufige Rezept-Datenbank.
 *
 * Alle Rezepte werden in einem Array gespeichert.
 * Beim Neustart des Servers werden die ursprünglichen
 * Rezepte wiederhergestellt.
 */
let rezepte: Rezept[] = [
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
 * Speichert die nächste freie Rezept-ID.
 *
 * Da unsere vier Beispielrezepte die IDs 1 bis 4 besitzen,
 * beginnt die Nummerierung bei 5.
 */
let naechsteId = 5

/**
 * Gibt alle Rezepte zurück.
 *
 * async sorgt dafür, dass die Funktion ein Promise zurückgibt.
 * Später können die Daten dadurch leichter aus einer
 * echten Datenbank geladen werden.
 */
export async function getAllRecipes(): Promise<Rezept[]> {
  return rezepte
}

/**
 * Sucht ein Rezept anhand seiner ID.
 *
 * find() durchsucht das Array.
 * Wird kein passendes Rezept gefunden, werfen wir
 * einen RecipeNotFoundError.
 *
 * Die Error-Middleware wandelt diesen Fehler in
 * eine HTTP-404-Antwort um.
 */
export async function getRecipeById(
  id: number
): Promise<Rezept> {
  const rezept = rezepte.find(
    (eintrag) => eintrag.id === id
  )

  if (!rezept) {
    throw new RecipeNotFoundError(id)
  }

  return rezept
}

/**
 * Erstellt ein neues Rezept.
 *
 * Omit<Rezept, "id"> bedeutet:
 * Beim Erstellen müssen alle Pflichtfelder außer der ID
 * übergeben werden.
 *
 * Die ID wird automatisch vergeben.
 *
 * Bevor ein Rezept gespeichert wird, prüfen wir
 * die übergebenen Daten.
 */
export async function createRecipe(
  daten: Omit<Rezept, "id">
): Promise<Rezept> {

  /**
   * Prüft, ob ein gültiger Titel vorhanden ist.
   *
   * Auch ein Titel, der nur aus Leerzeichen besteht,
   * ist ungültig.
   *
   * Ist kein gültiger Titel vorhanden, werfen wir
   * den ValidationError mit HTTP-Status 400.
   */
  if (
    !daten ||
    typeof daten.titel !== "string" ||
    daten.titel.trim() === ""
  ) {
    throw new ValidationError(
      "Ein Rezept braucht einen Titel"
    )
  }

  /**
   * Prüft die Zubereitungszeit.
   *
   * minuten muss eine gültige Zahl größer als 0 sein.
   */
  if (
    typeof daten.minuten !== "number" ||
    !Number.isFinite(daten.minuten) ||
    daten.minuten <= 0
  ) {
    throw new ValidationError(
      "Die Zubereitungszeit muss eine positive Zahl sein"
    )
  }

  /**
   * Prüft die Anzahl der Portionen.
   *
   * Erlaubt sind ausschließlich positive ganze Zahlen.
   */
  if (
    typeof daten.portionen !== "number" ||
    !Number.isInteger(daten.portionen) ||
    daten.portionen <= 0
  ) {
    throw new ValidationError(
      "Die Portionsanzahl muss eine positive ganze Zahl sein"
    )
  }

  /**
   * Prüft optionale Zutaten.
   *
   * Wenn Zutaten angegeben werden, müssen diese
   * in einem Array aus Strings stehen.
   */
  if (
    daten.zutaten !== undefined &&
    (
      !Array.isArray(daten.zutaten) ||
      !daten.zutaten.every(
        (zutat) => typeof zutat === "string"
      )
    )
  ) {
    throw new ValidationError(
      "Die Zutaten müssen als Liste aus Texten angegeben werden"
    )
  }

  /**
   * Prüft die optionale Kochanleitung.
   *
   * Eine angegebene Anleitung muss ein String sein.
   */
  if (
    daten.anleitung !== undefined &&
    typeof daten.anleitung !== "string"
  ) {
    throw new ValidationError(
      "Die Anleitung muss ein Text sein"
    )
  }

  /**
   * Erstellt das Rezept mit einer automatisch vergebenen ID.
   *
   * ...daten übernimmt die überprüften Eigenschaften.
   * titel.trim() entfernt überflüssige äußere Leerzeichen.
   */
  const neues: Rezept = {
    ...daten,
    id: naechsteId++,
    titel: daten.titel.trim()
  }

  // Fügt das neue Rezept zum Array hinzu.
  rezepte.push(neues)

  // Gibt das erstellte Rezept zurück.
  return neues
}

/**
 * Löscht ein Rezept anhand seiner ID.
 *
 * filter() erstellt ein neues Array und lässt
 * das Rezept mit der entsprechenden ID weg.
 *
 * Der Vergleich der Array-Längen zeigt,
 * ob tatsächlich ein Rezept entfernt wurde.
 *
 * true  = Rezept erfolgreich gelöscht
 * false = Kein Rezept mit dieser ID gefunden
 */
export async function deleteRecipe(
  id: number
): Promise<boolean> {
  const anzahlVorher = rezepte.length

  rezepte = rezepte.filter(
    (rezept) => rezept.id !== id
  )

  return rezepte.length < anzahlVorher
}
