package com.music.db;

import com.music.model.User;

public class UserDAO extends BaseDAO<User> {

  @Override
  protected User createEntity() {
    return new User();
  }

  public User findByEmail(String email) {
    return findByField("email", email);
  }

  public void deleteByEmail(String email) {
    deleteByField("email", email);
  }
}