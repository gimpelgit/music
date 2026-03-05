package com.music.service;

import com.music.dto.response.GenreDto;
import com.music.entity.Genre;
import com.music.exception.GenreAlreadyExistsException;
import com.music.exception.GenreNotFoundException;
import com.music.repository.GenreRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

  @Transactional
  public GenreDto createGenre(GenreDto genreDto) {
    if (genreRepository.findByName(genreDto.getName()).isPresent()) {
      throw new GenreAlreadyExistsException(genreDto.getName());
    }

    Genre genre = new Genre(genreDto.getName());
    Genre savedGenre = genreRepository.save(genre);
    return Genre.convertToDto(savedGenre);
  }

  @Transactional
  public GenreDto updateGenre(Long id, GenreDto genreDto) {
    Genre genre = genreRepository.findById(id)
      .orElseThrow(() -> new GenreNotFoundException(id));

    Optional<Genre> existingGenre = genreRepository.findByName(genreDto.getName());
    if (existingGenre.isPresent() && !existingGenre.get().getId().equals(id)) {
      throw new GenreAlreadyExistsException(genreDto.getName());
    }

    genre.setName(genreDto.getName());
    Genre updatedGenre = genreRepository.save(genre);
    return Genre.convertToDto(updatedGenre);
  }

  @Transactional
  public void deleteGenre(Long id) {
    if (!genreRepository.existsById(id)) {
      throw new GenreNotFoundException(id);
    }
    genreRepository.deleteById(id);
  }
}