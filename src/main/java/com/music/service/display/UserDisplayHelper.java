package com.music.service.display;

import com.music.model.User;

public class UserDisplayHelper implements EntityDisplayHelper<User> {
  @Override
  public void display(User user) {
    System.out.printf("[%d] %s | %s | %s | Активен: %s%n",
      user.getId(),
      user.getEmail(),
      user.getFullName(),
      user.getPasswordHash(),
      user.isActive() ? "да" : "нет");
  }
}