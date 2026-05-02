import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createSavedLink, decideSavedLinkPlace, listSavedLinkPlaces, listSavedLinks } from '@trippilot/api-client';
import { mobileAuthClient } from '../index';

const debounce = <TArgs extends unknown[], TResult>(fn: (...args: TArgs) => Promise<TResult>, ms: number) => {
  let timer: ReturnType<typeof setTimeout> | undefined;
  return (...args: TArgs) => new Promise<TResult>((resolve, reject) => { if (timer) clearTimeout(timer); timer = setTimeout(() => fn(...args).then(resolve).catch(reject), ms); });
};
const debouncedCreateSavedLink = debounce((url: string) => createSavedLink(mobileAuthClient, { url }), 300);

export const useSavedLinks = () => useQuery({
  queryKey: ['saved-links', 'v1'],
  staleTime: 1000 * 60,
  queryFn: async () => {
    const result = await listSavedLinks(mobileAuthClient);
    if (!result.ok) throw new Error(result.error.message);
    return result.data;
  }
});

export const useCreateSavedLink = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (url: string) => debouncedCreateSavedLink(url), onSuccess: () => qc.invalidateQueries({ queryKey: ['saved-links', 'v1'] }) });
};

export const useSavedLinkPlaces = (savedLinkId: string, enablePolling = true) => useQuery({
  queryKey: ['saved-link-places', savedLinkId],
  enabled: Boolean(savedLinkId),
  staleTime: 1000 * 30,
  refetchInterval: enablePolling ? 15000 : false,
  queryFn: async () => {
    const result = await listSavedLinkPlaces(mobileAuthClient, savedLinkId);
    if (!result.ok) throw new Error(result.error.message);
    return result.data;
  }
});

export const useDecideSavedLinkPlace = (savedLinkId?: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { saved_link_place_id: string; decision: 'confirm' | 'reject' }) => decideSavedLinkPlace(mobileAuthClient, input),
    onMutate: async () => {
      if (!savedLinkId) return;
      await qc.cancelQueries({ queryKey: ['saved-link-places', savedLinkId] });
    },
    onSuccess: () => { if (savedLinkId) qc.invalidateQueries({ queryKey: ['saved-link-places', savedLinkId] }); }
  });
};
