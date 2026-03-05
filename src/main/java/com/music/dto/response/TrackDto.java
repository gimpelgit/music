package com.music.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
public class TrackDto {
  private Long id;

  @NotBlank(message = "Название трека обязательно")
  @Size(max = 200, message = "Название трека не должно превышать 200 символов")
  private String title;

  private Long albumId;
  private String albumTitle;

  @NotNull(message = "Длительность трека обязательна")
  @Min(value = 1, message = "Длительность трека должна быть положительным числом")
  private Integer durationSeconds;

  @NotBlank(message = "URL файла трека обязателен")
  @Size(max = 255, message = "URL файла не должен превышать 255 символов")
  private String fileUrl;

  @Size(max = 5000, message = "Текст песни не должен превышать 5000 символов")
  private String lyrics;

  private LocalDate releaseDate;

  @NotNull(message = "Список исполнителей обязателен")
  @Size(min = 1, message = "Должен быть хотя бы один исполнитель")
  private List<Long> artistIds;

  @NotNull(message = "Список жанров обязателен")
  @Size(min = 1, message = "Должен быть хотя бы один жанр")
  private List<Long> genreIds;

  @JsonProperty(access = JsonProperty.Access.READ_ONLY)
  private List<ArtistDto> artists;

  @JsonProperty(access = JsonProperty.Access.READ_ONLY)
  private List<GenreDto> genres;
}