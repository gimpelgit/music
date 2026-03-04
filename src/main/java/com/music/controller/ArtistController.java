package com.music.controller;

import com.music.dto.ArtistDto;
import com.music.dto.SuccessResponse;
import com.music.service.ArtistService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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

  @PostMapping
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<ArtistDto> createArtist(@Valid @RequestBody ArtistDto artistDto) {
    ArtistDto createdArtist = artistService.createArtist(artistDto);
    return new ResponseEntity<>(createdArtist, HttpStatus.CREATED);
  }

  @PutMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<ArtistDto> updateArtist(@PathVariable Long id, @Valid @RequestBody ArtistDto artistDto) {
    ArtistDto updatedArtist = artistService.updateArtist(id, artistDto);
    return new ResponseEntity<>(updatedArtist, HttpStatus.OK);
  }

  @DeleteMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<SuccessResponse> deleteArtist(@PathVariable Long id) {
    artistService.deleteArtist(id);
    return new ResponseEntity<>(
      new SuccessResponse("Исполнитель успешно удален"),
      HttpStatus.OK
    );
  }
}