/**
 * BarberTurno API — Rutas de Citas
 * GA7-220501096-AA5-EV03
 * Autor: Frank Sepúlveda
 *
 * Prefijo base: /api/citas
 * Todas las rutas requieren token JWT válido.
 *
 *   GET  /api/citas              → Citas del usuario autenticado
 *   POST /api/citas              → Agendar nueva cita
 *   GET  /api/citas/todas        → Todas las citas (solo admin)
 *   GET  /api/citas/:id          → Detalle de una cita
 *   PUT  /api/citas/:id/cancelar → Cancelar una cita
 */

"use strict";

const express = require("express");
const router  = express.Router();

const {
  listarCitas,
  obtenerCita,
  agendarCita,
  cancelarCita,
  listarTodasLasCitas
} = require("../controllers/citasController");

const { verificarToken, soloAdmin } = require("../middleware/authMiddleware");

/* Todas las rutas de citas requieren autenticación */
router.use(verificarToken);

/* Ruta admin — debe ir ANTES de /:id para no confundir "todas" con un ID */
router.get("/todas", soloAdmin, listarTodasLasCitas);

/* Rutas generales */
router.get("/",         listarCitas);
router.post("/",        agendarCita);
router.get("/:id",      obtenerCita);
router.put("/:id/cancelar", cancelarCita);

module.exports = router;
