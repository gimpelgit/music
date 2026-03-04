package com.music.service;

import com.music.dto.UpdateUserRequest;
import com.music.dto.UserDto;
import com.music.dto.auth.RegisterRequest;
import com.music.entity.User;
import com.music.enumeration.Role;
import com.music.exception.UserAlreadyExistsException;
import com.music.exception.UserNotFoundException;
import com.music.repository.UserRepository;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  public UserService(
    UserRepository userRepository,
    PasswordEncoder passwordEncoder
  ) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
  }

  public List<UserDto> getAllUsers() {
    return userRepository.findAll()
      .stream()
      .map(User::convertToDto)
      .toList();
  }

  public Optional<UserDto> getUserById(Long id) {
    return userRepository.findById(id)
      .map(User::convertToDto);
  }

  public User save(User user) {
    return userRepository.save(user);
  }

  public User create(User user) {
    if (userRepository.existsByUsername(user.getUsername())) {
      throw new UserAlreadyExistsException(user.getUsername());
    }

    return save(user);
  }

  public UserDto create(RegisterRequest request) {
    User user = User.builder()
      .username(request.getUsername())
      .password(passwordEncoder.encode(request.getPassword()))
      .name(request.getName())
      .role(Role.ROLE_USER)
      .build();
    
    return User.convertToDto(create(user));
  }

  @Transactional
  public UserDto updateUser(Long id, UpdateUserRequest request) {
    User user = userRepository.findById(id)
      .orElseThrow(() -> new UserNotFoundException(id));

    if (request.getUsername() != null && !request.getUsername().isEmpty()) {
      Optional<User> existingUser = userRepository.findByUsername(request.getUsername());
      if (existingUser.isPresent() && !existingUser.get().getId().equals(id)) {
        throw new UserAlreadyExistsException(request.getUsername());
      }

      user.setUsername(request.getUsername());
    }
    
    if (request.getName() != null && !request.getName().isEmpty()) {
      user.setName(request.getName());
    }
    
    if (request.getPassword() != null && !request.getPassword().isEmpty()) {
      user.setPassword(passwordEncoder.encode(request.getPassword()));
    }

    User updatedUser = userRepository.save(user);
    return User.convertToDto(updatedUser);
  }

  @Transactional
  public void deleteUser(Long id) {
    if (!userRepository.existsById(id)) {
      throw new UserNotFoundException(id);
    }
    userRepository.deleteById(id);
  }

  public UserDetailsService userDetailsService() {
    return this::getByUsername;
  }

  public User getByUsername(String username) {
    return userRepository.findByUsername(username)
      .orElseThrow(() -> new UsernameNotFoundException("Пользователь не найден"));
  }

  public User getCurrentUser() {
    String username = SecurityContextHolder.getContext().getAuthentication().getName();
    return getByUsername(username);
  }

}