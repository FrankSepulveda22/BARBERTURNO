package com.barberturno.service;

import com.barberturno.dto.TurnoDTO;
import com.barberturno.model.EstadoTurno;
import com.barberturno.model.Turno;
import com.barberturno.repository.TurnoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Servicio que contiene la lógica de negocio para la gestión de turnos.
 * Actúa como intermediario entre el controlador y el repositorio.
 *
 * @author BarberTurno Team
 * @version 1.0
 */
@Service
@Transactional
public class TurnoService {

    /** Repositorio para acceso a datos de turnos */
    private final TurnoRepository turnoRepository;

    /**
     * Constructor con inyección de dependencias.
     *
     * @param turnoRepository repositorio JPA de turnos
     */
    @Autowired
    public TurnoService(TurnoRepository turnoRepository) {
        this.turnoRepository = turnoRepository;
    }

    // ─── Creación ─────────────────────────────────────────────────────────────

    /**
     * Crea un nuevo turno validando que no exista conflicto de horario.
     *
     * @param dto datos del turno a crear
     * @return el turno creado con su ID asignado
     * @throws IllegalStateException si el horario ya está ocupado
     */
    public Turno crearTurno(TurnoDTO dto) {
        // Verificar disponibilidad del horario para el barbero
        boolean ocupado = turnoRepository.existeTurnoOcupado(
                dto.getBarbero(), dto.getFecha(), dto.getHora());

        if (ocupado) {
            throw new IllegalStateException(
                "El barbero " + dto.getBarbero() +
                " ya tiene un turno reservado el " + dto.getFecha() +
                " a las " + dto.getHora());
        }

        // Mapear DTO a entidad y guardar
        Turno turno = mapearDTOaEntidad(dto);
        return turnoRepository.save(turno);
    }

    // ─── Consultas ────────────────────────────────────────────────────────────

    /**
     * Obtiene todos los turnos registrados en el sistema.
     *
     * @return lista completa de turnos
     */
    @Transactional(readOnly = true)
    public List<Turno> obtenerTodos() {
        return turnoRepository.findAll();
    }

    /**
     * Busca un turno por su ID.
     *
     * @param id identificador del turno
     * @return Optional con el turno si existe
     */
    @Transactional(readOnly = true)
    public Optional<Turno> obtenerPorId(Long id) {
        return turnoRepository.findById(id);
    }

    /**
     * Obtiene todos los turnos de una fecha específica.
     *
     * @param fecha fecha a consultar
     * @return lista de turnos en esa fecha
     */
    @Transactional(readOnly = true)
    public List<Turno> obtenerPorFecha(LocalDate fecha) {
        return turnoRepository.findByFecha(fecha);
    }

    /**
     * Obtiene los turnos de un barbero en una fecha específica.
     *
     * @param barbero nombre del barbero
     * @param fecha   fecha a consultar
     * @return lista de turnos del barbero en esa fecha
     */
    @Transactional(readOnly = true)
    public List<Turno> obtenerPorBarberoYFecha(String barbero, LocalDate fecha) {
        return turnoRepository.findByBarberoAndFecha(barbero, fecha);
    }

    /**
     * Busca turnos por el nombre del cliente (búsqueda parcial).
     *
     * @param nombre nombre o fragmento del nombre del cliente
     * @return lista de turnos que coinciden
     */
    @Transactional(readOnly = true)
    public List<Turno> buscarPorCliente(String nombre) {
        return turnoRepository.findByNombreClienteContainingIgnoreCase(nombre);
    }

    // ─── Actualización ────────────────────────────────────────────────────────

    /**
     * Actualiza los datos de un turno existente.
     *
     * @param id  identificador del turno a actualizar
     * @param dto nuevos datos del turno
     * @return el turno actualizado
     * @throws RuntimeException si el turno no existe
     */
    public Turno actualizarTurno(Long id, TurnoDTO dto) {
        // Verificar existencia del turno
        Turno turnoExistente = turnoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Turno no encontrado con ID: " + id));

        // Actualizar campos del turno
        turnoExistente.setNombreCliente(dto.getNombreCliente());
        turnoExistente.setTelefonoCliente(dto.getTelefonoCliente());
        turnoExistente.setBarbero(dto.getBarbero());
        turnoExistente.setFecha(dto.getFecha());
        turnoExistente.setHora(dto.getHora());
        turnoExistente.setServicio(dto.getServicio());
        turnoExistente.setObservaciones(dto.getObservaciones());

        // Actualizar estado si viene en el DTO
        if (dto.getEstado() != null) {
            turnoExistente.setEstado(dto.getEstado());
        }

        return turnoRepository.save(turnoExistente);
    }

    /**
     * Cambia únicamente el estado de un turno.
     *
     * @param id     identificador del turno
     * @param estado nuevo estado a aplicar
     * @return el turno con el estado actualizado
     * @throws RuntimeException si el turno no existe
     */
    public Turno cambiarEstado(Long id, EstadoTurno estado) {
        Turno turno = turnoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Turno no encontrado con ID: " + id));

        turno.setEstado(estado);
        return turnoRepository.save(turno);
    }

    // ─── Eliminación ──────────────────────────────────────────────────────────

    /**
     * Elimina un turno por su ID.
     *
     * @param id identificador del turno a eliminar
     * @throws RuntimeException si el turno no existe
     */
    public void eliminarTurno(Long id) {
        if (!turnoRepository.existsById(id)) {
            throw new RuntimeException("Turno no encontrado con ID: " + id);
        }
        turnoRepository.deleteById(id);
    }

    // ─── Métodos privados de apoyo ────────────────────────────────────────────

    /**
     * Convierte un TurnoDTO a una entidad Turno.
     *
     * @param dto objeto DTO con los datos del turno
     * @return entidad Turno lista para persistir
     */
    private Turno mapearDTOaEntidad(TurnoDTO dto) {
        return new Turno(
            dto.getNombreCliente(),
            dto.getTelefonoCliente(),
            dto.getBarbero(),
            dto.getFecha(),
            dto.getHora(),
            dto.getServicio(),
            dto.getObservaciones()
        );
    }
}
