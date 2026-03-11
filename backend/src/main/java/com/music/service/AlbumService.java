package com.music.service;

import com.music.dto.request.AlbumFilterRequest;
import com.music.dto.request.CreateAlbumRequest;
import com.music.dto.request.UpdateAlbumRequest;
import com.music.dto.response.AlbumDto;
import com.music.dto.response.PageResponse;
import com.music.entity.Album;
import com.music.entity.Track;
import com.music.exception.AlbumHasTracksException;
import com.music.exception.AlbumNotFoundException;
import com.music.repository.AlbumRepository;
import com.music.repository.TrackRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class AlbumService {

  private final AlbumRepository albumRepository;
  private final TrackRepository trackRepository;
  private final FileStorageService fileStorageService;

  public AlbumService(
    AlbumRepository albumRepository, 
    TrackRepository trackRepository,
    FileStorageService fileStorageService
  ) {
    this.albumRepository = albumRepository;
    this.fileStorageService = fileStorageService;
    this.trackRepository = trackRepository;
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

    if (request.getCoverImage() != null && !request.getCoverImage().isEmpty()) {
      String imageUrl = fileStorageService.saveAlbumImage(request.getCoverImage());
      album.setCoverImageUrl(imageUrl);
    }

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

    if (request.getCoverImage() != null && !request.getCoverImage().isEmpty()) {
      if (album.getCoverImageUrl() != null) {
        fileStorageService.deleteAlbumImage(album.getCoverImageUrl());
      }
      
      String imageUrl = fileStorageService.saveAlbumImage(request.getCoverImage());
      album.setCoverImageUrl(imageUrl);
    }

    Album updatedAlbum = albumRepository.save(album);
    return Album.convertToDto(updatedAlbum);
  }

  @Transactional
  public void deleteAlbum(Long id) {
    Album album = albumRepository.findById(id)
      .orElseThrow(() -> new AlbumNotFoundException(id));

    List<Track> tracks = trackRepository.findByAlbumId(id);
    if (!tracks.isEmpty()) {
      throw new AlbumHasTracksException(id);
    }

    if (album.getCoverImageUrl() != null) {
      fileStorageService.deleteAlbumImage(album.getCoverImageUrl());
    }

    albumRepository.delete(album);
  }

  public PageResponse<AlbumDto> findAlbumsByFilters(AlbumFilterRequest filterRequest) {
    int zeroBasedPage = filterRequest.getPage() - 1;
    Pageable pageable = PageRequest.of(zeroBasedPage, filterRequest.getSize());
    
    List<Long> genreIds = filterRequest.getGenreIds();
    List<Long> artistIds = filterRequest.getArtistIds();
    
    if (genreIds != null && genreIds.isEmpty()) {
      genreIds = null;
    }
    if (artistIds != null && artistIds.isEmpty()) {
      artistIds = null;
    }

    Long genreCount = genreIds != null ? (long) genreIds.size() : null;
    Long artistCount = artistIds != null ? (long) artistIds.size() : null;

    Page<Album> albumPage = albumRepository.findAlbumsByGenresAndArtists(
      genreIds, artistIds, genreCount, artistCount, pageable);
    
    List<AlbumDto> content = albumPage.getContent().stream()
      .map(Album::convertToDto)
      .toList();
    
    return PageResponse.<AlbumDto>builder()
      .content(content)
      .page(filterRequest.getPage())
      .size(albumPage.getSize())
      .totalElements(albumPage.getTotalElements())
      .totalPages(albumPage.getTotalPages())
      .first(albumPage.isFirst())
      .last(albumPage.isLast())
      .build();
  }
}