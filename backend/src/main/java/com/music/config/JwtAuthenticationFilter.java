package com.music.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.music.dto.response.ErrorResponse;
import com.music.service.JwtService;
import com.music.service.UserDetailsServiceImpl;

import org.springframework.http.MediaType;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
  public static final String BEARER_PREFIX = "Bearer ";
  public static final String HEADER_NAME = "Authorization";
  private final JwtService jwtService;
  private final UserDetailsServiceImpl userDetailsService;
  private final ObjectMapper objectMapper;
  
  @Override
  protected void doFilterInternal(
      @NonNull HttpServletRequest request,
      @NonNull HttpServletResponse response,
      @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
    
    final String authHeader = request.getHeader(HEADER_NAME);

    if (authHeader == null || !authHeader.startsWith(BEARER_PREFIX)) {
      filterChain.doFilter(request, response);
      return;
    }

    final String jwt = authHeader.substring(BEARER_PREFIX.length());

    try {
      final String username = jwtService.extractUsername(jwt);

      if (username != null && !username.isEmpty() &&
          SecurityContextHolder.getContext().getAuthentication() == null
        ) {
        
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);

        if (Boolean.TRUE.equals(jwtService.validateToken(jwt, userDetails))) {
          SecurityContext context = SecurityContextHolder.createEmptyContext();

          UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
            userDetails,
            null,
            userDetails.getAuthorities()
          );

          authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
          context.setAuthentication(authToken);
          SecurityContextHolder.setContext(context);
        }
      }
    } catch (UsernameNotFoundException e) {
      sendErrorResponse(response, "Пользователь не авторизован");
      return;
    }
    filterChain.doFilter(request, response);
  }

  private void sendErrorResponse(HttpServletResponse response, String message) throws IOException {
    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
    response.setContentType(MediaType.APPLICATION_JSON_VALUE);
    response.setCharacterEncoding(StandardCharsets.UTF_8.name());
    
    ErrorResponse errorResponse = new ErrorResponse(message);
    objectMapper.writeValue(response.getWriter(), errorResponse);
  }
}