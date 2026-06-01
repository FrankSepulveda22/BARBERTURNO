package com.barberturno.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Configuración global de CORS (Cross-Origin Resource Sharing) para BarberTurno.
 * Permite que el frontend Angular (puerto 4200) y la app móvil consuman la API.
 *
 * @author BarberTurno Team
 * @version 1.0
 */
@Configuration
public class WebConfig {

    /**
     * Define la política CORS para todos los endpoints de la API.
     * Permite peticiones desde los orígenes del frontend web y móvil.
     *
     * @return configurador de CORS personalizado
     */
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        // Orígenes permitidos: Angular local y entorno de producción
                        .allowedOrigins(
                            "http://localhost:4200",  // Angular dev server
                            "http://localhost:3000",  // Posible app móvil (Ionic/Capacitor)
                            "https://barberturno.app" // Producción
                        )
                        // Métodos HTTP permitidos
                        .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                        // Cabeceras permitidas en las solicitudes
                        .allowedHeaders("*")
                        // Permite el envío de cookies/credenciales
                        .allowCredentials(true)
                        // Tiempo de caché del preflight (en segundos)
                        .maxAge(3600);
            }
        };
    }
}
