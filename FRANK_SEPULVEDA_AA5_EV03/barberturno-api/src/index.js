/**
 * BarberTurno API — Punto de entrada del servidor
 * GA7-220501096-AA5-EV03
 * Autor: Frank Sepúlveda
 *
 * Configura y levanta el servidor Express con todos los módulos
 * de la API REST del proyecto formativo BarberTurno:
 *
 *   /api/auth      → Autenticación (registro, login, perfil)
 *   /api/citas     → Gestión de citas (agendar, ver, cancelar)
 *   /api/barberos  → Catálogo de barberos
 *   /api/servicios → Catálogo de servicios
 *   /api/health    → Estado del servidor
 *
 * Para iniciar:
 *   node src/index.js           (producción)
 *   npx nodemon src/index.js    (desarrollo con recarga automática)
 */

"use strict";

const express  = require("express");
const { PORT } = require("./config/config");

/* -------------------------------------------------------
   CREAR LA APLICACIÓN EXPRESS
   ------------------------------------------------------- */
const app = express();

/* -------------------------------------------------------
   MIDDLEWARES GLOBALES
   ------------------------------------------------------- */

/** Parsear cuerpos JSON en las peticiones entrantes */
app.use(express.json());

/**
 * Configuración CORS: permite peticiones desde el front-end BarberTurno
 * que puede estar corriendo en localhost o en GitHub Pages.
 * En producción se debe restringir el origen con dominios específicos.
 */
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin",  "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  /* Responder inmediatamente las peticiones preflight (OPTIONS) de CORS */
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

/**
 * Logger de peticiones: imprime en consola cada request recibido.
 * Útil para depuración durante el desarrollo.
 */
app.use((req, _res, next) => {
  const hora = new Date().toLocaleTimeString("es-CO");
  console.log(`[${hora}] ${req.method.padEnd(7)} ${req.url}`);
  next();
});

/* -------------------------------------------------------
   RUTAS DE LA API
   ------------------------------------------------------- */

/** Ruta de salud: confirma que el servidor está en línea */
app.get("/api/health", (_req, res) => {
  res.json({
    exito:    true,
    mensaje:  "BarberTurno API está en línea ✅",
    version:  "1.0.0",
    evidencia: "GA7-220501096-AA5-EV03"
  });
});

/** Módulo de autenticación */
app.use("/api/auth",     require("./routes/authRoutes"));

/** Módulo de citas */
app.use("/api/citas",    require("./routes/citasRoutes"));

/** Módulo de catálogo (barberos y servicios) */
app.use("/api",          require("./routes/catalogoRoutes"));

/* -------------------------------------------------------
   MANEJADORES DE ERROR
   ------------------------------------------------------- */

/** 404 — Ruta no encontrada */
app.use((_req, res) => {
  res.status(404).json({
    exito:   false,
    mensaje: "Ruta no encontrada. Verifica la URL y el método HTTP."
  });
});

/** 500 — Error global del servidor (Express requiere 4 params) */
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error("[Error global]", err.message);
  res.status(500).json({ exito: false, mensaje: "Error interno del servidor." });
});

/* -------------------------------------------------------
   INICIAR EL SERVIDOR
   ------------------------------------------------------- */
app.listen(PORT, () => {
  console.log("===========================================");
  console.log("   BarberTurno API — GA7-220501096-AA5   ");
  console.log("   EV03 — API REST Completa              ");
  console.log("===========================================");
  console.log(`   http://localhost:${PORT}`);
  console.log("-------------------------------------------");
  console.log("   AUTENTICACIÓN");
  console.log(`   POST /api/auth/registro`);
  console.log(`   POST /api/auth/login`);
  console.log(`   GET  /api/auth/perfil        (JWT)`);
  console.log("-------------------------------------------");
  console.log("   CITAS");
  console.log(`   GET  /api/citas              (JWT)`);
  console.log(`   POST /api/citas              (JWT)`);
  console.log(`   GET  /api/citas/:id          (JWT)`);
  console.log(`   PUT  /api/citas/:id/cancelar (JWT)`);
  console.log(`   GET  /api/citas/todas        (JWT+Admin)`);
  console.log("-------------------------------------------");
  console.log("   CATÁLOGO");
  console.log(`   GET  /api/barberos           (JWT)`);
  console.log(`   GET  /api/barberos/:id       (JWT)`);
  console.log(`   GET  /api/servicios          (JWT)`);
  console.log(`   GET  /api/servicios/:id      (JWT)`);
  console.log("===========================================");
});

module.exports = app;
