package com.music.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

import com.music.dto.GenreDto;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "genres")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Genre {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(unique = true, nullable = false, length = 50)
  private String name;

  @ManyToMany(mappedBy = "genres")
  private List<Track> tracks = new ArrayList<>();

  public Genre(String name) {
    this.name = name;
  }

  public static GenreDto convertToDto(Genre genre) {
    return new GenreDto(
      genre.getId(),
      genre.getName()
    );
  }
}