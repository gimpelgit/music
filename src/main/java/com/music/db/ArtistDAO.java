package com.music.db;

import com.music.model.Artist;

public class ArtistDAO extends BaseDAO<Artist> {
  @Override
  protected Artist createEntity() {
    return new Artist();
  }
}