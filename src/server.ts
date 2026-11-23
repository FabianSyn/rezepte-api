
/**
 * Server
 *
 * Diese Datei startet die Express-Anwendung.
 * Alle Routen und Middleware befinden sich in app.ts.
 */

import app from "./app"

// Der Server soll auf Port 3000 erreichbar sein.
const PORT = 3000

/**
 * app.listen() startet den HTTP-Server.
 *
 * Solange dieser Server läuft, bleibt
 * das Terminal normalerweise beschäftigt.
 */
app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`)
})
