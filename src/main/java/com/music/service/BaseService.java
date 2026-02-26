package com.music.service;

import com.music.db.BaseDAO;
import com.music.input.*;
import com.music.model.BaseEntity;
import com.music.service.display.EntityDisplayHelper;

import java.util.List;

public abstract class BaseService<T extends BaseEntity> {
  protected final BaseDAO<T> dao;
  protected final EntityDisplayHelper<T> displayHelper;

  public BaseService(BaseDAO<T> dao, EntityDisplayHelper<T> displayHelper) {
    this.dao = dao;
    this.displayHelper = displayHelper;
  }

  public void displayAll() {
    List<T> entities = dao.findAll();
    if (entities.isEmpty()) {
      System.out.println("Таблица " + dao.getTableName() + " пуста");
    } else {
      System.out.println("\n=== Таблица " + dao.getTableName() + " ===");
      for (T entity : entities) {
        displayHelper.display(entity);
      }
    }
  }

  public void findById() {
    Integer id = new IntInputReader()
      .withMinVal(1)
      .read("Введите ID для поиска:");

    T entity = dao.findById(id);
    if (entity == null) {
      System.out.println("Запись не найдена!");
    } else {
      displayHelper.display(entity);
    }
  }

  public void deleteById() {
    Integer id = new IntInputReader()
      .withMinVal(1)
      .read("Введите ID для удаления:");

    T entity = dao.findById(id);
    if (entity == null) {
      System.out.println("Запись не найдена!");
      return;
    }

    displayHelper.display(entity);
    boolean confirm = new BooleanInputReader()
      .read("Вы уверены, что хотите удалить эту запись? (да/нет):");

    if (confirm) {
      dao.delete(id);
      System.out.println("Запись удалена!");
    } else {
      System.out.println("Удаление отменено");
    }
  }

  public abstract void create();

  public abstract void update();
}