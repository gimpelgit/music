package com.music.dto;

import java.time.LocalDate;
import java.util.List;

public class TrackDto {
  private Long id;
  private String title;
  private Long albumId;
  private String albumTitle;
  private Integer durationSeconds;
  private String fileUrl;
  private String lyrics;
  private LocalDate releaseDate;
  private List<ArtistDto> artists;
  private List<GenreDto> genres;

  public TrackDto() {}

  public TrackDto(Long id, String title, Long albumId, String albumTitle,
      Integer durationSeconds, String fileUrl, String lyrics,
      LocalDate releaseDate, List<ArtistDto> artists, List<GenreDto> genres) {
    this.id = id;
    this.title = title;
    this.albumId = albumId;
    this.albumTitle = albumTitle;
    this.durationSeconds = durationSeconds;
    this.fileUrl = fileUrl;
    this.lyrics = lyrics;
    this.releaseDate = releaseDate;
    this.artists = artists;
    this.genres = genres;
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

  public Long getAlbumId() {
    return albumId;
  }

  public void setAlbumId(Long albumId) {
    this.albumId = albumId;
  }

  public String getAlbumTitle() {
    return albumTitle;
  }

  public void setAlbumTitle(String albumTitle) {
    this.albumTitle = albumTitle;
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

  public List<ArtistDto> getArtists() {
    return artists;
  }

  public void setArtists(List<ArtistDto> artists) {
    this.artists = artists;
  }

  public List<GenreDto> getGenres() {
    return genres;
  }

  public void setGenres(List<GenreDto> genres) {
    this.genres = genres;
  }
}