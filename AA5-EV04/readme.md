# GA7-220501096-AA5-EV04 — API del Proyecto - Testing con Postman

Evidencia de testing de la API completa del proyecto BarberTurno
(Spring Boot) usando Postman.

## Pruebas realizadas (12 en total)
- GET  /api/health → 200 OK
- POST /api/auth/registro → 201 Created
- POST /api/auth/login → 200 OK
- GET  /api/auth/perfil (JWT) → 200 OK
- GET  /api/barberos → 200 OK
- GET  /api/servicios → 200 OK
- POST /api/citas (JWT) → 201 Created
- GET  /api/citas/mis-citas (JWT) → 200 OK
- PUT  /api/citas/{id}/cancelar → 200 OK
- POST /api/auth/login (credenciales incorrectas) → 401
- POST /api/auth/registro (email duplicado) → 409
- GET  /api/citas/mis-citas (sin token) → 403

## Video
https://youtu.be/nFPIV_kMCg0
