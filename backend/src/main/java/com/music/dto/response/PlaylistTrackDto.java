package com.music.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
public class PlaylistTrackDto {
  private Long id;
  private String title;
  private Long albumId;
  private String albumTitle;
  private Integer durationSeconds;
  private String fileUrl;
  private String lyrics;
  private LocalDate releaseDate;
  private List<ArtistDto> artists;
  private List<GenreDto> genres;
  private Integer position;
}