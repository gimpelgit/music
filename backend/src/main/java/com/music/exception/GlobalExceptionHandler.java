package com.music.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.music.dto.response.ErrorResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(GenreNotFoundException.class)
  public ResponseEntity<ErrorResponse> handleGenreNotFound(GenreNotFoundException ex) {
    return new ResponseEntity<>(
      new ErrorResponse(ex.getMessage()),
      HttpStatus.NOT_FOUND
    );
  }

  @ExceptionHandler(GenreAlreadyExistsException.class)
  public ResponseEntity<ErrorResponse> handleGenreAlreadyExists(GenreAlreadyExistsException ex) {
    return new ResponseEntity<>(
      new ErrorResponse(ex.getMessage()),
      HttpStatus.CONFLICT
    );
  }

  @ExceptionHandler(ArtistNotFoundException.class)
  public ResponseEntity<ErrorResponse> handleArtistNotFound(ArtistNotFoundException ex) {
    return new ResponseEntity<>(
      new ErrorResponse(ex.getMessage()),
      HttpStatus.NOT_FOUND
    );
  }

  @ExceptionHandler(ArtistAlreadyExistsException.class)
  public ResponseEntity<ErrorResponse> handleArtistAlreadyExists(ArtistAlreadyExistsException ex) {
    return new ResponseEntity<>(
      new ErrorResponse(ex.getMessage()),
        HttpStatus.CONFLICT
    );
  }

  @ExceptionHandler(PlaylistNotFoundException.class)
  public ResponseEntity<ErrorResponse> handlePlaylistNotFound(PlaylistNotFoundException ex) {
    return new ResponseEntity<>(
      new ErrorResponse(ex.getMessage()),
      HttpStatus.NOT_FOUND
    );
  }

  @ExceptionHandler(AlbumNotFoundException.class)
  public ResponseEntity<ErrorResponse> handleAlbumNotFound(AlbumNotFoundException ex) {
    return new ResponseEntity<>(
      new ErrorResponse(ex.getMessage()),
      HttpStatus.NOT_FOUND
    );
  }

  @ExceptionHandler(TrackNotFoundException.class)
  public ResponseEntity<ErrorResponse> handleTrackNotFound(TrackNotFoundException ex) {
    return new ResponseEntity<>(
      new ErrorResponse(ex.getMessage()),
      HttpStatus.NOT_FOUND
    );
  }

  @ExceptionHandler(UserNotFoundException.class)
  public ResponseEntity<ErrorResponse> handleUserNotFound(UserNotFoundException ex) {
    return new ResponseEntity<>(
      new ErrorResponse(ex.getMessage()),
      HttpStatus.NOT_FOUND
    );
  }

  @ExceptionHandler(UserAlreadyExistsException.class)
  public ResponseEntity<ErrorResponse> handleUserAlreadyExists(UserAlreadyExistsException ex) {
    return new ResponseEntity<>(
      new ErrorResponse(ex.getMessage()),
      HttpStatus.CONFLICT
    );
  }

  @ExceptionHandler(RoleNotFoundException.class)
  public ResponseEntity<ErrorResponse> handleRoleNotFound(RoleNotFoundException ex) {
    return new ResponseEntity<>(
      new ErrorResponse(ex.getMessage()),
      HttpStatus.BAD_REQUEST
    );
  }

  @ExceptionHandler(BadCredentialsException.class)
  public ResponseEntity<ErrorResponse> handleBadCredentials(BadCredentialsException ex) {
    return new ResponseEntity<>(
      new ErrorResponse("Неверный email или пароль"),
      HttpStatus.UNAUTHORIZED
    );
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ErrorResponse> handleValidationExceptions(MethodArgumentNotValidException ex) {
    String errorMessage = ex.getBindingResult().getAllErrors().get(0).getDefaultMessage();
    return new ResponseEntity<>(
      new ErrorResponse(errorMessage),
      HttpStatus.BAD_REQUEST
    );
  }
}