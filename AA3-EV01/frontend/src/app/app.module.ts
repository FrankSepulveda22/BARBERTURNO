import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { TurnoListaComponent } from './components/turno/turno-lista.component';
import { TurnoFormComponent } from './components/turno/turno-form.component';

/**
 * Definición de rutas de la aplicación BarberTurno.
 * Mapea las URLs a los componentes correspondientes.
 */
const routes: Routes = [
  // Ruta por defecto: redirige a la lista de turnos
  { path: '',            redirectTo: '/turnos', pathMatch: 'full' },

  // Lista de todos los turnos
  { path: 'turnos',             component: TurnoListaComponent },

  // Formulario para crear un nuevo turno
  { path: 'turnos/nuevo',       component: TurnoFormComponent },

  // Formulario para editar un turno existente (recibe el ID)
  { path: 'turnos/editar/:id',  component: TurnoFormComponent },

  // Ruta comodín: redirige al home si la URL no existe
  { path: '**',                 redirectTo: '/turnos' }
];

/**
 * Módulo raíz de la aplicación BarberTurno.
 * Importa los módulos necesarios y declara todos los componentes.
 *
 * @author BarberTurno Team
 * @version 1.0
 */
@NgModule({
  declarations: [
    AppComponent,        // Componente raíz con navbar
    TurnoListaComponent, // Lista de turnos
    TurnoFormComponent   // Formulario crear/editar turno
  ],
  imports: [
    BrowserModule,        // Módulo base del navegador
    HttpClientModule,     // Para peticiones HTTP a la API REST
    ReactiveFormsModule,  // Para Reactive Forms con validación
    FormsModule,          // Para ngModel en los filtros
    RouterModule.forRoot(routes) // Router con las rutas definidas
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
