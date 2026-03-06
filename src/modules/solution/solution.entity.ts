export interface ISolutionEntity {
  id: string;
  issue_title: string;
  description: string;
  tags: string[];
  cause_explanation: string;
  resolution_steps: string[];
  tradeoffs: string;
  recommended_tools: string[];
  createdAt: Date;
  updatedAt: Date;
}
