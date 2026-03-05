package com.music.dto.response;

import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ArtistDto {
  private Long id;

  @NotBlank(message = "Имя исполнителя обязательно")
  @Size(max = 100, message = "Имя исполнителя не должно превышать 100 символов")
  private String name;
}