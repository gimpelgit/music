package com.music.dto;

import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserRequest {

  @Size(max = 30, message = "Длина username не может быть больше 30 символов")
  private String username;

  @Size(max = 30, message = "Длина имени не может быть больше 30 символов")
  private String name;

  @Size(min = 6, message = "Длина пароля должна быть хотя бы 6 символов")
  private String password; 
}