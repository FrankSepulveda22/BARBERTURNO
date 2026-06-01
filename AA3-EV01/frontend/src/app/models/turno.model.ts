/**
 * Modelo que representa un turno/reserva en el sistema BarberTurno.
 * Refleja la estructura del DTO enviado y recibido desde la API REST.
 *
 * @author BarberTurno Team
 * @version 1.0
 */
export interface Turno {
  /** Identificador único del turno (asignado por el backend) */
  id?: number;

  /** Nombre completo del cliente */
  nombreCliente: string;

  /** Teléfono de contacto del cliente */
  telefonoCliente?: string;

  /** Nombre del barbero asignado */
  barbero: string;

  /** Fecha del turno en formato ISO (yyyy-MM-dd) */
  fecha: string;

  /** Hora del turno en formato HH:mm */
  hora: string;

  /** Servicio solicitado: corte, barba, combo, etc. */
  servicio: string;

  /** Estado actual del turno */
  estado?: EstadoTurno;

  /** Observaciones adicionales del cliente */
  observaciones?: string;
}

/**
 * Enumeración de los posibles estados de un turno.
 */
export enum EstadoTurno {
  PENDIENTE  = 'PENDIENTE',
  CONFIRMADO = 'CONFIRMADO',
  CANCELADO  = 'CANCELADO',
  COMPLETADO = 'COMPLETADO'
}

/**
 * Listado de barberos disponibles en la barbería.
 * En un sistema más robusto, vendría del backend.
 */
export const BARBEROS_DISPONIBLES: string[] = [
  'Carlos Pérez',
  'Juan Rodríguez',
  'Andrés Gómez',
  'Miguel Torres'
];

/**
 * Listado de servicios ofrecidos por la barbería.
 */
export const SERVICIOS_DISPONIBLES: string[] = [
  'Corte de cabello',
  'Arreglo de barba',
  'Combo (corte + barba)',
  'Afeitado clásico',
  'Corte infantil',
  'Tinte'
];
