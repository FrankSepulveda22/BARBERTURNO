package com.barberturno.dto;

import com.barberturno.model.EstadoTurno;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalTime;

/**
 * DTO (Data Transfer Object) para la creación y actualización de turnos.
 * Desacopla la capa de presentación de la entidad de dominio.
 *
 * @author BarberTurno Team
 * @version 1.0
 */
public class TurnoDTO {

    /** ID del turno (usado solo en respuestas) */
    private Long id;

    /** Nombre completo del cliente */
    @NotBlank(message = "El nombre del cliente es obligatorio")
    private String nombreCliente;

    /** Teléfono de contacto */
    private String telefonoCliente;

    /** Barbero asignado */
    @NotBlank(message = "El barbero es obligatorio")
    private String barbero;

    /** Fecha del turno en formato ISO (yyyy-MM-dd) */
    @NotNull(message = "La fecha es obligatoria")
    private LocalDate fecha;

    /** Hora del turno en formato HH:mm */
    @NotNull(message = "La hora es obligatoria")
    private LocalTime hora;

    /** Tipo de servicio solicitado */
    @NotBlank(message = "El servicio es obligatorio")
    private String servicio;

    /** Estado actual del turno */
    private EstadoTurno estado;

    /** Observaciones o notas adicionales */
    private String observaciones;

    // ─── Constructor vacío ────────────────────────────────────────────────────
    public TurnoDTO() {}

    // ─── Getters y Setters ────────────────────────────────────────────────────

    public Long getId()                        { return id; }
    public void setId(Long id)                 { this.id = id; }

    public String getNombreCliente()           { return nombreCliente; }
    public void setNombreCliente(String v)     { this.nombreCliente = v; }

    public String getTelefonoCliente()         { return telefonoCliente; }
    public void setTelefonoCliente(String v)   { this.telefonoCliente = v; }

    public String getBarbero()                 { return barbero; }
    public void setBarbero(String v)           { this.barbero = v; }

    public LocalDate getFecha()                { return fecha; }
    public void setFecha(LocalDate v)          { this.fecha = v; }

    public LocalTime getHora()                 { return hora; }
    public void setHora(LocalTime v)           { this.hora = v; }

    public String getServicio()                { return servicio; }
    public void setServicio(String v)          { this.servicio = v; }

    public EstadoTurno getEstado()             { return estado; }
    public void setEstado(EstadoTurno v)       { this.estado = v; }

    public String getObservaciones()           { return observaciones; }
    public void setObservaciones(String v)     { this.observaciones = v; }
}
