/**
 * BarberTurno API — Controlador de Autenticación
 * GA7-220501096-AA5-EV03
 * Autor: Frank Sepúlveda
 *
 * Gestiona los servicios de autenticación del sistema:
 *
 *   POST /api/auth/registro  → Registro de nuevo usuario cliente
 *   POST /api/auth/login     → Inicio de sesión
 *   GET  /api/auth/perfil    → Datos del usuario autenticado (protegida)
 *
 * Seguridad implementada:
 *   - Contraseñas hasheadas con bcrypt (nunca texto plano en BD)
 *   - Tokens JWT firmados con clave secreta y expiración de 8h
 *   - Mensaje de error genérico en login para evitar enumeración de usuarios
 *   - Validación de formato de email y longitud mínima de contraseña
 */

"use strict";

const bcrypt = require("bcryptjs");
const jwt    = require("jsonwebtoken");

const { UsuarioModel }                              = require("../models/db");
const { JWT_SECRET, JWT_EXPIRES_IN, BCRYPT_SALT_ROUNDS } = require("../config/config");

/* -------------------------------------------------------
   HELPER: Generar Token JWT
   ------------------------------------------------------- */

/**
 * Firma un token JWT con los datos básicos del usuario.
 * @param {{ id: number, email: string, rol: string }} usuario
 * @returns {string} Token firmado
 */
function generarToken(usuario) {
  return jwt.sign(
    { id: usuario.id, email: usuario.email, rol: usuario.rol },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

/* -------------------------------------------------------
   SERVICIO: Registro de usuario
   POST /api/auth/registro
   ------------------------------------------------------- */

/**
 * Registra un nuevo usuario cliente en el sistema.
 *
 * Validaciones:
 *   - nombre, email y password son obligatorios
 *   - password mínimo 6 caracteres
 *   - formato de email válido (regex básica)
 *   - email no puede estar ya registrado (HTTP 409 Conflict)
 *
 * @param {import('express').Request}  req  Body: { nombre, email, password }
 * @param {import('express').Response} res
 */
async function registro(req, res) {
  try {
    const { nombre, email, password } = req.body;

    /* --- Validar presencia de todos los campos --- */
    if (!nombre || !email || !password) {
      return res.status(400).json({
        exito:   false,
        mensaje: "Todos los campos son obligatorios: nombre, email y password."
      });
    }

    /* --- Validar longitud mínima de contraseña --- */
    if (password.length < 6) {
      return res.status(400).json({
        exito:   false,
        mensaje: "La contraseña debe tener al menos 6 caracteres."
      });
    }

    /* --- Validar formato básico de email --- */
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        exito:   false,
        mensaje: "El formato del correo electrónico no es válido."
      });
    }

    /* --- Verificar que el email no esté registrado --- */
    if (UsuarioModel.buscarPorEmail(email)) {
      return res.status(409).json({
        exito:   false,
        mensaje: "Este correo ya está registrado. Intenta iniciar sesión."
      });
    }

    /* --- Hashear la contraseña antes de guardarla --- */
    const hashPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

    /* --- Crear usuario en la BD --- */
    const nuevoUsuario = UsuarioModel.crear(nombre, email, hashPassword);

    /* --- Generar token JWT para autenticación inmediata post-registro --- */
    const token = generarToken(nuevoUsuario);

    return res.status(201).json({
      exito:   true,
      mensaje: "Usuario registrado correctamente. ¡Bienvenido a BarberTurno!",
      token,
      usuario: nuevoUsuario
    });

  } catch (error) {
    console.error("[registro] Error:", error.message);
    return res.status(500).json({ exito: false, mensaje: "Error interno del servidor." });
  }
}

/* -------------------------------------------------------
   SERVICIO: Inicio de sesión
   POST /api/auth/login
   ------------------------------------------------------- */

/**
 * Autentica un usuario existente y devuelve un token JWT.
 *
 * Validaciones:
 *   - email y password son obligatorios
 *   - email debe existir en la BD
 *   - password debe coincidir con el hash almacenado
 *
 * Nota de seguridad: se usa el mismo mensaje de error para email
 * no encontrado y para contraseña incorrecta, para no revelar cuáles
 * emails están registrados (prevención de enumeración de usuarios).
 *
 * @param {import('express').Request}  req  Body: { email, password }
 * @param {import('express').Response} res
 */
async function login(req, res) {
  try {
    const { email, password } = req.body;

    /* --- Validar presencia de campos --- */
    if (!email || !password) {
      return res.status(400).json({
        exito:   false,
        mensaje: "El email y la contraseña son obligatorios."
      });
    }

    /* --- Buscar usuario por email --- */
    const usuario = UsuarioModel.buscarPorEmail(email);

    /* Si el email no existe, responder igual que si la contraseña fuera incorrecta */
    if (!usuario) {
      return res.status(401).json({
        exito:   false,
        mensaje: "Error en la autenticación: credenciales incorrectas."
      });
    }

    /* --- Verificar la contraseña contra el hash almacenado --- */
    const passwordValida = await bcrypt.compare(password, usuario.password);

    if (!passwordValida) {
      return res.status(401).json({
        exito:   false,
        mensaje: "Error en la autenticación: credenciales incorrectas."
      });
    }

    /* --- Generar token JWT --- */
    const token = generarToken(usuario);

    /* Excluir hash de contraseña de la respuesta */
    const { password: _, ...usuarioPublico } = usuario;

    return res.status(200).json({
      exito:   true,
      mensaje: `Autenticación satisfactoria. ¡Bienvenido, ${usuario.nombre}!`,
      token,
      usuario: usuarioPublico
    });

  } catch (error) {
    console.error("[login] Error:", error.message);
    return res.status(500).json({ exito: false, mensaje: "Error interno del servidor." });
  }
}

/* -------------------------------------------------------
   SERVICIO: Ver perfil del usuario autenticado
   GET /api/auth/perfil (protegida con JWT)
   ------------------------------------------------------- */

/**
 * Retorna los datos del usuario que posee el token activo.
 *
 * @param {import('express').Request}  req  req.usuario inyectado por verificarToken
 * @param {import('express').Response} res
 */
function perfil(req, res) {
  const usuario = UsuarioModel.buscarPorId(req.usuario.id);

  if (!usuario) {
    return res.status(404).json({ exito: false, mensaje: "Usuario no encontrado." });
  }

  const { password, ...usuarioPublico } = usuario;
  return res.json({ exito: true, usuario: usuarioPublico });
}

module.exports = { registro, login, perfil };
