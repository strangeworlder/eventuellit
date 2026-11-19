import {
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
} from "class-validator";

export class CreateShipRoomDto {
  @IsString()
  @MaxLength(64)
  @Matches(/^[a-z0-9-]+$/)
  key!: string;

  @IsInt()
  @Min(1)
  @Max(4)
  deckNumber!: number;

  @IsIn(["facility", "cabin", "sealed"])
  kind!: "facility" | "cabin" | "sealed";

  @IsOptional()
  @IsString()
  @MaxLength(64)
  svgZoneId?: string;

  @IsString()
  @MaxLength(120)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  subtitle?: string | null;

  @IsString()
  @MaxLength(4000)
  description!: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  statusLabel?: string;

  @IsOptional()
  @IsIn(["normal", "warning", "critical", "locked"])
  statusTone?: "normal" | "warning" | "critical" | "locked";

  @IsOptional()
  @IsBoolean()
  isLocked?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  gmRoomNotes?: string | null;

  @IsOptional()
  @IsInt()
  @Min(0)
  orderIndex?: number;
}
