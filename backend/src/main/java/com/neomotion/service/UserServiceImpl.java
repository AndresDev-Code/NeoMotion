package com.neomotion.service;

import com.neomotion.dto.UserRequestDTO;
import com.neomotion.dto.UserResponseDTO;
import com.neomotion.entity.Role;
import com.neomotion.entity.User;
import com.neomotion.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.neomotion.exception.ResourceConflictException;
import com.neomotion.exception.ResourceNotFoundException;
import com.neomotion.auth.dto.RegisterRequestDTO;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserResponseDTO save(UserRequestDTO request) {

        if (userRepository.existsByUsername(request.getUsername())) {

            throw new ResourceConflictException(
                    "El nombre de usuario ya existe."
            );
        }

        if (userRepository.existsByEmail(request.getEmail())) {

            throw new ResourceConflictException(
                    "El correo ya existe."
            );
        }

        User user = new User();

        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEnabled(true);
        user.setRole(Role.USER);

        User savedUser = userRepository.save(user);

        return toResponseDTO(savedUser);
    }

    @Override
    public UserResponseDTO update(
            Long id,
            UserRequestDTO request) {

        User existingUser = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Usuario no encontrado."
                        ));

        if (userRepository.existsByUsername(request.getUsername())
                && !existingUser.getUsername().equals(request.getUsername())) {

            throw new ResourceConflictException(
                    "El nombre de usuario ya existe."
            );
        }

        if (userRepository.existsByEmail(request.getEmail())
                && !existingUser.getEmail().equals(request.getEmail())) {

            throw new ResourceConflictException(
                    "El correo ya existe."
            );
        }

        existingUser.setUsername(request.getUsername());
        existingUser.setEmail(request.getEmail());
        existingUser.setFirstName(request.getFirstName());
        existingUser.setLastName(request.getLastName());

        if (request.getPassword() != null
                && !request.getPassword().isBlank()) {

            existingUser.setPassword(
                    passwordEncoder.encode(request.getPassword())
            );
        }

        User updatedUser = userRepository.save(existingUser);

        return toResponseDTO(updatedUser);
    }
    @Override
    public List<UserResponseDTO> findAll() {

        return userRepository.findAll()
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Override
    public Optional<UserResponseDTO> findById(Long id) {

        return userRepository.findById(id)
                .map(this::toResponseDTO);
    }

    @Override
    public Optional<UserResponseDTO> findByUsername(String username) {

        return userRepository.findByUsername(username)
                .map(this::toResponseDTO);
    }

    @Override
    public Optional<UserResponseDTO> findByEmail(String email) {

        return userRepository.findByEmail(email)
                .map(this::toResponseDTO);
    }

    @Override
    public void deleteById(Long id) {

        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("Usuario no encontrado");
        }

        userRepository.deleteById(id);
    }

    private final PasswordEncoder passwordEncoder;

    private UserResponseDTO toResponseDTO(User user) {

        UserResponseDTO response = new UserResponseDTO();

        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setEnabled(user.getEnabled());
        response.setRole(user.getRole().name());

        return response;
    }

    @Override
    public UserResponseDTO register(RegisterRequestDTO request) {

        if (userRepository.existsByUsername(request.getUsername())) {

            throw new ResourceConflictException(
                    "El nombre de usuario ya existe."
            );
        }

        if (userRepository.existsByEmail(request.getEmail())) {

            throw new ResourceConflictException(
                    "El correo ya existe."
            );
        }

        User user = new User();

        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());

        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());

        user.setEnabled(true);

        // Un registro público siempre crea un USER.
        user.setRole(Role.USER);

        User savedUser = userRepository.save(user);

        return toResponseDTO(savedUser);
    }

}