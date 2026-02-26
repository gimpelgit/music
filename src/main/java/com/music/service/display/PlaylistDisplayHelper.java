package com.music.service.display;

import com.music.model.Playlist;

public class PlaylistDisplayHelper implements EntityDisplayHelper<Playlist> {
  @Override
  public void display(Playlist playlist) {
    System.out.printf("[%d] %s | ID пользователя: %d | Публичный: %s | Обложка: %s%n",
      playlist.getId(),
      playlist.getName(),
      playlist.getUserId(),
      playlist.getIsPublic() ? "да" : "нет",
      playlist.getCoverImageUrl() != null ? playlist.getCoverImageUrl() : "нет");
  }
}