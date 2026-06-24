/**
 * BarberTurno API — Controlador de Catálogo
 * GA7-220501096-AA5-EV03
 * Autor: Frank Sepúlveda
 *
 * Expone los datos del catálogo de la barbería:
 *
 *   GET /api/barberos           → Listar barberos activos (requiere JWT)
 *   GET /api/barberos/:id       → Detalle de un barbero
 *   GET /api/servicios          → Listar servicios activos (requiere JWT)
 *   GET /api/servicios/:id      → Detalle de un servicio
 *
 * Estos endpoints son usados por el front-end para llenar los
 * formularios de agendamiento de citas (selección de barbero y servicio).
 */

"use strict";

const { BarberoModel, ServicioModel } = require("../models/db");

/* -------------------------------------------------------
   BARBEROS
   ------------------------------------------------------- */

/**
 * Retorna la lista de todos los barberos activos del sistema.
 * El front-end usa esta información para llenar el selector
 * de barbero en el formulario de nueva cita.
 *
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 */
function listarBarberos(req, res) {
  try {
    const barberos = BarberoModel.listarActivos();
    return res.json({
      exito:    true,
      total:    barberos.length,
      barberos
    });
  } catch (error) {
    console.error("[listarBarberos] Error:", error.message);
    return res.status(500).json({ exito: false, mensaje: "Error interno del servidor." });
  }
}

/**
 * Retorna los datos de un barbero específico por su ID.
 *
 * @param {import('express').Request}  req  req.params.id → ID del barbero
 * @param {import('express').Response} res
 */
function obtenerBarbero(req, res) {
  try {
    const id      = parseInt(req.params.id);
    const barbero = BarberoModel.buscarPorId(id);

    if (!barbero) {
      return res.status(404).json({
        exito:   false,
        mensaje: `Barbero con ID ${id} no encontrado.`
      });
    }

    return res.json({ exito: true, barbero });

  } catch (error) {
    console.error("[obtenerBarbero] Error:", error.message);
    return res.status(500).json({ exito: false, mensaje: "Error interno del servidor." });
  }
}

/* -------------------------------------------------------
   SERVICIOS
   ------------------------------------------------------- */

/**
 * Retorna el catálogo completo de servicios activos con precios.
 * El front-end usa esta información para el selector de servicio
 * y para mostrar el precio estimado de la cita.
 *
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 */
function listarServicios(req, res) {
  try {
    const servicios = ServicioModel.listarActivos();
    return res.json({
      exito:     true,
      total:     servicios.length,
      servicios
    });
  } catch (error) {
    console.error("[listarServicios] Error:", error.message);
    return res.status(500).json({ exito: false, mensaje: "Error interno del servidor." });
  }
}

/**
 * Retorna los datos de un servicio específico por su ID.
 *
 * @param {import('express').Request}  req  req.params.id → ID del servicio
 * @param {import('express').Response} res
 */
function obtenerServicio(req, res) {
  try {
    const id       = parseInt(req.params.id);
    const servicio = ServicioModel.buscarPorId(id);

    if (!servicio) {
      return res.status(404).json({
        exito:   false,
        mensaje: `Servicio con ID ${id} no encontrado.`
      });
    }

    return res.json({ exito: true, servicio });

  } catch (error) {
    console.error("[obtenerServicio] Error:", error.message);
    return res.status(500).json({ exito: false, mensaje: "Error interno del servidor." });
  }
}

module.exports = { listarBarberos, obtenerBarbero, listarServicios, obtenerServicio };
