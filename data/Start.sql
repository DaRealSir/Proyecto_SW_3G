INSERT INTO company (name)
VALUES ('Nintendo'),
       ('Sony'),
       ('Microsoft'),
       ('CD Projekt Red'),
       ('Rockstar Games');

INSERT INTO game (title, description, rating, favNumber, image, company_id)
VALUES ('The Legend of Zelda: Breath of the Wild', 'Aventura en mundo abierto.', 9.8, 5000, '/img/games/botw.png', 1),
       ('God of War', 'Kratos y Atreus en una aventura épica.', 9.7, 4000, '/img/games/gow2018.png', 2),
       ('Halo Infinite', 'El Jefe Maestro regresa a la acción.', 8.5, 3500, '/img/games/halo_infinite.png', 3),
       ('The Witcher 3: Wild Hunt', 'Geralt en busca de Ciri.', 9.9, 6000, '/img/games/tw3.png', 4),
       ('Red Dead Redemption 2', 'La historia de Arthur Morgan en el Viejo Oeste.', 9.8, 7000, '/img/games/rdr2.png', 5),
       ('Super Mario Odyssey', 'La aventura de Mario junto a capi.', 9.8, 8000, 'https://m.media-amazon.com/images/I/71MQ0RSj1xL._AC_UF894,1000_QL80_.jpg', 1),
       ('Cyberpunk 2077', 'RPGS de mundo abierto en un futuro cyberpunk.', 9.2, 3000, 'https://image.api.playstation.com/vulcan/ap/rnd/202008/0416/6Bo40lnWU0BhgrOUm7Cb6by3.png', 4);

INSERT INTO genre (name)
VALUES ('Action'),
       ('Adventure'),
       ('RPG'),
       ('Shooter'),
       ('Open World');

INSERT INTO game_genre (game_id, genre_id)
VALUES (1, 2), -- Zelda - Adventure
       (1, 5), -- Zelda - Open World
       (2, 1), -- God of War - Action
       (3, 4), -- Halo - Shooter
       (4, 3), -- Witcher - RPG
       (4, 5), -- Witcher - Open World
       (5, 1), -- RDR2 - Action
       (5, 5); -- RDR2 - Open World

INSERT INTO user (username, bio, password, profile_picture, user_type)
VALUES ('User', 'Gamer de aventuras y RPGs.', '$2b$10$JdCg8yL3rRkkr.hhx1rjqOe30F9lhBlqA1sjYJW6ymzYExvQFHyjy',
        'alice.jpg', 'U'),
       ('Admin', 'Administrador del sistema.', '$2b$10$Htah5iG9eKj8ItIItpzK6uvny3c5/QjdZaLwwmFy32RPrfVspNgYS',
        'charlie.jpg', 'A');

INSERT INTO user_game (user_id, game_id)
VALUES (1, 1), -- Alice tiene Zelda
       (1, 2), -- Alice tiene God of War
       (2, 3), -- Bob tiene Halo
       (2, 4), -- Bob tiene The Witcher 3
       (3, 5); -- Charlie tiene Red Dead Redemption 2

INSERT INTO review (game_id, user_id, date, rating, description)
VALUES (1, 1, '2025-03-20 08:20:07', 8, 'esta golden este juego'),
       (1, 2, '2025-04-20 08:20:07', 4, 'pochillo este'),
       (1, 3, '2025-05-20 08:20:07', 10, 'literalmente el goty del año'),
       (2, 1, '2025-03-21 08:20:07', 3, 'viva canarias');


INSERT INTO forum_post (id, game_id, original_post_id, title, description, user_id, replies, position_post) VALUES
(1, 1, -1, 'Explorando Hyrule: Estrategias y builds', '¿Cómo optimizas tus habilidades y equipo en The Legend of Zelda: BotW? ¡Comparte tus mejores tácticas!', 2, 0, 1),
(2, 1, -1, 'Descubre nuevas formas de abordar el juego', '¿Qué opinas de las diferentes formas de explorar Hyrule? ¿Cuál es tu estilo de juego?', 3, 0, 2),
(3, 1, -1, 'El desafío de las tierras salvajes', 'Hablemos sobre las mejores builds y estrategias para sobrevivir en Hyrule. ¿Prefieres agilidad o poder?', 1, 0, 3),
(4, 1, 1, 'Re: Explorando Hyrule: Estrategias y builds', 'Mi build favorita es centrada en fuerza, uso el Gran Espadón Colosal para derribar a los enemigos más fuertes.', 3, 0, 1),
(5, 2, -1, 'God of War: Más que un combate', '¿Qué opinas de la narrativa de God of War? ¿Cómo influye la historia en el desarrollo del juego?', 1, 0, 1),
(6, 2, 5, 'Re: God of War: Más que un combate', 'La narrativa es impresionante, cada decisión de Kratos tiene un impacto profundo. Además, el mundo está tan bien construido.', 3, 0, 1),
(7, 3, -1, '¿Halo Infinite puede superar a la saga?', '¿Qué piensas de la historia y el multijugador de Halo Infinite? ¿Está a la altura de sus predecesores?', 1, 0, 1),
(8, 4, -1, 'El legado de The Witcher 3', '¿Crees que The Witcher 3 es el mejor RPG de todos los tiempos o hay otros que lo superan? ¡Comparte tu opinión!', 2, 0, 1),
(9, 5, -1, 'Red Dead Redemption 2: ¿La obra maestra de Rockstar?', '¿Qué opinas de la historia y la jugabilidad de Red Dead Redemption 2? ¿Es su mejor juego hasta la fecha?', 3, 0, 1),
(10, 5, 9, 'Re: Red Dead Redemption 2: ¿La obra maestra de Rockstar?', 'Es un juego impresionante, pero para mí GTA V tiene algo especial que no puedo superar. ¿A ti qué te parece?', 1, 0, 1),
(11, 5, 10, 'Re: Red Dead Redemption 2: ¿La obra maestra de Rockstar?', 'A mí me gustó más Red Dead Redemption 2. La atmósfera y la historia son más profundas, aunque GTA V es increíble también.', 2, 0, 1),
(12, 5, 11, 'Re: Red Dead Redemption 2: ¿La obra maestra de Rockstar?', 'Nunca olvidaré Bully, Rockstar dejó una gran marca con ese juego. Es una pena que nunca llegara la secuela.', 3, 0, 1),
(13, 1, -1, 'Explorando Hyrule: Estrategias y builds', '¿Cómo optimizas tus habilidades y equipo en The Legend of Zelda: BotW? ¡Comparte tus mejores tácticas!', 2, 0, 4),
(14, 1, -1, 'Descubre nuevas formas de abordar el juego', '¿Qué opinas de las diferentes formas de explorar Hyrule? ¿Cuál es tu estilo de juego?', 3, 0, 5),
(15, 1, -1, 'El desafío de las tierras salvajes', 'Hablemos sobre las mejores builds y estrategias para sobrevivir en Hyrule. ¿Prefieres agilidad o poder?', 1, 0, 6),
(16, 5, 11, 'Re: Explorando Hyrule: Estrategias y builds', 'Mi build favorita es centrada en fuerza, uso el Gran Espadón Colosal para derribar a los enemigos más fuertes.', 3, 0, 2),
(17, 5, 11, 'God of War: Más que un combate', '¿Qué opinas de la narrativa de God of War? ¿Cómo influye la historia en el desarrollo del juego?', 1, 0, 3),
(18, 5, 11, 'God of War: Más que un combate', '¿Qué opinas de la narrativa de God of War? ¿Cómo influye la historia en el desarrollo del juego?', 2, 0, 4),
(19, 5, 10, 'God of War: Más que un combate', '¿Qué opinas de la narrativa de God of War? ¿Cómo influye la historia en el desarrollo del juego?', 3, 0, 2),
(20, 5, 10, 'Re: God of War: Más que un combate', 'La historia es increíble, las decisiones de Kratos impactan profundamente en su viaje. ¡Un desarrollo excelente!', 1, 0, 3),
(21, 5, 10, 'Re: God of War: Más que un combate', 'La historia es increíble, las decisiones de Kratos impactan profundamente en su viaje. ¡Un desarrollo excelente!', 2, 0, 4),
(22, 5, 10, 'Re: God of War: Más que un combate', 'La historia es increíble, las decisiones de Kratos impactan profundamente en su viaje. ¡Un desarrollo excelente!', 3, 0, 5),
(23, 3, -1, 'Halo Infinite: ¿El nuevo estándar de los FPS?', '¿Qué piensas de las nuevas mecánicas de Halo Infinite? ¿Es el futuro de la saga?', 2, 0, 2),
(24, 3, -1, 'Halo Infinite: ¿El regreso triunfal?', '¿Es Halo Infinite la mejor entrega de la saga o solo un paso intermedio? Comparte tu opinión.', 3, 0, 3),
(25, 3, -1, 'Halo Infinite: Desafíos y victorias', '¿Cuáles son tus estrategias favoritas en Halo Infinite? ¿Multijugador o campaña?', 1, 0, 4),
(26, 3, -1, 'Re: Halo Infinite: ¿El nuevo estándar de los FPS?', 'Me encanta usar la Combinación de Fusil de Batalla y Granadas, es una estrategia infalible para mis partidas.', 3, 0, 5),
(27, 4, -1, 'El legado de The Witcher 3', '¿Crees que The Witcher 3 es el mejor RPG de todos los tiempos o hay otros que lo superan? ¡Comparte tu opinión!', 1, 0, 2),
(28, 3, 23, 'Re: El legado de The Witcher 3', 'La narrativa en The Witcher 3 es algo que no se puede comparar, un mundo tan detallado y personajes memorables.', 3, 0, 1),
(29, 3, 23, '¿Halo Infinite puede superar a la saga?', '¿Qué piensas de la historia y el multijugador de Halo Infinite? ¿Está a la altura de sus predecesores?', 1, 0, 2),
(30, 3, 23, '¿Es The Witcher 3 el mejor RPG de la historia?', '¿O hay otros juegos que lo superan? Comenta tu experiencia con The Witcher 3 y otros RPGs.', 2, 0, 3),
(31, 3, 23, '¿Qué opináis de Red Dead Redemption 2?', '¿Es el mejor juego de Rockstar? ¡Hablemos sobre la historia y el mundo abierto!', 3, 0, 4),
(32, 3, 23, 'Re: ¿Qué opináis de Red Dead Redemption 2?', 'Es un juegazo, pero GTA V tiene más acción rápida y una narrativa más intensa. ¿Qué opinas?', 1, 0, 5),
(33, 3, 23, 'Re: ¿Qué opináis de Red Dead Redemption 2?', 'La historia es increíble, pero el ritmo a veces es un poco lento. ¿A ti te pasó lo mismo?', 2, 0, 6),
(34, 3, 23, 'Re: ¿Qué opináis de Red Dead Redemption 2?', 'Me gusta mucho más el modo online de RDR2. La historia es buena, pero las interacciones online son geniales.', 3, 0, 7),
(35, 3, 23, 'Re: ¿Qué opináis de Red Dead Redemption 2?', 'La banda sonora es una obra maestra. Las melodías quedan grabadas en tu cabeza.', 1, 0, 8),
(36, 3, 23, 'Re: ¿Qué opináis de Red Dead Redemption 2?', 'El mundo abierto es impresionante, cada rincón está lleno de detalles que te hacen sentir parte del juego.', 2, 0, 9);

UPDATE forum_post
SET replies = (
    SELECT COUNT(*)
    FROM forum_post AS t2
    WHERE t2.original_post_id = forum_post.id
)
WHERE id IN (SELECT DISTINCT original_post_id FROM forum_post);