/**
 * BarberTurno API — Configuración global
 * GA7-220501096-AA5-EV03
 * Autor: Frank Sepúlveda
 *
 * Centraliza todas las constantes de configuración del servidor.
 * En producción los valores sensibles deben cargarse desde variables
 * de entorno (.env) usando la librería dotenv.
 */

"use strict";

module.exports = {
  /** Puerto donde escucha el servidor Express */
  PORT: process.env.PORT || 8080,

  /**
   * Clave secreta para firmar/verificar tokens JWT.
   * NUNCA exponer en repositorios públicos.
   */
  JWT_SECRET: process.env.JWT_SECRET || "barberturno_secret_ga7_aa5_ev03",

  /** Tiempo de expiración del token (8 horas de sesión) */
  JWT_EXPIRES_IN: "8h",

  /**
   * Rondas de salt para bcrypt.
   * 10 es el estándar recomendado para desarrollo/producción.
   */
  BCRYPT_SALT_ROUNDS: 10
};
