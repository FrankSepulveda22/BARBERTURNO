import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Turno, EstadoTurno } from '../models/turno.model';

/**
 * Servicio Angular para la gestión de turnos de la barbería.
 * Consume los endpoints REST del backend Spring Boot.
 *
 * Inyectable en cualquier componente de la aplicación mediante DI.
 *
 * @author BarberTurno Team
 * @version 1.0
 */
@Injectable({
  providedIn: 'root' // Disponible en toda la aplicación (singleton)
})
export class TurnoService {

  /** URL base de la API REST del backend */
  private readonly API_URL = 'http://localhost:8080/api/turnos';

  /**
   * Constructor: inyecta el cliente HTTP de Angular.
   *
   * @param http cliente HTTP para realizar peticiones REST
   */
  constructor(private http: HttpClient) {}

  // ─── Consultas ────────────────────────────────────────────────────────────

  /**
   * Obtiene todos los turnos registrados en el sistema.
   *
   * @returns Observable con la lista de todos los turnos
   */
  obtenerTodos(): Observable<Turno[]> {
    return this.http.get<Turno[]>(this.API_URL).pipe(
      catchError(this.manejarError)
    );
  }

  /**
   * Obtiene un turno específico por su ID.
   *
   * @param id identificador del turno
   * @returns Observable con el turno encontrado
   */
  obtenerPorId(id: number): Observable<Turno> {
    return this.http.get<Turno>(`${this.API_URL}/${id}`).pipe(
      catchError(this.manejarError)
    );
  }

  /**
   * Filtra los turnos por fecha específica.
   *
   * @param fecha fecha en formato yyyy-MM-dd
   * @returns Observable con la lista de turnos de esa fecha
   */
  obtenerPorFecha(fecha: string): Observable<Turno[]> {
    const params = new HttpParams().set('fecha', fecha);
    return this.http.get<Turno[]>(`${this.API_URL}/fecha`, { params }).pipe(
      catchError(this.manejarError)
    );
  }

  /**
   * Filtra los turnos de un barbero en una fecha específica.
   *
   * @param barbero nombre del barbero
   * @param fecha   fecha en formato yyyy-MM-dd
   * @returns Observable con la lista de turnos filtrados
   */
  obtenerPorBarberoYFecha(barbero: string, fecha: string): Observable<Turno[]> {
    const params = new HttpParams()
      .set('barbero', barbero)
      .set('fecha', fecha);
    return this.http.get<Turno[]>(`${this.API_URL}/barbero`, { params }).pipe(
      catchError(this.manejarError)
    );
  }

  /**
   * Busca turnos por nombre de cliente (búsqueda parcial).
   *
   * @param nombre nombre o fragmento del nombre del cliente
   * @returns Observable con la lista de turnos que coinciden
   */
  buscarPorCliente(nombre: string): Observable<Turno[]> {
    const params = new HttpParams().set('nombre', nombre);
    return this.http.get<Turno[]>(`${this.API_URL}/buscar`, { params }).pipe(
      catchError(this.manejarError)
    );
  }

  // ─── Mutaciones ───────────────────────────────────────────────────────────

  /**
   * Crea un nuevo turno en el sistema.
   *
   * @param turno datos del turno a crear
   * @returns Observable con el turno creado (incluye el ID asignado)
   */
  crearTurno(turno: Turno): Observable<Turno> {
    return this.http.post<Turno>(this.API_URL, turno).pipe(
      catchError(this.manejarError)
    );
  }

  /**
   * Actualiza todos los datos de un turno existente.
   *
   * @param id    identificador del turno
   * @param turno nuevos datos del turno
   * @returns Observable con el turno actualizado
   */
  actualizarTurno(id: number, turno: Turno): Observable<Turno> {
    return this.http.put<Turno>(`${this.API_URL}/${id}`, turno).pipe(
      catchError(this.manejarError)
    );
  }

  /**
   * Cambia únicamente el estado de un turno.
   *
   * @param id     identificador del turno
   * @param estado nuevo estado a aplicar
   * @returns Observable con el turno actualizado
   */
  cambiarEstado(id: number, estado: EstadoTurno): Observable<Turno> {
    return this.http.patch<Turno>(
      `${this.API_URL}/${id}/estado`,
      { estado }
    ).pipe(
      catchError(this.manejarError)
    );
  }

  /**
   * Elimina un turno del sistema.
   *
   * @param id identificador del turno a eliminar
   * @returns Observable vacío al completarse
   */
  eliminarTurno(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`).pipe(
      catchError(this.manejarError)
    );
  }

  // ─── Manejo de errores ────────────────────────────────────────────────────

  /**
   * Maneja los errores HTTP de las peticiones a la API.
   * Transforma los errores del backend en mensajes amigables.
   *
   * @param error error HTTP recibido
   * @returns Observable que emite el error transformado
   */
  private manejarError(error: any): Observable<never> {
    let mensajeError = 'Ha ocurrido un error inesperado.';

    if (error.status === 404) {
      mensajeError = 'El turno solicitado no fue encontrado.';
    } else if (error.status === 409) {
      // El backend envía el mensaje de conflicto de horario
      mensajeError = error.error?.error || 'El horario ya está ocupado.';
    } else if (error.status === 400) {
      mensajeError = 'Datos del formulario inválidos. Revise los campos.';
    } else if (error.status === 0) {
      mensajeError = 'No se pudo conectar al servidor. Verifique su conexión.';
    }

    console.error('[TurnoService] Error HTTP:', error);
    return throwError(() => new Error(mensajeError));
  }
}
