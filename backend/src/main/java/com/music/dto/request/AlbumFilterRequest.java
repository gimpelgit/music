package com.music.dto.request;

import jakarta.validation.constraints.Min;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AlbumFilterRequest {

  private List<Long> genreIds;

  private List<Long> artistIds;

  @Min(value = 1, message = "Номер страницы должен быть неотрицательным")
  private int page = 1;

  @Min(value = 1, message = "Размер страницы должен быть больше 0")
  private int size = 10;
}