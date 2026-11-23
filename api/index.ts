
/**
 * Vercel-Einstiegspunkt der Rezepte-API.
 *
 * Vercel führt diese Datei aus, wenn eine
 * HTTP-Anfrage an unsere veröffentlichte API ankommt.
 *
 * Die Express-Anwendung wird aus src/app.ts importiert.
 * Es wird hier kein eigener Server gestartet.
 */

import app from "../src/app"

// Übergibt die Express-App an Vercel.
// Vercel kümmert sich selbst um die HTTP-Anfragen.
export default app
