
/**
 * Recipe Controller
 *
 * Der Controller verarbeitet die HTTP-Anfragen.
 *
 * Er liest Daten aus dem Request,
 * ruft den passenden Service auf
 * und schickt die Antwort zurück.
 *
 * Fehler werden über next(err) an die
 * globale Error-Middleware weitergegeben.
 */

import type {
  Request,
  Response,
  NextFunction
} from "express"

import {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  deleteRecipe
} from "./recipe.service"

import { RecipeNotFoundError } from "./errors"

/**
 * GET /recipes
 *
 * Gibt alle Rezepte zurück.
 *
 * Unterstützt weiterhin den Bonusfilter:
 * GET /recipes?maxMinuten=20
 */
export async function getRecipesHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const rezepte = await getAllRecipes()

    // Optionalen Query-Parameter lesen.
    const maxMinuten = req.query.maxMinuten

    // Ohne Filter werden alle Rezepte zurückgegeben.
    if (maxMinuten === undefined) {
      return res.json(rezepte)
    }

    // Der Filter muss ein einzelner Textwert sein.
    if (typeof maxMinuten !== "string") {
      return res.status(400).json({
        fehler: "maxMinuten muss eine gültige Zahl sein"
      })
    }

    // Wandelt den Parameter in eine Zahl um.
    const minuten = Number(maxMinuten)

    // Ungültige Werte werden abgelehnt.
    if (
      maxMinuten.trim() === "" ||
      !Number.isFinite(minuten) ||
      minuten < 0
    ) {
      return res.status(400).json({
        fehler: "maxMinuten muss eine gültige positive Zahl sein"
      })
    }

    // Erstellt eine Liste mit passenden Rezepten.
    const gefilterteRezepte = rezepte.filter(
      (rezept) => rezept.minuten <= minuten
    )

    return res.json(gefilterteRezepte)
  } catch (err) {
    next(err)
  }
}

/**
 * GET /recipes/:id
 *
/**
 * Gibt ein Rezept anhand seiner ID zurück.
 * Fehler werden an die globale Middleware weitergereicht.
 */
export async function getRecipeHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id)

    const rezept = await getRecipeById(id)

    return res.json(rezept)
  } catch (err) {
    next(err)
  }
}
/**
 * POST /recipes
 *
 * Erstellt ein neues Rezept.
 *
 * Die Validierung findet jetzt im Service statt.
 * Dadurch bleibt der Controller übersichtlicher.
 */
export async function createRecipeHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Übergibt die JSON-Daten an den Service.
    // Dort werden die Eigenschaften geprüft.
    const neues = await createRecipe(req.body)

    // 201 = Created
    return res.status(201).json(neues)
  } catch (err) {
    // Auch ValidationError landet hier.
    next(err)
  }
}

/**
 * DELETE /recipes/:id
 *
 * Löscht ein Rezept anhand seiner ID.
 *
 * Die Route bleibt über den API-Key geschützt.
 */
export async function deleteRecipeHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Liest die ID aus dem URL-Pfad.
    const id = Number(req.params.id)

    // Ruft die Löschfunktion des Services auf.
    const geloescht = await deleteRecipe(id)

    /**
     * Falls kein Rezept gelöscht wurde,
     * verwenden wir denselben fachlichen Fehler
     * wie beim Abrufen eines nicht vorhandenen Rezepts.
     */
    if (!geloescht) {
      throw new RecipeNotFoundError(id)
    }

    // 204 = Erfolgreich gelöscht, aber kein Antwortinhalt.
    return res.status(204).send()
  } catch (err) {
    next(err)
  }
}
