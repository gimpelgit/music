package com.music.service;

import com.music.db.PlaylistDAO;
import com.music.db.UserDAO;
import com.music.input.*;
import com.music.model.Playlist;
import com.music.model.User;
import com.music.service.display.PlaylistDisplayHelper;

public class PlaylistService extends BaseService<Playlist> {
  private final PlaylistDAO playlistDAO;
  private final UserDAO userDAO;

  public PlaylistService() {
    super(new PlaylistDAO(), new PlaylistDisplayHelper());
    this.playlistDAO = (PlaylistDAO) super.dao;
    this.userDAO = new UserDAO();
  }

  @Override
  public void create() {
    System.out.println("\n--- Создание нового плейлиста ---");

    String name = new StringInputReader()
      .withMinLength(1)
      .read("Название плейлиста:");

    Integer userId = new IntInputReader()
      .withMinVal(1)
      .read("ID владельца (пользователя):");

    User user = userDAO.findById(userId);
    if (user == null) {
      System.out.println("Пользователь не найден!");
      return;
    }

    Boolean isPublic = new BooleanInputReader()
      .withDefault(false)
      .read("Публичный плейлист? (да/Нет):");

    String coverImageUrl = new StringInputReader()
      .withDefault("")
      .read("URL обложки (необязательно):");

    Playlist playlist = new Playlist();
    playlist.setName(name);
    playlist.setUserId(userId);
    playlist.setIsPublic(isPublic);
    playlist.setCoverImageUrl(coverImageUrl.isEmpty() ? null : coverImageUrl);

    playlistDAO.save(playlist);
    System.out.println("Плейлист создан с ID: " + playlist.getId());
  }

  @Override
  public void update() {
    Integer id = new IntInputReader()
      .withMinVal(1)
      .read("Введите ID плейлиста для редактирования:");

    Playlist playlist = playlistDAO.findById(id);
    if (playlist == null) {
      System.out.println("Плейлист не найден!");
      return;
    }

    System.out.println("\n--- Редактирование плейлиста (оставьте пустым для сохранения текущего значения) ---");
    displayHelper.display(playlist);

    String name = new StringInputReader()
      .withDefault("")
      .read("Новое название плейлиста:");

    if (!name.isEmpty()) {
      playlist.setName(name);
    }

    Boolean changeUser = new BooleanInputReader()
      .withDefault(false)
      .read("Сменить владельца? (да/Нет):");

    if (changeUser) {
      Integer userId = new IntInputReader()
        .withMinVal(1)
        .read("ID нового владельца:");

      User user = userDAO.findById(userId);
      if (user == null) {
        System.out.println("Пользователь не найден! Владелец не изменен.");
      } else {
        playlist.setUserId(userId);
      }
    }

    Boolean changePublic = new BooleanInputReader()
      .withDefault(false)
      .read("Изменить статус доступа? (да/Нет):");

    if (changePublic) {
      System.out.println("Текущий статус: " + (playlist.getIsPublic() ? "Публичный" : "Приватный"));
      Boolean isPublic = new BooleanInputReader()
        .read("Сделать публичным? (да/нет):");
      playlist.setIsPublic(isPublic);
    }

    String coverImageUrl = new StringInputReader()
      .withDefault("")
      .read("Новый URL обложки:");

    if (!coverImageUrl.isEmpty()) {
      playlist.setCoverImageUrl(coverImageUrl);
    }

    playlistDAO.save(playlist);
    System.out.println("Данные плейлиста обновлены!");
  }

  public void findByUser() {
    Integer userId = new IntInputReader()
      .withMinVal(1)
      .read("Введите ID пользователя:");

    User user = userDAO.findById(userId);
    if (user == null) {
      System.out.println("Пользователь не найден!");
      return;
    }

    var playlists = playlistDAO.findByUserId(userId);
    if (playlists.isEmpty()) {
      System.out.println("У пользователя нет плейлистов");
    } else {
      System.out.println("\n=== Плейлисты пользователя " + user.getEmail() + " ===");
      for (Playlist playlist : playlists) {
        displayHelper.display(playlist);
      }
    }
  }
}