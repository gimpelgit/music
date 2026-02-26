package com.music.service;

import com.music.db.TrackDAO;
import com.music.db.AlbumDAO;
import com.music.input.*;
import com.music.model.Track;
import com.music.model.Album;
import com.music.service.display.TrackDisplayHelper;
import java.time.LocalDate;
import java.util.List;

public class TrackService extends BaseService<Track> {
  private final TrackDAO trackDAO;
  private final AlbumDAO albumDAO;

  public TrackService() {
    super(new TrackDAO(), new TrackDisplayHelper());
    this.trackDAO = (TrackDAO) super.dao;
    this.albumDAO = new AlbumDAO();
  }

  @Override
  public void create() {
    System.out.println("\n--- Создание нового трека ---");

    String title = new StringInputReader()
      .withMinLength(1)
      .read("Название трека:");

    Integer albumId = null;
    Boolean hasAlbum = new BooleanInputReader()
      .withDefault(false)
      .read("Трек входит в альбом? (да/Нет):");

    if (hasAlbum) {
      albumId = new IntInputReader()
        .withMinVal(1)
        .read("ID альбома:");

      Album album = albumDAO.findById(albumId);
      if (album == null) {
        System.out.println("Альбом не найден! Трек будет создан без альбома.");
        albumId = null;
      }
    }

    Integer duration = new IntInputReader()
      .withMinVal(1)
      .withMaxVal(36000)
      .read("Длительность (секунды):");

    String fileUrl = new StringInputReader()
      .withMinLength(1)
      .read("URL файла:");

    String lyrics = new StringInputReader()
      .withDefault("")
      .read("Текст песни (необязательно):");

    Boolean hasReleaseDate = new BooleanInputReader()
      .withDefault(false)
      .read("Указать дату релиза? (да/Нет):");

    LocalDate releaseDate = null;
    if (hasReleaseDate) {
      Integer year = new IntInputReader()
        .withMinVal(1900)
        .withMaxVal(2100)
        .read("Год релиза:");
      Integer month = new IntInputReader()
        .withRange(1, 12)
        .read("Месяц (1-12):");
      Integer day = new IntInputReader()
        .withRange(1, 31)
        .read("День (1-31):");

      try {
        releaseDate = LocalDate.of(year, month, day);
      } catch (Exception e) {
        System.out.println("Некорректная дата. Трек будет создан без даты релиза.");
        releaseDate = null;
      }
    }

    Track track = new Track();
    track.setTitle(title);
    track.setAlbumId(albumId);
    track.setDurationSeconds(duration);
    track.setFileUrl(fileUrl);
    track.setLyrics(lyrics.isEmpty() ? null : lyrics);
    track.setReleaseDate(releaseDate);

    trackDAO.save(track);
    System.out.println("Трек создан с ID: " + track.getId());
  }

  @Override
  public void update() {
    Integer id = new IntInputReader()
      .withMinVal(1)
      .read("Введите ID трека для редактирования:");

    Track track = trackDAO.findById(id);
    if (track == null) {
      System.out.println("Трек не найден!");
      return;
    }

    System.out.println("\n--- Редактирование трека (оставьте пустым для сохранения текущего значения) ---");
    displayHelper.display(track);

    String title = new StringInputReader()
      .withDefault("")
      .read("Новое название трека:");

    if (!title.isEmpty()) {
      track.setTitle(title);
    }

    Boolean changeAlbum = new BooleanInputReader()
      .withDefault(false)
      .read("Изменить альбом? (да/Нет):");

    if (changeAlbum) {
      Boolean hasAlbum = new BooleanInputReader()
        .withDefault(track.getAlbumId() != null)
        .read("Трек будет входить в альбом? (да/нет):");

      if (hasAlbum) {
        Integer albumId = new IntInputReader()
          .withMinVal(1)
          .read("ID альбома:");

        Album album = albumDAO.findById(albumId);
        if (album == null) {
          System.out.println("Альбом не найден! Альбом не будет изменен.");
        } else {
          track.setAlbumId(albumId);
        }
      } else {
        track.setAlbumId(null);
      }
    }

    Boolean changeDuration = new BooleanInputReader()
      .withDefault(false)
      .read("Изменить длительность? (да/Нет):");

    if (changeDuration) {
      Integer duration = new IntInputReader()
        .withMinVal(1)
        .withMaxVal(36000)
        .read("Новая длительность (секунды):");
      track.setDurationSeconds(duration);
    }

    String fileUrl = new StringInputReader()
      .withDefault("")
      .read("Новый URL файла:");

    if (!fileUrl.isEmpty()) {
      track.setFileUrl(fileUrl);
    }

    String lyrics = new StringInputReader()
      .withDefault("")
      .read("Новый текст песни:");

    if (!lyrics.isEmpty()) {
      track.setLyrics(lyrics);
    }

    Boolean changeDate = new BooleanInputReader()
      .withDefault(false)
      .read("Изменить дату релиза? (да/Нет):");

    if (changeDate) {
      Boolean hasDate = new BooleanInputReader()
        .withDefault(track.getReleaseDate() != null)
        .read("Указать дату релиза? (да/нет):");

      if (hasDate) {
        Integer year = new IntInputReader()
          .withMinVal(1900)
          .withMaxVal(2100)
          .read("Год релиза:");
        Integer month = new IntInputReader()
          .withRange(1, 12)
          .read("Месяц (1-12):");
        Integer day = new IntInputReader()
          .withRange(1, 31)
          .read("День (1-31):");

        try {
          track.setReleaseDate(LocalDate.of(year, month, day));
        } catch (Exception e) {
          System.out.println("Некорректная дата. Дата релиза не будет изменена.");
        }
      } else {
        track.setReleaseDate(null);
      }
    }

    trackDAO.save(track);
    System.out.println("Данные трека обновлены!");
  }

  public void findByAlbum() {
    Integer albumId = new IntInputReader()
      .withMinVal(1)
      .read("Введите ID альбома:");

    Album album = albumDAO.findById(albumId);
    if (album == null) {
      System.out.println("Альбом не найден!");
      return;
    }

    List<Track> tracks = trackDAO.findByAlbumId(albumId);
    if (tracks.isEmpty()) {
      System.out.println("В этом альбоме нет треков");
    } else {
      System.out.println("\n=== Треки в альбоме '" + album.getTitle() + "' ===");
      for (Track track : tracks) {
        displayHelper.display(track);
      }
    }
  }
}