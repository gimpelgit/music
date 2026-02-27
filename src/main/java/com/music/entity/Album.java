package com.music.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

import com.music.dto.AlbumDto;

@Entity
@Table(name = "albums")
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

  public Album() {
  }

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

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public String getCoverImageUrl() {
    return coverImageUrl;
  }

  public void setCoverImageUrl(String coverImageUrl) {
    this.coverImageUrl = coverImageUrl;
  }

  public List<Track> getTracks() {
    return tracks;
  }

  public void setTracks(List<Track> tracks) {
    this.tracks = tracks;
  }
}