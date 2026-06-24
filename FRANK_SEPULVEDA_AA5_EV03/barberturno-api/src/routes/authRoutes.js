/**
 * BarberTurno API — Rutas de Autenticación
 * GA7-220501096-AA5-EV03
 * Autor: Frank Sepúlveda
 *
 * Prefijo base: /api/auth
 *
 * Rutas públicas (sin token):
 *   POST /api/auth/registro  → Registro de nuevo usuario
 *   POST /api/auth/login     → Inicio de sesión
 *
 * Rutas protegidas (requieren JWT):
 *   GET  /api/auth/perfil    → Datos del usuario autenticado
 */

"use strict";

const express  = require("express");
const router   = express.Router();

const { registro, login, perfil } = require("../controllers/authController");
const { verificarToken }          = require("../middleware/authMiddleware");

/* Rutas públicas */
router.post("/registro", registro);
router.post("/login",    login);

/* Rutas protegidas */
router.get("/perfil", verificarToken, perfil);

module.exports = router;
