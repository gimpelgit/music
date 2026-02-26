package com.music.model;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;

public class Track extends BaseEntity {
  private String title;
  private Integer albumId;
  private Integer durationSeconds;
  private String fileUrl;
  private String lyrics;
  private LocalDate releaseDate;

  @Override
  public void fromResultSet(ResultSet rs) throws SQLException {
    this.id = rs.getInt("id");
    this.title = rs.getString("title");
    this.albumId = rs.getInt("album_id");
    this.durationSeconds = rs.getInt("duration_seconds");
    this.fileUrl = rs.getString("file_url");
    this.lyrics = rs.getString("lyrics");
    if (rs.getDate("release_date") != null)
      this.releaseDate = rs.getDate("release_date").toLocalDate();
  }

  @Override
  public String getTableName() {
    return "tracks";
  }

  @Override
  public String getInsertQuery() {
    return "INSERT INTO tracks (title, album_id, duration_seconds, file_url, lyrics, release_date) VALUES (?, ?, ?, ?, ?, ?)";
  }

  @Override
  public String getUpdateQuery() {
    return "UPDATE tracks SET title = ?, album_id = ?, duration_seconds = ?, file_url = ?, lyrics = ?, release_date = ? WHERE id = ?";
  }

  @Override
  public Object[] getInsertParams() {
    return new Object[] { title, albumId, durationSeconds, fileUrl, lyrics, releaseDate };
  }

  @Override
  public Object[] getUpdateParams() {
    return new Object[] { title, albumId, durationSeconds, fileUrl, lyrics, releaseDate, id };
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public Integer getAlbumId() {
    return albumId;
  }

  public void setAlbumId(Integer albumId) {
    this.albumId = albumId;
  }

  public Integer getDurationSeconds() {
    return durationSeconds;
  }

  public void setDurationSeconds(Integer durationSeconds) {
    this.durationSeconds = durationSeconds;
  }

  public String getFileUrl() {
    return fileUrl;
  }

  public void setFileUrl(String fileUrl) {
    this.fileUrl = fileUrl;
  }

  public String getLyrics() {
    return lyrics;
  }

  public void setLyrics(String lyrics) {
    this.lyrics = lyrics;
  }

  public LocalDate getReleaseDate() {
    return releaseDate;
  }

  public void setReleaseDate(LocalDate releaseDate) {
    this.releaseDate = releaseDate;
  }
}