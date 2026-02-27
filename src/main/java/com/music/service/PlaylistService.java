package com.music.service;

import com.music.dto.PlaylistDto;
import com.music.entity.Playlist;
import com.music.repository.PlaylistRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class PlaylistService {

  private final PlaylistRepository playlistRepository;

  public PlaylistService(PlaylistRepository playlistRepository) {
    this.playlistRepository = playlistRepository;
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
}