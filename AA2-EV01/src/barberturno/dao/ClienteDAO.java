package barberturno.dao;

import barberturno.conexion.ConexionDB;
import barberturno.modelo.Cliente;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Clase DAO (Data Access Object) para la entidad Cliente.
 * Contiene las operaciones CRUD: Crear, Leer, Actualizar y Eliminar
 * utilizando conexión JDBC con MySQL.
 *
 * @author BarberTurno
 * @version 1.0
 */
public class ClienteDAO {

    // ─── Sentencias SQL ──────────────────────────────────────────────────────
    private static final String SQL_INSERTAR =
        "INSERT INTO clientes (nombre, correo, telefono, observaciones) VALUES (?, ?, ?, ?)";

    private static final String SQL_LISTAR =
        "SELECT id_cliente, nombre, correo, telefono, observaciones FROM clientes";

    private static final String SQL_BUSCAR_POR_ID =
        "SELECT id_cliente, nombre, correo, telefono, observaciones FROM clientes WHERE id_cliente = ?";

    private static final String SQL_ACTUALIZAR =
        "UPDATE clientes SET nombre = ?, correo = ?, telefono = ?, observaciones = ? WHERE id_cliente = ?";

    private static final String SQL_ELIMINAR =
        "DELETE FROM clientes WHERE id_cliente = ?";

    // ─── CREATE ──────────────────────────────────────────────────────────────

    /**
     * Inserta un nuevo cliente en la base de datos.
     *
     * @param cliente Objeto Cliente con los datos a insertar.
     * @return true si la inserción fue exitosa, false en caso contrario.
     */
    public boolean insertar(Cliente cliente) {
        Connection conexion = ConexionDB.obtenerConexion();
        try (PreparedStatement ps = conexion.prepareStatement(SQL_INSERTAR)) {

            ps.setString(1, cliente.getNombre());
            ps.setString(2, cliente.getCorreo());
            ps.setString(3, cliente.getTelefono());
            ps.setString(4, cliente.getObservaciones());

            int filasAfectadas = ps.executeUpdate();
            return filasAfectadas > 0;

        } catch (SQLException e) {
            System.err.println("[ClienteDAO] Error al insertar cliente: " + e.getMessage());
            return false;
        }
    }

    // ─── READ (Listar todos) ──────────────────────────────────────────────────

    /**
     * Obtiene la lista de todos los clientes registrados.
     *
     * @return Lista de objetos Cliente.
     */
    public List<Cliente> listarTodos() {
        List<Cliente> listaClientes = new ArrayList<>();
        Connection conexion = ConexionDB.obtenerConexion();

        try (PreparedStatement ps = conexion.prepareStatement(SQL_LISTAR);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                Cliente cliente = mapearResultSet(rs);
                listaClientes.add(cliente);
            }

        } catch (SQLException e) {
            System.err.println("[ClienteDAO] Error al listar clientes: " + e.getMessage());
        }
        return listaClientes;
    }

    // ─── READ (Buscar por ID) ─────────────────────────────────────────────────

    /**
     * Busca un cliente por su ID único.
     *
     * @param idCliente Identificador del cliente a buscar.
     * @return Objeto Cliente si se encuentra, null si no existe.
     */
    public Cliente buscarPorId(int idCliente) {
        Connection conexion = ConexionDB.obtenerConexion();

        try (PreparedStatement ps = conexion.prepareStatement(SQL_BUSCAR_POR_ID)) {

            ps.setInt(1, idCliente);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return mapearResultSet(rs);
                }
            }

        } catch (SQLException e) {
            System.err.println("[ClienteDAO] Error al buscar cliente: " + e.getMessage());
        }
        return null;
    }

    // ─── UPDATE ──────────────────────────────────────────────────────────────

    /**
     * Actualiza los datos de un cliente existente.
     *
     * @param cliente Objeto Cliente con los datos actualizados (debe incluir idCliente).
     * @return true si la actualización fue exitosa, false en caso contrario.
     */
    public boolean actualizar(Cliente cliente) {
        Connection conexion = ConexionDB.obtenerConexion();

        try (PreparedStatement ps = conexion.prepareStatement(SQL_ACTUALIZAR)) {

            ps.setString(1, cliente.getNombre());
            ps.setString(2, cliente.getCorreo());
            ps.setString(3, cliente.getTelefono());
            ps.setString(4, cliente.getObservaciones());
            ps.setInt(5, cliente.getIdCliente());

            int filasAfectadas = ps.executeUpdate();
            return filasAfectadas > 0;

        } catch (SQLException e) {
            System.err.println("[ClienteDAO] Error al actualizar cliente: " + e.getMessage());
            return false;
        }
    }

    // ─── DELETE ──────────────────────────────────────────────────────────────

    /**
     * Elimina un cliente de la base de datos por su ID.
     *
     * @param idCliente Identificador del cliente a eliminar.
     * @return true si la eliminación fue exitosa, false en caso contrario.
     */
    public boolean eliminar(int idCliente) {
        Connection conexion = ConexionDB.obtenerConexion();

        try (PreparedStatement ps = conexion.prepareStatement(SQL_ELIMINAR)) {

            ps.setInt(1, idCliente);
            int filasAfectadas = ps.executeUpdate();
            return filasAfectadas > 0;

        } catch (SQLException e) {
            System.err.println("[ClienteDAO] Error al eliminar cliente: " + e.getMessage());
            return false;
        }
    }

    // ─── Método auxiliar ─────────────────────────────────────────────────────

    /**
     * Mapea una fila del ResultSet a un objeto Cliente.
     *
     * @param rs ResultSet posicionado en una fila válida.
     * @return Objeto Cliente con los datos de la fila.
     * @throws SQLException si ocurre un error al leer el ResultSet.
     */
    private Cliente mapearResultSet(ResultSet rs) throws SQLException {
        Cliente cliente = new Cliente();
        cliente.setIdCliente(rs.getInt("id_cliente"));
        cliente.setNombre(rs.getString("nombre"));
        cliente.setCorreo(rs.getString("correo"));
        cliente.setTelefono(rs.getString("telefono"));
        cliente.setObservaciones(rs.getString("observaciones"));
        return cliente;
    }
}
