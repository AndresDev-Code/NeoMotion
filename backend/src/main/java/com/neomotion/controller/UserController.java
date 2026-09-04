package com.neomotion.controller;

import com.neomotion.dto.UserRequestDTO;
import com.neomotion.dto.UserResponseDTO;
import com.neomotion.exception.ResourceNotFoundException;
import com.neomotion.service.UserService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public List<UserResponseDTO> findAll() {
        return userService.findAll();
    }

    @PostMapping
    public UserResponseDTO save(
            @Valid @RequestBody UserRequestDTO request) {

        return userService.save(request);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public UserResponseDTO findById(@PathVariable Long id) {

        return userService.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Usuario no encontrado."
                        ));
    }

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public UserResponseDTO getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String username =
                authentication.getName();

        return userService.findByUsername(username)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Usuario no encontrado."
                        ));
    }

    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public UserResponseDTO update(
            @PathVariable Long id,
            @Valid @RequestBody UserRequestDTO request) {

        return userService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public void deleteById(@PathVariable Long id) {
        userService.deleteById(id);
    }

    @GetMapping("/username/{username}")
    @PreAuthorize("isAuthenticated()")
    public UserResponseDTO getUserByUsername(
            @PathVariable String username) {

        return userService.findByUsername(username)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Usuario no encontrado."
                        ));
    }

    @GetMapping("/email/{email}")
    @PreAuthorize("isAuthenticated()")
    public UserResponseDTO getUserByEmail(
            @PathVariable String email) {

        return userService.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Usuario no encontrado."
                        ));
    }
}