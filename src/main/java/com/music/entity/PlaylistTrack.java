package com.music.entity;

import jakarta.persistence.*;
import java.util.Objects;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "playlists_tracks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PlaylistTrack {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "playlist_id", nullable = false)
  private Playlist playlist;

  @ManyToOne
  @JoinColumn(name = "track_id", nullable = false)
  private Track track;

  @Column(name = "position", nullable = false)
  private Integer position;

  public PlaylistTrack(Playlist playlist, Track track, Integer position) {
    this.playlist = playlist;
    this.track = track;
    this.position = position;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o)
      return true;
    if (o == null || getClass() != o.getClass())
      return false;
    PlaylistTrack that = (PlaylistTrack) o;
    return Objects.equals(id, that.id);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id);
  }
}