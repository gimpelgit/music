package com.music.service.display;

import com.music.model.BaseEntity;

public interface EntityDisplayHelper<T extends BaseEntity> {
  void display(T entity);
}