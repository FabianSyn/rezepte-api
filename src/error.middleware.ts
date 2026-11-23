
/**
 * Globale Error-Middleware.
 *
 * Diese Middleware fängt Fehler zentral ab.
 * Sie protokolliert den Fehler im Terminal und
 * schickt eine passende JSON-Antwort an den Client.
 *
 * Sie muss nach allen Routen registriert werden.
 */

import type {
  Request,
  Response,
  NextFunction
} from "express"

/**
 * Verarbeitet Fehler aus den Controllern und Services.
 *
 * Die vier Parameter sind wichtig:
 * Express erkennt daran eine Error-Middleware.
 */
export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Prüft, ob der Fehler ein normales Error-Objekt ist.
  const fehler = err instanceof Error
    ? err
    : new Error("Unbekannter Fehler")

  // Gibt den Namen und die Nachricht im Server-Terminal aus.
  console.error(
    `${fehler.name}: ${fehler.message}`
  )

  /**
   * Eigene Fehlerklassen besitzen die Eigenschaft status.
   * Falls kein gültiger HTTP-Status vorhanden ist,
   * verwenden wir automatisch 500.
   */
  let status = 500

  if (
    typeof err === "object" &&
    err !== null &&
    "status" in err &&
    typeof err.status === "number" &&
    Number.isInteger(err.status) &&
    err.status >= 400 &&
    err.status <= 599
  ) {
    status = err.status
  }

  // Wurde bereits eine Antwort begonnen, übergeben wir
  // den Fehler an die weitere Express-Fehlerbehandlung.
  if (res.headersSent) {
    return next(err)
  }

  /**
   * Sendet den Fehler als JSON an den Client.
   *
   * Dadurch bekommen Clients eine einheitliche Struktur:
   * { "fehler": "..." }
   */
  return res.status(status).json({
    fehler: fehler.message
  })
}
