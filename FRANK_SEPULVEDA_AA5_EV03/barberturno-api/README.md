# BarberTurno API — REST Completa
## GA7-220501096-AA5-EV03

**Aprendiz:** Frank Sepúlveda  
**Programa:** Análisis y Desarrollo de Software — SENA  
**Actividad:** GA7-220501096-AA5 — Crear servicios web, de acuerdo con el diseño.  
**Evidencia:** GA7-220501096-AA5-EV03 — Diseño y desarrollo de servicios web - proyecto.

---

## Descripción

API REST desarrollada en **Node.js + Express** que implementa todos los servicios web necesarios para el proyecto formativo **BarberTurno** (sistema de gestión de citas de barbería). Cubre autenticación, gestión de citas y catálogo de barberos/servicios.

---

## Estructura del proyecto

```
barberturno-api/
├── src/
│   ├── index.js                       → Servidor Express, middlewares globales, rutas
│   ├── config/
│   │   └── config.js                  → Configuración (puerto, JWT, bcrypt)
│   ├── models/
│   │   └── db.js                      → BD en memoria + modelos de datos
│   ├── controllers/
│   │   ├── authController.js          → Lógica de registro, login y perfil
│   │   ├── citasController.js         → Lógica de gestión de citas
│   │   └── catalogoController.js      → Lógica de barberos y servicios
│   ├── middleware/
│   │   └── authMiddleware.js          → Verificación JWT y control de roles
│   └── routes/
│       ├── authRoutes.js              → Rutas /api/auth
│       ├── citasRoutes.js             → Rutas /api/citas
│       └── catalogoRoutes.js          → Rutas /api/barberos y /api/servicios
├── docs/
│   └── DOCUMENTACION_SERVICIOS.md    → Documentación completa de todos los endpoints
├── test/
│   └── api.test.js                    → 20+ casos de prueba para toda la API
├── .gitignore
├── package.json
└── README.md
```

---

## Endpoints disponibles

| Módulo | Endpoint | Método | Auth |
|---|---|---|---|
| Auth | `/api/auth/registro` | POST | ❌ |
| Auth | `/api/auth/login` | POST | ❌ |
| Auth | `/api/auth/perfil` | GET | 🔒 JWT |
| Barberos | `/api/barberos` | GET | 🔒 JWT |
| Barberos | `/api/barberos/:id` | GET | 🔒 JWT |
| Servicios | `/api/servicios` | GET | 🔒 JWT |
| Servicios | `/api/servicios/:id` | GET | 🔒 JWT |
| Citas | `/api/citas` | GET | 🔒 JWT |
| Citas | `/api/citas` | POST | 🔒 JWT |
| Citas | `/api/citas/:id` | GET | 🔒 JWT |
| Citas | `/api/citas/:id/cancelar` | PUT | 🔒 JWT |
| Citas | `/api/citas/todas` | GET | 🔒 Admin |
| Sistema | `/api/health` | GET | ❌ |

---

## Cómo ejecutar

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar el servidor (puerto 8080)
node src/index.js

# 3. Ejecutar pruebas (en otra terminal)
node test/api.test.js
```

---

## Credenciales de prueba

| Email | Contraseña | Rol |
|---|---|---|
| frank@email.com | 1234 | cliente |
| admin@barberturno.com | admin123 | admin |

---

## Tecnologías

| Tecnología | Versión | Uso |
|---|---|---|
| Node.js | 18+ | Entorno de ejecución |
| Express | 4.18 | Framework HTTP/REST |
| bcryptjs | 2.4 | Hashing de contraseñas |
| jsonwebtoken | 9.0 | Tokens JWT |

---

## Repositorio

**GitHub:** https://github.com/FrankSepulveda22/BARBERTURNO

---

## Criterios de evaluación cubiertos

- [x] **Indicador 1:** Servicios implementados según requerimientos del proyecto (auth, citas, catálogo)
- [x] **Indicador 2:** API REST completa con todos los endpoints necesarios para BarberTurno
- [x] **Indicador 3:** Validaciones correctas en cada endpoint (campos, formatos, permisos, conflictos)
- [x] **Indicador 4:** Proyecto con herramientas de versionamiento (GitHub) + `.gitignore` configurado
- [x] Documentación completa en `docs/DOCUMENTACION_SERVICIOS.md`
- [x] Código con comentarios explicativos en todos los archivos
