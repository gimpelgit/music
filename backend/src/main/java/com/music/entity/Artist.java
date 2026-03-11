package com.music.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import java.util.ArrayList;
import java.util.List;

import com.music.dto.response.ArtistDto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;


@Entity
@Table(name = "artists")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Artist {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(unique = true, nullable = false, length = 100)
  private String name;

  @ManyToMany(mappedBy = "artists")
  @OnDelete(action = OnDeleteAction.CASCADE)
  private List<Track> tracks = new ArrayList<>();

  public Artist(String name) {
    this.name = name;
  }

  public static ArtistDto convertToDto(Artist artist) {
    return new ArtistDto(
      artist.getId(),
      artist.getName()
    );
  }
}