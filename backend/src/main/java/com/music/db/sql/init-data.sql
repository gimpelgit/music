--
-- PostgreSQL database dump
--

\restrict hy8SXk3sFr2qKbCbpm5qxAgXWzfUAUHlzYnvT7Q6pm8WeuaNBqk5kaFFlQsQf1t

-- Dumped from database version 18.2 (Ubuntu 18.2-1.pgdg24.04+1)
-- Dumped by pg_dump version 18.2 (Ubuntu 18.2-1.pgdg24.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: albums; Type: TABLE DATA; Schema: public; Owner: psqluser
--

INSERT INTO public.albums (id, cover_image_url, title) VALUES (7, '/uploads/albums/486636_big.jpg', 'ANABIOS');
INSERT INTO public.albums (id, cover_image_url, title) VALUES (9, '/uploads/albums/389361_big.jpg', 'It''s My Life');
INSERT INTO public.albums (id, cover_image_url, title) VALUES (8, '/uploads/albums/319429_big.jpg', 'McMxc A.D.');
INSERT INTO public.albums (id, cover_image_url, title) VALUES (10, NULL, 'NCS');
INSERT INTO public.albums (id, cover_image_url, title) VALUES (1, '/uploads/albums/e5e44b05-4783-4a51-88f0-422868353712.jpg', 'The Mountain');
INSERT INTO public.albums (id, cover_image_url, title) VALUES (11, NULL, 'Пустой альбом 1');
INSERT INTO public.albums (id, cover_image_url, title) VALUES (12, NULL, 'Пустой альбом 2');
INSERT INTO public.albums (id, cover_image_url, title) VALUES (13, NULL, 'Пустой альбом 3');
INSERT INTO public.albums (id, cover_image_url, title) VALUES (14, NULL, 'Пустой альбом 4');
INSERT INTO public.albums (id, cover_image_url, title) VALUES (15, NULL, 'Пустой альбом 5');
INSERT INTO public.albums (id, cover_image_url, title) VALUES (16, NULL, 'Пустой альбом 6');
INSERT INTO public.albums (id, cover_image_url, title) VALUES (17, NULL, 'Пустой альбом 7');
INSERT INTO public.albums (id, cover_image_url, title) VALUES (18, NULL, 'Пустой альбом 8');


--
-- Data for Name: artists; Type: TABLE DATA; Schema: public; Owner: psqluser
--

INSERT INTO public.artists (id, name) VALUES (4, 'Сплин');
INSERT INTO public.artists (id, name) VALUES (5, 'Noize MC');
INSERT INTO public.artists (id, name) VALUES (6, 'Miyagi');
INSERT INTO public.artists (id, name) VALUES (7, 'Эндшпиль');
INSERT INTO public.artists (id, name) VALUES (8, 'Enigma');
INSERT INTO public.artists (id, name) VALUES (9, 'Dr. Alban');
INSERT INTO public.artists (id, name) VALUES (1, 'Miyagi & Эндшпиль');
INSERT INTO public.artists (id, name) VALUES (10, 'Gorillaz');
INSERT INTO public.artists (id, name) VALUES (3, 'Земфира');


--
-- Data for Name: genres; Type: TABLE DATA; Schema: public; Owner: psqluser
--

INSERT INTO public.genres (id, name) VALUES (1, 'Хип-хоп');
INSERT INTO public.genres (id, name) VALUES (2, 'Рэп');
INSERT INTO public.genres (id, name) VALUES (3, 'Рок');
INSERT INTO public.genres (id, name) VALUES (4, 'Альтернатива');
INSERT INTO public.genres (id, name) VALUES (5, 'Поп-рок');
INSERT INTO public.genres (id, name) VALUES (6, 'Панк-рок');
INSERT INTO public.genres (id, name) VALUES (7, 'Зарубежный рэп');
INSERT INTO public.genres (id, name) VALUES (8, 'Русский рэп');
INSERT INTO public.genres (id, name) VALUES (9, 'Русский поп');
INSERT INTO public.genres (id, name) VALUES (10, 'Зарубежный поп');
INSERT INTO public.genres (id, name) VALUES (11, 'Эмбиент');
INSERT INTO public.genres (id, name) VALUES (12, 'Музыка для танцев');


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: psqluser
--

INSERT INTO public.users (id, created_at, name, password, role, updated_at, username) VALUES (3, '2023-06-05 11:20:00', 'Дмитрий', '$2a$10$S6qhg/aJjuNsLic6PnoBE.tb6fMjsENm8gOqQ8taZ.pt4Eikf.HO6', 'ROLE_USER', NULL, 'dmitry');
INSERT INTO public.users (id, created_at, name, password, role, updated_at, username) VALUES (4, '2023-09-18 16:45:00', 'Анна', '$2a$10$S6qhg/aJjuNsLic6PnoBE.tb6fMjsENm8gOqQ8taZ.pt4Eikf.HO6', 'ROLE_USER', NULL, 'anna');
INSERT INTO public.users (id, created_at, name, password, role, updated_at, username) VALUES (5, '2024-01-10 10:00:00', 'Сергей', '$2a$10$S6qhg/aJjuNsLic6PnoBE.tb6fMjsENm8gOqQ8taZ.pt4Eikf.HO6', 'ROLE_USER', '2026-03-05 10:09:09.186672', 'sergey');
INSERT INTO public.users (id, created_at, name, password, role, updated_at, username) VALUES (10, '2026-03-12 10:09:08.798469', 'Витя', '$2a$10$LVKyUnOohHTsXWOSrE02Q.WLhPufT72F5gOkZl6pmt/pfwjsqfYae', 'ROLE_ADMIN', '2026-03-12 11:44:34.188698', 'test');
INSERT INTO public.users (id, created_at, name, password, role, updated_at, username) VALUES (1, '2023-01-15 09:30:00', 'Алексей', '$2a$10$S6qhg/aJjuNsLic6PnoBE.tb6fMjsENm8gOqQ8taZ.pt4Eikf.HO6', 'ROLE_ADMIN', '2026-03-12 11:48:35.908076', 'admin');
INSERT INTO public.users (id, created_at, name, password, role, updated_at, username) VALUES (2, '2023-03-22 14:15:00', 'Елена', '$2a$10$e/vEozUxoBfXuRCtpaAUL.73Jem.2K3O9D7njOTpmQDZ0QW4CZRwe', 'ROLE_USER', '2026-03-12 11:57:32.914713', 'elena');


--
-- Data for Name: playlists; Type: TABLE DATA; Schema: public; Owner: psqluser
--

INSERT INTO public.playlists (id, cover_image_url, is_public, name, user_id) VALUES (2, 'https://example.com/playlists/sport.jpg', false, 'Тренировка 2024', 3);
INSERT INTO public.playlists (id, cover_image_url, is_public, name, user_id) VALUES (12, NULL, false, 'Тестовый', 2);
INSERT INTO public.playlists (id, cover_image_url, is_public, name, user_id) VALUES (13, NULL, true, 'Какой-то плейлист', 5);
INSERT INTO public.playlists (id, cover_image_url, is_public, name, user_id) VALUES (14, NULL, true, 'Лучшие треки', 4);
INSERT INTO public.playlists (id, cover_image_url, is_public, name, user_id) VALUES (6, NULL, true, 'Плейлист1', 1);
INSERT INTO public.playlists (id, cover_image_url, is_public, name, user_id) VALUES (8, NULL, false, 'Плейлист', 1);


--
-- Data for Name: tracks; Type: TABLE DATA; Schema: public; Owner: psqluser
--

INSERT INTO public.tracks (id, duration_seconds, file_url, lyrics, release_date, title, album_id) VALUES (22, 240, '/uploads/tracks/1102.mp3', NULL, NULL, 'It''s My Life', 9);
INSERT INTO public.tracks (id, duration_seconds, file_url, lyrics, release_date, title, album_id) VALUES (11, 184, '/uploads/tracks/4acc9031-f646-4755-b531-c4ce68276207.mp3', NULL, NULL, 'Adapter', 7);
INSERT INTO public.tracks (id, duration_seconds, file_url, lyrics, release_date, title, album_id) VALUES (1, 285, '/uploads/tracks/e5336d88-a356-4d7b-9e9f-c8eace8c6d09.mp3', 'Там где нас нет, там где нас нет...', NULL, 'The Happy Dictator', 1);
INSERT INTO public.tracks (id, duration_seconds, file_url, lyrics, release_date, title, album_id) VALUES (16, 141, '/uploads/tracks/b4c01a4d-ec67-404a-af11-8c05d04cdac2.mp3', NULL, '1990-01-01', 'The Voice of Enigma', 8);
INSERT INTO public.tracks (id, duration_seconds, file_url, lyrics, release_date, title, album_id) VALUES (20, 101, '/uploads/tracks/7198d3a3-aa72-4845-a167-f7607471e04c.mp3', NULL, '1990-01-01', 'The Voice and The Snake', 8);
INSERT INTO public.tracks (id, duration_seconds, file_url, lyrics, release_date, title, album_id) VALUES (26, 439, '/uploads/tracks/9392e832-f8ff-48b4-b217-57d3e2d26264.mp3', NULL, NULL, 'The Manifesto', 1);
INSERT INTO public.tracks (id, duration_seconds, file_url, lyrics, release_date, title, album_id) VALUES (15, 155, '/uploads/tracks/ae8026d7-a8b5-41e6-9c6e-fc4dc4f62dde.mp3', NULL, NULL, 'Scary move', 7);
INSERT INTO public.tracks (id, duration_seconds, file_url, lyrics, release_date, title, album_id) VALUES (14, 144, '/uploads/tracks/6665b63f-d4f3-49e8-bb84-dca010ba489f.mp3', NULL, NULL, 'Skill', 7);
INSERT INTO public.tracks (id, duration_seconds, file_url, lyrics, release_date, title, album_id) VALUES (13, 145, '/uploads/tracks/1e5571e3-3e3a-493e-b19d-8232d305add4.mp3', NULL, NULL, 'Vector', 7);
INSERT INTO public.tracks (id, duration_seconds, file_url, lyrics, release_date, title, album_id) VALUES (12, 120, '/uploads/tracks/6c8d48a7-b470-4739-9ae9-7a2d663d0506.mp3', NULL, NULL, 'West', 7);
INSERT INTO public.tracks (id, duration_seconds, file_url, lyrics, release_date, title, album_id) VALUES (23, 196, '/uploads/tracks/acc98318-fea5-4553-94c1-a32f83fcc199.mp3', NULL, NULL, 'I Feel The Music', 9);
INSERT INTO public.tracks (id, duration_seconds, file_url, lyrics, release_date, title, album_id) VALUES (25, 245, '/uploads/tracks/e9b09775-a42c-42f1-b5aa-36384f304391.mp3', NULL, NULL, 'I Said It Once', 9);
INSERT INTO public.tracks (id, duration_seconds, file_url, lyrics, release_date, title, album_id) VALUES (24, 255, '/uploads/tracks/05b700d0-3231-448f-a906-a52a849ac200.mp3', NULL, NULL, 'One Love', 9);
INSERT INTO public.tracks (id, duration_seconds, file_url, lyrics, release_date, title, album_id) VALUES (21, 636, '/uploads/tracks/e7b7a196-83bf-4880-891b-7cfde4cb1319.mp3', NULL, '1990-01-01', 'Back To The Rivers of Belief', 8);
INSERT INTO public.tracks (id, duration_seconds, file_url, lyrics, release_date, title, album_id) VALUES (18, 270, '/uploads/tracks/24b85026-29bc-4d39-8bbd-7fd416e3f167.mp3', NULL, '1990-01-01', 'Callas Went Away', 8);
INSERT INTO public.tracks (id, duration_seconds, file_url, lyrics, release_date, title, album_id) VALUES (19, 301, '/uploads/tracks/e3d95496-1282-45a1-afae-631493a917a0.mp3', NULL, '1990-01-01', 'Mea Culpa', 8);
INSERT INTO public.tracks (id, duration_seconds, file_url, lyrics, release_date, title, album_id) VALUES (17, 714, '/uploads/tracks/cd28287f-ab61-4fbf-8c29-051a39d535b6.mp3', NULL, '1990-01-01', 'Principles of Lust', 8);


--
-- Data for Name: playlists_tracks; Type: TABLE DATA; Schema: public; Owner: psqluser
--

INSERT INTO public.playlists_tracks (id, "position", playlist_id, track_id) VALUES (8, 4, 2, 1);
INSERT INTO public.playlists_tracks (id, "position", playlist_id, track_id) VALUES (29, 0, 13, 21);
INSERT INTO public.playlists_tracks (id, "position", playlist_id, track_id) VALUES (30, 1, 13, 18);
INSERT INTO public.playlists_tracks (id, "position", playlist_id, track_id) VALUES (31, 0, 14, 22);
INSERT INTO public.playlists_tracks (id, "position", playlist_id, track_id) VALUES (32, 0, 8, 18);
INSERT INTO public.playlists_tracks (id, "position", playlist_id, track_id) VALUES (22, 0, 6, 11);
INSERT INTO public.playlists_tracks (id, "position", playlist_id, track_id) VALUES (23, 2, 6, 15);
INSERT INTO public.playlists_tracks (id, "position", playlist_id, track_id) VALUES (24, 1, 6, 14);


--
-- Data for Name: tracks_artists; Type: TABLE DATA; Schema: public; Owner: psqluser
--

INSERT INTO public.tracks_artists (track_id, artist_id) VALUES (14, 6);
INSERT INTO public.tracks_artists (track_id, artist_id) VALUES (14, 7);
INSERT INTO public.tracks_artists (track_id, artist_id) VALUES (13, 6);
INSERT INTO public.tracks_artists (track_id, artist_id) VALUES (13, 7);
INSERT INTO public.tracks_artists (track_id, artist_id) VALUES (12, 6);
INSERT INTO public.tracks_artists (track_id, artist_id) VALUES (12, 7);
INSERT INTO public.tracks_artists (track_id, artist_id) VALUES (23, 9);
INSERT INTO public.tracks_artists (track_id, artist_id) VALUES (25, 9);
INSERT INTO public.tracks_artists (track_id, artist_id) VALUES (24, 9);
INSERT INTO public.tracks_artists (track_id, artist_id) VALUES (21, 8);
INSERT INTO public.tracks_artists (track_id, artist_id) VALUES (15, 6);
INSERT INTO public.tracks_artists (track_id, artist_id) VALUES (15, 7);
INSERT INTO public.tracks_artists (track_id, artist_id) VALUES (18, 8);
INSERT INTO public.tracks_artists (track_id, artist_id) VALUES (19, 8);
INSERT INTO public.tracks_artists (track_id, artist_id) VALUES (17, 8);
INSERT INTO public.tracks_artists (track_id, artist_id) VALUES (22, 9);
INSERT INTO public.tracks_artists (track_id, artist_id) VALUES (26, 10);
INSERT INTO public.tracks_artists (track_id, artist_id) VALUES (11, 6);
INSERT INTO public.tracks_artists (track_id, artist_id) VALUES (11, 7);
INSERT INTO public.tracks_artists (track_id, artist_id) VALUES (1, 10);
INSERT INTO public.tracks_artists (track_id, artist_id) VALUES (16, 8);
INSERT INTO public.tracks_artists (track_id, artist_id) VALUES (20, 8);


--
-- Data for Name: tracks_genres; Type: TABLE DATA; Schema: public; Owner: psqluser
--

INSERT INTO public.tracks_genres (track_id, genre_id) VALUES (17, 10);
INSERT INTO public.tracks_genres (track_id, genre_id) VALUES (17, 11);
INSERT INTO public.tracks_genres (track_id, genre_id) VALUES (20, 10);
INSERT INTO public.tracks_genres (track_id, genre_id) VALUES (20, 11);
INSERT INTO public.tracks_genres (track_id, genre_id) VALUES (15, 7);
INSERT INTO public.tracks_genres (track_id, genre_id) VALUES (15, 8);
INSERT INTO public.tracks_genres (track_id, genre_id) VALUES (15, 9);
INSERT INTO public.tracks_genres (track_id, genre_id) VALUES (26, 7);
INSERT INTO public.tracks_genres (track_id, genre_id) VALUES (26, 1);
INSERT INTO public.tracks_genres (track_id, genre_id) VALUES (22, 9);
INSERT INTO public.tracks_genres (track_id, genre_id) VALUES (22, 10);
INSERT INTO public.tracks_genres (track_id, genre_id) VALUES (22, 12);
INSERT INTO public.tracks_genres (track_id, genre_id) VALUES (14, 7);
INSERT INTO public.tracks_genres (track_id, genre_id) VALUES (14, 8);
INSERT INTO public.tracks_genres (track_id, genre_id) VALUES (14, 9);
INSERT INTO public.tracks_genres (track_id, genre_id) VALUES (13, 7);
INSERT INTO public.tracks_genres (track_id, genre_id) VALUES (11, 7);
INSERT INTO public.tracks_genres (track_id, genre_id) VALUES (11, 8);
INSERT INTO public.tracks_genres (track_id, genre_id) VALUES (11, 9);
INSERT INTO public.tracks_genres (track_id, genre_id) VALUES (13, 8);
INSERT INTO public.tracks_genres (track_id, genre_id) VALUES (13, 9);
INSERT INTO public.tracks_genres (track_id, genre_id) VALUES (12, 7);
INSERT INTO public.tracks_genres (track_id, genre_id) VALUES (12, 8);
INSERT INTO public.tracks_genres (track_id, genre_id) VALUES (12, 9);
INSERT INTO public.tracks_genres (track_id, genre_id) VALUES (23, 1);
INSERT INTO public.tracks_genres (track_id, genre_id) VALUES (23, 10);
INSERT INTO public.tracks_genres (track_id, genre_id) VALUES (23, 12);
INSERT INTO public.tracks_genres (track_id, genre_id) VALUES (25, 1);
INSERT INTO public.tracks_genres (track_id, genre_id) VALUES (25, 10);
INSERT INTO public.tracks_genres (track_id, genre_id) VALUES (25, 12);
INSERT INTO public.tracks_genres (track_id, genre_id) VALUES (24, 1);
INSERT INTO public.tracks_genres (track_id, genre_id) VALUES (24, 10);
INSERT INTO public.tracks_genres (track_id, genre_id) VALUES (24, 12);
INSERT INTO public.tracks_genres (track_id, genre_id) VALUES (21, 10);
INSERT INTO public.tracks_genres (track_id, genre_id) VALUES (21, 11);
INSERT INTO public.tracks_genres (track_id, genre_id) VALUES (18, 10);
INSERT INTO public.tracks_genres (track_id, genre_id) VALUES (18, 11);
INSERT INTO public.tracks_genres (track_id, genre_id) VALUES (19, 10);
INSERT INTO public.tracks_genres (track_id, genre_id) VALUES (19, 11);
INSERT INTO public.tracks_genres (track_id, genre_id) VALUES (1, 7);
INSERT INTO public.tracks_genres (track_id, genre_id) VALUES (16, 10);
INSERT INTO public.tracks_genres (track_id, genre_id) VALUES (16, 11);


--
-- Name: albums_id_seq; Type: SEQUENCE SET; Schema: public; Owner: psqluser
--

SELECT pg_catalog.setval('public.albums_id_seq', 18, true);


--
-- Name: artists_id_seq; Type: SEQUENCE SET; Schema: public; Owner: psqluser
--

SELECT pg_catalog.setval('public.artists_id_seq', 11, true);


--
-- Name: genres_id_seq; Type: SEQUENCE SET; Schema: public; Owner: psqluser
--

SELECT pg_catalog.setval('public.genres_id_seq', 17, true);


--
-- Name: playlists_id_seq; Type: SEQUENCE SET; Schema: public; Owner: psqluser
--

SELECT pg_catalog.setval('public.playlists_id_seq', 16, true);


--
-- Name: playlists_tracks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: psqluser
--

SELECT pg_catalog.setval('public.playlists_tracks_id_seq', 34, true);


--
-- Name: tracks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: psqluser
--

SELECT pg_catalog.setval('public.tracks_id_seq', 27, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: psqluser
--

SELECT pg_catalog.setval('public.users_id_seq', 11, true);


--
-- PostgreSQL database dump complete
--

\unrestrict hy8SXk3sFr2qKbCbpm5qxAgXWzfUAUHlzYnvT7Q6pm8WeuaNBqk5kaFFlQsQf1t

