package com.music.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
  private Long id;
  private String username;
  private String name;
  private String role;
  private LocalDateTime createdAt;
}