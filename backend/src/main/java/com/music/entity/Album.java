package com.music.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

import com.music.dto.response.AlbumDto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "albums")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Album {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, length = 200)
  private String title;

  @Column(name = "cover_image_url", length = 255)
  private String coverImageUrl;

  @OneToMany(mappedBy = "album")
  private List<Track> tracks = new ArrayList<>();

  public Album(String title, String coverImageUrl) {
    this.title = title;
    this.coverImageUrl = coverImageUrl;
  }

  public static AlbumDto convertToDto(Album album) {
    return new AlbumDto(
      album.getId(),
      album.getTitle(),
      album.getCoverImageUrl()
    );
  }
}