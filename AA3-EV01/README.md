# BarberTurno 💈
### Sistema de Gestión de Turnos para Barberías

**Evidencia:** GA7-220501096-AA3-EV01  
**Programa:** Análisis y Desarrollo de Software - SENA  
**Resultado de aprendizaje:** 220501096-04 - Codificar el software de acuerdo con el diseño establecido.

---

## 🛠️ Tecnologías utilizadas

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Frontend Web | Angular | 17+ |
| Backend API REST | Spring Boot | 3.2 |
| Base de datos | MySQL | 8.0 |
| ORM | Spring Data JPA / Hibernate | - |
| Control de versiones | Git / GitHub | - |

---

## 📁 Estructura del proyecto

```
BarberTurno/
├── backend/                        ← API REST Spring Boot
│   ├── pom.xml
│   └── src/main/java/com/barberturno/
│       ├── BarberTurnoApplication.java   ← Clase principal
│       ├── config/
│       │   └── WebConfig.java            ← Configuración CORS
│       ├── controller/
│       │   └── TurnoController.java      ← Endpoints REST
│       ├── dto/
│       │   └── TurnoDTO.java             ← Objeto de transferencia
│       ├── model/
│       │   ├── Turno.java                ← Entidad JPA
│       │   └── EstadoTurno.java          ← Enum de estados
│       ├── repository/
│       │   └── TurnoRepository.java      ← Acceso a datos
│       └── service/
│           └── TurnoService.java         ← Lógica de negocio
│
└── frontend/                       ← App Angular
    └── src/app/
        ├── app.module.ts                 ← Módulo raíz y rutas
        ├── models/
        │   └── turno.model.ts            ← Interfaces TypeScript
        ├── services/
        │   └── turno.service.ts          ← Consumo de la API
        └── components/turno/
            ├── turno-lista.component.ts  ← Lista de turnos
            ├── turno-lista.component.html
            ├── turno-form.component.ts   ← Formulario crear/editar
            └── turno-form.component.html
```

---

## ⚙️ Configuración y ejecución

### Prerrequisitos
- Java 17+
- Node.js 18+ y Angular CLI (`npm install -g @angular/cli`)
- MySQL 8.0 corriendo en localhost:3306

### 1. Base de datos
```sql
CREATE DATABASE barberturno_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Backend (Spring Boot)
```bash
cd backend
# Ajustar credenciales en src/main/resources/application.properties
./mvnw spring-boot:run
# API disponible en: http://localhost:8080
```

### 3. Frontend (Angular)
```bash
cd frontend
npm install
ng serve
# App disponible en: http://localhost:4200
```

---

## 🔗 Endpoints de la API REST

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/turnos` | Listar todos los turnos |
| GET | `/api/turnos/{id}` | Obtener turno por ID |
| GET | `/api/turnos/fecha?fecha=yyyy-MM-dd` | Filtrar por fecha |
| GET | `/api/turnos/barbero?barbero=X&fecha=Y` | Filtrar por barbero y fecha |
| GET | `/api/turnos/buscar?nombre=X` | Buscar por cliente |
| POST | `/api/turnos` | Crear nuevo turno |
| PUT | `/api/turnos/{id}` | Actualizar turno |
| PATCH | `/api/turnos/{id}/estado` | Cambiar estado |
| DELETE | `/api/turnos/{id}` | Eliminar turno |

---

## ✅ Criterios del Instrumento de Evaluación

| # | Indicador | Cumplimiento |
|---|-----------|-------------|
| 1 | Selecciona y aplica un framework | ✅ Angular 17 (frontend) + Spring Boot 3 (backend) |
| 2 | Integra herramientas para almacenamiento | ✅ MySQL 8 + Spring Data JPA + Hibernate |
| 3 | Usa comentarios en el código | ✅ Javadoc en Java, JSDoc en TypeScript |
| 4 | Cumple estándar de codificación | ✅ Naming conventions Java/Angular, separación de capas MVC |

---

## 📌 Estándar de codificación aplicado

**Java (Spring Boot):**
- Clases en `PascalCase`: `TurnoService`, `TurnoController`
- Métodos y variables en `camelCase`: `crearTurno()`, `turnoRepository`
- Constantes en `UPPER_SNAKE_CASE`
- Javadoc en todas las clases y métodos públicos
- Separación por capas: `model`, `dto`, `repository`, `service`, `controller`, `config`

**TypeScript (Angular):**
- Interfaces en `PascalCase`: `Turno`, `EstadoTurno`
- Componentes con sufijo `Component`, servicios con sufijo `Service`
- Métodos en `camelCase`: `cargarTurnos()`, `cambiarEstado()`
- Comentarios JSDoc en servicios y componentes

---

## 🔗 Repositorio
[Ver en GitHub](https://github.com/FrankSepulveda22/BARBERTURNO)

---

*SENA - Centro de Gestión de Mercados, Logística y TIC | 2025*
