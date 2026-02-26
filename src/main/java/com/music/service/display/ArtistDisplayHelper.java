package com.music.service.display;

import com.music.model.Artist;

public class ArtistDisplayHelper implements EntityDisplayHelper<Artist> {
  @Override
  public void display(Artist artist) {
    System.out.printf("[%d] %s%n",
      artist.getId(),
      artist.getFullName());
  }
}