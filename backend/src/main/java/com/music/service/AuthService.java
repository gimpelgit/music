package com.music.service;

import com.music.dto.auth.JwtAuthenticationResponse;
import com.music.dto.auth.LoginRequest;
import com.music.dto.auth.RegisterRequest;
import com.music.dto.response.UserDto;
import com.music.entity.User;
import com.music.enumeration.Role;
import lombok.RequiredArgsConstructor;


import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

  private final UserService userService;
  private final JwtService jwtService;
  private final PasswordEncoder passwordEncoder;
  private final AuthenticationManager authenticationManager;

  @Transactional
  public JwtAuthenticationResponse register(RegisterRequest request) {
    User user = User.builder()
      .username(request.getUsername())
      .password(passwordEncoder.encode(request.getPassword()))
      .name(request.getName())
      .role(Role.ROLE_USER)
      .build();
    
    user = userService.create(user);

    String jwt = jwtService.generateToken(user);
    return new JwtAuthenticationResponse(jwt);
  }

  public JwtAuthenticationResponse login(LoginRequest request) {
    authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
      request.getUsername(), 
      request.getPassword()
    ));
    
    var user = userService
      .userDetailsService()
      .loadUserByUsername(request.getUsername());
    
    String jwt = jwtService.generateToken(user);
    return new JwtAuthenticationResponse(jwt);
  }

  public void logout() {
    SecurityContextHolder.clearContext();
  }

  public UserDto getCurrentUser() {
    return User.convertToDto(userService.getCurrentUser());
  }
}