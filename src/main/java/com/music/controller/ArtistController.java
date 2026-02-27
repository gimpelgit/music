package com.music.controller;

import com.music.dto.ArtistDto;
import com.music.service.ArtistService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/artists")
public class ArtistController {

  private final ArtistService artistService;

  public ArtistController(ArtistService artistService) {
    this.artistService = artistService;
  }

  @GetMapping
  public ResponseEntity<List<ArtistDto>> getAllArtists() {
    List<ArtistDto> artists = artistService.getAllArtists();
    return new ResponseEntity<>(artists, HttpStatus.OK);
  }

  @GetMapping("/{id}")
  public ResponseEntity<ArtistDto> getArtistById(@PathVariable Long id) {
    return artistService.getArtistById(id)
      .map(artist -> new ResponseEntity<>(artist, HttpStatus.OK))
      .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
  }
}