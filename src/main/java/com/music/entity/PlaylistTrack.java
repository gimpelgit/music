package com.music.entity;

import jakarta.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "playlists_tracks")
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

  public PlaylistTrack() {
  }

  public PlaylistTrack(Playlist playlist, Track track, Integer position) {
    this.playlist = playlist;
    this.track = track;
    this.position = position;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Playlist getPlaylist() {
    return playlist;
  }

  public void setPlaylist(Playlist playlist) {
    this.playlist = playlist;
  }

  public Track getTrack() {
    return track;
  }

  public void setTrack(Track track) {
    this.track = track;
  }

  public Integer getPosition() {
    return position;
  }

  public void setPosition(Integer position) {
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