package com.music.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateTrackPositionRequest {

  @NotNull(message = "Новая позиция обязательна")
  @Min(value = 0, message = "Позиция должна быть неотрицательным числом")
  private Integer position;
}