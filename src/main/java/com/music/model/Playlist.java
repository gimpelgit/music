package com.music.model;

import java.sql.ResultSet;
import java.sql.SQLException;

public class Playlist extends BaseEntity {
  private String name;
  private Integer userId;
  private Boolean isPublic;
  private String coverImageUrl;

  @Override
  public void fromResultSet(ResultSet rs) throws SQLException {
    this.id = rs.getInt("id");
    this.name = rs.getString("name");
    this.userId = rs.getInt("user_id");
    this.isPublic = rs.getBoolean("is_public");
    this.coverImageUrl = rs.getString("cover_image_url");
  }

  @Override
  public String getTableName() {
    return "playlists";
  }

  @Override
  public String getInsertQuery() {
    return "INSERT INTO playlists (name, user_id, is_public, cover_image_url) VALUES (?, ?, ?, ?)";
  }

  @Override
  public String getUpdateQuery() {
    return "UPDATE playlists SET name = ?, user_id = ?, is_public = ?, cover_image_url = ? WHERE id = ?";
  }

  @Override
  public Object[] getInsertParams() {
    return new Object[] { name, userId, isPublic, coverImageUrl };
  }

  @Override
  public Object[] getUpdateParams() {
    return new Object[] { name, userId, isPublic, coverImageUrl, id };
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public Integer getUserId() {
    return userId;
  }

  public void setUserId(Integer userId) {
    this.userId = userId;
  }

  public Boolean getIsPublic() {
    return isPublic;
  }

  public void setIsPublic(Boolean isPublic) {
    this.isPublic = isPublic;
  }

  public String getCoverImageUrl() {
    return coverImageUrl;
  }

  public void setCoverImageUrl(String coverImageUrl) {
    this.coverImageUrl = coverImageUrl;
  }
}