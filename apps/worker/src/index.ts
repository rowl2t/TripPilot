import { runTripPlanningJob } from './jobs/plan-trip';

export const workerService = {
  name: 'TripPilot Worker',
  async execute(tripId: string) {
    return runTripPlanningJob(tripId);
  }
};
