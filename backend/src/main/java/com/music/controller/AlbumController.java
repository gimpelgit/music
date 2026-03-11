package com.music.controller;

import com.music.dto.request.AlbumFilterRequest;
import com.music.dto.request.CreateAlbumRequest;
import com.music.dto.request.UpdateAlbumRequest;
import com.music.dto.response.AlbumDto;
import com.music.dto.response.PageResponse;
import com.music.dto.response.SuccessResponse;
import com.music.service.AlbumService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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

  @PostMapping("/filter")
  public ResponseEntity<PageResponse<AlbumDto>> getAlbumsByFilters(
      @Valid @RequestBody AlbumFilterRequest filterRequest) {
    PageResponse<AlbumDto> albums = albumService.findAlbumsByFilters(filterRequest);
    return new ResponseEntity<>(albums, HttpStatus.OK);
  }


  @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<AlbumDto> createAlbumWithImage(
      @RequestParam("title") String title,
      @RequestParam(value = "coverImage", required = false) MultipartFile coverImage) {
    
    CreateAlbumRequest request = new CreateAlbumRequest(title, coverImage);
    AlbumDto createdAlbum = albumService.createAlbum(request);
    return new ResponseEntity<>(createdAlbum, HttpStatus.CREATED);
  }

  @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<AlbumDto> updateAlbumWithImage(
      @PathVariable Long id,
      @RequestParam(value = "title", required = false) String title,
      @RequestParam(value = "coverImage", required = false) MultipartFile coverImage) {
    
    UpdateAlbumRequest request = new UpdateAlbumRequest(title, coverImage);
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