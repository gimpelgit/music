package com.music.model;

import java.sql.ResultSet;
import java.sql.SQLException;

public class Album extends BaseEntity {
  private String title;
  private String coverImageUrl;

  @Override
  public void fromResultSet(ResultSet rs) throws SQLException {
    this.id = rs.getInt("id");
    this.title = rs.getString("title");
    this.coverImageUrl = rs.getString("cover_image_url");
  }

  @Override
  public String getTableName() {
    return "albums";
  }

  @Override
  public String getInsertQuery() {
    return "INSERT INTO albums (title, cover_image_url) VALUES (?, ?)";
  }

  @Override
  public String getUpdateQuery() {
    return "UPDATE albums SET title = ?, cover_image_url = ? WHERE id = ?";
  }

  @Override
  public Object[] getInsertParams() {
    return new Object[] { title, coverImageUrl };
  }

  @Override
  public Object[] getUpdateParams() {
    return new Object[] { title, coverImageUrl, id };
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public String getCoverImageUrl() {
    return coverImageUrl;
  }

  public void setCoverImageUrl(String coverImageUrl) {
    this.coverImageUrl = coverImageUrl;
  }
}