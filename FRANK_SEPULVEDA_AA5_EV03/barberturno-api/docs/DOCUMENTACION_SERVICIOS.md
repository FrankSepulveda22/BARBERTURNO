# Documentación de Servicios Web — BarberTurno
## GA7-220501096-AA5-EV03
**Aprendiz:** Frank Sepúlveda  
**Programa:** Análisis y Desarrollo de Software — SENA

---

## Información general

| Campo | Valor |
|---|---|
| Base URL | `http://localhost:8080/api` |
| Formato de datos | JSON (`Content-Type: application/json`) |
| Autenticación | JWT Bearer Token |
| Versión | 1.0.0 |

### Estructura de respuesta estándar

Todas las respuestas siguen este formato:

```json
{
  "exito":   true | false,
  "mensaje": "Descripción del resultado",
  "datos":   { ... }
}
```

### Autenticación en rutas protegidas

Las rutas marcadas con 🔒 requieren el encabezado:
```
Authorization: Bearer <token>
```
El token se obtiene al hacer login o registro exitoso.

---

## MÓDULO 1: Autenticación — `/api/auth`

---

### 1.1 Registro de usuario

Crea un nuevo usuario cliente en el sistema.

**Endpoint:** `POST /api/auth/registro`  
**Autenticación:** No requerida (ruta pública)

**Cuerpo de la petición:**
```json
{
  "nombre":   "María García",
  "email":    "maria@email.com",
  "password": "segura123"
}
```

**Validaciones:**
- `nombre`, `email` y `password` son obligatorios
- `password` debe tener mínimo 6 caracteres
- `email` debe tener formato válido (`usuario@dominio.com`)
- `email` no puede estar ya registrado

**Respuesta exitosa — 201 Created:**
```json
{
  "exito":   true,
  "mensaje": "Usuario registrado correctamente. ¡Bienvenido a BarberTurno!",
  "token":   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id":     3,
    "nombre": "María García",
    "email":  "maria@email.com",
    "rol":    "cliente"
  }
}
```

**Respuestas de error:**

| Código | Causa | Mensaje |
|---|---|---|
| 400 | Campo faltante | `"Todos los campos son obligatorios: nombre, email y password."` |
| 400 | Contraseña corta | `"La contraseña debe tener al menos 6 caracteres."` |
| 400 | Email inválido | `"El formato del correo electrónico no es válido."` |
| 409 | Email duplicado | `"Este correo ya está registrado. Intenta iniciar sesión."` |
| 500 | Error servidor | `"Error interno del servidor."` |

---

### 1.2 Inicio de sesión

Autentica un usuario existente y retorna un token JWT.

**Endpoint:** `POST /api/auth/login`  
**Autenticación:** No requerida (ruta pública)

**Cuerpo de la petición:**
```json
{
  "email":    "frank@email.com",
  "password": "1234"
}
```

**Validaciones:**
- `email` y `password` son obligatorios
- Las credenciales deben coincidir con un usuario registrado

**Respuesta exitosa — 200 OK:**
```json
{
  "exito":   true,
  "mensaje": "Autenticación satisfactoria. ¡Bienvenido, Frank Sepúlveda!",
  "token":   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id":     1,
    "nombre": "Frank Sepúlveda",
    "email":  "frank@email.com",
    "rol":    "cliente"
  }
}
```

**Respuestas de error:**

| Código | Causa | Mensaje |
|---|---|---|
| 400 | Campo faltante | `"El email y la contraseña son obligatorios."` |
| 401 | Credenciales incorrectas | `"Error en la autenticación: credenciales incorrectas."` |
| 500 | Error servidor | `"Error interno del servidor."` |

> **Nota de seguridad:** Se usa el mismo mensaje de error tanto para email no existente como para contraseña incorrecta, para no revelar información sobre los usuarios registrados.

---

### 1.3 Ver perfil del usuario 🔒

Retorna los datos del usuario cuyo token JWT se envía.

**Endpoint:** `GET /api/auth/perfil`  
**Autenticación:** Requerida (JWT)

**Respuesta exitosa — 200 OK:**
```json
{
  "exito":   true,
  "usuario": {
    "id":     1,
    "nombre": "Frank Sepúlveda",
    "email":  "frank@email.com",
    "rol":    "cliente"
  }
}
```

**Respuestas de error:**

| Código | Causa | Mensaje |
|---|---|---|
| 401 | Sin token / token inválido | `"Acceso denegado..."` o `"Token inválido o expirado."` |
| 404 | Usuario no encontrado | `"Usuario no encontrado."` |

---

## MÓDULO 2: Barberos — `/api/barberos`

---

### 2.1 Listar barberos activos 🔒

Retorna todos los barberos disponibles para agendar.

**Endpoint:** `GET /api/barberos`  
**Autenticación:** Requerida (JWT)

**Respuesta exitosa — 200 OK:**
```json
{
  "exito":    true,
  "total":    3,
  "barberos": [
    { "id": 1, "nombre": "Carlos Martínez", "especialidad": "Corte clásico",  "activo": true },
    { "id": 2, "nombre": "Luis Herrera",    "especialidad": "Barba y diseño", "activo": true },
    { "id": 3, "nombre": "Andrés Polo",     "especialidad": "Corte moderno",  "activo": true }
  ]
}
```

---

### 2.2 Obtener barbero por ID 🔒

Retorna los datos de un barbero específico.

**Endpoint:** `GET /api/barberos/:id`  
**Autenticación:** Requerida (JWT)  
**Parámetro de ruta:** `id` — ID numérico del barbero

**Ejemplo:** `GET /api/barberos/1`

**Respuesta exitosa — 200 OK:**
```json
{
  "exito":   true,
  "barbero": { "id": 1, "nombre": "Carlos Martínez", "especialidad": "Corte clásico", "activo": true }
}
```

**Respuestas de error:**

| Código | Causa | Mensaje |
|---|---|---|
| 401 | Sin token | `"Acceso denegado..."` |
| 404 | ID no existe | `"Barbero con ID 99 no encontrado."` |

---

## MÓDULO 3: Servicios — `/api/servicios`

---

### 3.1 Listar servicios activos 🔒

Retorna el catálogo completo de servicios con precios y duración.

**Endpoint:** `GET /api/servicios`  
**Autenticación:** Requerida (JWT)

**Respuesta exitosa — 200 OK:**
```json
{
  "exito":     true,
  "total":     5,
  "servicios": [
    { "id": 1, "nombre": "Corte de cabello", "duracion": 30, "precio": 25000, "activo": true },
    { "id": 2, "nombre": "Corte + barba",    "duracion": 50, "precio": 40000, "activo": true },
    { "id": 3, "nombre": "Diseño de barba",  "duracion": 30, "precio": 20000, "activo": true },
    { "id": 4, "nombre": "Corte infantil",   "duracion": 25, "precio": 18000, "activo": true },
    { "id": 5, "nombre": "Afeitado clásico", "duracion": 40, "precio": 22000, "activo": true }
  ]
}
```

> El campo `precio` está en pesos colombianos (COP). El campo `duracion` está en minutos.

---

### 3.2 Obtener servicio por ID 🔒

**Endpoint:** `GET /api/servicios/:id`  
**Autenticación:** Requerida (JWT)

**Ejemplo:** `GET /api/servicios/2`

**Respuesta exitosa — 200 OK:**
```json
{
  "exito":    true,
  "servicio": { "id": 2, "nombre": "Corte + barba", "duracion": 50, "precio": 40000, "activo": true }
}
```

---

## MÓDULO 4: Citas — `/api/citas`

---

### 4.1 Listar mis citas 🔒

Retorna todas las citas del usuario autenticado.

**Endpoint:** `GET /api/citas`  
**Autenticación:** Requerida (JWT)

**Respuesta exitosa — 200 OK:**
```json
{
  "exito": true,
  "total": 2,
  "citas": [
    {
      "id":         1,
      "usuarioId":  1,
      "barberoId":  1,
      "servicioId": 1,
      "barbero":    "Carlos Martínez",
      "servicio":   "Corte de cabello",
      "fecha":      "2026-07-10",
      "hora":       "10:00",
      "estado":     "confirmada",
      "precio":     25000,
      "creadaEn":   "2026-06-20T08:00:00.000Z"
    }
  ]
}
```

---

### 4.2 Agendar nueva cita 🔒

Crea una nueva cita para el usuario autenticado.

**Endpoint:** `POST /api/citas`  
**Autenticación:** Requerida (JWT)

**Cuerpo de la petición:**
```json
{
  "barberoId":  1,
  "servicioId": 2,
  "fecha":      "2027-03-20",
  "hora":       "10:30"
}
```

**Validaciones:**
- Todos los campos son obligatorios
- `fecha` debe tener formato `YYYY-MM-DD` y ser igual o posterior a hoy
- `hora` debe tener formato `HH:MM` (00:00 – 23:59)
- `barberoId` debe existir en el catálogo
- `servicioId` debe existir en el catálogo
- No puede haber otra cita activa para el mismo barbero en la misma fecha y hora

**Respuesta exitosa — 201 Created:**
```json
{
  "exito":   true,
  "mensaje": "Cita agendada exitosamente.",
  "cita": {
    "id":         5,
    "usuarioId":  1,
    "barberoId":  1,
    "servicioId": 2,
    "barbero":    "Carlos Martínez",
    "servicio":   "Corte + barba",
    "fecha":      "2027-03-20",
    "hora":       "10:30",
    "estado":     "pendiente",
    "precio":     40000,
    "creadaEn":   "2026-06-23T15:00:00.000Z"
  }
}
```

**Respuestas de error:**

| Código | Causa | Mensaje |
|---|---|---|
| 400 | Campo faltante | `"Campos obligatorios: barberoId, servicioId, fecha y hora."` |
| 400 | Fecha inválida | `"La fecha debe tener el formato YYYY-MM-DD..."` |
| 400 | Fecha en el pasado | `"No puedes agendar citas en fechas pasadas."` |
| 400 | Hora inválida | `"La hora debe tener el formato HH:MM..."` |
| 404 | Barbero no existe | `"Barbero con ID 99 no encontrado."` |
| 404 | Servicio no existe | `"Servicio con ID 99 no encontrado."` |
| 409 | Conflicto de horario | `"Carlos Martínez ya tiene una cita el 2027-03-20 a las 10:30..."` |

---

### 4.3 Obtener detalle de una cita 🔒

**Endpoint:** `GET /api/citas/:id`  
**Autenticación:** Requerida (JWT)

**Ejemplo:** `GET /api/citas/1`

**Respuesta exitosa — 200 OK:**
```json
{
  "exito": true,
  "cita": { "id": 1, "barbero": "Carlos Martínez", "estado": "confirmada", "..." : "..." }
}
```

**Respuestas de error:**

| Código | Causa | Mensaje |
|---|---|---|
| 403 | Cita de otro usuario | `"No tienes permiso para ver esta cita."` |
| 404 | ID no existe | `"Cita no encontrada."` |

---

### 4.4 Cancelar una cita 🔒

Cambia el estado de una cita a `cancelada`.

**Endpoint:** `PUT /api/citas/:id/cancelar`  
**Autenticación:** Requerida (JWT)

**Ejemplo:** `PUT /api/citas/2/cancelar`

**Respuesta exitosa — 200 OK:**
```json
{
  "exito":   true,
  "mensaje": "Cita cancelada correctamente.",
  "cita":    { "id": 2, "estado": "cancelada", "...": "..." }
}
```

**Respuestas de error:**

| Código | Causa | Mensaje |
|---|---|---|
| 400 | Ya completada | `"No se puede cancelar una cita que ya fue completada."` |
| 400 | Ya cancelada | `"La cita ya se encuentra cancelada."` |
| 403 | Cita ajena | `"No tienes permiso para cancelar esta cita."` |
| 404 | No existe | `"Cita no encontrada."` |

---

### 4.5 Listar todas las citas (solo admin) 🔒👑

**Endpoint:** `GET /api/citas/todas`  
**Autenticación:** Requerida (JWT con rol `admin`)

**Respuesta exitosa — 200 OK:**
```json
{
  "exito": true,
  "total": 4,
  "citas": [ { "...": "todos los registros del sistema" } ]
}
```

**Respuestas de error:**

| Código | Causa | Mensaje |
|---|---|---|
| 401 | Sin token | `"Acceso denegado..."` |
| 403 | Rol insuficiente | `"Acceso denegado. Se requieren permisos de administrador."` |

---

## Tabla resumen de endpoints

| Método | Endpoint | Auth | Descripción |
|---|---|---|---|
| POST | `/api/auth/registro` | ❌ | Registrar nuevo usuario |
| POST | `/api/auth/login` | ❌ | Iniciar sesión |
| GET | `/api/auth/perfil` | 🔒 | Ver perfil del usuario |
| GET | `/api/barberos` | 🔒 | Listar barberos activos |
| GET | `/api/barberos/:id` | 🔒 | Detalle de un barbero |
| GET | `/api/servicios` | 🔒 | Listar servicios |
| GET | `/api/servicios/:id` | 🔒 | Detalle de un servicio |
| GET | `/api/citas` | 🔒 | Mis citas |
| POST | `/api/citas` | 🔒 | Agendar nueva cita |
| GET | `/api/citas/:id` | 🔒 | Detalle de una cita |
| PUT | `/api/citas/:id/cancelar` | 🔒 | Cancelar una cita |
| GET | `/api/citas/todas` | 🔒👑 | Todas las citas (admin) |
| GET | `/api/health` | ❌ | Estado del servidor |

> 🔒 Requiere token JWT  |  👑 Requiere rol admin

---

## Credenciales de prueba

| Email | Contraseña | Rol |
|---|---|---|
| frank@email.com | 1234 | cliente |
| admin@barberturno.com | admin123 | admin |

---

## Estados de una cita

| Estado | Descripción |
|---|---|
| `pendiente` | Cita recién agendada, esperando confirmación |
| `confirmada` | Cita aprobada por la barbería |
| `completada` | Servicio realizado |
| `cancelada` | Cancelada por el cliente o el sistema |
