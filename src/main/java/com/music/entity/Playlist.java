package com.music.entity;

import java.util.ArrayList;
import java.util.List;

import com.music.dto.PlaylistDto;
import com.music.dto.TrackDto;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "playlists")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
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
      playlist.getUser().getName(),
      playlist.getIsPublic(),
      playlist.getCoverImageUrl(),
      trackDtos
    );
  }

  public List<Track> getTracks() {
    return playlistTracks.stream()
      .map(PlaylistTrack::getTrack)
      .toList();
  }
}