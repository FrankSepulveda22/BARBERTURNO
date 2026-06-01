package com.barberturno.repository;

import com.barberturno.model.EstadoTurno;
import com.barberturno.model.Turno;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

/**
 * Repositorio JPA para la entidad {@link Turno}.
 * Provee operaciones CRUD y consultas personalizadas sobre los turnos.
 *
 * @author BarberTurno Team
 * @version 1.0
 */
@Repository
public interface TurnoRepository extends JpaRepository<Turno, Long> {

    /**
     * Busca todos los turnos de un barbero específico.
     *
     * @param barbero nombre del barbero
     * @return lista de turnos del barbero
     */
    List<Turno> findByBarbero(String barbero);

    /**
     * Busca todos los turnos de una fecha específica.
     *
     * @param fecha fecha de búsqueda
     * @return lista de turnos en esa fecha
     */
    List<Turno> findByFecha(LocalDate fecha);

    /**
     * Busca los turnos de un barbero en una fecha determinada.
     *
     * @param barbero nombre del barbero
     * @param fecha   fecha de búsqueda
     * @return lista de turnos filtrados
     */
    List<Turno> findByBarberoAndFecha(String barbero, LocalDate fecha);

    /**
     * Busca turnos por estado (PENDIENTE, CONFIRMADO, CANCELADO, COMPLETADO).
     *
     * @param estado estado a filtrar
     * @return lista de turnos con ese estado
     */
    List<Turno> findByEstado(EstadoTurno estado);

    /**
     * Verifica si ya existe un turno para el mismo barbero, fecha y hora.
     * Útil para evitar solapamiento de reservas.
     *
     * @param barbero nombre del barbero
     * @param fecha   fecha del turno
     * @param hora    hora del turno
     * @return true si el turno ya está ocupado
     */
    @Query("SELECT COUNT(t) > 0 FROM Turno t " +
           "WHERE t.barbero = :barbero AND t.fecha = :fecha AND t.hora = :hora " +
           "AND t.estado <> 'CANCELADO'")
    boolean existeTurnoOcupado(@Param("barbero") String barbero,
                               @Param("fecha")   LocalDate fecha,
                               @Param("hora")    LocalTime hora);

    /**
     * Busca turnos por nombre de cliente (búsqueda parcial, sin distinción de mayúsculas).
     *
     * @param nombreCliente nombre o fragmento del nombre del cliente
     * @return lista de turnos que coinciden
     */
    List<Turno> findByNombreClienteContainingIgnoreCase(String nombreCliente);
}
