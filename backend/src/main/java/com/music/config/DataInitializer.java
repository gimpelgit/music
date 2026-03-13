package com.music.config;

import com.music.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.datasource.init.ScriptUtils;
import org.springframework.security.crypto.password.PasswordEncoder;

import javax.sql.DataSource;
import java.sql.Connection;

@Configuration
public class DataInitializer {

  @Bean
  public CommandLineRunner initData(
      UserRepository userRepository,
      DataSource dataSource,
      PasswordEncoder passwordEncoder) {
    return args -> {
      if (userRepository.count() == 0) {
        try (Connection connection = dataSource.getConnection()) {
          ScriptUtils.executeSqlScript(connection, new ClassPathResource("db/init-data.sql"));
        } catch (Exception e) {
          e.printStackTrace();
        }
      }
    };
  }
}