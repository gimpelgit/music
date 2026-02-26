package com.music.service;

import com.music.db.AlbumDAO;
import com.music.input.*;
import com.music.model.Album;
import com.music.service.display.AlbumDisplayHelper;

public class AlbumService extends BaseService<Album> {
  private final AlbumDAO albumDAO;

  public AlbumService() {
    super(new AlbumDAO(), new AlbumDisplayHelper());
    this.albumDAO = (AlbumDAO) super.dao;
  }

  @Override
  public void create() {
    System.out.println("\n--- Создание нового альбома ---");

    String title = new StringInputReader()
      .withMinLength(1)
      .read("Название альбома:");

    String coverImageUrl = new StringInputReader()
      .withDefault("")
      .read("URL обложки (необязательно):");

    Album album = new Album();
    album.setTitle(title);
    album.setCoverImageUrl(coverImageUrl.isEmpty() ? null : coverImageUrl);

    albumDAO.save(album);
    System.out.println("Альбом создан с ID: " + album.getId());
  }

  @Override
  public void update() {
    Integer id = new IntInputReader()
      .withMinVal(1)
      .read("Введите ID альбома для редактирования:");

    Album album = albumDAO.findById(id);
    if (album == null) {
      System.out.println("Альбом не найден!");
      return;
    }

    System.out.println("\n--- Редактирование альбома (оставьте пустым для сохранения текущего значения) ---");
    displayHelper.display(album);

    String title = new StringInputReader()
      .withDefault("")
      .read("Новое название альбома:");

    if (!title.isEmpty()) {
      album.setTitle(title);
    }

    String coverImageUrl = new StringInputReader()
      .withDefault("")
      .read("Новый URL обложки:");

    if (!coverImageUrl.isEmpty()) {
      album.setCoverImageUrl(coverImageUrl);
    }

    albumDAO.save(album);
    System.out.println("Данные альбома обновлены!");
  }
}