package com.barberturno.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalTime;

/**
 * Entidad que representa un turno/reserva en la barbería.
 * Contiene la información del cliente, barbero, fecha y estado del turno.
 *
 * @author BarberTurno Team
 * @version 1.0
 */
@Entity
@Table(name = "turnos")
public class Turno {

    /** Identificador único del turno */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Nombre completo del cliente que reserva el turno */
    @NotBlank(message = "El nombre del cliente es obligatorio")
    @Column(name = "nombre_cliente", nullable = false, length = 100)
    private String nombreCliente;

    /** Teléfono de contacto del cliente */
    @Column(name = "telefono_cliente", length = 20)
    private String telefonoCliente;

    /** Nombre del barbero asignado al turno */
    @NotBlank(message = "El barbero es obligatorio")
    @Column(name = "barbero", nullable = false, length = 100)
    private String barbero;

    /** Fecha programada del turno */
    @NotNull(message = "La fecha es obligatoria")
    @Column(name = "fecha", nullable = false)
    private LocalDate fecha;

    /** Hora programada del turno */
    @NotNull(message = "La hora es obligatoria")
    @Column(name = "hora", nullable = false)
    private LocalTime hora;

    /** Servicio solicitado: corte, barba, combo, etc. */
    @NotBlank(message = "El servicio es obligatorio")
    @Column(name = "servicio", nullable = false, length = 100)
    private String servicio;

    /**
     * Estado del turno.
     * Valores posibles: PENDIENTE, CONFIRMADO, CANCELADO, COMPLETADO
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "estado", nullable = false)
    private EstadoTurno estado = EstadoTurno.PENDIENTE;

    /** Observaciones adicionales del cliente */
    @Column(name = "observaciones", length = 255)
    private String observaciones;

    // ─── Constructores ────────────────────────────────────────────────────────

    /** Constructor vacío requerido por JPA */
    public Turno() {}

    /** Constructor completo para creación de turnos */
    public Turno(String nombreCliente, String telefonoCliente, String barbero,
                 LocalDate fecha, LocalTime hora, String servicio, String observaciones) {
        this.nombreCliente   = nombreCliente;
        this.telefonoCliente = telefonoCliente;
        this.barbero         = barbero;
        this.fecha           = fecha;
        this.hora            = hora;
        this.servicio        = servicio;
        this.observaciones   = observaciones;
        this.estado          = EstadoTurno.PENDIENTE;
    }

    // ─── Getters y Setters ────────────────────────────────────────────────────

    public Long getId()                       { return id; }
    public void setId(Long id)                { this.id = id; }

    public String getNombreCliente()          { return nombreCliente; }
    public void setNombreCliente(String v)    { this.nombreCliente = v; }

    public String getTelefonoCliente()        { return telefonoCliente; }
    public void setTelefonoCliente(String v)  { this.telefonoCliente = v; }

    public String getBarbero()                { return barbero; }
    public void setBarbero(String v)          { this.barbero = v; }

    public LocalDate getFecha()               { return fecha; }
    public void setFecha(LocalDate v)         { this.fecha = v; }

    public LocalTime getHora()                { return hora; }
    public void setHora(LocalTime v)          { this.hora = v; }

    public String getServicio()               { return servicio; }
    public void setServicio(String v)         { this.servicio = v; }

    public EstadoTurno getEstado()            { return estado; }
    public void setEstado(EstadoTurno v)      { this.estado = v; }

    public String getObservaciones()          { return observaciones; }
    public void setObservaciones(String v)    { this.observaciones = v; }
}
