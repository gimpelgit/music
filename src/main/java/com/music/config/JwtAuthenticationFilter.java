package com.music.config;

import com.music.service.JwtService;
import com.music.service.UserDetailsServiceImpl;

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
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
  public static final String BEARER_PREFIX = "Bearer ";
  public static final String HEADER_NAME = "Authorization";
  private final JwtService jwtService;
  private final UserDetailsServiceImpl userDetailsService;
  
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
    filterChain.doFilter(request, response);
  }
}