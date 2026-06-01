package com.barberturno.controller;

import com.barberturno.dto.TurnoDTO;
import com.barberturno.model.EstadoTurno;
import com.barberturno.model.Turno;
import com.barberturno.service.TurnoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * Controlador REST para la gestión de turnos de la barbería.
 * Expone los endpoints del módulo de reservas bajo la ruta base /api/turnos.
 *
 * <p>Operaciones disponibles:
 * <ul>
 *   <li>GET    /api/turnos           → listar todos los turnos</li>
 *   <li>GET    /api/turnos/{id}      → obtener un turno por ID</li>
 *   <li>GET    /api/turnos/fecha     → filtrar por fecha</li>
 *   <li>GET    /api/turnos/barbero   → filtrar por barbero y fecha</li>
 *   <li>GET    /api/turnos/buscar    → buscar por nombre de cliente</li>
 *   <li>POST   /api/turnos           → crear nuevo turno</li>
 *   <li>PUT    /api/turnos/{id}      → actualizar turno existente</li>
 *   <li>PATCH  /api/turnos/{id}/estado → cambiar estado del turno</li>
 *   <li>DELETE /api/turnos/{id}      → eliminar turno</li>
 * </ul>
 *
 * @author BarberTurno Team
 * @version 1.0
 */
@RestController
@RequestMapping("/api/turnos")
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:3000"}) // Angular y móvil
public class TurnoController {

    /** Servicio de lógica de negocio para turnos */
    private final TurnoService turnoService;

    /**
     * Constructor con inyección de dependencias.
     *
     * @param turnoService servicio de turnos
     */
    @Autowired
    public TurnoController(TurnoService turnoService) {
        this.turnoService = turnoService;
    }

    // ─── GET: Listar todos ────────────────────────────────────────────────────

    /**
     * Retorna todos los turnos registrados en el sistema.
     *
     * @return lista de turnos con código HTTP 200
     */
    @GetMapping
    public ResponseEntity<List<Turno>> listarTodos() {
        List<Turno> turnos = turnoService.obtenerTodos();
        return ResponseEntity.ok(turnos);
    }

    // ─── GET: Obtener por ID ──────────────────────────────────────────────────

    /**
     * Retorna un turno específico por su ID.
     *
     * @param id identificador del turno
     * @return turno encontrado (200) o error 404 si no existe
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(@PathVariable Long id) {
        return turnoService.obtenerPorId(id)
                .map(turno -> ResponseEntity.ok((Object) turno))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Turno no encontrado con ID: " + id)));
    }

    // ─── GET: Filtrar por fecha ────────────────────────────────────────────────

    /**
     * Retorna todos los turnos de una fecha específica.
     *
     * @param fecha fecha en formato yyyy-MM-dd
     * @return lista de turnos en esa fecha
     */
    @GetMapping("/fecha")
    public ResponseEntity<List<Turno>> obtenerPorFecha(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        return ResponseEntity.ok(turnoService.obtenerPorFecha(fecha));
    }

    // ─── GET: Filtrar por barbero y fecha ─────────────────────────────────────

    /**
     * Retorna los turnos de un barbero en una fecha específica.
     *
     * @param barbero nombre del barbero
     * @param fecha   fecha en formato yyyy-MM-dd
     * @return lista de turnos filtrados
     */
    @GetMapping("/barbero")
    public ResponseEntity<List<Turno>> obtenerPorBarberoYFecha(
            @RequestParam String barbero,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        return ResponseEntity.ok(turnoService.obtenerPorBarberoYFecha(barbero, fecha));
    }

    // ─── GET: Buscar por cliente ──────────────────────────────────────────────

    /**
     * Busca turnos por nombre de cliente (búsqueda parcial).
     *
     * @param nombre nombre o fragmento del nombre del cliente
     * @return lista de turnos que coinciden
     */
    @GetMapping("/buscar")
    public ResponseEntity<List<Turno>> buscarPorCliente(@RequestParam String nombre) {
        return ResponseEntity.ok(turnoService.buscarPorCliente(nombre));
    }

    // ─── POST: Crear turno ────────────────────────────────────────────────────

    /**
     * Crea un nuevo turno/reserva en el sistema.
     *
     * @param dto datos del turno validados por Bean Validation
     * @return turno creado con código HTTP 201, o error 409 si hay conflicto
     */
    @PostMapping
    public ResponseEntity<?> crearTurno(@Valid @RequestBody TurnoDTO dto) {
        try {
            Turno turnoCreado = turnoService.crearTurno(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(turnoCreado);
        } catch (IllegalStateException ex) {
            // El horario ya está ocupado
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", ex.getMessage()));
        }
    }

    // ─── PUT: Actualizar turno ────────────────────────────────────────────────

    /**
     * Actualiza todos los datos de un turno existente.
     *
     * @param id  identificador del turno
     * @param dto nuevos datos del turno
     * @return turno actualizado (200) o error 404
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarTurno(
            @PathVariable Long id,
            @Valid @RequestBody TurnoDTO dto) {
        try {
            Turno turnoActualizado = turnoService.actualizarTurno(id, dto);
            return ResponseEntity.ok(turnoActualizado);
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", ex.getMessage()));
        }
    }

    // ─── PATCH: Cambiar estado ────────────────────────────────────────────────

    /**
     * Cambia únicamente el estado de un turno (confirmar, cancelar, completar).
     *
     * @param id     identificador del turno
     * @param body   mapa con la clave "estado" y el nuevo valor
     * @return turno con estado actualizado (200) o error 404/400
     */
    @PatchMapping("/{id}/estado")
    public ResponseEntity<?> cambiarEstado(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        try {
            // Convertir el string del cuerpo al enum EstadoTurno
            EstadoTurno nuevoEstado = EstadoTurno.valueOf(body.get("estado").toUpperCase());
            Turno turnoActualizado = turnoService.cambiarEstado(id, nuevoEstado);
            return ResponseEntity.ok(turnoActualizado);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Estado inválido. Use: PENDIENTE, CONFIRMADO, CANCELADO, COMPLETADO"));
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", ex.getMessage()));
        }
    }

    // ─── DELETE: Eliminar turno ───────────────────────────────────────────────

    /**
     * Elimina un turno del sistema por su ID.
     *
     * @param id identificador del turno a eliminar
     * @return respuesta vacía (204) o error 404
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarTurno(@PathVariable Long id) {
        try {
            turnoService.eliminarTurno(id);
            return ResponseEntity.noContent().build(); // 204 No Content
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", ex.getMessage()));
        }
    }
}
