package com.music.dto.response;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GenreDto {
  private Long id;

  @NotBlank(message = "Название жанра обязательно")
  @Size(max = 50, message = "Название жанра не должно превышать 50 символов")
  private String name;
}