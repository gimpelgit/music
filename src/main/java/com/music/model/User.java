package com.music.model;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDateTime;

public class User extends BaseEntity {
  private String email;
  private String passwordHash;
  private String fullName;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
  private boolean isActive;

  @Override
  public void fromResultSet(ResultSet rs) throws SQLException {
    this.id = rs.getInt("id");
    this.email = rs.getString("email");
    this.passwordHash = rs.getString("password_hash");
    this.fullName = rs.getString("full_name");
    this.createdAt = rs.getTimestamp("created_at").toLocalDateTime();
    this.updatedAt = rs.getTimestamp("updated_at").toLocalDateTime();
    this.isActive = rs.getBoolean("is_active");
  }

  @Override
  public String getTableName() {
    return "users";
  }

  @Override
  public String getInsertQuery() {
    return "INSERT INTO users (email, password_hash, full_name, is_active) VALUES (?, ?, ?, ?)";
  }

  @Override
  public String getUpdateQuery() {
    return "UPDATE users SET email = ?, full_name = ?, password_hash = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?";
  }

  @Override
  public Object[] getInsertParams() {
    return new Object[] { email, passwordHash, fullName, isActive };
  }

  @Override
  public Object[] getUpdateParams() {
    return new Object[] { email, fullName, passwordHash, isActive, id };
  }


  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getPasswordHash() {
    return passwordHash;
  }

  public void setPasswordHash(String passwordHash) {
    this.passwordHash = passwordHash;
  }

  public String getFullName() {
    return fullName;
  }

  public void setFullName(String fullName) {
    this.fullName = fullName;
  }

  public LocalDateTime getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(LocalDateTime createdAt) {
    this.createdAt = createdAt;
  }

  public LocalDateTime getUpdatedAt() {
    return updatedAt;
  }

  public void setUpdatedAt(LocalDateTime updatedAt) {
    this.updatedAt = updatedAt;
  }

  public boolean isActive() {
    return isActive;
  }

  public void setActive(boolean active) {
    this.isActive = active;
  }
}