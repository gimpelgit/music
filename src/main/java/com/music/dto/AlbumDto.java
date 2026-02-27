package com.music.dto;

public class AlbumDto {
  private Long id;
  private String title;
  private String coverImageUrl;

  public AlbumDto() {}

  public AlbumDto(Long id, String title, String coverImageUrl) {
    this.id = id;
    this.title = title;
    this.coverImageUrl = coverImageUrl;
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
}