package com.music.controller;

import com.music.dto.GenreDto;
import com.music.dto.SuccessResponse;
import com.music.service.GenreService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/genres")
public class GenreController {

  private final GenreService genreService;

  public GenreController(GenreService genreService) {
    this.genreService = genreService;
  }

  @GetMapping
  public ResponseEntity<List<GenreDto>> getAllGenres() {
    List<GenreDto> genres = genreService.getAllGenres();
    return new ResponseEntity<>(genres, HttpStatus.OK);
  }

  @GetMapping("/{id}")
  public ResponseEntity<GenreDto> getGenreById(@PathVariable Long id) {
    return genreService.getGenreById(id)
      .map(genre -> new ResponseEntity<>(genre, HttpStatus.OK))
      .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
  }

  @PostMapping
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<GenreDto> createGenre(@Valid @RequestBody GenreDto genreDto) {
    GenreDto createdGenre = genreService.createGenre(genreDto);
    return new ResponseEntity<>(createdGenre, HttpStatus.CREATED);
  }

  @PutMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<GenreDto> updateGenre(@PathVariable Long id, @Valid @RequestBody GenreDto genreDto) {
    GenreDto updatedGenre = genreService.updateGenre(id, genreDto);
    return new ResponseEntity<>(updatedGenre, HttpStatus.OK);
  }

  @DeleteMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<SuccessResponse> deleteGenre(@PathVariable Long id) {
    genreService.deleteGenre(id);
    return new ResponseEntity<>(
      new SuccessResponse("Жанр успешно удален"),
      HttpStatus.OK
    );
  }
}