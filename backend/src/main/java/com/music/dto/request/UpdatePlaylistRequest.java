package com.music.dto.request;

import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdatePlaylistRequest {

  @Size(max = 200, message = "Название плейлиста не должно превышать 200 символов")
  private String name;

  private Boolean isPublic;

  private MultipartFile coverImage;

  private List<Long> trackIds;
}