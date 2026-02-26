package com.music;

import com.music.menu.ConsoleMenuBuilder;
import com.music.service.*;

public class Main {
  private static final UserService userService = new UserService();
  private static final ArtistService artistService = new ArtistService();
  private static final GenreService genreService = new GenreService();
  private static final AlbumService albumService = new AlbumService();
  private static final TrackService trackService = new TrackService();
  private static final PlaylistService playlistService = new PlaylistService();

  public static void main(String[] args) {
    new ConsoleMenuBuilder()
      .withTitle("Главное меню")
      .addItem("1", "Пользователи (users)", () ->
        new ConsoleMenuBuilder()
          .withTitle("Управление пользователями")
          .setSubMenu(true)
          .addItem("1", "Вывести всех пользователей", userService::displayAll)
          .addItem("2", "Найти пользователя по ID", userService::findById)
          .addItem("3", "Создать пользователя", userService::create)
          .addItem("4", "Изменить данные пользователя", userService::update)
          .addItem("5", "Удалить пользователя", () -> 
            new ConsoleMenuBuilder()
              .withTitle("Удаление пользователя")
              .setSubMenu(true)
              .addItem("1", "Удалить по ID", userService::deleteById)
              .addItem("2", "Удалить по email", userService::deleteByEmail)
              .build()
              .run()
          )
          .build()
          .run()
      )
      .addItem("2", "Исполнители (artists)", () ->
        new ConsoleMenuBuilder()
          .withTitle("Управление исполнителями")
          .setSubMenu(true)
          .addItem("1", "Вывести всех исполнителей", artistService::displayAll)
          .addItem("2", "Найти исполнителя по ID", artistService::findById)
          .addItem("3", "Создать исполнителя", artistService::create)
          .addItem("4", "Изменить данные исполнителя", artistService::update)
          .addItem("5", "Удалить исполнителя по ID", artistService::deleteById)
          .build()
          .run()
      )
      .addItem("3", "Жанры (genres)", () ->
        new ConsoleMenuBuilder()
          .withTitle("Управление жанрами")
          .setSubMenu(true)
          .addItem("1", "Вывести все жанры", genreService::displayAll)
          .addItem("2", "Найти жанр по ID", genreService::findById)
          .addItem("3", "Создать жанр", genreService::create)
          .addItem("4", "Изменить жанр", genreService::update)
          .addItem("5", "Удалить жанр", () ->
            new ConsoleMenuBuilder()
              .withTitle("Удаление жанра")
              .setSubMenu(true)
              .addItem("1", "Удалить по ID", genreService::deleteById)
              .addItem("2", "Удалить по названию", genreService::deleteByName)
              .build()
              .run()
          )
          .build()
          .run()
      )
      .addItem("4", "Альбомы (albums)", () ->
        new ConsoleMenuBuilder()
          .withTitle("Управление альбомами")
          .setSubMenu(true)
          .addItem("1", "Вывести все альбомы", albumService::displayAll)
          .addItem("2", "Найти альбом по ID", albumService::findById)
          .addItem("3", "Создать альбом", albumService::create)
          .addItem("4", "Изменить альбом", albumService::update)
          .addItem("5", "Удалить альбом по ID", albumService::deleteById)
          .build()
          .run()
      )
      .addItem("5", "Треки (tracks)", () ->
        new ConsoleMenuBuilder()
          .withTitle("Управление треками")
          .setSubMenu(true)
          .addItem("1", "Вывести все треки", trackService::displayAll)
          .addItem("2", "Найти трек по ID", trackService::findById)
          .addItem("3", "Найти треки по альбому", trackService::findByAlbum)
          .addItem("4", "Создать трек", trackService::create)
          .addItem("5", "Изменить трек", trackService::update)
          .addItem("6", "Удалить трек по ID", trackService::deleteById)
          .build()
          .run()
      )
      .addItem("6", "Плейлисты (playlists)", () ->
        new ConsoleMenuBuilder()
          .withTitle("Управление плейлистами")
          .setSubMenu(true)
          .addItem("1", "Вывести все плейлисты", playlistService::displayAll)
          .addItem("2", "Найти плейлист по ID", playlistService::findById)
          .addItem("3", "Найти плейлисты пользователя", playlistService::findByUser)
          .addItem("4", "Создать плейлист", playlistService::create)
          .addItem("5", "Изменить плейлист", playlistService::update)
          .addItem("6", "Удалить плейлист по ID", playlistService::deleteById)
          .build()
          .run()
      )
      .build()
      .run();
  }
}