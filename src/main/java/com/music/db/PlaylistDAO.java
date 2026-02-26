package com.music.db;

import com.music.model.Playlist;
import java.util.List;
import java.sql.*;
import java.util.ArrayList;

public class PlaylistDAO extends BaseDAO<Playlist> {
  @Override
  protected Playlist createEntity() {
    return new Playlist();
  }

  public List<Playlist> findByUserId(int userId) {
    List<Playlist> playlists = new ArrayList<>();
    String sql = "SELECT * FROM " + getTableName() + " WHERE user_id = ?";

    try (PreparedStatement pstmt = dbManager.getConnection().prepareStatement(sql)) {
      pstmt.setInt(1, userId);
      try (ResultSet rs = pstmt.executeQuery()) {
        while (rs.next()) {
          Playlist playlist = createEntity();
          playlist.fromResultSet(rs);
          playlists.add(playlist);
        }
      }
    } catch (SQLException e) {
      throw new RuntimeException("Ошибка поиска плейлистов по пользователю", e);
    }
    return playlists;
  }
}