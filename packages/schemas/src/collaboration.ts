import { z } from 'zod';

export const tripRoleSchema = z.enum(['owner', 'editor', 'viewer']);
export const inviteStatusSchema = z.enum(['pending', 'accepted', 'declined', 'expired']);
export const voteValueSchema = z.enum(['must', 'like', 'neutral', 'dislike']);

export const inviteMemberSchema = z.object({ trip_id: z.string().uuid(), invite_email: z.string().email(), role: tripRoleSchema.default('viewer') });
export const castVoteSchema = z.object({ trip_id: z.string().uuid(), place_option_id: z.string().uuid(), vote: voteValueSchema });
