import { Component, OnInit } from '@angular/core';
import { Turno, EstadoTurno } from '../../models/turno.model';
import { TurnoService } from '../../services/turno.service';

/**
 * Componente que muestra la lista de todos los turnos de la barbería.
 * Permite filtrar por fecha, buscar por cliente y cambiar el estado de los turnos.
 *
 * @author BarberTurno Team
 * @version 1.0
 */
@Component({
  selector: 'app-turno-lista',
  templateUrl: './turno-lista.component.html',
  styleUrls: ['./turno-lista.component.scss']
})
export class TurnoListaComponent implements OnInit {

  /** Lista completa de turnos cargados desde la API */
  turnos: Turno[] = [];

  /** Lista filtrada que se muestra en la tabla */
  turnosFiltrados: Turno[] = [];

  /** Fecha seleccionada para filtrar los turnos */
  fechaFiltro: string = '';

  /** Texto de búsqueda por nombre de cliente */
  busquedaCliente: string = '';

  /** Indicador de carga para mostrar spinner */
  cargando: boolean = false;

  /** Mensaje de error para mostrar al usuario */
  mensajeError: string = '';

  /** Mensaje de éxito tras una operación */
  mensajeExito: string = '';

  /** Referencia al enum para usar en el template HTML */
  EstadoTurno = EstadoTurno;

  /**
   * Constructor: inyecta el servicio de turnos.
   *
   * @param turnoService servicio para operaciones CRUD de turnos
   */
  constructor(private turnoService: TurnoService) {}

  /**
   * Ciclo de vida OnInit: carga los turnos al inicializar el componente.
   */
  ngOnInit(): void {
    this.cargarTurnos();
  }

  // ─── Carga de datos ───────────────────────────────────────────────────────

  /**
   * Carga todos los turnos desde la API y actualiza la lista.
   */
  cargarTurnos(): void {
    this.cargando = true;
    this.mensajeError = '';

    this.turnoService.obtenerTodos().subscribe({
      next: (turnos) => {
        this.turnos = turnos;
        this.turnosFiltrados = turnos;
        this.cargando = false;
      },
      error: (error) => {
        this.mensajeError = error.message;
        this.cargando = false;
      }
    });
  }

  // ─── Filtros ──────────────────────────────────────────────────────────────

  /**
   * Filtra los turnos por la fecha seleccionada en el input.
   * Si no hay fecha seleccionada, carga todos los turnos.
   */
  filtrarPorFecha(): void {
    if (!this.fechaFiltro) {
      this.cargarTurnos();
      return;
    }

    this.cargando = true;
    this.turnoService.obtenerPorFecha(this.fechaFiltro).subscribe({
      next: (turnos) => {
        this.turnosFiltrados = turnos;
        this.cargando = false;
      },
      error: (error) => {
        this.mensajeError = error.message;
        this.cargando = false;
      }
    });
  }

  /**
   * Busca turnos por nombre de cliente usando el servicio.
   * Si el campo está vacío, carga todos los turnos.
   */
  buscarPorCliente(): void {
    if (!this.busquedaCliente.trim()) {
      this.cargarTurnos();
      return;
    }

    this.cargando = true;
    this.turnoService.buscarPorCliente(this.busquedaCliente).subscribe({
      next: (turnos) => {
        this.turnosFiltrados = turnos;
        this.cargando = false;
      },
      error: (error) => {
        this.mensajeError = error.message;
        this.cargando = false;
      }
    });
  }

  // ─── Acciones sobre turnos ────────────────────────────────────────────────

  /**
   * Cambia el estado de un turno y actualiza la lista.
   *
   * @param turno  el turno a modificar
   * @param estado el nuevo estado a aplicar
   */
  cambiarEstado(turno: Turno, estado: EstadoTurno): void {
    if (!turno.id) return;

    this.turnoService.cambiarEstado(turno.id, estado).subscribe({
      next: (turnoActualizado) => {
        // Actualizar el turno en la lista local sin recargar todo
        const index = this.turnos.findIndex(t => t.id === turno.id);
        if (index !== -1) {
          this.turnos[index] = turnoActualizado;
          this.turnosFiltrados = [...this.turnos];
        }
        this.mostrarExito('Estado actualizado correctamente.');
      },
      error: (error) => {
        this.mensajeError = error.message;
      }
    });
  }

  /**
   * Elimina un turno tras confirmación del usuario.
   *
   * @param id identificador del turno a eliminar
   */
  eliminarTurno(id: number | undefined): void {
    if (!id) return;

    // Solicitar confirmación antes de eliminar
    const confirmado = confirm('¿Está seguro de que desea eliminar este turno?');
    if (!confirmado) return;

    this.turnoService.eliminarTurno(id).subscribe({
      next: () => {
        // Remover el turno de las listas locales
        this.turnos = this.turnos.filter(t => t.id !== id);
        this.turnosFiltrados = this.turnosFiltrados.filter(t => t.id !== id);
        this.mostrarExito('Turno eliminado correctamente.');
      },
      error: (error) => {
        this.mensajeError = error.message;
      }
    });
  }

  // ─── Utilidades de UI ─────────────────────────────────────────────────────

  /**
   * Retorna la clase CSS correspondiente al estado del turno.
   * Se usa para colorear visualmente las filas de la tabla.
   *
   * @param estado estado del turno
   * @returns nombre de la clase CSS
   */
  obtenerClaseEstado(estado: EstadoTurno | undefined): string {
    const clases: Record<string, string> = {
      [EstadoTurno.PENDIENTE]:  'badge-warning',
      [EstadoTurno.CONFIRMADO]: 'badge-success',
      [EstadoTurno.CANCELADO]:  'badge-danger',
      [EstadoTurno.COMPLETADO]: 'badge-secondary'
    };
    return estado ? clases[estado] : '';
  }

  /**
   * Muestra un mensaje de éxito por 3 segundos y luego lo limpia.
   *
   * @param mensaje texto del mensaje de éxito
   */
  private mostrarExito(mensaje: string): void {
    this.mensajeExito = mensaje;
    setTimeout(() => { this.mensajeExito = ''; }, 3000);
  }
}
