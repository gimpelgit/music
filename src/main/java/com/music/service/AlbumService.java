package com.music.service;

import com.music.dto.request.CreateAlbumRequest;
import com.music.dto.request.UpdateAlbumRequest;
import com.music.dto.response.AlbumDto;
import com.music.entity.Album;
import com.music.exception.AlbumNotFoundException;
import com.music.repository.AlbumRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

  @Transactional
  public AlbumDto createAlbum(CreateAlbumRequest request) {
    Album album = new Album();
    album.setTitle(request.getTitle());
    album.setCoverImageUrl(request.getCoverImageUrl());

    Album savedAlbum = albumRepository.save(album);
    return Album.convertToDto(savedAlbum);
  }

  @Transactional
  public AlbumDto updateAlbum(Long id, UpdateAlbumRequest request) {
    Album album = albumRepository.findById(id)
      .orElseThrow(() -> new AlbumNotFoundException(id));

    if (request.getTitle() != null && !request.getTitle().isEmpty()) {
      album.setTitle(request.getTitle());
    }

    if (request.getCoverImageUrl() != null) {
      album.setCoverImageUrl(request.getCoverImageUrl());
    }

    Album updatedAlbum = albumRepository.save(album);
    return Album.convertToDto(updatedAlbum);
  }

  @Transactional
  public void deleteAlbum(Long id) {
    if (!albumRepository.existsById(id)) {
      throw new AlbumNotFoundException(id);
    }
    albumRepository.deleteById(id);
  }
}