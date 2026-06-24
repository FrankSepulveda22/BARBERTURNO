/**
 * BarberTurno API — Rutas del Catálogo
 * GA7-220501096-AA5-EV03
 * Autor: Frank Sepúlveda
 *
 * Prefijo base: /api
 * Todas las rutas requieren token JWT válido.
 *
 *   GET /api/barberos        → Lista de barberos activos
 *   GET /api/barberos/:id    → Detalle de un barbero
 *   GET /api/servicios       → Lista de servicios activos
 *   GET /api/servicios/:id   → Detalle de un servicio
 */

"use strict";

const express = require("express");
const router  = express.Router();

const {
  listarBarberos,
  obtenerBarbero,
  listarServicios,
  obtenerServicio
} = require("../controllers/catalogoController");

const { verificarToken } = require("../middleware/authMiddleware");

/* Todas las rutas del catálogo requieren autenticación */
router.use(verificarToken);

/* Rutas de barberos */
router.get("/barberos",      listarBarberos);
router.get("/barberos/:id",  obtenerBarbero);

/* Rutas de servicios */
router.get("/servicios",     listarServicios);
router.get("/servicios/:id", obtenerServicio);

module.exports = router;
