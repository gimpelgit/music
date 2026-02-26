package com.music.service.display;

import com.music.model.Album;

public class AlbumDisplayHelper implements EntityDisplayHelper<Album> {
  @Override
  public void display(Album album) {
    System.out.printf("[%d] %s | Обложка: %s%n",
      album.getId(),
      album.getTitle(),
      album.getCoverImageUrl() != null ? album.getCoverImageUrl() : "нет");
  }
}