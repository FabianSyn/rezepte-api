
/**
 * Auth Middleware
 *
 * Diese Middleware schützt bestimmte Endpunkte
 * mithilfe eines einfachen API-Keys.
 *
 * Der API-Key muss im HTTP-Header x-api-key stehen.
 */

import type {
  Request,
  Response,
  NextFunction
} from "express"

// API-Key aus der Aufgabenstellung.
const API_KEY = "geheim123"

/**
 * Prüft, ob die Anfrage den richtigen API-Key enthält.
 *
 * Richtiger Key:
 * -> next() lässt die Anfrage weiterlaufen.
 *
 * Fehlender oder falscher Key:
 * -> HTTP 401 und eine Fehlermeldung.
 */
export function requireApiKey(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Liest den API-Key aus dem Request-Header.
  const apiKey = req.header("x-api-key")

  // Vergleicht den gesendeten Key mit dem erwarteten Wert.
  if (apiKey !== API_KEY) {
    return res.status(401).json({
      fehler: "Nicht autorisiert"
    })
  }

  // Bei gültigem Key wird die Anfrage weitergeleitet.
  next()
}
