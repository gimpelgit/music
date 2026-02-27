package com.music.service;

import com.music.dto.TrackDto;
import com.music.entity.Track;
import com.music.repository.TrackRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class TrackService {

  private final TrackRepository trackRepository;

  public TrackService(TrackRepository trackRepository) {
    this.trackRepository = trackRepository;
  }

  public List<TrackDto> getAllTracks() {
    return trackRepository.findAll()
      .stream()
      .map(Track::convertToDto)
      .toList();
  }

  public Optional<TrackDto> getTrackById(Long id) {
    return trackRepository.findById(id)
      .map(Track::convertToDto);
  }
}