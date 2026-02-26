package com.music.model;

import java.sql.ResultSet;
import java.sql.SQLException;

public abstract class BaseEntity {
  protected Integer id;

  public Integer getId() {
    return id;
  }

  public void setId(Integer id) {
    this.id = id;
  }

  public abstract void fromResultSet(ResultSet rs) throws SQLException;

  public abstract String getTableName();

  public abstract String getInsertQuery();

  public abstract String getUpdateQuery();

  public abstract Object[] getInsertParams();

  public abstract Object[] getUpdateParams();
}