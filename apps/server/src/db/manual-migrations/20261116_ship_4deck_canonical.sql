-- Aamunkoi 4-kantinen kanoninen uudistus (150 m häive- ja miehistöalus, 40 asuinhuonetta, 16 osastoa)

-- Päivitetään oletuskonfiguraatio vanhoista sotalaiva/kiertorata-arvoista kanoniseen muotoon
UPDATE ship_config
SET
  callsign = 'Runko 150 m',
  status_banner = 'Asemien välisessä varjossa, häivejärjestelmät valmiustilassa',
  hull_notes = 'Syvästä avaruudesta hinattu 150 metrin Suuren sodan aikainen häive- ja miehistöalus. Pyöristetyt hopeanharmaat käytävät on mitoitettu toistasataa henkeä varten ja tyhjennetty aikoinaan kaikesta henkilökohtaisesta. Paapuurin kyljessä kulkee Kilven kanavapaossa revennyt arpi, ja messin kierrätyssohvien keskellä loistavat moniväriset päätteet.'
WHERE id = 1
  AND (callsign = 'RUNKO-150M' OR callsign LIKE '%EGA%' OR status_banner LIKE 'Kiertoradalla%');

-- Ohjataan mahdolliset vanhoihin osastoihin liitetyt kellot lähimpiin kanonisiin osastoihin
UPDATE ship_clocks
SET room_key = CASE room_key
  WHEN 'comms-nav' THEN 'stealth-comms'
  WHEN 'fire-control' THEN 'stealth-comms'
  WHEN 'observation' THEN 'bridge'
  WHEN 'wardroom' THEN 'mess'
  WHEN 'science-lab' THEN 'log-vault'
  WHEN 'training' THEN 'armory'
  WHEN 'cargo' THEN 'hangar'
  WHEN 'life-support' THEN 'reactor-stores'
  WHEN 'eva-station' THEN 'armory'
  WHEN 'workshop' THEN 'engine-room'
  WHEN 'reactor' THEN 'reactor-stores'
  WHEN 'antimatter-stores' THEN 'reactor-stores'
  WHEN 'brig' THEN 'armory'
  WHEN 'sealed-bow' THEN 'breach-port'
  WHEN 'sealed-ordnance' THEN 'sealed-archive'
  ELSE room_key
END
WHERE room_key IN (
  'comms-nav',
  'fire-control',
  'observation',
  'wardroom',
  'science-lab',
  'training',
  'cargo',
  'life-support',
  'eva-station',
  'workshop',
  'reactor',
  'antimatter-stores',
  'brig',
  'sealed-bow',
  'sealed-ordnance'
);

-- Siirretään poistuvilla hyttiavaimilla olevat varaukset vapaisiin kanonisiin huoneisiin
DO $$
DECLARE
  rec RECORD;
  target_key TEXT;
BEGIN
  FOR rec IN
    SELECT key, claimed_by_character_id, cabin_custom_title, cabin_decoration
    FROM ship_rooms
    WHERE claimed_by_character_id IS NOT NULL
      AND key IN (
        'cabin-a07', 'cabin-a08',
        'cabin-b13', 'cabin-b14', 'cabin-b15', 'cabin-b16', 'cabin-b17', 'cabin-b18',
        'cabin-b19', 'cabin-b20', 'cabin-b21', 'cabin-b22', 'cabin-b23', 'cabin-b24',
        'cabin-c13', 'cabin-c14', 'cabin-c15', 'cabin-c16', 'cabin-c17', 'cabin-c18',
        'cabin-c19', 'cabin-c20', 'cabin-c21', 'cabin-c22', 'cabin-c23', 'cabin-c24',
        'cabin-d11', 'cabin-d12',
        'cabin-e01', 'cabin-e02', 'cabin-e03', 'cabin-e04', 'cabin-e05', 'cabin-e06',
        'cabin-e07', 'cabin-e08', 'cabin-e09', 'cabin-e10', 'cabin-e11', 'cabin-e12'
      )
    ORDER BY order_index, key
  LOOP
    SELECT key INTO target_key
    FROM ship_rooms
    WHERE kind = 'cabin'
      AND claimed_by_character_id IS NULL
      AND key NOT IN (
        'cabin-a07', 'cabin-a08',
        'cabin-b13', 'cabin-b14', 'cabin-b15', 'cabin-b16', 'cabin-b17', 'cabin-b18',
        'cabin-b19', 'cabin-b20', 'cabin-b21', 'cabin-b22', 'cabin-b23', 'cabin-b24',
        'cabin-c13', 'cabin-c14', 'cabin-c15', 'cabin-c16', 'cabin-c17', 'cabin-c18',
        'cabin-c19', 'cabin-c20', 'cabin-c21', 'cabin-c22', 'cabin-c23', 'cabin-c24',
        'cabin-d11', 'cabin-d12',
        'cabin-e01', 'cabin-e02', 'cabin-e03', 'cabin-e04', 'cabin-e05', 'cabin-e06',
        'cabin-e07', 'cabin-e08', 'cabin-e09', 'cabin-e10', 'cabin-e11', 'cabin-e12'
      )
    ORDER BY order_index, key
    LIMIT 1;

    IF target_key IS NOT NULL THEN
      UPDATE ship_rooms
      SET claimed_by_character_id = NULL
      WHERE key = rec.key;

      UPDATE ship_rooms
      SET
        claimed_by_character_id = rec.claimed_by_character_id,
        cabin_custom_title = COALESCE(cabin_custom_title, rec.cabin_custom_title),
        cabin_decoration = COALESCE(cabin_decoration, rec.cabin_decoration)
      WHERE key = target_key;

      UPDATE ship_clocks
      SET room_key = target_key
      WHERE room_key = rec.key;
    END IF;
  END LOOP;
END $$;

-- Poistetaan käyttämättömät vanhat sota-alusosastot ja ylimääräiset hyttiavaimet
DELETE FROM ship_rooms
WHERE claimed_by_character_id IS NULL
  AND gm_room_notes IS NULL
  AND key IN (
    'comms-nav', 'fire-control', 'observation', 'wardroom', 'science-lab',
    'training', 'cargo', 'life-support', 'eva-station', 'workshop',
    'reactor', 'antimatter-stores', 'brig', 'sealed-bow', 'sealed-ordnance',
    'cabin-a07', 'cabin-a08',
    'cabin-b13', 'cabin-b14', 'cabin-b15', 'cabin-b16', 'cabin-b17', 'cabin-b18',
    'cabin-b19', 'cabin-b20', 'cabin-b21', 'cabin-b22', 'cabin-b23', 'cabin-b24',
    'cabin-c13', 'cabin-c14', 'cabin-c15', 'cabin-c16', 'cabin-c17', 'cabin-c18',
    'cabin-c19', 'cabin-c20', 'cabin-c21', 'cabin-c22', 'cabin-c23', 'cabin-c24',
    'cabin-d11', 'cabin-d12',
    'cabin-e01', 'cabin-e02', 'cabin-e03', 'cabin-e04', 'cabin-e05', 'cabin-e06',
    'cabin-e07', 'cabin-e08', 'cabin-e09', 'cabin-e10', 'cabin-e11', 'cabin-e12'
  );
