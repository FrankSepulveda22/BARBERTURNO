package barberturno.vista;

import barberturno.dao.ClienteDAO;
import barberturno.modelo.Cliente;

import java.util.List;
import java.util.Scanner;

/**
 * Clase de vista para la gestión de clientes en consola.
 * Permite al usuario realizar operaciones CRUD sobre los clientes.
 *
 * @author BarberTurno
 * @version 1.0
 */
public class VistaCliente {

    private final ClienteDAO clienteDAO;
    private final Scanner    scanner;

    public VistaCliente() {
        this.clienteDAO = new ClienteDAO();
        this.scanner    = new Scanner(System.in);
    }

    /**
     * Muestra el menú principal del módulo Clientes y gestiona la navegación.
     */
    public void mostrarMenu() {
        int opcion;
        do {
            System.out.println("\n╔══════════════════════════════╗");
            System.out.println("║    BARBERTURNO - CLIENTES    ║");
            System.out.println("╠══════════════════════════════╣");
            System.out.println("║  1. Registrar cliente        ║");
            System.out.println("║  2. Listar clientes          ║");
            System.out.println("║  3. Buscar cliente por ID    ║");
            System.out.println("║  4. Actualizar cliente       ║");
            System.out.println("║  5. Eliminar cliente         ║");
            System.out.println("║  0. Salir                    ║");
            System.out.println("╚══════════════════════════════╝");
            System.out.print("  Seleccione una opción: ");

            opcion = leerEntero();

            switch (opcion) {
                case 1: registrarCliente();   break;
                case 2: listarClientes();     break;
                case 3: buscarCliente();      break;
                case 4: actualizarCliente();  break;
                case 5: eliminarCliente();    break;
                case 0: System.out.println("\n  Cerrando módulo de clientes..."); break;
                default: System.out.println("\n  ⚠ Opción no válida. Intente nuevamente.");
            }
        } while (opcion != 0);
    }

    // ─── Operaciones CRUD ────────────────────────────────────────────────────

    private void registrarCliente() {
        System.out.println("\n── REGISTRAR NUEVO CLIENTE ──");
        Cliente cliente = solicitarDatosCliente();
        boolean exito = clienteDAO.insertar(cliente);
        if (exito) {
            System.out.println("  ✔ Cliente registrado exitosamente.");
        } else {
            System.out.println("  ✘ No se pudo registrar el cliente.");
        }
    }

    private void listarClientes() {
        System.out.println("\n── LISTA DE CLIENTES ──");
        List<Cliente> listaClientes = clienteDAO.listarTodos();
        if (listaClientes.isEmpty()) {
            System.out.println("  No hay clientes registrados.");
        } else {
            System.out.printf("%-5s %-25s %-30s %-15s%n",
                "ID", "NOMBRE", "CORREO", "TELÉFONO");
            System.out.println("─".repeat(75));
            for (Cliente c : listaClientes) {
                System.out.printf("%-5d %-25s %-30s %-15s%n",
                    c.getIdCliente(), c.getNombre(),
                    c.getCorreo(),    c.getTelefono());
            }
        }
    }

    private void buscarCliente() {
        System.out.println("\n── BUSCAR CLIENTE ──");
        System.out.print("  Ingrese el ID del cliente: ");
        int id = leerEntero();
        Cliente cliente = clienteDAO.buscarPorId(id);
        if (cliente != null) {
            System.out.println("\n  Datos del cliente encontrado:");
            System.out.println("  ID          : " + cliente.getIdCliente());
            System.out.println("  Nombre      : " + cliente.getNombre());
            System.out.println("  Correo      : " + cliente.getCorreo());
            System.out.println("  Teléfono    : " + cliente.getTelefono());
            System.out.println("  Observaciones: " + cliente.getObservaciones());
        } else {
            System.out.println("  ✘ Cliente con ID " + id + " no encontrado.");
        }
    }

    private void actualizarCliente() {
        System.out.println("\n── ACTUALIZAR CLIENTE ──");
        System.out.print("  Ingrese el ID del cliente a actualizar: ");
        int id = leerEntero();

        Cliente existente = clienteDAO.buscarPorId(id);
        if (existente == null) {
            System.out.println("  ✘ Cliente no encontrado.");
            return;
        }

        System.out.println("  Cliente encontrado: " + existente.getNombre());
        System.out.println("  Ingrese los nuevos datos:");
        Cliente clienteActualizado = solicitarDatosCliente();
        clienteActualizado.setIdCliente(id);

        boolean exito = clienteDAO.actualizar(clienteActualizado);
        if (exito) {
            System.out.println("  ✔ Cliente actualizado exitosamente.");
        } else {
            System.out.println("  ✘ No se pudo actualizar el cliente.");
        }
    }

    private void eliminarCliente() {
        System.out.println("\n── ELIMINAR CLIENTE ──");
        System.out.print("  Ingrese el ID del cliente a eliminar: ");
        int id = leerEntero();

        Cliente existente = clienteDAO.buscarPorId(id);
        if (existente == null) {
            System.out.println("  ✘ Cliente no encontrado.");
            return;
        }

        System.out.print("  ¿Confirma eliminar a " + existente.getNombre() + "? (s/n): ");
        String confirmacion = scanner.nextLine().trim();
        if (confirmacion.equalsIgnoreCase("s")) {
            boolean exito = clienteDAO.eliminar(id);
            if (exito) {
                System.out.println("  ✔ Cliente eliminado exitosamente.");
            } else {
                System.out.println("  ✘ No se pudo eliminar el cliente.");
            }
        } else {
            System.out.println("  Operación cancelada.");
        }
    }

    // ─── Métodos auxiliares ──────────────────────────────────────────────────

    /**
     * Solicita y retorna los datos básicos de un cliente por consola.
     *
     * @return Objeto Cliente con los datos ingresados.
     */
    private Cliente solicitarDatosCliente() {
        Cliente cliente = new Cliente();
        System.out.print("  Nombre        : ");
        cliente.setNombre(scanner.nextLine().trim());
        System.out.print("  Correo        : ");
        cliente.setCorreo(scanner.nextLine().trim());
        System.out.print("  Teléfono      : ");
        cliente.setTelefono(scanner.nextLine().trim());
        System.out.print("  Observaciones : ");
        cliente.setObservaciones(scanner.nextLine().trim());
        return cliente;
    }

    /**
     * Lee un número entero desde la entrada estándar, manejando errores de formato.
     *
     * @return Entero ingresado por el usuario.
     */
    private int leerEntero() {
        while (true) {
            try {
                int valor = Integer.parseInt(scanner.nextLine().trim());
                return valor;
            } catch (NumberFormatException e) {
                System.out.print("  ⚠ Ingrese un número válido: ");
            }
        }
    }
}
