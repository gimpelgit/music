package com.music.service;

import com.music.dto.CreatePlaylistRequest;
import com.music.dto.PlaylistDto;
import com.music.dto.UpdatePlaylistRequest;
import com.music.entity.Playlist;
import com.music.entity.PlaylistTrack;
import com.music.entity.Track;
import com.music.entity.User;
import com.music.exception.PlaylistNotFoundException;
import com.music.exception.TrackNotFoundException;
import com.music.repository.PlaylistRepository;
import com.music.repository.TrackRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class PlaylistService {

  private final PlaylistRepository playlistRepository;
  private final TrackRepository trackRepository;
  private final UserService userService;

  public PlaylistService(
      PlaylistRepository playlistRepository,
      TrackRepository trackRepository,
      UserService userService) {
    this.playlistRepository = playlistRepository;
    this.trackRepository = trackRepository;
    this.userService = userService;
  }

  public List<PlaylistDto> getAllPlaylists() {
    return playlistRepository.findAll()
      .stream()
      .map(Playlist::convertToDto)
      .toList();
  }

  public Optional<PlaylistDto> getPlaylistById(Long id) {
    return playlistRepository.findById(id)
      .map(Playlist::convertToDto);
  }

  public List<PlaylistDto> getPlaylistsByUserId(Long userId) {
    return playlistRepository.findByUserId(userId)
      .stream()
      .map(Playlist::convertToDto)
      .toList();
  }

  public List<PlaylistDto> getPublicPlaylists() {
    return playlistRepository.findByIsPublicTrue()
      .stream()
      .map(Playlist::convertToDto)
      .toList();
  }

  @Transactional
  public PlaylistDto createPlaylist(CreatePlaylistRequest request) {
    User currentUser = userService.getCurrentUser();

    Playlist playlist = new Playlist();
    playlist.setName(request.getName());
    playlist.setUser(currentUser);
    playlist.setIsPublic(request.getIsPublic() != null && request.getIsPublic());
    playlist.setCoverImageUrl(request.getCoverImageUrl());
    playlist.setPlaylistTracks(new ArrayList<>());

    Playlist savedPlaylist = playlistRepository.save(playlist);

    if (request.getTrackIds() != null && !request.getTrackIds().isEmpty()) {
      addTracksToPlaylist(savedPlaylist, request.getTrackIds());
    }

    return Playlist.convertToDto(savedPlaylist);
  }

  @Transactional
  public PlaylistDto updatePlaylist(Long id, UpdatePlaylistRequest request) {
    Playlist playlist = playlistRepository.findById(id)
        .orElseThrow(() -> new PlaylistNotFoundException(id));

    if (request.getName() != null && !request.getName().isEmpty()) {
      playlist.setName(request.getName());
    }

    if (request.getIsPublic() != null) {
      playlist.setIsPublic(request.getIsPublic());
    }

    if (request.getCoverImageUrl() != null) {
      playlist.setCoverImageUrl(request.getCoverImageUrl());
    }

    Playlist updatedPlaylist = playlistRepository.save(playlist);

    if (request.getTrackIds() != null) {
      playlist.getPlaylistTracks().clear();
      playlistRepository.save(playlist);

      if (!request.getTrackIds().isEmpty()) {
        addTracksToPlaylist(updatedPlaylist, request.getTrackIds());
      }
    }

    return Playlist.convertToDto(updatedPlaylist);
  }

  @Transactional
  public void deletePlaylist(Long id) {
    if (!playlistRepository.existsById(id)) {
      throw new PlaylistNotFoundException(id);
    }

    playlistRepository.deleteById(id);
  }

  private void addTracksToPlaylist(Playlist playlist, List<Long> trackIds) {
    List<PlaylistTrack> playlistTracks = new ArrayList<>();
    
    if (playlist.getPlaylistTracks() == null) {
      playlist.setPlaylistTracks(new ArrayList<>());
    }
    int position = playlist.getPlaylistTracks().size();

    for (Long trackId : trackIds) {
      Track track = trackRepository.findById(trackId)
        .orElseThrow(() -> new TrackNotFoundException(trackId));

      PlaylistTrack playlistTrack = new PlaylistTrack();
      playlistTrack.setPlaylist(playlist);
      playlistTrack.setTrack(track);
      playlistTrack.setPosition(position++);
      playlistTracks.add(playlistTrack);
    }

    playlist.getPlaylistTracks().addAll(playlistTracks);
    playlistRepository.save(playlist);
  }

  @Transactional
  public PlaylistDto addTrackToPlaylist(Long playlistId, Long trackId) {
    Playlist playlist = playlistRepository.findById(playlistId)
        .orElseThrow(() -> new PlaylistNotFoundException(playlistId));

    Track track = trackRepository.findById(trackId)
      .orElseThrow(() -> new TrackNotFoundException(trackId));

    boolean trackExists = playlist.getPlaylistTracks().stream()
        .anyMatch(pt -> pt.getTrack().getId().equals(trackId));

    if (!trackExists) {
      int newPosition = playlist.getPlaylistTracks().size();
      PlaylistTrack playlistTrack = new PlaylistTrack();
      playlistTrack.setPlaylist(playlist);
      playlistTrack.setTrack(track);
      playlistTrack.setPosition(newPosition);
      playlist.getPlaylistTracks().add(playlistTrack);
      playlistRepository.save(playlist);
    }

    return Playlist.convertToDto(playlist);
  }

  @Transactional
  public PlaylistDto removeTrackFromPlaylist(Long playlistId, Long trackId) {
    Playlist playlist = playlistRepository.findById(playlistId)
        .orElseThrow(() -> new PlaylistNotFoundException(playlistId));

    playlist.getPlaylistTracks().removeIf(pt -> pt.getTrack().getId().equals(trackId));

    int position = 0;
    for (PlaylistTrack pt : playlist.getPlaylistTracks()) {
      pt.setPosition(position++);
    }

    playlistRepository.save(playlist);
    return Playlist.convertToDto(playlist);
  }

  public boolean isOwner(Long playlistId, Long userId) {
    return playlistRepository.existsByIdAndUserId(playlistId, userId);
  }
}