CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);


CREATE TABLE IF NOT EXISTS artists (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL
);


CREATE TABLE IF NOT EXISTS genres (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);


CREATE TABLE IF NOT EXISTS albums (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    cover_image_url VARCHAR(255)
);


CREATE TABLE IF NOT EXISTS tracks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    album_id INTEGER REFERENCES albums(id) ON DELETE SET NULL,
    duration_seconds INTEGER NOT NULL,
    file_url VARCHAR(255) NOT NULL,
    lyrics TEXT,
    release_date DATE
);


CREATE TABLE IF NOT EXISTS tracks_artists (
    track_id INTEGER REFERENCES tracks(id) ON DELETE CASCADE,
    artist_id INTEGER REFERENCES artists(id) ON DELETE CASCADE,
    PRIMARY KEY (track_id, artist_id)
);


CREATE TABLE IF NOT EXISTS tracks_genres (
    track_id INTEGER REFERENCES tracks(id) ON DELETE CASCADE,
    genre_id INTEGER REFERENCES genres(id) ON DELETE CASCADE,
    PRIMARY KEY (track_id, genre_id)
);


CREATE TABLE IF NOT EXISTS playlists (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    is_public BOOLEAN DEFAULT false,
    cover_image_url VARCHAR(255)
);


CREATE TABLE IF NOT EXISTS playlists_tracks (
    playlist_id INTEGER REFERENCES playlists(id) ON DELETE CASCADE,
    track_id INTEGER REFERENCES tracks(id) ON DELETE CASCADE,
    position INTEGER NOT NULL,
    PRIMARY KEY (playlist_id, track_id)
);


CREATE TABLE IF NOT EXISTS user_favorites (
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    track_id INTEGER REFERENCES tracks(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, track_id)
);
