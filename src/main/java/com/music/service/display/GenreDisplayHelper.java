package com.music.service.display;

import com.music.model.Genre;

public class GenreDisplayHelper implements EntityDisplayHelper<Genre> {
  @Override
  public void display(Genre genre) {
    System.out.printf("[%d] %s%n",
        genre.getId(),
        genre.getName());
  }
}