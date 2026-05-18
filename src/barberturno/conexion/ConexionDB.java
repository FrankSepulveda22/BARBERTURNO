package barberturno.conexion;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * Clase responsable de gestionar la conexión con la base de datos MySQL.
 * Utiliza el patrón Singleton para garantizar una sola instancia de conexión.
 *
 * @author BarberTurno
 * @version 1.0
 */
public class ConexionDB {

    // Parámetros de conexión a la base de datos
    private static final String URL      = "jdbc:mysql://localhost:3306/barberturno_db";
    private static final String USUARIO  = "root";
    private static final String PASSWORD = "";
    private static final String DRIVER   = "com.mysql.cj.jdbc.Driver";

    private static Connection conexion = null;

    /**
     * Constructor privado para evitar instanciación directa.
     */
    private ConexionDB() {}

    /**
     * Retorna la conexión activa. Si no existe o está cerrada, la crea.
     *
     * @return Connection objeto de conexión a la BD.
     */
    public static Connection obtenerConexion() {
        try {
            Class.forName(DRIVER);
            if (conexion == null || conexion.isClosed()) {
                conexion = DriverManager.getConnection(URL, USUARIO, PASSWORD);
                System.out.println("[ConexionDB] Conexión establecida correctamente.");
            }
        } catch (ClassNotFoundException e) {
            System.err.println("[ConexionDB] Driver no encontrado: " + e.getMessage());
        } catch (SQLException e) {
            System.err.println("[ConexionDB] Error SQL al conectar: " + e.getMessage());
        }
        return conexion;
    }

    /**
     * Cierra la conexión activa con la base de datos.
     */
    public static void cerrarConexion() {
        try {
            if (conexion != null && !conexion.isClosed()) {
                conexion.close();
                System.out.println("[ConexionDB] Conexión cerrada.");
            }
        } catch (SQLException e) {
            System.err.println("[ConexionDB] Error al cerrar conexión: " + e.getMessage());
        }
    }
}
