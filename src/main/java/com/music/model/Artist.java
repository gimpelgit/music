package com.music.model;

import java.sql.ResultSet;
import java.sql.SQLException;

public class Artist extends BaseEntity {
  private String fullName;

  @Override
  public void fromResultSet(ResultSet rs) throws SQLException {
    this.id = rs.getInt("id");
    this.fullName = rs.getString("full_name");
  }

  @Override
  public String getTableName() {
    return "artists";
  }

  @Override
  public String getInsertQuery() {
    return "INSERT INTO artists (full_name) VALUES (?)";
  }

  @Override
  public String getUpdateQuery() {
    return "UPDATE artists SET full_name = ? WHERE id = ?";
  }

  @Override
  public Object[] getInsertParams() {
    return new Object[] { fullName };
  }

  @Override
  public Object[] getUpdateParams() {
    return new Object[] { fullName, id };
  }

  public String getFullName() {
    return fullName;
  }

  public void setFullName(String fullName) {
    this.fullName = fullName;
  }
}