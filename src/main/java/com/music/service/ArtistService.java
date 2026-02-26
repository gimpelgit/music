package com.music.service;

import com.music.db.ArtistDAO;
import com.music.input.*;
import com.music.model.Artist;
import com.music.service.display.ArtistDisplayHelper;

public class ArtistService extends BaseService<Artist> {
  private final ArtistDAO artistDAO;

  public ArtistService() {
    super(new ArtistDAO(), new ArtistDisplayHelper());
    this.artistDAO = (ArtistDAO) super.dao;
  }

  @Override
  public void create() {
    System.out.println("\n--- Создание нового исполнителя ---");

    String fullName = new StringInputReader()
      .withMinLength(1)
      .read("Полное имя исполнителя:");

    Artist artist = new Artist();
    artist.setFullName(fullName);

    artistDAO.save(artist);
    System.out.println("Исполнитель создан с ID: " + artist.getId());
  }

  @Override
  public void update() {
    Integer id = new IntInputReader()
      .withMinVal(1)
      .read("Введите ID исполнителя для редактирования:");

    Artist artist = artistDAO.findById(id);
    if (artist == null) {
      System.out.println("Исполнитель не найден!");
      return;
    }

    System.out.println("\n--- Редактирование исполнителя (оставьте пустым для сохранения текущего значения) ---");
    displayHelper.display(artist);

    String fullName = new StringInputReader()
      .withDefault("")
      .read("Новое полное имя:");

    if (!fullName.isEmpty()) {
      artist.setFullName(fullName);
    }

    artistDAO.save(artist);
    System.out.println("Данные исполнителя обновлены!");
  }
}