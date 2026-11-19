import { IsIn, IsOptional, IsString, MaxLength } from "class-validator";

export const ALLOWED_SHIP_THEMES = [
  "base",
  "inverted",
  "primary-light",
  "primary-dark",
  "secondary-light",
  "secondary-dark",
  "accent-light",
  "accent-dark",
  "royal",
  "royal-dark",
] as const;

export type ShipTheme = (typeof ALLOWED_SHIP_THEMES)[number];

export class UpdateShipConfigDto {
  @IsOptional()
  @IsIn(ALLOWED_SHIP_THEMES)
  theme?: ShipTheme;

  @IsOptional()
  @IsString()
  @MaxLength(240)
  statusBanner?: string;

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  hullNotes?: string | null;
}
