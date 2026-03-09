package com.music.service;

import com.music.dto.request.CreateTrackRequest;
import com.music.dto.request.UpdateTrackRequest;
import com.music.dto.response.TrackDto;
import com.music.entity.*;
import com.music.exception.*;
import com.music.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class TrackService {

  private final TrackRepository trackRepository;
  private final AlbumRepository albumRepository;
  private final ArtistRepository artistRepository;
  private final GenreRepository genreRepository;

  public TrackService(
      TrackRepository trackRepository,
      AlbumRepository albumRepository,
      ArtistRepository artistRepository,
      GenreRepository genreRepository) {
    this.trackRepository = trackRepository;
    this.albumRepository = albumRepository;
    this.artistRepository = artistRepository;
    this.genreRepository = genreRepository;
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
    track.setTitle(request.getTitle());
    track.setDurationSeconds(request.getDurationSeconds());
    track.setFileUrl(request.getFileUrl());
    track.setLyrics(request.getLyrics());
    track.setReleaseDate(request.getReleaseDate());

    if (request.getAlbumId() != null) {
      Album album = albumRepository.findById(request.getAlbumId())
        .orElseThrow(() -> new AlbumNotFoundException(request.getAlbumId()));
      track.setAlbum(album);
    }

    if (request.getArtistIds() != null && !request.getArtistIds().isEmpty()) {
      List<Artist> artists = request.getArtistIds().stream()
        .map(id -> artistRepository.findById(id)
          .orElseThrow(() -> new ArtistNotFoundException(id)))
        .toList();
      track.setArtists(artists);
    }

    if (request.getGenreIds() != null && !request.getGenreIds().isEmpty()) {
      List<Genre> genres = request.getGenreIds().stream()
        .map(id -> genreRepository.findById(id)
          .orElseThrow(() -> new GenreNotFoundException(id)))
        .toList();
      track.setGenres(genres);
    }

    Track savedTrack = trackRepository.save(track);
    return Track.convertToDto(savedTrack);
  }

  @Transactional
  public TrackDto updateTrack(Long id, UpdateTrackRequest request) {
    Track track = trackRepository.findById(id)
      .orElseThrow(() -> new TrackNotFoundException(id));

    if (request.getTitle() != null && !request.getTitle().isEmpty()) {
      track.setTitle(request.getTitle());
    }

    if (request.getDurationSeconds() != null) {
      track.setDurationSeconds(request.getDurationSeconds());
    }

    if (request.getFileUrl() != null && !request.getFileUrl().isEmpty()) {
      track.setFileUrl(request.getFileUrl());
    }

    if (request.getLyrics() != null) {
      track.setLyrics(request.getLyrics());
    }

    if (request.getReleaseDate() != null) {
      track.setReleaseDate(request.getReleaseDate());
    }

    if (request.getAlbumId() != null) {
      Album album = albumRepository.findById(request.getAlbumId())
        .orElseThrow(() -> new AlbumNotFoundException(request.getAlbumId()));
      track.setAlbum(album);
    }

    if (request.getArtistIds() != null) {
      List<Artist> artists = request.getArtistIds().stream()
        .map(artistId -> artistRepository.findById(artistId)
          .orElseThrow(() -> new ArtistNotFoundException(artistId)))
        .toList();
      track.setArtists(artists);
    }

    if (request.getGenreIds() != null) {
      List<Genre> genres = request.getGenreIds().stream()
        .map(genreId -> genreRepository.findById(genreId)
          .orElseThrow(() -> new GenreNotFoundException(genreId)))
        .toList();
      track.setGenres(genres);
    }

    Track updatedTrack = trackRepository.save(track);
    return Track.convertToDto(updatedTrack);
  }

  @Transactional
  public void deleteTrack(Long id) {
    if (!trackRepository.existsById(id)) {
      throw new TrackNotFoundException(id);
    }
    trackRepository.deleteById(id);
  }
}