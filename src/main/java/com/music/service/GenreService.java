package com.music.service;

import com.music.dto.GenreDto;
import com.music.entity.Genre;
import com.music.repository.GenreRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class GenreService {

  private final GenreRepository genreRepository;

  public GenreService(GenreRepository genreRepository) {
    this.genreRepository = genreRepository;
  }

  public List<GenreDto> getAllGenres() {
    return genreRepository.findAll()
      .stream()
      .map(Genre::convertToDto)
      .toList();
  }

  public Optional<GenreDto> getGenreById(Long id) {
    return genreRepository.findById(id)
      .map(Genre::convertToDto);
  }
}