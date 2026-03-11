package com.music.entity;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import com.music.dto.response.PlaylistDto;
import com.music.dto.response.PlaylistTrackDto;

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

  @OneToMany(mappedBy = "playlist", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
  @OrderBy("position")
  private List<PlaylistTrack> playlistTracks = new ArrayList<>();

  public Playlist(String name, User user, Boolean isPublic, String coverImageUrl) {
    this.name = name;
    this.user = user;
    this.isPublic = isPublic;
    this.coverImageUrl = coverImageUrl;
  }

  public static PlaylistDto convertToDto(Playlist playlist) {
    if (playlist == null) {
        return null;
    }

    List<PlaylistTrackDto> trackDtos = new ArrayList<>();
    if (playlist.getPlaylistTracks() != null) {
      trackDtos = playlist.getPlaylistTracks().stream()
        .filter(Objects::nonNull)
        .map(pt -> {
          Track track = pt.getTrack();
          if (track == null) return null;
          
          return PlaylistTrackDto.builder()
            .id(track.getId())
            .title(track.getTitle())
            .albumId(track.getAlbum() != null ? track.getAlbum().getId() : null)
            .albumTitle(track.getAlbum() != null ? track.getAlbum().getTitle() : null)
            .durationSeconds(track.getDurationSeconds())
            .fileUrl(track.getFileUrl())
            .lyrics(track.getLyrics())
            .releaseDate(track.getReleaseDate())
            .artists(track.getArtists().stream()
                .map(Artist::convertToDto)
                .toList())
            .genres(track.getGenres().stream()
                .map(Genre::convertToDto)
                .toList())
            .position(pt.getPosition())
            .build();
        })
        .filter(Objects::nonNull)
        .collect(Collectors.toList());
    }

    return new PlaylistDto(
      playlist.getId(),
      playlist.getName(),
      playlist.getUser() != null ? playlist.getUser().getId() : null,
      playlist.getUser() != null ? playlist.getUser().getName() : null,
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