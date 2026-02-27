package com.music.controller;

import com.music.dto.PlaylistDto;
import com.music.service.PlaylistService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/playlists")
public class PlaylistController {

  private final PlaylistService playlistService;

  public PlaylistController(PlaylistService playlistService) {
    this.playlistService = playlistService;
  }

  @GetMapping
  public ResponseEntity<List<PlaylistDto>> getAllPlaylists() {
    List<PlaylistDto> playlists = playlistService.getAllPlaylists();
    return new ResponseEntity<>(playlists, HttpStatus.OK);
  }

  @GetMapping("/{id}")
  public ResponseEntity<PlaylistDto> getPlaylistById(@PathVariable Long id) {
    return playlistService.getPlaylistById(id)
      .map(playlist -> new ResponseEntity<>(playlist, HttpStatus.OK))
      .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
  }

  @GetMapping("/user/{userId}")
  public ResponseEntity<List<PlaylistDto>> getPlaylistsByUserId(@PathVariable Long userId) {
    List<PlaylistDto> playlists = playlistService.getPlaylistsByUserId(userId);
    return new ResponseEntity<>(playlists, HttpStatus.OK);
  }

  @GetMapping("/public")
  public ResponseEntity<List<PlaylistDto>> getPublicPlaylists() {
    List<PlaylistDto> playlists = playlistService.getPublicPlaylists();
    return new ResponseEntity<>(playlists, HttpStatus.OK);
  }
}