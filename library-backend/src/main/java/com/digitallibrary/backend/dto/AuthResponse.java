package com.digitallibrary.backend.dto;

/**
 * What we send BACK to the frontend after a successful signup or
 * login. Notice: no password field at all -- we control exactly
 * what leaves the server, so there's no risk of accidentally
 * leaking a password hash back to the browser.
 */
public class AuthResponse {

    private Long id;
    private String name;
    private String email;
    private String role;

    public AuthResponse(Long id, String name, String email, String role) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }
}