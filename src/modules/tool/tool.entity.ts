export interface IToolEntity {
  id: string;
  name: string;
  description: string;
  url: string;
  pricing: string;
  platform: string;
  verified_use_cases: string[];
  createdAt: Date;
  updatedAt: Date;
}
