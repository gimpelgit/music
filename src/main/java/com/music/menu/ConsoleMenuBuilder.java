package com.music.menu;

import java.util.ArrayList;
import java.util.List;

public class ConsoleMenuBuilder {
  private String title;
  private final List<MenuItem> items = new ArrayList<>();
  private boolean isSubMenu = false;

  public ConsoleMenuBuilder withTitle(String title) {
    this.title = title;
    return this;
  }

  public ConsoleMenuBuilder setSubMenu(boolean isSubMenu) {
    this.isSubMenu = isSubMenu;
    return this;
  }

  public ConsoleMenuBuilder addItem(String key, String description, Runnable action) {
    items.add(new MenuItem(key, description, action));
    return this;
  }

  public ConsoleMenu build() {
    if (title == null || title.isEmpty()) {
      title = "Меню";
    }
    return new ConsoleMenu(title, items, isSubMenu);
  }
}
