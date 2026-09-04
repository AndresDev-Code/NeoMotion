package com.neomotion.service;

import com.neomotion.auth.dto.RegisterRequestDTO;
import com.neomotion.dto.UserRequestDTO;
import com.neomotion.dto.UserResponseDTO;

import java.util.List;
import java.util.Optional;

public interface UserService {

    UserResponseDTO save(UserRequestDTO request);

    UserResponseDTO register(RegisterRequestDTO request);

    List<UserResponseDTO> findAll();

    Optional<UserResponseDTO> findById(Long id);

    Optional<UserResponseDTO> findByUsername(String username);

    Optional<UserResponseDTO> findByEmail(String email);

    UserResponseDTO update(Long id, UserRequestDTO request);

    void deleteById(Long id);
}