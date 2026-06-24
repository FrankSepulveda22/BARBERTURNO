/**
 * BarberTurno API — Base de datos en memoria
 * GA7-220501096-AA5-EV03
 * Autor: Frank Sepúlveda
 *
 * Simula el almacenamiento de datos mientras el proceso Node está activo.
 * En producción esta capa se reemplazaría por MySQL 8 + Sequelize ORM,
 * que es la tecnología definida en el proyecto formativo.
 *
 * Entidades del sistema:
 *   - usuarios   → clientes y administradores del sistema
 *   - barberos   → profesionales disponibles para agendar
 *   - servicios  → catálogo de servicios con precios y duración
 *   - citas      → agendamientos realizados por los clientes
 */

"use strict";

/* -------------------------------------------------------
   USUARIOS
   Contraseñas almacenadas como hash bcrypt (10 rondas).
   "1234"     → hash guardado en usuario frank@email.com
   "admin123" → hash guardado en admin@barberturno.com
   ------------------------------------------------------- */
const usuarios = [
  {
    id: 1,
    nombre: "Frank Sepúlveda",
    email: "frank@email.com",
    password: "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy",
    rol: "cliente"
  },
  {
    id: 2,
    nombre: "Admin BarberTurno",
    email: "admin@barberturno.com",
    password: "$2a$10$TwBoT6S3RZqIUEbFNDMa9ObIJoHpIX2h/KjMiqeZ2kN.i/B0aWKMy",
    rol: "admin"
  }
];

/* -------------------------------------------------------
   BARBEROS
   Profesionales disponibles en la barbería.
   ------------------------------------------------------- */
const barberos = [
  { id: 1, nombre: "Carlos Martínez", especialidad: "Corte clásico",  activo: true },
  { id: 2, nombre: "Luis Herrera",    especialidad: "Barba y diseño", activo: true },
  { id: 3, nombre: "Andrés Polo",     especialidad: "Corte moderno",  activo: true }
];

/* -------------------------------------------------------
   SERVICIOS
   Catálogo de servicios con precio (COP) y duración (min).
   ------------------------------------------------------- */
const servicios = [
  { id: 1, nombre: "Corte de cabello",  duracion: 30, precio: 25000, activo: true },
  { id: 2, nombre: "Corte + barba",     duracion: 50, precio: 40000, activo: true },
  { id: 3, nombre: "Diseño de barba",   duracion: 30, precio: 20000, activo: true },
  { id: 4, nombre: "Corte infantil",    duracion: 25, precio: 18000, activo: true },
  { id: 5, nombre: "Afeitado clásico",  duracion: 40, precio: 22000, activo: true }
];

/* -------------------------------------------------------
   CITAS
   Agendamientos realizados por los clientes.
   Estados posibles: pendiente | confirmada | completada | cancelada
   ------------------------------------------------------- */
const citas = [
  {
    id: 1,
    usuarioId:  1,
    barberoId:  1,
    servicioId: 1,
    barbero:    "Carlos Martínez",
    servicio:   "Corte de cabello",
    fecha:      "2026-07-10",
    hora:       "10:00",
    estado:     "confirmada",
    precio:     25000,
    creadaEn:   "2026-06-20T08:00:00.000Z"
  },
  {
    id: 2,
    usuarioId:  1,
    barberoId:  2,
    servicioId: 2,
    barbero:    "Luis Herrera",
    servicio:   "Corte + barba",
    fecha:      "2026-07-15",
    hora:       "14:30",
    estado:     "pendiente",
    precio:     40000,
    creadaEn:   "2026-06-21T10:30:00.000Z"
  },
  {
    id: 3,
    usuarioId:  1,
    barberoId:  3,
    servicioId: 3,
    barbero:    "Andrés Polo",
    servicio:   "Diseño de barba",
    fecha:      "2026-05-10",
    hora:       "11:00",
    estado:     "completada",
    precio:     20000,
    creadaEn:   "2026-05-01T09:00:00.000Z"
  },
  {
    id: 4,
    usuarioId:  1,
    barberoId:  1,
    servicioId: 4,
    barbero:    "Carlos Martínez",
    servicio:   "Corte infantil",
    fecha:      "2026-04-15",
    hora:       "09:00",
    estado:     "cancelada",
    precio:     18000,
    creadaEn:   "2026-04-01T07:00:00.000Z"
  }
];

/* -------------------------------------------------------
   CONTADORES DE AUTOGENERACIÓN DE IDs
   ------------------------------------------------------- */
let nextUsuarioId = 3;
let nextCitaId    = 5;

/* -------------------------------------------------------
   MODELO: USUARIOS
   ------------------------------------------------------- */
const UsuarioModel = {

  /** Busca usuario por email (ignora mayúsculas/espacios). */
  buscarPorEmail(email) {
    return usuarios.find(u => u.email === email.toLowerCase().trim());
  },

  /** Busca usuario por ID numérico. */
  buscarPorId(id) {
    return usuarios.find(u => u.id === id);
  },

  /**
   * Crea un nuevo usuario. Recibe la contraseña ya hasheada.
   * @returns {Object} Usuario creado sin campo password
   */
  crear(nombre, email, hashPass, rol = "cliente") {
    const nuevo = {
      id:       nextUsuarioId++,
      nombre,
      email:    email.toLowerCase().trim(),
      password: hashPass,
      rol
    };
    usuarios.push(nuevo);
    const { password, ...pub } = nuevo;
    return pub;
  },

  /** Lista todos los usuarios (sin contraseñas). */
  listarTodos() {
    return usuarios.map(({ password, ...pub }) => pub);
  }
};

/* -------------------------------------------------------
   MODELO: BARBEROS
   ------------------------------------------------------- */
const BarberoModel = {

  /** Retorna todos los barberos activos. */
  listarActivos() {
    return barberos.filter(b => b.activo);
  },

  /** Retorna todos los barberos (incluyendo inactivos). */
  listarTodos() {
    return [...barberos];
  },

  /** Busca un barbero por ID. */
  buscarPorId(id) {
    return barberos.find(b => b.id === id);
  }
};

/* -------------------------------------------------------
   MODELO: SERVICIOS
   ------------------------------------------------------- */
const ServicioModel = {

  /** Retorna todos los servicios activos. */
  listarActivos() {
    return servicios.filter(s => s.activo);
  },

  /** Retorna todos los servicios. */
  listarTodos() {
    return [...servicios];
  },

  /** Busca un servicio por ID. */
  buscarPorId(id) {
    return servicios.find(s => s.id === id);
  }
};

/* -------------------------------------------------------
   MODELO: CITAS
   ------------------------------------------------------- */
const CitaModel = {

  /** Retorna las citas de un usuario específico. */
  listarPorUsuario(usuarioId) {
    return citas.filter(c => c.usuarioId === usuarioId);
  },

  /** Retorna todas las citas del sistema (para admin). */
  listarTodas() {
    return [...citas];
  },

  /** Busca una cita por ID. */
  buscarPorId(id) {
    return citas.find(c => c.id === id);
  },

  /**
   * Verifica si ya existe una cita para el barbero en la misma
   * fecha y hora (sin contar las canceladas).
   */
  existeConflicto(barberoId, fecha, hora, excluirId = null) {
    return citas.some(
      c => c.barberoId === barberoId &&
           c.fecha     === fecha &&
           c.hora      === hora &&
           c.estado    !== "cancelada" &&
           c.id        !== excluirId
    );
  },

  /**
   * Crea una nueva cita con estado inicial "pendiente".
   * @returns {Object} Cita creada
   */
  crear(usuarioId, barberoId, servicioId, fecha, hora) {
    const barbero  = BarberoModel.buscarPorId(barberoId);
    const servicio = ServicioModel.buscarPorId(servicioId);

    const nueva = {
      id:         nextCitaId++,
      usuarioId,
      barberoId,
      servicioId,
      barbero:    barbero?.nombre  || "Barbero",
      servicio:   servicio?.nombre || "Servicio",
      fecha,
      hora,
      estado:     "pendiente",
      precio:     servicio?.precio || 0,
      creadaEn:   new Date().toISOString()
    };
    citas.push(nueva);
    return nueva;
  },

  /**
   * Actualiza el estado de una cita existente.
   * @returns {Object|null} Cita actualizada o null si no existe
   */
  actualizarEstado(id, nuevoEstado) {
    const cita = citas.find(c => c.id === id);
    if (!cita) return null;
    cita.estado = nuevoEstado;
    return cita;
  }
};

/* -------------------------------------------------------
   EXPORTACIONES
   ------------------------------------------------------- */
module.exports = { UsuarioModel, BarberoModel, ServicioModel, CitaModel };
