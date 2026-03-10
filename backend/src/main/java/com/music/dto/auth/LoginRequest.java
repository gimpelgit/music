package com.music.dto.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {

  @NotBlank(message = "Логин не может быть пустым")
  @Size(max = 30, message="Длина логина не может быть больше 30 символов")
  private String username;

  @NotBlank(message = "Пароль не может быть пустым")
  @Size(min = 6, message = "Длина пароля должна быть хотя бы 6 символов")  
  private String password;
}