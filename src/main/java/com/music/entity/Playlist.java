package com.music.entity;

import java.util.ArrayList;
import java.util.List;

import com.music.dto.PlaylistDto;
import com.music.dto.TrackDto;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;

@Entity
@Table(name = "playlists")
public class Playlist {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, length = 200)
  private String name;

  @ManyToOne
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  @Column(name = "is_public")
  private Boolean isPublic = false;

  @Column(name = "cover_image_url", length = 255)
  private String coverImageUrl;

  @OneToMany(mappedBy = "playlist")
  @OrderBy("position")
  private List<PlaylistTrack> playlistTracks = new ArrayList<>();

  public Playlist() {}

  public Playlist(String name, User user, Boolean isPublic, String coverImageUrl) {
    this.name = name;
    this.user = user;
    this.isPublic = isPublic;
    this.coverImageUrl = coverImageUrl;
  }

  public static PlaylistDto convertToDto(Playlist playlist) {
    List<TrackDto> trackDtos = playlist.getTracks().stream()
      .map(Track::convertToDto)
      .toList();

    return new PlaylistDto(
      playlist.getId(),
      playlist.getName(),
      playlist.getUser().getId(),
      playlist.getUser().getFullName(),
      playlist.getIsPublic(),
      playlist.getCoverImageUrl(),
      trackDtos
    );
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

  public User getUser() {
    return user;
  }

  public void setUser(User user) {
    this.user = user;
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

  public List<Track> getTracks() {
    return playlistTracks.stream()
      .map(PlaylistTrack::getTrack)
      .toList();
  }
}