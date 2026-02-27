package com.music.dto;

import java.util.List;

public class PlaylistDto {
  private Long id;
  private String name;
  private Long userId;
  private String userName;
  private Boolean isPublic;
  private String coverImageUrl;
  private List<TrackDto> tracks;

  public PlaylistDto() {}

  public PlaylistDto(Long id, String name, Long userId, String userName,
      Boolean isPublic, String coverImageUrl, List<TrackDto> tracks) {
    this.id = id;
    this.name = name;
    this.userId = userId;
    this.userName = userName;
    this.isPublic = isPublic;
    this.coverImageUrl = coverImageUrl;
    this.tracks = tracks;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public Long getUserId() {
    return userId;
  }

  public void setUserId(Long userId) {
    this.userId = userId;
  }

  public String getUserName() {
    return userName;
  }

  public void setUserName(String userName) {
    this.userName = userName;
  }

  public Boolean getIsPublic() {
    return isPublic;
  }

  public void setIsPublic(Boolean isPublic) {
    this.isPublic = isPublic;
  }

  public String getCoverImageUrl() {
    return coverImageUrl;
  }

  public void setCoverImageUrl(String coverImageUrl) {
    this.coverImageUrl = coverImageUrl;
  }

  public List<TrackDto> getTracks() {
    return tracks;
  }

  public void setTracks(List<TrackDto> tracks) {
    this.tracks = tracks;
  }
}