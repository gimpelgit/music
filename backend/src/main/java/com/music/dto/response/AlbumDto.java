package com.music.dto.response;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AlbumDto {
  private Long id;

  @NotBlank(message = "Название альбома обязательно")
  @Size(max = 200, message = "Название альбома не должно превышать 200 символов")
  private String title;

  @Size(max = 255, message = "URL обложки не должен превышать 255 символов")
  private String coverImageUrl;
}