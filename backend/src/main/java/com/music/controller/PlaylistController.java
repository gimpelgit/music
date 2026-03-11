package com.music.controller;

import com.music.dto.request.CreatePlaylistRequest;
import com.music.dto.request.UpdatePlaylistRequest;
import com.music.dto.request.UpdateTrackPositionRequest;
import com.music.dto.response.PlaylistDto;
import com.music.dto.response.SuccessResponse;
import com.music.service.PlaylistService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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
  @PreAuthorize("hasRole('ADMIN') or @playlistService.isPublic(#id) or @playlistService.isOwner(#id, authentication.principal.id)")
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

  @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<PlaylistDto> createPlaylist(
      @RequestParam("name") String name,
      @RequestParam(value = "isPublic", required = false, defaultValue = "false") Boolean isPublic,
      @RequestParam(value = "coverImage", required = false) MultipartFile coverImage,
      @RequestParam(value = "trackIds", required = false) List<Long> trackIds) {
    
    CreatePlaylistRequest request = new CreatePlaylistRequest(name, isPublic, coverImage, trackIds);
    PlaylistDto createdPlaylist = playlistService.createPlaylist(request);
    return new ResponseEntity<>(createdPlaylist, HttpStatus.CREATED);
  }

  @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
  @PreAuthorize("hasRole('ADMIN') or @playlistService.isOwner(#id, authentication.principal.id)")
  public ResponseEntity<PlaylistDto> updatePlaylist(
      @PathVariable Long id,
      @RequestParam(value = "name", required = false) String name,
      @RequestParam(value = "isPublic", required = false) Boolean isPublic,
      @RequestParam(value = "coverImage", required = false) MultipartFile coverImage,
      @RequestParam(value = "trackIds", required = false) List<Long> trackIds) {
    
    UpdatePlaylistRequest request = new UpdatePlaylistRequest(name, isPublic, coverImage, trackIds);
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

  @PutMapping("/{playlistId}/tracks/{trackId}")
  @PreAuthorize("hasRole('ADMIN') or @playlistService.isOwner(#playlistId, authentication.principal.id)")
  public ResponseEntity<PlaylistDto> updateTrackPosition(
      @PathVariable Long playlistId,
      @PathVariable Long trackId,
      @Valid @RequestBody UpdateTrackPositionRequest request) {
    PlaylistDto updatedPlaylist = playlistService.updateTrackPosition(playlistId, trackId, request.getPosition());
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