/**
 * BarberTurno API — Script de pruebas completas
 * GA7-220501096-AA5-EV03
 * Autor: Frank Sepúlveda
 *
 * Prueba todos los endpoints de la API REST de BarberTurno,
 * cubriendo escenarios exitosos y de error para cada servicio.
 *
 * Prerequisito: el servidor debe estar corriendo.
 *   node src/index.js
 *
 * Cómo ejecutar:
 *   node test/api.test.js
 */

"use strict";

const http = require("http");

/* -------------------------------------------------------
   CONFIGURACIÓN
   ------------------------------------------------------- */
const HOST = "localhost";
const PORT = 8080;

/* Variables compartidas entre pruebas */
let tokenCliente = null;
let tokenAdmin   = null;
let citaIdCreada = null;

/* -------------------------------------------------------
   HELPER: Realizar petición HTTP
   ------------------------------------------------------- */
function peticion(metodo, ruta, cuerpo = null, token = null) {
  return new Promise((resolve, reject) => {
    const cuerpoJSON = cuerpo ? JSON.stringify(cuerpo) : null;
    const opciones = {
      hostname: HOST,
      port:     PORT,
      path:     ruta,
      method:   metodo,
      headers: {
        "Content-Type": "application/json",
        ...(cuerpoJSON && { "Content-Length": Buffer.byteLength(cuerpoJSON) }),
        ...(token       && { "Authorization": `Bearer ${token}` })
      }
    };
    const req = http.request(opciones, res => {
      let raw = "";
      res.on("data", c => { raw += c; });
      res.on("end", () => {
        try { resolve({ status: res.statusCode, datos: JSON.parse(raw) }); }
        catch { resolve({ status: res.statusCode, datos: raw }); }
      });
    });
    req.on("error", reject);
    if (cuerpoJSON) req.write(cuerpoJSON);
    req.end();
  });
}

/* -------------------------------------------------------
   HELPER: Imprimir resultado
   ------------------------------------------------------- */
let pasadas = 0;
let fallidas = 0;

function resultado(nombre, status, datos, condicion) {
  const ok = condicion;
  if (ok) pasadas++; else fallidas++;
  console.log(`\n${ok ? "✅" : "❌"} ${nombre}`);
  console.log(`   Status: ${status}  |  Mensaje: ${datos?.mensaje || "(sin mensaje)"}`);
  if (!ok) console.log(`   Respuesta:`, JSON.stringify(datos));
}

/* -------------------------------------------------------
   PRUEBAS
   ------------------------------------------------------- */
async function ejecutar() {
  console.log("===========================================");
  console.log("  BarberTurno — Pruebas API REST Completas");
  console.log("  GA7-220501096-AA5-EV03");
  console.log("===========================================");

  /* =====================================================
     MÓDULO 1: AUTENTICACIÓN
     ===================================================== */
  console.log("\n═══ MÓDULO 1: AUTENTICACIÓN ═══");

  /* 1.1 Registro exitoso */
  {
    const { status, datos } = await peticion("POST", "/api/auth/registro", {
      nombre: "Laura Gómez", email: "laura@email.com", password: "pass123"
    });
    resultado("1.1 Registro exitoso", status, datos, status === 201 && datos.exito);
  }

  /* 1.2 Registro con email duplicado */
  {
    const { status, datos } = await peticion("POST", "/api/auth/registro", {
      nombre: "Frank Sepúlveda", email: "frank@email.com", password: "1234"
    });
    resultado("1.2 Registro con email duplicado (409)", status, datos, status === 409 && !datos.exito);
  }

  /* 1.3 Registro sin campos */
  {
    const { status, datos } = await peticion("POST", "/api/auth/registro", {
      email: "sin@nombre.com"
    });
    resultado("1.3 Registro sin nombre/password (400)", status, datos, status === 400 && !datos.exito);
  }

  /* 1.4 Registro con contraseña corta */
  {
    const { status, datos } = await peticion("POST", "/api/auth/registro", {
      nombre: "Test", email: "test@x.com", password: "abc"
    });
    resultado("1.4 Contraseña muy corta (400)", status, datos, status === 400 && !datos.exito);
  }

  /* 1.5 Login exitoso cliente */
  {
    const { status, datos } = await peticion("POST", "/api/auth/login", {
      email: "frank@email.com", password: "1234"
    });
    resultado("1.5 Login cliente exitoso (200)", status, datos, status === 200 && datos.exito);
    if (datos.token) tokenCliente = datos.token;
  }

  /* 1.6 Login exitoso admin */
  {
    const { status, datos } = await peticion("POST", "/api/auth/login", {
      email: "admin@barberturno.com", password: "admin123"
    });
    resultado("1.6 Login admin exitoso (200)", status, datos, status === 200 && datos.exito);
    if (datos.token) tokenAdmin = datos.token;
  }

  /* 1.7 Login con contraseña incorrecta */
  {
    const { status, datos } = await peticion("POST", "/api/auth/login", {
      email: "frank@email.com", password: "wrongpass"
    });
    resultado("1.7 Login con contraseña incorrecta (401)", status, datos, status === 401 && !datos.exito);
  }

  /* 1.8 Login con email inexistente */
  {
    const { status, datos } = await peticion("POST", "/api/auth/login", {
      email: "noexiste@email.com", password: "1234"
    });
    resultado("1.8 Login con email no registrado (401)", status, datos, status === 401 && !datos.exito);
  }

  /* 1.9 Ver perfil con token válido */
  {
    const { status, datos } = await peticion("GET", "/api/auth/perfil", null, tokenCliente);
    resultado("1.9 Perfil con token válido (200)", status, datos, status === 200 && datos.exito);
  }

  /* 1.10 Ver perfil sin token */
  {
    const { status, datos } = await peticion("GET", "/api/auth/perfil");
    resultado("1.10 Perfil sin token (401)", status, datos, status === 401 && !datos.exito);
  }

  /* =====================================================
     MÓDULO 2: CATÁLOGO — BARBEROS
     ===================================================== */
  console.log("\n═══ MÓDULO 2: BARBEROS ═══");

  /* 2.1 Listar barberos */
  {
    const { status, datos } = await peticion("GET", "/api/barberos", null, tokenCliente);
    resultado("2.1 Listar barberos activos (200)", status, datos,
      status === 200 && datos.exito && Array.isArray(datos.barberos));
  }

  /* 2.2 Obtener barbero por ID */
  {
    const { status, datos } = await peticion("GET", "/api/barberos/1", null, tokenCliente);
    resultado("2.2 Obtener barbero ID=1 (200)", status, datos, status === 200 && datos.exito);
  }

  /* 2.3 Barbero inexistente */
  {
    const { status, datos } = await peticion("GET", "/api/barberos/999", null, tokenCliente);
    resultado("2.3 Barbero inexistente (404)", status, datos, status === 404 && !datos.exito);
  }

  /* 2.4 Sin token */
  {
    const { status, datos } = await peticion("GET", "/api/barberos");
    resultado("2.4 Barberos sin token (401)", status, datos, status === 401 && !datos.exito);
  }

  /* =====================================================
     MÓDULO 3: CATÁLOGO — SERVICIOS
     ===================================================== */
  console.log("\n═══ MÓDULO 3: SERVICIOS ═══");

  /* 3.1 Listar servicios */
  {
    const { status, datos } = await peticion("GET", "/api/servicios", null, tokenCliente);
    resultado("3.1 Listar servicios (200)", status, datos,
      status === 200 && datos.exito && Array.isArray(datos.servicios));
  }

  /* 3.2 Obtener servicio por ID */
  {
    const { status, datos } = await peticion("GET", "/api/servicios/2", null, tokenCliente);
    resultado("3.2 Obtener servicio ID=2 (200)", status, datos, status === 200 && datos.exito);
  }

  /* 3.3 Servicio inexistente */
  {
    const { status, datos } = await peticion("GET", "/api/servicios/999", null, tokenCliente);
    resultado("3.3 Servicio inexistente (404)", status, datos, status === 404 && !datos.exito);
  }

  /* =====================================================
     MÓDULO 4: CITAS
     ===================================================== */
  console.log("\n═══ MÓDULO 4: CITAS ═══");

  /* 4.1 Listar citas del usuario */
  {
    const { status, datos } = await peticion("GET", "/api/citas", null, tokenCliente);
    resultado("4.1 Listar mis citas (200)", status, datos, status === 200 && datos.exito);
  }

  /* 4.2 Agendar cita exitosa */
  {
    const { status, datos } = await peticion("POST", "/api/citas", {
      barberoId: 1, servicioId: 1, fecha: "2027-01-15", hora: "09:00"
    }, tokenCliente);
    resultado("4.2 Agendar cita exitosa (201)", status, datos, status === 201 && datos.exito);
    if (datos.cita) citaIdCreada = datos.cita.id;
  }

  /* 4.3 Agendar cita con conflicto de horario */
  {
    const { status, datos } = await peticion("POST", "/api/citas", {
      barberoId: 1, servicioId: 2, fecha: "2027-01-15", hora: "09:00"
    }, tokenCliente);
    resultado("4.3 Agendar con conflicto de horario (409)", status, datos, status === 409 && !datos.exito);
  }

  /* 4.4 Agendar con fecha pasada */
  {
    const { status, datos } = await peticion("POST", "/api/citas", {
      barberoId: 1, servicioId: 1, fecha: "2020-01-01", hora: "10:00"
    }, tokenCliente);
    resultado("4.4 Agendar con fecha pasada (400)", status, datos, status === 400 && !datos.exito);
  }

  /* 4.5 Agendar con campos faltantes */
  {
    const { status, datos } = await peticion("POST", "/api/citas", {
      barberoId: 1
    }, tokenCliente);
    resultado("4.5 Agendar con campos faltantes (400)", status, datos, status === 400 && !datos.exito);
  }

  /* 4.6 Agendar con barberoId inexistente */
  {
    const { status, datos } = await peticion("POST", "/api/citas", {
      barberoId: 999, servicioId: 1, fecha: "2027-02-01", hora: "10:00"
    }, tokenCliente);
    resultado("4.6 Barbero inexistente al agendar (404)", status, datos, status === 404 && !datos.exito);
  }

  /* 4.7 Obtener detalle de una cita */
  {
    const { status, datos } = await peticion("GET", "/api/citas/1", null, tokenCliente);
    resultado("4.7 Obtener detalle de cita ID=1 (200)", status, datos, status === 200 && datos.exito);
  }

  /* 4.8 Obtener cita inexistente */
  {
    const { status, datos } = await peticion("GET", "/api/citas/999", null, tokenCliente);
    resultado("4.8 Cita inexistente (404)", status, datos, status === 404 && !datos.exito);
  }

  /* 4.9 Cancelar la cita recién creada */
  if (citaIdCreada) {
    const { status, datos } = await peticion("PUT", `/api/citas/${citaIdCreada}/cancelar`, null, tokenCliente);
    resultado("4.9 Cancelar cita exitosamente (200)", status, datos, status === 200 && datos.exito);
  }

  /* 4.10 Cancelar una cita ya cancelada */
  if (citaIdCreada) {
    const { status, datos } = await peticion("PUT", `/api/citas/${citaIdCreada}/cancelar`, null, tokenCliente);
    resultado("4.10 Cancelar cita ya cancelada (400)", status, datos, status === 400 && !datos.exito);
  }

  /* 4.11 Admin: ver todas las citas del sistema */
  {
    const { status, datos } = await peticion("GET", "/api/citas/todas", null, tokenAdmin);
    resultado("4.11 Admin: listar todas las citas (200)", status, datos,
      status === 200 && datos.exito && Array.isArray(datos.citas));
  }

  /* 4.12 Cliente intenta ver todas las citas (debe fallar) */
  {
    const { status, datos } = await peticion("GET", "/api/citas/todas", null, tokenCliente);
    resultado("4.12 Cliente intenta acceso admin (403)", status, datos, status === 403 && !datos.exito);
  }

  /* =====================================================
     RESUMEN
     ===================================================== */
  const total = pasadas + fallidas;
  console.log("\n===========================================");
  console.log(`  RESULTADO: ${pasadas}/${total} pruebas exitosas`);
  if (fallidas > 0) console.log(`  ⚠️  ${fallidas} prueba(s) fallaron`);
  else              console.log("  🎉 Todos los servicios funcionan correctamente");
  console.log("===========================================\n");
}

ejecutar().catch(err => {
  console.error("\n❌ Error al conectar:", err.message);
  console.error("   ¿Está el servidor corriendo? → node src/index.js\n");
  process.exit(1);
});
