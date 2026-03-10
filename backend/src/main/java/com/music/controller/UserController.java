package com.music.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.music.dto.request.AdminCreateUserRequest;
import com.music.dto.request.UpdateUserRequest;
import com.music.dto.response.SuccessResponse;
import com.music.dto.response.UserDto;
import com.music.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
public class UserController {

  private UserService userService;

  public UserController(UserService userService) {
    this.userService = userService;
  }

  @GetMapping
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<List<UserDto>> getAllUsers() {
    List<UserDto> users = userService.getAllUsers();
    return new ResponseEntity<>(users, HttpStatus.OK);
  }

  @GetMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN') or authentication.principal.id == #id")
  public ResponseEntity<UserDto> getUserById(@PathVariable Long id) {
    return userService.getUserById(id)
      .map(user -> new ResponseEntity<>(user, HttpStatus.OK))
      .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
  }

  @PostMapping
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<UserDto> createUser(@Valid @RequestBody AdminCreateUserRequest request) {
    UserDto createdUser = userService.createByAdmin(request);
    return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
  }

  @PutMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN') or authentication.principal.id == #id")
  public ResponseEntity<UserDto> updateUser(@PathVariable Long id, @Valid @RequestBody UpdateUserRequest request) {
    if (request.getRole() != null && !userService.isAdmin()) {
      return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }
    UserDto updatedUser = userService.updateUser(id, request);
    return new ResponseEntity<>(updatedUser, HttpStatus.OK);
  }

  @DeleteMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN') or authentication.principal.id == #id")
  public ResponseEntity<SuccessResponse> deleteUser(@PathVariable Long id) {
    userService.deleteUser(id);
    return new ResponseEntity<>(
      new SuccessResponse("Пользователь успешно удален"),
      HttpStatus.OK
    );
  }
}