
/**
 * Eigene Fehlerklassen für die Rezepte-API.
 *
 * Diese Fehler beschreiben fachlich, was schiefgelaufen ist.
 * Außerdem besitzen sie einen passenden HTTP-Statuscode.
 *
 * Die zentrale Error-Middleware verarbeitet diese Fehler später.
 */

/**
 * Wird verwendet, wenn ein Rezept nicht gefunden wurde.
 *
 * Beispiel:
 * GET /recipes/999
 *
 * Erwarteter HTTP-Status: 404 Not Found
 */
export class RecipeNotFoundError extends Error {
  status = 404

  constructor(id: number) {
    // Erstellt die Fehlermeldung mit der gesuchten Rezept-ID.
    super(`Rezept mit ID ${id} nicht gefunden`)

    // Legt den tatsächlichen Namen der Fehlerklasse fest.
    this.name = new.target.name
  }
}

/**
 * Wird verwendet, wenn übergebene Daten ungültig sind.
 *
 * Beispiel:
 * POST /recipes mit einem leeren Titel.
 *
 * Erwarteter HTTP-Status: 400 Bad Request
 */
export class ValidationError extends Error {
  status = 400

  constructor(message: string) {
    // Übernimmt die Fehlermeldung aus dem Service.
    super(message)

    // Der Fehler heißt dadurch "ValidationError".
    this.name = new.target.name
  }
}
