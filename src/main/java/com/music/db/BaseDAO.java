package com.music.db;

import com.music.model.BaseEntity;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public abstract class BaseDAO<T extends BaseEntity> {
  protected final DatabaseManager dbManager;

  public BaseDAO() {
    this.dbManager = DatabaseManager.getInstance();
  }

  public List<T> findAll() {
    List<T> entities = new ArrayList<>();
    String sql = "SELECT * FROM " + getTableName();

    try (Statement stmt = dbManager.getConnection().createStatement();
        ResultSet rs = stmt.executeQuery(sql)) {

      while (rs.next()) {
        T entity = createEntity();
        entity.fromResultSet(rs);
        entities.add(entity);
      }
    } catch (SQLException e) {
      throw new RuntimeException("Ошибка при выборке всех в таблице " + getTableName(), e);
    }
    return entities;
  }

  public T findById(int id) {
    String sql = "SELECT * FROM " + getTableName() + " WHERE id = ?";

    try (PreparedStatement pstmt = dbManager.getConnection().prepareStatement(sql)) {
      pstmt.setInt(1, id);
      try (ResultSet rs = pstmt.executeQuery()) {
        if (rs.next()) {
          T entity = createEntity();
          entity.fromResultSet(rs);
          return entity;
        }
      }
    } catch (SQLException e) {
      throw new RuntimeException("Ошибка поиска по id: " + id, e);
    }
    return null;
  }

  public void save(T entity) {
    String sql = entity.getId() == null ? entity.getInsertQuery() : entity.getUpdateQuery();

    try (PreparedStatement pstmt = dbManager.getConnection().prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
      Object[] params = entity.getId() == null ? entity.getInsertParams() : entity.getUpdateParams();

      for (int i = 0; i < params.length; i++) {
        pstmt.setObject(i + 1, params[i]);
      }
      
      pstmt.executeUpdate();

      if (entity.getId() == null) {
        try (ResultSet generatedKeys = pstmt.getGeneratedKeys()) {
          if (generatedKeys.next()) {
            entity.setId(generatedKeys.getInt(1));
          }
        }
      }
    } catch (SQLException e) {
      throw new RuntimeException("Ошибка сохранения сущности", e);
    }
  }

  public void delete(int id) {
    String sql = "DELETE FROM " + getTableName() + " WHERE id = ?";

    try (PreparedStatement pstmt = dbManager.getConnection().prepareStatement(sql)) {
      pstmt.setInt(1, id);
      pstmt.executeUpdate();

    } catch (SQLException e) {
      throw new RuntimeException("Ошибка удаления сущности", e);
    }
  }

  public void deleteByField(String fieldName, Object value) {
    String sql = "DELETE FROM " + getTableName() + " WHERE " + fieldName + " = ?";

    try (PreparedStatement pstmt = dbManager.getConnection().prepareStatement(sql)) {
      pstmt.setObject(1, value);
      pstmt.executeUpdate();

    } catch (SQLException e) {
      throw new RuntimeException("Ошибка удаления сущности по полю", e);
    }
  }

  public T findByField(String fieldName, Object value) {
    String sql = "SELECT * FROM " + getTableName() + " WHERE " + fieldName + " = ?";

    try (PreparedStatement pstmt = dbManager.getConnection().prepareStatement(sql)) {
      pstmt.setObject(1, value);
      try (ResultSet rs = pstmt.executeQuery()) {
        if (rs.next()) {
          T entity = createEntity();
          entity.fromResultSet(rs);
          return entity;
        }
      }
    } catch (SQLException e) {
      throw new RuntimeException("Ошибка поиска сущности по полю", e);
    }
    return null;
  }

  public String getTableName() {
    return createEntity().getTableName();
  }

  protected abstract T createEntity();
}