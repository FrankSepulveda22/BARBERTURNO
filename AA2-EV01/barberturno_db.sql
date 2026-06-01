-- ============================================================
--  Script de Base de Datos - BarberTurno
--  Proyecto SENA: GA7-220501096-AA2-EV01
--  Descripción: Creación del esquema y tablas del sistema
-- ============================================================

-- Crear y seleccionar la base de datos
CREATE DATABASE IF NOT EXISTS barberturno_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE barberturno_db;

-- ─── Tabla: usuarios ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario  INT          AUTO_INCREMENT PRIMARY KEY,
    nombre      VARCHAR(100) NOT NULL,
    correo      VARCHAR(100) NOT NULL UNIQUE,
    contrasena  VARCHAR(255) NOT NULL,
    rol         ENUM('administrador', 'barbero', 'cliente') NOT NULL DEFAULT 'cliente',
    created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ─── Tabla: clientes ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS clientes (
    id_cliente    INT          AUTO_INCREMENT PRIMARY KEY,
    nombre        VARCHAR(100) NOT NULL,
    correo        VARCHAR(100) NOT NULL UNIQUE,
    telefono      VARCHAR(20),
    observaciones TEXT,
    created_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ─── Tabla: empleados ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS empleados (
    id_empleado  INT          AUTO_INCREMENT PRIMARY KEY,
    nombre       VARCHAR(100) NOT NULL,
    especialidad VARCHAR(100),
    horario      VARCHAR(100),
    correo       VARCHAR(100),
    created_at   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ─── Tabla: servicios ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS servicios (
    id_servicio INT           AUTO_INCREMENT PRIMARY KEY,
    nombre      VARCHAR(100)  NOT NULL,
    precio      DECIMAL(10,2) NOT NULL,
    duracion    INT           NOT NULL COMMENT 'Duración en minutos',
    created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ─── Tabla: citas ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS citas (
    id_cita      INT  AUTO_INCREMENT PRIMARY KEY,
    fecha        DATE NOT NULL,
    hora         TIME NOT NULL,
    estado       ENUM('pendiente', 'confirmada', 'completada', 'cancelada') DEFAULT 'pendiente',
    cliente_id   INT  NOT NULL,
    empleado_id  INT  NOT NULL,
    servicio_id  INT  NOT NULL,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id)  REFERENCES clientes(id_cliente),
    FOREIGN KEY (empleado_id) REFERENCES empleados(id_empleado),
    FOREIGN KEY (servicio_id) REFERENCES servicios(id_servicio)
) ENGINE=InnoDB;

-- ─── Tabla: pagos ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS pagos (
    id_pago      INT           AUTO_INCREMENT PRIMARY KEY,
    monto        DECIMAL(10,2) NOT NULL,
    fecha        DATE          NOT NULL,
    metodo_pago  ENUM('efectivo', 'tarjeta', 'transferencia') DEFAULT 'efectivo',
    cita_id      INT           NOT NULL,
    created_at   TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cita_id) REFERENCES citas(id_cita)
) ENGINE=InnoDB;

-- ─── Datos de prueba ─────────────────────────────────────────
INSERT INTO clientes (nombre, correo, telefono, observaciones) VALUES
('Juan Pérez',    'juan@email.com',   '3001234567', 'Cliente frecuente'),
('María García',  'maria@email.com',  '3107654321', 'Prefiere corte clásico'),
('Carlos López',  'carlos@email.com', '3209876543', 'Alérgico a tinte químico');

INSERT INTO empleados (nombre, especialidad, horario, correo) VALUES
('Carlos Ruiz',  'Corte clásico',    'Lun-Vie 8am-6pm', 'carlos.barbero@barberturno.com'),
('Luis Martínez','Barba y diseño',   'Mar-Sáb 9am-7pm', 'luis.barbero@barberturno.com');

INSERT INTO servicios (nombre, precio, duracion) VALUES
('Corte de cabello',  25000, 30),
('Arreglo de barba',  15000, 20),
('Corte + Barba',     35000, 50),
('Tintura',           45000, 60);

SELECT 'Base de datos BarberTurno creada exitosamente.' AS Resultado;
