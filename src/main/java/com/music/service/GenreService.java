package com.music.service;

import com.music.db.GenreDAO;
import com.music.input.*;
import com.music.model.Genre;
import com.music.service.display.GenreDisplayHelper;

public class GenreService extends BaseService<Genre> {
  private final GenreDAO genreDAO;

  public GenreService() {
    super(new GenreDAO(), new GenreDisplayHelper());
    this.genreDAO = (GenreDAO) super.dao;
  }

  @Override
  public void create() {
    System.out.println("\n--- Создание нового жанра ---");

    String name = new StringInputReader()
      .withMinLength(1)
      .read("Название жанра:");

    if (genreDAO.findByName(name) != null) {
      System.out.println("Жанр с таким названием уже существует!");
      return;
    }

    Genre genre = new Genre();
    genre.setName(name);

    genreDAO.save(genre);
    System.out.println("Жанр создан с ID: " + genre.getId());
  }

  @Override
  public void update() {
    Integer id = new IntInputReader()
      .withMinVal(1)
      .read("Введите ID жанра для редактирования:");

    Genre genre = genreDAO.findById(id);
    if (genre == null) {
      System.out.println("Жанр не найден!");
      return;
    }

    System.out.println("\n--- Редактирование жанра (оставьте пустым для сохранения текущего значения) ---");
    displayHelper.display(genre);

    String name = new StringInputReader()
      .withDefault("")
      .read("Новое название жанра:");

    if (!name.isEmpty()) {
      if (!name.equals(genre.getName()) && genreDAO.findByName(name) != null) {
        System.out.println("Жанр с таким названием уже существует!");
        return;
      }
      genre.setName(name);
    }

    genreDAO.save(genre);
    System.out.println("Данные жанра обновлены!");
  }

  public void deleteByName() {
    String name = new StringInputReader()
      .withMinLength(1)
      .read("Введите название жанра для удаления:");

    Genre genre = genreDAO.findByName(name);
    if (genre == null) {
      System.out.println("Жанр не найден!");
      return;
    }

    displayHelper.display(genre);
    boolean confirm = new BooleanInputReader()
      .read("Вы уверены, что хотите удалить этот жанр? (да/нет):");

    if (confirm) {
      genreDAO.deleteByName(name);
      System.out.println("Жанр удален!");
    } else {
      System.out.println("Удаление отменено");
    }
  }
}