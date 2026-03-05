package com.music.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.music.dto.response.ArtistDto;
import com.music.dto.response.GenreDto;
import com.music.dto.response.TrackDto;

@Entity
@Table(name = "tracks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
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

    return TrackDto.builder()
      .id(track.getId())
      .title(track.getTitle())
      .albumId(track.getAlbum() != null ? track.getAlbum().getId() : null)
      .albumTitle(track.getAlbum() != null ? track.getAlbum().getTitle() : null)
      .durationSeconds(track.getDurationSeconds())
      .fileUrl(track.getFileUrl())
      .lyrics(track.getLyrics())
      .releaseDate(track.getReleaseDate())
      .artists(artistDtos)
      .genres(genreDtos)
      .build();
  }
}