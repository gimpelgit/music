package com.music.controller;

import com.music.dto.AlbumDto;
import com.music.service.AlbumService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
}