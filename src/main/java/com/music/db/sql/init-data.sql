INSERT INTO users (role, username, password, name) VALUES 
('ROLE_ADMIN', 'admin',  '$2a$10$S6qhg/aJjuNsLic6PnoBE.tb6fMjsENm8gOqQ8taZ.pt4Eikf.HO6', 'Алексей'),
('ROLE_USER',  'elena',  '$2a$10$S6qhg/aJjuNsLic6PnoBE.tb6fMjsENm8gOqQ8taZ.pt4Eikf.HO6', 'Елена'),
('ROLE_USER',  'dmitry', '$2a$10$S6qhg/aJjuNsLic6PnoBE.tb6fMjsENm8gOqQ8taZ.pt4Eikf.HO6', 'Дмитрий'),
('ROLE_USER',  'anna',   '$2a$10$S6qhg/aJjuNsLic6PnoBE.tb6fMjsENm8gOqQ8taZ.pt4Eikf.HO6', 'Анна'),
('ROLE_USER',  'sergey', '$2a$10$S6qhg/aJjuNsLic6PnoBE.tb6fMjsENm8gOqQ8taZ.pt4Eikf.HO6', 'Сергей');

INSERT INTO artists (name) VALUES 
('Miyagi & Эндшпиль'),
('Баста'),
('Земфира'),
('Сплин'),
('Noize MC');

INSERT INTO genres (name) VALUES 
('Хип-хоп'),
('Рэп'),
('Рок'),
('Альтернатива'),
('Поп-рок');

INSERT INTO albums (title, cover_image_url) VALUES 
('HATTORI', NULL),
('Баста 40', 'https://example.com/covers/basta40.jpg'),
('Прости меня моя любовь', 'https://example.com/covers/zemfira.jpg'),
('Сигнал из космоса', NULL),
('Царь горы', 'https://example.com/covers/noizemc.jpg');

INSERT INTO tracks (title, album_id, duration_seconds, file_url, lyrics, release_date) VALUES 
('Там где нас нет', 1, 234, 'https://music.example.com/tam_gde_nas_net.mp3', 'Там где нас нет, там где нас нет...', '2022-11-15'),
('Самая', 2, 198, 'https://music.example.com/samaya.mp3', 'Ты самая, самая, самая...', '2020-12-25'),
('Хочешь?', 3, 215, 'https://music.example.com/hochesh.mp3', 'Пожалуйста, не умирай, или мне придётся тоже....', '2013-02-14'),
('Выхода нет', 4, 287, 'https://music.example.com/vyhoda_net.mp3', NULL, '2004-03-01'),
('Песня для радио', 5, 176, 'https://music.example.com/radio_song.mp3', 'Это песня для радио...', '2021-09-10'),
('HATTORI', 1, 243, 'https://music.example.com/hattori.mp3', 'Hattori Hattori...', '2022-11-15'),
('Медляк', 2, 254, 'https://music.example.com/medlyak.mp3', NULL, '2020-12-25'),
('Искала', 3, 268, 'https://music.example.com/iskala.mp3', NULL, '2013-02-14'),
('Мое сердце', 4, 225, 'https://music.example.com/my_heart.mp3', 'Мое сердце остановилось...', '2004-03-01'),
('На Марсе', 5, 192, 'https://music.example.com/on_mars.mp3', 'Мы могли бы жить на Марсе...', '2021-09-10');

INSERT INTO tracks_artists (track_id, artist_id) VALUES 
(1, 1), (2, 2), (3, 3), (4, 4), (5, 5),
(6, 1), (7, 2), (8, 3), (9, 4), (10, 5);

INSERT INTO tracks_genres (track_id, genre_id) VALUES 
(1, 1), (1, 2),  -- Miyagi - хип-хоп/рэп
(2, 2), (2, 5),  -- Баста - рэп/поп-рок
(3, 3), (3, 4),  -- Земфира - рок/альтернатива
(4, 3), (4, 5),  -- Сплин - рок/поп-рок
(5, 2), (5, 4),  -- Noize MC - рэп/альтернатива
(6, 1), (6, 2),
(7, 2), (7, 5),
(8, 3), (8, 4),
(9, 3), (9, 5),
(10, 2), (10, 4);

INSERT INTO playlists (name, user_id, is_public, cover_image_url) VALUES 
('Рок на все времена', 2, true, 'https://example.com/playlists/rock.jpg'),
('Тренировка 2024', 3, false, 'https://example.com/playlists/sport.jpg'),
('Для души', 4, true, 'https://example.com/playlists/soul.jpg'),
('В машину', 5, true, 'https://example.com/playlists/car.jpg');

INSERT INTO playlists_tracks (playlist_id, track_id, position) VALUES 
(1, 3, 1), (1, 4, 2), (1, 8, 3), (1, 9, 4),
(2, 2, 1), (2, 5, 2), (2, 10, 3), (2, 1, 4),
(3, 3, 1), (3, 4, 2), (3, 7, 3), (3, 8, 4),
(4, 1, 1), (4, 4, 2), (4, 5, 3), (4, 10, 4);
