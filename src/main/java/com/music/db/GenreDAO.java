package com.music.db;

import com.music.model.Genre;

public class GenreDAO extends BaseDAO<Genre> {
  @Override
  protected Genre createEntity() {
    return new Genre();
  }

  public Genre findByName(String name) {
    return findByField("name", name);
  }

  public void deleteByName(String name) {
    deleteByField("name", name);
  }
}