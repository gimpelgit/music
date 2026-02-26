package com.music.menu;

public class MenuItem {
  private final String key;
  private final String description;
  private final Runnable action;

  public MenuItem(String key, String description, Runnable action) {
    this.key = key;
    this.description = description;
    this.action = action;
  }

  public String getKey() {
    return key;
  }

  public String getDescription() {
    return description;
  }

  public void execute() {
    action.run();
  }
}
