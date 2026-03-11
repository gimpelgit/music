package com.music.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateTrackRequest {

  @NotBlank(message = "Название трека обязательно")
  @Size(max = 200, message = "Название трека не должно превышать 200 символов")
  private String title;

  private Long albumId;

  @NotNull(message = "Длительность трека обязательна")
  @Min(value = 1, message = "Длительность трека должна быть положительным числом")
  private Integer durationSeconds;

  @NotNull(message = "Аудиофайл трека обязателен")
  private MultipartFile audioFile;

  @Size(max = 5000, message = "Текст песни не должен превышать 5000 символов")
  private String lyrics;

  private LocalDate releaseDate;

  @NotNull(message = "Список исполнителей обязателен")
  @Size(min = 1, message = "Должен быть хотя бы один исполнитель")
  private List<Long> artistIds;

  @NotNull(message = "Список жанров обязателен")
  @Size(min = 1, message = "Должен быть хотя бы один жанр")
  private List<Long> genreIds;
}