package com.music.controller;

import com.music.dto.*;
import com.music.service.TrackService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

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

  @PostMapping
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<TrackDto> createTrack(@Valid @RequestBody CreateTrackRequest request) {
    TrackDto createdTrack = trackService.createTrack(request);
    return new ResponseEntity<>(createdTrack, HttpStatus.CREATED);
  }

  @PutMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<TrackDto> updateTrack(
      @PathVariable Long id,
      @Valid @RequestBody UpdateTrackRequest request) {
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