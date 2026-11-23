
/**
 * Express App
 *
 * Diese Datei erstellt und konfiguriert die Anwendung.
 *
 * Hier werden Middleware, Router und Fehlerbehandlung eingebunden.
 *
 * Der Server wird in dieser Datei nicht gestartet.
 */

import express from "express"

import recipeRoutes from "./recipe.routes"
import { logger } from "./logger.middleware"
import { errorHandler } from "./error.middleware"

// Erstellt die Express-Anwendung.
const app = express()

/**
 * Ermöglicht das Verarbeiten von JSON im Request-Body.
 *
 * Wichtig für POST /recipes.
 */
app.use(express.json())

/**
 * Protokolliert eingehende Anfragen.
 *
 * Steht vor den Routen, damit alle Anfragen geloggt werden.
 */
app.use(logger)

/**
 * GET /
 *
 * Startseite der Rezepte-API.
 */
app.get("/", (req, res) => {
  res.send("Willkommen bei der Rezepte-API 👋")
})

/**
 * GET /health
 *
 * Prüft, ob der Server erreichbar ist.
 */
app.get("/health", (req, res) => {
  res.json({
    status: "ok"
  })
})

/**
 * BONUS: GET /crash
 *
 * Wirft absichtlich einen Fehler.
 *
 * Damit können wir überprüfen, ob die globale
 * Error-Middleware auch unerwartete Fehler verarbeitet.
 *
 * Diese Route dient nur zu Lern- und Testzwecken.
 */
app.get("/crash", (req, res) => {
  throw new Error("Absichtlicher Absturz zum Testen")
})

/**
 * Registriert alle Rezept-Routen.
 *
 * Beispiel:
 * /recipes
 * /recipes/2
 */
app.use("/recipes", recipeRoutes)

/**
 * Aufgabe 4: 404-Fallback
 *
 * Diese Middleware wird aufgerufen, wenn keine
 * der vorherigen Routen zur Anfrage gepasst hat.
 *
 * Sie gibt eine verständliche JSON-Fehlermeldung zurück.
 */
app.use((req, res) => {
  return res.status(404).json({
    fehler: `Route ${req.method} ${req.originalUrl} existiert nicht`
  })
})

/**
 * Aufgabe 2: Globale Error-Middleware
 *
 * Muss nach allen Routen und dem 404-Fallback stehen.
 *
 * Verarbeitet Fehler aus Services und Controllern
 * und verwandelt sie in JSON-Antworten.
 */
app.use(errorHandler)

// Exportiert die fertig konfigurierte Anwendung.
export default app
