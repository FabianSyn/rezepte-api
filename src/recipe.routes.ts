
/**
 * Recipe Routes
 *
 * Der Router verbindet HTTP-Methoden und URL-Pfade
 * mit den passenden Controller-Funktionen.
 *
 * Die eigentliche Verarbeitung findet im Controller statt.
 */

import { Router } from "express"

import {
  getRecipesHandler,
  getRecipeHandler,
  createRecipeHandler,
  deleteRecipeHandler
} from "./recipe.controller"

import { requireApiKey } from "./auth.middleware"

// Erstellt einen neuen Express-Router.
const router = Router()

/**
 * GET /recipes
 *
 * Gibt alle Rezepte zurück.
 * Unterstützt weiterhin den Filter ?maxMinuten=20.
 */
router.get("/", getRecipesHandler)

/**
 * GET /recipes/:id
 *
 * Gibt ein einzelnes Rezept anhand seiner ID zurück.
 */
router.get("/:id", getRecipeHandler)

/**
 * POST /recipes
 *
 * Erstellt ein neues Rezept aus dem JSON-Request-Body.
 */
router.post("/", createRecipeHandler)

/**
 * DELETE /recipes/:id
 *
 * Löscht ein Rezept.
 *
 * Zuerst wird der API-Key geprüft.
 * Nur bei gültigem Schlüssel wird der Controller aufgerufen.
 */
router.delete("/:id", requireApiKey, deleteRecipeHandler)

// Exportiert den fertigen Router für app.ts.
export default router
