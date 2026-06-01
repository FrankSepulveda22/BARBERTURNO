package com.barberturno.model;

/**
 * Enumeración que define los posibles estados de un turno en BarberTurno.
 *
 * @author BarberTurno Team
 * @version 1.0
 */
public enum EstadoTurno {

    /** El turno ha sido creado pero aún no confirmado por el barbero */
    PENDIENTE,

    /** El turno ha sido confirmado por la barbería */
    CONFIRMADO,

    /** El turno fue cancelado por el cliente o la barbería */
    CANCELADO,

    /** El servicio fue prestado exitosamente */
    COMPLETADO
}
