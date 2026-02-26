package com.music.db;

import com.music.model.Album;

public class AlbumDAO extends BaseDAO<Album> {
  @Override
  protected Album createEntity() {
    return new Album();
  }
}