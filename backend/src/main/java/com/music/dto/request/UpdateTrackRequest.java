package com.music.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.annotation.JsonProperty;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateTrackRequest {

  @Size(max = 200, message = "Название трека не должно превышать 200 символов")
  private String title;

  private Long albumId;

  @Min(value = 1, message = "Длительность трека должна быть положительным числом")
  private Integer durationSeconds;

  private MultipartFile audioFile;

  @Size(max = 5000, message = "Текст песни не должен превышать 5000 символов")
  private String lyrics;

  private LocalDate releaseDate;

  private List<Long> artistIds;

  private List<Long> genreIds;

  @JsonProperty("clearReleaseDate")
  private boolean clearReleaseDate = false;
  
  @JsonProperty("clearLyrics")
  private boolean clearLyrics = false;
  
  @JsonProperty("clearAlbumId")
  private boolean clearAlbumId = false;
}