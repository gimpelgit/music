package com.music.menu;

import java.util.List;

import com.music.input.StringInputReader;

public class ConsoleMenu {
  private final String title;
  private final List<MenuItem> items;
  private final boolean isSubMenu;

  public ConsoleMenu(String title, List<MenuItem> items, boolean isSubMenu) {
    this.title = title;
    this.items = items;
    this.isSubMenu = isSubMenu;
  }

  public ConsoleMenu(String title, List<MenuItem> items) {
    this.title = title;
    this.items = items;
    this.isSubMenu = false;
  }

  public void run() {
    while (true) {
      displayMenu();
      String choice = new StringInputReader().read("Ваш выбор:");

      if (choice.equalsIgnoreCase("0")) {
        break;
      }

      boolean found = false;
      for (MenuItem item : items) {
        if (item.getKey().equals(choice)) {
          item.execute();
          found = true;
          break;
        }
      }

      if (!found) {
        System.out.println("Неверный пункт меню. Попробуйте снова.");
      }

      System.out.println();
    }
  }

  private void displayMenu() {
    System.out.println("\n=== " + title + " ===");
    for (MenuItem item : items) {
      System.out.println(item.getKey() + ". " + item.getDescription());
    }
    String exitDescription = isSubMenu ? "Назад" : "Выход";
    System.out.println("0. " + exitDescription);
  }
}
