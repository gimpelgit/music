package com.music.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreatePlaylistRequest {

  @NotBlank(message = "Название плейлиста обязательно")
  @Size(max = 200, message = "Название плейлиста не должно превышать 200 символов")
  private String name;

  private Boolean isPublic = false;

  @Size(max = 255, message = "URL обложки не должен превышать 255 символов")
  private String coverImageUrl;

  private List<Long> trackIds;
}