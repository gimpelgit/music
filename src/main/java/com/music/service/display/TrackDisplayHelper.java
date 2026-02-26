package com.music.service.display;

import com.music.model.Track;

public class TrackDisplayHelper implements EntityDisplayHelper<Track> {
  @Override
  public void display(Track track) {
    System.out.printf("[%d] %s | ID альбома: %s | Длительность: %d сек | Дата релиза: %s%n",
      track.getId(),
      track.getTitle(),
      track.getAlbumId() != null ? track.getAlbumId() : "нет",
      track.getDurationSeconds(),
      track.getReleaseDate() != null ? track.getReleaseDate() : "не указана");
  }
}