/**
 * BarberTurno API — Middleware de Autenticación JWT
 * GA7-220501096-AA5-EV03
 * Autor: Frank Sepúlveda
 *
 * Intercepta peticiones a rutas protegidas y verifica que el cliente
 * envíe un token JWT válido en el encabezado Authorization.
 *
 * Formato esperado del header:
 *   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *
 * Si el token es válido, adjunta el payload decodificado en req.usuario
 * para que el controlador siguiente pueda usarlo.
 *
 * Códigos de error:
 *   401 → No se envió token o tiene formato incorrecto
 *   401 → Token inválido, manipulado o expirado
 *   403 → Token válido pero el rol no tiene permiso (soloAdmin)
 */

"use strict";

const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/config");

/* -------------------------------------------------------
   MIDDLEWARE: Verificar Token JWT
   Usar en cualquier ruta que requiera sesión activa.
   ------------------------------------------------------- */

/**
 * Verifica que la petición incluya un token JWT válido y vigente.
 * Adjunta req.usuario = { id, email, rol, iat, exp } si es válido.
 *
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 * @param {Function}                   next
 */
function verificarToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  /* Verificar que el header exista y tenga el prefijo correcto */
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      exito:   false,
      mensaje: "Acceso denegado. Token de autenticación no proporcionado."
    });
  }

  /* Extraer el token eliminando el prefijo "Bearer " */
  const token = authHeader.split(" ")[1];

  try {
    /* Verificar firma y expiración del token */
    const payload = jwt.verify(token, JWT_SECRET);

    /* Adjuntar datos del usuario al request para uso en controladores */
    req.usuario = payload;
    next();

  } catch (error) {
    /* Token manipulado, expirado o con firma incorrecta */
    return res.status(401).json({
      exito:   false,
      mensaje: "Token inválido o expirado. Inicia sesión nuevamente."
    });
  }
}

/* -------------------------------------------------------
   MIDDLEWARE: Solo Administradores
   Debe usarse DESPUÉS de verificarToken.
   ------------------------------------------------------- */

/**
 * Restringe el acceso a usuarios con rol 'admin'.
 * Requiere que verificarToken haya adjuntado req.usuario previamente.
 *
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 * @param {Function}                   next
 */
function soloAdmin(req, res, next) {
  if (req.usuario?.rol !== "admin") {
    return res.status(403).json({
      exito:   false,
      mensaje: "Acceso denegado. Se requieren permisos de administrador."
    });
  }
  next();
}

module.exports = { verificarToken, soloAdmin };
