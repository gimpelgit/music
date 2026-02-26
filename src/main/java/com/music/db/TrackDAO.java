package com.music.db;

import com.music.model.Track;
import java.util.List;
import java.sql.*;
import java.util.ArrayList;

public class TrackDAO extends BaseDAO<Track> {
  @Override
  protected Track createEntity() {
    return new Track();
  }

  public List<Track> findByAlbumId(int albumId) {
    List<Track> tracks = new ArrayList<>();
    String sql = "SELECT * FROM " + getTableName() + " WHERE album_id = ?";

    try (PreparedStatement pstmt = dbManager.getConnection().prepareStatement(sql)) {
      pstmt.setInt(1, albumId);
      try (ResultSet rs = pstmt.executeQuery()) {
        while (rs.next()) {
          Track track = createEntity();
          track.fromResultSet(rs);
          tracks.add(track);
        }
      }
    } catch (SQLException e) {
      throw new RuntimeException("Ошибка поиска треков по альбому", e);
    }
    return tracks;
  }
}