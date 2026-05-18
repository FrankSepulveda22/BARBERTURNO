# BarberTurno - Sistema de Gestión de Citas

## Evidencia: GA7-220501096-AA2-EV01
**Actividad:** Codificación de módulos del software  
**Programa:** Análisis y Desarrollo de Software - SENA

---

## Descripción del Proyecto

BarberTurno es un sistema que permite a barberías y peluquerías gestionar sus citas,
clientes, empleados y servicios de forma digital.

---

## Estructura del Proyecto

```
BarberTurno/
├── src/
│   └── barberturno/
│       ├── Main.java                    ← Punto de entrada
│       ├── conexion/
│       │   └── ConexionDB.java          ← Conexión JDBC a MySQL
│       ├── modelo/
│       │   └── Cliente.java             ← Entidad Cliente (POJO)
│       ├── dao/
│       │   └── ClienteDAO.java          ← CRUD con JDBC
│       └── vista/
│           └── VistaCliente.java        ← Interfaz de consola
├── lib/
│   └── mysql-connector-j-8.x.x.jar     ← Driver JDBC (agregar manualmente)
└── barberturno_db.sql                   ← Script de base de datos
```

---

## Requisitos Previos

- Java JDK 11 o superior
- MySQL 8.0 o superior
- MySQL Connector/J (Driver JDBC)
- NetBeans IDE o VS Code

---

## Instrucciones de Configuración

### 1. Crear la base de datos

Abrir MySQL Workbench o consola MySQL y ejecutar:

```sql
SOURCE barberturno_db.sql;
```

### 2. Agregar el Driver JDBC

Descargar `mysql-connector-j-8.x.x.jar` desde:
https://dev.mysql.com/downloads/connector/j/

Colocar el archivo en la carpeta `/lib` del proyecto.

### 3. Configurar credenciales

Editar el archivo `src/barberturno/conexion/ConexionDB.java`:

```java
private static final String URL      = "jdbc:mysql://localhost:3306/barberturno_db";
private static final String USUARIO  = "root";       // Cambiar según tu MySQL
private static final String PASSWORD = "";            // Cambiar según tu MySQL
```

### 4. Ejecutar en NetBeans

1. Abrir NetBeans → File → Open Project
2. Seleccionar la carpeta `BarberTurno`
3. Agregar el JAR de MySQL a las librerías del proyecto
4. Ejecutar `Main.java`

---

## Estándar de Codificación Aplicado

| Elemento       | Convención          | Ejemplo                  |
|---------------|---------------------|--------------------------|
| Clases         | PascalCase          | `ClienteDAO`, `ConexionDB` |
| Métodos        | camelCase           | `insertar()`, `buscarPorId()` |
| Variables      | camelCase           | `idCliente`, `listaClientes` |
| Constantes     | UPPER_SNAKE_CASE    | `SQL_INSERTAR`, `URL`    |
| Paquetes       | minúsculas          | `barberturno.dao`        |

---

## Funcionalidades CRUD Implementadas

| Operación  | Método DAO          | Descripción                     |
|-----------|---------------------|---------------------------------|
| Create    | `insertar()`        | Registrar nuevo cliente         |
| Read      | `listarTodos()`     | Obtener todos los clientes      |
| Read      | `buscarPorId()`     | Buscar cliente por ID           |
| Update    | `actualizar()`      | Modificar datos del cliente     |
| Delete    | `eliminar()`        | Eliminar cliente por ID         |

---

## Repositorio GitHub

[Enlace al repositorio - pendiente de configurar]

---

## Indicadores de Logro Cumplidos ✔

- [x] Conexión con base de datos usando JDBC
- [x] Aplicación del CRUD completo
- [x] Herramienta de versionamiento (GitHub)
- [x] Estándar de codificación definido
