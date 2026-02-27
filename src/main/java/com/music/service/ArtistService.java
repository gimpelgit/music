package com.music.service;

import com.music.dto.ArtistDto;
import com.music.entity.Artist;
import com.music.repository.ArtistRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ArtistService {

  private final ArtistRepository artistRepository;

  public ArtistService(ArtistRepository artistRepository) {
    this.artistRepository = artistRepository;
  }

  public List<ArtistDto> getAllArtists() {
    return artistRepository.findAll()
      .stream()
      .map(Artist::convertToDto)
      .toList();
  }

  public Optional<ArtistDto> getArtistById(Long id) {
    return artistRepository.findById(id)
      .map(Artist::convertToDto);
  }
}