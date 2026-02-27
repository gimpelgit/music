package com.music.service;

import com.music.dto.UserDto;
import com.music.entity.User;
import com.music.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

  private UserRepository userRepository;

  public UserService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  public List<UserDto> getAllUsers() {
    return userRepository.findAll()
      .stream()
      .map(User::convertToDto)
      .toList();
  }

  public Optional<UserDto> getUserById(Long id) {
    return userRepository.findById(id)
      .map(User::convertToDto);
  }
}