package com.music.service;

import com.music.dto.request.CreateTrackRequest;
import com.music.dto.request.UpdateTrackRequest;
import com.music.dto.response.TrackDto;
import com.music.entity.*;
import com.music.exception.*;
import com.music.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@Service
public class TrackService {

  private final TrackRepository trackRepository;
  private final AlbumRepository albumRepository;
  private final ArtistRepository artistRepository;
  private final GenreRepository genreRepository;
  private final FileStorageService fileStorageService;

  public TrackService(
      TrackRepository trackRepository,
      AlbumRepository albumRepository,
      ArtistRepository artistRepository,
      GenreRepository genreRepository,
      FileStorageService fileStorageService) {
    this.trackRepository = trackRepository;
    this.albumRepository = albumRepository;
    this.artistRepository = artistRepository;
    this.genreRepository = genreRepository;
    this.fileStorageService = fileStorageService;
  }

  public List<TrackDto> getAllTracks() {
    return trackRepository.findAll()
      .stream()
      .map(Track::convertToDto)
      .toList();
  }

  public Optional<TrackDto> getTrackById(Long id) {
    return trackRepository.findById(id)
      .map(Track::convertToDto);
  }

  public List<TrackDto> getTracksByAlbumId(Long albumId) {
    return trackRepository.findByAlbumId(albumId)
      .stream()
      .map(Track::convertToDto)
      .toList();
  }

  @Transactional
  public TrackDto createTrack(CreateTrackRequest request) {
    Track track = new Track();
    
    setBasicTrackInfo(track, request);
    setTrackAudioFile(track, request.getAudioFile());
    setTrackAlbum(track, request.getAlbumId());
    setTrackArtists(track, request.getArtistIds());
    setTrackGenres(track, request.getGenreIds());

    Track savedTrack = trackRepository.save(track);
    return Track.convertToDto(savedTrack);
  }

  @Transactional
  public TrackDto updateTrack(Long id, UpdateTrackRequest request) {
    Track track = trackRepository.findById(id)
      .orElseThrow(() -> new TrackNotFoundException(id));

    updateBasicTrackInfo(track, request);
    updateTrackAudioFile(track, request.getAudioFile());
    updateTrackAlbum(track, request);
    updateTrackArtists(track, request.getArtistIds());
    updateTrackGenres(track, request.getGenreIds());

    Track updatedTrack = trackRepository.save(track);
    return Track.convertToDto(updatedTrack);
  }

  @Transactional
  public void deleteTrack(Long id) {
    Track track = trackRepository.findById(id)
      .orElseThrow(() -> new TrackNotFoundException(id));

    track.getArtists().clear();
    track.getGenres().clear();

    if (track.getFileUrl() != null) {
      fileStorageService.deleteTrackAudio(track.getFileUrl());
    }

    trackRepository.delete(track);
  }

  private void setBasicTrackInfo(Track track, CreateTrackRequest request) {
    track.setTitle(request.getTitle());
    track.setDurationSeconds(request.getDurationSeconds());
    track.setLyrics(request.getLyrics());
    track.setReleaseDate(request.getReleaseDate());
  }

  private void setTrackAudioFile(Track track, MultipartFile audioFile) {
    String audioUrl = fileStorageService.saveTrackAudio(audioFile);
    track.setFileUrl(audioUrl);
  }

  private void setTrackAlbum(Track track, Long albumId) {
    if (albumId != null) {
      Album album = albumRepository.findById(albumId)
        .orElseThrow(() -> new AlbumNotFoundException(albumId));
      track.setAlbum(album);
    }
  }

  private void setTrackArtists(Track track, List<Long> artistIds) {
    if (artistIds != null && !artistIds.isEmpty()) {
      List<Artist> artists = artistIds.stream()
        .map(id -> artistRepository.findById(id)
          .orElseThrow(() -> new ArtistNotFoundException(id)))
        .toList();
      track.setArtists(artists);
    }
  }

  private void setTrackGenres(Track track, List<Long> genreIds) {
    if (genreIds != null && !genreIds.isEmpty()) {
      List<Genre> genres = genreIds.stream()
        .map(id -> genreRepository.findById(id)
          .orElseThrow(() -> new GenreNotFoundException(id)))
        .toList();
      track.setGenres(genres);
    }
  }


  private void updateBasicTrackInfo(Track track, UpdateTrackRequest request) {
    if (request.getTitle() != null && !request.getTitle().isEmpty()) {
      track.setTitle(request.getTitle());
    }

    if (request.getDurationSeconds() != null) {
      track.setDurationSeconds(request.getDurationSeconds());
    }

    if (request.isClearLyrics()) {
      track.setLyrics(null);
    } else if (request.getLyrics() != null) {
      track.setLyrics(request.getLyrics());
    }

    if (request.isClearReleaseDate()) {
      track.setReleaseDate(null);
    } else if (request.getReleaseDate() != null) {
      track.setReleaseDate(request.getReleaseDate());
    }
  }

  private void updateTrackAudioFile(Track track, MultipartFile audioFile) {
    if (audioFile != null && !audioFile.isEmpty()) {
      if (track.getFileUrl() != null) {
        fileStorageService.deleteTrackAudio(track.getFileUrl());
      }
      
      String audioUrl = fileStorageService.saveTrackAudio(audioFile);
      track.setFileUrl(audioUrl);
    }
  }

  private void updateTrackAlbum(Track track, UpdateTrackRequest request) {
    if (request.isClearAlbumId()) {
      track.setAlbum(null);
    } else if (request.getAlbumId() != null) {
      Album album = albumRepository.findById(request.getAlbumId())
        .orElseThrow(() -> new AlbumNotFoundException(request.getAlbumId()));
      track.setAlbum(album);
    }
  }

  private void updateTrackArtists(Track track, List<Long> artistIds) {
    if (artistIds != null) {
      track.getArtists().clear();
      if (!artistIds.isEmpty()) {
        List<Artist> artists = artistIds.stream()
          .map(id -> artistRepository.findById(id)
            .orElseThrow(() -> new ArtistNotFoundException(id)))
          .toList();
        track.getArtists().addAll(artists);
      }
    }
  }

  private void updateTrackGenres(Track track, List<Long> genreIds) {
    if (genreIds != null) {
      track.getGenres().clear();
      if (!genreIds.isEmpty()) {
        List<Genre> genres = genreIds.stream()
          .map(id -> genreRepository.findById(id)
            .orElseThrow(() -> new GenreNotFoundException(id)))
          .toList();
        track.getGenres().addAll(genres);
      }
    }
  }
}