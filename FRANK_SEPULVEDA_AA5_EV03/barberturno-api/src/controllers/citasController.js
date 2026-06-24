/**
 * BarberTurno API — Controlador de Citas
 * GA7-220501096-AA5-EV03
 * Autor: Frank Sepúlveda
 *
 * Gestiona todas las operaciones sobre las citas del sistema:
 *
 *   GET  /api/citas              → Listar citas del usuario autenticado
 *   POST /api/citas              → Agendar nueva cita
 *   GET  /api/citas/:id          → Obtener detalle de una cita
 *   PUT  /api/citas/:id/cancelar → Cancelar una cita propia
 *   GET  /api/citas/todas        → Todas las citas (solo admin)
 *
 * Reglas de negocio:
 *   - Un usuario solo puede ver y cancelar sus propias citas
 *   - No se puede agendar en una fecha/hora ya ocupada por el mismo barbero
 *   - No se pueden cancelar citas en estado 'completada'
 *   - La fecha de la cita debe ser igual o posterior a hoy
 *   - barberoId y servicioId deben existir en el catálogo
 */

"use strict";

const { CitaModel, BarberoModel, ServicioModel } = require("../models/db");

/* -------------------------------------------------------
   HELPER: Validar formato de fecha YYYY-MM-DD
   ------------------------------------------------------- */
function esFechaValida(fecha) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return false;
  const d = new Date(fecha + "T00:00:00");
  return !isNaN(d.getTime());
}

/* -------------------------------------------------------
   HELPER: Validar formato de hora HH:MM
   ------------------------------------------------------- */
function esHoraValida(hora) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(hora);
}

/* -------------------------------------------------------
   SERVICIO: Listar citas del usuario autenticado
   GET /api/citas
   ------------------------------------------------------- */

/**
 * Retorna todas las citas que pertenecen al usuario con sesión activa.
 * Un administrador que llame a este endpoint verá solo sus propias citas;
 * para ver todas las citas del sistema, debe usar GET /api/citas/todas.
 *
 * @param {import('express').Request}  req  req.usuario inyectado por verificarToken
 * @param {import('express').Response} res
 */
function listarCitas(req, res) {
  try {
    const citas = CitaModel.listarPorUsuario(req.usuario.id);
    return res.json({
      exito: true,
      total: citas.length,
      citas
    });
  } catch (error) {
    console.error("[listarCitas] Error:", error.message);
    return res.status(500).json({ exito: false, mensaje: "Error interno del servidor." });
  }
}

/* -------------------------------------------------------
   SERVICIO: Obtener detalle de una cita
   GET /api/citas/:id
   ------------------------------------------------------- */

/**
 * Retorna los datos completos de una cita específica.
 * Un cliente solo puede consultar sus propias citas.
 *
 * @param {import('express').Request}  req  req.params.id → ID de la cita
 * @param {import('express').Response} res
 */
function obtenerCita(req, res) {
  try {
    const id   = parseInt(req.params.id);
    const cita = CitaModel.buscarPorId(id);

    /* Verificar que la cita exista */
    if (!cita) {
      return res.status(404).json({ exito: false, mensaje: "Cita no encontrada." });
    }

    /* Un cliente no puede ver citas de otros usuarios */
    if (req.usuario.rol !== "admin" && cita.usuarioId !== req.usuario.id) {
      return res.status(403).json({
        exito:   false,
        mensaje: "No tienes permiso para ver esta cita."
      });
    }

    return res.json({ exito: true, cita });

  } catch (error) {
    console.error("[obtenerCita] Error:", error.message);
    return res.status(500).json({ exito: false, mensaje: "Error interno del servidor." });
  }
}

/* -------------------------------------------------------
   SERVICIO: Agendar nueva cita
   POST /api/citas
   ------------------------------------------------------- */

/**
 * Crea una nueva cita para el usuario autenticado.
 *
 * Validaciones:
 *   - barberoId, servicioId, fecha y hora son obligatorios
 *   - fecha debe ser hoy o posterior
 *   - hora debe tener formato HH:MM
 *   - barberoId debe existir en el catálogo
 *   - servicioId debe existir en el catálogo
 *   - No puede haber conflicto de horario para el mismo barbero
 *
 * @param {import('express').Request}  req  Body: { barberoId, servicioId, fecha, hora }
 * @param {import('express').Response} res
 */
function agendarCita(req, res) {
  try {
    const { barberoId, servicioId, fecha, hora } = req.body;

    /* --- Validar campos obligatorios --- */
    if (!barberoId || !servicioId || !fecha || !hora) {
      return res.status(400).json({
        exito:   false,
        mensaje: "Campos obligatorios: barberoId, servicioId, fecha y hora."
      });
    }

    /* --- Validar formato de fecha --- */
    if (!esFechaValida(fecha)) {
      return res.status(400).json({
        exito:   false,
        mensaje: "La fecha debe tener el formato YYYY-MM-DD y ser una fecha válida."
      });
    }

    /* --- Validar que la fecha no sea en el pasado --- */
    const hoy       = new Date().toISOString().split("T")[0];
    if (fecha < hoy) {
      return res.status(400).json({
        exito:   false,
        mensaje: "No puedes agendar citas en fechas pasadas."
      });
    }

    /* --- Validar formato de hora --- */
    if (!esHoraValida(hora)) {
      return res.status(400).json({
        exito:   false,
        mensaje: "La hora debe tener el formato HH:MM (ej: 09:00, 14:30)."
      });
    }

    /* --- Verificar que el barbero exista --- */
    const barbero = BarberoModel.buscarPorId(parseInt(barberoId));
    if (!barbero) {
      return res.status(404).json({
        exito:   false,
        mensaje: `Barbero con ID ${barberoId} no encontrado.`
      });
    }

    /* --- Verificar que el servicio exista --- */
    const servicio = ServicioModel.buscarPorId(parseInt(servicioId));
    if (!servicio) {
      return res.status(404).json({
        exito:   false,
        mensaje: `Servicio con ID ${servicioId} no encontrado.`
      });
    }

    /* --- Verificar disponibilidad del barbero en esa fecha y hora --- */
    if (CitaModel.existeConflicto(parseInt(barberoId), fecha, hora)) {
      return res.status(409).json({
        exito:   false,
        mensaje: `${barbero.nombre} ya tiene una cita el ${fecha} a las ${hora}. Elige otro horario.`
      });
    }

    /* --- Crear la cita --- */
    const nuevaCita = CitaModel.crear(
      req.usuario.id,
      parseInt(barberoId),
      parseInt(servicioId),
      fecha,
      hora
    );

    return res.status(201).json({
      exito:   true,
      mensaje: "Cita agendada exitosamente.",
      cita:    nuevaCita
    });

  } catch (error) {
    console.error("[agendarCita] Error:", error.message);
    return res.status(500).json({ exito: false, mensaje: "Error interno del servidor." });
  }
}

/* -------------------------------------------------------
   SERVICIO: Cancelar una cita
   PUT /api/citas/:id/cancelar
   ------------------------------------------------------- */

/**
 * Cambia el estado de una cita a 'cancelada'.
 *
 * Reglas:
 *   - Solo el dueño de la cita puede cancelarla (o un admin)
 *   - No se puede cancelar una cita ya completada
 *   - No se puede cancelar una cita que ya está cancelada
 *
 * @param {import('express').Request}  req  req.params.id → ID de la cita
 * @param {import('express').Response} res
 */
function cancelarCita(req, res) {
  try {
    const id   = parseInt(req.params.id);
    const cita = CitaModel.buscarPorId(id);

    /* Verificar que la cita exista */
    if (!cita) {
      return res.status(404).json({ exito: false, mensaje: "Cita no encontrada." });
    }

    /* Verificar que el usuario sea el dueño o admin */
    if (req.usuario.rol !== "admin" && cita.usuarioId !== req.usuario.id) {
      return res.status(403).json({
        exito:   false,
        mensaje: "No tienes permiso para cancelar esta cita."
      });
    }

    /* Verificar que no esté ya completada */
    if (cita.estado === "completada") {
      return res.status(400).json({
        exito:   false,
        mensaje: "No se puede cancelar una cita que ya fue completada."
      });
    }

    /* Verificar que no esté ya cancelada */
    if (cita.estado === "cancelada") {
      return res.status(400).json({
        exito:   false,
        mensaje: "La cita ya se encuentra cancelada."
      });
    }

    /* Actualizar estado */
    const citaActualizada = CitaModel.actualizarEstado(id, "cancelada");

    return res.json({
      exito:   true,
      mensaje: "Cita cancelada correctamente.",
      cita:    citaActualizada
    });

  } catch (error) {
    console.error("[cancelarCita] Error:", error.message);
    return res.status(500).json({ exito: false, mensaje: "Error interno del servidor." });
  }
}

/* -------------------------------------------------------
   SERVICIO (ADMIN): Listar todas las citas del sistema
   GET /api/citas/todas
   ------------------------------------------------------- */

/**
 * Retorna todas las citas registradas en el sistema.
 * Solo accesible para usuarios con rol 'admin'.
 *
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 */
function listarTodasLasCitas(req, res) {
  try {
    const citas = CitaModel.listarTodas();
    return res.json({
      exito: true,
      total: citas.length,
      citas
    });
  } catch (error) {
    console.error("[listarTodasLasCitas] Error:", error.message);
    return res.status(500).json({ exito: false, mensaje: "Error interno del servidor." });
  }
}

module.exports = { listarCitas, obtenerCita, agendarCita, cancelarCita, listarTodasLasCitas };
