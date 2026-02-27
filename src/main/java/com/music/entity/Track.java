package com.music.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.music.dto.ArtistDto;
import com.music.dto.GenreDto;
import com.music.dto.TrackDto;

@Entity
@Table(name = "tracks")
public class Track {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, length = 200)
  private String title;

  @ManyToOne
  @JoinColumn(name = "album_id")
  private Album album;

  @Column(name = "duration_seconds", nullable = false)
  private Integer durationSeconds;

  @Column(name = "file_url", nullable = false, length = 255)
  private String fileUrl;

  @Column(columnDefinition = "TEXT")
  private String lyrics;

  @Column(name = "release_date")
  private LocalDate releaseDate;

  @ManyToMany
  @JoinTable(
    name = "tracks_artists", 
    joinColumns = @JoinColumn(name = "track_id"), 
    inverseJoinColumns = @JoinColumn(name = "artist_id")
  )
  private List<Artist> artists = new ArrayList<>();

  @ManyToMany
  @JoinTable(
    name = "tracks_genres",
    joinColumns = @JoinColumn(name = "track_id"),
    inverseJoinColumns = @JoinColumn(name = "genre_id")
  )
  private List<Genre> genres = new ArrayList<>();

  @OneToMany(mappedBy = "track")
  private List<PlaylistTrack> playlistTracks = new ArrayList<>();

  @ManyToMany(mappedBy = "favoriteTracks")
  private List<User> favoritedBy = new ArrayList<>();

  public Track() {}

  public Track(String title, Album album, Integer durationSeconds,
               String fileUrl, String lyrics, LocalDate releaseDate) {
    this.title = title;
    this.album = album;
    this.durationSeconds = durationSeconds;
    this.fileUrl = fileUrl;
    this.lyrics = lyrics;
    this.releaseDate = releaseDate;
  }

  public static TrackDto convertToDto(Track track) {
    List<ArtistDto> artistDtos = track.getArtists().stream()
      .map(Artist::convertToDto)
      .toList();

    List<GenreDto> genreDtos = track.getGenres().stream()
      .map(Genre::convertToDto)
      .toList();

    String albumTitle = track.getAlbum() != null ? track.getAlbum().getTitle() : null;
    Long albumId = track.getAlbum() != null ? track.getAlbum().getId() : null;

    return new TrackDto(
      track.getId(),
      track.getTitle(),
      albumId,
      albumTitle,
      track.getDurationSeconds(),
      track.getFileUrl(),
      track.getLyrics(),
      track.getReleaseDate(),
      artistDtos,
      genreDtos
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

  public Album getAlbum() {
    return album;
  }

  public void setAlbum(Album album) {
    this.album = album;
  }

  public Integer getDurationSeconds() {
    return durationSeconds;
  }

  public void setDurationSeconds(Integer durationSeconds) {
    this.durationSeconds = durationSeconds;
  }

  public String getFileUrl() {
    return fileUrl;
  }

  public void setFileUrl(String fileUrl) {
    this.fileUrl = fileUrl;
  }

  public String getLyrics() {
    return lyrics;
  }

  public void setLyrics(String lyrics) {
    this.lyrics = lyrics;
  }

  public LocalDate getReleaseDate() {
    return releaseDate;
  }

  public void setReleaseDate(LocalDate releaseDate) {
    this.releaseDate = releaseDate;
  }

  public List<Artist> getArtists() {
    return artists;
  }

  public void setArtists(List<Artist> artists) {
    this.artists = artists;
  }

  public List<Genre> getGenres() {
    return genres;
  }

  public void setGenres(List<Genre> genres) {
    this.genres = genres;
  }

  public List<PlaylistTrack> getPlaylistTracks() {
    return playlistTracks;
  }

  public void setPlaylistTracks(List<PlaylistTrack> playlistTracks) {
    this.playlistTracks = playlistTracks;
  }

  public List<User> getFavoritedBy() {
    return favoritedBy;
  }

  public void setFavoritedBy(List<User> favoritedBy) {
    this.favoritedBy = favoritedBy;
  }
}