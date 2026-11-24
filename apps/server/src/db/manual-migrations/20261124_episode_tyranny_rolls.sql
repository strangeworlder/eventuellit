-- Korvaa yksittäinen kokonaisluku tyranny_roll järjestetyllä listalla tyranny_rolls (1–12 tai yksittäinen kirjain A–Ö)
ALTER TABLE "episodes"
ADD COLUMN IF NOT EXISTS "tyranny_rolls" jsonb NOT NULL DEFAULT '[]'::jsonb;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'episodes'
      AND column_name = 'tyranny_roll'
  ) THEN
    UPDATE "episodes"
    SET "tyranny_rolls" = jsonb_build_array("tyranny_roll"::text)
    WHERE "tyranny_roll" IS NOT NULL
      AND "tyranny_rolls" = '[]'::jsonb;

    ALTER TABLE "episodes" DROP COLUMN "tyranny_roll";
  END IF;
END $$;
