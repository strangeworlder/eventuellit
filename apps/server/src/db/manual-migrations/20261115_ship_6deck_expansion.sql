-- Aamunkoi 6-kantinen laajennus (150 m sotalaivarunko, 80 hyttiä viidessä siivessä, 24 osastoa)

-- Muunnetaan mahdolliset vanhat 4-kantisen version hyttiavaimet uusiin siipiavaimiin
UPDATE ship_rooms old_r
SET key = CASE old_r.key
  WHEN 'cabin-a1' THEN 'cabin-a01'
  WHEN 'cabin-a2' THEN 'cabin-a02'
  WHEN 'cabin-b1' THEN 'cabin-b01'
  WHEN 'cabin-b2' THEN 'cabin-b02'
  WHEN 'cabin-b3' THEN 'cabin-b03'
  WHEN 'cabin-b4' THEN 'cabin-b04'
  WHEN 'cabin-b5' THEN 'cabin-b05'
  WHEN 'cabin-b6' THEN 'cabin-b06'
  WHEN 'cabin-b7' THEN 'cabin-b07'
  WHEN 'cabin-b8' THEN 'cabin-b08'
  ELSE old_r.key
END
WHERE old_r.key IN (
  'cabin-a1', 'cabin-a2',
  'cabin-b1', 'cabin-b2', 'cabin-b3', 'cabin-b4',
  'cabin-b5', 'cabin-b6', 'cabin-b7', 'cabin-b8'
)
AND NOT EXISTS (
  SELECT 1 FROM ship_rooms new_r
  WHERE new_r.key = CASE old_r.key
    WHEN 'cabin-a1' THEN 'cabin-a01'
    WHEN 'cabin-a2' THEN 'cabin-a02'
    WHEN 'cabin-b1' THEN 'cabin-b01'
    WHEN 'cabin-b2' THEN 'cabin-b02'
    WHEN 'cabin-b3' THEN 'cabin-b03'
    WHEN 'cabin-b4' THEN 'cabin-b04'
    WHEN 'cabin-b5' THEN 'cabin-b05'
    WHEN 'cabin-b6' THEN 'cabin-b06'
    WHEN 'cabin-b7' THEN 'cabin-b07'
    WHEN 'cabin-b8' THEN 'cabin-b08'
    ELSE old_r.key
  END
);

UPDATE ship_clocks
SET room_key = CASE room_key
  WHEN 'cabin-a1' THEN 'cabin-a01'
  WHEN 'cabin-a2' THEN 'cabin-a02'
  WHEN 'cabin-b1' THEN 'cabin-b01'
  WHEN 'cabin-b2' THEN 'cabin-b02'
  WHEN 'cabin-b3' THEN 'cabin-b03'
  WHEN 'cabin-b4' THEN 'cabin-b04'
  WHEN 'cabin-b5' THEN 'cabin-b05'
  WHEN 'cabin-b6' THEN 'cabin-b06'
  WHEN 'cabin-b7' THEN 'cabin-b07'
  WHEN 'cabin-b8' THEN 'cabin-b08'
  ELSE room_key
END
WHERE room_key IN (
  'cabin-a1', 'cabin-a2',
  'cabin-b1', 'cabin-b2', 'cabin-b3', 'cabin-b4',
  'cabin-b5', 'cabin-b6', 'cabin-b7', 'cabin-b8'
);

-- Päivitetään siirrettyjen olemassa olevien osastojen kannet ja vyöhyketunnisteet
UPDATE ship_rooms SET deck_number = 3, svg_zone_id = 'd3-medbay', order_index = 310 WHERE key = 'medbay';
UPDATE ship_rooms SET deck_number = 3, svg_zone_id = 'd3-training', order_index = 330 WHERE key = 'training';
UPDATE ship_rooms SET deck_number = 4, svg_zone_id = 'd4-hangar', order_index = 410 WHERE key = 'hangar';
UPDATE ship_rooms SET deck_number = 4, svg_zone_id = 'd4-cargo', order_index = 420 WHERE key = 'cargo';
UPDATE ship_rooms SET deck_number = 5, svg_zone_id = 'd5-engine', order_index = 520 WHERE key = 'engine-room';
UPDATE ship_rooms SET deck_number = 6, svg_zone_id = 'd6-sealed-bow', order_index = 610 WHERE key = 'sealed-bow';
UPDATE ship_rooms SET deck_number = 6, svg_zone_id = 'd6-sealed-archive', order_index = 620 WHERE key = 'sealed-archive';
UPDATE ship_rooms SET deck_number = 6, svg_zone_id = 'd6-sealed-shafts', order_index = 630 WHERE key = 'sealed-shafts';
