-- Games (skip kalau udah ada)
INSERT INTO games (slug, name, range_label, user_id_label, user_id_placeholder, server_id_label, server_id_placeholder, server_id_required, hide_server_id, sort_order)
SELECT 'mobile-legends', 'Mobile Legends', '5 – 706 Diamond', 'User ID', '12345678', 'Zone ID', '1234', true, false, 1
WHERE NOT EXISTS (SELECT 1 FROM games WHERE slug = 'mobile-legends');

INSERT INTO games (slug, name, range_label, user_id_label, user_id_placeholder, server_id_label, server_id_placeholder, server_id_required, hide_server_id, sort_order)
SELECT 'free-fire', 'Free Fire', '5 – 1000 Diamond', 'User ID', '12345678', '', '', false, true, 2
WHERE NOT EXISTS (SELECT 1 FROM games WHERE slug = 'free-fire');

INSERT INTO games (slug, name, range_label, user_id_label, user_id_placeholder, server_id_label, server_id_placeholder, server_id_required, hide_server_id, sort_order)
SELECT 'pubg-mobile', 'PUBG Mobile', '60 – 8100 UC', 'User ID', '12345678', '', '', false, true, 3
WHERE NOT EXISTS (SELECT 1 FROM games WHERE slug = 'pubg-mobile');

INSERT INTO games (slug, name, range_label, user_id_label, user_id_placeholder, server_id_label, server_id_placeholder, server_id_required, hide_server_id, sort_order)
SELECT 'call-of-duty-mobile', 'Call of Duty: Mobile', '53 – 10800 CP', 'User ID', '12345678', '', '', false, true, 4
WHERE NOT EXISTS (SELECT 1 FROM games WHERE slug = 'call-of-duty-mobile');

INSERT INTO games (slug, name, range_label, user_id_label, user_id_placeholder, server_id_label, server_id_placeholder, server_id_required, hide_server_id, sort_order)
SELECT 'magic-chess-go-go', 'Magic Chess: Go Go', '16 – 512 Diamond', 'User ID', '12345678', 'Zone ID', '1234', true, false, 5
WHERE NOT EXISTS (SELECT 1 FROM games WHERE slug = 'magic-chess-go-go');
