package com.music.controller;

import com.music.dto.request.CreateTrackRequest;
import com.music.dto.request.UpdateTrackRequest;
import com.music.dto.response.SuccessResponse;
import com.music.dto.response.TrackDto;
import com.music.service.TrackService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/tracks")
public class TrackController {

  private final TrackService trackService;

  public TrackController(TrackService trackService) {
    this.trackService = trackService;
  }

  @GetMapping
  public ResponseEntity<List<TrackDto>> getAllTracks() {
    List<TrackDto> tracks = trackService.getAllTracks();
    return new ResponseEntity<>(tracks, HttpStatus.OK);
  }

  @GetMapping("/{id}")
  public ResponseEntity<TrackDto> getTrackById(@PathVariable Long id) {
    return trackService.getTrackById(id)
      .map(track -> new ResponseEntity<>(track, HttpStatus.OK))
      .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
  }
  
  @GetMapping("/album/{albumId}")
  public ResponseEntity<List<TrackDto>> getTracksByAlbumId(@PathVariable Long albumId) {
    List<TrackDto> tracks = trackService.getTracksByAlbumId(albumId);
    return new ResponseEntity<>(tracks, HttpStatus.OK);
  }

  @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<TrackDto> createTrack(
      @RequestParam("title") String title,
      @RequestParam(value = "albumId", required = false) Long albumId,
      @RequestParam("durationSeconds") Integer durationSeconds,
      @RequestParam("audioFile") MultipartFile audioFile,
      @RequestParam(value = "lyrics", required = false) String lyrics,
      @RequestParam(value = "releaseDate", required = false) LocalDate releaseDate,
      @RequestParam("artistIds") List<Long> artistIds,
      @RequestParam("genreIds") List<Long> genreIds) {
    
    CreateTrackRequest request = new CreateTrackRequest(
      title, albumId, durationSeconds, audioFile, lyrics, releaseDate, artistIds, genreIds
    );
    
    TrackDto createdTrack = trackService.createTrack(request);
    return new ResponseEntity<>(createdTrack, HttpStatus.CREATED);
  }

  @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<TrackDto> updateTrack(
      @PathVariable Long id,
      @RequestParam(value = "title", required = false) String title,
      @RequestParam(value = "albumId", required = false) Long albumId,
      @RequestParam(value = "durationSeconds", required = false) Integer durationSeconds,
      @RequestParam(value = "audioFile", required = false) MultipartFile audioFile,
      @RequestParam(value = "lyrics", required = false) String lyrics,
      @RequestParam(value = "releaseDate", required = false) LocalDate releaseDate,
      @RequestParam(value = "artistIds", required = false) List<Long> artistIds,
      @RequestParam(value = "genreIds", required = false) List<Long> genreIds,
      @RequestParam(value = "clearReleaseDate", required = false, defaultValue = "false") boolean clearReleaseDate,
      @RequestParam(value = "clearLyrics", required = false, defaultValue = "false") boolean clearLyrics,
      @RequestParam(value = "clearAlbumId", required = false, defaultValue = "false") boolean clearAlbumId) {
    
    UpdateTrackRequest request = new UpdateTrackRequest(
      title, albumId, durationSeconds, audioFile, lyrics, releaseDate, 
      artistIds, genreIds, clearReleaseDate, clearLyrics, clearAlbumId);
    
    TrackDto updatedTrack = trackService.updateTrack(id, request);
    return new ResponseEntity<>(updatedTrack, HttpStatus.OK);
  }

  @DeleteMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<SuccessResponse> deleteTrack(@PathVariable Long id) {
    trackService.deleteTrack(id);
    return new ResponseEntity<>(
      new SuccessResponse("Трек успешно удален"),
      HttpStatus.OK
    );
  }
}