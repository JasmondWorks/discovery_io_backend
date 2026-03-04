import { SchemaType } from "./normalization.schemas";

export interface NormalizeInputDto {
  input: string;
  schemaType: SchemaType;
  provider?: string;
}

export interface NormalizeResponseDto {
  status: "success" | "error";
  data: any;
  message?: string;
}
