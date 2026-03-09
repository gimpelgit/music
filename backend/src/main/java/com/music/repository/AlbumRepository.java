package com.music.repository;

import com.music.entity.Album;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface AlbumRepository extends JpaRepository<Album, Long> {
  
  @Query(value = """
    SELECT DISTINCT a FROM Album a 
    LEFT JOIN a.tracks t 
    LEFT JOIN t.artists art 
    LEFT JOIN t.genres g 
    WHERE (:#{#genreIds} IS NULL OR g.id IN :genreIds) 
    AND (:#{#artistIds} IS NULL OR art.id IN :artistIds) 
    GROUP BY a.id 
    HAVING (:#{#genreIds} IS NULL OR COUNT(DISTINCT g.id) = :genreCount) 
    AND (:#{#artistIds} IS NULL OR COUNT(DISTINCT art.id) = :artistCount)
    """)
  Page<Album> findAlbumsByGenresAndArtists(
    @Param("genreIds") List<Long> genreIds,
    @Param("artistIds") List<Long> artistIds,
    @Param("genreCount") Long genreCount,
    @Param("artistCount") Long artistCount,
    Pageable pageable);

  @Query(value = """
    SELECT COUNT(DISTINCT a) FROM Album a 
    LEFT JOIN a.tracks t 
    LEFT JOIN t.artists art 
    LEFT JOIN t.genres g 
    WHERE (:#{#genreIds} IS NULL OR g.id IN :genreIds) 
    AND (:#{#artistIds} IS NULL OR art.id IN :artistIds)
    """)
  long countByGenresAndArtists(
    @Param("genreIds") List<Long> genreIds,
    @Param("artistIds") List<Long> artistIds);
}