package com.music.dto.request;

import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateAlbumRequest {

  @Size(max = 200, message = "Название альбома не должно превышать 200 символов")
  private String title;

  private MultipartFile coverImage;
}