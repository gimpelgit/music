package com.music.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

import com.music.dto.ArtistDto;

@Entity
@Table(name = "artists")
public class Artist {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "full_name", nullable = false, length = 100)
  private String fullName;

  @ManyToMany(mappedBy = "artists")
  private List<Track> tracks = new ArrayList<>();

  public Artist() {
  }

  public Artist(String fullName) {
    this.fullName = fullName;
  }

  public static ArtistDto convertToDto(Artist artist) {
    return new ArtistDto(
      artist.getId(),
      artist.getFullName()
    );
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getFullName() {
    return fullName;
  }

  public void setFullName(String fullName) {
    this.fullName = fullName;
  }

  public List<Track> getTracks() {
    return tracks;
  }

  public void setTracks(List<Track> tracks) {
    this.tracks = tracks;
  }
}