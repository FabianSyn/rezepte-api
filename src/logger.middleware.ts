
/**
 * Logger Middleware
 *
 * Protokolliert jede HTTP-Anfrage im Terminal.
 *
 * Zusätzlich werden der HTTP-Statuscode und
 * die Bearbeitungsdauer in Millisekunden angezeigt.
 */

import type {
  Request,
  Response,
  NextFunction
} from "express"

/**
 * Wird vor den API-Routen ausgeführt.
 *
 * next() gibt die Anfrage an den nächsten
 * Handler oder die nächste Middleware weiter.
 */
export function logger(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Speichert den Zeitpunkt, an dem die Anfrage ankommt.
  const startzeit = Date.now()

  /**
   * finish wird ausgelöst, sobald die Antwort
   * vollständig an Node.js zur Übertragung übergeben wurde.
   *
   * So können wir die Dauer und den endgültigen
   * HTTP-Statuscode ausgeben.
   */
  res.on("finish", () => {
    const dauer = Date.now() - startzeit

    console.log(
      `${req.method} ${req.originalUrl} -> ${res.statusCode} (${dauer} ms)`
    )
  })

  // Leitet die Anfrage zur nächsten Middleware oder Route weiter.
  next()
}
