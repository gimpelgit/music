package com.music.controller;

import com.music.dto.*;
import com.music.service.AlbumService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/albums")
public class AlbumController {

  private final AlbumService albumService;

  public AlbumController(AlbumService albumService) {
    this.albumService = albumService;
  }

  @GetMapping
  public ResponseEntity<List<AlbumDto>> getAllAlbums() {
    List<AlbumDto> albums = albumService.getAllAlbums();
    return new ResponseEntity<>(albums, HttpStatus.OK);
  }

  @GetMapping("/{id}")
  public ResponseEntity<AlbumDto> getAlbumById(@PathVariable Long id) {
    return albumService.getAlbumById(id)
        .map(album -> new ResponseEntity<>(album, HttpStatus.OK))
        .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
  }

  @PostMapping
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<AlbumDto> createAlbum(@Valid @RequestBody CreateAlbumRequest request) {
    AlbumDto createdAlbum = albumService.createAlbum(request);
    return new ResponseEntity<>(createdAlbum, HttpStatus.CREATED);
  }

  @PutMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<AlbumDto> updateAlbum(
      @PathVariable Long id,
      @Valid @RequestBody UpdateAlbumRequest request) {
    AlbumDto updatedAlbum = albumService.updateAlbum(id, request);
    return new ResponseEntity<>(updatedAlbum, HttpStatus.OK);
  }

  @DeleteMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<SuccessResponse> deleteAlbum(@PathVariable Long id) {
    albumService.deleteAlbum(id);
    return new ResponseEntity<>(
      new SuccessResponse("Альбом успешно удален"),
      HttpStatus.OK
    );
  }
}