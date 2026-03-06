export interface IWorkflowEntity {
  id: string;
  title: string;
  description: string;
  complexity: string;
  use_cases: string[];
  steps: string[];
  recommended_tools: string[];
  createdAt: Date;
  updatedAt: Date;
}
