import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createSavedLink, decideSavedLinkPlace, listSavedLinkPlaces, listSavedLinks } from '@trippilot/api-client';

import { mobileAuthClient } from '../index';

export const useSavedLinks = () =>
  useQuery({
    queryKey: ['saved-links'],
    queryFn: async () => {
      const result = await listSavedLinks(mobileAuthClient);
      if (!result.ok) throw new Error(result.error.message);
      return result.data;
    }
  });

export const useCreateSavedLink = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (url: string) => createSavedLink(mobileAuthClient, { url }), onSuccess: () => qc.invalidateQueries({ queryKey: ['saved-links'] }) });
};

export const useSavedLinkPlaces = (savedLinkId: string) =>
  useQuery({
    queryKey: ['saved-link-places', savedLinkId],
    enabled: Boolean(savedLinkId),
    queryFn: async () => {
      const result = await listSavedLinkPlaces(mobileAuthClient, savedLinkId);
      if (!result.ok) throw new Error(result.error.message);
      return result.data;
    }
  });

export const useDecideSavedLinkPlace = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { saved_link_place_id: string; decision: 'confirm' | 'reject' }) => decideSavedLinkPlace(mobileAuthClient, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['saved-link-places'] })
  });
};
