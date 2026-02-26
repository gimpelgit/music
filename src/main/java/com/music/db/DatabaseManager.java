package com.music.db;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

import com.music.config.EnvLoader;

public class DatabaseManager {
  private static DatabaseManager instance;
  private Connection connection;

  private static final String URL = EnvLoader.getInstance().get("DB_URL", "jdbc:postgresql://localhost:5432/music");
  private static final String USER = EnvLoader.getInstance().get("DB_USER", "postgres");
  private static final String PASSWORD = EnvLoader.getInstance().get("DB_PASSWORD", "");

  private DatabaseManager() {
    try {
      this.connection = DriverManager.getConnection(URL, USER, PASSWORD);
    } catch (SQLException e) {
      throw new RuntimeException("Ошибка подключения к базе данных", e);
    }
  }

  public static DatabaseManager getInstance() {
    if (instance == null) {
      instance = new DatabaseManager();
    }
    return instance;
  }

  public Connection getConnection() {
    try {
      if (connection == null || connection.isClosed()) {
        connection = DriverManager.getConnection(URL, USER, PASSWORD);
      }
      return connection;
    } catch (SQLException e) {
      throw new RuntimeException("Ошибка подключения к базе данных", e);
    }
  }

  public void closeConnection() {
    try {
      if (connection != null && !connection.isClosed()) {
        connection.close();
      }
    } catch (SQLException e) {
      e.printStackTrace();
    }
  }
}