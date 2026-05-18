package barberturno.modelo;

/**
 * Clase modelo que representa la entidad Cliente del sistema BarberTurno.
 * Contiene los atributos y métodos getter/setter correspondientes.
 *
 * @author BarberTurno
 * @version 1.0
 */
public class Cliente {

    private int    idCliente;
    private String nombre;
    private String correo;
    private String telefono;
    private String observaciones;

    /**
     * Constructor vacío.
     */
    public Cliente() {}

    /**
     * Constructor con todos los parámetros.
     *
     * @param idCliente     Identificador único del cliente.
     * @param nombre        Nombre completo del cliente.
     * @param correo        Correo electrónico del cliente.
     * @param telefono      Número de teléfono del cliente.
     * @param observaciones Notas adicionales sobre el cliente.
     */
    public Cliente(int idCliente, String nombre, String correo,
                   String telefono, String observaciones) {
        this.idCliente     = idCliente;
        this.nombre        = nombre;
        this.correo        = correo;
        this.telefono      = telefono;
        this.observaciones = observaciones;
    }

    // ─── Getters y Setters ───────────────────────────────────────────────────

    public int getIdCliente() {
        return idCliente;
    }

    public void setIdCliente(int idCliente) {
        this.idCliente = idCliente;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getObservaciones() {
        return observaciones;
    }

    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }

    @Override
    public String toString() {
        return "Cliente{" +
               "idCliente="     + idCliente     +
               ", nombre='"     + nombre        + '\'' +
               ", correo='"     + correo        + '\'' +
               ", telefono='"   + telefono      + '\'' +
               ", observaciones='" + observaciones + '\'' +
               '}';
    }
}
