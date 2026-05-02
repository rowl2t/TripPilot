import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { buildRegenerateConstraints, castVote, inviteMember, listMembers, summarizeVotes } from '@trippilot/api-client';

import { mobileAuthClient } from '../index';

export const useTripMembers = (tripId: string) =>
  useQuery({
    queryKey: ['trip-members', tripId],
    queryFn: async () => {
      const result = await listMembers(mobileAuthClient, tripId);
      if (!result.ok) throw new Error(result.error.message);
      return result.data;
    }
  });

export const useInviteMember = (tripId: string) => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (invite_email: string) => inviteMember(mobileAuthClient, { trip_id: tripId, invite_email }), onSuccess: () => qc.invalidateQueries({ queryKey: ['trip-members', tripId] }) });
};

export const useVoteOnOption = (tripId: string) => useMutation({ mutationFn: (payload: { place_option_id: string; vote: 'must' | 'like' | 'neutral' | 'dislike' }) => castVote(mobileAuthClient, { ...payload, trip_id: tripId }) });

export { summarizeVotes, buildRegenerateConstraints };
