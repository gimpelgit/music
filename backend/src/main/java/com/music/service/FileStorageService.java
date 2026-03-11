package com.music.service;

import com.music.exception.AudioFileUploadException;
import com.music.exception.FileUploadException;
import com.music.exception.InvalidAudioFileException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
public class FileStorageService {

  @Value("${upload.albums.path}")
  private String albumsUploadPath;

  @Value("${upload.albums.url}")
  private String albumsUploadUrl;

  @Value("${upload.tracks.path}")
  private String tracksUploadPath;

  @Value("${upload.tracks.url}")
  private String tracksUploadUrl;

  @Value("${upload.playlists.path}")
  private String playlistsUploadPath;

  @Value("${upload.playlists.url}")
  private String playlistsUploadUrl;

  private static final List<String> ALLOWED_AUDIO_TYPES = Arrays.asList(
    "audio/mpeg", "audio/mp3", "audio/wav", "audio/ogg", "audio/aac"
  );

  private static final long MAX_AUDIO_SIZE = 50 * 1024 * 1024l;

  public String saveAlbumImage(MultipartFile file) {
    return saveImage(file, albumsUploadPath, albumsUploadUrl);
  }

  public String savePlaylistImage(MultipartFile file) {
    return saveImage(file, playlistsUploadPath, playlistsUploadUrl);
  }

  private String saveImage(MultipartFile file, String uploadPath, String uploadUrl) {
    if (file == null || file.isEmpty()) {
      return null;
    }

    validateImage(file);

    try {
      Path uploadDir = Paths.get(uploadPath);
      if (!Files.exists(uploadDir)) {
        Files.createDirectories(uploadDir);
      }

      String filename = generateFilename(file.getOriginalFilename());
      Path filePath = uploadDir.resolve(filename);
      Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

      return uploadUrl + filename;

    } catch (IOException e) {
      throw new FileUploadException("Не удалось сохранить файл");
    }
  }

  public String saveTrackAudio(MultipartFile file) {
    if (file == null || file.isEmpty()) {
      throw new InvalidAudioFileException("Аудиофайл не может быть пустым");
    }

    validateAudioFile(file);

    try {
      Path uploadDir = Paths.get(tracksUploadPath);
      if (!Files.exists(uploadDir)) {
        Files.createDirectories(uploadDir);
      }

      String filename = generateFilename(file.getOriginalFilename());
      Path filePath = uploadDir.resolve(filename);
      Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

      return tracksUploadUrl + filename;

    } catch (IOException e) {
      throw new AudioFileUploadException("Не удалось сохранить аудиофайл");
    }
  }

  public void deleteAlbumImage(String imageUrl) {
    deleteFile(imageUrl, albumsUploadPath);
  }

  public void deletePlaylistImage(String imageUrl) {
    deleteFile(imageUrl, playlistsUploadPath);
  }

  public void deleteTrackAudio(String audioUrl) {
    deleteFile(audioUrl, tracksUploadPath);
  }

  private void deleteFile(String fileUrl, String uploadPath) {
    if (fileUrl == null || fileUrl.isEmpty()) {
      return;
    }

    try {
      String filename = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
      Path filePath = Paths.get(uploadPath).resolve(filename);
      Files.deleteIfExists(filePath);
    } catch (IOException e) {
      throw new FileUploadException("Не удалось удалить файл");
    }
  }

  private String generateFilename(String originalFilename) {
    String extension = "";
    if (originalFilename != null && originalFilename.contains(".")) {
      extension = originalFilename.substring(originalFilename.lastIndexOf("."));
    }
    return UUID.randomUUID() + extension;
  }

  private void validateImage(MultipartFile file) {
    String contentType = file.getContentType();
    if (contentType == null || !contentType.startsWith("image/")) {
      throw new FileUploadException("Файл должен быть изображением");
    }

    if (file.getSize() > 5 * 1024 * 1024) {
      throw new FileUploadException("Размер файла не должен превышать 5MB");
    }
  }

  private void validateAudioFile(MultipartFile file) {
    String contentType = file.getContentType();
    if (contentType == null || !ALLOWED_AUDIO_TYPES.contains(contentType)) {
      throw new InvalidAudioFileException("Файл должен быть аудиоформата (MP3, WAV, OGG, AAC)");
    }

    if (file.getSize() > MAX_AUDIO_SIZE) {
      throw new InvalidAudioFileException("Размер файла не должен превышать 50MB");
    }
  }
}