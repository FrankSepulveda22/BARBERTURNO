# GA7-220501096-AA5-EV02 — Testing API con Postman

Evidencia de testing de la API BarberTurno usando Postman.

## Pruebas realizadas
- GET  /api/health → 200 OK
- POST /api/auth/registro → 201 Created
- POST /api/auth/login → 200 OK
- GET  /api/auth/perfil (con JWT) → 200 OK
- POST /api/auth/login (contraseña incorrecta) → 401 Unauthorized
- POST /api/auth/registro (email duplicado) → 409 Conflict
- GET  /api/auth/perfil (sin token) → 401 Unauthorized
