package com.music.service;

import com.music.dto.ArtistDto;
import com.music.entity.Artist;
import com.music.exception.ArtistAlreadyExistsException;
import com.music.exception.ArtistNotFoundException;
import com.music.repository.ArtistRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

  @Transactional
  public ArtistDto createArtist(ArtistDto artistDto) {
    if (artistRepository.findByName(artistDto.getName()).isPresent()) {
      throw new ArtistAlreadyExistsException(artistDto.getName());
    }

    Artist artist = new Artist(artistDto.getName());
    Artist savedArtist = artistRepository.save(artist);
    return Artist.convertToDto(savedArtist);
  }

  @Transactional
  public ArtistDto updateArtist(Long id, ArtistDto artistDto) {
    Artist artist = artistRepository.findById(id)
      .orElseThrow(() -> new ArtistNotFoundException(id));

    Optional<Artist> existingArtist = artistRepository.findByName(artistDto.getName());
    if (existingArtist.isPresent() && !existingArtist.get().getId().equals(id)) {
      throw new ArtistAlreadyExistsException(artistDto.getName());
    }

    artist.setName(artistDto.getName());
    Artist updatedArtist = artistRepository.save(artist);
    return Artist.convertToDto(updatedArtist);
  }

  @Transactional
  public void deleteArtist(Long id) {
    if (!artistRepository.existsById(id)) {
      throw new ArtistNotFoundException(id);
    }
    artistRepository.deleteById(id);
  }
}