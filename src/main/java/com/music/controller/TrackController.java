package com.music.controller;

import com.music.dto.TrackDto;
import com.music.service.TrackService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
}