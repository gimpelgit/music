package com.music.controller;

import com.music.dto.GenreDto;
import com.music.service.GenreService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
}