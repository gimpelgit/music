package com.music.repository;

import com.music.entity.Track;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TrackRepository extends JpaRepository<Track, Long> {
  List<Track> findByAlbumId(Long albumId);
}