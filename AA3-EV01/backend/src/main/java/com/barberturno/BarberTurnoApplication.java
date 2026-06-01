package com.barberturno;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Clase principal de la aplicación BarberTurno.
 * Inicia el contexto de Spring Boot con configuración automática.
 *
 * <p>BarberTurno es un sistema de gestión de turnos para barberías
 * que expone una API REST consumida por clientes web (Angular) y móvil.
 *
 * @author BarberTurno Team
 * @version 1.0
 */
@SpringBootApplication
public class BarberTurnoApplication {

    /**
     * Punto de entrada principal de la aplicación.
     *
     * @param args argumentos de línea de comandos
     */
    public static void main(String[] args) {
        SpringApplication.run(BarberTurnoApplication.class, args);
    }
}
