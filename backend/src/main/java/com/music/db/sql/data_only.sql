--
-- PostgreSQL database dump
--

\restrict e8y3A9RdmpzANnSiYOxmO1h79HYmSwJ7XE5bqghLmf2c26X90pEsT5vskujbZTP

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

COPY public.albums (id, cover_image_url, title) FROM stdin;
2	https://example.com/covers/basta40.jpg	Баста 40
3	https://example.com/covers/zemfira.jpg	Прости меня моя любовь
4	\N	Сигнал из космоса
5	https://example.com/covers/noizemc.jpg	Царь горы
8	/uploads/albums/319429_big.jpg	McMxc A.D.
7	/uploads/albums/486636_big.jpg	ANABIOS
9	/uploads/albums/389361_big.jpg	It's My Life
1	/uploads/albums/ec07b958-13c6-4f23-85a7-0a2155a73d45.jpg	The Mountain
\.


--
-- Data for Name: artists; Type: TABLE DATA; Schema: public; Owner: psqluser
--

COPY public.artists (id, name) FROM stdin;
2	Баста
3	Земфира
4	Сплин
5	Noize MC
6	Miyagi
7	Эндшпиль
8	Enigma
9	Dr. Alban
1	Miyagi & Эндшпиль
10	Gorillaz
\.


--
-- Data for Name: genres; Type: TABLE DATA; Schema: public; Owner: psqluser
--

COPY public.genres (id, name) FROM stdin;
1	Хип-хоп
2	Рэп
3	Рок
4	Альтернатива
5	Поп-рок
6	Панк-рок
7	Зарубежный рэп
8	Русский рэп
9	Русский поп
10	Зарубежный поп
11	Эмбиент
12	Музыка для танцев
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: psqluser
--

COPY public.users (id, created_at, name, password, role, updated_at, username) FROM stdin;
1	2023-01-15 09:30:00	Алексей	$2a$10$S6qhg/aJjuNsLic6PnoBE.tb6fMjsENm8gOqQ8taZ.pt4Eikf.HO6	ROLE_ADMIN	2026-03-10 11:43:55.9644	admin
2	2023-03-22 14:15:00	Елена	$2a$10$e/vEozUxoBfXuRCtpaAUL.73Jem.2K3O9D7njOTpmQDZ0QW4CZRwe	ROLE_USER	2026-03-10 11:32:42.859723	elena
3	2023-06-05 11:20:00	Дмитрий	$2a$10$S6qhg/aJjuNsLic6PnoBE.tb6fMjsENm8gOqQ8taZ.pt4Eikf.HO6	ROLE_USER	\N	dmitry
4	2023-09-18 16:45:00	Анна	$2a$10$S6qhg/aJjuNsLic6PnoBE.tb6fMjsENm8gOqQ8taZ.pt4Eikf.HO6	ROLE_USER	\N	anna
5	2024-01-10 10:00:00	Сергей	$2a$10$S6qhg/aJjuNsLic6PnoBE.tb6fMjsENm8gOqQ8taZ.pt4Eikf.HO6	ROLE_USER	2026-03-05 10:09:09.186672	sergey
\.


--
-- Data for Name: playlists; Type: TABLE DATA; Schema: public; Owner: psqluser
--

COPY public.playlists (id, cover_image_url, is_public, name, user_id) FROM stdin;
2	https://example.com/playlists/sport.jpg	f	Тренировка 2024	3
3	https://example.com/playlists/soul.jpg	t	Для души	4
4	https://example.com/playlists/car.jpg	t	В машину	5
1	https://example.com/playlists/rock.jpg	t	Рок на все времена	2
\.


--
-- Data for Name: tracks; Type: TABLE DATA; Schema: public; Owner: psqluser
--

COPY public.tracks (id, duration_seconds, file_url, lyrics, release_date, title, album_id) FROM stdin;
2	198	https://music.example.com/samaya.mp3	Ты самая, самая, самая...	2020-12-25	Самая	2
3	215	https://music.example.com/hochesh.mp3	Пожалуйста, не умирай, или мне придётся тоже....	2013-02-14	Хочешь?	3
4	287	https://music.example.com/vyhoda_net.mp3	\N	2004-03-01	Выхода нет	4
5	176	https://music.example.com/radio_song.mp3	Это песня для радио...	2021-09-10	Песня для радио	5
6	243	https://music.example.com/hattori.mp3	Hattori Hattori...	2022-11-15	HATTORI	1
7	254	https://music.example.com/medlyak.mp3	\N	2020-12-25	Медляк	2
8	268	https://music.example.com/iskala.mp3	\N	2013-02-14	Искала	3
9	225	https://music.example.com/my_heart.mp3	Мое сердце остановилось...	2004-03-01	Мое сердце	4
10	192	https://music.example.com/on_mars.mp3	Мы могли бы жить на Марсе...	2021-09-10	На Марсе	5
11	184	https://music.example.com/new_track.mp3	\N	\N	Adapter	7
12	120	https://music.example.com/new_track.mp3	\N	\N	West	7
13	145	https://music.example.com/new_track.mp3	\N	\N	Vector	7
14	144	https://music.example.com/new_track.mp3	\N	\N	Skill	7
15	144	https://music.example.com/new_track.mp3	\N	\N	Scary move	7
16	142	https://music.example.com/new_track.mp3	\N	1975-06-14	The Voice of Enigma	8
17	714	https://music.example.com/new_track.mp3	\N	1975-06-14	Principles of Lust	8
18	270	https://music.example.com/new_track.mp3	\N	1975-06-14	Callas Went Away	8
19	301	https://music.example.com/new_track.mp3	\N	1975-06-14	Mea Culpa	8
20	301	https://music.example.com/new_track.mp3	\N	1975-06-14	The Voice and The Snake	8
21	636	https://music.example.com/new_track.mp3	\N	1975-06-14	Back To The Rivers of Belief	8
23	196	https://music.example.com/new_track.mp3	\N	\N	I Feel The Music	9
24	255	https://music.example.com/new_track.mp3	\N	\N	One Love	9
25	245	https://music.example.com/new_track.mp3	\N	\N	I Said It Once	9
22	240	/uploads/tracks/1102.mp3	\N	\N	It's My Life	9
1	285	/uploads/tracks/e5336d88-a356-4d7b-9e9f-c8eace8c6d09.mp3	Там где нас нет, там где нас нет...	2022-11-15	The Happy Dictator	1
\.


--
-- Data for Name: playlists_tracks; Type: TABLE DATA; Schema: public; Owner: psqluser
--

COPY public.playlists_tracks (id, "position", playlist_id, track_id) FROM stdin;
1	1	1	3
2	2	1	4
3	3	1	8
4	4	1	9
5	1	2	2
6	2	2	5
7	3	2	10
8	4	2	1
9	1	3	3
10	2	3	4
11	3	3	7
12	4	3	8
13	1	4	1
14	2	4	4
15	3	4	5
16	4	4	10
\.


--
-- Data for Name: tracks_artists; Type: TABLE DATA; Schema: public; Owner: psqluser
--

COPY public.tracks_artists (track_id, artist_id) FROM stdin;
1	1
2	2
3	3
4	4
5	5
6	1
7	2
8	3
9	4
10	5
11	6
11	7
12	6
12	7
13	6
13	7
14	6
14	7
15	6
15	7
16	8
17	8
18	8
19	8
20	8
21	8
22	9
23	9
24	9
25	9
\.


--
-- Data for Name: tracks_genres; Type: TABLE DATA; Schema: public; Owner: psqluser
--

COPY public.tracks_genres (track_id, genre_id) FROM stdin;
1	1
1	2
2	2
2	5
3	3
3	4
4	3
4	5
5	2
5	4
6	1
6	2
7	2
7	5
8	3
8	4
9	3
9	5
10	2
10	4
11	7
11	8
11	9
12	7
12	8
12	9
13	7
13	8
13	9
14	7
14	8
14	9
15	7
15	8
15	9
16	10
16	11
17	10
17	11
18	10
18	11
19	10
19	11
20	10
20	11
21	10
21	11
22	9
22	10
22	12
23	1
23	10
23	12
24	1
24	10
24	12
25	1
25	10
25	12
\.


--
-- Name: albums_id_seq; Type: SEQUENCE SET; Schema: public; Owner: psqluser
--

SELECT pg_catalog.setval('public.albums_id_seq', 9, true);


--
-- Name: artists_id_seq; Type: SEQUENCE SET; Schema: public; Owner: psqluser
--

SELECT pg_catalog.setval('public.artists_id_seq', 10, true);


--
-- Name: genres_id_seq; Type: SEQUENCE SET; Schema: public; Owner: psqluser
--

SELECT pg_catalog.setval('public.genres_id_seq', 13, true);


--
-- Name: playlists_id_seq; Type: SEQUENCE SET; Schema: public; Owner: psqluser
--

SELECT pg_catalog.setval('public.playlists_id_seq', 5, true);


--
-- Name: playlists_tracks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: psqluser
--

SELECT pg_catalog.setval('public.playlists_tracks_id_seq', 16, true);


--
-- Name: tracks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: psqluser
--

SELECT pg_catalog.setval('public.tracks_id_seq', 25, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: psqluser
--

SELECT pg_catalog.setval('public.users_id_seq', 9, true);


--
-- PostgreSQL database dump complete
--

\unrestrict e8y3A9RdmpzANnSiYOxmO1h79HYmSwJ7XE5bqghLmf2c26X90pEsT5vskujbZTP

