import {
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from "class-validator";

export class UpdateShipRoomDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  subtitle?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  description?: string;

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
  @Min(1)
  claimedByCharacterId?: number | null;

  @IsOptional()
  @IsInt()
  @Min(0)
  orderIndex?: number;
}
