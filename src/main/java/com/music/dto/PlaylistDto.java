package com.music.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlaylistDto {
  private Long id;

  @NotBlank(message = "Название плейлиста обязательно")
  @Size(max = 200, message = "Название плейлиста не должно превышать 200 символов")
  private String name;

  @JsonProperty(access = JsonProperty.Access.READ_ONLY)
  private Long userId;

  @JsonProperty(access = JsonProperty.Access.READ_ONLY)
  private String userName;

  private Boolean isPublic = false;

  @Size(max = 255, message = "URL обложки не должен превышать 255 символов")
  private String coverImageUrl;

  private List<TrackDto> tracks;
}