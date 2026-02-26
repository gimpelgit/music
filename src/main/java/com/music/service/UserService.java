package com.music.service;

import com.music.db.UserDAO;
import com.music.input.*;
import com.music.model.User;
import com.music.service.display.UserDisplayHelper;

public class UserService extends BaseService<User> {
  private final UserDAO userDAO;
  private static final String DEFAULT_NAME = "Аноним";

  public UserService() {
    super(new UserDAO(), new UserDisplayHelper());
    this.userDAO = (UserDAO) super.dao;
  }

  @Override
  public void create() {
    System.out.println("\n--- Создание нового пользователя ---");

    String email = new StringInputReader()
      .withValidator(
          e -> e.contains("@") && e.contains("."),
          "Введите корректный email адрес")
      .read("Email:");

    if (userDAO.findByEmail(email) != null) {
      System.out.println("Пользователь с таким email уже существует!");
      return;
    }

    String password = new StringInputReader()
      .withMinLength(6)
      .read("Пароль (мин. 6 символов):");

    String fullName = new StringInputReader()
      .withDefault(DEFAULT_NAME)
      .read("Полное имя:");

    boolean isActive = new BooleanInputReader()
      .withDefault(true)
      .read("Активен? (Да/нет):");

    User user = new User();
    user.setEmail(email);
    user.setPasswordHash(hashPassword(password));
    user.setFullName(fullName);
    user.setActive(isActive);

    userDAO.save(user);
    System.out.println("Пользователь создан с ID: " + user.getId());
  }

  @Override
  public void update() {
    Integer id = new IntInputReader()
      .withMinVal(1)
      .read("Введите ID пользователя для редактирования:");

    User user = userDAO.findById(id);
    if (user == null) {
      System.out.println("Пользователь не найден!");
      return;
    }

    System.out.println("\n--- Редактирование пользователя (оставьте пустым для сохранения текущего значения) ---");
    displayHelper.display(user);

    String email = new StringInputReader()
      .withDefault("")
      .withValidator(
        e -> e.isEmpty() || (e.contains("@") && e.contains(".")),
        "Введите корректный email адрес")
      .read("Новый email:");

    if (!email.isEmpty()) {
      if (!email.equals(user.getEmail()) && userDAO.findByEmail(email) != null) {
        System.out.println("Пользователь с таким email уже существует!");
        return;
      }
      user.setEmail(email);
    }

    String fullName = new StringInputReader()
      .withDefault("")
      .read("Новое полное имя:");

    if (!fullName.isEmpty()) {
      user.setFullName(fullName);
    }

    Boolean changePassword = new BooleanInputReader()
      .withDefault(false)
      .read("Изменить пароль? (да/Нет):");

    if (changePassword) {
      String password = new StringInputReader()
        .withMinLength(6)
        .read("Новый пароль:");
      user.setPasswordHash(hashPassword(password));
    }

    Boolean changeActive = new BooleanInputReader()
      .withDefault(false)
      .read("Изменить статус активности? (да/Нет):");

    if (changeActive) {
      System.out.println("Текущий статус: " + (user.isActive() ? "Активен" : "Не активен"));
      Boolean active = new BooleanInputReader()
        .read("Сделать активным? (да/нет):");
      user.setActive(active);
    }

    userDAO.save(user);
    System.out.println("Данные пользователя обновлены!");
  }

  public void deleteByEmail() {
    String email = new StringInputReader()
      .withValidator(
        e -> e.contains("@") && e.contains("."),
        "Введите корректный email адрес")
      .read("Введите email пользователя для удаления:");

    User user = userDAO.findByEmail(email);
    if (user == null) {
      System.out.println("Пользователь не найден!");
      return;
    }

    displayHelper.display(user);
    boolean confirm = new BooleanInputReader()
      .read("Вы уверены, что хотите удалить этого пользователя? (да/нет):");

    if (confirm) {
      userDAO.deleteByEmail(email);
      System.out.println("Пользователь удален!");
    } else {
      System.out.println("Удаление отменено");
    }
  }

  private String hashPassword(String password) {
    return "hashed_" + password;
  }
}