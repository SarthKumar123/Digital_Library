package com.digitallibrary.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Tells Spring's built-in web layer: "requests coming from
 * http://localhost:5173 (our React dev server) are allowed to call
 * these APIs, using these HTTP methods, even though the browser sees
 * it as a different origin."
 *
 * Without this, every fetch() call from React would fail in the
 * browser console with a CORS error, even though Postman (which
 * doesn't enforce CORS -- that's a BROWSER security feature, not a
 * server one) worked fine.
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins(
                		"http://localhost:5173",
                		"http://localhost:5175"
                		)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}