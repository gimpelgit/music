package com.music.service;

import com.music.dto.AlbumDto;
import com.music.entity.Album;
import com.music.repository.AlbumRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class AlbumService {

  private final AlbumRepository albumRepository;

  public AlbumService(AlbumRepository albumRepository) {
    this.albumRepository = albumRepository;
  }

  public List<AlbumDto> getAllAlbums() {
    return albumRepository.findAll()
      .stream()
      .map(Album::convertToDto)
      .toList();
  }

  public Optional<AlbumDto> getAlbumById(Long id) {
    return albumRepository.findById(id)
      .map(Album::convertToDto);
  }
}