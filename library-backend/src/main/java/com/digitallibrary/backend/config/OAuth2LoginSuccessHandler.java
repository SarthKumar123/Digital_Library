package com.digitallibrary.backend.config;

import com.digitallibrary.backend.entity.User;
import com.digitallibrary.backend.repository.UserRepository;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Component
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;

    @Value("${FRONTEND_URL:http://localhost:5173}")
    private String frontendUrl;

    @Autowired
    public OAuth2LoginSuccessHandler(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication) throws IOException {

        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();

        String email = oauth2User.getAttribute("email");
        String name = oauth2User.getAttribute("name");

        User user = userRepository.findByEmail(email).orElseGet(() -> {

            User newUser = new User();

            newUser.setEmail(email);
            newUser.setName(name);
            newUser.setGoogleAccount(true);
            newUser.setPassword(null);
            newUser.setRole("USER");

            return userRepository.save(newUser);
        });

        String redirectUrl = String.format(
                "%s/?oauthUserId=%s&oauthName=%s&oauthEmail=%s&oauthRole=%s",
                frontendUrl,
                user.getId(),
                URLEncoder.encode(user.getName(), StandardCharsets.UTF_8),
                URLEncoder.encode(user.getEmail(), StandardCharsets.UTF_8),
                URLEncoder.encode(user.getRole(), StandardCharsets.UTF_8)
        );

        response.sendRedirect(redirectUrl);
    }
}