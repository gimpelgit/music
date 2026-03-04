package com.music.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
  private Long id;
  private String email;
  private String fullName;
  private String role;
  private LocalDateTime createdAt;
}