package com.music.model;

import java.sql.ResultSet;
import java.sql.SQLException;

public class Genre extends BaseEntity {
  private String name;

  @Override
  public void fromResultSet(ResultSet rs) throws SQLException {
    this.id = rs.getInt("id");
    this.name = rs.getString("name");
  }

  @Override
  public String getTableName() {
    return "genres";
  }

  @Override
  public String getInsertQuery() {
    return "INSERT INTO genres (name) VALUES (?)";
  }

  @Override
  public String getUpdateQuery() {
    return "UPDATE genres SET name = ? WHERE id = ?";
  }

  @Override
  public Object[] getInsertParams() {
    return new Object[] { name };
  }

  @Override
  public Object[] getUpdateParams() {
    return new Object[] { name, id };
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }
}