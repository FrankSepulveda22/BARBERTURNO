import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Turno, BARBEROS_DISPONIBLES, SERVICIOS_DISPONIBLES } from '../../models/turno.model';
import { TurnoService } from '../../services/turno.service';

/**
 * Componente de formulario para crear y editar turnos.
 * Funciona en modo "crear" si no recibe un ID en la ruta,
 * o en modo "editar" si la ruta contiene /turnos/editar/:id.
 *
 * Usa Reactive Forms de Angular para validación del formulario.
 *
 * @author BarberTurno Team
 * @version 1.0
 */
@Component({
  selector: 'app-turno-form',
  templateUrl: './turno-form.component.html',
  styleUrls: ['./turno-form.component.scss']
})
export class TurnoFormComponent implements OnInit {

  /** Formulario reactivo con los campos del turno */
  formulario!: FormGroup;

  /** Indica si el componente está en modo edición */
  modoEdicion: boolean = false;

  /** ID del turno en modo edición (null si es nuevo turno) */
  turnoId: number | null = null;

  /** Indicador de envío del formulario */
  enviando: boolean = false;

  /** Mensaje de error para mostrar al usuario */
  mensajeError: string = '';

  /** Lista de barberos disponibles para el select */
  barberos: string[] = BARBEROS_DISPONIBLES;

  /** Lista de servicios disponibles para el select */
  servicios: string[] = SERVICIOS_DISPONIBLES;

  /** Fecha mínima permitida: hoy (no se pueden crear turnos en el pasado) */
  fechaMinima: string = new Date().toISOString().split('T')[0];

  /**
   * Constructor: inyecta las dependencias necesarias.
   *
   * @param fb           FormBuilder para construir el formulario reactivo
   * @param turnoService servicio de turnos
   * @param route        ruta activa (para leer el ID del turno)
   * @param router       router para navegar tras guardar
   */
  constructor(
    private fb: FormBuilder,
    private turnoService: TurnoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  /**
   * Ciclo de vida OnInit: construye el formulario y carga datos si es edición.
   */
  ngOnInit(): void {
    this.construirFormulario();

    // Verificar si hay un ID en la ruta (modo edición)
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.modoEdicion = true;
      this.turnoId = +id; // Convertir string a número
      this.cargarTurnoParaEditar(this.turnoId);
    }
  }

  // ─── Construcción del formulario ──────────────────────────────────────────

  /**
   * Construye el formulario reactivo con validaciones.
   * Todos los campos requeridos tienen el validador Validators.required.
   */
  private construirFormulario(): void {
    this.formulario = this.fb.group({
      nombreCliente:   ['', [Validators.required, Validators.minLength(3)]],
      telefonoCliente: ['', [Validators.pattern(/^[0-9]{7,10}$/)]],
      barbero:         ['', Validators.required],
      fecha:           ['', Validators.required],
      hora:            ['', Validators.required],
      servicio:        ['', Validators.required],
      observaciones:   ['']
    });
  }

  // ─── Carga para edición ───────────────────────────────────────────────────

  /**
   * Carga los datos de un turno existente y los pone en el formulario.
   *
   * @param id identificador del turno a editar
   */
  private cargarTurnoParaEditar(id: number): void {
    this.turnoService.obtenerPorId(id).subscribe({
      next: (turno) => {
        // Rellenar el formulario con los datos del turno cargado
        this.formulario.patchValue({
          nombreCliente:   turno.nombreCliente,
          telefonoCliente: turno.telefonoCliente,
          barbero:         turno.barbero,
          fecha:           turno.fecha,
          hora:            turno.hora,
          servicio:        turno.servicio,
          observaciones:   turno.observaciones
        });
      },
      error: (error) => {
        this.mensajeError = 'No se pudo cargar el turno: ' + error.message;
      }
    });
  }

  // ─── Envío del formulario ─────────────────────────────────────────────────

  /**
   * Maneja el envío del formulario.
   * Si es modo edición, actualiza; si es nuevo, crea.
   * Navega a la lista de turnos al completarse exitosamente.
   */
  guardar(): void {
    // Marcar todos los campos como tocados para mostrar errores
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.enviando = true;
    this.mensajeError = '';

    const turnoData: Turno = this.formulario.value;

    if (this.modoEdicion && this.turnoId) {
      // ── Modo edición: actualizar turno existente
      this.turnoService.actualizarTurno(this.turnoId, turnoData).subscribe({
        next: () => {
          this.enviando = false;
          this.router.navigate(['/turnos'],
            { queryParams: { exito: 'Turno actualizado correctamente.' } });
        },
        error: (error) => {
          this.mensajeError = error.message;
          this.enviando = false;
        }
      });

    } else {
      // ── Modo creación: crear nuevo turno
      this.turnoService.crearTurno(turnoData).subscribe({
        next: () => {
          this.enviando = false;
          this.router.navigate(['/turnos'],
            { queryParams: { exito: 'Turno creado exitosamente.' } });
        },
        error: (error) => {
          this.mensajeError = error.message;
          this.enviando = false;
        }
      });
    }
  }

  // ─── Utilidades de validación ─────────────────────────────────────────────

  /**
   * Verifica si un campo del formulario es inválido y ha sido tocado.
   * Se usa en el template para mostrar mensajes de error.
   *
   * @param campo nombre del campo del formulario
   * @returns true si el campo es inválido y fue tocado
   */
  campoInvalido(campo: string): boolean {
    const control = this.formulario.get(campo);
    return !!(control && control.invalid && control.touched);
  }

  /**
   * Navega de regreso a la lista de turnos sin guardar cambios.
   */
  cancelar(): void {
    this.router.navigate(['/turnos']);
  }
}
