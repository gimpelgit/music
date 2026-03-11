package com.music.service;

import com.music.dto.request.CreatePlaylistRequest;
import com.music.dto.request.UpdatePlaylistRequest;
import com.music.dto.response.PlaylistDto;
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
import java.util.Objects;
import java.util.Optional;

@Service
public class PlaylistService {

  private final PlaylistRepository playlistRepository;
  private final TrackRepository trackRepository;
  private final UserService userService;
  private final FileStorageService fileStorageService;

  public PlaylistService(
      PlaylistRepository playlistRepository,
      TrackRepository trackRepository,
      UserService userService,
      FileStorageService fileStorageService) {
    this.playlistRepository = playlistRepository;
    this.trackRepository = trackRepository;
    this.userService = userService;
    this.fileStorageService = fileStorageService;
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
    
    if (request.getCoverImage() != null && !request.getCoverImage().isEmpty()) {
      String imageUrl = fileStorageService.savePlaylistImage(request.getCoverImage());
      playlist.setCoverImageUrl(imageUrl);
    }
    
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

    if (request.getCoverImage() != null && !request.getCoverImage().isEmpty()) {
      if (playlist.getCoverImageUrl() != null) {
        fileStorageService.deletePlaylistImage(playlist.getCoverImageUrl());
      }
      
      String imageUrl = fileStorageService.savePlaylistImage(request.getCoverImage());
      playlist.setCoverImageUrl(imageUrl);
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
    Playlist playlist = playlistRepository.findById(id)
      .orElseThrow(() -> new PlaylistNotFoundException(id));

    if (playlist.getCoverImageUrl() != null) {
      fileStorageService.deletePlaylistImage(playlist.getCoverImageUrl());
    }

    playlistRepository.deleteById(id);
  }

  private void addTracksToPlaylist(Playlist playlist, List<Long> trackIds) {
    if (trackIds == null || trackIds.isEmpty()) {
      return;
    }

    int maxPosition = playlist.getPlaylistTracks().stream()
      .mapToInt(PlaylistTrack::getPosition)
      .max()
      .orElse(-1);

    List<PlaylistTrack> playlistTracks = new ArrayList<>();
    int position = maxPosition + 1;

    for (Long trackId : trackIds) {
      Track track = trackRepository.findById(trackId)
        .orElseThrow(() -> new TrackNotFoundException(trackId));

      boolean trackExists = playlist.getPlaylistTracks().stream()
        .anyMatch(pt -> pt.getTrack() != null && pt.getTrack().getId().equals(trackId));

      if (!trackExists) {
        PlaylistTrack playlistTrack = new PlaylistTrack();
        playlistTrack.setPlaylist(playlist);
        playlistTrack.setTrack(track);
        playlistTrack.setPosition(position++);
        playlistTracks.add(playlistTrack);
      }
    }

    if (!playlistTracks.isEmpty()) {
      playlist.getPlaylistTracks().addAll(playlistTracks);
      playlistRepository.save(playlist);
    }
  }

  @Transactional
  public PlaylistDto addTrackToPlaylist(Long playlistId, Long trackId) {
    Playlist playlist = playlistRepository.findById(playlistId)
      .orElseThrow(() -> new PlaylistNotFoundException(playlistId));

    Track track = trackRepository.findById(trackId)
      .orElseThrow(() -> new TrackNotFoundException(trackId));

    if (playlist.getPlaylistTracks() == null) {
      playlist.setPlaylistTracks(new ArrayList<>());
    }

    boolean trackExists = playlist.getPlaylistTracks().stream()
      .filter(Objects::nonNull)
      .map(PlaylistTrack::getTrack)
      .filter(Objects::nonNull)
      .anyMatch(t -> t.getId().equals(trackId));

    if (!trackExists) {
      int maxPosition = playlist.getPlaylistTracks().stream()
        .mapToInt(PlaylistTrack::getPosition)
        .max()
        .orElse(-1);

      PlaylistTrack playlistTrack = new PlaylistTrack();
      playlistTrack.setPlaylist(playlist);
      playlistTrack.setTrack(track);
      playlistTrack.setPosition(maxPosition + 1);
      
      playlist.getPlaylistTracks().add(playlistTrack);
      playlist = playlistRepository.save(playlist);
    }

    return Playlist.convertToDto(playlist);
  }

  @Transactional
  public PlaylistDto updateTrackPosition(Long playlistId, Long trackId, Integer newPosition) {
    Playlist playlist = playlistRepository.findById(playlistId)
      .orElseThrow(() -> new PlaylistNotFoundException(playlistId));

    if (playlist.getPlaylistTracks() == null || playlist.getPlaylistTracks().isEmpty()) {
      throw new IllegalStateException("Плейлист пуст");
    }

    PlaylistTrack targetTrack = playlist.getPlaylistTracks().stream()
      .filter(pt -> pt != null && pt.getTrack() != null && pt.getTrack().getId().equals(trackId))
      .findFirst()
      .orElseThrow(() -> new TrackNotFoundException(trackId));

    int oldPosition = targetTrack.getPosition();
    
    if (newPosition < 0) {
      throw new IllegalArgumentException("Позиция должна быть больше 0");
    }

    if (oldPosition == newPosition) {
      return Playlist.convertToDto(playlist);
    }

    if (oldPosition < newPosition) {
      playlist.getPlaylistTracks().stream()
        .filter(pt -> pt.getPosition() > oldPosition && pt.getPosition() <= newPosition)
        .forEach(pt -> pt.setPosition(pt.getPosition() - 1));
    } else {
      playlist.getPlaylistTracks().stream()
        .filter(pt -> pt.getPosition() >= newPosition && pt.getPosition() < oldPosition)
        .forEach(pt -> pt.setPosition(pt.getPosition() + 1));
    }

    targetTrack.setPosition(newPosition);

    Playlist updatedPlaylist = playlistRepository.save(playlist);
    return Playlist.convertToDto(updatedPlaylist);
  }

  @Transactional
  public PlaylistDto removeTrackFromPlaylist(Long playlistId, Long trackId) {
    Playlist playlist = playlistRepository.findById(playlistId)
      .orElseThrow(() -> new PlaylistNotFoundException(playlistId));

    if (playlist.getPlaylistTracks() != null) {
      playlist.getPlaylistTracks().removeIf(pt -> 
        pt != null && 
        pt.getTrack() != null && 
        pt.getTrack().getId().equals(trackId)
      );

      int position = 0;
      for (PlaylistTrack pt : playlist.getPlaylistTracks()) {
        if (pt != null) {
          pt.setPosition(position++);
        }
      }

      playlist = playlistRepository.save(playlist);
    }

    return Playlist.convertToDto(playlist);
  }

  public boolean isOwner(Long playlistId, Long userId) {
    return playlistRepository.existsByIdAndUserId(playlistId, userId);
  }

  public boolean isPublic(Long playlistId) {
    return playlistRepository.findById(playlistId)
      .map(Playlist::getIsPublic)
      .orElse(false);
  }
}