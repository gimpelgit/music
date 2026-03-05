package com.music.controller;

import com.music.dto.request.CreatePlaylistRequest;
import com.music.dto.request.UpdatePlaylistRequest;
import com.music.dto.response.PlaylistDto;
import com.music.dto.response.SuccessResponse;
import com.music.service.PlaylistService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<List<PlaylistDto>> getAllPlaylists() {
    List<PlaylistDto> playlists = playlistService.getAllPlaylists();
    return new ResponseEntity<>(playlists, HttpStatus.OK);
  }

  @GetMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN') or @playlistService.isOwner(#id, authentication.principal.id)")
  public ResponseEntity<PlaylistDto> getPlaylistById(@PathVariable Long id) {
    return playlistService.getPlaylistById(id)
      .map(playlist -> new ResponseEntity<>(playlist, HttpStatus.OK))
      .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
  }

  @GetMapping("/user/{userId}")
  @PreAuthorize("hasRole('ADMIN') or authentication.principal.id == #userId")
  public ResponseEntity<List<PlaylistDto>> getPlaylistsByUserId(@PathVariable Long userId) {
    List<PlaylistDto> playlists = playlistService.getPlaylistsByUserId(userId);
    return new ResponseEntity<>(playlists, HttpStatus.OK);
  }

  @GetMapping("/public")
  public ResponseEntity<List<PlaylistDto>> getPublicPlaylists() {
    List<PlaylistDto> playlists = playlistService.getPublicPlaylists();
    return new ResponseEntity<>(playlists, HttpStatus.OK);
  }

  @PostMapping
  public ResponseEntity<PlaylistDto> createPlaylist(@Valid @RequestBody CreatePlaylistRequest request) {
    PlaylistDto createdPlaylist = playlistService.createPlaylist(request);
    return new ResponseEntity<>(createdPlaylist, HttpStatus.CREATED);
  }

  @PutMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN') or @playlistService.isOwner(#id, authentication.principal.id)")
  public ResponseEntity<PlaylistDto> updatePlaylist(
      @PathVariable Long id,
      @Valid @RequestBody UpdatePlaylistRequest request) {
    PlaylistDto updatedPlaylist = playlistService.updatePlaylist(id, request);
    return new ResponseEntity<>(updatedPlaylist, HttpStatus.OK);
  }

  @DeleteMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN') or @playlistService.isOwner(#id, authentication.principal.id)")  
  public ResponseEntity<SuccessResponse> deletePlaylist(@PathVariable Long id) {
    playlistService.deletePlaylist(id);
    return new ResponseEntity<>(
      new SuccessResponse("Плейлист успешно удален"),
      HttpStatus.OK
    );
  }

  @PostMapping("/{playlistId}/tracks/{trackId}")
  @PreAuthorize("hasRole('ADMIN') or @playlistService.isOwner(#playlistId, authentication.principal.id)")
  public ResponseEntity<PlaylistDto> addTrackToPlaylist(
      @PathVariable Long playlistId,
      @PathVariable Long trackId) {
    PlaylistDto updatedPlaylist = playlistService.addTrackToPlaylist(playlistId, trackId);
    return new ResponseEntity<>(updatedPlaylist, HttpStatus.OK);
  }

  @DeleteMapping("/{playlistId}/tracks/{trackId}")
  @PreAuthorize("hasRole('ADMIN') or @playlistService.isOwner(#playlistId, authentication.principal.id)")
  public ResponseEntity<PlaylistDto> removeTrackFromPlaylist(
      @PathVariable Long playlistId,
      @PathVariable Long trackId) {
    PlaylistDto updatedPlaylist = playlistService.removeTrackFromPlaylist(playlistId, trackId);
    return new ResponseEntity<>(updatedPlaylist, HttpStatus.OK);
  }
}