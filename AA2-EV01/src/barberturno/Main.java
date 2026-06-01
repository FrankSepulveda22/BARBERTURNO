package barberturno;

import barberturno.conexion.ConexionDB;
import barberturno.vista.VistaCliente;

/**
 * Clase principal del sistema BarberTurno.
 * Punto de entrada de la aplicación.
 *
 * @author BarberTurno
 * @version 1.0
 */
public class Main {

    /**
     * Método principal que inicia la aplicación BarberTurno.
     *
     * @param args Argumentos de línea de comandos (no utilizados).
     */
    public static void main(String[] args) {
        System.out.println("╔═══════════════════════════════════════╗");
        System.out.println("║      SISTEMA BARBERTURNO v1.0         ║");
        System.out.println("║  Gestión de Citas para Barberías      ║");
        System.out.println("╚═══════════════════════════════════════╝");

        // Verificar conexión a la base de datos
        if (ConexionDB.obtenerConexion() == null) {
            System.err.println("Error crítico: No se pudo conectar a la base de datos.");
            System.err.println("Verifique que MySQL esté activo y la BD 'barberturno_db' exista.");
            return;
        }

        // Iniciar módulo de Clientes
        VistaCliente vistaCliente = new VistaCliente();
        vistaCliente.mostrarMenu();

        // Cerrar conexión al finalizar
        ConexionDB.cerrarConexion();
        System.out.println("\n  Sistema finalizado. ¡Hasta pronto!");
    }
}
