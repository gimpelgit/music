package com.music.controller;

import com.music.dto.SuccessResponse;
import com.music.dto.auth.JwtAuthenticationResponse;
import com.music.dto.auth.LoginRequest;
import com.music.dto.auth.RegisterRequest;
import com.music.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

  private final AuthService authService;

  @PostMapping("/register")
  public JwtAuthenticationResponse register(@Valid @RequestBody RegisterRequest request) {
    return authService.register(request);
  }

  @PostMapping("/login")
  public JwtAuthenticationResponse login(@Valid @RequestBody LoginRequest request) {
    return authService.login(request);
  }

  @PostMapping("/logout")
  public ResponseEntity<SuccessResponse> logout() {
    authService.logout();
    return new ResponseEntity<>(new SuccessResponse("Выход успешен"), HttpStatus.OK);
  }
}