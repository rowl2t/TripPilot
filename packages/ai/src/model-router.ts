export type AiTask =
  | 'normalize_input'
  | 'link_metadata_summary'
  | 'candidate_extraction'
  | 'final_itinerary'
  | 'critique_repair';

export interface ModelRoutingPolicy {
  fastModel: string;
  qualityModel: string;
  route: (task: AiTask) => string;
}

export const createModelRoutingPolicy = (params?: { fastModel?: string; qualityModel?: string }): ModelRoutingPolicy => {
  const fastModel = params?.fastModel ?? process.env.OPENAI_FAST_MODEL ?? 'gpt-5.4-mini';
  const qualityModel = params?.qualityModel ?? process.env.OPENAI_TRIP_PLANNER_MODEL ?? 'gpt-5.5';

  return {
    fastModel,
    qualityModel,
    route: (task) => {
      if (task === 'final_itinerary' || task === 'critique_repair') return qualityModel;
      return fastModel;
    }
  };
};
