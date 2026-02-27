package com.music.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

import com.music.dto.GenreDto;

@Entity
@Table(name = "genres")
public class Genre {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(unique = true, nullable = false, length = 50)
  private String name;

  @ManyToMany(mappedBy = "genres")
  private List<Track> tracks = new ArrayList<>();

  public Genre() {
  }

  public Genre(String name) {
    this.name = name;
  }

  public static GenreDto convertToDto(Genre genre) {
    return new GenreDto(
      genre.getId(),
      genre.getName()
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

  public List<Track> getTracks() {
    return tracks;
  }

  public void setTracks(List<Track> tracks) {
    this.tracks = tracks;
  }
}